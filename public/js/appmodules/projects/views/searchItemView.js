define([
	'../../../app',
	'../../../config',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/searchItem.html'
], function (app, config, templateHelpers, _, Marionette, templ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: templ,
		className:"searchOnePerson",
        ui:{
           // projectMain:'.projectMain'
        },
        events:{
			//'click #open_edit_in_project': 'open_edit_in_project',
        },

        initialize: function(){
           // this.$el.attr("pid", this.model.get('_id'));
        }
    });
});
