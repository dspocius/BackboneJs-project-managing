define([
	'../../../../app',
	'views/templateHelpers',
    'marionette',
    './articleRowView',
    'tpl!./articleGrid.html',
	'views/BaseGridDrag'
], function (app,templateHelpers,Marionette, projectGridRowView, projectGrid, BaseGridDrag) {
    'use strict';

    var view = BaseGridDrag.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects .articleView'
    });
    return view;
});
