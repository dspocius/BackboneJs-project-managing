define([
	'../../app'//app.translate('Calendar view')
], function( app ) {
    return [
		{
			id:"tasks_data", 
			dataRerender:function(){
				//var tasksN = this.getTasksView();
				//var tasksNumber = this.model.get('tasks').filter(function(e){return e}).length;
				//$("#tasksViewAllIn").html(tasksN);
				//$("#tasksNumb").text(tasksNumber);
			},
			/*getTasksViewButtons: function(){
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
			},
			saveTasks: function(){
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
			},
		addTaskRecc: function(){
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
		},
				listenToRemoveTask: function(e){
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
		getTasksViewButtons: function(){
			return "";
		},
		buttonHtml: function(){
			return '';//'<button id="tasks_info_view" class="right_model_menu"><div class="glyphicon glyphicon-tasks icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="tasksNumb">'+this.model.get('tasks').filter(function(e){return e}).length+'</span>)</button>';
		}
		}
	];
});
