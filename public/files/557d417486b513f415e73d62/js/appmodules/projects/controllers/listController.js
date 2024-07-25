define([
    '../../../app',
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
	'views/rightModalView'
], function( app, Backbone, _, createView, listGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView, baseController, rightModalView ) {
    var projectsContr = baseController.extend({
        show: function(options){
            var id = '';
            var id_on_link = '_';
            var list_id = '_';
            var islistOne = false;
            var projects = this.mainProject;
            var cView = "";
			this.mainViewShowingInNow = "board_view_show";
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
                id = options.id;
                list_id = options.listId;
                id_on_link = id;
				var thisProj = "";
                if(typeof this.projects[id] != 'undefined' && typeof this.projects[options.id].models != 'undefined'){
                    projects = this.projects[id];
                }else{
					projects = this.getProject(id_on_link);
                    if(id === 'friends'){
                        if(typeof app.userConnected.data2 !== 'undefined'){
                            projects.url = '/projectsfriend/'+app.userConnected.data2._id;
                        }else{
                            app.vent.on("userConnected:ready", function(){
                                projects.url = '/projectsfriend/'+app.userConnected.data2._id;
								projects.fetch().done(function(){
									projects.sort(projects.comparator());
									app.main.show(cView);
									cView.render();
								});
							}.bind(this));
                        }
                    }else{
                        projects.url = '/projectsinlist/'+id;
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
							thisProj.url = '/projectentryy/no/'+projects.idd;
							/*thisProj.fetch().done(function(){
								cView.options.navigationModel = thisProj;
								cView.renderNavigation();
							});*/
							this.projectModels[projects.idd] = thisProj;
						}
						cView = new listGridView({collection: projects, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
					}else{
						thisProj = navigation_pr;
						cView = new listGridView({collection: projects, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
					}
					
					if(typeof thisProj != "undefined" && thisProj != ""){
						var projectDataWhenLoaded = function(visibilityOfIt){ 
									projects.url = "/projectsinlistt/no/"+projects.idd;
									//projects.url = "/projectt/no/"+projects.idd;
									projects.fetch().done(function(){
										cView.options.navigationModel = thisProj;
										cView.renderNavigation();
										for(var ii=0; ii < projects.models.length; ii++){
											projects.models[ii].set('parentvisibility', visibilityOfIt);
										}
										projects.sort(projects.comparator());
										app.main.show(cView);
										cView.render();
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
					
					
				}else{
					/*id = friends*/
					cView = new listGridView({collection: projects});
				}
            }
            else{
                cView = new listGridView({collection: projects});
            }

            if(typeof app.userConnected.data2 !== 'undefined' && id === 'friends'){
                projects.url = '/projectsfriend/'+app.userConnected.data2._id;
                projects.fetch().done(function(){
                    projects.sort(projects.comparator());
                    /*
                     cView.trigger('refresh:dom');
                     projects.sort(projects.comparator());
                     */
                    app.main.show(cView);
                    cView.render();
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
                {title: '<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'add', active: false},
                {title: '<div class="glyphicon glyphicon-th-list icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'open_right_menu', active: false}
            ]);
			if(thisProj == ""){
				 menuTopRightCol = new Nav([
					{title: '<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'add', active: false}
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
            cView.render();
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
                    Backbone.history.navigate('#addlist/'+id_on_link+'/'+list_id,{ trigger:true, replace: true });
                }
            });

            this.listenTo(projects, 'remove',function(modell){
                cView.render();
            });
            this.listenTo(projects, 'change',function(modell){
                if( typeof modell.get('positionLayerY') != 'undefined'
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
                    cView.render();
                }
                if(typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    projects.sort(projects.comparator());
                    cView.render();
                    modell.unset('inHeaderUpdateView', 'silent');
                }
                if( typeof modell.get('positionLayerX') != 'undefined'
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
                    cView.render();
                }

            });
            this.listenTo(cView, 'project:edit', function(view){
                projects.sort(projects.comparator());
                cView.render();
            });
            this.listenTo(cView, 'project:delete', function(view){
                projects.sort(projects.comparator());
                cView.render();
            });
			this.prjsprojects = projects;
			this.listenTo(projects, 'change',this.onProjectChange);
        }
    });
    return projectsContr;
});
