define([
	'../../../app',
	'../../../config',
	 'backbone',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/search.html',
	'./searchItemView',
	'templates',
	'models/project'
], function (app, config, Backbone,templateHelpers, _, Marionette, templ, searchItemView, templates, Project) {
    'use strict';

    return Marionette.CompositeView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        itemView:searchItemView,
        itemViewContainer:'.searchItems',
        ui:{
           // projectMain:'.projectMain'
        },
        events:{
			'click .settopeople': 'settopeople',
			'click .settoentries': 'settoentries',
			'keyup .citygohere': 'citygohere',
			'change .countrygohere': 'countrygohere',
			'keyup .searchgohere': 'searchgohere',
			'keyup .assignedgohere': 'assignedgohere',
			'click .loadmoresearchHere': 'loadmoresearchHere',
			'change #checkPeople': 'checkPeople',
			'change #checkEntries': 'checkEntries',
			'change #checkProjects': 'checkProjects',
			'change #checkFriends': 'checkFriends',
			'change #femaleset': 'femaleset',
			'change #loggedset': 'loggedset',
			'change #maleset': 'maleset',
			'change #toYears': 'toYears',
			'change #fromYears': 'fromYears',
			'click .searchnow': 'searchnow'
        },

		settopeople: function() {
			Backbone.history.navigate('speople/',{ trigger: true });
		},
		settoentries: function() {
			Backbone.history.navigate('search/',{ trigger: true });
		},
		getUsersLoadMoreUrl: function() {
			this.mymodel = this.model;
			var colls = this.collection.models;
			var sendData = {
				search: '',
				idd: '',
				skip: 0,
				type: '-',
				assigned: '-',
				infriends: 'false'
			};
			
			var skipMorePeople = colls.filter(function(mod){ 
				var ish = mod.get("isHeader");
				return typeof ish !== "boolean";
			}).length;
			
			var skipMorePro = colls.filter(function(mod){ 
				var ish = mod.get("isHeader");
				return typeof ish === "boolean";
			}).length;
			
			var assigned = this.mymodel.get("assigned");
			var inputString = this.mymodel.get("inputvalue");
			if (assigned == "") {
				assigned = "-";
			}
			if (inputString == "") {
				inputString = "-";
			}
			
			sendData.search = inputString;
			sendData.idd = app.userData._id;
			sendData.skip = skipMorePro;
			sendData.assigned = assigned;
			
			if (this.mymodel.get("friendsset") && this.mymodel.get("friendsset")) {
				sendData.infriends = "true";
			}

			var url = templates.urlAddr+'/users/'+inputString+'/-/-/-/-/'+skipMorePeople;
			var url2 = templates.urlAddr+'/projectsFind';
			
			var city = "-";
			var country = "";
			if (this.mymodel.get("yaddress") && this.mymodel.get("yaddress") != "" && this.mymodel.get("yaddress") != "-") {
				country = this.mymodel.get("yaddress")+"___COUNTRY___";
			}
			if (this.mymodel.get("city") != "") {
				city = this.mymodel.get("city");
				url = templates.urlAddr+'/users/'+inputString+"/"+country+city+"/-/-/-/"+skipMorePeople;
			}
			var gend = "-";
			if (!this.mymodel.get("maleset") && this.mymodel.get("femaleset")) {
				url = templates.urlAddr+'/users/'+inputString+"/"+country+city+"/female/-/-/"+skipMorePeople;
				gend = "female";
			}
			if (this.mymodel.get("maleset") && !this.mymodel.get("femaleset")) {
				url = templates.urlAddr+'/users/'+inputString+"/"+country+city+"/male/-/-/"+skipMorePeople;
				gend = "male";
			}

			if (this.mymodel.get("yearsfrom") != 16 || this.mymodel.get("yearsto") != 99) {
				url = templates.urlAddr+'/users/'+inputString+"/"+country+city+"/"+gend+"/"+this.mymodel.get("yearsfrom")+"/"+this.mymodel.get("yearsto")+"/"+skipMorePeople;
			}

			var th = this;
			if (this.mymodel.get("entryset") || this.mymodel.get("projectsset")) {
				if (!this.mymodel.get("projectsset") && this.mymodel.get("entryset")) {
					sendData.type = "entries";
				}
				if (this.mymodel.get("projectsset") && !this.mymodel.get("entryset")) {
					sendData.type = "projects";
				}
				
				if (this.mymodel.get("peopleset")) {
					return { people: url, pro: url2, prodata: sendData };
				}
				
				return { pro: url2, prodata: sendData };
			}
			
			if (this.mymodel.get("peopleset")) {
				return { people: url, pro: url2, prodata: sendData };
			}
			
			return "";
		},

        searchnow: function(e){
            e.stopPropagation();
            e.stopImmediatePropagation();
			
			this.model.trigger('changeev', this.model, {});
		},
        loadmoresearchHere: function(e){
            e.stopPropagation();
            e.stopImmediatePropagation();
        var coll = this.options.collection;
		var th = this;
		
		let getUrls = this.getUsersLoadMoreUrl();
		if (getUrls != "") {
			if (typeof getUrls.pro != "undefined" && (this.mymodel.get("entryset") || this.mymodel.get("projectsset"))) {
				$.ajax({
				  method: "POST",
				  data: getUrls.prodata,
				  url: getUrls.pro,
				dataType: 'json'
				}).always(function (msg) {
					th.mymodel.set("procount", msg.length);
					if (th.mymodel.get("peoplecount") < 20 && 
					th.mymodel.get("procount") < 20) {
						$(".loadmoresearchHere").hide();
					} else {
						$(".loadmoresearchHere").show();
					}
					msg.map(function(data){
						coll.add(new Project(data));
					});
				});
			} else {
				th.mymodel.set("procount", 0);
			}
			
			if (typeof getUrls.people != "undefined" && this.mymodel.get("peopleset")) {
				$.ajax({
				  method: "GET",
				  url: getUrls.people,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json'
				}).always(function (msg) {
					var msgsAll = JSON.parse(msg);
					th.mymodel.set("peoplecount", msgsAll.length);
					if (th.mymodel.get("peoplecount") < 20 && 
					th.mymodel.get("procount") < 20) {
						$(".loadmoresearchHere").hide();
					} else {
						$(".loadmoresearchHere").show();
					}
					msgsAll.map(function(data){
						coll.add(new Project(data));
					});
				});
			} else {
				th.mymodel.set("peoplecount", 0);
			}
		}

		//	this.searchCol.url = templates.urlAddr+'/users/'+inputString;
		//	this.searchCol2.url = templates.urlAddr+'/projectsFind/'+inputString+"/"+app.userData._id;
		},
        fromYears: function(e){
		   var vall = $(e.currentTarget).val();
		   this.model.set("yearsfrom", vall);
		},
        toYears: function(e){
		   var vall = $(e.currentTarget).val();
		   this.model.set("yearsto", vall);
		},
        femaleset: function(e){
			var vall = $(e.currentTarget).is(":checked");
			this.model.set("femaleset", vall);
		},
		loggedset: function(e){
			var vall = $(e.currentTarget).is(":checked");
			this.model.set("showlogged", vall);
		},
        maleset: function(e){
			var vall = $(e.currentTarget).is(":checked");
			this.model.set("maleset", vall);
		},
        checkProjects: function(e){
			var vall = $(e.currentTarget).is(":checked");
			this.model.set("projectsset", vall);
		},
        checkEntries: function(e){
			var vall = $(e.currentTarget).is(":checked");
			this.model.set("entryset", vall);
		},
        checkPeople: function(e){
			var vall = $(e.currentTarget).is(":checked");
			this.model.set("peopleset", vall);
		},
		checkFriends: function(e) {
			var vall = $(e.currentTarget).is(":checked");
			this.model.set("friendsset", vall);
		},
        citygohere: function(e){
		   var vall = $(e.currentTarget).val();
		   this.model.set("city", vall);
		},       
		countrygohere: function(e){
		   var vall = $(e.currentTarget).val();
		   this.model.set("yaddress", vall);
		},
        searchgohere: function(e){
		   var vall = $(e.currentTarget).val();
		   this.model.set("inputvalue", vall);
        },
        assignedgohere: function(e){
		   var vall = $(e.currentTarget).val();
		   this.model.set("assigned", vall);
        }
    });
});
