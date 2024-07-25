define([
	'../../../../app',
	'../../customDataSimple',
	'views/templateHelpers',
    'marionette',
    './statisticRowView',
    'tpl!./statisticGrid.html'
], function (app,customDataSimple, templateHelpers,Marionette, projectGridRowView, projectGrid) {
    'use strict';

    var view = Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
		ondeselect_all_true: function(){
			this.whoIsNotShowingNow = [];
			for(var ii=0; ii < this.impactedEntries.length; ii++){
				$("input[identity='"+this.impactedEntries[ii].attributes._id+"']").prop( "checked", true );
				this.whoIsNotShowingNow[this.impactedEntries[ii].attributes._id] = false;
			}
			this.onRenderFunc();
		},
		onselect_all_true: function(){
			this.whoIsNotShowingNow = [];
			for(var ii=0; ii < this.impactedEntries.length; ii++){
				$("input[identity='"+this.impactedEntries[ii].attributes._id+"']").prop( "checked", false );
				this.whoIsNotShowingNow[this.impactedEntries[ii].attributes._id] = true;
			}
			this.onRenderFunc();
		},
        initialize:function(options){
			this.numberOfHead = 0;
			this.whoIsNotShowingNow = [];
			this.impactedEntries = [];
            this.on('refresh:dom',function(){
                this.onRenderFunc();
            }.bind(this));
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
			this.onRenderFunc();
        },
        onRenderFunc: function(){
			var th= this;
            this.renderNavigation();
			var impactedEntries = [];
			//var impactedEntriesMarkers = [];
			//var impactedEntriesMarkersListenOn = [];
			
			for(var ii=0; ii < this.collection.models.length; ii++){
				var thatModelOnly = this.collection.models[ii];
					impactedEntries.push(thatModelOnly);
			}

		this.impactedEntries = impactedEntries;
		this.renderImpactedInCalendarEntries(impactedEntries);
        },
		renderImpactedInCalendarEntries: function(impactedEntries){
			var htmlAdd = "";
			var htmlEntrDt = "";
			
			for(var ijj=0; ijj < customDataSimple.length; ijj++){
				customDataSimple[ijj].count = 0;
				customDataSimple[ijj].custom_attr_data = [];
				customDataSimple[ijj].custom_attr_data_in = [];
				customDataSimple[ijj].custom_attr_data_in_inner_arr = [];
				customDataSimple[ijj].custom_attr_data_in_inner_arr_used = [];
			}
			
			var headers_count = 0;
			var entries_count = 0;
			var projects_count = 0;
			var array_for_table_data = [];
			
			for(var ii=0; ii < impactedEntries.length; ii++){
				var ifchecked = '';
				var files_numb = 0;
				var this_models_id = impactedEntries[ii].attributes._id;
				
				if(typeof this.whoIsNotShowingNow[impactedEntries[ii].attributes._id] == 'undefined' ||
						this.whoIsNotShowingNow[impactedEntries[ii].attributes._id]){
							if(impactedEntries[ii].get("isHeader") || impactedEntries[ii].get("isProject")){
								if(impactedEntries[ii].get("isHeader")){ headers_count+= 1; }
								if(impactedEntries[ii].get("isProject")){ projects_count += 1; }
							}else{
								entries_count += 1;
							}
							ifchecked = 'checked';
							var filess_numb = 0;
							if (typeof impactedEntries[ii].get("files") != "undefined" && typeof impactedEntries[ii].get("files").filter != "undefined") { 
							 filess_numb = impactedEntries[ii].get("files").filter(function(e){return e}).length;
							}
							
							files_numb += filess_numb;
							
							var that_items_arr = [];
							for(var ijj=0; ijj < customDataSimple.length; ijj++){
								if(typeof customDataSimple[ijj] != "undefined"){
									if(typeof impactedEntries[ii].attributes[customDataSimple[ijj].id] != "undefined"){
										var dataOfff = "";
										if(typeof impactedEntries[ii].attributes[customDataSimple[ijj].id] != "object"){
											 dataOfff = JSON.parse(impactedEntries[ii].attributes[customDataSimple[ijj].id]);
										}else{
											dataOfff = impactedEntries[ii].attributes[customDataSimple[ijj].id];
										}
										if(typeof customDataSimple[ijj].detail_custom !== "undefined"){
											var detail_cus_data = customDataSimple[ijj].detail_custom(dataOfff);
											if(detail_cus_data !== ""){
												that_items_arr.push(customDataSimple[ijj].detail_custom(dataOfff));
											}
										}
										var customOn = customDataSimple[ijj].custom;
										if(typeof customOn != "undefined" && customOn != ""){
											for(var cus_cnt = 0; cus_cnt < customOn.length; cus_cnt++){
												var oding_cust_data = customOn[cus_cnt];
												for(var dataOfff_cnt = 0; dataOfff_cnt < dataOfff.length; dataOfff_cnt++){
													var in_data_off_by_attr = oding_cust_data.attr_func(dataOfff[dataOfff_cnt][oding_cust_data.attr]);
													if(typeof in_data_off_by_attr != "undefined" && in_data_off_by_attr != ""){
														var name_of_custom_attr = oding_cust_data.name(dataOfff[dataOfff_cnt][oding_cust_data.attr], customDataSimple[ijj].custom_attr_data_in_inner_arr, customDataSimple[ijj].custom_attr_data_in_inner_arr_used, this_models_id);
														var get_index_of_that_name_good = customDataSimple[ijj].custom_attr_data.indexOf(in_data_off_by_attr);
														if(get_index_of_that_name_good > -1){
															customDataSimple[ijj].custom_attr_data_in[get_index_of_that_name_good].count = customDataSimple[ijj].custom_attr_data_in[get_index_of_that_name_good].count+1;
														}else{
															customDataSimple[ijj].custom_attr_data.push(in_data_off_by_attr);
															customDataSimple[ijj].custom_attr_data_in.push({name: name_of_custom_attr, count:1 });
														}
													}
												}
											}
										}
										customDataSimple[ijj].count += dataOfff.length;
									}
								}
							}
							array_for_table_data.push({ name: impactedEntries[ii].attributes.text.substring(0,20), custom: that_items_arr  });
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
			
			htmlAdd += "<div>Headers: "+headers_count+". ";
			htmlAdd += "Projects: "+projects_count+". ";
			htmlAdd += "Entries: "+entries_count+"</div>";
			htmlAdd += "<div> --- </div>";
			htmlAdd += "<div>Files: "+files_numb+"</div>";
			for(var ijj=0; ijj < customDataSimple.length; ijj++){
				htmlAdd += "<div>"+customDataSimple[ijj].name+": "+customDataSimple[ijj].count+"</div>";
				var cust_attr_data = customDataSimple[ijj].custom_attr_data_in;
				var custom_attr_data_in_inner_arr = customDataSimple[ijj].custom_attr_data_in_inner_arr;
				var custom_attr_data_in_inner_arr_used = customDataSimple[ijj].custom_attr_data_in_inner_arr_used;
				for(var ojj=0; ojj < cust_attr_data.length; ojj++){
					htmlAdd += "<div> ------- "+cust_attr_data[ojj].name+": "+cust_attr_data[ojj].count+"</div>";
				}
				for(var ojj=0; ojj < custom_attr_data_in_inner_arr_used.length; ojj++){
					var inner_arr = custom_attr_data_in_inner_arr[ojj];
					var name_of_inner_arr = custom_attr_data_in_inner_arr_used[ojj];
					htmlAdd += "<div> -------------- "+name_of_inner_arr+"</div>";
					if(typeof inner_arr != "undefined" && inner_arr != ""){
						for(var umm=0; umm < inner_arr.length; umm++){
							htmlAdd += "<div> -------------- ----- "+inner_arr[umm].val+": "+inner_arr[umm].count+"</div>";
						}
					}
				}
			}
			htmlAdd += "<div> --- </div>";
			for(var iizz=0; iizz < array_for_table_data.length; iizz++){
				var custom_arr_good = array_for_table_data[iizz].custom;
				if(custom_arr_good.length != 0){
					htmlAdd += "<div class='statistical_head_header'>"+array_for_table_data[iizz].name+" </div>";
					for(var zzee=0; zzee < custom_arr_good.length; zzee++){
						htmlAdd += custom_arr_good[zzee];
					}
				}
			}
			htmlAdd += "<div> --- </div>";
			
			$("#container").html(htmlAdd);	
			$('#the_entries_impacted').html(htmlEntrDt);
			$('.calendarEntryOneShowHide').click(this.onCalendarEntryOneShowHide.bind(this));
			$('.select_all_true').click(this.onselect_all_true.bind(this));
			$('.deselect_all_true').click(this.ondeselect_all_true.bind(this));
		},
		onCalendarEntryOneShowHide: function(e){
			var idOfEntr = e.currentTarget.getAttribute('identity');
			var ifChecked = e.currentTarget.checked;
			this.whoIsNotShowingNow[idOfEntr] = ifChecked;
			this.onRenderFunc();
		}
    });
    return view;
});
