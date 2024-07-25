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
	'templates'
], function( app, Backbone, _, createView, projectGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView, templates ) {
    var projectsContr = Backbone.Model.extend({
        initialize: function(options){
            if(typeof options !== 'undefined' && typeof options.mainProjectCtrl !== 'undefined'){
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
            var islistOne = false;
            var projects = this.mainProject;
			projects.url = '/projectss/'+username;
            var navigation_pr = "";
            var cView = "";
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
                id = options.id;
                id_on_link = id;
                if(typeof this.projects[id] != 'undefined' && typeof this.projects[options.id].models != 'undefined'){
                    projects = this.projects[id];
                }else{
                    projects = new projectsCollection({idd:id_on_link});
                    projects.url = '/projectt/'+username+'/'+id;
                    this.projects[id] = projects;
                    this.projects.push(projects);
                }
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
                        thisProj.url = '/projectentryy/'+username+'/'+options.id;
                        thisProj.fetch().done(function(){
                            cView.options.navigationModel = thisProj;
                            cView.renderNavigation();
                        });
                        this.projectModels[options.id] = thisProj;
                    }
                    cView = new projectGridView({collection: projects, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }else{
                    cView = new projectGridView({collection: projects, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')});
                }
            }
            else{
                cView = new projectGridView({collection: projects});
            }
            projects.fetch().done(function(){
                if (typeof comparator == 'function') {
                    projects.sort(projects.comparator());
                }
                app.main.show(cView);
                cView.render();
            });
            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'add', active: false}
            ]);
			if(!templates.loggedIn){
				menuTopRightCol = new Nav([]);
			}
            var menuTopRight = new MenuView({collection: menuTopRightCol});
			
            app.menu.show(menuTopRight);
            app.vent.trigger('top:leftmenu:show');
            app.footernavright.show(new EmptyView());
            app.footernavleft.show(new EmptyView());

            cView.render();
            this.listenTo(menuTopRight, 'menuitem:click',function(view){
                if(view.model.get('actionEx') == 'add'){
                    Backbone.history.navigate('#add/'+id_on_link,{ trigger:true, replace: true });
                }
            });

            this.listenTo(projects, 'remove add',function(modell){
                cView.render();
            });
            this.listenTo(projects, 'change',function(modell){
                if(typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    projects.sort(projects.comparator());
                    modell.unset('inHeaderUpdateView', 'silent');
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
