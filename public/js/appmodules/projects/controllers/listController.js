define([
    '../../../app',
    '../../../config',
    'backbone',
    'underscore',
    '../views/createView',
    '../views/listGridView',
    '../views/projectGridRowView',
    '../collections/projectsCollection',
    'models/project',
    'collections/Nav',
    'views/MenuView',
    'views/EmptyView',
	'controllers/baseController',
	'views/rightModalView',
	'../../viewmodules/listView'
], function( app, config, Backbone, _, createView, listGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView, baseController, rightModalView, projectViews ) {
    var projectsContr = baseController.extend({
        show: function(options){
			var addusersname = "";
			var addusersnameentryy = "";
			if (typeof options.p != "undefined" && options.p != "") {
				addusersname = "/"+options.p;
				addusersnameentryy = "/0/"+options.p;
			}
			var mainViewShowingNow = "board_view_show";//this.getMainViewOfSite(options);
			this.mainViewShowingInNow = mainViewShowingNow;
			var mainViewObject = {};
            var id = '';
            var id_on_link = '_';
            var list_id = '_';
            var islistOne = false;
            var projects = this.mainProject;
            var cView = "";
			this.mainViewShowingInNow = "board_view_show";
			var pressedOtherView = false;
			var cCreatedViews = [];
			var cCreatedViewsFunc = [];
			var visibilityOfItGlobal = "";
			var cBoardView = "";
			var navigationModelObj = "";
			var renderHeadersData = function(thisProj){
				app.renderHeadersData(thisProj);
			}
			var thh = this;
			thh.renderMainView = function(){
				var canReRend = false;
				if(location.href.indexOf("projectsinlist/friends") > -1 || (location.href.indexOf("projectsinlist") > -1 && typeof thisProj != "undefined" && thisProj != "" && location.href.indexOf(thisProj.get("_id")) > -1)){
					canReRend = true;
				}
				if(canReRend){
					app.hideAddButtonGlobal();
					if(visibilityOfItGlobal != ""){
						if(visibilityOfItGlobal == "editpublic" || visibilityOfItGlobal == "editprivate"){ app.showAddButtonGlobal(); }
					}
					if(pressedOtherView){
						if(mainViewShowingNow == "board_view_show"){
							cBoardView.render();
						}
						/*if(mainViewShowingNow == "calendar_view_show"){
							cCalendarView.render();
						}
						if(mainViewShowingNow == "list_view_show"){
							cListView.render();
						}*/
						for(var i=0; i < projectViews.length; i++){
							if(mainViewShowingNow == projectViews[i].id){
								if(typeof cCreatedViews[mainViewShowingNow] == "undefined" || cCreatedViews[mainViewShowingNow] != ""){
									cCreatedViews[mainViewShowingNow].render();	
								}
							}
						}
						if(typeof cCreatedViewsFunc[mainViewShowingNow] != "undefined" && cCreatedViewsFunc[mainViewShowingNow] != ""){
							cCreatedViewsFunc[mainViewShowingNow](thisProj);
						}
						
							if(typeof thisProj != "undefined" && thisProj != ""){
								thisProj.setLighterColor();
								var linearGrad = "linear-gradient(to bottom right, "+thisProj.get("color")+", "+thisProj.get("colorLighter")+")";
								$(".the_all_projects_wrapper_article").css("background-color", thisProj.get("color"));
								$(".the_all_projects_wrapper_article").css("background", linearGrad);
								$("#the_all_projects").css("background-color", thisProj.get("color"));
								$("#the_all_projects").css("background", linearGrad);
								$(".the_all_projects_wrapper_article #the_all_projects").css("background", "none");
								$("#the_all_projects").css("border", "none");
							}
						
					}else{
						if(cView != ''){
							cView.render();
							if(typeof thisProj != "undefined" && thisProj != ""){
								thisProj.setLighterColor();
								var linearGrad = "linear-gradient(to bottom right, "+thisProj.get("color")+", "+thisProj.get("colorLighter")+")";
								$(".the_all_projects_wrapper_article").css("background-color", thisProj.get("color"));
								$(".the_all_projects_wrapper_article").css("background", linearGrad);
								$("#the_all_projects").css("background-color", thisProj.get("color"));
								$("#the_all_projects").css("background", linearGrad);
								$(".the_all_projects_wrapper_article #the_all_projects").css("background", "none");
								$("#the_all_projects").css("border", "none");
							}						
						}
					}
				}
			}
			
			var setViewCreated = function(mainViewShowingNow, mainViewObject){
					if(mainViewShowingNow == "board_view_show"){
						cView = new listGridView(mainViewObject);
					}
					for(var i=0; i < projectViews.length; i++){
						if(mainViewShowingNow == projectViews[i].id){
							cView = new projectViews[i].view(mainViewObject);
							this.listenTo(cView, 'render', this.listenToChangeView);
							this.listenTo(cView, 'project:edit', this.refreshProjectsRender);
							this.listenTo(cView, 'project:delete', this.refreshProjectsRender);
						}
					}
					/*if(mainViewShowingNow == "calendar_view_show"){
						cView = new projectCalendarView(mainViewObject);
					}
					if(mainViewShowingNow == "list_view_show"){
						cView = new projectListView(mainViewObject);
					}*/
			}.bind(this)
			
			var setViewOnWhenClicked = function(show_view){
						if(typeof cCreatedViews[show_view] == "undefined" || cCreatedViews[show_view] != ""){
							var projectViewSel = "";
							for(var ij=0; ij < projectViews.length; ij++){
								if(projectViews[ij].id == show_view){
									projectViewSel = projectViews[ij];
								}
							}
							if(projectViewSel != ""){
								cCreatedViews[show_view] = new projectViewSel.view(mainViewObject);
								if(navigationModelObj != ""){
									cCreatedViews[show_view].options.navigationModel = navigationModelObj;
									cCreatedViews[show_view].renderNavigation();
								}
								this.listenTo(cCreatedViews[show_view], 'render', this.listenToChangeView);
								this.listenTo(cCreatedViews[show_view], 'project:edit', this.refreshProjectsRender);
								this.listenTo(cCreatedViews[show_view], 'project:delete', this.refreshProjectsRender);
								if(typeof projectViewSel.onAfterRendered != "undefined" && projectViewSel.onAfterRendered != ""){
									cCreatedViewsFunc[show_view] = projectViewSel.onAfterRendered;
								}
							}
						}
					if(typeof cCreatedViews[show_view] != "undefined"){
						mainViewShowingNow = show_view;
						this.mainViewShowingInNow = mainViewShowingNow;
						pressedOtherView = true;
						app.main.show(cCreatedViews[show_view]);
						thh.renderMainView();
					}
			}.bind(this)
			
			this.refreshProjectsRender = function(view, options){
				if(typeof view != "undefined" && typeof view.addModels !== "undefined" && view.addModels != ""){
					options = view;
				}
				if(typeof options != "undefined" && typeof options.addModels !== "undefined" && options.addModels != ""){
					var modelsAdd = options.addModels;
					for (var onModel in modelsAdd) {
						var modelToAdd = new project(modelsAdd[onModel]);
							if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
								modelToAdd.set('hisinproject_this', options.id);
							}
							if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
								modelToAdd.set('parentvisibility', 'editcommentpublic');
							}else{
								if(typeof app.userData != "undefined"
 && typeof modelToAdd != "undefined" && typeof modelToAdd.get != "undefined"
								&& modelToAdd.get("email") == app.userData.email){
									modelToAdd.set('parentvisibility', "editpublic");
								}else{
									/*if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
										modelToAdd.set('parentvisibility', visibilityOfItGlobal);
									}else{/*/
										modelToAdd.set('parentvisibility', modelToAdd.get("visibility"));
									/*}/*/
								}
							}
						//if(projects.get(modelToAdd) == "undefined" && projects.get(modelToAdd.get("_id")) == "undefined"){
							projects.add(modelToAdd);
						//}
					}
				}
					projects.sort(projects.comparator());
					thh.renderMainView();
			}
			
			this.listenToChangeView = function(){
				var isBoardMain = "";
				if(mainViewShowingNow == "board_view_show"){ isBoardMain = 'viewButtonsInSelected'; }
				var addedViewsHtml = '<li id="board_view_show" class="viewButtonsIn '+isBoardMain+'">'+app.translate("Board view")+'</li>';
				for(var i=0; i < projectViews.length; i++){
					var isViewSelected = "";
					if(projectViews[i].id === mainViewShowingNow){ isViewSelected = 'viewButtonsInSelected'; }
					addedViewsHtml += projectViews[i].html(isViewSelected);
				}
				$("#viewsAdded").html(addedViewsHtml);
				
				for(var i=0; i < projectViews.length; i++){
					$('#'+projectViews[i].id).click(function(e){
						var show_view = e.currentTarget.getAttribute('id');
						setViewOnWhenClicked(show_view);
					}.bind(this));
				}
				/*$('#list_view_show').click(function(){
					var type = 'list_view_show';
					if(type === 'list_view_show'){
						if(cListView === ''){
							cListView = new projectListView(mainViewObject);
							if(navigationModelObj != ""){
								cListView.options.navigationModel = navigationModelObj;
								cListView.renderNavigation();
							}
							this.listenTo(cListView, 'render', this.listenToChangeView);
						}
						mainViewShowingNow = "list_view_show";
						this.mainViewShowingInNow = mainViewShowingNow;
						pressedOtherView = true;
						app.main.show(cListView);
						thh.renderMainView();
						$("#the_all_projects").attr('style','width:auto; margin:auto;');
					}
				}.bind(this));
				$('#calendar_view_show').click(function(){
					var type = 'calendar_view_show';
					if(type === 'calendar_view_show'){
						if(cCalendarView === ''){
							cCalendarView = new projectCalendarView(mainViewObject);
							if(navigationModelObj != ""){
								cCalendarView.options.navigationModel = navigationModelObj;
								cCalendarView.renderNavigation();
							}
							this.listenTo(cCalendarView, 'render',  this.listenToChangeView);
						}
						mainViewShowingNow = "calendar_view_show";
						this.mainViewShowingInNow = mainViewShowingNow;
						pressedOtherView = true;
						app.main.show(cCalendarView);
						thh.renderMainView();
					}
				}.bind(this));*/
				$('#board_view_show').click(function(){
				var type = 'board_view_show';
				if(type === 'board_view_show'){
					if(cBoardView === ''){
						cBoardView = new listGridView(mainViewObject);
						if(navigationModelObj != ""){
							cBoardView.options.navigationModel = navigationModelObj;
							cBoardView.renderNavigation();
						}
						this.listenTo(cBoardView, 'render',  this.listenToChangeView);
						this.listenTo(cBoardView, 'project:edit', this.refreshProjectsRender);
						this.listenTo(cBoardView, 'project:delete', this.refreshProjectsRender);
					}
					mainViewShowingNow = "board_view_show";
					this.mainViewShowingInNow = mainViewShowingNow;
					pressedOtherView = true;
					app.main.show(cBoardView);
					thh.renderMainView();
				}
				}.bind(this));
			}
			
			
			
			var thisProj = "";
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
                id = options.id;
                list_id = options.listId;
                id_on_link = id;
                if(typeof this.projects[id] != 'undefined' && typeof this.projects[options.id].models != 'undefined'){
                    projects = this.projects[id];
                }else{
					projects = this.getProject(id_on_link);
                    if(id === 'friends'){
                        if(typeof app.userConnected.data2 !== 'undefined') {
                            projects.url = config.urlAddr+'/projectsfriend/'+app.userConnected.data2._id+addusersname;
                        }else{
                            app.vent.on("userConnected:ready", function(){
                                projects.url = config.urlAddr+'/projectsfriend/'+app.userConnected.data2._id+addusersname;
								projects.fetch().done(function(){
									projects.sort(projects.comparator());
									app.main.show(cView);
									thh.renderMainView();
								});
							}.bind(this));
                        }
                    }else{
                        projects.url = config.urlAddr+'/projectsinlistt/'+id+addusersname;
                    }
                    this.projects[id] = projects;
                    this.projects.push(projects);
                }
                var navigation_pr = "";
                for(var ii=0; ii < this.projects.length;ii++){
                    if(typeof this.projects[ii].get(projects.idd) !== 'undefined'){
                        navigation_pr = this.projects[ii].get(projects.idd);
                    }
                }
				if(id !== 'friends'){
					if(navigation_pr === ''){
						var thisProj = "";
						if(typeof this.projectModels[projects.idd] != 'undefined'){
							thisProj = this.projectModels[projects.idd];
						}else{
							thisProj = new project({_id:projects.idd});
							thisProj.url = config.urlAddr+'/projectentryy/'+projects.idd+addusersnameentryy;
							/*thisProj.fetch().done(function(){
								cView.options.navigationModel = thisProj;
								cView.renderNavigation();
							});*/
							this.projectModels[projects.idd] = thisProj;
							app.vent.trigger('add:cachedModels:resource', this.projectModels[projects.idd]);
						}
						//cView = new listGridView({collection: projects, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
						mainViewObject = {collection: projects, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')};
						setViewCreated(mainViewShowingNow, mainViewObject);
					}else{
						thisProj = navigation_pr;
						//cView = new listGridView({collection: projects, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
						mainViewObject = {collection: projects, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')};
					
						setViewCreated(mainViewShowingNow, mainViewObject);
					}
					
					if(typeof thisProj != "undefined" && thisProj != ""){
						var projectDataWhenLoaded = function(visibilityOfIt, viewOfProject, count_every_header){ 
						visibilityOfItGlobal = visibilityOfIt;
						
									if(typeof app.userData != "undefined"
&& typeof thisProj != "undefined" && typeof thisProj.get != "undefined"
									&& thisProj.get("email") == app.userData.email){}else{
										projects.url = config.urlAddr+"/projectsinlistt/"+projects.idd+addusersname;
									}
									
									projects.fetch().done(function(){
										projects.sort(projects.comparator());
										if(viewOfProject !== "board_view_show"){
											setViewCreated(viewOfProject, mainViewObject);
											setViewOnWhenClicked(viewOfProject);
											pressedOtherView = false;
										}
										if(typeof cView.options !== "undefined"){
											cView.options.navigationModel = thisProj;
										}
										if(typeof cView.renderNavigation !== "undefined"){
											cView.renderNavigation();
										}
										thisProj.fetchHeaderCount(count_every_header, thh);
										for(var ii=0; ii < projects.models.length; ii++){
											if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
												projects.models[ii].set('parentvisibility', 'editcommentpublic');
											}else{
												if(typeof app.userData != "undefined" && projects.models[ii].get("email") == app.userData.email){
													projects.models[ii].set('parentvisibility', "editpublic");
												}else{
													/*if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
														projects.models[ii].set('parentvisibility', visibilityOfIt);
													}else{/*/
														projects.models[ii].set('parentvisibility', projects.models[ii].get("visibility"));
													/*}/*/
												}
											}
										}
										
										projects.sort(projects.comparator());
										if(typeof cView !== "undefined" && cView != ""){
											app.main.show(cView);
										}
										app.main.show(cView);
										thh.renderMainView();
										app.vent.on("userConnected:ready", function(){
											thh.renderMainView();
										});
									});
						}
						var getVisibilityOfTheProject = function(thisProj, visibilityOfIt, canView){
									var friendsInThatProj = thisProj.get("friends");
									if(typeof friendsInThatProj !== "undefined" && typeof friendsInThatProj.length !== "undefined"){
										for(var ii=0; ii < friendsInThatProj.length; ii++){
											if(typeof friendsInThatProj[ii] != "undefined" && friendsInThatProj[ii] != "" && typeof friendsInThatProj[ii]._id != "undefined" && friendsInThatProj[ii]._id != ""){
												if(typeof app.userData == "undefined" || app.userData._id == friendsInThatProj[ii]._id){
													canView = true;
												}
											}
										}
									}
									if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
										canView = true;
										visibilityOfIt = "editpublic";
									}
							return {visibilityOfIt:visibilityOfIt, canView:canView};
						}
						
						thisProj.url = config.urlAddr+'/projectentryy/'+projects.idd+addusersnameentryy;
						thisProj.fetch().done(function(){
							renderHeadersData(thisProj);
								if(typeof app.userData == "undefined"){
									app.vent.on("userConnected:ready", function(){
										var canView = false;
										var viewOfProject = thisProj.get("view_main");
										var visibilityOfIt = thisProj.get("visibility");
										if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
											var getVisibilityOff = getVisibilityOfTheProject(thisProj, visibilityOfIt, canView);
											visibilityOfIt = getVisibilityOff.visibilityOfIt;
											canView = getVisibilityOff.canView;
										}
										
											var count_every_header = new Backbone.Model();
											
											if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
												count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+thisProj.get('_id')+addusersname;
											}else{
												if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
													count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+thisProj.get('_id')+addusersname;
												}else{
													count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+thisProj.get('_id')+addusersname;
												}
											}
										
										if(visibilityOfIt == "editcommentfriends" || visibilityOfIt == "friends" || visibilityOfIt == "editfriends" ||
										visibilityOfIt == "editcommentpublic" || visibilityOfIt == "editpublic" || visibilityOfIt == "public" || canView){
											projectDataWhenLoaded(visibilityOfIt, viewOfProject, count_every_header);
										}else{
											app.getWhenPrivateData();
										}
									});
								}else{
									var canView = false;
									var viewOfProject = thisProj.get("view_main");
									var visibilityOfIt = thisProj.get("visibility");
									if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
										var getVisibilityOff = getVisibilityOfTheProject(thisProj, visibilityOfIt, canView);
										visibilityOfIt = getVisibilityOff.visibilityOfIt;
										canView = getVisibilityOff.canView;
									}
									
										var count_every_header = new Backbone.Model();
											
										if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
											count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+thisProj.get('_id')+addusersname;
										}else{
											if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
												count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+thisProj.get('_id')+addusersname;
											}else{
												count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+thisProj.get('_id')+addusersname;
											}
										}
									
									if(visibilityOfIt == "editcommentfriends" || visibilityOfIt == "friends" || visibilityOfIt == "editfriends" || 
									visibilityOfIt == "editcommentpublic" || visibilityOfIt == "editpublic" || visibilityOfIt == "public" || canView){
										projectDataWhenLoaded(visibilityOfIt, viewOfProject, count_every_header);
										if(typeof cView !== "undefined" && cView !== ""){
											this.listenTo(cView, 'render', this.listenToChangeView);
											this.listenTo(cView, 'project:edit', this.refreshProjectsRender);
											this.listenTo(cView, 'project:delete', this.refreshProjectsRender);
										}
									}else{
										app.getWhenPrivateData();
									}
								}
						}.bind(this)).error(function(){
							app.getWhenNotFoundData();
						});
					}
					
					
				}else{
					/*id = friends*/
					cView = new listGridView({collection: projects});
				}
            }
            else{
                //cView = new listGridView({collection: projects});
				mainViewObject = {collection: projects};
				setViewCreated(mainViewShowingNow, mainViewObject);
            }

            if(typeof app.userConnected.data2 !== 'undefined' && id === 'friends'){
                projects.url = config.urlAddr+'/projectsfriend/'+app.userConnected.data2._id+addusersname;
                projects.fetch().done(function(){
                    projects.sort(projects.comparator());
                    /*
                     cView.trigger('refresh:dom');
                     projects.sort(projects.comparator());
                     */
                    app.main.show(cView);
                    thh.renderMainView();
                });
            }else{
                if(id === 'friends'){
                    /*app.vent.on("userConnected:ready", function(){
                        projects.url = '/projectsfriend/'+app.userConnected.data2._id;
                        projects.fetch().done(function(){
                            projects.sort(projects.comparator());
                            /*
                             cView.trigger('refresh:dom');
                             projects.sort(projects.comparator());
                             */
                    /*        app.main.show(cView);
                            cView.render();
                        });
                    }.bind(this));*/
                }else{
                    /* Just commented
					projects.fetch().done(function(){
                        projects.sort(projects.comparator());
                        app.main.show(cView);
                        cView.render();
                    });*/
                }
            }

            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-menu-hamburger fontsize23"></div><div></div>Menu', name: '',actionEx:'open_right_menu', active: false}
            ]);
			if(thisProj == ""){
				 menuTopRightCol = new Nav([
				]);
			}
            var menuTopRight = new MenuView({collection: menuTopRightCol});
            if(id !== 'friends'){
                app.menu.show(menuTopRight);
            }else{
                app.menu.show(new EmptyView());
            }
            app.vent.trigger('top:leftmenu:show');
            app.footernavright.show(new EmptyView());
            app.footernavleft.show(new EmptyView());
            thh.renderMainView();
            this.listenTo(menuTopRight, 'menuitem:click',function(view){
                if(view.model.get('actionEx') == 'home'){
					Backbone.history.navigate('#home',{ trigger:true, replace: true });
				}
                if(view.model.get('actionEx') == 'openChat'){
					location.href = "/chat";
				}
                if(view.model.get('actionEx') == 'open_right_menu'){
					if(thisProj != ""){
						if($("#right_menu_for_data").html() == ""){
							var visibilityOfThisproj = thisProj.getVisibilityOfTheProject(app);
							thisProj.set("parentvisibility",visibilityOfThisproj.visibilityOfIt);
							var projectGridRow = new rightModalView({model:thisProj});
							app.right_menu_for_data.show(projectGridRow);
							projectGridRow.render();
						}
						$("#right_menu_for_data").toggle();
					}
				}
                if(view.model.get('actionEx') == 'add'){
                    Backbone.history.navigate('#addlist/'+id_on_link+'/'+list_id,{ trigger:true, replace: true });
                }
            });

            this.listenTo(projects, 'remove add',function(modell){
                //thh.renderMainView();
				$("#viewsAdded .viewButtonsInSelected").trigger("click");
				setTimeout(function(){
						$("#viewsAdded .viewButtonsInSelected").trigger("click");
					}, 1);
            });
            this.listenTo(projects, 'change',function(modell){
                if( typeof modell != "undefined" && typeof modell.get('positionLayerY') != 'undefined'
                    && typeof modell.get('positionModelId') != 'undefined'
                    && typeof modell.get('positionModelIsHeader') != 'undefined'){
                    var layerY = modell.get('positionLayerY');
                    var modelIdS = modell.get('positionModelId');
                    var modelIdIsHeader = modell.get('positionModelIsHeader');

                    modell.unset('positionLayerY', 'silent');
                    modell.unset('positionModelId', 'silent');
                    modell.unset('positionModelIsHeader', 'silent');

                    var modelInHeader = modell.get('inHeader');
                    if(!modelIdIsHeader){
                        var count_in_header = 0;
                        var can_start_count_position = false;
                        projects.each(function(model, index) {
                            if(model.get('inHeader') == modelInHeader && !model.get('isHeader')){
                                if(can_start_count_position && model.get('_id') != modell.get('_id')){
                                    model.set('position', count_in_header);
                                    model.set('id',model.get('_id'));
                                    model.save();
                                    count_in_header++;
                                }
                            }
                            if(model.get('_id') == modelIdS){
                                can_start_count_position = true;
                                if(layerY > 50){
                                    count_in_header = model.get('position')+1;
                                    modell.set('position', count_in_header);
                                    modell.set('id',modell.get('_id'));
                                    modell.save();
                                    count_in_header = count_in_header+1;
                                    model.set('position',count_in_header);
                                    model.set('id',model.get('_id'));
                                    model.save();
                                    count_in_header = count_in_header+1;
                                }else{
                                    count_in_header = model.get('position')+1;
                                    modell.set('position', count_in_header);
                                    modell.set('id',modell.get('_id'));
                                    modell.save();
                                    count_in_header = count_in_header+1;
                                }
                            }
                        });

                    }
                    projects.sort(projects.comparator());
                    thh.renderMainView();
                }
                if(typeof modell != "undefined" && typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    projects.sort(projects.comparator());
                    thh.renderMainView();
                    modell.unset('inHeaderUpdateView', 'silent');
                }
                if(typeof modell != "undefined" && typeof modell.get('positionLayerX') != 'undefined'
                    && typeof modell.get('positionModelIdX') != 'undefined'){
                    var layerX = modell.get('positionLayerX');
                    var modelIdS = modell.get('positionModelIdX');

                    modell.unset('positionLayerX', 'silent');
                    modell.unset('positionModelIdX', 'silent');


                    var count_in_header = 0;
                    var can_start_count_position = false;
                    projects.each(function(model, index) {
                        if(model.get('isHeader')){
                            if(can_start_count_position && model.get('_id') != modell.get('_id')){
                                model.set('position', count_in_header);
                                model.set('id',model.get('_id'));
                                model.save();
                                count_in_header++;
                            }
                        }
                        if(model.get('_id') == modelIdS){
                            can_start_count_position = true;
                            if(layerX > 50){
                                count_in_header = model.get('position')+1;
                                modell.set('position', count_in_header);
                                modell.set('id',modell.get('_id'));
                                modell.save();
                                count_in_header = count_in_header+1;
                                model.set('position',count_in_header);
                                model.set('id',model.get('_id'));
                                model.save();
                                count_in_header = count_in_header+1;
                            }else{
                                count_in_header = model.get('position')+1;
                                modell.set('position', count_in_header);
                                modell.set('id',modell.get('_id'));
                                modell.save();
                                count_in_header = count_in_header+1;
                            }
                        }
                    });
                    projects.sort(projects.comparator());
                    thh.renderMainView();
                }

            });
			if(typeof this.listenToChangeView !== "undefined" && typeof cView !== "undefined" && cView !== ""){
				this.listenTo(cView, 'render', this.listenToChangeView);
			}
			if(typeof cView !== "undefined" && cView !== ""){
				this.listenTo(cView, 'project:edit', this.refreshProjectsRender);
				this.listenTo(cView, 'project:delete', this.refreshProjectsRender);
			}
			this.prjsprojects = projects;
			this.listenTo(projects, 'change:inHeaderUpdateView',function(modell){
                if(typeof modell != "undefined" && typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    this.prjsprojects.sort(this.prjsprojects.comparator());
                    modell.unset('inHeaderUpdateView', 'silent');
					//thh.renderMainView();
					//$("#viewsAdded .viewButtonsInSelected").trigger("click");
                }
				this.onProjectChange(modell);
			}.bind(this));
        }
    });
    return projectsContr;
});
