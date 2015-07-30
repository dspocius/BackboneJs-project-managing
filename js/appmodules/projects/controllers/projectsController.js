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
            var id_on_link = '_';
            var islistOne = false;
            var projects = this.mainProject;
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
                id = options.id;
                id_on_link = id;
                if(typeof this.projects[id] != 'undefined'){
                    projects = this.projects[id];
                }else{
                    projects = new projectsCollection({idd:id_on_link});
                    projects.url = '/project/'+id;
                    this.projects[id] = projects;
                }
            }
            var cView = new projectGridView({collection: projects});
            projects.fetch().done(function(){
                projects.sort(projects.comparator());
                cView.trigger('refresh:dom');
                projects.sort(projects.comparator());
                cView.render();
            });
            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-plus icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '',actionEx:'add', active: false}
            ]);
            var menuTopRight = new MenuView({collection: menuTopRightCol});
            app.menu.show(menuTopRight);
            app.vent.trigger('top:leftmenu:show');
            app.footernavright.show(new EmptyView());
            app.footernavleft.show(new EmptyView());
            app.main.show(cView);
            cView.render();
            this.listenTo(menuTopRight, 'menuitem:click',function(view){
                if(view.model.get('actionEx') == 'add'){
                    Backbone.history.navigate('#add/'+id_on_link,{ trigger:true, replace: true });
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
