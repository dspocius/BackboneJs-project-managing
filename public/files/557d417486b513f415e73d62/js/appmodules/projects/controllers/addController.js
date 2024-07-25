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
            this.settings = [];
            this.projects = [];
            this.mainProject = new projectsCollection({idd:'_'});
        },
        show: function(options){
            var id = '';
            var isList = false;
            var projects;
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
                    projects = this.projects[id];
                }else{
                    projects = new projectsCollection({idd:options.id});
                    projects.url = '/project/'+id;
                    this.projects[id] = projects;
                }
            }else{
                projects = this.mainProject;
            }
            if(isList){
                this.onDone(id, '', isList, options.settings);
            }else{
                projects.fetch().done(function(){
                    this.onDone(id,projects, isList, options.settings);
                }.bind(this));
            }
        },
        onDone:function(id, projects, isList, settings){
            var dProjects = '';
			var color = '#337ab7';
			var listsColor = '#337ab7';
			var entryColor = '#337ab7';
			if(settings !== ''){
				color = settings.color;
				listsColor = settings.listsColor;
				entryColor = settings.entryColor;
			}
            if(!isList){
                for(var pr in projects.models){
                    if(projects.models[pr].get('isHeader')){
                        dProjects += '<option value="'+projects.models[pr].get('_id')+'">'+projects.models[pr].get('text')+'</option>';
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
                            projects.add(new project(data2));
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
                        projects.add(new project(data2));
                        var colorChoosejQ = $('#color_this').val();
                        var entryTypejQ = $('input[name=radioSelectProjectType]:checked').val();
                        var projectSjQ = $('#inprojectwhich').val();
                        var addMoreSjQ = $('#add_more').is(':checked');
                        var dProjects = '';
                        for(var pr in projects.models){
                            if(projects.models[pr].get('isHeader')){
                                var selectidIs = '';
                                if(projects.models[pr].get('_id') === projectSjQ){
                                    selectidIs = 'selected';
                                }
                                dProjects += '<option value="'+projects.models[pr].get('_id')+'" '+selectidIs+'>'+projects.models[pr].get('text')+'</option>';
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
