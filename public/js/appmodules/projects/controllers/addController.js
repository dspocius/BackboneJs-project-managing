define([
    '../../../app',
	'../../../config',
    'backbone',
    'underscore',
    '../views/createView',
    '../views/projectGridView',
    '../views/projectGridRowView',
    '../collections/projectsCollection',
    'models/project',
    'collections/Nav',
    'views/MenuView',
    'views/EmptyView'
], function( app, config, Backbone, _, createView, projectGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView ) {
    var projectsContr = Backbone.Model.extend({
        initialize: function(){
            this.settings = [];
            this.projects = [];
            this.entrieson = [];
            this.mainProject = new projectsCollection({idd:'_'});
        },
        show: function(options){
            var id = '';
            var isList = false;
            var projects;
            var entries;
			var commentsCol;
            this.id = options.id;
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != '' && options.id != '_'){
                id = options.id;
                if(typeof options.listId != 'undefined' && options.listId != ''){
                    this.id = options.listId;
                }
                if(typeof options.isList != 'undefined' && options.isList){
                    isList = true;
                }
				
                if(typeof this.projects[id] != 'undefined'){
                    entries = this.entrieson[id];
				}else{
                    entries = new project({_id:options.id});
					entries.url = config.urlAddr+'/projectentryy/'+options.id;
					this.entrieson[id] = entries;
				}
				
                if(typeof this.projects[id] != 'undefined'){
                    projects = this.projects[id];
                }else{
                    projects = new projectsCollection({idd:options.id});
                    projects.url = config.urlAddr+'/projectt/'+id;
                    this.projects[id] = projects;
                }
            }else{
                projects = this.mainProject;
            }
            if(isList){
                this.onDone(id, '', isList, options.settings,'','');
            }else{
				if(typeof entries != "undefined" && entries != ""){
					entries.fetch().done(function(){
						var canView = false;
						var visibilityOfIt = entries.get("visibility");
						var getViewAndCan = this.getVisibilityOfTheProject(entries, visibilityOfIt, canView);
						visibilityOfIt = getViewAndCan.visibilityOfIt;
						canView = getViewAndCan.canView;
						if(visibilityOfIt == "editpublic" || (visibilityOfIt == "editprivate" && canView)){
							projects.fetch().done(function(){
								this.onDone(id,projects, isList, options.settings, visibilityOfIt, entries);
							}.bind(this));
						}else{
							app.getWhenPrivateData();
						}
					}.bind(this));
				}else{
							projects.fetch().done(function(){
								this.onDone(id,projects, isList, options.settings, "", "");
							}.bind(this));
				}
				
            }
        },
		getVisibilityOfTheProject: function(thisProj, visibilityOfIt, canView){
			var friendsInThatProj = thisProj.get("friends");
			var checkUrl = thisProj.url.split("/").length;
			if (checkUrl == 5 || checkUrl == 6) {
				canView = true;
				visibilityOfIt = "editpublic";
			}
			
			if(typeof friendsInThatProj != "undefined" && typeof friendsInThatProj.length != "undefined" && friendsInThatProj != ""){
				for(var ii=0; ii < friendsInThatProj.length; ii++){
					if(typeof friendsInThatProj[ii] != "undefined" && friendsInThatProj[ii] != "" && typeof friendsInThatProj[ii]._id != "undefined" && friendsInThatProj[ii]._id != ""){
						if(typeof app.userData == "undefined" || app.userData._id == friendsInThatProj[ii]._id){
							canView = true;
						}
					}
				}
			}
				if(typeof app.userData != "undefined" && typeof thisProj != "undefined" && typeof thisProj.get != "undefined" &&
				thisProj.get("email") == app.userData.email){
					canView = true;
					visibilityOfIt = "editpublic";
				}
			return {visibilityOfIt:visibilityOfIt, canView:canView};
		},
		setWhichEntriesIsOld: function(data, projects){
			var howmanycanbethere = parseInt(app.getSettingInWhole('make_old_when'));
							var how_many = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									how_many++;
								}
							}
							var how_many_should_be_set = how_many-howmanycanbethere;
							var how_many_now_set = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									if(how_many_should_be_set > how_many_now_set){
										projects.models[pr].set('is_old', 'true');
										projects.models[pr].save();
										how_many_now_set++;
									}
								}
							}
		},
        onDone:function(id, projects, isList, settings, visibilityOfIt, thisProj){
            var dProjects = '';
			var color = '#ffffff';
			var listsColor = '#ffffff';
			var entryColor = '#ffffff';
			if(settings !== ''){
				color = app.getSettingInWhole("color");
				listsColor = app.getSettingInWhole("listsColor");
				entryColor = app.getSettingInWhole("entryColor");
			}
			
            if(!isList){
                for(var pr in projects.models){
					if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
						projects.models[pr].set('parentvisibility', 'editcommentpublic');
					}else{
						if(typeof app.userData != "undefined" && projects.models[pr].get("email") == app.userData.email){
							projects.models[pr].set('parentvisibility', "editpublic");
						}else{
							if(typeof thisProj != "" && typeof app.userData != "undefined"
 && typeof thisProj != "undefined" && typeof thisProj.get != "undefined"
							&& thisProj.get("email") == app.userData.email){
								projects.models[pr].set('parentvisibility', "editpublic");
							}else{
								var visibilitView = projects.models[pr].get("visibility");
								
								if (projects.idd == "_") {
									visibilitView = "editpublic";
								}
								
								if (typeof projects.url != "undefined" && projects.url != "" && 
								projects.url.split("/").length == 5) {
									visibilitView = "editpublic";
								}
								
								projects.models[pr].set('parentvisibility', visibilitView);
							}
						}
					}
                    if(projects.models[pr].get('isHeader')){
						if(projects.models[pr].get('parentvisibility') == "editpublic" || projects.models[pr].get('parentvisibility') == "editprivate"){
							dProjects += '<option value="'+projects.models[pr].get('_id')+'">'+projects.models[pr].get('text')+'</option>';
						}
                    }
                }
            }else{
                dProjects = 'list';
            }
            var viewCreate = new createView({model: new Backbone.Model({id:id, projects:dProjects, color:color,listsColor:listsColor,entryColor:entryColor})});

            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-minus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'minus', active: false}
            ]);
            var menuTopRight = new MenuView({collection: menuTopRightCol});
            app.menu.show(menuTopRight);
            app.vent.trigger('top:leftmenu:show');
            app.footernavright.show(new EmptyView());
            app.footernavleft.show(new EmptyView());
            app.main.show(viewCreate);
			
            this.listenTo(menuTopRight, 'menuitem:click',function(view){
                if(view.model.get('actionEx') == 'minus'){
                    if(isList){
                        Backbone.history.navigate('#projectsinlist/'+id+'/'+this.id,{ trigger:true, replace: true });
                    }else{
                        if(id == ''){
                            Backbone.history.navigate('#page/home',{ trigger:true, replace: true });
                        }else{
                            Backbone.history.navigate('#project/'+id,{ trigger:true, replace: true });
                        }
                    }
                }
            }.bind(this));
            this.listenTo(viewCreate, 'project:save', function(data){
                var newP = new project(data);
				var get_def_visibility = app.getSettingInWhole('defaultVisibilityAdded');
				var what_to_show = app.getSettingInWhole('defaultEntryViewWhenAdded');
				newP.set("visibility", get_def_visibility);
				if(typeof thisProj != "" && typeof app.userData != "undefined" 
	&& typeof thisProj != "undefined" && typeof thisProj.get != "undefined"
				&& thisProj.get("email") != app.userData.email){
					newP.set("visibility", "editpublic");
				}
				newP.set("what_to_show", what_to_show);
                if(!newP.get('isHeader') && !newP.get('isProject')){
					/*newP.set('view_main','photobook_view_show');*/
				}
                if(newP.get('isHeader')){
                    //newP.set('color','#5e5e5e')
                }
                var id_to_save = this.id;
                if(isList){
                    if(id_to_save === '_'){
                        newP.set('inProjects','');
                    }else{
                        newP.set('inProjects',id_to_save);
                    }
                    newP.set('inHeader', id);
                }
                newP.save({idd:id_to_save}).done(function(data2){
                    if(!$('#add_more').is(':checked')){
                        if(data.isHeader){
						var nprojectt = new project(data2);
						nprojectt.set("parentvisibility","editprivate");
						nprojectt.set("parentvisibility_can_view",true);
                            projects.add(nprojectt);
                        }
						if(!data.isHeader){
							this.setWhichEntriesIsOld(data, projects);
						}
                        if(isList){
                            Backbone.history.navigate('#projectsinlist/'+id+'/'+this.id,{ trigger:true, replace: true });
                        }else{
                            if(id == ''){
                                Backbone.history.navigate('#page/home',{ trigger:true, replace: true });
                            }else{
                                Backbone.history.navigate('#project/'+id,{ trigger:true, replace: true });
                            }
                        }
                    }else{
						if(!data.isHeader){
							this.setWhichEntriesIsOld(data, projects);
						}
						var nprojectt = new project(data2);
						nprojectt.set("parentvisibility","editprivate");
						nprojectt.set("parentvisibility_can_view",true);
                        projects.add(nprojectt);
                        var colorChoosejQ = $('#color_this').val();
                        var entryTypejQ = $('input[name=radioSelectProjectType]:checked').val();
                        var projectSjQ = $('#inprojectwhich').val();
                        var addMoreSjQ = $('#add_more').is(':checked');
                        var dProjects = '';
                        for(var pr in projects.models){
                            if(projects.models[pr].get('isHeader')){
								if(typeof app.userData != "undefined" && projects.models[pr].get("email") == app.userData.email){
									projects.models[pr].set("parentvisibility","editpublic");
								}
								if(projects.models[pr].get('parentvisibility') == "editpublic" || projects.models[pr].get('parentvisibility') == "editprivate"){
									var selectidIs = '';
									if(projects.models[pr].get('_id') === projectSjQ){
										selectidIs = 'selected';
									}
									dProjects += '<option value="'+projects.models[pr].get('_id')+'" '+selectidIs+'>'+projects.models[pr].get('text')+'</option>';
								}
                            }
                        }
                        viewCreate.model.set('projects',dProjects);
                        viewCreate.render();
                        $('#color_this').val(colorChoosejQ);
                        if(addMoreSjQ){
                            $('#add_more').attr('checked', true);
                        }
                        var rradios = $('input:radio[name=radioSelectProjectType]');
                        rradios.filter('[value='+entryTypejQ+']').prop('checked', true);
                    }
                }.bind(this));
            }.bind(this));
        }
    });
    return projectsContr;
});
