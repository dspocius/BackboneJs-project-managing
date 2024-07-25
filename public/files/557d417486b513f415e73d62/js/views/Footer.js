/*global define */

define([
	'marionette',
	'templates',
	'views/templateHelpers'
], function (Marionette, templates, templateHelpers) {
	'use strict';

	return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
		template: templates.footer
	});
});
