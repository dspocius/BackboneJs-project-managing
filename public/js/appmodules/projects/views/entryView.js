define([
	'../../../app',
	'../../../config',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/entry.html',
	'models/project',
	'views/BaseRowView',
	'../../viewmodules/customData/countDataView'
], function (app, config, templateHelpers, _, Marionette, templ, Project, BaseRowView, countDataView) {
    'use strict';

    return BaseRowView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        ui:{
            projectMain:'.projectMain'
        },
        events:{
                        'click #open_edit_in_project': 'open_edit_in_project',
                        'click .right_model_menu': 'right_model_menu',
                        'click #set_html_editor': 'set_html_editor',
                        'click #set_normal_editor': 'set_normal_editor',
                        'click #update_general_info': 'update_general_info',
                        'keyup .textarea_title': 'field_changed_data',
                        'keyup .description_textarea': 'field_changed_data',
                        'change .color_input_data': 'field_changed_data',
                        'change #view_main_on_project_showing': 'field_changed_data',
                        'keyup .who_is_working_input': 'field_changed_data',
                        'click #commentSubmitminiEditView': 'commentSubmitminiEditView',
                        //'click #add_task_reccurence_edit_view': 'addTaskRecc',
                       // 'click #add_task_estimate_edit_view': 'addTaskEstim',
                        //'click #add_task_to_edit_view': 'addTaskTo',
                        //'click #save_task_edit_view': 'saveTasks',
                        //'click #add_task_edit_view': 'addTask',
                        'change #fileToUpload': '_fileChangeEvent',
                        'change .fileToUploadClient': '_fileChangeEvent',
                        'change #friendAddToEntry': 'friendAddToEntry',
                        'click .friends_remove_one': 'friends_remove_one',
                        'click .projectsUploadFileDialog': 'onprojectsUploadFile',
                        //'click .removeTaskOne': 'listenToRemoveTask',
                        'click .use_files_one': 'use_files_one',
                        'click .remove_use_files_one': 'remove_use_files_one',
                        'click .delete_files_one': 'delete_files_one',
                        'click #visible_to_all': 'visible_to_all',
                        'click #visible_to_all_edit': 'visible_to_all_edit',
                        'click #visible_to_none': 'visible_to_none',
                        'click #visible_to_none_edit': 'visible_to_none_edit',
                        'click #visible_to_all_comment': 'visible_to_all_comment',
                        'click #visible_to_none_comment_edit': 'visible_to_none_comment_edit',
						'click #friends_comments_id': 'friends_comments_id',
                        'click #friends_publ_id': 'friends_publ_id',
                        'click #friends_edit_id': 'friends_edit_id',
                        'click .removeComment': 'listenToRemoveComment'
        },
		open_edit_in_project: function(){
			$("#entry_right_meniu_modal").toggle();
		},
		setorRemoveButtonChangeActiveClass: function(id){
			var hasClass = $(id).hasClass('inEntryViewButtonsActive');
			$('.inEntryViewButtonsActive').removeClass('inEntryViewButtonsActive');
			if(!hasClass){
				$(id).addClass('inEntryViewButtonsActive');
			}
		},
		/*removeTaskOne: function(e){
			var date = e.currentTarget.getAttribute('data-date');
			  if(date != '' ){
				var myModel = this.model;
				myModel.set('id', myModel.get('_id'));
				myModel.set('TaskRemove',date);
				myModel.url = '/projectTasks/'+myModel.get('_id');
				myModel.set('TaskAdd','');
				myModel.save();
				var tasks = myModel.get('tasks');
				for(var i = tasks.length - 1; i >= 0; i--){
					if(typeof tasks[i] != 'undefined' && 
					tasks[i] != null && 
					tasks[i].date === date) {
					   tasks.splice(i, 1);
					}
				}
				this.render();
			  }
		},
		tasksToggle:function(){
			this.setorRemoveButtonChangeActiveClass('#tasks_edit_view');
			$('#tasks').toggle();
			if($('#comments').is(':visible')){
				$('#comments').toggle();
			}
			if($('#history').is(':visible')){
				$('#history').toggle();
			}
			this.commentsVisible = $('#comments').is(':visible');
			this.historyVisible = $('#history').is(':visible');
			this.tasksVisible = $('#tasks').is(':visible');
		},*/
		commentsToggle:function(){
			this.setorRemoveButtonChangeActiveClass('#comments_edit_view');
			$('#comments').toggle();
			if($('#history').is(':visible')){
				$('#history').toggle();
			}
			if($('#tasks').is(':visible')){
				$('#tasks').toggle();
			}
			this.commentsVisible = $('#comments').is(':visible');
			this.historyVisible = $('#history').is(':visible');
			this.tasksVisible = $('#tasks').is(':visible');
		},
		historyToggle:function(){
			this.setorRemoveButtonChangeActiveClass('#history_edit_view');
			$('#history').toggle();
			if($('#comments').is(':visible')){
				$('#comments').toggle();
			}
			if($('#tasks').is(':visible')){
				$('#tasks').toggle();
			}
			this.historyVisible = $('#history').is(':visible');
			this.commentsVisible = $('#comments').is(':visible');
			this.tasksVisible = $('#tasks').is(':visible');
		},
		removeComment: function(e){
			var date = e.currentTarget.getAttribute('data-date');
			this.trigger('delete:comment',date);
		},
		addComment: function(){
			var comment = $('#commentAdd').val();
			if(comment != ''){
				this.trigger('add:comment',comment);
			}
		},
        onremoveFriendFromList: function(e){
            var myModel = this.model;
            myModel.set('id', myModel.get('_id'));
            myModel.set('friendDeleteEntry', e.currentTarget.getAttribute('pid'));
            myModel.set('friendAddToEntry', '');
            myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
            myModel.save();
            this.model.removeFromFriends(e.currentTarget.getAttribute('pid'));
                this.model.set('cChooseFriends', this.friendsHtmlV(app.userConnected.data2.friends));
                this.model.set('cFriendsOn', this.friendsAddedV(app.userConnected.data2.friends));
                this.render();
        },
        onprojectsEdit: function(e){
			if(!$('#editing_text_name').is(':visible')){
				$('#editing_text_name').show();
				$('#simple_text_name').hide();
				$('.projectsEdit').removeClass('glyphicon-edit');
				$('.projectsEdit').addClass('glyphicon-ok');
				return;
			}else{
				$('#editing_text_name').hide();
				$('#simple_text_name').show();
				$('.projectsEdit').removeClass('glyphicon-ok');
				$('.projectsEdit').addClass('glyphicon-edit');
			}
            var delete_files = [];
			var whatChanged = 'hhhhistoryyy';
            $('.delete_files').each(function(i, obj) {
                if($(this).is(':checked')){
                    delete_files.push($(this).attr('file_name'));
					whatChanged += app.translate('Deleted file: ')+$(this).attr('file_name')+' ';
                }
            });
            var filess = this.eraseFiles(delete_files);
            var myModel = this.model;
            myModel.set('id', myModel.get('_id'));
            myModel.set('files', [filess]);
            myModel.set('friendDeleteEntry', '');
			var friendsEntry = $("#friendAddToEntry").val();
			if(friendsEntry !== '' && typeof friendsEntry != 'undefined'){
				myModel.set('friendAddToEntry', $("#friendAddToEntry").val());
			}
            myModel.set('friendsThere', $("#friendsThere").val());
			
			if(myModel.get('name') !== $('#projectName').val()){
				whatChanged+= app.translate('Changed name from: ')+myModel.get('name')+' ';
				whatChanged+= app.translate('Changed name to: ')+$('#projectName').val()+' ';
			}
			if(myModel.get('text') !== $('#projectText').val()){
				whatChanged+= app.translate('Changed description from: ')+myModel.get('text')+' ';
				whatChanged+= app.translate('Changed description to: ')+$('#projectText').val()+' ';
			}
			if(myModel.get('color').toUpperCase() !== $('#color').val().toUpperCase()){
				whatChanged+= app.translate('Changed color from: ')+myModel.get('color')+' ';
				whatChanged+= app.translate('Changed color to: ')+$('#color').val()+' ';
			}
			
            myModel.set('text', $('#projectText').val());
            myModel.set('name', $('#projectName').val());
            myModel.set('color', $('#color').val());
            myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
            myModel.save();
			if(friendsEntry !== '' && typeof friendsEntry != 'undefined'){
                this.model.addToFriends(friendsEntry);
                //this.model.set('friends', newModell);
                this.model.set('cChooseFriends', this.friendsHtmlV(app.userConnected.data2.friends));
                this.model.set('cFriendsOn', this.friendsAddedV(app.userConnected.data2.friends));
                this.render();
				whatChanged+= app.translate('Added friend: ')+friendsEntry+' ';
            }
			if(whatChanged != '' && whatChanged != 'hhhhistoryyy'){
				this.trigger('add:comment',whatChanged);
			}
        },
        onprojectsDelete: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                this.model.url = config.urlAddr+'/project/'+this.model.get('_id');
				
				var myModel = this;
            app.commands.execute("app:dialog:confirm", {
                icon: 'info-sign',
                title: app.translate('Delete action'),
                message: app.translate('Do you really want to delete ')+myModel.model.get('text')+' ?',
                confirmNo: function() {
                },
                confirmYes: function() {
					myModel.model.destroy();
					if(myModel.model.get('inProjects') != ""){
						Backbone.history.navigate('#project/'+myModel.model.get('inProjects'),{ trigger:true, replace: true });
					}else{
						Backbone.history.navigate('#home',{ trigger:true, replace: true });
					}
                }
            });
				
            }
        },
        renderr: function(){
            /*if(this.model.get('files') != '' &&
                Array.isArray(this.model.get('files'))){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (var i in files) {
                    if(typeof files[i] != 'undefined' && files[i] != 'undefined' && files[i] != '' && files[i] != null) {
                        files_in += '<a href="'+config.filesurl+'/files/project_managing_files/'+this.model.get('_id')+'/'+files[i]+'">'+files[i]+'</a> <input file_name="'+files[i]+'" type="checkbox" class="delete_files"> '+app.translate('Delete')+'<br/>';
                    }
                }
                return files_in;
            }*/
            return '';
        },
        initialize: function(){
            this.$el.attr("pid", this.model.get('_id'));
            this.model.set('cFriendsOn', '');
            this.model.set('cChooseFriends', '');
            this.model.set('cFiles',this.renderr());
            if(typeof app.userConnected.data2 !== 'undefined'){
                this.model.set('cChooseFriends', this.friendsHtmlV(app.userConnected.data2.friends));
                this.model.set('cFriendsOn', this.friendsAddedV(app.userConnected.data2.friends));
                this.render();
            }else{
                /*app.vent.on("userConnected:ready", function(){
                    this.model.set('cChooseFriends', this.friendsHtmlV(app.userConnected.data2.friends));
                    this.model.set('cFriendsOn', this.friendsAddedV(app.userConnected.data2.friends));
                    this.render();
                }.bind(this));*/
            }
			this.historyVisible = false;
			this.commentsVisible = false;
			this.tasksVisible = false;
			/*this.listenTo(this.model,'change',function(){
				this.model.set('cFiles',this.renderr());
				this.rerenderTasks();
				this.render();
			}.bind(this));*/
			this.listenTo(this.model,'change',this.renderNav);
			this.listenTo(this.model,'change',this.rerenderEverything);
			countDataView.setModel(this.model);
			countDataView.innerHtml();
        },
        friendsAddedV: function(friends){
            var html = '<div id="friendThereInEntry">';
                var ffriends = this.model.get('friends');
            if(typeof ffriends !== "undefined" && typeof ffriends.length !== "undefined"){
                for(var jj=0; jj < ffriends.length; jj++){
                    var name = 'Friend was removed';
					if(typeof friends !== "undefined" && typeof friends.length !== "undefined"){
						for(var ii=0; ii < friends.length; ii++){
							if(friends[ii]._id === ffriends[jj]._id){
								name = friends[ii].firstname+' '+friends[ii].lastname;
							}
						}
                    }
                    html += '<div id="">'+name+' <span style="cursor:pointer" pid="'+ffriends[jj]._id+'" class="removeFriendFromList">'+app.translate('Remove')+'</span>'+'</div>';
                }
            }
            html += '</div>';
            return html;
        },
        _dropEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (e.preventDefault) e.preventDefault()
            if (e.stopPropagation) e.stopPropagation() // stops the browser from redirecting

            if (this._draghoverClassAdded) this.$el.removeClass("draghover")

            this.drop(data, e.dataTransfer, e)
        },
        drop: function (data, dataTransfer, e) {
            this.uploadFilesToServer(dataTransfer.files);
            $('.project_one_good_loading').hide();
        },
        _dragOverEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault) e.preventDefault()
                e.dataTransfer.dropEffect = 'copy' // default
            }
        },
        dragOver: function (data, dataTransfer, e) {
            var ok = dataTransfer && dataTransfer.types && dataTransfer.types.indexOf('Files') >= 0;
                if(ok){
                    if(!this.model.get('isHeader')){
                        this._draghoverClassAddedFile = true;
                        $('.project_one_good_loading').hide();
                        this.$el.find('.project_one_good_loading').show();
                    }
                }
        },
        findNavigation: function(projectsInT){
            var pmodel_th = {modelName:"Project",isMore:''};
            if(typeof this.options.mainP != 'undefined'){
                if(typeof this.options.mainP.mainProject.get(projectsInT) !== 'undefined'){
                    pmodel_th = {modelName:this.options.mainP.mainProject.get(projectsInT).get('text'),isMore:''};
                }
            }
            if(typeof this.options.projectsAll != 'undefined' && pmodel_th.modelName === 'Project'){
                for(var jj=0; jj < this.options.projectsAll.length;jj++){
                    if(typeof this.options.projectsAll[jj].get(projectsInT) !== 'undefined'){
                        pmodel_th = {modelName:this.options.projectsAll[jj].get(projectsInT).get('text'),isMore:this.options.projectsAll[jj].get(projectsInT).get('inProjects')};
                    }
                }
            }
            return pmodel_th;
        },
        searchNavigation: function(projectsInT){
            var g_ret = "";
            if(typeof projectsInT != 'undefined'){
                for(var ii=0; ii < projectsInT.length; ii++){
                    if(projectsInT[ii] !== ''){
                        var pmodel_th = this.findNavigation(projectsInT[ii]);
                        if(pmodel_th.isMore !== ''){
                            g_ret += this.searchNavigation(pmodel_th.isMore);
                        }
                        g_ret += ' - <a href="#/project/'+projectsInT[ii]+'">'+pmodel_th.modelName+'</a>';
                    }
                }
            }
            return g_ret;
        },
        searchRoute: function(projectsInT){
            return this.searchNavigation([projectsInT]);
        },
        renderNavigation: function(){
            if(typeof this.options.navigationModel != 'undefined'){
                var navLinks = app.getDefaultRoots();
				if(typeof app.userData != "undefined" && this.options.navigationModel.get("email") !== app.userData.email){
					navLinks += "- <a href='/#/"+this.options.navigationModel.get("email")+"'>"+this.options.navigationModel.get("email")+"</a>";
				}
                var projectsInT = this.options.navigationModel.get('inProjects');
                if(typeof projectsInT != 'undefined'){
                    navLinks += this.searchRoute(projectsInT);
                    navLinks += ' - '+this.model.get("text");
                }
                $('#navigation_main').html(navLinks);
            }
        },
        renderNav: function(){
			$("#name_entry").html(this.model.get("name"));
			$("#text_entry").html(this.model.get("text"));
			this.renderNavigation();
		},
        onRender: function(){
			var th = this;
            this.renderNavigation();
			$('.inEntryViewButtons').removeClass('inEntryViewButtonsActive');
			if(this.historyVisible){
				$('#history_edit_view').addClass('inEntryViewButtonsActive');
				$('#history').show();
			}else{
				$('#history').hide();
			}
			if(this.tasksVisible){
				$('#tasks').show();
				$('#tasks_edit_view').addClass('inEntryViewButtonsActive');
			}else{
				$('#tasks').hide();
			}
			if(this.commentsVisible){
				$('#comments_edit_view').addClass('inEntryViewButtonsActive');
				$('#comments').show();
			}else{
				$('#comments').hide();
			}
			var whatToShow = this.model.get("what_to_show");
			if(typeof app.userData != "undefined" && this.model.get("email") == app.userData.email){
				whatToShow = "all";
			}
			if(whatToShow === "all"){
				$("#entry_right_meniu_modal").html(this.getEditDialogWindowHtml());
				var comm = this.rerenderComments.bind(this);
				comm();
			}
			if(whatToShow === "comments"){
				$("#entry_right_meniu_modal").html(this.getEditDialogWindowHtml("only_comments"));
				var comm = this.rerenderComments.bind(this);
				comm();
			}
			if(whatToShow === "nothing"){
				$("#entry_right_meniu_modal").hide();
			}
			$("#updateAllTheViewNotDisplayed").click(function(e){
				th.render();
			});

			//'change .fileToUploadClient': '_fileChangeEvent'
			$(".projectsUploadFileDialog").click(this.onprojectsUploadFile.bind(this));
			$(".delete_files_one").click(this.delete_files_one.bind(this));
			
            $(".forms_data_info_class select").change(function(e){
                var dateOfIt = e.currentTarget.getAttribute('date-date');
                var valueOfitt = $(this).val();
                var fforms = JSON.parse(th.model.get("forms_data_info"));
                var selectedOne = "";
                for(var ii=0; ii < fforms.length; ii++){
                    if(fforms[ii].date === dateOfIt){
                        selectedOne = fforms[ii];
                    }
                }
                if(valueOfitt !== "" && valueOfitt !== "-"){
					$(this).css("border", "none");
				}else{
					$(this).css("border", "1px solid red");
				}
                if(selectedOne !== ""){
                    selectedOne.defaultValue = valueOfitt;
                    th.model.set('forms_data_info', JSON.stringify(fforms));
                }
                //th.render();
            });
            $(".forms_data_info_class input").change(function(e){
                var dateOfIt = e.currentTarget.getAttribute('date-date');
                var valueOfitt = $(this).val();
				if(valueOfitt != ""){
					$(this).css("border", "none");
				}else{
					$(this).css("border", "1px solid red");
				}
				if($(this).attr('type') == "Radio"){
						var radCheck = $(this).val();
						if(typeof radCheck != "undefined" && radCheck != "" && radCheck != "-"){
							$(this).parent().parent().css("border", "none");
							$(this).parent().parent().css("padding-left", "0px");
						}else{
							$(this).parent().parent().css("border", "1px solid red");
							$(this).parent().parent().css("padding-left", "5px");
						}
				}
				if($(this).attr('type') == "Checkbox"){
					valueOfitt = $(this).is(':checked');
				}
                var fforms = JSON.parse(th.model.get("forms_data_info"));
                var selectedOne = "";
                for(var ii=0; ii < fforms.length; ii++){
                    if(fforms[ii].date === dateOfIt){
                        selectedOne = fforms[ii];
                    }
                }
                if(selectedOne !== ""){
                    selectedOne.defaultValue = valueOfitt;
                    th.model.set('forms_data_info', JSON.stringify(fforms));
                }
			});
            $(".forms_data_info_class textarea").change(function(e){
                var dateOfIt = e.currentTarget.getAttribute('date-date');
                var valueOfitt = $(this).val();
				if(valueOfitt != ""){
					$(this).css("border", "1px solid black");
				}else{
					$(this).css("border", "1px solid red");
				}
                var fforms = JSON.parse(th.model.get("forms_data_info"));
                var selectedOne = "";
                for(var ii=0; ii < fforms.length; ii++){
                    if(fforms[ii].date === dateOfIt){
                        selectedOne = fforms[ii];
                    }
                }
                if(selectedOne !== ""){
                    selectedOne.defaultValue = valueOfitt;
                    th.model.set('forms_data_info', JSON.stringify(fforms));
                }
			});
			
			$(".fileToUploadClient").change(function(e){
				this._fileChangeEvent(e);
				//this.render();
			}.bind(this));
			
			$(".submit_button_on_go").click(function(e){
				var everythingOk = true;
				var allRequired = $(".standart_show_forms_required");
				allRequired.each(function(i, obj) {
					var inpType = $(this).find("input").attr("type");
					var selReq = $(this).find("select").val();
					var inpReq = $(this).find("input").val();
					
					var regex = /(<([^>]+)>)/ig;
					var textareaReq = $(this).find("textarea").val();
					
					
					if(typeof selReq !== "undefined" && (selReq == "" || selReq == "-")){
						$(this).find("select").css("border", "1px solid red");
						everythingOk = false;
					}
					if(inpType != "Checkbox" && inpType != "file" && typeof inpReq !== "undefined" && inpReq == ""){
						$(this).find("input").css("border", "1px solid red");
						everythingOk = false;
					}
					if(typeof textareaReq !== "undefined" && textareaReq == ""){
						 $(this).find("textarea").css("border", "1px solid red");
						 everythingOk = false;
					}
					if(inpType == "file" && !$(this).find(".fileOneProjectInModel").length){
						$(this).css("border", "1px solid red");
						$(this).css("padding", "5px");
						everythingOk = false;
					}else{
						if(inpType == "file"){
							$(this).css("border", "none");
							$(this).css("padding", "0px");
						}
					}
					if(inpType == "Radio"){
						var radCheck = $(this).find("input:checked").val();
						if(typeof radCheck != "undefined" && radCheck != "" && radCheck != "-"){
							$(this).css("border", "none");
							$(this).css("padding-left", "0px");
						}else{
							$(this).css("border", "1px solid red");
							$(this).css("padding-left", "5px");
							everythingOk = false;
						}
					}
					
				});
				if(!everythingOk){
					$(".submit_button_on_go").attr("style", "border:1px solid red!important");
				}
				if(everythingOk){
					var fforms = JSON.parse(this.model.get("forms_data_info"));
					var forms_data_inf = [];
					var other_data = [];
					for(var ii=0; ii < fforms.length; ii++){
						if(fforms[ii].type !== "Submit" && fforms[ii].type !== "File" && fforms[ii].type !== "Total" && fforms[ii].type !== "Table" && fforms[ii].type !== "About"){
							var deffValue = fforms[ii].defaultValue;
								
							if(fforms[ii].type === "Checkbox"){
								if(fforms[ii].defaultValue){
									fforms[ii].defaultValue = "true";
									deffValue = "true";
								}else{
									fforms[ii].defaultValue = "false";
									deffValue = "false";
								}
							}
								var regexx = /(<([^>]+)>)/ig;
								deffValue = deffValue.replace(regexx, "");
							if(fforms[ii].type === "List" || fforms[ii].type === "Radio"){
								var selName = "";
								var listdataz = fforms[ii].listdata;
								if(listdataz.length > 0){
									selName = listdataz[0];
								}
								for(var jj=0; jj < listdataz.length; jj++){
									if(listdataz[jj].value === fforms[ii].defaultValue){
										selName = listdataz[jj].name;
									}
								}
								if(typeof selName == 'object'){  if(deffValue == ""){ deffValue = selName.value;   } selName = selName.name; }
								deffValue = deffValue.replace(regexx, "");
								selName = selName.replace(regexx, "");
								deffValue = deffValue+" - "+selName;
							}
							forms_data_inf.push({date: fforms[ii].date, about: fforms[ii].about, defaultValue: deffValue });
						}
					}
					var getFilesUpload = this.model.get("projectclass_uploaded_files_for_user_file");
					if(typeof getFilesUpload !== "undefined" && getFilesUpload !== ""){
						//this.model.set("projectclass_uploaded_files_for_user"+ident, allHtmlFilessz);
						var addingModels = [];
						for(var ii=0; ii < getFilesUpload.length; ii++){
							var infgo = getFilesUpload[ii];
							var fileInf = this.model.get("projectclass_uploaded_files_for_user"+infgo);
							if(addingModels.indexOf(fileInf) == -1){
								addingModels.push(fileInf);
							}
						}
						other_data.push({ array:addingModels, object:{}, data: "Files" });
					}
					var submitted_data = JSON.parse(this.model.get("submitted_data"));
					if(typeof app.userData.email !== "undefined" && app.userData.email != ""){
						var canAddItSubm = true;
						if(canAddItSubm){
							//submitted_data.push({user: app.userData.email, date: this.getTimeNow(), formsdata: forms_data_inf, other_data: other_data});
							//other_data.push({ array:[], object:{name: this.model.get("text"), idof: this.model.get("_id") }, data: "Name" });
							//var msgOfGo = JSON.stringify({email: this.model.get("email"), date: this.getTimeNow(), formsdata: forms_data_inf, other_data: other_data});
							var msgOfGo = JSON.stringify({user: app.userData.email, date: this.getTimeNow(), formsdata: forms_data_inf, other_data: other_data});
							var msssgogo = {from: app.userData.email, message:msgOfGo, files:'', date: this.getTimeNow()};
							//console.log(msssgogo);
							app.addToAllFormsCollection(msssgogo, 'on_form_only_'+this.model.get("_id"));
							//this.model.set("submitted_data", JSON.stringify(submitted_data));
							//this.model.save();
							location.reload();
						}
					}
				}
			}.bind(this));
			
			var getFilesUpload = this.model.get("projectclass_uploaded_files_for_user_file");
			if(typeof getFilesUpload !== "undefined" && getFilesUpload !== ""){
				for(var ii=0; ii < getFilesUpload.length; ii++){
					if(getFilesUpload[ii] != ""){
						var getHtmlInMod = this.model.get("projectclass_uploaded_files_for_user"+getFilesUpload[ii]);
						if(typeof getHtmlInMod !== "undefined" && getHtmlInMod !== ""){
							$('.projectclass_uploaded_files_for_user'+this.model.get('_id')+getFilesUpload[ii]).html(getHtmlInMod);
						}
					}
				}
			}
					
			
			if($('.projectclass_uploaded_files_for_user'+this.model.get('_id')).length){
				//var htmlOfOne = this.model.get('projectclass_uploaded_files_for_user');
				//$('.projectclass_uploaded_files_for_user'+this.model.get('_id')).html(htmlOfOne);
				
								$(".imgs_link_to_view_only").click(function(e){
									var linnkk = e.currentTarget.getAttribute('href');
									e.preventDefault();
									app.commands.execute("app:dialog:simple", {
										message: '<img src="'+linnkk+'" alt="" />',
										icon: '',
										title: ''
									});
								});
			}
			
			//_fileChangeEvent
			
        }
    });
});
