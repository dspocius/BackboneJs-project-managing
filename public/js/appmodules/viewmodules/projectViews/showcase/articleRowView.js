define([
	'../../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!./articleGridRow.html',
    'models/project',
	'views/BaseRowView',
	'../../../projects/views/projectGridRowView'
], function (app, templateHelpers, _, Marionette, templ, Project, BaseRowView, projectGridRowView) {
    'use strict';

    return projectGridRowView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        tagName:'div',
        className:'headerMain',
    });
});
