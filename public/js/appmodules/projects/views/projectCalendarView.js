define([
	'../../../app',
	'views/templateHelpers',
    'marionette',
    './projectCalendarRowView',
    'tpl!../templates/projectCalendarGrid.html',
	'../../../lib/fullcalendar/lib/moment.min',
	'../../../lib/fullcalendar/fullcalendar.min'
], function (app,templateHelpers,Marionette, projectGridRowView, projectGrid) {
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
			var th= this;
            this.renderNavigation();
			var eventsData = [];
			var impactedEntries = [];
			
			for(var ii=0; ii < this.collection.models.length; ii++){
				var dataTasksThat = this.collection.models[ii].attributes.tasks;
				var thatModelOnly = this.collection.models[ii];
				var wasAddedonlyOne = false;
				for(var j=0; j < dataTasksThat.length; j++){
					var atdata = '';
					if(dataTasksThat[j] != null){
						
						if(typeof dataTasksThat[j].reccurence == 'undefined' ||
						dataTasksThat[j].reccurence == ''){
							var fromTimeTime = '';
							var toTimeTime = '';
							if(dataTasksThat[j].fromTime != '00:00' || 
								dataTasksThat[j].toTime != '00:00'){
								fromTimeTime = 'T'+dataTasksThat[j].fromTime;
								toTimeTime = 'T'+dataTasksThat[j].toTime;
							}
							var fromEnd = dataTasksThat[j].from+fromTimeTime;
							var startTo = dataTasksThat[j].to+toTimeTime;
							if(dataTasksThat[j].from != ''){
								atdata = {
									title: dataTasksThat[j].about,
									start: fromEnd,
									end: startTo
								};
							}else{
								if(dataTasksThat[j].to != ''){
									atdata = {
										title: dataTasksThat[j].about,
										start: startTo
									};
								}
							}
						}else{
							var recc = dataTasksThat[j].reccurence;
							var estim = dataTasksThat[j].estimate;
							var abbout = dataTasksThat[j].about;
							if(recc.charAt(0) === 'W'){
								var reccsub = recc.substring(1);
								var indH = 1;
								var indM = 2;
								var splitBy = '';
								var ind2H = 0;
								var ind2M = 0;
								if(reccsub.indexOf(':') > -1){
								 indH = 1;
								 indM = 1;
								 splitBy = ':';
								 ind2H = 0;
								 ind2M = 1;
								}
								
								var hourOfweekF = th.splitDataFt(reccsub,indH,splitBy, ind2H).dayOfweekF;
								var minuteOfweekF = th.splitDataFt(reccsub,indM,splitBy, ind2M).dayOfweekF;
								
								var reccurObj = {};
								reccurObj.hourTo = '';
								var wasInside = true;
								var datesInCal = reccsub.split(',')[0];
								reccurObj.dayOfWeek = [];
								if(datesInCal.indexOf('0') > -1){reccurObj.dayOfWeek.push(0);}
								if(datesInCal.indexOf('1') > -1){reccurObj.dayOfWeek.push(1);}
								if(datesInCal.indexOf('2') > -1){reccurObj.dayOfWeek.push(2);}
								if(datesInCal.indexOf('3') > -1){reccurObj.dayOfWeek.push(3);}
								if(datesInCal.indexOf('4') > -1){reccurObj.dayOfWeek.push(4);}
								if(datesInCal.indexOf('5') > -1){reccurObj.dayOfWeek.push(5);}
								if(datesInCal.indexOf('6') > -1){reccurObj.dayOfWeek.push(6);}
								var fminute = ':00';
								if(hourOfweekF != ''){
									if(minuteOfweekF != ''){
										fminute = ':'+minuteOfweekF;
									}
									reccurObj.hour = hourOfweekF+''+fminute;
								}else{
									reccurObj.hour = '00:00';
								}
								if(wasInside){
									if(estim != ''){
										var currentDateH = reccurObj.hour.split(':');
										var currentDateHours = parseInt(currentDateH[0]);
										var currentDateMins = parseInt(currentDateH[1]);
										var hourTo = '';
										var estNumb = parseInt(estim.substring(0, estim.length - 1));
										if(estim.indexOf(':') > -1){
											var estimDate = estim.split(':');
											var estimDateHours = parseInt(estimDate[0]);
											var estimDateMins = parseInt(estimDate[1]);
											
										var dateToMinutes = currentDateMins+estimDateMins;
										var dateToHour = currentDateHours;
											if(dateToMinutes > 60){
												dateToHour = dateToHour+1+estimDateHours;
												dateToMinutes = dateToMinutes-60;
												if(dateToHour > 23){
													dateToHour = 23;
													hourTo = dateToHour+':59';
												}else{
													hourTo = dateToHour+':'+dateToMinutes;
												}
											}else{
												dateToHour = dateToHour+estimDateHours;
												if(dateToHour > 23){
													dateToHour = 23;
													hourTo = dateToHour+':59';
												}else{
													hourTo = dateToHour+':'+dateToMinutes;
												}
											}
										}
										if(estim.charAt(estim.length-1) == 'h'){
											var dateToHour = currentDateHours+estNumb;
											if(dateToHour > 23){
												dateToHour = 23;
												hourTo = dateToHour+':59';
											}else{
												hourTo = dateToHour+':'+currentDateMins;
											}
										}
										if(estim.charAt(estim.length-1) == 'm'){
										var dateToMinutes = currentDateMins+estNumb;
										var dateToHour = currentDateHours;
											if(dateToMinutes > 60){
												dateToHour = dateToHour+1;
												dateToMinutes = dateToMinutes-60;
												if(dateToHour > 23){
													dateToHour = 23;
													hourTo = dateToHour+':59';
												}else{
													hourTo = dateToHour+':'+dateToMinutes;
												}
											}else{
												hourTo = dateToHour+':'+dateToMinutes;
											}
										}
											atdata = {
												title: abbout,
												start: reccurObj.hour,
												end: hourTo,
												dow: reccurObj.dayOfWeek
											};
									}else{
										atdata = {
											title: abbout,
											start: reccurObj.hour,
											dow: reccurObj.dayOfWeek
										};
									}
								}
							}
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
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			//defaultDate: '2016-01-12',
			firstDay:1,
			/*selectable: true,
			selectHelper: true,
			select: function(start, end) {
				var title = prompt('Event Title:');
				var eventData;
				if (title) {
					eventData = {
						title: title,
						start: start,
						end: end
					};
					$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
				}
				$('#calendar').fullCalendar('unselect');
			},*/
			editable: false,
			eventLimit: true, // allow "more" link when too many events
			events: eventsData
		});
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
