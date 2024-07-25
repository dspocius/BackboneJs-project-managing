define([
	'../../../../app',
	'../../../../views/BaseRowView',
	'views/templateHelpers',
    'marionette',
    './chartCalendarRowView',
    'tpl!./chartCalendarGrid.html',
	'chartutils',
	'chartutilsbundle'
], function (app,BaseRowView, templateHelpers,Marionette, projectGridRowView, projectGrid, chartutils, chartutilsbundle) {
    'use strict';

    var view = Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
		ondeselect_all_true: function(){
			this.whoIsNotShowingNow = [];
			for(var ii=0; ii < this.impactedEntries.length; ii++){
				this.whoIsNotShowingNow[this.impactedEntries[ii].attributes._id] = false;
			}
			this.render();
		},
		onselect_all_true: function(){
			this.whoIsNotShowingNow = [];
			this.render();
		},
        initialize:function(options){
			this.numberOfHead = 0;
			this.whoIsNotShowingNow = [];
			this.impactedEntries = [];
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
				if($('#empty_it_img').length){
					$('#imgWhenEmpty').remove();
				}
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
            return this.searchNavigation([projectsInT]);
        },
        renderNavigation: function(){
            if(typeof this.options.navigationModel != 'undefined'){
                var navLinks = app.getDefaultRoots();
                var projectsInT = this.options.navigationModel.get('inProjects');
                if(typeof projectsInT != 'undefined'){
                    navLinks += this.searchRoute(projectsInT);
                    navLinks += ' - '+this.options.navigationModel.get('text');
                }
				if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
					$('#navigation_main').html(navLinks);
				}
            }
        },
		splitDataFt: function(reccsub, ind, splitBy, ind2){
			var dayOfweekF = '';
			var dayOfweekT = '';
			var minV = ind-1;
			if(reccsub.split(',').length > minV){
				var fsplit = reccsub.split(',')[ind];
				if(typeof splitBy != 'undefined' && splitBy != '' && splitBy == ':'){
					fsplit = fsplit.split(':')[ind2];
				}
					if(fsplit.indexOf('[') > -1 && fsplit != '-'
						&& fsplit != ''){
						dayOfweekF = parseInt(fsplit.split('[')[1].split('-')[0]);
						dayOfweekT = parseInt(fsplit.split('[')[1].split('-')[1]);
					}else{
					if(fsplit != '-' && fsplit != ''){
						dayOfweekF = parseInt(fsplit);
					}
				}
			}
			return {dayOfweekF:dayOfweekF, dayOfweekT:dayOfweekT};
		},
        onRender: function(){
			console.log(chartutils);
			console.log(chartutilsbundle);
			var th= this;
            this.renderNavigation();
			var eventsData = [];
			var impactedEntries = [];
			var allcollection_th = this.collection;
			for(var ii=0; ii < this.collection.models.length; ii++){
				var dataTasksThat = JSON.parse(this.collection.models[ii].attributes.statsdats_data);
				var if_of_the_model = this.collection.models[ii].attributes._id;
				var thatModelOnly = this.collection.models[ii];
				var wasAddedonlyOne = false;
				for(var j=0; j < dataTasksThat.length; j++){
					var atdata = '';
					if(dataTasksThat[j] != null){
						//dataTasksThat[j]
						//here json in atdata add
						if(typeof dataTasksThat[j] != "undefined" && dataTasksThat[j] != ""){
							var cntsdat = dataTasksThat[j].statsdat.split(",");
							var cnts = dataTasksThat[j].statsdatto.split(",");
							var newDatsArr = [];
							var newDatsArrLabels = [];
							for(var izz=0; izz < cnts.length; izz++){
								if(cnts[izz] != ""){
									newDatsArr.push(parseInt(cnts[izz]));
									newDatsArrLabels.push(cntsdat[izz]);
								}
							}
							atdata = {values:newDatsArr, names:newDatsArrLabels};
						}
					}
					if(atdata != ''){
						if(typeof this.whoIsNotShowingNow[thatModelOnly.attributes._id] == 'undefined' ||
						this.whoIsNotShowingNow[thatModelOnly.attributes._id]){
							eventsData.push(atdata);
						}
						wasAddedonlyOne = true;
					}
				}
				if(wasAddedonlyOne){
					impactedEntries.push(thatModelOnly);
				}
			}
		if(eventsData.length > 0){
			var labelss = eventsData[0].names;
			
			var datasets = [];
			for(var izaz=0; izaz < eventsData.length; izaz++){
				if(typeof eventsData[izaz] != "undefined" && eventsData[izaz] != ""){
					var chartColorSel = window.chartColors.red;
					if(izaz == 1){ chartColorSel = window.chartColors.orange; }
					if(izaz == 2){ chartColorSel = window.chartColors.yellow; }
					if(izaz == 3){ chartColorSel = window.chartColors.green; }
					if(izaz == 4){ chartColorSel = window.chartColors.blue; }
					if(izaz == 5){ chartColorSel = window.chartColors.purple; }
					if(izaz == 6){ chartColorSel = window.chartColors.grey; }
					if(izaz == 7){ chartColorSel = 'rgb(10, 10, 10)'; }
					if(izaz == 8){ chartColorSel = 'rgb(40, 40, 40)'; }
					
					var datasetOne = {
						label: eventsData[izaz].names[0],
						backgroundColor: chartColorSel,
						borderColor: chartColorSel,
						borderWidth: 1,
						data: eventsData[izaz].values
					};
					datasets.push(datasetOne);
				}
			}
			
			var color = Chart.helpers.color;
			var barChartData = {
				labels: labelss,
				datasets: datasets
			};
			
			var colorNames = Object.keys(window.chartColors);
			if(document.getElementById('chartcanvas') != null && typeof document.getElementById('chartcanvas') != "undefined"){
				var ctx = document.getElementById('chartcanvas').getContext('2d');
				window.myBar = new Chart(ctx, {
					type: 'bar',
					data: barChartData,
					options: {
						responsive: true,
						legend: {
							position: 'top',
						},
						title: {
							display: false,
							text: ''
						}
					}
				});
			}
		}
		this.impactedEntries = impactedEntries;
		this.renderImpactedInCalendarEntries(impactedEntries);
        },
		renderImpactedInCalendarEntries: function(impactedEntries){
			var htmlEntrDt = "";
			for(var ii=0; ii < impactedEntries.length; ii++){
				var ifchecked = '';
				if(typeof this.whoIsNotShowingNow[impactedEntries[ii].attributes._id] == 'undefined' ||
						this.whoIsNotShowingNow[impactedEntries[ii].attributes._id]){
							ifchecked = 'checked';
						}
				htmlEntrDt += "<span identity='"+impactedEntries[ii].attributes._id+"' class='checkbox left_padding_right15'>";
				htmlEntrDt += "<label identity='"+impactedEntries[ii].attributes._id+"'>";
				htmlEntrDt += "<input identity='"+impactedEntries[ii].attributes._id+"' class='calendarEntryOneShowHide' type='checkbox' alt='' "+ifchecked+" />";
				var dts = '';
				if(impactedEntries[ii].attributes.text.length > 20){ dts = ' ...'; }
				htmlEntrDt += impactedEntries[ii].attributes.text.substring(0,20)+dts;
				htmlEntrDt += "</label>";
				htmlEntrDt += "</span>";
			}
			$('#the_entries_impacted').html(htmlEntrDt);
			$('.calendarEntryOneShowHide').click(this.onCalendarEntryOneShowHide.bind(this));
			$('.select_all_true').click(this.onselect_all_true.bind(this));
			$('.deselect_all_true').click(this.ondeselect_all_true.bind(this));
		},
		onCalendarEntryOneShowHide: function(e){
			var idOfEntr = e.currentTarget.getAttribute('identity');
			var ifChecked = e.currentTarget.checked;
			this.whoIsNotShowingNow[idOfEntr] = ifChecked;
			this.render();
		}
    });
    return view;
});
