/*global define */

define([
	'marionette',
	'templates',
    'underscore',
	'views/BaseGridView',
	'appmodules/projects/views/projectGridRowView',
	'models/project'
], function (Marionette, templates, _, BaseGridView, projectGridRowView, Project) {
	'use strict';

	return BaseGridView.extend({
		initialize:function(options){
			this.numberOfHead = 0;
            this.on('refresh:dom',function(){
                this.trigger('project:edit');
            });
            this.on('itemview:project:edit',function(view, optionss){
               this.trigger('project:edit',view, optionss);
            });
            this.on('itemview:project:treeview',function(view,data){
                this.trigger('project:treeview',view, data);
            });
            this.on('itemview:project:delete',function(view, optionss){
                this.trigger('project:delete', view, optionss);
            });
        },
        addItemView: function(child, ChildView, index){
            if (child.get('isHeader') && $(this.itemViewContainer).length) {
				this.numberOfHead++;
                Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
				if($('#empty_it_img').length){
					$('#imgWhenEmpty').remove();
				}
			}
        },
         onRender: function(){
		 $(".createAlistItem").click(this.createAlistItem.bind(this));
            this.renderNavigation();
            var size_of = 0;
            var size_of_when_mobile = 0;
            var pGrid = this;
			var user_can_drag_items = true;
			
            if(typeof this.collection.models !== 'undefined'){
                this.collection.each(function(project) {
					var parentvisibility = project.get("parentvisibility");
					if(parentvisibility == "editpublic" || parentvisibility == "editprivate"){}else{
						user_can_drag_items = false;
					}
					var whatToRend = projectGridRowView;
					if(typeof itemViewRender != "undefined"){
						whatToRend = itemViewRender;
					}
					if(typeof pGrid.itemViewRender != "undefined"){
						whatToRend = pGrid.itemViewRender;
					}
                    var personView = new whatToRend({ model: project, tagName:'div', className:'' });
                    if(!project.get('isHeader')){
                        if($('#projects_one_in'+project.get('inHeader')).length){
                            $('#projects_one_in'+project.get('inHeader')).prepend(personView.$el);
                            personView.render();
                        }
                    }else{
                        size_of += 214;
                        size_of_when_mobile += 317;
                    }
                });
            }
            if(size_of != '' && typeof this.model == 'undefined'){
				size_of += 214;
                $(".only_board_view_the_all_projects").attr('style','width: '+size_of+'px; margin:auto;');
				/*$("#users_account_in_project_small").css("width", size_of_when_mobile+'px');/*/
            }
            var delayT = 0;
            if(app.isMobile){
                delayT = 500;
            }
			if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
				user_can_drag_items = false;
			}
			
			if(location.hash.indexOf('projectsinlist') == -1 && (typeof this.options.dontdrag === 'undefined' || 
			this.options.dontdrag === false) && user_can_drag_items){

            $('.tsortable').sortable({
                items: 'td',
                delay:delayT,
				placeholder: "tdplaceholderdrag",
				dropOnEmpty: false,
				forcePlaceholderSize: true,
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
						var which_part_where = "";
                        var isHeaderItems = $( ".headerMain" );
                        isHeaderItems.each(function( index ) {
                            if($( this ).attr('pid') == pid){
                                numb = index;
								pid_projectt_inprojects = $(this).parent().parent().parent().parent().parent().parent().parent().attr('id');
								if(pid_projectt_inprojects == "main"){
									if(location.href.indexOf("project/") > -1){
										var get_proj_id = location.href.split("project/")[1];
										pid_projectt_inprojects = get_proj_id;
										which_part_where = "project_home";
									}else{
										get_proj_id = "";
										pid_projectt_inprojects = get_proj_id;
										which_part_where = "home";
									}
								}else{
									which_part_where = "in_tree";
									pid_projectt_inprojects = pid_projectt_inprojects.replace("treeInShowHere","");
								}
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
								thisItem.set('position', tdate, { silent: true });
								thisItem.set('is_old', 'false', { silent: true });
							}
							var inProjectsBefore = thisItem.get('inProjects');
							var inProjectsTAdd = '';
							var inWhatCollectionToAdd = '';
							var inWhatCollectionToAddReal = '';
							if(which_part_where == 'in_tree'){
								thisItem.set('inProjects', pid_projectt_inprojects, { silent: true });
								inProjectsTAdd = pid_projectt_inprojects;
								
								var getModColOfProj = pGrid.getTheModelFCol(pGrid, inProjectsTAdd);
								if(typeof getModColOfProj != 'undefined'){
									inWhatCollectionToAddReal = pGrid.collection;
									inWhatCollectionToAdd = getModColOfProj.collectionThat;
								}
							}else{
								if(which_part_where == "home"){
									thisItem.set('inProjects', '', { silent: true });
									inProjectsTAdd = '';
									inWhatCollectionToAdd = pGrid.collection;
									inWhatCollectionToAddReal = pGrid.collection.mainProject;
								}else{
									thisItem.set('inProjects', pid_projectt_inprojects, { silent: true });
									inProjectsTAdd = pid_projectt_inprojects;
									var collectionOfProj = pGrid.getTheCollectionFCol(pGrid, inProjectsTAdd);
									inWhatCollectionToAdd = pGrid.collection;
									inWhatCollectionToAddReal = collectionOfProj;
								}
							}
							if(typeof inWhatCollectionToAddReal != 'undefined' && 
							inWhatCollectionToAddReal != ''){
								
								inWhatCollectionToAdd.remove(thisItem, { silent: true });
								//if(typeof inWhatCollectionToAddReal.get(thisItem.get("_id")) == 'undefined'){
									//inWhatCollectionToAddReal.add(thisItem, { silent: true });
								//}
								var inheaderThatAll = $('#project_'+headersproject_id);
								var inHeaderElements = inheaderThatAll.find('.project_one');
								if(inProjectsBefore != inProjectsTAdd && 
								inProjectsBefore.indexOf(inProjectsTAdd) == -1){
									inHeaderElements.each(function( index2 ) {
											var pid2 = $( this ).attr('id').replace('project_','');
											var gModelF2 = pGrid.getTheModelFCol(pGrid, pid2);
											var thisItem2 = gModelF2.thisItem;
												thisItem2.set('inProjects',inProjectsTAdd, { silent: true });
												thisItem2.set('is_old', 'false', { silent: true });
												thisItem2.save({ silent: true }, { silent: true });
												
												inWhatCollectionToAdd.remove(thisItem2, { silent: true });
											//if(typeof inWhatCollectionToAddReal.get(thisItem2.get("_id")) == 'undefined'){
												//inWhatCollectionToAddReal.add(thisItem2, { silent: true });
											//}
									});
								}
							}
							thisItem.set('is_old', 'false', { silent: true });
                            thisItem.set('inHeaderUpdateView', 'yes', { silent: true });
							thisItem.save({ silent: true }, { silent: true });
                        }
                    }
                }
            });
            //$('.tsortable').disableSelection();
            $('.projects_one_in_header').sortable({
                items: 'li',
				placeholder: "proplaceholderdrag",
				dropOnEmpty: false,
				forcePlaceholderSize: true,
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
                                        if($( this ).attr('id').replace('project_','') === pid){
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
                                        /*goodToGo = false;*/
                                    }
                                }
                            });
							var cheadInf = pid_project;
							
                            if(positionModelId !== ''){
								if(typeof collectionThat != 'undefined' && 
								typeof collectionThat.get(positionModelId) != 'undefined' && 
								typeof positionModelId2 != 'undefined'){
									var tdateIso = pGrid.setPositionsOfElements(collectionThat, positionModelId, positionModelId2, isFirstLast, true);
									thisItem.set('position', tdateIso, { silent: true });
								}
								if(typeof cInHeaderId !== "undefined" && cInHeaderId !== ""){
									thisItem.set('inHeader', cInHeaderId);
								}
								thisItem.set('is_old', 'false', { silent: true });
								if(pid_project == "" || pid_project == "_"){ cheadInf = ""; }
                                thisItem.set('inProjects', cheadInf, { silent: true });
                                thisItem.set('inHeaderUpdateView', 'yes', { silent: true });
								thisItem.save(null, { silent: true });
								thisItem.trigger("afterdropintriggered");
                            }else{
                                if(typeof cInHeaderId !== "undefined" && cInHeaderId !== ""){
									if(pid_project == "" || pid_project == "_"){ cheadInf = ""; }
									thisItem.set('inProjects', cheadInf, { silent: true });
                                    thisItem.set('inHeader', cInHeaderId, { silent: true });
									thisItem.set('is_old', 'false', { silent: true });
                                    thisItem.set('inHeaderUpdateView', 'yes', { silent: true });
									 thisItem.save(null, { silent: true });
									 thisItem.trigger("afterdropintriggered");
                                }
                            }
                    }
                }
            });
            //$('.projects_one_in_header').disableSelection();
				
			}
			
			if(this.collection.length === 0 && this.numberOfHead === 0 &&
			typeof this.model == 'undefined'){
				if(!$('#empty_it_img').length){
					if(location.href.split("/").length < 5 || location.href.indexOf("home") > -1){}else{
						setTimeout(function(){
							if(this.collection.length === 0 && this.numberOfHead === 0){
								app.getWhenNoBoardItemsWhereTo("#project_all_inner_container_one");
							}
						}.bind(this), 1);
					}
				}
				//$('.tsortable').html('');
			}
        }
	});
});
