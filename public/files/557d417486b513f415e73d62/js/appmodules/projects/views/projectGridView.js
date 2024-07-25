define([
	'../../../app',
	'views/templateHelpers',
    'marionette',
    './projectGridRowView',
    'tpl!../templates/projectGrid.html',
	'views/BaseGridDrag'
], function (app,templateHelpers,Marionette, projectGridRowView, projectGrid, BaseGridDrag) {
    'use strict';

    var view = BaseGridDrag.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects tr'
    });
    return view;
});
