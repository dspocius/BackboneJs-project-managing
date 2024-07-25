define([
	'../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/calendarGridRow.html',
    'models/project'
], function (app, templateHelpers, _, Marionette, templ, Project) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        tagName:'td',
        className:'headerMain',
        ui:{
            projectMain:'.projectMain',
            projectsDelete:'.projectsDelete',
            projectsEdit:'.projectsEdit',
            projectsUploadFile:'.projectsUploadFile',
            name:'#name',
            text:'#text',
            fileToUpload:'#fileToUpload'
        },
        events:{
            'click .projectMain':'onpprojectMain',
            'click .projectsEdit':'onprojectsEdit',
            'click .projectsDelete':'onprojectsDelete',
            'click .projectsUploadFile':'onprojectsUploadFile',
            'change #fileToUpload':'_fileChangeEvent'
        },
        initialize: function(){
            //this.$el.attr("draggable", "true");
            this.$el.attr("pid", this.model.get('_id'));
            //this.$el.bind("dragstart", _.bind(this._dragStartEvent, this));

            this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
            //this.$el.bind("dragenter", _.bind(this._dragEnterEvent, this));
            //this.$el.bind("dragleave", _.bind(this._dragLeaveEvent, this));
            this.$el.bind("drop", _.bind(this._dropEvent, this));

            this._draghoverClassAdded = false;
            this._draghoverClassAddedFile = false;
            Project.selectedVieww = "";
			this.model.set('friendsThis',[]);
			if(typeof app.userConnected != 'undefined' && 
				typeof app.userConnected.data2 != 'undefined'){
				this.friendsAddedV(app.userConnected.data2.friends);
			}
			this.listenTo(this.model,'change',this.rerenderTasks);
			
        },
        onprojectsUploadFile:function(e){
            if(e.toElement.getAttribute('identity') == this.model.get('_id')){
                this.$el.find('#fileToUpload').trigger('click');
            }
        },
        _fileChangeEvent: function(e){
            if(e.target.getAttribute('identity') == this.model.get('_id')){
                console.log('files:', e.target.files);
                this.uploadFilesToServer(e.target.files);
                //this.$el.find('#fileToUpload').val('');
            }
        },
        _dragOverEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault) e.preventDefault()
                e.dataTransfer.dropEffect = 'copy' // default
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
            if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting

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

        dragLeave: function (data, dataTransfer, e) { // optionally override me
            if (this._draghoverClassAdded){
                if(this.model.get('isHeader')){
                    this.$el.removeClass("draghover");
                }else{
                    this.$el.removeClass("dragHoverElement");
                }
            }
            /*if(e.currentTarget.getAttribute('class') == 'headerMain' && !this.model.get('isHeader') && Project.selectedVieww == ""){
                $('.project_one_good_loading').hide();
                $("#dragHoverElement").remove();
                $("#dragHoverElementHeader").remove();
            }*/
        },
		getFilesHtmlWithOrWithout: function(wOrw){
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(files[i] != 'undefined') {
						var delFile= '';
						if(wOrw){
							delFile = '<input file_name="'+files[i]+'" type="checkbox" class="delete_files">'+app.translate('Delete');
						}
                        files_in += '<div class="fileOneProjectInModel"><a target="_blank" href="/files/project_managing_files/'+this.model.get('_id')+'/'+files[i]+'">'+files[i]+'</a> '+delFile+'</div>';
                    }
                }
                return files_in;
            }
            return '';
		},
        renderr: function(){
			return this.getFilesHtmlWithOrWithout(true);
        },
        uploadFilesToServer: function(files){
            var fd = new FormData();
            fd.append("project", this.model.get('_id'));
            fd.append("pfiles", this.model.get('files'));
            var files_in = this.model.get('files')[0];
            for (var i in files) {
                if(files[i].name != 'undefined' && files[i].name != 'item'){
                    files_in += ','+files[i].name;
                }
                fd.append("uploadedFile", files[i]);
            }
            this.model.set('files', [files_in]);
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(oEvent){
                if(!$('#project_'+this.model.get('_id')+' #progress').length){
                    $('#project_'+this.model.get('_id')).append('<div id="progress" style="color:white;background:red;"></div>');
                }
                if (oEvent.lengthComputable) {
                    var percentComplete = oEvent.loaded / oEvent.total;
                    $('#project_'+this.model.get('_id')+' #progress').css('height', '10px');
                    $('#project_'+this.model.get('_id')+' #progress').css('width', (percentComplete*100)+'%');
                } else {
                    $('#project_'+this.model.get('_id')+' #progress').html(app.translate('Uploading ... '));
                }
            }.bind(this), false);
             xhr.addEventListener("load", function(){
                 $('#project_'+this.model.get('_id')+' #progress').remove();
             }.bind(this), false);
            //xhr.addEventListener("error", uploadFailed, false);
            //xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "/project_upload");
            //scope.progressVisible = true;
            xhr.send(fd);
        },
        drop: function (data, dataTransfer, e) {
            if(Project.selectedVieww == "" && !this.model.get('isHeader')){
                this.uploadFilesToServer(dataTransfer.files);
            }/*else{
            if(!Project.selectedVieww.model.get('isHeader')){
                var inHeader = this.model.get('inHeader');
                if(this.model.get('isHeader')){
                    inHeader = this.model.get('_id');
                }
                Project.selectedVieww.model.set('id', Project.selectedVieww.model.get('_id'));
                Project.selectedVieww.model.set('inHeader', inHeader);
                Project.selectedVieww.model.save();
                Project.selectedVieww.model.set('positionLayerY', e.layerY);
                Project.selectedVieww.model.set('positionModelId', this.model.get('_id'));
                Project.selectedVieww.model.set('positionModelIsHeader', this.model.get('isHeader'));
            }else{
                Project.selectedVieww.model.set('id', Project.selectedVieww.model.get('_id'));

                var plus = 0;
                if(!this.model.get('isHeader')){
                    plus = 25;
                }
                var widthX = parseInt(e.x/(e.currentTarget.clientWidth+plus));
                var width_sub = (widthX*(e.currentTarget.clientWidth+plus));
                if(widthX == 0){
                    width_sub = 0;
                }
                var layerX= ((e.x-width_sub)/2)+1;

                Project.selectedVieww.model.set('positionLayerX', layerX);
                var inHeaderId = this.model.get('_id');
                if(!this.model.get('isHeader')){
                    inHeaderId = this.model.get('inHeader');
                }
                Project.selectedVieww.model.set('positionModelIdX', inHeaderId);
            }
            }*/
            Project.selectedVieww = "";
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
        },

        _dragStartEvent:function(e){
            var data
            if (e.originalEvent) e = e.originalEvent
            e.dataTransfer.effectAllowed = "copy" // default to copy
            data = this.dragStart(e.dataTransfer, e)

            window._backboneDragDropObject = null
            if (data !== undefined) {
                window._backboneDragDropObject = data // we cant bind an object directly because it has to be a string, json just won't do
            }
        },
        dragStart: function (dataTransfer, e) {
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
            if(Project.selectedVieww == ""){
                Project.selectedVieww = this;
            }
        },
        onpprojectMain: function(e){
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
        },
        onprojectsEdit: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                var myModel = this.model;
                this.editDialog(myModel);
            }
        },
		rerenderComments: function(){
			var th = this;
			var comments = this.commentsCol.get('messages');
			var commObj = this.getCommentsHistoryObj(comments);
					var commHtml = commObj.commHtml;
					var historyHtml = commObj.historyHtml;
					var commCount = commObj.commCount;
					var historyyCount = commObj.historyyCount;
			setTimeout(function(){
				if($('#commentsOfT').length){
					$('#history_edit_view').html(app.translate('History ')+'(<span id="historyNumb">'+historyyCount+'</span>)');
					$('#comments_edit_view').html(app.translate('Comments ')+'(<span id="commentsNumb">'+commCount+'</span>)');
					$('#historyOfT').html(historyHtml);
					$('#commentsOfT').html(commHtml);
						th.listenToRemoveComment(th);
				}
			}, 200);
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
		getTasksViewButtons: function(){
			var tasksHtml = '';
		tasksHtml += '<div>';
		tasksHtml += '	<button id="add_task_edit_view" class="buttonChange">'+app.translate("Add From To")+'</button>';
		tasksHtml += '	<button id="add_task_to_edit_view" class="buttonChange">'+app.translate("Add To")+'</button>';
		tasksHtml += '	<button id="save_task_edit_view" style="display:none;" class="buttonChange">'+app.translate("Save")+'</button>';
		tasksHtml += '	<div id="add_tasks_new_view"></div>';
		tasksHtml += '</div>';
		return tasksHtml;
		},
		rerenderTasks: function(){
			setTimeout(function(){
				$('#tasksViewAllIn').html(this.getTasksView());
				$('#tasksNumb').html(this.model.get('tasks').length);
				this.listenToRemoveTask();
			}.bind(this),200);
		},
		saveTasks: function(){
			var th = this;
			$( ".addOneTaskToIt" ).each(function( index ) {
				var about = $( this ).find('.addClassTaskAbout').val();
				var from = $( this ).find('.addClassTaskFrom').val();
				var fromTime = $( this ).find('.addClassTaskFromTime').val();
				var to = $( this ).find('.addClassTaskTo').val();
				var toTime = $( this ).find('.addClassTaskToTime').val();

			  if(about != '' && from != '' && fromTime != '' && to != '' && toTime!= '' ){
				var myModel = th.model;
				myModel.set('id', myModel.get('_id'));
				var taskObj = {date:th.getTimeNow(), about:about, from:from, to:to, fromTime:fromTime, toTime:toTime};
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
			$( ".addOneTaskToItOnlyOne" ).each(function( index ) {
				var about = $( this ).find('.addClassTaskAbout').val();
				var to = $( this ).find('.addClassTaskToOne').val();
				var toTime = $( this ).find('.addClassTaskToOneTime').val();
			  if(about != '' && to != '' && toTime!= '' ){
				var myModel = th.model;
				var taskObj = {date:th.getTimeNow(), about:about, from:'', to:to, fromTime:'', toTime:toTime};
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
		addTaskTo: function(){
			var rightNow = new Date();
			var tdate = rightNow.toISOString().slice(0,10);
			$('#save_task_edit_view').show();
			var taskNew = '<div class="addOneTaskToItOnlyOne"><input type="text" class="addClassTaskAbout" placeholder="'+app.translate('About')+'" /> '+app.translate('To')+': <input type="date" class="addClassTaskToOne" value="'+tdate+'" /> <input type="time" class="addClassTaskToOneTime" value="00:00" />';
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
			taskNew += ''+app.translate('To')+': <input type="date" class="addClassTaskTo" value="'+todate+'" /> <input type="time" class="addClassTaskToTime" value="00:00" /></div>';
			$('#add_tasks_new_view').append(taskNew);
		},
		getTasksView: function(){
			var tasks = this.model.get('tasks');
			var tasksHtml = '';
				for(var i=0; i < tasks.length; i++){
					if(typeof tasks[i] != 'undefined' && tasks[i] != null){
						tasksHtml+='<div class="commentInModal" id="tasksUnId'+tasks[i].date.replace(/ /g,'').replace(/:/g,'')+'">';
						tasksHtml+= '<div>'+tasks[i].about+' <span style="font-size:12px;">'+tasks[i].date+'</span>';
						tasksHtml+= '<button data-date="'+tasks[i].date+'" class="background_comment removeTaskOne"><span data-date="'+tasks[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
						tasksHtml+= '</div>';
						if(tasks[i].from != ''){
							tasksHtml += '<div>'+tasks[i].from+'<span style="padding-left:5px;">'+tasks[i].fromTime+'</span></div>';
						}
						tasksHtml += '<div>'+tasks[i].to+'<span style="padding-left:5px;">'+tasks[i].toTime+'</span></div>';
						tasksHtml += '</div>';
					}
				}
			return tasksHtml;
		},
		getCommentsHistoryObj: function(comments){
					var commHtml = '';
					var historyHtml = '';
					var commCount = 0;
					var historyyCount = 0;
					
					for(var i=0; i < comments.length; i++){
						if(comments[i].message.indexOf('hhhhistoryyy') > -1){
							historyyCount++;
							var msgComm = comments[i].message.replace(/hhhhistoryyy/g,'');
							historyHtml+= '<div class="commentInModal" id="commentUnId'+comments[i].date.replace(/ /g,'').replace(/:/g,'')+'">'+this.escapeHtml(comments[i].from+': '+msgComm)+'</div>';
						}else{
							var removeComm = '<button data-date="'+comments[i].date+'" class="background_comment removeComment"><span data-date="'+comments[i].date+'" class="glyphicon glyphicon-remove icon-in-menu icon-turn-off"></span></button>';
							commCount++;
							commHtml+= '<div class="commentInModal" id="commentUnId'+comments[i].date.replace(/ /g,'').replace(/:/g,'')+'">'+this.escapeHtml(comments[i].from+': '+comments[i].message)+removeComm+'</div>';
						}
					}
					return {commHtml:commHtml, historyHtml:historyHtml,commCount:commCount,historyyCount:historyyCount };
		},
		listenToRemoveTask: function(){
						$('.removeTaskOne').unbind();
						$('.removeTaskOne').click(function(e){
							var date = e.toElement.getAttribute('data-date');
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
											var numbC = parseInt($('#tasksNumb').html());
											$('#tasksNumb').html(numbC-1);
										}
									}
								}
							  }
						}.bind(this));
		},
		listenToRemoveComment: function(){
						$('.removeComment').unbind();
						$('.removeComment').click(function(e){
							var commentDate = e.toElement.getAttribute('data-date');

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
								   var numbC = parseInt($('#commentsNumb').html());
								   $('#commentsNumb').html(numbC-1);
								}
							}
							
						}.bind(this));
		},
        editDialog: function(myModel){
            var th = this;
			var historyVisible = false;
			var commentsVisible = true;
			app.CurrentCommentsView = this;
			var commentHtml = '';
			var commentsCol = app.getCommentsCol(this.model.get('_id'));
			if(commentsCol === ''){
				commentsCol = new Project();
				app.vent.trigger('add:cachedComments:resource', {_id:this.model.get('_id'),data: commentsCol});
				commentsCol.url = '/comments/'+this.model.get('_id')+'/'+0;
			}
			this.commentsCol = commentsCol;
				commentsCol.fetch().done(function(){
					var comments = commentsCol.get('messages');
					var getCommObj = th.getCommentsHistoryObj(comments);
					var commHtml = getCommObj.commHtml;
					var historyHtml = getCommObj.historyHtml;
					var commCount = getCommObj.commCount;
					var historyyCount = getCommObj.historyyCount;
					commentHtml = commHtml;
					setTimeout(function(){
						$('#history_edit_view').html(app.translate('History ')+'(<span id="historyNumb">'+historyyCount+'</span>)');
						$('#comments_edit_view').html(app.translate('Comments ')+'(<span id="commentsNumb">'+commCount+'</span>)');
						$('#historyOfT').html(historyHtml);
						$('#commentsOfT').html(commHtml);
					}, 200);
				var writeAComment = '<div style="clear:both;"></div>';
				writeAComment += '<div>';
				writeAComment += '<textarea class="commentsWidthAll" id="commentAddminiEditView"></textarea>';
				writeAComment += '</div>';
				writeAComment += '<div><button class="buttonChange" id="commentSubmitminiEditView" data-pid="'+commentsCol.get('_id')+'">'+app.translate('Add comment')+'</button></div>';
					setTimeout(function(){
						th.listenToRemoveTask(th);
						th.listenToRemoveComment(th);
						$('#commentsAddMore').html(writeAComment);
						$('#add_task_to_edit_view').click(function(e){
							th.addTaskTo();
						});
						$('#save_task_edit_view').click(function(e){
							th.saveTasks();
						});
						$('#add_task_edit_view').click(function(e){
							th.addTask();
						});
						$('#tasks_edit_view').click(function(){
							th.setorRemoveButtonChangeActiveClass('#tasks_edit_view');
							$('#tasksOfT').toggle();
							if($('#historyOfT').is(':visible')){
								$('#historyOfT').toggle();
							}
							if($('#commentsOfT').is(':visible')){
								$('#commentsOfT').toggle();
							}
						});
						$('#history_edit_view').click(function(){
							th.setorRemoveButtonChangeActiveClass('#history_edit_view');
							$('#historyOfT').toggle();
							if($('#tasksOfT').is(':visible')){
								$('#tasksOfT').toggle();
							}
							if($('#commentsOfT').is(':visible')){
								$('#commentsOfT').toggle();
							}
							this.historyVisible = $('#historyOfT').is(':visible');
							this.commentsVisible = $('#commentsOfT').is(':visible');
						});
						$('#comments_edit_view').click(function(){
							th.setorRemoveButtonChangeActiveClass('#comments_edit_view');
							$('#commentsOfT').toggle();
							if($('#historyOfT').is(':visible')){
								$('#historyOfT').toggle();
							}
							if($('#tasksOfT').is(':visible')){
								$('#tasksOfT').toggle();
							}
							this.commentsVisible = $('#commentsOfT').is(':visible');
							this.historyVisible = $('#historyOfT').is(':visible');
						});
						$('#commentSubmitminiEditView').click(function(){
							var idOf = commentsCol.get('_id');
							var comments = $('#commentAddminiEditView').val();
							if(comments != ''){
								th.addComment(comments, idOf);
							}
							$('#commentAddminiEditView').val('');
						}.bind(this));
					}, 200);
				}.bind(this));
            app.commands.execute("app:dialog:confirm", {
                icon: '',
                title: '',
                message: '<textarea class="modalTextareaMine form-control" id="name">'+this.model.get('name')+'</textarea>'+
                '<textarea class="modalTextareaMine form-control" id="text">'+this.model.get('text')+'</textarea>'+
                '<input type="color" class="modalTextareaMine form-control" id="color" value="'+this.model.get('color')+'" />'+
                '<input type="text" class="modalTextareaMine form-control" id="friendsThere" placeholder="'+app.translate('Who is working')+'" value="'+this.model.get('friendsThere')+'" />'+
                this.friendsHtmlV(app.userConnected.data2.friends)+' '+
                this.friendsAddedV(app.userConnected.data2.friends)+
                this.renderr()+
				'<div id="commentsAddMore"></div>'+
				'<div><button id="history_edit_view" class="buttonChange">('+app.translate('History')+')</button>'+
				'<button id="comments_edit_view" class="buttonChange buttonChangeActive">('+app.translate('Comments')+')</button>'+
				'<button id="tasks_edit_view" class="buttonChange">'+app.translate('Tasks')+'(<span id="tasksNumb">'+this.model.get('tasks').length+'</span>)</button>'+
				'</div>'+
				'<div id="commentsOfT" style="display:block;"></div><div id="historyOfT"></div><div id="tasksOfT" style="display:none;">'+this.getTasksViewButtons()+'<div id="tasksViewAllIn">'+this.getTasksView()+'</div>'+'</div>',
                confirmNo: function() {
                },
                confirmYes: function() {
					var whatChanged = 'hhhhistoryyy';
                    var delete_files = [];
                        $('.delete_files').each(function(i, obj) {
                            if($(this).is(':checked')){
                                delete_files.push($(this).attr('file_name'));
								whatChanged += app.translate('Deleted file: ')+$(this).attr('file_name')+' ';
                            }
                        });
                    var filess = th.eraseFiles(delete_files);
                    var removed_ff = $('#remove_friend_f_f').val();
                    var add_ff = $('#friendAddToEntry').val();
                    myModel.set('friendDeleteEntry', '');
                    myModel.set('friendAddToEntry', '');
                    if(removed_ff !== ''){
                        myModel.set('friendDeleteEntry', removed_ff);
                        myModel.removeFromFriends(removed_ff);
						whatChanged+= app.translate('Removed friend: ')+removed_ff+' ';
                    }
                    if(add_ff !== ''){
                        myModel.set('friendAddToEntry', add_ff);
                        myModel.addToFriends(add_ff);
						whatChanged+= app.translate('Added friend: ')+add_ff+' ';
                    }
                    myModel.set('id', myModel.get('_id'));
                    myModel.set('files', [filess]);
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
                    myModel.set('name', $('#name').val());
                    myModel.set('text', $('#text').val());
                    myModel.set('color', $('#color').val());
                    myModel.set('friendsThere', $('#friendsThere').val());
                    myModel.save();
                    $('#text_id'+myModel.get('_id')).html($('#text').val());
					if(!myModel.get('isHeader')){
						$('#text_id'+myModel.get('_id')).attr('style','background: '+$('#color').val());
						$('#project_'+myModel.get('_id')).attr('style','position:relative; border: 1px solid '+$('#color').val());
						$('#project_'+myModel.get('_id')+' .glyphicon-list-alt').attr('style','color:'+$('#color').val());
					}else{
						$('#project_'+myModel.get('_id')).attr('style','background: '+$('#color').val());
					}
                    th.friendsAddedV(app.userConnected.data2.friends);
					$('#friendsInThisProjects'+myModel.get('_id')).html(th.friendsGetHtmlToChange());
					this.trigger('project:edit');
					if(whatChanged != '' && whatChanged != 'hhhhistoryyy'){
						th.addComment(whatChanged,commentsCol.get('_id'));
					}
                }
            });
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
				for(var i=0; i < fr.split(',').length; i++){
					friendsHtml += '<div class="friendInProjectMini">'+fr[i]+'</div>';
				}
			}
			return friendsHtml;
		},
        friendsAddedV: function(friends){
            var html = '<select name="remove_friend_f_f" class="modalSelectMine" id="remove_friend_f_f">';
            html += '<option value="">'+app.translate('Remove friend')+'</option>';
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
        friendsHtmlV: function(friends){
            var html = '<select name="friendAddToEntry" class="modalSelectMine" id="friendAddToEntry">';
            html += '<option value="">'+app.translate('Add friend')+'</option>';
            for(var i=0; i < friends.length; i++){
                var canChoose = true;
                var ffriends = this.model.get('friends');
                if(ffriends.length > 0 && ffriends !== ''){
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
            html += '</select>';
            return html;
        },
        eraseFiles: function(files_delete){
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(files[i] != 'undefined' && !$.inArray(files[i], files_delete)) {
                        if(i==0){
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
            }
        }
    });
});
