define([
	'../../../app',
    'backbone',
    'underscore',
    '../views/createView',
    '../views/projectGridView',
    '../views/projectGridRowView',
    '../collections/projectsCollection',
    'models/project',
    'collections/Nav',
    'views/MenuView',
    'views/EmptyView',
    'views/rightModalView',
	'../../viewmodules/projectViews/calendar/projectCalendarView',
	'../../viewmodules/projectViews/list/projectListView',
	'controllers/baseController',
	'../../viewmodules/projectView'
], function( app, Backbone, _, createView, projectGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView, rightModalView, projectCalendarView, projectListView, baseController, projectViews ) {
    var projectsContr = baseController.extend({
        show: function(options){
			var mainViewShowingNow = this.getMainViewOfSite(options);
			this.mainViewShowingInNow = mainViewShowingNow;
			var pressedOtherView = false;
			var mainViewObject = {};
			var navigationModelObj = "";
            var id = '';
            var id_on_link = '_';
            var islistOne = false;
            var projectsShared = this.getProject("friends");
            var projects = this.mainProject;
            var navigation_pr = "";
            var cView = "";
            var cBoardView = "";
            var cCalendarView = "";
            var cListView = "";
			var cCreatedViews = [];
			var cCreatedViewsFunc = [];
            var navLinks = '<a href="#home">'+app.translate('Home')+'</a>';
			var functionToBeCalledToAddShared = "";
			
			var renderMainView = function(){
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
				}else{
					if(cView != ''){
						cView.render();	
					}
				}
			}
			
			var setViewCreated = function(mainViewShowingNow, mainViewObject){
					if(mainViewShowingNow == "board_view_show"){
						cView = new projectGridView(mainViewObject);
					}
					for(var i=0; i < projectViews.length; i++){
						if(mainViewShowingNow == projectViews[i].id){
							cView = new projectViews[i].view(mainViewObject);
						}
					}
					/*if(mainViewShowingNow == "calendar_view_show"){
						cView = new projectCalendarView(mainViewObject);
					}
					if(mainViewShowingNow == "list_view_show"){
						cView = new projectListView(mainViewObject);
					}*/
			}
			
			this.listenToChangeView = function(){
				var addedViewsHtml = '<li id="board_view_show" class="viewButtonsIn viewButtonsInSelected">'+app.translate("Board view")+'</li>';
				for(var i=0; i < projectViews.length; i++){
					addedViewsHtml += projectViews[i].html;
				}
				$("#viewsAdded").html(addedViewsHtml);
				
				for(var i=0; i < projectViews.length; i++){
					$('#'+projectViews[i].id).click(function(e){
						var show_view = e.currentTarget.getAttribute('id');
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
								if(typeof projectViewSel.onAfterRendered != "undefined" && projectViewSel.onAfterRendered != ""){
									cCreatedViewsFunc[show_view] = projectViewSel.onAfterRendered;
								}
							}
						}
						mainViewShowingNow = show_view;
						this.mainViewShowingInNow = mainViewShowingNow;
						pressedOtherView = true;
						app.main.show(cCreatedViews[show_view]);
						renderMainView();
						if(typeof cCreatedViewsFunc[show_view] != "undefined" && cCreatedViewsFunc[show_view] != ""){
							cCreatedViewsFunc[show_view]();
						}
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
						renderMainView();
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
						renderMainView();
					}
				}.bind(this));*/
				$('#board_view_show').click(function(){
				var type = 'board_view_show';
				if(type === 'board_view_show'){
					if(cBoardView === ''){
						cBoardView = new projectGridView(mainViewObject);
						if(navigationModelObj != ""){
							cBoardView.options.navigationModel = navigationModelObj;
							cBoardView.renderNavigation();
						}
						this.listenTo(cBoardView, 'render',  this.listenToChangeView);
					}
					mainViewShowingNow = "board_view_show";
					this.mainViewShowingInNow = mainViewShowingNow;
					pressedOtherView = true;
					app.main.show(cBoardView);
					renderMainView();
				}
				}.bind(this));
			}
			var thisProj = "";
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
                id = options.id;
                id_on_link = id;
				projects = this.getProject(id_on_link);
				navigation_pr = this.getNavigationAllL(projects);
                if(navigation_pr === ''){
                    if(typeof this.projectModels[projects.idd] != 'undefined'){
                        thisProj = this.projectModels[projects.idd];
                    }else{
                        thisProj = new project({_id:projects.idd});
						thisProj.url = '/projectentryy/no/'+projects.idd;
                        /*thisProj.url = '/projectentry/'+projects.idd;
						if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
							thisProj.fetch().done(function(){
								navigationModelObj = thisProj;
								if(cView != ''){
								cView.options.navigationModel = thisProj;
								cView.renderNavigation();
								}
									app.vent.on("userConnected:ready", function(){
										renderMainView();
									}.bind(this));
							}.bind(this)).error(function(){
								app.getWhenNotFoundData();
							});
						}*/
                        this.projectModels[projects.idd] = thisProj;
                    }
					
					mainViewObject = {collection: projects, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')};
					setViewCreated(mainViewShowingNow, mainViewObject);
                }else{
					thisProj = navigation_pr;
					mainViewObject = {collection: projects, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')};
					
					setViewCreated(mainViewShowingNow, mainViewObject);
                }
				
					if(typeof thisProj != "undefined" && thisProj != ""){//typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
						var projectDataWhenLoaded = function(visibilityOfIt){
									projects.url = "/projectt/no/"+projects.idd;
									projects.fetch().done(function(){
										for(var ii=0; ii < projects.models.length; ii++){
											projects.models[ii].set('parentvisibility', visibilityOfIt);
										}
										if (typeof comparator == 'function') {
											projects.sort(projects.comparator());
										}
										if(functionToBeCalledToAddShared != ""){
											functionToBeCalledToAddShared();
										}
										if(cView != ''){
											app.main.show(cView);
										}
											renderMainView();
											app.vent.on("userConnected:ready", function(){
												renderMainView();
											});
									});
						}
						var getVisibilityOfTheProject = function(thisProj, visibilityOfIt, canView){
									var friendsInThatProj = thisProj.get("friends");
									for(var ii=0; ii < friendsInThatProj.length; ii++){
										if(typeof friendsInThatProj[ii] != "undefined" && friendsInThatProj[ii] != "" && typeof friendsInThatProj[ii]._id != "undefined" && friendsInThatProj[ii]._id != ""){
											if(typeof app.userData == "undefined" || app.userData._id == friendsInThatProj[ii]._id){
												canView = true;
											}
										}
									}
									if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
										canView = true;
										visibilityOfIt = "editpublic";
									}
							return {visibilityOfIt:visibilityOfIt, canView:canView};
						}
						
							thisProj.fetch().done(function(){
								if(typeof app.userData == "undefined"){
									app.vent.on("userConnected:ready", function(){
										var canView = false;
										var visibilityOfIt = thisProj.get("visibility");
										if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
											var getVisibilityOff = getVisibilityOfTheProject(thisProj, visibilityOfIt, canView);
											visibilityOfIt = getVisibilityOff.visibilityOfIt;
											canView = getVisibilityOff.canView;
										}
										if(visibilityOfIt == "editcommentpublic" || visibilityOfIt == "editpublic" || visibilityOfIt == "public" || canView){
											projectDataWhenLoaded(visibilityOfIt);
										}else{
											app.getWhenPrivateData();
										}
									});
								}else{
									var canView = false;
									var visibilityOfIt = thisProj.get("visibility");
									if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
										var getVisibilityOff = getVisibilityOfTheProject(thisProj, visibilityOfIt, canView);
										visibilityOfIt = getVisibilityOff.visibilityOfIt;
										canView = getVisibilityOff.canView;
									}
									if(visibilityOfIt == "editcommentpublic" || visibilityOfIt == "editpublic" || visibilityOfIt == "public" || canView){
										projectDataWhenLoaded(visibilityOfIt);
									}else{
										app.getWhenPrivateData();
									}
								}
							}).error(function(){
								app.getWhenNotFoundData();
							});
					}
				
            }
            else{
				/*First window */
				//projectsShared
				functionToBeCalledToAddShared = function(){
					if(typeof app.userConnected.data2 !== 'undefined'){
						projects.addSharedModels(projectsShared);
					}else{
						app.vent.on("userConnected:ready", function(){
							projects.addSharedModels(projectsShared);
						});
					}
				}
				
				mainViewObject = {collection: projects};
				setViewCreated(mainViewShowingNow, mainViewObject);
				if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
					location.href = "#page/first";
				}
            }

			this.refreshProjectsRender = function(view){
				projects.sort(projects.comparator());
                renderMainView();
			}
			if(cView != ''){
				this.listenTo(cView, 'render', this.listenToChangeView);
				this.listenTo(cView, 'project:edit', this.refreshProjectsRender);
				this.listenTo(cView, 'project:delete', this.refreshProjectsRender);
			}
			if(typeof options == 'undefined' || typeof options.id == 'undefined' || options.id == ''){
				if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
					projects.fetch().done(function(){
						for(var ii=0; ii < projects.models.length; ii++){
							projects.models[ii].set('parentvisibility', 'editprivate');
						}
						if (typeof comparator == 'function') {
							projects.sort(projects.comparator());
						}
						if(functionToBeCalledToAddShared != ""){
							functionToBeCalledToAddShared();
						}
						if(cView != ''){
							app.main.show(cView);
						}
						renderMainView();
							app.vent.on("userConnected:ready", function(){
								renderMainView();
							});
					});
				}
			}
            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'add', active: false},
                {title: '<div class="glyphicon glyphicon-th-list icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'open_right_menu', active: false}
            ]);
			if(thisProj == ""){
				 menuTopRightCol = new Nav([
					{title: '<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'add', active: false}
				]);
			}
            var menuTopRight = new MenuView({collection: menuTopRightCol});
            app.menu.show(menuTopRight);
            app.vent.trigger('top:leftmenu:show');
            app.footernavright.show(new EmptyView());
            app.footernavleft.show(new EmptyView());

            renderMainView();
            this.listenTo(menuTopRight, 'menuitem:click',function(view){
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
                    Backbone.history.navigate('#add/'+id_on_link,{ trigger:true, replace: true });
                }
            }.bind(this));
            this.listenTo(projects, 'remove add',function(modell){
				renderMainView();
            });
			this.prjsprojects = projects;
            this.listenTo(projects, 'change',this.onProjectChange);
        }
    });
    return projectsContr;
});
