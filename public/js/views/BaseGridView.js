/*global define */

define([
	'app',
	'marionette',
	'templates',
    'underscore',
	'models/project'
], function (app, Marionette, templates, _, Project) {
	'use strict';

	return Marionette.CompositeView.extend({
        events:{
			'click .doFiltering':'doFiltering',
			'click .createAlistItem':'createAlistItem',
			'click .createAPostTimeline':'createAPostTimeline',
			'click .loadmoretimelinemy':'loadmoretimelinemy'
		},
		doFiltering: function(e){
			var bytext = $(".textgohere").val().toLowerCase();
			var byheader = $(".headerhere").val().toLowerCase();
			var byassigned = $(".assignedhere").val().toLowerCase();
			var coll = this.options.collection;
			
			for (var i=0,n=coll.models.length; i < n; i++) {
				if (coll.models[i].get("text").toLowerCase().indexOf(bytext) == -1 && bytext != "") {
					coll.models[i].set("showitmod", "none");
				} else {
					if (coll.models[i].get("friendsThere").toLowerCase().indexOf(byassigned) == -1 && byassigned != "") {
						coll.models[i].set("showitmod", "none");
					} else {
						coll.models[i].set("showitmod", "block");
					}
				}
			}
			this.render();
			
			for (var childV in this.children._views) {
				if (this.children._views[childV].model.get("text").toLowerCase().indexOf(byheader) == -1 && byheader != "") {
					this.children._views[childV].$el.hide();
				} else {
					this.children._views[childV].$el.show();
				}
			}
		},
		loadmoretimelinemy: function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
		
			var coll = this.options.collection;
		
			$.ajax({
			  method: "GET",
			  url: "/projectstimeline/"+coll.length,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
			}).always(function (msg) {
				msg.map(function(data) {
					var proNew = new Project(data);
					coll.add(proNew);
				});
				if (msg.length < 20) {
					$(".loadtimelineContainer").hide();
				}
			}.bind(this));
		},
		createAPostTimeline: function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
			var ident = e.currentTarget.getAttribute('identity');
			var pid_project = this.options.collection.idd;
			var locationPidProj = location.href;
			var belongsto = "";
			
			if (locationPidProj.indexOf("project/") > -1) {
				pid_project = locationPidProj.split("project/")[1].split("/")[0];
			}
				
			if (typeof this.options.collection.peopleColAdd != "undefined") {
				pid_project = "_";
				
				if (locationPidProj.indexOf("project/") > -1) {
					pid_project = locationPidProj.split("project/")[1].split("/")[0];
				}
				
				belongsto = this.options.collection.peopleColAdd.get("email");
			}
			
			let projectText = $("#project_list_here2").val();
			if (projectText != "") {
				$("#project_list_here2").val("");
				
				var id_on_link = pid_project;
				var inPro = pid_project;
				
				if (id_on_link == "_") {
					inPro = "";
				}
				
				var data = {
					color: "#ffffff",
					inHeader: "",
					inProjects: inPro,
					isHeader: false,
					isProject: false,
					belongs_to: belongsto,
					name: "-",
					text: projectText
				};
				this.id = id_on_link;
				var models = this.options.collection.models;
				var inHeaderThis = "";
				for (var i=0, n=models.length; i < n; i++) {
					if (models[i].get("isHeader") && models[i].get("name").toLowerCase().indexOf("timeline") > -1 && inHeaderThis == "" 
					&& models[i].get("belongs_to") != "") {
						if (typeof this.options.collection.peopleColAdd != "undefined") {
							inHeaderThis = models[i].get("_id");
						}else {
							if (models[i].get("email") == app.userConnected.data2.email) {
								inHeaderThis = models[i].get("_id");
							}
						}
					}
				}
				
				if (inHeaderThis == "") {
					this.createListItem("My posts", function(listCrProject){
						data.inHeader = listCrProject.get("_id");
						data.fromTimeline = true;
						this.savePostHere(data, null, true);
					}.bind(this),false,"Timeline");
				}else{
					data.fromTimeline = true;
					data.inHeader = inHeaderThis;
					this.savePostHere(data, null, true);
				}
			}
		},
		createAlistItem: function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
			
			let projectText = $("#project_list_here").val();
			if (projectText != "") {
				$("#project_list_here").val("");
				this.createListItem(projectText, null, true);
			}
		},
		createListItem: function(projectText, callback=null, reload=false, nameUse="-"){
			var pid_project = this.options.collection.idd;
			var locationPidProj = location.href;
			var belongsto = "";
			
			if (locationPidProj.indexOf("project/") > -1) {
				pid_project = locationPidProj.split("project/")[1].split("/")[0];
			}
				
			if (typeof this.options.collection.peopleColAdd != "undefined") {
				pid_project = "_";
				
				if (locationPidProj.indexOf("project/") > -1) {
					pid_project = locationPidProj.split("project/")[1].split("/")[0];
				}
				
				belongsto = this.options.collection.peopleColAdd.get("email");
			}
			
			var id_on_link = pid_project;
			var inPro = pid_project;
			
			if (id_on_link == "_") {
				inPro = "";
			}
			
			var data = {
				color: "#ffffff",
				inHeader: "",
				inProjects: inPro,
				belongs_to: belongsto,
				isHeader: true,
				isProject: false,
				name: nameUse,
				text: projectText
			};
			this.id = id_on_link;
			if (projectText != "") {
				this.savePostHere(data, callback, reload);
			}
		},
		savePostHere: function(data, callback=null, reload=false) {
               var newP = new Project(data);
				var get_def_visibility = app.getSettingInWhole('defaultVisibilityAdded');
				var what_to_show = app.getSettingInWhole('defaultEntryViewWhenAdded');
				var visibleHereThere = $("#visibilityOfNewHereList").val();
				if (data.name == "Timeline") {
					visibleHereThere = "editcommentpublic";
				}
				newP.set("visibility", visibleHereThere);
				var thh = this;
				
			//	if(typeof thisProj != "" && typeof app.userData != "undefined" 
	//&& typeof thisProj != "undefined" && typeof thisProj.get != "undefined"
		//		&& thisProj.get("email") != app.userData.email){
			//		newP.set("visibility", "editpublic");
				//}
				
				newP.set("what_to_show", what_to_show);
                var id_to_save = this.id;
			var locationPidProj = location.href;
			var pid_project = id_to_save;
			
			if (locationPidProj.indexOf("project/") > -1) {
				pid_project = locationPidProj.split("project/")[1].split("/")[0];
			}
                    if(pid_project === '_'){
                        newP.set('inProjects','');
                        newP.set('hisinproject_this','_');
                    }else{
                        newP.set('inProjects',pid_project);
                        newP.set('hisinproject_this',pid_project);
                    }
					
                newP.save({idd:id_to_save}).done(function(data2){
					if (callback != null) {
						callback(new Project(data2));
					}
					if(!data2.isHeader){
						if (typeof thh.model != "undefined" && typeof thh.model.collection != "undefined") {
							thh.setWhichEntriesIsOld(data2, thh.model.collection);
						}else{
							if (typeof thh.collection != "undefined") {
								thh.setWhichEntriesIsOld(data2, thh.collection);
							}
						}
					}
					if (reload) {
						if (typeof thh.options.collection.peopleColAdd != "undefined") {
							location.reload();
						}
					}
					var mypro = new Project(data2);
					app.vent.trigger('add:cachedModels:resource', mypro);
					thh.trigger('project:edit',{addModels: data2});
					if (typeof thh.model != "undefined") {
						thh.model.set("onAddModelsGoGo", {addModels: data2, id:data2._id});
					}
				});
		},
		setWhichEntriesIsOld: function(data, projects){
			var howmanycanbethere = parseInt(app.getSettingInWhole('make_old_when'));
							var how_many = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									how_many++;
								}
							}
							var how_many_should_be_set = how_many-howmanycanbethere;
							var how_many_now_set = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									if(how_many_should_be_set > how_many_now_set){
										projects.models[pr].set('is_old', 'true');
										projects.models[pr].save();
										how_many_now_set++;
									}
								}
							}
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
		load_more_for_header_navigation_model: function(e){
			e.stopImmediatePropagation();
			e.stopPropagation();
			//var count = e.currentTarget.getAttribute('count');
			var modelThis = this.options.navigationModel;
			var count = modelThis.get("header_count_old_numb_list");
			var newcnt = parseInt(count)-20;
			if(newcnt < 0){ newcnt = 0; }
			var header_used_numb = modelThis.get("header_count_old_numb_used_list");
			modelThis.set("header_count_old_numb_list", newcnt);
			var count_every_header = new Backbone.Model();
			
			var url_of_entries = '/projectsinlist_old/';
			var addemailhere = "";
			
			if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
				url_of_entries = '/projectsinlistt_old/';
			}else{
				if(typeof app.userData != "undefined" && modelThis.get("email") == app.userData.email){
					url_of_entries = '/projectsinlist_old/';
				}else{
					url_of_entries = '/projectsinlistt_old/';
					addemailhere = "/"+modelThis.get("email");
				}
			}
			
			count_every_header.url = templates.urlAddr+url_of_entries+modelThis.get('_id')+"/"+header_used_numb+addemailhere;/* LIMIT - 20 */
			
												count_every_header.fetch().done(function(){
													header_used_numb = header_used_numb+20;
													modelThis.set("header_count_old_numb_used_list", header_used_numb);
													this.trigger('project:edit',{addModels: count_every_header.attributes});
												}.bind(this));
		},
        renderNavigation: function(){
			$(".load_more_for_header_navigation_model").click(this.load_more_for_header_navigation_model.bind(this));
			if(typeof this.options.navigationModel != "undefined" && this.options.navigationModel != "" && this.options.navigationModel.get("header_count_old_numb_list") > 0){
				$(".load_more_for_header_navigation_model").show();
			}
            if(typeof this.options.navigationModel != 'undefined' && 
			this.options.navigationModel != ''){
                var navLinks = app.getDefaultRoots();
				if(typeof app.userData != "undefined" && this.options.navigationModel.get("email") !== app.userData.email){
					navLinks += "- <a href='/#/"+this.options.navigationModel.get("email")+"'>"+this.options.navigationModel.get("email")+"</a>";
				}
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
                        p1.set('position', p1time.toISOString(), { silent: true });
                        p1.save({ silent: true }, { silent: true });

                        var p2 = this.getTheModelFCol(this, nearHeaderId2).thisItem;
                        var p2time = new Date(datepos2);
                        if(isProject){
                            p2time.setMilliseconds(p2time.getMilliseconds() - 5);
                        }else{
                            p2time.setMilliseconds(p2time.getMilliseconds() + 5);
                        }
                        p2.set('position', p2time.toISOString(), { silent: true });
                        p2.save({ silent: true }, { silent: true });
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
