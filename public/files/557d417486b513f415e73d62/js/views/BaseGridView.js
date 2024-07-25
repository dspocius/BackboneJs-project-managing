/*global define */

define([
	'marionette',
	'templates',
    'underscore'
], function (Marionette, templates, _) {
	'use strict';

	return Marionette.CompositeView.extend({
        searchNavigation: function(projectsInT){
            var g_ret = "";
            if(typeof projectsInT != 'undefined'){
                for(var ii=0; ii < projectsInT.length; ii++){
                    if(projectsInT[ii] !== ''){
                        var pmodel_th = this.findNavigation(projectsInT[ii]);
                        if(pmodel_th.isMore !== ''){
                            g_ret += this.searchNavigation(pmodel_th.isMore);
                        }
                        g_ret += ' - <a href="#/project/'+projectsInT[ii]+'">'+pmodel_th.modelName+'</a>';
                    }
                }
            }
            return g_ret;
        },
        searchRoute: function(projectsInT){
            return this.searchNavigation(projectsInT);
        },
        renderNavigation: function(){
            if(typeof this.options.navigationModel != 'undefined' && 
			this.options.navigationModel != ''){
                var navLinks = app.getDefaultRoots();
                var projectsInT = this.options.navigationModel.get('inProjects');
                if(typeof projectsInT != 'undefined'){
                    navLinks += this.searchRoute(projectsInT);
                    navLinks += ' - '+'<a href="#/entry/'+this.options.navigationModel.get('_id')+'">'+this.options.navigationModel.get('text')+'</a>';
                }
				if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
					$('#navigation_main').html(navLinks);
				}
            }
        },
		getTheCollectionFCol: function(pGrid, pid){
			var collectionThat = pGrid.collection;
				var colsO = pGrid.collection.otherCols;
				for(var ii=0; ii < colsO.length; ii++){
					if(colsO[ii].idd == pid){
						collectionThat = colsO[ii];
					}
				}
			return collectionThat;
		},
		getTheModelFCol: function(pGrid, pid){
            var thisItem = pGrid.collection.get(pid);
			var collectionThat = pGrid.collection;
			if(typeof thisItem == 'undefined'){
				var colsO = pGrid.collection.otherCols;
				for(var ii=0; ii < colsO.length; ii++){
					if(typeof colsO[ii].get(pid) != 'undefined'){
						thisItem = colsO[ii].get(pid);
						collectionThat = colsO[ii];
					}
				}
			}
			return {thisItem:thisItem, collectionThat:collectionThat};
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
        setPositionsOfElements: function(pGridCol, inHeaderId, nearHeaderId2, isFirstLast, isProject){
				//var gModelF = this.getTheModelFCol(this, inHeaderId).thisItem
				//var date_pos = pGridCol.get(inHeaderId).get('position');
				var date_pos = this.getTheModelFCol(this, inHeaderId).thisItem.get('position');
                var t = new Date(date_pos);
                if(isFirstLast === 0 && typeof this.getTheModelFCol(this, nearHeaderId2).thisItem != 'undefined'){
                    var datepos2 = this.getTheModelFCol(this, nearHeaderId2).thisItem.get('position');
                    var t2 = new Date(datepos2);
                    var milisecToAdd = (t2.getTime() - t.getTime())/2;
                    if(milisecToAdd === 0){
                        var p1 = this.getTheModelFCol(this, inHeaderId).thisItem;
                        var p1time = new Date(date_pos);
                        if(isProject){
                            p1time.setMilliseconds(p1time.getMilliseconds() + 5);
                        }else{
                            p1time.setMilliseconds(p1time.getMilliseconds() - 5);
                        }
                        p1.set('position', p1time.toISOString());
                        p1.save();

                        var p2 = this.getTheModelFCol(this, nearHeaderId2).thisItem;
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
        }
	});
});
