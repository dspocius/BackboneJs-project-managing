/*global define */

define([
	'marionette',
	'templates',
    'underscore',
	'views/BaseGridView',
	'appmodules/projects/views/projectGridRowView',
], function (Marionette, templates, _, BaseGridView, projectGridRowView) {
	'use strict';

	return BaseGridView.extend({
		initialize:function(options){
			this.numberOfHead = 0;
            this.on('refresh:dom',function(){
                this.onRender();
            });
            this.on('itemview:project:edit',function(view){
                this.trigger('project:edit',view);
            });
            this.on('itemview:project:treeview',function(view,data){
                this.trigger('project:treeview',view, data);
            });
            this.on('itemview:project:delete',function(view){
                this.trigger('project:delete', view);
            });
        },
        addItemView: function(child, ChildView, index){
            if (child.get('isHeader')) {
				this.numberOfHead++;
                Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
				if($('#empty_it_img').length){
					$('#imgWhenEmpty').remove();
				}
			}
        },
         onRender: function(){
            this.renderNavigation();
            var size_of = 0;
            var pGrid = this;
            if(typeof this.collection.models !== 'undefined'){
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
            }
            if(size_of != '' && typeof this.model == 'undefined'){
                $("#the_all_projects").attr('style','width: '+size_of+'px; margin:auto;');
            }
            var delayT = 0;
            if(app.isMobile){
                delayT = 500;
            }
			
			if(location.hash.indexOf('projectsinlist') == -1){

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
				connectWith: '.tsortable',
                handle: ".projects_one_in_header",
                update: function( event, ui ) {
                    var pid = ui.item[0].getAttribute('pid');
					var getModelOfCol = pGrid.getTheModelFCol(pGrid, pid);
                    var thisItem = getModelOfCol.thisItem;
					var collectionThat = getModelOfCol.collectionThat;
					
                    if(typeof thisItem !== 'undefined'){
                        var numb = 0;
						var pid_projectt_inprojects = "";
						var headersproject_id = "";
                        var isHeaderItems = $( ".headerMain" );
                        isHeaderItems.each(function( index ) {
                            if($( this ).attr('pid') == pid){
                                numb = index;
								pid_projectt_inprojects = $(this).parent().parent().parent().parent().parent().parent().attr('id');
								headersproject_id = $(this).attr('pid');
                            }
                        });
                        var elPos = pGrid.getElementsPositions(numb, isHeaderItems, false);
                        var inHeaderId = elPos.inHeaderId;
                        var nearHeaderId2 = elPos.nearHeaderId2;
                        var isFirstLast = elPos.isFirstLast;

                        if(inHeaderId !== ''){
							if(typeof collectionThat != 'undefined' && 
							typeof collectionThat.get(inHeaderId) != 'undefined'){
								var tdate = pGrid.setPositionsOfElements(collectionThat, inHeaderId, nearHeaderId2, isFirstLast, false);
								thisItem.set('position', tdate);
							}
							var inProjectsBefore = thisItem.get('inProjects');
							var inProjectsTAdd = '';
							var inWhatCollectionToAdd = '';
							var inWhatCollectionToAddReal = '';
							if(typeof pid_projectt_inprojects != 'undefined'){
								pid_projectt_inprojects = pid_projectt_inprojects.replace('project_','');
								thisItem.set('inProjects', pid_projectt_inprojects);
								inProjectsTAdd = pid_projectt_inprojects;
								
								var getModColOfProj = pGrid.getTheModelFCol(pGrid, inProjectsTAdd);
								if(typeof getModColOfProj != 'undefined'){
									inWhatCollectionToAddReal = pGrid.collection;
									inWhatCollectionToAdd = getModColOfProj.collectionThat;
								}
							}else{
								var inProjectT = window.location.hash.replace('#/project/','').replace('#project/','');
								if(inProjectT.indexOf('#home') > -1){
									thisItem.set('inProjects', '');
									inProjectsTAdd = '';
									inWhatCollectionToAdd = pGrid.collection;
									inWhatCollectionToAddReal = pGrid.collection.mainProject;
								}else{
									thisItem.set('inProjects', inProjectT);
									inProjectsTAdd = inProjectT;
									var collectionOfProj = pGrid.getTheCollectionFCol(pGrid, inProjectsTAdd);
									inWhatCollectionToAdd = pGrid.collection;
									inWhatCollectionToAddReal = collectionOfProj;
								}
							}
							thisItem.save();
							if(typeof inWhatCollectionToAddReal != 'undefined' && 
							inWhatCollectionToAddReal != ''){
								inWhatCollectionToAddReal.add(thisItem, { silent: true });
								inWhatCollectionToAdd.remove(thisItem, { silent: true });
								var inheaderThatAll = $('#project_'+headersproject_id);
								var inHeaderElements = inheaderThatAll.find('.project_one');
								if(inProjectsBefore != inProjectsTAdd && 
								inProjectsBefore.indexOf(inProjectsTAdd) == -1){
									inHeaderElements.each(function( index2 ) {
											var pid2 = $( this ).attr('id').replace('project_','');
											var gModelF2 = pGrid.getTheModelFCol(pGrid, pid2);
											var thisItem2 = gModelF2.thisItem;
											thisItem2.set('inProjects',inProjectsTAdd);
											thisItem2.save();
											inWhatCollectionToAddReal.add(thisItem2, { silent: true });
											inWhatCollectionToAdd.remove(thisItem2, { silent: true });
									});
								}
							}
                            /*thisItem.set('inHeaderUpdateView', 'yes');*/
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
					var gModelF = pGrid.getTheModelFCol(pGrid, pid);
                    var thisItem = gModelF.thisItem;
					var collectionThat = gModelF.collectionThat;
                        if(typeof thisItem !== 'undefined'){
                            var numb = -1;
                            var cInHeaderId = "";
                            var pid_project = "";
                            var positionModelId = "";
                            var positionModelId2 = "";
                            var isFirstLast = 0;
                            var goodToGo = true;
                            $( ".headerMain" ).each(function( index ) {
                                if(goodToGo){
                                    var inHeaderElements = $( this ).find('.project_one');
                                    var thisHeaderId = $(this).attr('pid');
                                    var thpid_project = $(this).attr('pid_project');
                                    inHeaderElements.each(function( index2 ) {
                                        if($( this ).attr('id').replace('project_','') == pid){
                                            numb = index2;
                                            cInHeaderId = thisHeaderId;
                                            pid_project = thpid_project;
                                        }
                                    });
                                    if(numb !== -1){
                                        var elPos = pGrid.getElementsPositions(numb, inHeaderElements, true);
                                        positionModelId = elPos.inHeaderId;
                                        positionModelId2 = elPos.nearHeaderId2;
                                        isFirstLast = elPos.isFirstLast;
                                        numb = -1;
                                        //goodToGo = false;
                                    }
                                }
                            });
							var cheadInf = [pid_project];
                            if(positionModelId !== ''){
								if(typeof collectionThat != 'undefined' && 
								typeof collectionThat.get(positionModelId) != 'undefined' && 
								typeof positionModelId2 != 'undefined'){
									var tdateIso = pGrid.setPositionsOfElements(collectionThat, positionModelId, positionModelId2, isFirstLast, true);
									thisItem.set('position', tdateIso);
								}
								thisItem.set('inHeader', cInHeaderId);
                                thisItem.set('inProjects', cheadInf);
                                thisItem.save();
                                /*thisItem.set('inHeaderUpdateView', 'yes');*/
                            }else{
                                if(cInHeaderId !== ''){
									thisItem.set('inProjects', cheadInf);
                                    thisItem.set('inHeader', cInHeaderId);
                                    thisItem.save();
                                    /*thisItem.set('inHeaderUpdateView', 'yes');*/
                                }
                            }
                    }
                }
            });
            $('.projects_one_in_header').disableSelection();
				
			}
			
			if(this.collection.length === 0 && this.numberOfHead === 0 &&
			typeof this.model == 'undefined'){
				if(!$('#empty_it_img').length){
					app.getWhenNoBoardItems();
				}
				$('.tsortable').html('');
			}
        }
	});
});
