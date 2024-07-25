define([
	'../../../app',
	'views/templateHelpers',
    'marionette',
    './projectListRowView',
    'tpl!../templates/projectListGrid.html',
	'views/BaseGridDrag'
], function (app,templateHelpers,Marionette, projectGridRowView, projectGrid, BaseGridDrag) {
    'use strict';

    var view = BaseGridDrag.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects div'
    });
    return view;
});
