/*global define */

define([
	'marionette',
    'tpl!templates/notification.html',
	'views/templateHelpers'
], function (Marionette, notificationTpl, templateHelpers) {
	'use strict';

	return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: notificationTpl,
		events: {
            'click .dismiss': function(e) {
                e.preventDefault();
                this.trigger('notification:close');
            }
        }
	});
});
