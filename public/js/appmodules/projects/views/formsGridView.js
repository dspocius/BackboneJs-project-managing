define([
	'../../../app',
	'views/templateHelpers',
    'marionette',
    './formsGridRowView',
    'tpl!../templates/formsGridView.html'
], function (app,templateHelpers,Marionette, formsGridRowView, formsGridView) {
    'use strict';

    var view = Marionette.CompositeView.extend({
		templateHelpers:templateHelpers,
        template:formsGridView,
        itemView:formsGridRowView,
        itemViewContainer:'.forms_data_view_cont',
		events:{
            'click .submit_data_to_history':'submit_data_to_history'
        },
		getTimeNow: function(plius){
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var seconds = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(seconds<10){
					seconds='0'+seconds
				} 
				if(typeof plius != "undefined" && plius != ""){
					seconds = today.getSeconds()+1;
				}
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+seconds;
				return today;
		},
		get_guid: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		},
		submit_data_to_history: function(){
			var modelsAll = this.collection.models;
			var all_info_data = [];
			var emailToSave = "";
			for(var ii=0; ii < modelsAll.length; ii++){
				var other_data_ok = modelsAll[ii].get("other_data");
				app.userData.address.Email = app.userData.email;
				other_data_ok.push({array:[], data:"Address", object: app.userData.address});
				var info_obj = {
					formsdata: modelsAll[ii].get("formsdata"),
					id_of_model: modelsAll[ii].get("id_of_model"),
					other_data: other_data_ok,
					date: modelsAll[ii].get("date"),
					email_seller: modelsAll[ii].get("email_seller"),
					email_buyer: app.userData.email
				};
				emailToSave = modelsAll[ii].get("email_seller");
				app.removeToAllFormsCollection(modelsAll[ii].get("date"));
				all_info_data.push(info_obj);
			}
			var msgOfGo = JSON.stringify(all_info_data);
			var guid_of_order = this.get_guid();
			var msssgogoa = {from: guid_of_order, message:msgOfGo, files:'Submitted', date: this.getTimeNow()};
			var msssgogob = {from: guid_of_order, message:msgOfGo, files:'Submitted', date: this.getTimeNow("add")};
			//if(app.userData.email !== emailToSave){
				app.addToAllFormsCollectionSubmitted(msssgogoa, emailToSave);
			//}
			app.addToAllFormsCollection(msssgogob, app.userData.email);
			location.reload();
		}
    });
    return view;
});
