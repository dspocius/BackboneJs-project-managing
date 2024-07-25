define([
    '../../../app',
    '../../../config',
    'models/base',
    'underscore',
    '../views/entryView',
    'models/project',
	'views/MenuView',
	'collections/Nav',
	'../../viewmodules/entryView'
], function( app, config, base, _, entryView, project, MenuView, Nav, entryViewList ) {
    return base.extend({
        initialize: function(options){
            if(typeof options.mainProjectCtrl !== 'undefined'){
                this.projects = options.mainProjectCtrl.projects;
                this.projectModels = options.mainProjectCtrl.projectModels;
                this.commentProject = '';
				this.comments = [];
			}else{
				this.commentProject = '';
				this.comments = [];
                this.projects = [];
                this.projectModels = [];
            }
        },
		customFile: function(project_model, pdfs_id, user_pdf){
			var flsz = user_pdf;
					 //if($('.projectclass_uploaded_files_for_user'+project_model.get('_id')).length){
						 var flsplit = flsz.split(".");
						 if(flsplit[flsplit.length-1] === "pdf" || flsplit[flsplit.length-1] === "PDF"){
						 var htmlFilesOn = '<div class="fileOneProjectInModel"><a target="_blank" href="'+config.filesurl+'/files/project_managing_files/'+pdfs_id+'/'+flsz+'">Download PDF</a> - <a target="_blank" href="/#/entry/'+pdfs_id+'">Users photobook</a></div>';
						 $('.projectclass_uploaded_files_for_user'+project_model.get('_id')).html(htmlFilesOn);
						 var allHtmlFilessz = $('.projectclass_uploaded_files_for_user'+project_model.get('_id')).html();
						 project_model.set("projectclass_uploaded_files_for_user", htmlFilesOn);
						 var getModelsOfUploadedFiles = project_model.get("projectclass_uploaded_files_for_user_file");
						 if(typeof getModelsOfUploadedFiles !== "undefined"){
							 getModelsOfUploadedFiles.push(pdfs_id+'/'+flsz);
							 project_model.set("projectclass_uploaded_files_for_user_file", getModelsOfUploadedFiles);
						 }else{
							 project_model.set("projectclass_uploaded_files_for_user_file", [pdfs_id+'/'+flsz]);
						 }
						 //project_model.set("",project_model.get('_id')+'/'+flsz);
						 var thisModelId = project_model;
							 
							 
							 
							var jqxhr = $.get( "/analyse_pdf/"+pdfs_id+";"+flsz)
							  .done(function(data) {
								  console.log(data);
								var Width = data.formImage.Width;
								var HeightPdf = 0;
								var badHeight = false;
								
								var pagesData = data.formImage.Pages;
								var pagesNr = data.formImage.Pages.length;
								var pageHtmlLinks = "";
								for(var ii=0; ii < pagesNr; ii++){
									pageHtmlLinks += "<a class='imgs_link_to_view_only' href='"+config.filesurl+"/files/project_managing_files/"+pdfs_id+"/"+flsz+"/"+ii+".png'>"+(ii+1)+"</a>";
									if(HeightPdf == 0){
										HeightPdf = pagesData[ii].Height;
									}
									if(HeightPdf !== pagesData[ii].Height){
										badHeight = true;
									}
								}
								if(badHeight || pagesNr < 8){
									var whatWrong = "All pages should be the same size - <a href='/#/entry/"+pdfs_id+"'>Continue edit photobook</a> <br />";
									if(!badHeight){
										whatWrong = "";
									}
									if(pagesNr < 8){
										whatWrong = "Should be minimum 8 pages - <a href='/#/entry/"+pdfs_id+"'>Continue edit photobook</a>";
									}
									$('.projectclass_uploaded_files_for_user'+thisModelId.get('_id')).html('<div style="border:1px solid red; margin:10px; padding:10px;">'+whatWrong+'</div>');
									var allHtml = $('.projectclass_uploaded_files_for_user'+thisModelId.get('_id')).html();
									thisModelId.set("projectclass_uploaded_files_for_user", allHtml);
									thisModelId.set("disabled_pages_number","");
									thisModelId.set("disabled_list_name_size","");
								}else{
									var inchWidth = parseInt(Width/4.5);
									var inchHeight = parseInt(HeightPdf/4.5);
									$('.projectclass_uploaded_files_for_user'+thisModelId.get('_id')).append(pageHtmlLinks);
									var allHtml = $('.projectclass_uploaded_files_for_user'+thisModelId.get('_id')).html();
									thisModelId.set("projectclass_uploaded_files_for_user", allHtml);
									thisModelId.set("disabled_pages_number",pagesNr);
									thisModelId.set("disabled_list_name_size",inchWidth+"x"+inchHeight);
								}
								
								
								$(".imgs_link_to_view_only").click(function(e){
									var linnkk = e.currentTarget.getAttribute('href');
									e.preventDefault();
									app.commands.execute("app:dialog:simple", {
										message: '<img src="'+linnkk+'" alt="" />',
										icon: '',
										title: ''
									});
								});
								
								$("#Page_number").val(pagesNr);
								$("#Page_number").trigger("change");
								$("#Page_number").attr("disabled","disabled");
								$("#Page_number").css("background","#999");
							  })
							  .fail(function() {
								console.log( "error" );
							  });
						 }
						 
					 //}
		},
        show: function(options){
			var user_file_pdf = "";
			var user_file_id = "";
			if(typeof options !== "undefined" && typeof options.user_file_pdf !== "undefined"){
				user_file_pdf = "html_file"+options.user_file_pdf+".pdf";
				user_file_id = options.user_file_pdf;
			}
			var renderHeadersData = function(thisProj){
				this.customFile(thisProj, user_file_id, user_file_pdf);
				app.renderHeadersData(thisProj);
				thisProj.set("forms_data_info",thisProj.get("forms_data"));
			}.bind(this)
			
			var rerenderViewEntry = function(){
				
				this.rerenderCView();
				
			}.bind(this);
		  var menuTopRightCol = new Nav([]);
            var menuTopRight = new MenuView({collection: menuTopRightCol});
            app.menu.show(menuTopRight);
			
			app.CurrentCommentsView = this;
            if(typeof this.get('mainProjectCtrl') !== 'undefined'){
               // this.projects = this.get('mainProjectCtrl').projects;
                //this.projectModels = this.get('mainProjectCtrl').projectModels;
            }
            app.vent.trigger('top:leftmenu:show');
            var entryId = options.id;
            var projec;
			var commentsCol;
            var cView = '';
			var mainViewShowingNow = "";
			this.mainViewShowingNow = mainViewShowingNow;
			this.cView = cView;
            if(typeof this.projects[options.id] != 'undefined' && typeof this.projects[options.id].models == 'undefined' && typeof this.comments[options.id] != 'undefined'){
                 commentsCol = this.comments[options.id];
                 projec = this.projects[options.id];
				 projec.set('messages',commentsCol.get('messages'));
				 renderHeadersData(projec);
					var submitted_data = JSON.parse(projec.get("submitted_data"));
					if(typeof app.userData.email !== "undefined" && app.userData.email != "" && app.userData.email != "none"){
						if(projec.get("submitted_data_can_answer_more") == "true" || projec.get("submitted_data_can_answer_more") == "True"){
							projec.set("user_submitted_form","true");
							var forms_data_all_the = JSON.parse(projec.get('forms_data'));
							if(forms_data_all_the.length > 0){
								var commentsCol_checking = new Backbone.Model();
								commentsCol_checking.url = config.urlAddr+'/comment_is_username/formsManagementon_form_only_'+projec.get("_id");
								commentsCol_checking.fetch({ success : function(){
										projec.set("user_submitted_form","voted");
										rerenderViewEntry();
								}, error: function(){
										projec.set("user_submitted_form","false");
										rerenderViewEntry();
								} });
							}
						}
					}else{
						var forms_data_all_the_is_form = JSON.parse(projec.get('forms_data'));
						if(forms_data_all_the_is_form.length > 0){
							projec.set("user_submitted_form","not_logged");
							rerenderViewEntry();
						}
					}
					 mainViewShowingNow = projec.get("view_main");
					 this.mainViewShowingNow = mainViewShowingNow;
					for(var i=0; i < entryViewList.length; i++){
						if(mainViewShowingNow == entryViewList[i].id){
							entryViewList[i].html(projec);
							projec.set("show_main_html", entryViewList[i].show_main_html);
							projec.set("custom_view_html", entryViewList[i].html(projec));
						}
					}
            }else{
                projec = new project({'_id': entryId});
				projec.set('messages',[]);
                this.projects.push(projec);
                this.projects[options.id] = projec;
                app.vent.trigger('add:cachedModels:resource', this.projects[options.id]);
                projec.url = '/projectentryy/'+entryId;
				if (typeof options.people != "undefined" && options.people != "") {
					projec.url = '/projectentryy/'+entryId+"/0/"+options.people;
				}
                projec.fetch().done(function(){
					renderHeadersData(projec);
					var submitted_data = JSON.parse(projec.get("submitted_data"));
					if(typeof app.userData != "undefined" && typeof app.userData.email !== "undefined" && app.userData.email != "" && app.userData.email != "none"){
						if(projec.get("submitted_data_can_answer_more") == "true" || projec.get("submitted_data_can_answer_more") == "True"){
							projec.set("user_submitted_form","true");
							var forms_data_all_the = JSON.parse(projec.get('forms_data'));
							if(forms_data_all_the.length > 0){
								var commentsCol_checking = new Backbone.Model();
								commentsCol_checking.url = config.urlAddr+'/comment_is_username/formsManagementon_form_only_'+projec.get("_id");
								commentsCol_checking.fetch({ success : function(){
										projec.set("user_submitted_form","voted");
										rerenderViewEntry();
								}, error: function(){
										projec.set("user_submitted_form","false");
										rerenderViewEntry();
								} });
							}
						}
					}else{
						var forms_data_all_the_is_form = JSON.parse(projec.get('forms_data'));
						if(forms_data_all_the_is_form.length > 0){
							projec.set("user_submitted_form","not_logged");
							rerenderViewEntry();
						}
					}
					
					
					
					 mainViewShowingNow = projec.get("view_main");
					 this.mainViewShowingNow = mainViewShowingNow;
					for(var i=0; i < entryViewList.length; i++){
						if(mainViewShowingNow == entryViewList[i].id){
							projec.set("show_main_html", entryViewList[i].show_main_html);
							projec.set("custom_view_html", entryViewList[i].html(projec));
						}
					}
					if(cView != ''){
						rerenderViewEntry();
					}
                }.bind(this)).error(function(){
					app.getWhenNotFoundData();
				});
				
				var commentsCol = app.getCommentsCol(options.id);
				if(commentsCol === ''){
					var commentsCol = new project();
					commentsCol.url = config.urlAddr+'/comments/'+options.id+'/'+0;
					this.comments.push(commentsCol);
					this.comments[options.id] = commentsCol;
					app.vent.trigger('add:cachedComments:resource', {_id:options.id,data: this.comments[options.id]});
				}
				commentsCol.fetch().done(function(){
					this.commentProject = commentsCol;
					projec.set('messages',commentsCol.get('messages'));
					if(cView != ''){
						rerenderViewEntry();
					}
				}.bind(this));
            }
                /* for navigation */
                var navigation_pr = "";
                for(var ii=0; ii < this.projects.length;ii++){
                    if(typeof this.projects[ii].get(options.id) !== 'undefined'){
                        navigation_pr = this.projects[ii].get(options.id);
                    }
                }
                if(navigation_pr === ''){
                    var thisProj = "";
                    if(typeof this.projectModels[options.id] != 'undefined'){
                        thisProj = this.projectModels[options.id];
                    }else{
                        thisProj = new project({_id:options.id});
                        thisProj.url = config.urlAddr+'/projectentryy/'+options.id;
						
						if (typeof options.people != "undefined" && options.people != "") {
							thisProj.url = '/projectentryy/'+options.id+"/0/"+options.people;
						}
                        thisProj.fetch().done(function(){
							if (typeof cView.options != "undefined" && typeof cView.options.navigationModel != "undefined") {
								cView.options.navigationModel = thisProj;
							}
                            cView.renderNavigation();
                        });
                        this.projectModels[options.id] = thisProj;
                    }
                    cView = new entryView({model: projec, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }else{
                    cView = new entryView({model: projec, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }
				this.cView = cView;
            app.main.show(cView);
			this.listenTo(cView,'render', function(){
								for(var i=0; i < entryViewList.length; i++){
									if(this.mainViewShowingNow == entryViewList[i].id){
										entryViewList[i].onRender();
									}
								}
			});
			this.listenTo(projec,'change:files', function(){
				if(typeof this.model != "undefined" && (typeof this.model.get("ident") == "undefined" || this.model.get("ident") == "")){
					rerenderViewEntry();
				}
			}.bind(this));
			this.listenTo(projec,'change:photobook_data', function(){
				rerenderViewEntry();
			});
			this.listenTo(cView,'add:comment', function(comment){
				var commentNew = new project();
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

				var msgsObj = {from:app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname,message:comment,files:'',date:today};
				commentNew.set('message',msgsObj);
				commentNew.set('id',this.commentProject.get('_id'));
				commentNew.set('taskid',this.model.get('_id'));
                commentNew.url = config.urlAddr+'/comment';
				commentNew.save();
				
				var msgs = this.commentProject.get('messages');
				msgsObj._id = options.id;
				//msgs.unshift(msgsObj);
				app.emitMessage('commentSend',msgsObj);
				rerenderViewEntry();
			});
			this.listenTo(cView,'delete:comment', function(commentDate){
				var commentNew = new project();
				commentNew.set('date',commentDate);
				commentNew.set('id',this.commentProject.get('_id'));
				commentNew.set('taskid',this.model.get('_id'));
                commentNew.url = config.urlAddr+'/comment';
				commentNew.save();
				var msgs = this.commentProject.get('messages');
				for(var i = msgs.length - 1; i >= 0; i--){
					if(msgs[i].date === commentDate) {
					   msgs.splice(i, 1);
					}
				}
				
				rerenderViewEntry();
			});
            rerenderViewEntry();
        },
		rerenderCView: function(){
			var canRerend = false;
			if(location.href.indexOf("entry/") > -1 && typeof this.cView.model != "undefined" && this.cView.model != "" && location.href.indexOf(this.cView.model.get("_id")) > -1){
				canRerend = true;
			}
			
			if(canRerend){
				if(typeof app.userData == "undefined"){
					app.vent.on("userConnected:ready", function(){

						if(typeof this.cView.model != "undefined"){
							var visibilityOfThisproj = this.cView.model.getVisibilityOfTheProject(app);
							if(typeof visibilityOfThisproj.visibilityOfIt != "undefined"){
								if(visibilityOfThisproj.visibilityOfIt == "editcommentfriends" || visibilityOfThisproj.visibilityOfIt == "friends" || visibilityOfThisproj.visibilityOfIt == "editfriends" ||
								visibilityOfThisproj.visibilityOfIt == "editcommentpublic" || visibilityOfThisproj.visibilityOfIt == "editpublic" || visibilityOfThisproj.visibilityOfIt == "public" || visibilityOfThisproj.canView){
												if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
													this.cView.model.set("parentvisibility",'editcommentpublic');
												}else{
													this.cView.model.set("parentvisibility",visibilityOfThisproj.visibilityOfIt);
												}
									this.cView.render();
									app.main.show(this.cView);
									$("#comments_info_view").trigger("click");
									for(var i=0; i < entryViewList.length; i++){
										if(this.mainViewShowingNow == entryViewList[i].id){
											entryViewList[i].onRender();
										}
									}
								}else{
									app.getWhenPrivateData();
								}
							}
						}
					
					}.bind(this));
				}else{
					if(typeof this.cView.model != "undefined"){
						var visibilityOfThisproj = this.cView.model.getVisibilityOfTheProject(app);
						if(typeof visibilityOfThisproj.visibilityOfIt != "undefined"){
							if(visibilityOfThisproj.visibilityOfIt == "editcommentfriends" || visibilityOfThisproj.visibilityOfIt == "friends" || visibilityOfThisproj.visibilityOfIt == "editfriends" ||
							visibilityOfThisproj.visibilityOfIt == "editcommentpublic" || visibilityOfThisproj.visibilityOfIt == "editpublic" || visibilityOfThisproj.visibilityOfIt == "public" || visibilityOfThisproj.canView){
												if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
													this.cView.model.set("parentvisibility",'editcommentpublic');
												}else{
													this.cView.model.set("parentvisibility",visibilityOfThisproj.visibilityOfIt);
												}
								this.cView.render();
								app.main.show(this.cView);
								$("#comments_info_view").trigger("click");
									for(var i=0; i < entryViewList.length; i++){
										if(this.mainViewShowingNow == entryViewList[i].id){
											entryViewList[i].onRender();
										}
									}
							}else{
								app.getWhenPrivateData();
							}
						}
					}
				}
			}
		},
		rerenderComments: function(){
			if($('#commentsInEntryForAView').length){
				this.rerenderCView();
			}
		}
    });
});