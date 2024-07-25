define([
	'../../../../app',
	'views/templateHelpers',
    'marionette',
    './timeRowView',
    'tpl!./timeGrid.html',
	'views/BaseGridDrag'
], function (app,templateHelpers,Marionette, projectGridRowView, projectGrid, BaseGridDrag) {
    'use strict';

    var view = BaseGridDrag.extend({
		templateHelpers:templateHelpers,
        template:projectGrid,
        itemView:projectGridRowView,
        itemViewContainer:'.projects .tsortable',
		serializeData: function() {
			if (this.collection.url.indexOf("projectstimeline") > -1) {
				return { itemCount: this.collection.models.length }
			}
			
			return {itemCount: 0};
		}
    });
    return view;
});
