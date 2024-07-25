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
	'templates'
], function( app, Backbone, _, createView, listGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView, templates ) {
    var projectsContr = Backbone.Model.extend({
        initialize: function(options){
            if(typeof options.mainProjectCtrl !== 'undefined'){
                this.projects = options.mainProjectCtrl.projects;
                this.projectModels = options.mainProjectCtrl.projectModels;
                this.mainProject = options.mainProjectCtrl.projectModels;
            }else{
                this.projects = [];
                this.projectModels = [];
                this.mainProject = new projectsCollection({idd:'_'});
            }
        },
        show: function(options, username){
            var id = '';
            var id_on_link = '_';
            var list_id = '_';
            var islistOne = false;
            var projects = this.mainProject;
            var cView = "";
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
                id = options.id;
                list_id = options.listId;
                id_on_link = id;
                if(typeof this.projects[id] != 'undefined' && typeof this.projects[options.id].models != 'undefined'){
                    projects = this.projects[id];
                }else{
                    projects = new projectsCollection({idd:id_on_link});
                    if(id === 'friends'){
                        if(typeof app.userConnected.data2 !== 'undefined'){
                            projects.url = '/projectsfriend/'+app.userConnected.data2._id;
                        }else{
                            app.vent.on("userConnected:ready", function(){
                                projects.url = '/projectsfriend/'+app.userConnected.data2._id;
                            }.bind(this));
                        }
                    }else{
                        projects.url = '/projectsinlistt/'+username+'/'+id;
                    }
                    this.projects[id] = projects;
                    this.projects.push(projects);
                }
                /* for navigation */
                var navigation_pr = "";
                for(var ii=0; ii < this.projects.length;ii++){
                    if(typeof this.projects[ii].get(projects.idd) !== 'undefined'){
                        navigation_pr = this.projects[ii].get(projects.idd);
                    }
                }
				if(id !== 'friends'){
					if(navigation_pr === ''){
						var thisProj = "";
						if(typeof this.projectModels[options.id] != 'undefined'){
							thisProj = this.projectModels[options.id];
						}else{
							thisProj = new project({_id:options.id});
							thisProj.url = '/projectentryy/'+username+'/'+options.id;
							thisProj.fetch().done(function(){
								cView.options.navigationModel = thisProj;
								cView.renderNavigation();
							});
							this.projectModels[options.id] = thisProj;
						}
						cView = new listGridView({collection: projects, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
					}else{
						cView = new listGridView({collection: projects, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
					}
				}else{
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
                    app.vent.on("userConnected:ready", function(){
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
                    }.bind(this));
                }else{
                    projects.fetch().done(function(){
                        projects.sort(projects.comparator());
                        /*
                         cView.trigger('refresh:dom');
                         projects.sort(projects.comparator());
                         */
                        app.main.show(cView);
                        cView.render();
                    });
                }
            }

            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'add', active: false}
            ]);
			if(!templates.loggedIn){
				menuTopRightCol = new Nav([]);
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
        }
    });
    return projectsContr;
});
