define([
	'backbone',
    '../../../app',
    'models/base',
    'underscore',
    '../views/searchView',
    'models/project',
	'../collections/searchCollection',
	'templates'
], function( backbone, app, base, _, searchView, project, searchCollection, templates ) {
    return base.extend({
        show: function(options){
			var search = options.search;
			this.search(search,location.href.indexOf("speople") > -1);
        },
		getSearch: function(inputString,peopleSelected){
			var th = this;
			this.ispeopleSelected = peopleSelected || false;
			var selectedOth = true;
			if (this.ispeopleSelected) {
				selectedOth = false;
			}
			this.mymodel = new backbone.Model();
			this.mymodel.set("yaddress", "");
			this.mymodel.set("inputvalue", inputString);
			this.mymodel.set("peopleset", this.ispeopleSelected);
			this.mymodel.set("isonlyproject", selectedOth);
			this.mymodel.set("entryset", selectedOth);
			this.mymodel.set("projectsset", selectedOth);			
			this.mymodel.set("friendsset", selectedOth);			
			this.mymodel.set("maleset", true);
			this.mymodel.set("femaleset", true);
			this.mymodel.set("showlogged", false);
			this.mymodel.set("assigned", "");
			this.mymodel.set("city", "");
			this.mymodel.set("yearsfrom", 16);
			this.mymodel.set("yearsto", 99);
			this.mymodel.set("peoplecount", 0);
			this.mymodel.set("procount", 0);
			
			this.mymodel.on("changeev", function() {
				th.research();
			});
			
			this.searchCol = new searchCollection();
			this.searchCol2 = new searchCollection();
			this.searchCol.url = templates.urlAddr+'/users/'+inputString;
			//this.searchCol2.url = templates.urlAddr+'/projectsFind/'+inputString+"/"+app.userData._id;
			
			var sendData = {
				search: inputString,
				idd: app.userData._id,
				skip: 0,
				type: '-',
				assigned: "",
				infriends: true
			};
			
			this.mainview = new searchView({model: this.mymodel, collection: this.searchCol});

			app.main.show(this.mainview);
			
			if (this.mymodel.get("entryset") || this.mymodel.get("projectsset")) {
			$.ajax({
				  method: "POST",
				  data: sendData,
				  url: templates.urlAddr+'/projectsFind',
				dataType: 'json'
			}).always(function (msg) {				
				msg.map(function(data){
					th.searchCol2.add(new project(data));
				});
				
				var skipMorePro = th.searchCol2.models.filter(function(mod){ 
					var ish = mod.get("isHeader");
					return typeof ish === "boolean";
				}).length;
			
				th.mymodel.set("procount", skipMorePro);
				th.searchCol2.models.map(model => {
					th.searchCol.add(model);
				});
				th.mainview.render();
			});
			} else {
				th.mymodel.set("procount", 0);
			}
			if (this.mymodel.get("peopleset")) {
			this.searchCol.fetch().done(function(){
				var skipMorePeople = th.searchCol.models.filter(function(mod){ 
					var ish = mod.get("isHeader");
					return typeof ish !== "boolean";
				}).length;
			
				th.mymodel.set("peoplecount", skipMorePeople);
				th.searchCol2.models.map(model => {
					th.searchCol.add(model);
				});
				th.mainview.render();
			});
			} else {
				th.mymodel.set("peoplecount", 0);
			}
		},
		research: function(){
			var assigned = this.mymodel.get("assigned");
			var inputString = this.mymodel.get("inputvalue");
			if (inputString == "") {
				assigned = "-";
			}
			var friendsset = "false";
			if (this.mymodel.get("friendsset") && this.mymodel.get("friendsset")) {
				friendsset = "true";
			}
			if (inputString == "") {
				inputString = "-";
			}
			
			var sendData = {
				search: inputString,
				idd: app.userData._id,
				skip: 0,
				type: '-',
				assigned: assigned,
				infriends: friendsset
			};
			
			this.searchCol = new searchCollection();
			this.searchCol.url = templates.urlAddr+'/users/'+inputString;
			this.mainview = new searchView({model: this.mymodel, collection: this.searchCol});
			app.main.show(this.mainview);
			
			var city = "-";
			if (this.mymodel.get("yaddress") && this.mymodel.get("yaddress") != "" && this.mymodel.get("yaddress") != "-") {
				city = this.mymodel.get("yaddress")+"___COUNTRY___"+this.mymodel.get("city");
			}
			if (this.mymodel.get("city") != "" || city != "-") {
				city = city != "-" ? city:this.mymodel.get("city");
				this.searchCol.url = templates.urlAddr+'/users/'+inputString+"/"+city
			}
			var gend = "-";
			
			if (!this.mymodel.get("maleset") && this.mymodel.get("femaleset")) {
				gend = "female";
				if (this.mymodel.get("showlogged")) {
					gend = "__LOGGEDIN__"+gend;
				}
				this.searchCol.url = templates.urlAddr+'/users/'+inputString+"/"+city+"/"+gend;
			}
			if (this.mymodel.get("maleset") && !this.mymodel.get("femaleset")) {
				gend = "male";
				if (this.mymodel.get("showlogged")) {
					gend = "__LOGGEDIN__"+gend;
				}
				this.searchCol.url = templates.urlAddr+'/users/'+inputString+"/"+city+"/"+gend;
			}
			if (gend.indexOf("__LOGGEDIN__") == -1 && this.mymodel.get("showlogged")) {
				gend = "__LOGGEDIN__";
				this.searchCol.url = templates.urlAddr+'/users/'+inputString+"/"+city+"/"+gend;

			}
			if (this.mymodel.get("yearsfrom") != 16 || this.mymodel.get("yearsto") != 99) {
				this.searchCol.url = templates.urlAddr+'/users/'+inputString+"/"+city+"/"+gend+"/"+this.mymodel.get("yearsfrom")+"/"+this.mymodel.get("yearsto");
			}
			

			var th = this;
			if (this.mymodel.get("entryset") || this.mymodel.get(" ")) {
				if (!this.mymodel.get("projectsset") && this.mymodel.get("entryset")) {
					sendData.type = "entries";
				}
				if (this.mymodel.get("projectsset") && !this.mymodel.get("entryset")) {
					sendData.type = "projects";
				}
				
				$.ajax({
				  method: "POST",
				  data: sendData,
				  url: templates.urlAddr+'/projectsFind',
				dataType: 'json'
				}).always(function (msg) {
					th.mymodel.set("procount", msg.length);
					
					msg.map(function(data){
						th.searchCol.add(new project(data));
					});
					th.mainview.render();
				});
			}
			
			if (this.mymodel.get("peopleset")) {
				this.searchCol.fetch().done(function(){
					th.searchCol.models.map(model => {
						th.searchCol.add(model);
					});
					th.mainview.render();
				});
			}
		},
		search: function(inputString, peopleSelected){
			if(typeof app.userData == 'undefined'){
				app.vent.on('data:triggered:userconnected', function () {
					this.getSearch(inputString,peopleSelected);
				}.bind(this));
			}else{
				this.getSearch(inputString,peopleSelected);
			}
		}
    });
});