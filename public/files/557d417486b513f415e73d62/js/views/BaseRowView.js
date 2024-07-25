/*global define */

define([
	'marionette',
	'templates',
    'underscore',
	'models/project',
	'appmodules/viewmodules/customData'
], function (Marionette, templates, _, Project, customData) {
	'use strict';

	return Marionette.ItemView.extend({
		initialize: function(){
			this.projects = [];
            this.$el.attr("pid", this.model.get('_id'));
			if(this.model.get('inProjects') != '' &&
			typeof this.model.get('inProjects') != 'undefined'
			&& this.model.get('inProjects').length > 0){
				this.$el.attr("pid_project", this.model.get('inProjects')[0]);
			}else{
				this.$el.attr("pid_project", '');
			}
            this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
            this.$el.bind("drop", _.bind(this._dropEvent, this));

            this._draghoverClassAdded = false;
            this._draghoverClassAddedFile = false;
            Project.selectedVieww = "";
			this.model.set('friendsThis',[]);
			this.model.set('colorLighter',this.ColorLuminance(this.model.get("color"), 0.2));
			
			
			
			if(typeof app.userConnected != 'undefined' && 
				typeof app.userConnected.data2 != 'undefined'){
				//this.friendsAddedV(app.userConnected.data2.friends);
			}
			this.listenTo(this.model,'change:position',this.onAfterDropInHere);
			this.listenTo(this.model,'change',this.rerenderEverything);
        },
		rerenderEverything: function(){
			//this.rerenderTasks();
			var initiateUpdate = this.model.get('initiateUpdate');
			if(typeof initiateUpdate != "undefined" && initiateUpdate != "" && initiateUpdate){
					var fhtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
					var fshared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
					$("#shared_count").text(fshared_in.count);
					$("#friendsHtmlV").html(fhtmlV);
					$("#shared_inHtml").html(fshared_in.html);
					
					var html_files = this.getFilesHtmlAndCount();
					$("#files_count").text(html_files.count);
					$("#htmlfiles_inner").html(html_files.html);
					
					/*var tasksN = this.getTasksView();
					var tasksNumber = this.model.get('tasks').filter(function(e){return e}).length;
					$("#tasksViewAllIn").html(tasksN);
					$("#tasksNumb").text(tasksNumber);*/
					for(var i=0; i < customData.length; i++){
						customData[i].dataRerender();
					}
					
					var textModel = this.model.get('text');
					$(".textarea_title").val(textModel);
					
					var nameText = this.model.get('name');
					$(".description_textarea").val(nameText);
					
					var colorText = this.model.get('color');
					$(".color_input_data").val(colorText);
					
					var friendsThereText = this.model.get('friendsThere');
					$(".who_is_working_input").val(friendsThereText);
					this.model.set('initiateUpdate', false);
			}
		},
		ColorLuminance: function(hex, lum) {

			// validate hex string
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
			}
			lum = lum || 0;

			// convert to decimal and change luminosity
			var rgb = "#", c, i;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i*2,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
				rgb += ("00"+c).substr(c.length);
			}

			return rgb;
		},
        onpprojectMain: function(e){
			if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
            if(this.model.get('isHeader')){
                return;
            }
				if(this.model.get('isProject')){
					window.location = '#/project/'+this.model.get('_id');
				}else{
					this.model.set('id', this.model.get('_id'));
					var myModel = this.model;
					this.editDialog(myModel);
				}
			e.stopImmediatePropagation();
			e.stopPropagation();
            }
        },
        onprojectsEdit: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                var myModel = this.model;
                this.editDialog(myModel);
				e.stopImmediatePropagation();
				e.stopPropagation();
            }
        },
		setCommentsColData: function(){
			if(typeof this.commentsCol == "undefined"){
				app.CurrentCommentsView = this;
				var commentsCol = app.getCommentsCol(this.model.get('_id'));
				if(commentsCol === ''){
					commentsCol = new Project();
					app.vent.trigger('add:cachedComments:resource', {_id:this.model.get('_id'),data: commentsCol});
					commentsCol.url = '/comments/'+this.model.get('_id')+'/'+0;
				}
				this.commentsCol = commentsCol;
			}
		},
		rerenderComments: function(){
			var commentsCol = this.commentsCol;
				commentsCol.fetch().done(function(){
					setTimeout(function(){
						var comments = this.commentsCol.get('messages');
						var getCommObj = this.getCommentsHistoryObj(comments);
						var commHtml = getCommObj.commHtml;
						var historyHtml = getCommObj.historyHtml;
						var commCount = getCommObj.commCount;
						var historyyCount = getCommObj.historyyCount;
						var canAddComment = false;
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate" || this.model.get("parentvisibility") == "editcommentprivate" || this.model.get("parentvisibility") == "editcommentpublic"){
							canAddComment = true;
						}
						
						$("#history_count").html(" (<span id='history_count_inner'>"+historyyCount+"</span>)");
						$("#comments_count").html(" (<span id='comments_count_inner'>"+commCount+"</span>)");
						/*$('#historyOfT').html(historyHtml);*/
						//$('#comments_inner_all').html(commHtml);
						if(commHtml != ""){
							$('#comments_inner_all').html(commHtml);
						}else{
							$('#comments_inner_all').html(app.noRecordsInIt());
						}
						if(historyHtml != ""){
							$('.history_info_view').html(historyHtml);
						}else{
							$('.history_info_view').html(app.noRecordsInIt());
						}
						
						var writeAComment = '<div style="clear:both;"></div>';
						if(canAddComment){
							writeAComment += '<div>';
							writeAComment += '<textarea class="commentsWidthAll" id="commentAddminiEditView"></textarea>';
							writeAComment += '</div>';
							writeAComment += '<div><button class="buttonChange general_button" id="commentSubmitminiEditView" data-pid="'+commentsCol.get('_id')+'">'+app.translate('Add comment')+'</button></div>';
						}
						
						$('#comments_add_more').html(writeAComment);
					}.bind(this), 0);
					
				}.bind(this));
		},
		escapeHtml: function(unsafe) {
			return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
		},
		getTimeNow: function(){
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var seconds = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(seconds<10){
					seconds='0'+seconds
				} 
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+seconds;
				return today;
		},
		setorRemoveButtonChangeActiveClass: function(id){
			var hasClass = $(id).hasClass('buttonChangeActive');
			$('.buttonChange').removeClass('buttonChangeActive');
			if(!hasClass){
				$(id).addClass('buttonChangeActive');
			}
		},
/*		getTasksViewButtons: function(){
			var tasksHtml = '';
			tasksHtml += '<div>';
			tasksHtml += '	<button id="add_task_edit_view" class="buttonChange">'+app.translate("Add From To")+'</button>';
			tasksHtml += '	<button id="add_task_to_edit_view" class="buttonChange">'+app.translate("Add To")+'</button>';
			tasksHtml += '	<button id="add_task_estimate_edit_view" class="buttonChange">'+app.translate("Add only estimate")+'</button>';
			tasksHtml += '	<button id="add_task_reccurence_edit_view" class="buttonChange">'+app.translate("Add recurrence")+'</button>';
			tasksHtml += '	<button id="save_task_edit_view" style="display:none;" class="buttonChange">'+app.translate("Save")+'</button>';
			tasksHtml += '	<div id="add_tasks_new_view"></div>';
			tasksHtml += '</div>';
			return tasksHtml;
		},*/
		/*saveTasks: function(){
			var th = this;
			$( ".addOneTaskToIt" ).each(function( index ) {
				var about = $( this ).find('.addClassTaskAbout').val();
				var from = $( this ).find('.addClassTaskFrom').val();
				var fromTime = $( this ).find('.addClassTaskFromTime').val();
				var to = $( this ).find('.addClassTaskTo').val();
				var toTime = $( this ).find('.addClassTaskToTime').val();
				var notify = $( this ).find(".addClassTaskNotify").val();
				var estimate = $( this ).find(".addClassTaskEstimate").val();

			  if(about != '' && from != '' && fromTime != '' && to != '' && toTime!= '' ){
				var myModel = th.model;
				myModel.set('id', myModel.get('_id'));
				var taskObj = {estimate:estimate, date:th.getTimeNow(), about:about, from:from, to:to, fromTime:fromTime, toTime:toTime,notify:notify};
				myModel.set('TaskAdd',taskObj);
				myModel.url = '/projectTasks/'+myModel.get('_id');
				myModel.save();
				myModel.set('TaskAdd','');
				var tasks = myModel.get('tasks');
				tasks.push(taskObj);
				$('#add_tasks_new_view').html('');
				//th.rerenderTasks();
			  }
			});
			$( ".addOneTaskToItOnlyOneReccurence" ).each(function( index ) {
				var about = $( this ).find('.addClassTaskAbout').val();
				var estimate = $( this ).find(".addClassTaskToOneTimeEstimate").val();
				var notify = $( this ).find(".addClassTaskOneTimeNotify").val();
				
				var monday = $( this ).find(".addClassTaskOneTimeMonday").is(':checked');
				var tuesday = $( this ).find(".addClassTaskOneTimeTuesday").is(':checked');
				var wednesday = $( this ).find(".addClassTaskOneTimeWednesday").is(':checked');
				var thursday = $( this ).find(".addClassTaskOneTimeThursday").is(':checked');
				var friday = $( this ).find(".addClassTaskOneTimeFriday").is(':checked');
				var saturday = $( this ).find(".addClassTaskOneTimeSaturday").is(':checked');
				var sunday = $( this ).find(".addClassTaskOneTimeSunday").is(':checked');
				var timeDtt = $( this ).find(".addClassTaskTime").val();
				
				var reccur = '';
				if(monday){ reccur += '1_'; }
				if(tuesday){ reccur += '2_'; }
				if(wednesday){ reccur += '3_'; }
				if(thursday){ reccur += '4_'; }
				if(friday){ reccur += '5_'; }
				if(saturday){ reccur += '6_'; }
				if(sunday){ reccur += '0_'; }
				if(reccur != ''){
					reccur = 'W'+reccur+','+timeDtt;
				}
			  if(about != '' && estimate!= '' && reccur!= ''){
				var myModel = th.model;
				var taskObj = {reccurence:reccur, estimate:estimate, date:th.getTimeNow(), about:about, from:'', to:'', fromTime:'', toTime:'',notify:notify};
				myModel.set('id', myModel.get('_id'));
				myModel.set('TaskAdd',taskObj);
				myModel.url = '/projectTasks/'+myModel.get('_id');
				myModel.save();
				myModel.set('TaskAdd','');
				var tasks = myModel.get('tasks');
				tasks.push(taskObj);
				//th.render();
				$('#add_tasks_new_view').html('');
				//th.rerenderTasks();
			  }
			});
			$( ".addOneTaskToItOnlyOneEstimate" ).each(function( index ) {
				var about = $( this ).find('.addClassTaskAbout').val();
				var estimate = $( this ).find(".addClassTaskToOneTimeEstimate").val();
			  if(about != '' && estimate!= '' ){
				var myModel = th.model;
				var taskObj = {estimate:estimate, date:th.getTimeNow(), about:about, from:'', to:'', fromTime:'', toTime:'',notify:''};
				myModel.set('id', myModel.get('_id'));
				myModel.set('TaskAdd',taskObj);
				myModel.url = '/projectTasks/'+myModel.get('_id');
				myModel.save();
				myModel.set('TaskAdd','');
				var tasks = myModel.get('tasks');
				tasks.push(taskObj);
				//th.render();
				$('#add_tasks_new_view').html('');
				//th.rerenderTasks();
			  }
			});
			$( ".addOneTaskToItOnlyOne" ).each(function( index ) {
				var about = $( this ).find('.addClassTaskAbout').val();
				var to = $( this ).find('.addClassTaskToOne').val();
				var toTime = $( this ).find('.addClassTaskToOneTime').val();
				var notify = $( this ).find(".addClassTaskOneTimeNotify").val();
				var estimate = $( this ).find(".addClassTaskToOneTimeEstimate").val();
			  if(about != '' && to != '' && toTime!= '' ){
				var myModel = th.model;
				var taskObj = {estimate:estimate, date:th.getTimeNow(), about:about, from:'', to:to, fromTime:'', toTime:toTime,notify:notify};
				myModel.set('id', myModel.get('_id'));
				myModel.set('TaskAdd',taskObj);
				myModel.url = '/projectTasks/'+myModel.get('_id');
				myModel.save();
				myModel.set('TaskAdd','');
				var tasks = myModel.get('tasks');
				tasks.push(taskObj);
				//th.render();
				$('#add_tasks_new_view').html('');
				//th.rerenderTasks();
			  }
			});
		},*/
		/*addTaskRecc: function(){
			var rightNow = new Date();
			var tdate = rightNow.toISOString().slice(0,10);
			$('#save_task_edit_view').show();
			var taskNew = '<div class="addOneTaskToItOnlyOneReccurence"><input type="text" class="addClassTaskAbout" placeholder="'+app.translate('About')+'" /> '+app.translate('Notify')+': <input type="text" class="addClassTaskOneTimeNotify" value="'+app.userConnected.data2.email+'" /> '+app.translate('Estimate')+': <input type="text" class="addClassTaskToOneTimeEstimate" value="" placeholder="1h, 1d, 1w, 1m" />';
			//taskNew += 'Recurrence: <input type="text" class="addClassTaskOneTimeReccurence" value="" placeholder="C(cron expression) or W(week day,hour, minute - [0-4],17,0)" />';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeMonday" /> '+app.translate('Monday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeTuesday" />'+app.translate('Tuesday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeWednesday" />'+app.translate('Wednesday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeThursday" />'+app.translate('Thursday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeFriday" />'+app.translate('Friday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeSaturday" />'+app.translate('Saturday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeSunday" />'+app.translate('Sunday')+'</label></span>';
			taskNew += '<input type="time" class="addClassTaskTime" value="00:00" />';
			taskNew += '</div>';
			$('#add_tasks_new_view').append(taskNew);
		},
		addTaskEstim: function(){
			var rightNow = new Date();
			var tdate = rightNow.toISOString().slice(0,10);
			$('#save_task_edit_view').show();
			var taskNew = '<div class="addOneTaskToItOnlyOneEstimate"><input type="text" class="addClassTaskAbout" placeholder="'+app.translate('About')+'" /> Estimate: <input type="text" class="addClassTaskToOneTimeEstimate" value="" placeholder="1h, 1d, 1w, 1m" />';
			taskNew += '</div>';
			$('#add_tasks_new_view').append(taskNew);
		},
		addTaskTo: function(){
			var rightNow = new Date();
			var tdate = rightNow.toISOString().slice(0,10);
			$('#save_task_edit_view').show();
			var taskNew = '<div class="addOneTaskToItOnlyOne"><input type="text" class="addClassTaskAbout" placeholder="'+app.translate('About')+'" /> '+app.translate('To')+': <input type="date" class="addClassTaskToOne" value="'+tdate+'" /> <input type="time" class="addClassTaskToOneTime" value="00:00" /> Notify: <input type="text" class="addClassTaskOneTimeNotify" value="'+app.userConnected.data2.email+'" /> Estimate: <input type="text" class="addClassTaskToOneTimeEstimate" value="" placeholder="1h, 1d, 1w, 1m" />';
			taskNew += '</div>';
			$('#add_tasks_new_view').append(taskNew);
		},
		addTask: function(){
			$('#save_task_edit_view').show();
			var rightNow = new Date();
			var toNow = new Date();
			toNow.setDate(toNow.getDate() + 1);
			var todate = toNow.toISOString().slice(0,10);
			var tdate = rightNow.toISOString().slice(0,10);
			var taskNew = '<div class="addOneTaskToIt"><input type="text" class="addClassTaskAbout" placeholder="'+app.translate('About')+'" /> '+app.translate('From')+': <input type="date" class="addClassTaskFrom" value="'+tdate+'" /> <input type="time" class="addClassTaskFromTime" value="00:00" />';
			taskNew += ''+app.translate('To')+': <input type="date" class="addClassTaskTo" value="'+todate+'" /> <input type="time" class="addClassTaskToTime" value="00:00" /> Notify: <input type="text" class="addClassTaskNotify" value="'+app.userConnected.data2.email+'" /> Estimate: <input type="text" class="addClassTaskEstimate" value="" placeholder="1h, 1d, 1w, 1m" /></div>';
			$('#add_tasks_new_view').append(taskNew);
		},
		getTasksView: function(){
			var tasks = this.model.get('tasks');
			var tasksHtml = '';
				for(var i=0; i < tasks.length; i++){
					if(typeof tasks[i] != 'undefined' && tasks[i] != null){
						tasksHtml+='<div class="commentInModal" id="tasksUnId'+tasks[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						tasksHtml+= '<div>'+tasks[i].about+' <span style="font-size:12px;">'+tasks[i].date+'</span>';
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
							tasksHtml+= '<button data-date="'+tasks[i].date+'" class="background_comment removeTaskOne"><span data-date="'+tasks[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
						}
						tasksHtml+= '</div>';
						if(tasks[i].from != ''){
							tasksHtml += '<div>'+tasks[i].from+'<span style="padding-left:5px;">'+tasks[i].fromTime+'</span></div>';
						}
						if(tasks[i].to != ''){
							tasksHtml += '<div>'+tasks[i].to+'<span style="padding-left:5px;">'+tasks[i].toTime+'</span></div>';
						}
						if(tasks[i].notify != '' && tasks[i].notify != 'false' && tasks[i].notify){
							tasksHtml += '<div>'+tasks[i].notify+'</div>';
						}
						if(tasks[i].estimate != ''){
							tasksHtml += '<div>'+tasks[i].estimate+'</div>';
						}
						if(typeof tasks[i].reccurence != 'undefined' && tasks[i].reccurence != ''){
							var recc = tasks[i].reccurence;
							var reccSplit = recc.split(',');
							var dateTm = reccSplit[1];
							var dateDayz = reccSplit[0];
							var daysOfWeek = '';
							if(dateDayz.indexOf('1') > -1){ daysOfWeek += app.translate('Monday')+' '; }
							if(dateDayz.indexOf('2') > -1){ daysOfWeek += app.translate('Tuesday')+' '; }
							if(dateDayz.indexOf('3') > -1){ daysOfWeek += app.translate('Wednesday')+' '; }
							if(dateDayz.indexOf('4') > -1){ daysOfWeek += app.translate('Thursday')+' '; }
							if(dateDayz.indexOf('5') > -1){ daysOfWeek += app.translate('Friday')+' '; }
							if(dateDayz.indexOf('6') > -1){ daysOfWeek += app.translate('Saturday')+' '; }
							if(dateDayz.indexOf('0') > -1){ daysOfWeek += app.translate('Sunday')+' '; }
							tasksHtml += '<div>'+daysOfWeek+' '+dateTm+'</div>';
						}
						tasksHtml += '</div>';
					}
				}
			return tasksHtml;
		},*/
		getCommentsHistoryObj: function(comments){
					var commHtml = '';
					var historyHtml = '';
					var commCount = 0;
					var historyyCount = 0;
					var canRemoveComments = false;
					if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
						canRemoveComments = true;
					}
					
					for(var i=0; i < comments.length; i++){
						if(typeof comments[i].message != 'undefined' && 
						comments[i].message.indexOf('hhhhistoryyy') > -1){
							historyyCount++;
							var msgComm = comments[i].message.replace(/hhhhistoryyy/g,'');
							historyHtml+= '<div class="commentInModal" id="commentUnId'+comments[i].date.replace(/ /g,'').replace(/:/g,'')+'"><b>'+this.escapeHtml(comments[i].from+': ')+'</b>'+this.escapeHtml(msgComm)+'</div>';
						}else{
							if(typeof comments[i].date != 'undefined'){
								var removeComm = '<button data-date="'+comments[i].date+'" class=" general_button height35 removeComment"><span data-date="'+comments[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';/*background_comment*/
								if(!canRemoveComments){
									removeComm = "";
								}
								commCount++;
								commHtml+= '<div class="commentInModal" id="commentUnId'+comments[i].date.replace(/ /g,'').replace(/:/g,'')+'">'+removeComm+'<b>'+this.escapeHtml(comments[i].from+': ')+'</b>'+this.escapeHtml(comments[i].message)+"<div class='fontsize10'>"+comments[i].date+"</div>"+'<div style="clear:both;"></div></div>';
							}
						}
					}
					return {commHtml:commHtml, historyHtml:historyHtml,commCount:commCount,historyyCount:historyyCount };
		},
		/*listenToRemoveTask: function(e){
						//$('.removeTaskOne').unbind();
						//$('.removeTaskOne').click(function(e){
							var date = e.currentTarget.getAttribute('data-date');
							  if(date != '' ){
								var myModel = new Backbone.Model();
								myModel.set('id', this.model.get('_id'));
								myModel.set('_id', this.model.get('_id'));
								myModel.set('TaskRemove',date);
								myModel.url = '/projectTasks/'+this.model.get('_id');
								myModel.set('TaskAdd','');
								myModel.save();
								var tasks = this.model.get('tasks');
								for(var i = tasks.length - 1; i >= 0; i--){
									if(typeof tasks[i] != 'undefined' && tasks[i] != null){
										if(tasks[i].date === date) {
										   tasks.splice(i, 1);
										   $('#tasksUnId'+date.replace(/ /g,'').replace(/:/g,'')).remove();
											var numbC = parseInt($('#history_count_inner').html());
											$('#history_count_inner').html(numbC-1);
										}
									}
								}
								this.model.url = '/project/'+this.model.get('_id');
								this.model.save();
							  }
						//}.bind(this));
		},*/
		listenToRemoveComment: function(e){
						//$('.removeComment').unbind();
						//$('.removeComment').click(function(e){
							var commentDate = e.currentTarget.getAttribute('data-date');

							var commentNew = new Project();
							commentNew.set('date',commentDate);
							commentNew.set('id',this.commentsCol.get('_id'));
							commentNew.url = '/comment';
							commentNew.save();
							var msgs = this.commentsCol.get('messages');
							for(var i = msgs.length - 1; i >= 0; i--){
								if(msgs[i].date === commentDate) {
								   msgs.splice(i, 1);
								   $('#commentUnId'+commentDate.replace(/ /g,'').replace(/:/g,'')).remove();
								   var numbC = parseInt($('#comments_count_inner').html());
								   var numbEx = numbC-1;
								   $('#comments_count_inner').text(numbEx);
								}
							}
							app.emitMessage('commentSend',{removethis:true, _id: this.model.get('_id'), date: commentDate});
						//}.bind(this));
		},
		getPermissionsHtmlSelection: function(){
			var visible_to_all = "";
			var visible_to_all_edit = "";
			var visible_to_none = "";
			var visible_to_none_edit = "";
			var visible_to_none_comment_edit = "";
			var visible_to_all_comment = "";
			var notOnHover = " visibility_perm_desc_not_hover";
			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
				visible_to_all = "visible_to_all";
				visible_to_all_edit = "visible_to_all_edit";
				visible_to_none = "visible_to_none";
				visible_to_none_edit = "visible_to_none_edit";
				visible_to_none_comment_edit = "visible_to_none_comment_edit";
				visible_to_all_comment = "visible_to_all_comment";
				notOnHover = "";
			}
			var publicV = "";
			var publicVEdit = "";
			var privateV = "";
			var privateVEdit = "";
			var privateVCoomentEdit = "";
			var publicVCoomentEdit = "";
			var sel = "private";
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "public"){ sel = "public"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editpublic"){ sel = "editpublic"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editprivate"){ sel = "editprivate"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editcommentprivate"){ sel = "editcommentprivate"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editcommentpublic"){ sel = "editcommentpublic"; }
			if(sel == "public"){ publicV = "visibility_perm_descSelected"; }
			if(sel == "editpublic"){ publicVEdit = "visibility_perm_descSelected"; }
			if(sel == "editprivate"){ privateVEdit = "visibility_perm_descSelected"; }
			if(sel == "private"){ privateV = "visibility_perm_descSelected"; }
			if(sel == "editcommentpublic"){ publicVCoomentEdit = "visibility_perm_descSelected"; }
			if(sel == "editcommentprivate"){ privateVCoomentEdit = "visibility_perm_descSelected"; }
			var permSelc = "<div>";
			permSelc += "<div class='visibility_perm_desc "+publicV+notOnHover+"' id='"+visible_to_all+"'><h2>"+app.translate('Public not edit')+"</h2><p>"+app.translate('It is seen to everyone that has a link in readonly mode.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+publicVEdit+notOnHover+"' id='"+visible_to_all_edit+"'><h2>"+app.translate('Public edit')+"</h2><p>"+app.translate('It is seen to everyone that has a link in edit mode for those who is logged in.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+publicVCoomentEdit+notOnHover+"' id='"+visible_to_all_comment+"'><h2>"+app.translate('Public comment add')+"</h2><p>"+app.translate('It is seen to everyone that has a link and can only write comments.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+privateV+notOnHover+"' id='"+visible_to_none+"'><h2>"+app.translate('Private not edit')+"</h2><p>"+app.translate('Only people added to the board can view it in readonly mode.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+privateVEdit+notOnHover+"' id='"+visible_to_none_edit+"'><h2>"+app.translate('Private edit')+"</h2><p>"+app.translate('Only people added to the board can view and edit it.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+privateVCoomentEdit+notOnHover+"' id='"+visible_to_none_comment_edit+"'><h2>"+app.translate('Private comment add')+"</h2><p>"+app.translate('Only people added to the board can view and add comments only.')+"</p></div>";
			permSelc += "</div>";
			return permSelc;
		},
		getEditDialogWindowHtmlRightModal: function(){
			var myModel = this.model;
			myModel.url = '/project/'+myModel.get('_id');
			var projectItIsHtml = "";
			var headerItIsHtml = "";
			var entryItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/entry/'+this.model.get("_id")+'"><span class="glyphicon glyphicon-arrow-right"></span></a>';
			if(this.model.get("isProject")){
				projectItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/project/'+this.model.get("_id")+'"><span style="" class="glyphLink glyphicon glyphicon-list-alt"></span></a>';
			}
			if(this.model.get("isHeader")){
				headerItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/projectsinlist/'+this.model.get("_id")+'/_"><span style="" class="glyphLink glyphicon glyphicon-equalizer"></span></a>';
			}
			this.setCommentsColData();
			var shared_in = {html:"",count:0};
			var shared_in_html_one = shared_in.html;
			var friendsHtmlV = "";
			if(typeof app.userConnected.data2 !== 'undefined'){
				friendsHtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
				shared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
				shared_in_html_one = shared_in.html;
				if(shared_in.count == 0){
					shared_in_html_one = app.noRecordsInIt();
				}
			}else{
				app.vent.on("userConnected:ready", function(){
					var fhtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
					var fshared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
					var shared_in_html_one = fshared_in.html;
					if(fshared_in.count == 0){
						shared_in_html_one = app.noRecordsInIt();
					}
					$("#shared_count").text(fshared_in.count);
					$("#friendsHtmlV").html(fhtmlV);
					$("#shared_inHtml").html(shared_in_html_one);
				}.bind(this));
			}
			var permsLetEdit = false;
			var readonlyIfNotEdit = "";
			var dontShowElement = "";
			var dontShowShared = "";
			var taskViewButtons = this.getTasksViewButtons();
			var tasksViewAll = this.getTasksView();
			if(tasksViewAll == ""){
				tasksViewAll = app.noRecordsInIt();
			}
			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
				permsLetEdit = true; 
			}else{
				readonlyIfNotEdit = "readonly";
				dontShowElement = " style='display:none;' ";
				taskViewButtons = "";
			}
			if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
				dontShowShared = "style= 'display:none;' ";
			}
			var html_files = this.getFilesHtmlAndCount();
			var html_files_inner_html = html_files.html;
			if(html_files.count == 0){
				html_files_inner_html = app.noRecordsInIt();
			}
			return 	'<div class="right_side_of_modal right_modal_dialog_meniu" style="width:100%; float:none; display:block;">' +
				'<button id="general_info_view" class="right_model_menu right_model_menu_selected"><div class="glyphicon glyphicon-home icon-in-menu icon-turn-off" aria-hidden="true"></div></button>' +
				//'<button id="history_info_view" class="right_model_menu"><div class="glyphicon glyphicon-sort icon-in-menu icon-turn-off" aria-hidden="true"></div><span id="history_count"></span></button>' +
				'<button id="comments_info_view" class="right_model_menu"><div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div><span id="comments_count"></span></button>' +
				//'<button id="tasks_info_view" class="right_model_menu"><div class="glyphicon glyphicon-tasks icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="tasksNumb">'+this.model.get('tasks').filter(function(e){return e}).length+'</span>)</button>' +
				'<button id="files_info_view" class="right_model_menu"><div class="glyphicon glyphicon-file icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="files_count">'+html_files.count+'</span>)'+'</button>' +
				'<button '+dontShowShared+' id="shared_info_view" class="right_model_menu"><div class="glyphicon glyphicon-share icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="shared_count">'+shared_in.count+'</span>)</button>' +
				'<button id="permissions_info_view" class="right_model_menu"><div class="glyphicon glyphicon-eye-open icon-in-menu icon-turn-off" aria-hidden="true"></div></button>' +
				'</div>'+
				'<div class="left_side_of_modal" style="width:100%; float:none;">'+
				'<div class="views_in_all comments_info_view" style="display:none;">'+
				'<div id="comments_add_more"></div>'+
				'<div id="comments_inner_all"></div>'+
				'</div>'+
				'<div class="views_in_all tasks_info_view" style="display:none;">'+
				taskViewButtons+'<div id="tasksViewAllIn">'+tasksViewAll+'</div>'+
				'</div>'+
				'<div class="views_in_all permissions_info_view" style="display:none;">'+
				this.getPermissionsHtmlSelection()+
				'</div>'+
				'<div class="views_in_all shared_info_view" style="display:none;">'+
				'<div id="friendsHtmlV">'+friendsHtmlV+'</div>'+
                '<div id="shared_inHtml">'+shared_in_html_one+'</div>'+
				'</div>'+
				'<div class="views_in_all files_info_view" style="display:none;">'+
				'<input type="file" id="fileToUpload" class="FileUploadIt'+this.model.get('_id')+'" identity="'+this.model.get('_id')+'" style="display:none;" />'+
				'<div class="projectclass_'+this.model.get('_id')+'"></div>'+
				'<button '+dontShowElement+' identity="'+this.model.get('_id')+'" class="projectsUploadFileDialog general_button">'+app.translate('Upload file')+'</button>'+
				'<div id="files_inner_view_in_dialog'+this.model.get('_id')+'"><div id="htmlfiles_inner">'+html_files_inner_html+'</div></div>'+
				'</div>'+
				'<div class="views_in_all history_info_view" style="display:none;">'+
				'</div>'+
				'<div class="views_in_all general_info_view">'+
				projectItIsHtml+headerItIsHtml+entryItIsHtml+'<button '+dontShowElement+' id="update_general_info" class="general_button margintop10 topm5">'+app.translate('Update')+'</button>'+
				'<textarea '+readonlyIfNotEdit+' class="modalTextareaMine textarea_title" id="text">'+this.model.get('text')+'</textarea><div class="separator"></div>'+
                '<textarea '+readonlyIfNotEdit+' class="modalTextareaMine description_textarea" id="name">'+this.model.get('name')+'</textarea><div class="separator"></div>'+
                '<input '+readonlyIfNotEdit+' type="color" class="modalTextareaMine form-control left_float20 color_input_data" id="color" value="'+this.model.get('color')+'" /><div class="left_float3" style="height:2px;"></div>'+
                '<input '+readonlyIfNotEdit+' type="text" class="modalTextareaMine form-control left_float75 who_is_working_input" id="friendsThere" placeholder="'+app.translate('Who is working')+'" value="'+this.model.get('friendsThere')+'" />'+
				'<div style="clear:both;"></div>' +
				'</div></div>';
		},
		getTasksView: function(){
			return "";
		},
		getTasksViewButtons: function(){
			return "";
		},
		getEditDialogWindowHtml: function(){
			var customButtons = "";
			for(var i=0; i < customData.length; i++){
				customButtons += customData[i].buttonHtml();
			}
			var myModel = this.model;
			myModel.url = '/project/'+myModel.get('_id');
			this.setCommentsColData();
			var projectItIsHtml = "";
			var headerItIsHtml = "";
			var entryItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/entry/'+this.model.get("_id")+'"><span class="glyphicon glyphicon-arrow-right"></span></a>';
			if(this.model.get("isProject")){
				projectItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/project/'+this.model.get("_id")+'"><span style="" class="glyphLink glyphicon glyphicon-list-alt"></span></a>';
			}
			if(this.model.get("isHeader")){
				headerItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/projectsinlist/'+this.model.get("_id")+'/_"><span style="" class="glyphLink glyphicon glyphicon-equalizer"></span></a>';
			}
			var shared_in = {html:"",count:0};
			var shared_in_html_one = shared_in.html;
			var friendsHtmlV = "";
			if(typeof app.userConnected.data2 !== 'undefined'){
				friendsHtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
				shared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
				shared_in_html_one = shared_in.html;
				if(shared_in.count == 0){
					shared_in_html_one = app.noRecordsInIt();
				}
			}else{
				app.vent.on("userConnected:ready", function(){
					var fhtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
					var fshared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
					var shared_in_html_one = fshared_in.html;
					if(fshared_in.count == 0){
						shared_in_html_one = app.noRecordsInIt();
					}
					$("#shared_count").text(fshared_in.count);
					$("#friendsHtmlV").html(fhtmlV);
					$("#shared_inHtml").html(shared_in_html_one);
				}.bind(this));
			}
			var permsLetEdit = false;
			var readonlyIfNotEdit = "";
			var dontShowElement = "";
			var dontShowShared = "";
			var taskViewButtons = this.getTasksViewButtons();
			var tasksViewAll = this.getTasksView();
			if(tasksViewAll == ""){
				tasksViewAll = app.noRecordsInIt();
			}
			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
				permsLetEdit = true; 
			}else{
				readonlyIfNotEdit = "readonly";
				dontShowElement = " style='display:none;' ";
				taskViewButtons = "";
			}
			if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
				dontShowShared = "style= 'display:none;' ";
			}
			var html_files = this.getFilesHtmlAndCount();
			var html_files_inner_html = html_files.html;
			if(html_files.count == 0){
				html_files_inner_html = app.noRecordsInIt();
			}
			return '<div class="left_side_of_modal">'+
				'<div class="views_in_all comments_info_view" style="display:none;">'+
				'<div id="comments_add_more"></div>'+
				'<div id="comments_inner_all"></div>'+
				'</div>'+
				'<div class="views_in_all tasks_info_view" style="display:none;">'+
				taskViewButtons+'<div id="tasksViewAllIn">'+tasksViewAll+'</div>'+
				'</div>'+
				'<div class="views_in_all permissions_info_view" style="display:none;">'+
				this.getPermissionsHtmlSelection()+
				'</div>'+
				'<div class="views_in_all shared_info_view" style="display:none;">'+
				'<div id="friendsHtmlV">'+friendsHtmlV+'</div>'+
                '<div id="shared_inHtml">'+shared_in_html_one+'</div>'+
				'</div>'+
				'<div class="views_in_all files_info_view" style="display:none;">'+
				'<input type="file" id="fileToUpload" class="FileUploadIt'+this.model.get('_id')+'" identity="'+this.model.get('_id')+'" style="display:none;" />'+
				'<div class="projectclass_'+this.model.get('_id')+'"></div>'+
				'<button '+dontShowElement+' identity="'+this.model.get('_id')+'" class="projectsUploadFileDialog general_button">'+app.translate('Upload file')+'</button>'+
				'<div id="files_inner_view_in_dialog'+this.model.get('_id')+'"><div id="htmlfiles_inner">'+html_files_inner_html+'</div></div>'+
				'</div>'+
				'<div class="views_in_all history_info_view" style="display:none;">'+
				'</div>'+
				'<div class="views_in_all general_info_view">'+
				projectItIsHtml+headerItIsHtml+entryItIsHtml+'<button '+dontShowElement+' id="update_general_info" class="general_button margintop10 topm5">'+app.translate('Update')+'</button>'+
				'<textarea '+readonlyIfNotEdit+' class="modalTextareaMine textarea_title" id="text">'+this.model.get('text')+'</textarea><div class="separator"></div>'+
                '<textarea '+readonlyIfNotEdit+' class="modalTextareaMine description_textarea" id="name">'+this.model.get('name')+'</textarea><div class="separator"></div>'+
                '<input '+readonlyIfNotEdit+' type="color" class="modalTextareaMine form-control left_float20 color_input_data" id="color" value="'+this.model.get('color')+'" /><div class="left_float3" style="height:2px;"></div>'+
                '<input '+readonlyIfNotEdit+' type="text" class="modalTextareaMine form-control left_float75 who_is_working_input" id="friendsThere" placeholder="'+app.translate('Who is working')+'" value="'+this.model.get('friendsThere')+'" />'+
				'<div style="clear:both;"></div>' +
				'</div></div>'+
				
				'<div class="right_side_of_modal">' +
				'<button id="general_info_view" class="right_model_menu right_model_menu_selected"><div class="glyphicon glyphicon-home icon-in-menu icon-turn-off" aria-hidden="true"></div></button>' +
				//'<button id="history_info_view" class="right_model_menu"><div class="glyphicon glyphicon-sort icon-in-menu icon-turn-off" aria-hidden="true"></div><span id="history_count"></span></button>' +
				'<button id="comments_info_view" class="right_model_menu"><div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div><span id="comments_count"></span></button>' +
				//'<button id="tasks_info_view" class="right_model_menu"><div class="glyphicon glyphicon-tasks icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="tasksNumb">'+this.model.get('tasks').filter(function(e){return e}).length+'</span>)</button>' +
				'<button id="files_info_view" class="right_model_menu"><div class="glyphicon glyphicon-file icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="files_count">'+html_files.count+'</span>)'+'</button>' +
				'<button '+dontShowShared+' id="shared_info_view" class="right_model_menu"><div class="glyphicon glyphicon-share icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="shared_count">'+shared_in.count+'</span>)</button>' +
				'<button id="permissions_info_view" class="right_model_menu"><div class="glyphicon glyphicon-eye-open icon-in-menu icon-turn-off" aria-hidden="true"></div></button>' +
				'</div>';
		},
        editDialog: function(myModel){
			var isThatOn = $("#right_menu_for_data").is(":visible");
			var whatWasOn = $(".right_model_menu_selected").attr("id");
			$("#right_menu_for_data").hide();
			$("#right_menu_for_data").html("");
            var th = this;
			var historyVisible = false;
			var commentsVisible = true;
			app.CurrentCommentsView = this;
			var commentsCol = app.getCommentsCol(this.model.get('_id'));
			if(commentsCol === ''){
				commentsCol = new Project();
				app.vent.trigger('add:cachedComments:resource', {_id:this.model.get('_id'),data: commentsCol});
				commentsCol.url = '/comments/'+this.model.get('_id')+'/'+0;
			}
			this.commentsCol = commentsCol;
            app.commands.execute("app:dialog:edit_project", {
				onRenderView: this.rerenderComments.bind(this),
                icon: '',
                title: '',
                commentsCol: commentsCol,
                message: this.getEditDialogWindowHtml(),
                addTask: function(e) {
					th.addTask();
				},
                visible_to_all_comment: function(e) {
					th.visible_to_all_comment(e);
				},
                visible_to_none_comment_edit: function(e) {
					th.visible_to_none_comment_edit(e);
				},
                visible_to_none_edit: function(e) {
					th.visible_to_none_edit(e);
				},
                visible_to_none: function(e) {
					th.visible_to_none(e);
				},
                visible_to_all_edit: function(e) {
					th.visible_to_all_edit(e);
				},
                visible_to_all: function(e) {
					th.visible_to_all(e);
				},
                saveTasks: function(e) {
					th.saveTasks();
				},
                delete_files_one: function(e) {
					th.delete_files_one(e);
				},
                addTaskTo: function(e) {
					th.addTaskTo();
				},
                addTaskEstim: function(e) {
					th.addTaskEstim();
				},
                addTaskRecc: function(e) {
					th.addTaskRecc();
				},
				listenToRemoveTask: function(e){
					th.listenToRemoveTask(e);
				},
				friends_remove_one: function(e){
					th.friends_remove_one(e);
				},
				friendAddToEntry: function(e){
					th.friendAddToEntry();
				},
				onprojectsUploadFile: function(e){
					th.onprojectsUploadFile(e);
				},
				listenToRemoveComment: function(e){
					th.listenToRemoveComment(e);
				},
                commentSubmitminiEditView: function(e) {
					th.commentSubmitminiEditView();
				},
                update_general_info: function(e) {
					th.update_general_info(e);
				},
                right_model_menu: function(e) {
					th.right_model_menu(e);
				},
                field_changed_data: function(e) {
					th.field_changed_data(e);
				},
                confirmNo: function() {
					if(isThatOn){
						$(".pull-right").find(".glyphicon-th-list").trigger("click");
						$("#"+whatWasOn).trigger("click");
					}
                },
                confirmYes: function() {
                }
            });
        },
                visible_to_none_comment_edit: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editcommentprivate");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_none_comment_edit").addClass("visibility_perm_descSelected");
				},
                visible_to_all_comment: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editcommentpublic");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_all_comment").addClass("visibility_perm_descSelected");
				},
                visible_to_none_edit: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editprivate");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_none_edit").addClass("visibility_perm_descSelected");
				},
                visible_to_none: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "private");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_none").addClass("visibility_perm_descSelected");
				},
                visible_to_all_edit: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editpublic");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_all_edit").addClass("visibility_perm_descSelected");
				},
                visible_to_all: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "public");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_all").addClass("visibility_perm_descSelected");
				},
                update_general_info: function(e) {
					var myModel = this.model;
					myModel.url = '/project/'+myModel.get('_id');
					var whatChanged = 'hhhhistoryyy';
					myModel.set('id', myModel.get('_id'));
					
					if(myModel.get('name') !== $('#name').val()){
						whatChanged+= app.translate('Changed name from: ')+myModel.get('name')+' ';
						whatChanged+= app.translate('Changed name to: ')+$('#name').val()+' ';
					}
					if(myModel.get('text') !== $('#text').val()){
						whatChanged+= app.translate('Changed description from: ')+myModel.get('text')+' ';
						whatChanged+= app.translate('Changed description to: ')+$('#text').val()+' ';
					}
					if(myModel.get('color') !== $('#color').val()){
						whatChanged+= app.translate('Changed color from: ')+myModel.get('color')+' ';
						whatChanged+= app.translate('Changed color to: ')+$('#color').val()+' ';
					}
					if(myModel.get('friendsThere') !== $('#friendsThere').val()){
						whatChanged+= app.translate('Changed who is working from: ')+myModel.get('friendsThere')+' ';
						whatChanged+= app.translate('Changed who is working to: ')+$('#friendsThere').val()+' ';
					}
					if(whatChanged != "hhhhistoryyy"){
						$(".modalTextareaMine").removeClass("red_background");
						myModel.set('name', $('#name').val());
						myModel.set('text', $('#text').val());
						myModel.set('color', $('#color').val());
						myModel.set('friendsThere', $('#friendsThere').val());
						myModel.save();
					}
				},
        field_changed_data: function(e) {
			var myModel = this.model;
					var elemJq = $(e.currentTarget);
					if(myModel.get(e.currentTarget.getAttribute('id')) !== elemJq.val()){
						elemJq.addClass("red_background");
					}else{
						elemJq.removeClass("red_background");
					}
		},
        right_model_menu: function(e) {
					var id = e.currentTarget.getAttribute('id');
					$(".right_model_menu").removeClass("right_model_menu_selected");
					$(e.currentTarget).addClass("right_model_menu_selected");
					$('.views_in_all').hide();
					$('.'+id).show();
		},
       commentSubmitminiEditView: function() {
			var idOf = this.commentsCol.get('_id');
			var comments = $('#commentAddminiEditView').val();
			if(comments != ''){
				this.addComment(comments, idOf);
			}
			$('#commentAddminiEditView').val('');
		},
		friendAddToEntry: function(){
			var myModel = this.model;
			var add_ff = $("#friendAddToEntry").val();
			if(typeof add_ff != "undefined" && add_ff != ""){
				myModel.set('friendDeleteEntry', '');
				myModel.set('friendAddToEntry', '');
				if(add_ff !== ''){
					myModel.set('friendAddToEntry', add_ff);
					myModel.addToFriends(add_ff);
				}
				myModel.save();
				$("#friendAddToEntry option[value='"+add_ff+"']").remove();
				var f_data = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
				$('#shared_count').html(f_data.count);
				$(".friends_in_now_remove_it").replaceWith(f_data.html);
			}
		},
		friends_remove_one: function(e){
			var myModel = this.model;
			var removed_ff = e.currentTarget.getAttribute('data-id');
			if(typeof removed_ff != "undefined" && removed_ff != ""){
                myModel.set('friendDeleteEntry', '');
                myModel.set('friendAddToEntry', '');
                myModel.set('friendDeleteEntry', removed_ff);
                myModel.removeFromFriends(removed_ff);
				myModel.save();
				$(e.currentTarget).parent().remove();
				var f_data = this.friendsHtmlV(app.userConnected.data2.friends);
				var numbC = parseInt($('#shared_count').html());
				$('#shared_count').html(numbC-1);
				$(".friendAddToEntry_list").replaceWith(f_data);
			}
		},
		delete_files_one: function(e){
			var myModel = this.model;
			var file_to_delete = e.currentTarget.getAttribute('data-file_name');
			if(typeof file_to_delete != "undefined" && file_to_delete != ""){
				var filess = this.eraseFiles([file_to_delete]);
				myModel.set('files', [filess]);
				myModel.save();
				$(e.currentTarget).parent().remove();
				var numbC = parseInt($('#files_count').html());
				$('#files_count').html(numbC-1);
			}
		},
		addComment: function(comment, id){
				var commentNew = new Project();
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var sec = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(sec<10){
					sec='0'+sec
				} 
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+sec;

				var msgsObj = {from:app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname,message:comment,files:'',date:today};
				commentNew.set('message',msgsObj);
				commentNew.set('id',id);
                commentNew.url = '/comment';
				commentNew.save();
				msgsObj._id = this.model.get('_id');
				app.emitMessage('commentSend',msgsObj);
		},
		friendsGetHtmlToChange: function(){
			var friendsHtml = '';
			var fr = this.model.get('friendsThere');
			if(fr != ''){
				var thFr = fr.split(',');
				for(var i=0; i < thFr.length; i++){
					friendsHtml += '<div class="friendInProjectMini">'+thFr[i]+'</div>';
				}
			}
			return friendsHtml;
		},
        friendsAlreadyInHtmlCount: function(friends){
			if((typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn) || typeof friends == "undefined"){
				return { html:"", count:0 };
			}else{
			var count = 0;
            var html = '<div class="friends_in_now_remove_it">';
            var ffriends = this.model.get('friends');
            var my_id = app.userConnected.data2._id;
			var ffArrays = [];
			if(typeof ffriends != 'undefined'){
				for(var jj=0; jj < ffriends.length; jj++){
					var name = app.translate('Friend was removed');
					for(var ii=0; ii < friends.length; ii++){
						if(friends[ii]._id === ffriends[jj]._id){
							name = friends[ii].firstname+' '+friends[ii].lastname;
						}
					}
					if(my_id === ffriends[jj]._id){
						name = app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname;
					}
					ffArrays[jj] = name;
					var removeEpublicVis = '';
					if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
						removeEpublicVis = '<div class="friends_remove_one general_button" data-id="'+ffriends[jj]._id+'">'+app.translate('Remove')+'</div>';
					}
					html += "<div>"+name+removeEpublicVis+'</div>';
					count++;
				}
			}
			this.model.set('friendsThis',ffArrays);
            html += '</div>';
            return { html:html, count:count };
			}
		},
        friendsAddedV: function(friends){
            var html = '<select name="remove_friend_f_f" class="modalSelectMine" id="remove_friend_f_f">';
            //html += '<option value="">'+app.translate('Remove friend')+'</option>';
            var ffriends = this.model.get('friends');
            var my_id = app.userConnected.data2._id;
			var ffArrays = [];
			if(typeof ffriends != 'undefined'){
				for(var jj=0; jj < ffriends.length; jj++){
					var name = app.translate('Friend was removed');
					for(var ii=0; ii < friends.length; ii++){
						if(friends[ii]._id === ffriends[jj]._id){
							name = friends[ii].firstname+' '+friends[ii].lastname;
						}
					}
					if(my_id === ffriends[jj]._id){
						name = app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname;
					}
					ffArrays[jj] = name;
					html += '<option value="'+ffriends[jj]._id+'">'+name+'</option>';
					
				}
			}
			this.model.set('friendsThis',ffArrays);
            html += '</select>';
            return html;
        },
		friendsInOptionsValue: function(friends){
            var html = '<option value="">'+app.translate('Add friend')+'</option>';
            if(Array.isArray(friends)){
                for(var i=0; i < friends.length; i++){
                    var canChoose = true;
                    var ffriends = this.model.get('friends');
                    if(Array.isArray(ffriends) && ffriends.length > 0 && ffriends !== ''){
                        for(var jj=0; jj < ffriends.length; jj++){
                            if(friends[i]._id === ffriends[jj]._id){
                                canChoose = false;
                            }
                        }
                    }
                    if(canChoose){
                        html += '<option value="'+friends[i]._id+'">'+friends[i].firstname+' '+friends[i].lastname+'</option>';
                    }
                }
            }
			return html;
		},
        friendsHtmlV: function(friends){
			var showSelection = " style='display:none; ' ";
			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
				showSelection = "";
			}
            var html = '<select '+showSelection+' class="friendAddToEntry_list" name="friendAddToEntry" id="friendAddToEntry">';
			html += this.friendsInOptionsValue(friends);
            html += '</select>';
            return html;
        },
        eraseFiles: function(files_delete){
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(files[i] != '' && files[i] != 'undefined' && $.inArray(files[i], files_delete) == -1) {
                        if(files_in==""){
                            files_in += files[i];
                        }else{
                            files_in += ','+files[i];
                        }
                    }
                }
                return files_in;
            }
            return '';
        },
        onprojectsDelete: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                this.model.url = '/project/'+this.model.get('_id');
				var myModel = this;
            app.commands.execute("app:dialog:confirm", {
                icon: 'info-sign',
                title: app.translate('Delete action'),
                message: app.translate('Do you really want to delete ')+myModel.model.get('text')+' ?',
                confirmNo: function() {
                },
                confirmYes: function() {
					$('#project_'+myModel.model.get('_id')).remove();
					myModel.model.destroy();
					myModel.trigger('project:delete');
                }
            });
			e.stopImmediatePropagation();
			e.stopPropagation();
            }
        },
        onprojectsOpenTreeView:function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
					if($('#treeInShowHere'+this.model.get('_id')).is(':visible')){
						$('#treeInShowHere'+this.model.get('_id')).hide();
						$('#project_'+this.model.get('_id')).css('width','210px');
						if(location.hash.indexOf('projectsinlist') == -1){
							$('#project_'+this.model.get('_id')).parent().parent().parent().css('width','214px');
							$('.treeShowContainer table').each(function(){
								$(this).css('width', 'auto');
								var widd = $(this).width()+197;
								$(this).css('width', widd +'px');
							});
						}
					}else{
						$('#treeInShowHere'+this.model.get('_id')).show();
						var dt = {el:'#treeInShowHere'+this.model.get('_id'),id:this.model.get('_id')};
						this.model.set('inCollectionData',dt);
						$('#project_'+this.model.get('_id')).css('width','auto');
						if(location.hash.indexOf('projectsinlist') == -1){
							$('#project_'+this.model.get('_id')).parent().parent().parent().css('width','auto');
						}
					}
					e.stopImmediatePropagation();
					e.stopPropagation();
            }
		},
        onprojectsUploadFile:function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
               /* this.$el.find('#fileToUpload').trigger('click'); */
                $('.FileUploadIt'+this.model.get('_id')).first().trigger('click');
				e.stopImmediatePropagation();
				e.stopPropagation();
            }
        },
        _fileChangeEvent: function(e){
            if(e.target.getAttribute('identity') == this.model.get('_id')){
                this.uploadFilesToServer(e.target.files);
            }
        },
        _dragOverEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault){
					e.preventDefault();
				}
                e.dataTransfer.dropEffect = 'copy';
            }
        },

        _dragEnterEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            if (e.preventDefault) e.preventDefault()
        },

        _dragLeaveEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)
            this.dragLeave(data, e.dataTransfer, e)
        },

        _dropEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (e.preventDefault) e.preventDefault()
            if (e.stopPropagation) e.stopPropagation()

            if (this._draghoverClassAdded) this.$el.removeClass("draghover")

            this.drop(data, e.dataTransfer, e)
        },

        _getCurrentDragData: function (e) {
            var data = null
            if (window._backboneDragDropObject) data = window._backboneDragDropObject
            return data
        },

        dragOver: function (data, dataTransfer, e) {
            var ok = dataTransfer && dataTransfer.types && dataTransfer.types.indexOf('Files') >= 0;
            if(Project.selectedVieww == ""){
                if(ok){
                    if(!this.model.get('isHeader')){
                        this._draghoverClassAddedFile = true;
                        $('.project_one_good_loading').hide();
                        this.$el.find('.project_one_good_loading').show();
                    }
                }
            }
        },

        dragLeave: function (data, dataTransfer, e) {
            if (this._draghoverClassAdded){
                if(this.model.get('isHeader')){
                    this.$el.removeClass("draghover");
                }else{
                    this.$el.removeClass("dragHoverElement");
                }
            }
        },
		getFilesHtmlWithOrWithout: function(wOrw){
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(files[i] != 'undefined') {
						var delFile= '';
						if(wOrw){
							if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
								delFile = '<input file_name="'+files[i]+'" type="checkbox" class="delete_files">'+app.translate('Delete');
							}
						}
                        files_in += '<div class="fileOneProjectInModel"><a target="_blank" href="/files/project_managing_files/'+this.model.get('_id')+'/'+files[i]+'">'+files[i]+'</a> '+delFile+'</div>';
                    }
                }
                return files_in;
            }
            return '';
		},
		getFilesHtmlAndCount: function(){
			var wOrw = true;
			var count = 0;
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(files[i] != 'undefined') {
						var delFile= '';
						if(wOrw){
							if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
								delFile = '<div data-file_name="'+files[i]+'" class="delete_files delete_files_one general_button">'+app.translate('Delete')+'</div>';
							}
						}
                        files_in += '<div class="fileOneProjectInModel"><a target="_blank" href="/files/project_managing_files/'+this.model.get('_id')+'/'+files[i]+'">'+files[i]+'</a> '+delFile+'</div>';
						count++;
                    }
                }
                return {html: files_in, count:count};
            }
            return {html:'', count:count};
		},
        renderr: function(){
			return this.getFilesHtmlWithOrWithout(true);
        },
        uploadFilesToServer: function(files){
            var fd = new FormData();
            fd.append("project", this.model.get('_id'));
            fd.append("pfiles", this.model.get('files'));
            var files_in = this.model.get('files')[0];
			var canUploadIt = true;
            for (var i in files) {
				var fileSizeInMb = files[i].size/1024/1024;
                if(files[i].name != 'undefined' && files[i].name != 'item'){
                    files_in += ','+files[i].name;
                }
				if(fileSizeInMb >= 25){//25mb
					canUploadIt = false;
				}
                fd.append("uploadedFile", files[i]);
            }
			if(canUploadIt){
				this.model.set('files', [files_in]);
				var xhr = new XMLHttpRequest();
				xhr.upload.addEventListener("progress", function(oEvent){
					if(!$('.projectclass_'+this.model.get('_id')+' .progress').length){
						$('.projectclass_'+this.model.get('_id')).append('<div class="progress" style="color:white;background:red;"></div>');
					}
					if (oEvent.lengthComputable) {
						var percentComplete = oEvent.loaded / oEvent.total;
						$('.projectclass_'+this.model.get('_id')+' .progress').css('height', '10px');
						$('.projectclass_'+this.model.get('_id')+' .progress').css('width', (percentComplete*100)+'%');
					} else {
						$('.projectclass_'+this.model.get('_id')+' .progress').html(app.translate('Uploading ... '));
					}
				}.bind(this), false);
				 xhr.addEventListener("load", function(){
					 var flsz = xhr.responseText.replace(/"/g,'').replace('[','').replace(']','');
					 this.model.set('files',[flsz]);
						this.model.url = '/project/'+this.model.get('_id');
					 this.model.save();
					 if($('#files_inner_view_in_dialog'+this.model.get('_id')).length){
						 var html_files = this.getFilesHtmlAndCount();
						 $('#files_inner_view_in_dialog'+this.model.get('_id')).html(html_files.html);
						 $('#files_count').text(html_files.count);
					 }
					 $('.projectclass_'+this.model.get('_id')+' .too_big_file').remove();
					 $('.projectclass_'+this.model.get('_id')+' .progress').remove();
				 }.bind(this), false);
				xhr.open("POST", "/project_upload");
				xhr.send(fd);
			}else{
				$('.projectclass_'+this.model.get('_id')).append('<div class="too_big_file" style="color:white;background:red;">'+app.translate('Too big file. Max - 25MB.')+'</div>');
			}
        },
        drop: function (data, dataTransfer, e) {
            if(Project.selectedVieww == "" && !this.model.get('isHeader')){
                this.uploadFilesToServer(dataTransfer.files);
            }
            Project.selectedVieww = "";
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
        },

        _dragStartEvent:function(e){
            var data
            if (e.originalEvent) e = e.originalEvent
            e.dataTransfer.effectAllowed = "copy"
            data = this.dragStart(e.dataTransfer, e)

            window._backboneDragDropObject = null
            if (data !== undefined) {
                window._backboneDragDropObject = data;
            }
        },
        dragStart: function (dataTransfer, e) {
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
            if(Project.selectedVieww == ""){
                Project.selectedVieww = this;
            }
        }
	});
});
