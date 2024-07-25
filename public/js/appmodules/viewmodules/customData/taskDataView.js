define([
	'../../../app',//app.translate('Calendar view')
	'../../../config'//app.translate('Calendar view')
], function( app, config ) {
	return {
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
			getTasksViewButtons: function(){
				var tasksHtml = '';
				tasksHtml += '<div>';
				tasksHtml += '	<button id="add_task_edit_view" class="buttonChange">'+app.translate("Add From To")+'</button>';
				tasksHtml += '	<button id="add_task_to_edit_view" class="buttonChange">'+app.translate("Add To")+'</button>';
				tasksHtml += '	<button id="add_task_estimate_edit_view" class="buttonChange">'+app.translate("Add only estimate")+'</button>';
				tasksHtml += '	<button id="add_task_reccurence_edit_view" class="buttonChange">'+app.translate("Add recurrence")+'</button>';
				tasksHtml += '	<button id="save_task_edit_view" style="display:none;" class="buttonChange">'+app.translate("Save")+'</button>';
				tasksHtml += '	<button id="save_task_edit_view_close" style="display:none;" class="buttonChange">'+app.translate("Cancel")+'</button>';
				tasksHtml += '	<div id="add_tasks_new_view"></div>';
				tasksHtml += '</div>';
				return tasksHtml;
			},
			save_task_edit_view_close: function(){
				$('#add_tasks_new_view').html("");
				$('#save_task_edit_view').hide();
				$('#save_task_edit_view_close').hide();
			},
			saveTasks: function(){
				var th = this;
				$( ".addOneTaskToIt" ).each(function( index ) {
					var edit_it = "";
					var edit_that_task_here = $( this ).find('.edit_that_task_here').val();
					if(typeof edit_that_task_here !== "undefined" && edit_that_task_here !== ""){
						edit_it = edit_that_task_here;
					}
					var about = $( this ).find('.addClassTaskAbout').val();
					var from = $( this ).find('.addClassTaskFrom').val();
					var fromTime = $( this ).find('.addClassTaskFromTime').val();
					var to = $( this ).find('.addClassTaskTo').val();
					var toTime = $( this ).find('.addClassTaskToTime').val();
					var notify = $( this ).find(".addClassTaskNotify").val();
					var textarea_notify = $( this ).find(".addClassTaskNotifytextarea").val();
					var estimate = $( this ).find(".addClassTaskEstimate").val();
					
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					estimate = estimate.replace(regex, "");
					textarea_notify = textarea_notify.replace(regex, "");

				  if(about != '' && from != '' && fromTime != '' && to != '' && toTime!= '' ){
					var myModel = th.model;
					myModel.set('id', myModel.get('_id'));
					var taskObj = {edit_it:edit_it, textarea_notify:textarea_notify, estimate:estimate, date:th.getTimeNow(), about:about, from:from, to:to, fromTime:fromTime, toTime:toTime,notify:notify};
					myModel.set('TaskAdd',taskObj);
					myModel.url = config.urlAddr+'/projectTasks/'+myModel.get('_id');
					var tasks = myModel.get('tasks');
					if(edit_it === ""){
						tasks.push(taskObj);
					}else{
						for(var ii=0; ii < tasks.length; ii++){
							if(tasks[ii].date == edit_it){
								tasks[ii] = taskObj;
							}
						}
					}
					myModel.save();
					myModel.set('TaskAdd','');
					$('#add_tasks_new_view').html('');
					$("#save_task_edit_view").hide();
					$("#save_task_edit_view_close").hide();
					//th.rerenderTasks();
				  }
				});
				$( ".addOneTaskToItOnlyOneReccurence" ).each(function( index ) {
					var edit_it = "";
					var edit_that_task_here = $( this ).find('.edit_that_task_here').val();
					if(typeof edit_that_task_here !== "undefined" && edit_that_task_here !== ""){
						edit_it = edit_that_task_here;
					}
					var about = $( this ).find('.addClassTaskAbout').val();
					var estimate = $( this ).find(".addClassTaskToOneTimeEstimate").val();
					var notify = $( this ).find(".addClassTaskOneTimeNotify").val();
					var textarea_notify = $( this ).find(".addClassTaskOneTimeNotifytextarea").val();
					
					var monday = $( this ).find(".addClassTaskOneTimeMonday").is(':checked');
					var tuesday = $( this ).find(".addClassTaskOneTimeTuesday").is(':checked');
					var wednesday = $( this ).find(".addClassTaskOneTimeWednesday").is(':checked');
					var thursday = $( this ).find(".addClassTaskOneTimeThursday").is(':checked');
					var friday = $( this ).find(".addClassTaskOneTimeFriday").is(':checked');
					var saturday = $( this ).find(".addClassTaskOneTimeSaturday").is(':checked');
					var sunday = $( this ).find(".addClassTaskOneTimeSunday").is(':checked');
					var timeDtt = $( this ).find(".addClassTaskTime").val();
					
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					estimate = estimate.replace(regex, "");
					textarea_notify = textarea_notify.replace(regex, "");
					
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
					var taskObj = {edit_it:edit_it, textarea_notify:textarea_notify, reccurence:reccur, estimate:estimate, date:th.getTimeNow(), about:about, from:'', to:'', fromTime:'', toTime:'',notify:notify};
					myModel.set('id', myModel.get('_id'));
					myModel.set('TaskAdd',taskObj);
					myModel.url = config.urlAddr+'/projectTasks/'+myModel.get('_id');
					var tasks = myModel.get('tasks');
					if(edit_it === ""){
						tasks.push(taskObj);
					}else{
						for(var ii=0; ii < tasks.length; ii++){
							if(tasks[ii].date == edit_it){
								tasks[ii] = taskObj;
							}
						}
					}
					myModel.save();
					myModel.set('TaskAdd','');
					//th.render();
					$('#add_tasks_new_view').html('');
					$("#save_task_edit_view").hide();
					$("#save_task_edit_view_close").hide();
					//th.rerenderTasks();
				  }
				});
				$( ".addOneTaskToItOnlyOneEstimate" ).each(function( index ) {
					var edit_it = "";
					var edit_that_task_here = $( this ).find('.edit_that_task_here').val();
					if(typeof edit_that_task_here !== "undefined" && edit_that_task_here !== ""){
						edit_it = edit_that_task_here;
					}
					var about = $( this ).find('.addClassTaskAbout').val();
					var estimate = $( this ).find(".addClassTaskToOneTimeEstimate").val();
					var notify = $( this ).find(".addClassTaskOneTimeNotify").val();
					var textarea_notify = $( this ).find(".addClassTaskOneTimeNotifytextarea").val();
					
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					estimate = estimate.replace(regex, "");
					
				  if(about != '' && estimate!= '' ){
					var myModel = th.model;
					var taskObj = {edit_it:edit_it, estimate:estimate, date:th.getTimeNow(), about:about, from:'', to:'', fromTime:'', toTime:'',notify:notify, textarea_notify:textarea_notify};
					myModel.set('id', myModel.get('_id'));
					myModel.set('TaskAdd',taskObj);
					myModel.url = config.urlAddr+'/projectTasks/'+myModel.get('_id');
					var tasks = myModel.get('tasks');
					if(edit_it === ""){
						tasks.push(taskObj);
					}else{
						for(var ii=0; ii < tasks.length; ii++){
							if(tasks[ii].date == edit_it){
								tasks[ii] = taskObj;
							}
						}
					}
					myModel.save();
					myModel.set('TaskAdd','');
					//th.render();
					$('#add_tasks_new_view').html('');
					$("#save_task_edit_view").hide();
					$("#save_task_edit_view_close").hide();
					//th.rerenderTasks();
				  }
				});
				$( ".addOneTaskToItOnlyOne" ).each(function( index ) {
					var edit_it = "";
					var edit_that_task_here = $( this ).find('.edit_that_task_here').val();
					if(typeof edit_that_task_here !== "undefined" && edit_that_task_here !== ""){
						edit_it = edit_that_task_here;
					}
					var about = $( this ).find('.addClassTaskAbout').val();
					var to = $( this ).find('.addClassTaskToOne').val();
					var toTime = $( this ).find('.addClassTaskToOneTime').val();
					var notify = $( this ).find(".addClassTaskOneTimeNotify").val();
					var textarea_notify = $( this ).find(".addClassTaskOneTimeNotifytextarea").val();
					var estimate = $( this ).find(".addClassTaskToOneTimeEstimate").val();
					
					var regex = /(<([^>]+)>)/ig;
					about = about.replace(regex, "");
					estimate = estimate.replace(regex, "");
					
				  if(about != '' && to != '' && toTime!= '' ){
					var myModel = th.model;
					var taskObj = {edit_it:edit_it, textarea_notify:textarea_notify, estimate:estimate, date:th.getTimeNow(), about:about, from:'', to:to, fromTime:'', toTime:toTime,notify:notify};
					myModel.set('id', myModel.get('_id'));
					myModel.set('TaskAdd',taskObj);
					myModel.url = config.urlAddr+'/projectTasks/'+myModel.get('_id');
					var tasks = myModel.get('tasks');
					if(edit_it === ""){
						tasks.push(taskObj);
					}else{
						for(var ii=0; ii < tasks.length; ii++){
							if(tasks[ii].date == edit_it){
								tasks[ii] = taskObj;
							}
						}
					}
					myModel.save();
					myModel.set('TaskAdd','');
					//th.render();
					$('#add_tasks_new_view').html('');
					$("#save_task_edit_view").hide();
					$("#save_task_edit_view_close").hide();
					//th.rerenderTasks();
				  }
				});
			},
		addTaskRecc: function(e, task_data){
			var about_dat = "";
			var working_now_dat = "";
			var notes_now_dat = "";
			var estimate_now_dat = "";
			var is_it_edit_view = "";
			var time_now_dat = "00:00";
			var monday_one = "";
			var tuesday_one = "";
			var wednesday_one = "";
			var thursday_one = "";
			var friday_one = "";
			var saturday_one = "";
			var sunday_one = "";
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			}
			if(typeof task_data !== "undefined" && task_data !== ""){
				is_it_edit_view = "<input type='hidden' class='edit_that_task_here' value='"+task_data.date+"' />";
				about_dat = task_data.about;
				working_now_dat = task_data.notify;
				notes_now_dat = task_data.textarea_notify;
				estimate_now_dat = task_data.estimate;
				var task_recc_ok = task_data.reccurence.split(",");
				time_now_dat = task_recc_ok[1];
				task_recc_ok = task_recc_ok[0].replace("W","");
				var split_by_recc = task_recc_ok.split("_");
				for(var ii=0; ii < split_by_recc.length; ii++){
					if(split_by_recc[ii] !== ""){
						if(split_by_recc[ii] == "1"){ monday_one = "checked"; }
						if(split_by_recc[ii] == "2"){ tuesday_one = "checked"; }
						if(split_by_recc[ii] == "3"){ wednesday_one = "checked"; }
						if(split_by_recc[ii] == "4"){ thursday_one = "checked"; }
						if(split_by_recc[ii] == "5"){ friday_one = "checked"; }
						if(split_by_recc[ii] == "6"){ saturday_one = "checked"; }
						if(split_by_recc[ii] == "0"){ sunday_one = "checked"; }
					}
				}
			}
			var rightNow = new Date();
			var tdate = rightNow.toISOString().slice(0,10);
			$('#save_task_edit_view').show();
			$('#save_task_edit_view_close').show();
			var taskNew = '<div class="addOneTaskToItOnlyOneReccurence"><input type="text" class="addClassTaskAbout" value="'+about_dat+'" placeholder="'+app.translate('About')+'" /> '+this.getWhatIsWorkingOnHtml("addClassTaskOneTimeNotify", notes_now_dat, working_now_dat)+' '+app.translate('Estimate')+': <input type="text" class="addClassTaskToOneTimeEstimate" value="'+estimate_now_dat+'" placeholder="1h, 1d, 1w, 1m" />';
			//taskNew += 'Recurrence: <input type="text" class="addClassTaskOneTimeReccurence" value="" placeholder="C(cron expression) or W(week day,hour, minute - [0-4],17,0)" />';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeMonday" '+monday_one+' /> '+app.translate('Monday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeTuesday" '+tuesday_one+' />'+app.translate('Tuesday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeWednesday" '+wednesday_one+' />'+app.translate('Wednesday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeThursday" '+thursday_one+' />'+app.translate('Thursday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeFriday" '+friday_one+' />'+app.translate('Friday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeSaturday" '+saturday_one+' />'+app.translate('Saturday')+'</label></span>';
			taskNew += '<span class="checkbox"><label><input type="checkbox" class="addClassTaskOneTimeSunday" '+sunday_one+' />'+app.translate('Sunday')+'</label></span>';
			taskNew += '<input type="time" class="addClassTaskTime" value="'+time_now_dat+'" />';
			taskNew += is_it_edit_view;
			taskNew += '</div>';
			$('#add_tasks_new_view').html(taskNew);
		},
		addTaskEstim: function(e, task_data){
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			}
			var about_dat = "";
			var estimate_now_dat = "";
			var is_it_edit_view = "";
			var notes_now_dat = "";
			var working_now_dat = "";
			if(typeof task_data !== "undefined" && task_data !== ""){
				is_it_edit_view = "<input type='hidden' class='edit_that_task_here' value='"+task_data.date+"' />";
				about_dat = task_data.about;
				estimate_now_dat = task_data.estimate;
				notes_now_dat = task_data.textarea_notify;
				working_now_dat = task_data.notify;
			}
			var rightNow = new Date();
			var tdate = rightNow.toISOString().slice(0,10);
			$('#save_task_edit_view').show();
			$('#save_task_edit_view_close').show();
			var taskNew = '<div class="addOneTaskToItOnlyOneEstimate"><input value="'+about_dat+'" type="text" class="addClassTaskAbout" placeholder="'+app.translate('About')+'" /> Estimate: <input type="text" class="addClassTaskToOneTimeEstimate" value="'+estimate_now_dat+'" placeholder="1h, 1d, 1w, 1m" />'+this.getWhatIsWorkingOnHtml("addClassTaskOneTimeNotify",notes_now_dat,working_now_dat);
			taskNew += is_it_edit_view;
			taskNew += '</div>';
			$('#add_tasks_new_view').html(taskNew);
		},
		addTaskTo: function(e, task_data){
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			}
			var is_it_edit_view = "";
			var about_dat = "";
			var working_now_dat = "";
			var notes_now_dat = "";
			var estimate_now_dat = "";
			var rightNow = new Date();
			var tdate = rightNow.toISOString().slice(0,10);
			var from_now_data = tdate;
			var from_now_data_time = "00:00";
			if(typeof task_data !== "undefined" && task_data !== ""){
				is_it_edit_view = "<input type='hidden' class='edit_that_task_here' value='"+task_data.date+"' />";
				about_dat = task_data.about;
				working_now_dat = task_data.notify;
				notes_now_dat = task_data.textarea_notify;
				estimate_now_dat = task_data.estimate;
				from_now_data = task_data.to;
				from_now_data_time = task_data.toTime;
			}

			$('#save_task_edit_view').show();
			$('#save_task_edit_view_close').show();
			var taskNew = '<div class="addOneTaskToItOnlyOne"><input type="text" value="'+about_dat+'" class="addClassTaskAbout" placeholder="'+app.translate('About')+'" /> '+app.translate('To')+': <input type="date" class="addClassTaskToOne" value="'+from_now_data+'" /> <input type="time" class="addClassTaskToOneTime" value="'+from_now_data_time+'" /> '+this.getWhatIsWorkingOnHtml("addClassTaskOneTimeNotify",notes_now_dat,working_now_dat)+' Estimate: <input type="text" class="addClassTaskToOneTimeEstimate" value="'+estimate_now_dat+'" placeholder="1h, 1d, 1w, 1m" />';
			taskNew += is_it_edit_view;
			taskNew += '</div>';
			$('#add_tasks_new_view').html(taskNew);
		},
		getWhatIsWorkingOnHtml: function(classnm, notes_def, notify_def){
			var notes_there = "";
			var notify_there = "";
			if(typeof notes_def !== "undefined" && notes_def !== ""){ notes_there = notes_def; }
			if(typeof notify_def !== "undefined" && notify_def !== ""){ notify_there = notify_def; }
				var friendsOn = app.userConnected.data2.friends;
				var selectHtml = app.translate("Working")+": <select name='"+classnm+"' class='"+classnm+"'>";
				selectHtml += "<option value='"+app.userConnected.data2.email+"'>"+app.userConnected.data2.firstname+" "+app.userConnected.data2.lastname+"</option>";
				for(var ii=0; ii < friendsOn.length; ii++){
					var notify_thatsss_here = "";
					if(friendsOn[ii].email == notify_there){
						notify_thatsss_here = "selected";
					}
					selectHtml += "<option "+notify_thatsss_here+" value='"+friendsOn[ii].email+"'>"+friendsOn[ii].firstname+" "+friendsOn[ii].lastname+"</option>";
				}
				selectHtml += "</select>";
				selectHtml += "<br />Notes: <textarea class='"+classnm+"textarea'>"+notes_there+"</textarea><br />";
			return selectHtml;
		},
		addTask: function(e, task_data){
			if(typeof e !== "undefined" && e !== ""){
				e.stopImmediatePropagation();
				e.stopPropagation();
			}
			var is_it_edit_view = "";
			var about_dat = "";
			var working_now_dat = "";
			var notes_now_dat = "";
			var estimate_now_dat = "";
			
			var rightNow = new Date();
			var toNow = new Date();
			toNow.setDate(toNow.getDate() + 1);
			var todate = toNow.toISOString().slice(0,10);
			var tdate = rightNow.toISOString().slice(0,10);
			
			var from_now_data = tdate;
			var to_now_data = todate;
			var from_now_data_time = "00:00";
			var to_now_data_time = "00:00";
			if(typeof task_data !== "undefined" && task_data !== ""){
				is_it_edit_view = "<input type='hidden' class='edit_that_task_here' value='"+task_data.date+"' />";
				about_dat = task_data.about;
				working_now_dat = task_data.notify;
				notes_now_dat = task_data.textarea_notify;
				estimate_now_dat = task_data.estimate;
				
				from_now_data = task_data.from;
				from_now_data_time = task_data.fromTime;
				to_now_data = task_data.to;
				to_now_data_time = task_data.toTime;
			}
			$('#save_task_edit_view').show();
			$('#save_task_edit_view_close').show();

			
			var taskNew = '<div class="addOneTaskToIt"><input type="text" class="addClassTaskAbout" value="'+about_dat+'" placeholder="'+app.translate('About')+'" /> '+app.translate('From')+': <input type="date" class="addClassTaskFrom" value="'+from_now_data+'" /> <input type="time" class="addClassTaskFromTime" value="'+from_now_data_time+'" />';
			taskNew += ''+app.translate('To')+': <input type="date" class="addClassTaskTo" value="'+to_now_data+'" /> <input type="time" class="addClassTaskToTime" value="'+to_now_data_time+'" /> '+this.getWhatIsWorkingOnHtml("addClassTaskNotify", notes_now_dat, working_now_dat)+' Estimate: <input type="text" class="addClassTaskEstimate" value="'+estimate_now_dat+'" placeholder="1h, 1d, 1w, 1m" />'+is_it_edit_view+'</div>';
			$('#add_tasks_new_view').html(taskNew);
		},
		getTasksView: function(){
			var tasks = this.model.get('tasks');
			var tasksHtml = '';
				for(var i=0; i < tasks.length; i++){
					if(typeof tasks[i] != 'undefined' && tasks[i] != null){
						tasksHtml+='<div class="commentInModal" id="tasksUnId'+tasks[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						tasksHtml+= '<div>'+tasks[i].about+' <span style="font-size:12px;">'+tasks[i].date+'</span>';
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
							tasksHtml+= '<button data-date="'+tasks[i].date+'" class="general_button height35 edittttsTaskOne"><span data-date="'+tasks[i].date+'" class="glyphicon glyphicon-edit icon-in-menu icon-turn-off"></span></button>';
							tasksHtml+= '<button data-date="'+tasks[i].date+'" class="general_button height35 removeTaskOne"><span data-date="'+tasks[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
						}
						tasksHtml+= '</div>';
						if(tasks[i].from != ''){
							tasksHtml += '<div>'+tasks[i].from+'<span style="padding-left:5px;">'+tasks[i].fromTime+'</span></div>';
						}
						if(tasks[i].to != ''){
							tasksHtml += '<div>'+tasks[i].to+'<span style="padding-left:5px;">'+tasks[i].toTime+'</span></div>';
						}
						if(tasks[i].notify != '' && tasks[i].notify != 'false' && tasks[i].notify){
							tasksHtml += '<div><a href="/#'+tasks[i].notify+'">'+tasks[i].notify+'</a></div>';
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
				edittttsTaskOne: function(e){
				e.stopImmediatePropagation();
				e.stopPropagation();
					var date = e.currentTarget.getAttribute('data-date');
							  if(date != '' ){
								  var this_task_sel = "";
								var tasks = this.model.get('tasks');
								for(var i = tasks.length - 1; i >= 0; i--){
									if(typeof tasks[i] != 'undefined' && tasks[i] != null){
										if(tasks[i].date === date) {
										   this_task_sel = tasks[i];
										}
									}
								}
								if(this_task_sel != ""){
									if(typeof this_task_sel.reccurence !== "undefined" && this_task_sel.reccurence !== ""){
										this.addTaskRecc("", this_task_sel);
									}else{
										if(this_task_sel.from === "" && this_task_sel.to === ""){
											this.addTaskEstim("", this_task_sel);
										}else{
											if(this_task_sel.from === "" && this_task_sel.to !== ""){
												this.addTaskTo("", this_task_sel);
											}else{
												this.addTask("", this_task_sel);
											}
										}
									}
								}
							  }
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
								myModel.url = config.urlAddr+'/projectTasks/'+this.model.get('_id');
								myModel.set('TaskAdd','');
								myModel.save();
								var tasks = this.model.get('tasks');
								for(var i = tasks.length - 1; i >= 0; i--){
									if(typeof tasks[i] != 'undefined' && tasks[i] != null){
										if(tasks[i].date === date) {
										   tasks.splice(i, 1);
										   $('#tasksUnId'+date.replace(/ /g,'').replace(/:/g,'')).remove();
										}
									}
								}
								this.model.url = config.urlAddr+'/project/'+this.model.get('_id');
								this.model.save();
							  }
						//}.bind(this));
		},
		getTasksViewButtons: function(){
				var tasksHtml = '';
				tasksHtml += '<div>';
				tasksHtml += '	<button id="add_task_edit_view" class="buttonChange">'+app.translate("Add From To")+'</button>';
				tasksHtml += '	<button id="add_task_to_edit_view" class="buttonChange">'+app.translate("Add To")+'</button>';
				tasksHtml += '	<button id="add_task_estimate_edit_view" class="buttonChange">'+app.translate("Add only estimate")+'</button>';
				tasksHtml += '	<button id="add_task_reccurence_edit_view" class="buttonChange">'+app.translate("Add recurrence")+'</button>';
				tasksHtml += '	<button id="save_task_edit_view" style="display:none;" class="buttonChange">'+app.translate("Save")+'</button>';
				tasksHtml += '	<button id="save_task_edit_view_close" style="display:none;" class="buttonChange">'+app.translate("Cancel")+'</button>';
				tasksHtml += '	<div id="add_tasks_new_view"></div>';
				tasksHtml += '</div>';
				return tasksHtml;
		},
		getTasksView: function(){
			if(typeof this.model == "undefined"){
				return "";
			}
			var tasks = this.model.get('tasks');
			var tasksHtml = '';
				for(var i=0; i < tasks.length; i++){
					if(typeof tasks[i] != 'undefined' && tasks[i] != null){
						tasksHtml+='<div class="commentInModal" id="tasksUnId'+tasks[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						tasksHtml+= '<div>'+tasks[i].about+' <span style="font-size:12px;">'+tasks[i].date+'</span>';
						if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
							tasksHtml+= '<button data-date="'+tasks[i].date+'" class="general_button height35 edittttsTaskOne"><span data-date="'+tasks[i].date+'" class="glyphicon glyphicon-edit icon-in-menu icon-turn-off"></span></button>';
							tasksHtml+= '<button data-date="'+tasks[i].date+'" class="general_button height35 removeTaskOne"><span data-date="'+tasks[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
						}
						tasksHtml+= '</div>';
						if(tasks[i].from != ''){
							tasksHtml += '<div>'+tasks[i].from+'<span style="padding-left:5px;">'+tasks[i].fromTime+'</span></div>';
						}
						if(tasks[i].to != ''){
							tasksHtml += '<div>'+tasks[i].to+'<span style="padding-left:5px;">'+tasks[i].toTime+'</span></div>';
						}
						if(tasks[i].notify != '' && tasks[i].notify != 'false' && tasks[i].notify){
							tasksHtml += '<div><a href="/#'+tasks[i].notify+'">'+tasks[i].notify+'</a></div>';
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
		innerHtml: function(){
			var taskViewButtons = this.getTasksViewButtons();
			var tasksViewAll = this.getTasksView();
			if(tasksViewAll == ""){
				tasksViewAll = app.noRecordsInIt();
			}
			if(this.model.get("parentvisibility") != "editpublic" && this.model.get("parentvisibility") != "editprivate"){ taskViewButtons = ""; }
			
				return '<div class="views_in_all tasks_info_view" style="display:none;">'+
				taskViewButtons+'<div id="tasksViewAllIn">'+tasksViewAll+'</div>'+
				'</div>';
		},
		onRerender: function(){
			var tasksViewAll = this.getTasksView();
			if(tasksViewAll == ""){
				tasksViewAll = app.noRecordsInIt();
			}
			$("#tasksViewAllIn").html(tasksViewAll);
			var tasksNumber = 0;
			if(typeof this.model != "undefined"){
				 tasksNumber = this.model.get('tasks').filter(function(e){return e}).length;
			}
			$("#tasksNumb").text(tasksNumber);
			$(".edittttsTaskOne").click(this.edittttsTaskOne.bind(this));
			$(".removeTaskOne").click(this.listenToRemoveTask.bind(this));
		},
		onRender: function(){
			setTimeout(function(){
				
			$("#add_task_reccurence_edit_view").click(this.addTaskRecc.bind(this));
			$("#add_task_estimate_edit_view").click(this.addTaskEstim.bind(this));
			$("#add_task_to_edit_view").click(this.addTaskTo.bind(this));
			$("#save_task_edit_view").click(this.saveTasks.bind(this));
			$("#save_task_edit_view_close").click(this.save_task_edit_view_close.bind(this));
			$("#add_task_edit_view").click(this.addTask.bind(this));
			$(".removeTaskOne").click(this.listenToRemoveTask.bind(this));
			$(".edittttsTaskOne").click(this.edittttsTaskOne.bind(this));
				
			}.bind(this), 1);
			
			            //'click #add_task_reccurence_edit_view': data.addTaskRecc,
                        //'click #add_task_estimate_edit_view': data.addTaskEstim,
                        //'click #add_task_to_edit_view': data.addTaskTo,
                        //'click #save_task_edit_view': data.saveTasks,
                        //'click #add_task_edit_view': data.addTask,
						//'click .removeTaskOne': data.listenToRemoveTask,
		},
		setModel: function(model){
			this.model = model;
		}
		};
});
