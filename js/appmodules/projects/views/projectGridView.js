define([
    '../../../app',
    'marionette',
    './projectGridRowView',
    'tpl!../templates/projectGrid.html'
], function (app,Marionette, projectGridRowView, projectGrid) {
    'use strict';

    var view = Marionette.CompositeView.extend({
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects tr',
        initialize:function(options){
            this.on('refresh:dom',function(){
                this.onRender();
            });
            this.on('itemview:project:edit',function(view){
                this.trigger('project:edit',view);
            });
            this.on('itemview:project:delete',function(view){
                this.trigger('project:delete', view);
            });

        },
        addItemView: function(child, ChildView, index){
            if (child.get('isHeader')) {
                Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
            }
        },
        onRender: function(){
            var size_of = 0;
            var pGrid = this;
            this.collection.each(function(project) {
                var personView = new projectGridRowView({ model: project, tagName:'div', className:'' });
                if(!project.get('isHeader')){
                    if($('#projects_one_in'+project.get('inHeader')).length){
                        $('#projects_one_in'+project.get('inHeader')).prepend(personView.$el);
                        personView.render();
                    }
                }else{
                    size_of += 214;
                }
            });
            if(size_of != ''){
                $("#the_all_projects").attr('style','width: '+size_of+'px; margin:auto;');
            }
            var delayT = 0;
            if(app.isMobile){
                delayT = 500;
            }
            $('.tsortable').sortable({
                items: 'td',
                delay:delayT,
                start: function(event, ui){
                    $(ui.item).find('.projects_one_in_header').addClass('projectsSelected');
                    window.dragStarted = true;
                },
                stop: function(event, ui){
                    $(ui.item).find('.projects_one_in_header').removeClass('projectsSelected');
                    window.dragStarted = false;
                },
                handle: ".projects_one_in_header",
                update: function( event, ui ) {
                    var pid = ui.item[0].getAttribute('pid');
                    var thisItem = pGrid.collection.get(pid);
                    if(typeof thisItem !== 'undefined'){
                        var numb = 0;
                        var isHeaderItems = $( ".headerMain" );
                        isHeaderItems.each(function( index ) {
                            if($( this ).attr('pid') == pid){
                                numb = index;
                            }
                        });
                        var inHeaderId = "";
                        var layerX = 51;
                        if(numb === 0){
                            if(isHeaderItems.length > 1){
                                inHeaderId = isHeaderItems.get(numb+1).getAttribute('pid');
                                layerX = 51;
                            }
                        }else{
                            inHeaderId = isHeaderItems.get(numb-1).getAttribute('pid');
                            layerX = 0;
                        }
                        if(inHeaderId !== ''){
                            thisItem.set('positionLayerX', layerX);
                            thisItem.set('positionModelIdX', inHeaderId);
                        }

                    }
                }
            });
            $('.tsortable').disableSelection();
            $('.projects_one_in_header').sortable({
                items: 'li',
                delay:delayT,
                start: function(event, ui){
                    $(ui.item).addClass('currentSelected');
                    window.dragStarted = true;
                },
                stop: function(event, ui){
                    $(ui.item).removeClass('currentSelected');
                    window.dragStarted = false;
                },
                connectWith: ".projects_one_in_header",
                change: function(event, ui){
                    $('body').scroll();
                },
                update: function( event, ui ) {
                    var pid = ui.item[0].getAttribute('id').replace('project_','');
                    var thisItem = pGrid.collection.get(pid);
                        if(typeof thisItem !== 'undefined'){
                            var numb = -1;
                            var cInHeaderId = "";
                            var positionModelId = "";
                            var layerY = 0;
                            $( ".headerMain" ).each(function( index ) {
                                var inHeaderElements = $( this ).find('.project_one');
                                var thisHeaderId = $(this).attr('pid');
                                    inHeaderElements.each(function( index2 ) {
                                        if($( this ).attr('id').replace('project_','') == pid){
                                            numb = index2;
                                            cInHeaderId = thisHeaderId;
                                        }
                                    });
                                if(numb !== -1){
                                    if(numb === 0){
                                        if(inHeaderElements.length > 1 && typeof inHeaderElements.get(numb+1) !== 'undefined'){
                                            positionModelId = inHeaderElements.get(numb+1).getAttribute('id').replace('project_','');
                                            layerY = 0;
                                        }
                                    }else{
                                        if(typeof inHeaderElements.get(numb-1) !== 'undefined'){
                                            positionModelId = inHeaderElements.get(numb-1).getAttribute('id').replace('project_','');
                                            layerY = 51;
                                        }
                                    }
                                }
                            });

                            if(cInHeaderId !== ''){
                                thisItem.set('inHeader', cInHeaderId);
                                thisItem.save();
                                thisItem.set('inHeaderUpdateView', 'yes');
                            }

                            if(positionModelId !== ''){
                                thisItem.set('positionLayerY', layerY);
                                thisItem.set('positionModelId', positionModelId);
                                thisItem.set('positionModelIsHeader', false);
                            }
                    }
                }
            });
            $('.projects_one_in_header').disableSelection();
        }
    });
    return view;
});
