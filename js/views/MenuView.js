/*global define */

define([
	'marionette',
    'views/MenuItemView'
], function (Marionette, MenuItemView) {
	'use strict';

	return Marionette.CollectionView.extend({
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
