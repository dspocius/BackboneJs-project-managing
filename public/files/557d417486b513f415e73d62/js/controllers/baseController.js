define([
	'../app',
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
], function( app, Backbone, _, createView, projectGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView,
projectCalendarView, projectListView ) {
    return Backbone.Model.extend({
		initialize: function(options){
            if(typeof options !== 'undefined' && typeof options.mainProjectCtrl !== 'undefined'){
                this.projects = options.mainProjectCtrl.projects;
                this.projectModels = options.mainProjectCtrl.projectModels;
                this.mainProject = options.mainProjectCtrl.projectModels;
            }else{
                this.projects = [];
                this.projectModels = [];
                this.mainProject = new projectsCollection({idd:'_'});
				this.mainProject.otherCols = [];
            }
        },
		getProject: function(id){
			var projects = '';
            if(typeof this.projects[id] != 'undefined' && typeof this.projects[id].models != 'undefined'){
                projects = this.projects[id];
            }else{
                projects = new projectsCollection({idd:id});
                projects.url = '/project/'+id;
				projects.otherCols = [];
                this.projects[id] = projects;
                this.projects.push(projects);
            }
			return projects;
		},
		onProjectChange: function(modell){
                if(typeof modell != "undefined" && typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    this.prjsprojects.sort(this.prjsprojects.comparator());
                    modell.unset('inHeaderUpdateView', 'silent');
					renderMainView();
                }
				if(typeof modell != "undefined" && typeof modell.get('inCollectionData') != 'undefined' &&
					modell.get('inCollectionData') != ''){
					var cdata = modell.get('inCollectionData');
					modell.set('inCollectionData','');
					var pr = this.getProject(cdata.id);
					pr.fetch().done(function(){
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
							cViewwaz.render();
							$(cdata.el).html(cViewwaz.$el);
							cViewwaz.render();
							$('.treeShowContainer table').each(function(){
								$(this).css('width', 'auto');
								var widd = $(this).width();
								$(this).css('width', widd +'px');
							});
							this.listenTo(pr, 'change',this.onProjectChange);
							
					}.bind(this));
				}
		},
		getMainViewOfSite: function(options){
			var mainViewShowingNow = "board_view_show";
			if(typeof options.settings != 'undefined' && typeof options.settings.defaultViewOfSite != 'undefined' && 
			options.settings.defaultViewOfSite != ''){
				mainViewShowingNow = options.settings.defaultViewOfSite;
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