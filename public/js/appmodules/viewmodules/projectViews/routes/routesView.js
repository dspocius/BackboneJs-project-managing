define([
	'../../../../app',
	'../../../../config',
	'views/templateHelpers',
    'marionette',
    './routesRowView',
    'tpl!./routesGrid.html',
	'https://maps.googleapis.com/maps/api/js?key=AIzaSyANMLdH4KA1uccmhODzGHCvoGqX57PSwfg'
], function (app,config, templateHelpers,Marionette, projectGridRowView, projectGrid) {
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
			this.rerenderAllMarkers();
		},
		onselect_all_true: function(){
			this.whoIsNotShowingNow = [];
			for(var ii=0; ii < this.impactedEntries.length; ii++){
				$("input[identity='"+this.impactedEntries[ii].attributes._id+"']").prop( "checked", false );
				this.whoIsNotShowingNow[this.impactedEntries[ii].attributes._id] = true;
			}
			this.rerenderAllMarkers();
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
		geocoderFunc: function(geocoder){
			for(var ii=0; ii < this.collection.models.length; ii++){
			var dataOf = JSON.parse(this.collection.models[ii].attributes.routes_data);
				for(var j=0; j < dataOf.length; j++){
					if(typeof dataOf[j] !== "undefined" && dataOf[j] !== null && dataOf[j] !== "" && dataOf[j].route !== "" && (typeof dataOf[j].latlng === "undefined" || dataOf[j].latlng === "")){
						var dataOfInner = dataOf[j];
						var dataOfInnerAll = dataOf;
						var collmodelOf = this.collection.models[ii];
						
						geocoder.geocode( { 'address': dataOf[j].route}, function(results, status) {
						  if (status == 'OK') {
							  var map = this.realMap;
							  var impactedEntriesMarkers = this.impactedEntriesMarkers;
							  var impactedEntriesMarkersto = this.impactedEntriesMarkersto;
							  var latt = results[0].geometry.location.lat();
							  var lngg = results[0].geometry.location.lng();
							  dataOfInner.latlng = {lat: latt, lng: lngg};
							var myModel = collmodelOf;
							myModel.set('id', myModel.get('_id'));
							myModel.set('routes_data', JSON.stringify(dataOfInnerAll));
							myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
							myModel.save();
							  
							  
								var dataOfCurrent = dataOfInner.date;
	
								impactedEntriesMarkers[dataOfCurrent] = new google.maps.Marker({
								  position: dataOfInner.latlng,
								  map: map
								});
								impactedEntriesMarkers[dataOfCurrent].infWindData = dataOfCurrent;
								impactedEntriesMarkers[dataOfCurrent].infWind = new google.maps.InfoWindow({
								  content: dataOfInner.about
								});
								impactedEntriesMarkers[dataOfCurrent].addListener('click', function() {
								  this.infWind.open(map, impactedEntriesMarkers[this.infWindData]);
								});
							  
							  
							  
						  } else {
							dataOfInner.latlng = "not_found";
							var myModel = collmodelOf;
							myModel.set('id', myModel.get('_id'));
							myModel.set('routes_data', JSON.stringify(dataOfInnerAll));
							myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
							myModel.save();
						  
						  }
						}.bind(this));
					}
					
					if(typeof dataOf[j] !== "undefined" && dataOf[j] !== null && dataOf[j] !== "" && dataOf[j].routeto !== "" && (typeof dataOf[j].latlngto === "undefined" || dataOf[j].latlngto === "")){
						var dataOfInner = dataOf[j];
						var dataOfInnerAll = dataOf;
						var collmodelOf = this.collection.models[ii];
						
						geocoder.geocode( { 'address': dataOf[j].routeto}, function(results, status) {
						  if (status == 'OK') {
							  var map = this.realMap;
							  var impactedEntriesMarkersto = this.impactedEntriesMarkersto;
							  var latt = results[0].geometry.location.lat();
							  var lngg = results[0].geometry.location.lng();
							  dataOfInner.latlngto = {lat: latt, lng: lngg};
							var myModel = collmodelOf;
							myModel.set('id', myModel.get('_id'));
							myModel.set('routes_data', JSON.stringify(dataOfInnerAll));
							myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
							myModel.save();
							  
							  
								var dataOfCurrent = dataOfInner.date;
	
								impactedEntriesMarkersto[dataOfCurrent] = new google.maps.Marker({
								  position: dataOfInner.latlngto,
								  map: map
								});
								impactedEntriesMarkersto[dataOfCurrent].infWindData = dataOfCurrent;
								impactedEntriesMarkersto[dataOfCurrent].infWind = new google.maps.InfoWindow({
								  content: dataOfInner.about
								});
								impactedEntriesMarkersto[dataOfCurrent].addListener('click', function() {
								  this.infWind.open(map, impactedEntriesMarkersto[this.infWindData]);
								});
							  
							  
							  
						  } else {
							dataOfInner.latlngto = "not_found";
							var myModel = collmodelOf;
							myModel.set('id', myModel.get('_id'));
							myModel.set('routes_data', JSON.stringify(dataOfInnerAll));
							myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
							myModel.save();
						  
						  }
						}.bind(this));
					}
					
				}
			}
		},
        onRender: function(){
			var th= this;
            this.renderNavigation();
			var impactedEntries = [];
			var impactedEntriesMarkers = [];
			var impactedEntriesMarkersto = [];
			var impactedEntriesMarkersListenOn = [];
			
			for(var ii=0; ii < this.collection.models.length; ii++){
				var dataOf = JSON.parse(this.collection.models[ii].attributes.routes_data);
				var thatModelOnly = this.collection.models[ii];
				var wasAddedonlyOne = false;
				for(var j=0; j < dataOf.length; j++){
					var atdata = '';
					if(typeof dataOf[j] !== "undefined" && dataOf[j] !== null && dataOf[j] !== "" && dataOf[j].route !== "" && typeof dataOf[j].latlng !== "undefined" && dataOf[j].latlng !== "not_found"){
						atdata = "add";
					}
					if(atdata != ''){
						wasAddedonlyOne = true;
					}
				}
				if(wasAddedonlyOne){
					impactedEntries.push(thatModelOnly);
				}
			}
var map = "";
		setTimeout(function(){
				
				var uluru = {lat: 55.169438, lng: 23.881275};
				 map = new google.maps.Map(document.getElementById('map'), {
				  zoom: 4,
				  center: uluru
				});
				this.realMap = map;
				var currentLocationInfWind = new google.maps.InfoWindow({
							  content: "here"
							});
							var imagea = config.urlAddr+'/files/blue.png';
							var markerCurrPos = new google.maps.Marker({
							  position: uluru,
							  map: map,
							  icon:imagea
							});
							
				var geocoder = new google.maps.Geocoder();
			   if (navigator.geolocation) {
				  navigator.geolocation.getCurrentPosition(function(position) {
					var pos = {
					  lat: position.coords.latitude,
					  lng: position.coords.longitude
					};

					markerCurrPos.setPosition(pos);
					currentLocationInfWind.setPosition(pos);
					currentLocationInfWind.setContent('Location found.');
					
					//currentLocationInfWind.open(map);
					map.setCenter(pos);
				  }, function() { });
				}
				var directionsService = new google.maps.DirectionsService();
				var directionsDisplayArr = new google.maps.DirectionsRenderer();
				var newselectedlatlng = "";
				directionsDisplayArr.setMap(map);
				
				this.geocoderFunc(geocoder);
				for(var ii=0; ii < impactedEntries.length; ii++){
					
					var dataOf = JSON.parse(impactedEntries[ii].attributes.routes_data);
					for(var j=0; j < dataOf.length; j++){
						var dataOfCurrent = dataOf[j].date;
						if(typeof dataOf[j] != "undefined" && typeof dataOf[j].latlng != "undefined" && dataOf[j].latlng != "not_found"){
							impactedEntriesMarkers[dataOfCurrent] = new google.maps.Marker({
							  position: dataOf[j].latlng,
							  map: map
							});
							impactedEntriesMarkers[dataOfCurrent].infWindData = dataOfCurrent;
							impactedEntriesMarkers[dataOfCurrent].infWind = new google.maps.InfoWindow({
							  content: dataOf[j].about
							});
							impactedEntriesMarkers[dataOfCurrent].addListener('click', function() {
							  this.infWind.open(map, impactedEntriesMarkers[this.infWindData]);
							});
						}
						if(typeof dataOf[j] != "undefined" && typeof dataOf[j].latlngto != "undefined" && dataOf[j].latlngto != "not_found"){
							impactedEntriesMarkersto[dataOfCurrent] = new google.maps.Marker({
							  position: dataOf[j].latlngto,
							  map: map
							});
							impactedEntriesMarkersto[dataOfCurrent].infWindData = dataOfCurrent;
							impactedEntriesMarkersto[dataOfCurrent].infWind = new google.maps.InfoWindow({
							  content: dataOf[j].about
							});
							impactedEntriesMarkersto[dataOfCurrent].addListener('click', function() {
							  this.infWind.open(map, impactedEntriesMarkersto[this.infWindData]);
							});
						}
						if((typeof dataOf[j] != "undefined" && typeof dataOf[j].latlngto != "undefined" && dataOf[j].latlngto != "not_found") && (typeof dataOf[j] != "undefined" && typeof dataOf[j].latlng != "undefined" && dataOf[j].latlng != "not_found")){
							newselectedlatlng = dataOf[j].latlng;
							  var request = {
								  origin: dataOf[j].latlng,
								  destination: dataOf[j].latlngto,
								  travelMode: 'DRIVING'
							  };
							  directionsService.route(request, function(response, status) {
								if (status == 'OK') {
									if(typeof directionsDisplayArr != "undefined"){
										//response.routes[0].legs.distance.text
										//response.routes[0].legs.duration.text
										//response.routes[0].legs.start_address
										//response.routes[0].legs.end_address
										map.setCenter(newselectedlatlng);
										directionsDisplayArr.setDirections(response);
									}
								}
							  });
						}
					}
				}
				
			
		}.bind(this),100);	


			
		this.realMap = map;
		this.impactedEntriesMarkers = impactedEntriesMarkers;
		this.impactedEntriesMarkersto = impactedEntriesMarkersto;
		this.impactedEntriesMarkersListenOn = impactedEntriesMarkersListenOn;
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


			this.rerenderAllMarkers();
		},
		rerenderAllMarkers: function(){
			var impactedEntries = this.impactedEntries;
			var impactedEntriesMarkers = this.impactedEntriesMarkers;
			var impactedEntriesMarkersto = this.impactedEntriesMarkersto;
			
			for(var ii=0; ii < impactedEntries.length; ii++){
				if(typeof this.whoIsNotShowingNow[impactedEntries[ii].attributes._id] == 'undefined' ||
				this.whoIsNotShowingNow[impactedEntries[ii].attributes._id]){
					var dataOf = JSON.parse(impactedEntries[ii].attributes.routes_data);
						for(var j=0; j < dataOf.length; j++){
							impactedEntriesMarkers[dataOf[j].date].setMap(this.realMap);
							impactedEntriesMarkersto[dataOf[j].date].setMap(this.realMap);
						}
				}else{
					var dataOf = JSON.parse(impactedEntries[ii].attributes.routes_data);
						for(var j=0; j < dataOf.length; j++){
							impactedEntriesMarkers[dataOf[j].date].setMap(null);
							impactedEntriesMarkersto[dataOf[j].date].setMap(null);
						}
				}
			}
		}
    });
    return view;
});
