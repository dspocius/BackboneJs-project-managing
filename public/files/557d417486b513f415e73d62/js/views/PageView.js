/*global define */

define([
	'marionette',
	'templates',
    'underscore',
	'views/templateHelpers'
], function (Marionette, templates, _, templateHelpers) {
	'use strict';

	return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
		template: templates.page,

        ui: {
            header: 'h2'
        },

        onBeforeRender: function(){
            this.model.set('content', _.result(templates.pages, this.model.get('name')))
        }

	});
});
