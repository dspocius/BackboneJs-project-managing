/*global define */

define([
	'marionette',
	'views/templateHelpers'
], function (Marionette, templateHelpers) {
	'use strict';

	return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
		events: {
            'click .dismiss': 'dismiss'
        },
        dismiss: function(e) {
            e.preventDefault();
            this.trigger('dialog:close');
        }
	});
});
