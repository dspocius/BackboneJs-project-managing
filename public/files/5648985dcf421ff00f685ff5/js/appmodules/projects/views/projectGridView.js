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
        itemViewContainer:'.projects div',
        initialize:function(options){
			this.numberOfHead = 0;
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
				this.numberOfHead++;
                Marionette.CollectionView.prototype.addItemView.apply(this, arguments);
            }
        },
        getElementsPositions: function(numb, isHeaderItems, isProject){
            var inHeaderId = "";
            var nearHeaderId2 = "";
            var isFirstLast = 0;
            if(numb === 0){
                if(isHeaderItems.length > 1){
                    isFirstLast = -10;
                    if(isProject){
                        inHeaderId = isHeaderItems.get(numb+1).getAttribute('id').replace('project_','');
                    }else{
                        inHeaderId = isHeaderItems.get(numb+1).getAttribute('pid');
                    }
                }
            }else{
                if(isHeaderItems.length-1 === numb){
                    isFirstLast = 10;
                }else{
                    if(isProject){
                        nearHeaderId2 = isHeaderItems.get(numb+1).getAttribute('id').replace('project_','');
                    }else{
                        nearHeaderId2 = isHeaderItems.get(numb+1).getAttribute('pid');
                    }
                }
                if(isProject){
                    inHeaderId = isHeaderItems.get(numb-1).getAttribute('id').replace('project_','');
                }else{
                    inHeaderId = isHeaderItems.get(numb-1).getAttribute('pid');
                }
            }
            return {inHeaderId:inHeaderId, nearHeaderId2: nearHeaderId2, isFirstLast:isFirstLast};
        },
        setPositionsOfElements: function(pGrid, inHeaderId, nearHeaderId2, isFirstLast, isProject){
                var date_pos = pGrid.collection.get(inHeaderId).get('position');
                var t = new Date(date_pos);
                if(isFirstLast === 0){
                    var datepos2 = pGrid.collection.get(nearHeaderId2).get('position');
                    var t2 = new Date(datepos2);
                    var milisecToAdd = (t2.getTime() - t.getTime())/2;
                    if(milisecToAdd === 0){
                        var p1 = pGrid.collection.get(inHeaderId);
                        var p1time = new Date(date_pos);
                        if(isProject){
                            p1time.setMilliseconds(p1time.getMilliseconds() + 5);
                        }else{
                            p1time.setMilliseconds(p1time.getMilliseconds() - 5);
                        }
                        p1.set('position', p1time.toISOString());
                        p1.save();

                        var p2 = pGrid.collection.get(nearHeaderId2);
                        var p2time = new Date(datepos2);
                        if(isProject){
                            p2time.setMilliseconds(p2time.getMilliseconds() - 5);
                        }else{
                            p2time.setMilliseconds(p2time.getMilliseconds() + 5);
                        }
                        p2.set('position', p2time.toISOString());
                        p2.save();
                    }
                    t.setMilliseconds(t.getMilliseconds() + milisecToAdd);
                }else{
                    if(isProject){
                        t.setMilliseconds(t.getMilliseconds() - isFirstLast);
                    }else{
                        t.setMilliseconds(t.getMilliseconds() + isFirstLast);
                    }
                }
            return t.toISOString();
        },
        findNavigation: function(projectsInT){
            var pmodel_th = {modelName:"Project",isMore:''};
            if(typeof this.options.mainP != 'undefined'){
                if(typeof this.options.mainP.mainProject.get(projectsInT) !== 'undefined'){
                    pmodel_th = {modelName:this.options.mainP.mainProject.get(projectsInT).get('text'),isMore:''};
                }
            }
            if(typeof this.options.projectsAll != 'undefined' && pmodel_th.modelName === 'Project'){
                for(var jj=0; jj < this.options.projectsAll.length;jj++){
                    if(typeof this.options.projectsAll[jj].get(projectsInT) !== 'undefined'){
                        pmodel_th = {modelName:this.options.projectsAll[jj].get(projectsInT).get('text'),isMore:this.options.projectsAll[jj].get(projectsInT).get('inProjects')};
                    }
                }
            }
            return pmodel_th;
        },
        searchNavigation: function(projectsInT, username){
            var g_ret = "";
            if(typeof projectsInT != 'undefined'){
                for(var ii=0; ii < projectsInT.length; ii++){
                    if(projectsInT[ii] !== ''){
                        var pmodel_th = this.findNavigation(projectsInT[ii]);
                        if(pmodel_th.isMore !== ''){
                            g_ret += this.searchNavigation(pmodel_th.isMore, username);
                        }
                        g_ret += ' - <a href="#/project/'+username+'/'+projectsInT[ii]+'">'+pmodel_th.modelName+'</a>';
                    }
                }
            }
            return g_ret;
        },
        searchRoute: function(projectsInT, username){
            return this.searchNavigation(projectsInT, username);
        },
        renderNavigation: function(){
            if(typeof this.options.navigationModel != 'undefined'){
				var splitPath = window.location.hash.substring(2).split('/');
				var navLinks = '<a href="#projects/'+splitPath[1]+'">Home</a>';
                var projectsInT = this.options.navigationModel.get('inProjects');
                if(typeof projectsInT != 'undefined'){
                    navLinks += this.searchRoute(projectsInT, splitPath[1]);
					var textToAdd = this.options.navigationModel.get('text');
					var tempDom = $('<output>').append($.parseHTML( this.options.navigationModel.get('text') ));
					var appContainer = $('.hover', tempDom);
					if(appContainer.length > 0){
						textToAdd = appContainer.html();
					}
                    navLinks += ' - '+textToAdd;
                }
                $('#navigation_main').html(navLinks);
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
            if(size_of != ''){
				/*
					$("#the_all_projects").attr('style','width: '+size_of+'px; margin:auto;');
				*/
			}
			if(this.numberOfHead === 0){
				if(!$('#empty_it_img').length){
					$('#navigation_main').after('<div><img style="max-height:800px; max-width:800px;" id="empty_it_img" src="/files/aa.jpg" alt="" /></div>');
				}
				$('.tsortable').html('');
			}
        }
    });
    return view;
});
