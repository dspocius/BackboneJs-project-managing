define([
	'../app',
	'../config',
    'backbone',
    'underscore',
    'appmodules/projects/views/createView',
    'appmodules/projects/views/projectGridView',
    'appmodules/projects/views/projectGridRowView',
    'appmodules/projects/collections/projectsCollection',
    'models/project',
    'collections/Nav',
    'views/MenuView',
    'views/EmptyView',
	'appmodules/projects/views/projectCalendarView',
	'appmodules/projects/views/projectListView'
], function( app, config, Backbone, _, createView, projectGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView,
projectCalendarView, projectListView ) {
    return Backbone.Model.extend({
		initialize: function(options){
            if(typeof options !== 'undefined' && typeof options.mainProjectCtrl !== 'undefined'){
                this.projects = options.mainProjectCtrl.projects;
                this.projectModels = options.mainProjectCtrl.projectModels;
                this.mainProject = options.mainProjectCtrl.projectModels;
				this.timelineProject = new projectsCollection({idd:'_'});
				this.timelineProject.url = config.urlAddr+'/projectstimeline';
            }else{
                this.projects = [];
                this.projectModels = [];
                this.mainProject = new projectsCollection({idd:'_'});
                this.timelineProject = new projectsCollection({idd:'_'});
				this.timelineProject.url = config.urlAddr+'/projectstimeline';
				this.mainProject.otherCols = [];
            }
        },
		getParameterByName: function(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		},
		getProject: function(id, p=""){
			var projects = '';
            if(typeof this.projects[id] != 'undefined' && typeof this.projects[id].models != 'undefined'){
                projects = this.projects[id];
            }else{
                projects = new projectsCollection({idd:id});
                projects.url = config.urlAddr+'/projectt/'+id;
				if (p != "") {
					projects.url = config.urlAddr+'/projectt/'+id+"/"+p;
				}
                //projects.url = '/projectt/no/'+id;
				projects.otherCols = [];
                this.projects[id] = projects;
                this.projects.push(projects);
            }
			return projects;
		},
		getProjectOfPerson: function(id){
			var projects = '';
            if(typeof this.projects[id] != 'undefined' && typeof this.projects[id].models != 'undefined'){
                projects = this.projects[id];
            }else{
                projects = new projectsCollection({idd:id});
				projects.url = config.urlAddr+'/projectss/'+id;
				projects.otherCols = [];
                this.projects[id] = projects;
                this.projects.push(projects);
            }
			return projects;
		},
		onProjectChange: function(modell){
                /*if(typeof modell != "undefined" && typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    this.prjsprojects.sort(this.prjsprojects.comparator());
                    modell.unset('inHeaderUpdateView', 'silent');
					renderMainView();
                }*/
				if(typeof modell != "undefined" && typeof modell.get('inCollectionData') != 'undefined' &&
					modell.get('inCollectionData') != ''){
					var cdata = modell.get('inCollectionData');
					//modell.set('inCollectionData','');
					modell.unset('inCollectionData', {silent: true});
					var pr = this.getProject(cdata.id);
					pr.fetch().done(function(){
						var models_there_all = pr.models;
							for(var ii=0; ii < models_there_all.length; ii++){
								models_there_all[ii].set("hisinproject_this", modell.get("_id"));
								if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
									models_there_all[ii].set('parentvisibility', 'editcommentpublic');
								}else{
									if(models_there_all[ii].get("inHeader") !== "friends" && models_there_all[ii].get("_id") !== "friends"){
										models_there_all[ii].set('parentvisibility', 'editprivate');
									}else{
										models_there_all[ii].set('parentvisibility', models_there_all[ii].get("visibility"));
									}
								}
							}
							pr.otherCols.push(this.prjsprojects);
							pr.mainProject = this.mainProject;
							for(var ii=0; ii < this.prjsprojects.otherCols.length; ii++){
								pr.otherCols.push(this.prjsprojects.otherCols[ii]);
							}
							this.prjsprojects.otherCols.push(pr);
							var proj = new Backbone.Model();
							proj.set('not_show_buttons','no');
							var which_one_showing = projectGridView;
							if(this.mainViewShowingInNow == "list_view_show"){
								which_one_showing = projectListView;
							}
							var cViewwaz = new which_one_showing({collection: pr, 
								itemViewContainer:cdata.el,
								navigationModel:'', 
								projectsAll:this.projects,
								mainP:this.get('mainProjectCtrl'),
								model:proj
							});
							cViewwaz.display_on_it = "true";
							cViewwaz.render();
							//window.treeprojects[cdata.el] = cViewwaz;
							modell.set("treeprojectsallproject", cViewwaz, {silent:true});
							$(cdata.el).html(cViewwaz.$el);
							cViewwaz.render();
							$('.treeShowContainer table').each(function(){
								$(this).css('width', 'auto');
								var widd = $(this).width();
								$(this).css('width', widd +'px');
							});
							/*this.listenTo(pr, 'change:inHeaderUpdateView',function(modell){
								if(typeof modell != "undefined" && typeof modell.get('inHeaderUpdateView') != 'undefined'
									&& modell.get('inHeaderUpdateView') == 'yes'){
									this.prjsprojects.sort(this.prjsprojects.comparator());
									modell.unset('inHeaderUpdateView', {silent: true});
									cViewwaz.render();
								}
							}.bind(this));*/
							this.listenTo(pr, 'change:inCollectionData',function(modell){
								this.onProjectChange(modell);
							}.bind(this));
					}.bind(this));
				}
		},
		getMainViewOfSite: function(options){
			var mainViewShowingNow = "board_view_show";
			if(typeof options.settings != 'undefined' && typeof options.settings.defaultViewOfSite != 'undefined' && 
			options.settings.defaultViewOfSite != ''){
				mainViewShowingNow = options.settings.defaultViewOfSite;
			}
			if (typeof options.people != "undefined" && typeof options.people != "") {
				mainViewShowingNow = "time_view_show";
			}
			return mainViewShowingNow;
		},
		getNavigationAllL: function(projects){
			var navigation_pr = "";
			for(var ii=0; ii < this.projects.length;ii++){
                    if(typeof this.projects[ii].get(projects.idd) !== 'undefined'){
                        navigation_pr = this.projects[ii].get(projects.idd);
                    }
            }
			return navigation_pr;
		}
	});
});