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
    'views/EmptyView'
], function( app, Backbone, _, createView, projectGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView ) {
    var projectsContr = Backbone.Model.extend({
        initialize: function(){
            this.projects = [];
            this.mainProject = new projectsCollection({idd:'_'});
        },
        show: function(options){
            var id = '';
            var projects;
            this.id = options.id;
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != '' && options.id != '_'){
                id = options.id;
                if(typeof this.projects[id] != 'undefined'){
                    projects = this.projects[id];
                }else{
                    projects = new projectsCollection({idd:this.id});
                    projects.url = '/project/'+id;
                    this.projects[id] = projects;
                }
            }else{
                projects = this.mainProject;
            }
            projects.fetch().done(function(){
                this.onDone(id,projects);
            }.bind(this));
        },
        onDone:function(id, projects){
            var dProjects = '';
            for(var pr in projects.models){
                if(projects.models[pr].get('isHeader')){
                    dProjects += '<option value="'+projects.models[pr].get('_id')+'">'+projects.models[pr].get('text')+'</option>';
                }
            }
            var viewCreate = new createView({model: new Backbone.Model({id:id, projects:dProjects})});

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
                    if(id == ''){
                        Backbone.history.navigate('#page/home',{ trigger:true, replace: true });
                    }else{
                        Backbone.history.navigate('#project/'+id,{ trigger:true, replace: true });
                    }
                }
            });
            this.listenTo(viewCreate, 'project:save', function(data){
                var newP = new project(data);
                if(newP.get('isHeader') && newP.get('color') == '#80BCF0'){
                    newP.set('color','#5e5e5e')
                }
                newP.save({idd:this.id}).done(function(data2){
                    if(!$('#add_more').is(':checked')){
                        if(id == ''){
                            Backbone.history.navigate('#page/home',{ trigger:true, replace: true });
                        }else{
                            Backbone.history.navigate('#project/'+id,{ trigger:true, replace: true });
                        }
                    }else{
                        projects.add(new project(data2));
                        var dProjects = '';
                        for(var pr in projects.models){
                            if(projects.models[pr].get('isHeader')){
                                dProjects += '<option value="'+projects.models[pr].get('_id')+'">'+projects.models[pr].get('text')+'</option>';
                            }
                        }
                        viewCreate.model.set('projects',dProjects);
                        viewCreate.render();
                    }
                });
            });
        }
    });
    return projectsContr;
});
