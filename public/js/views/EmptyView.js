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
        template: templates.empty
    });
});
