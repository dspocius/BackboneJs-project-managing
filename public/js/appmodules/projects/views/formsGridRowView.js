define([
	'../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/formsGridRowView.html'
], function (app, templateHelpers, _, Marionette, templ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        tagName:'div',
        className:'test',
        ui:{
            projectMain:'.projectMain'
        },
		initialize: function(){

		},
        events:{
            'click .removeDataOneInPostedOrHist':'listenToRemoveDataOne',
			'click .removeDataOneInOrdered':'listenToRemoveDataOneOrdered',
			'click .setstatusOfTheOrder':'setstatusOfTheOrder'
        },
		setstatusOfTheOrder: function(e){
			var emailDataWh = e.currentTarget.getAttribute('data-whom');
			var statusOf = e.currentTarget.getAttribute('data-status');
			var gyuidd = e.currentTarget.getAttribute('data-guid');
			var extra_inf = $("#extra_info_add").val();
			var statusOfNow = statusOf+"____"+extra_inf;
			var commentsCol = app.getAllFormsModelOrdered();
			app.addToAllFormsCollectionSubmittedRemoveByGuid(gyuidd, "formsManagement"+emailDataWh);
			app.addToAllFormsCollectionSubmittedRemoveByGuid(gyuidd, "formsManagementSubmitted"+app.userData.email);
			app.updateAllFormsCollectionSubmitted(commentsCol, gyuidd, statusOfNow);
			location.reload();
		},
		listenToRemoveDataOne: function(e){
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
					app.removeToAllFormsCollection(date);
					$('#dataThereUnId'+date.replace(/ /g,'').replace(/:/g,'')).remove();
					$('.commentInModalOrderedButton'+date.replace(/ /g,'').replace(/:/g,'')).remove();
					$('.commentInModalOrdered'+date.replace(/ /g,'').replace(/:/g,'')).remove();
					if(location.href.indexOf("#posted") > -1){
						location.reload();
					}
				}
		},
		listenToRemoveDataOneOrdered: function(e){
			var date = e.currentTarget.getAttribute('data-date');
				if(date != '' ){
					app.removeToAllFormsCollectionOrdered(date);
					$('.commentInModalOrderedButton'+date.replace(/ /g,'').replace(/:/g,'')).remove();
					$('.commentInModalOrdered'+date.replace(/ /g,'').replace(/:/g,'')).remove();
				}
		},
		onRender:function(){
			$(".removeDataOneInPostedOrHist").click(function(e){ this.listenToRemoveDataOne(e); }.bind(this));
			$(".removeDataOneInOrdered").click(function(e){ this.listenToRemoveDataOneOrdered(e); }.bind(this));
			$(".setstatusOfTheOrder").click(function(e){ this.setstatusOfTheOrder(e); }.bind(this));
		}
    });
});
