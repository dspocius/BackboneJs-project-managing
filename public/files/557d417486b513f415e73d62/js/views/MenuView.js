/*global define */

define([
	'marionette',
    'views/MenuItemView',
	'views/templateHelpers'
], function (Marionette, MenuItemView,templateHelpers) {
	'use strict';

	return Marionette.CollectionView.extend({
		templateHelpers:templateHelpers,
        itemView: MenuItemView,
        tagName: 'ul',
        className: 'nav nav-pills pull-right',
        initialize: function(){
            this.on('itemview:menuitem:click',function(view){
                this.trigger('menuitem:click',view);
            });
        }
	});

});
