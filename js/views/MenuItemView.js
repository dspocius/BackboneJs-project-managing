/*global define */

define([
	'marionette',
	'templates',
    'models/Page',
    'views/PageView'
], function (Marionette, templates, Page, PageView) {
	'use strict';

	return Marionette.ItemView.extend({
		template: templates.menuItem,
        tagName: 'li',
        model: Page,

		ui: {
			link: 'a',
            menitem: '#menitem',
            rightitem: '#rightitem'
		},

		events: {
			'click a': 'activateMenu',
			'click #menitem': 'onMenuItem',
			'click #rightitem': 'onMenuItem'
		},
        modelEvents: {
            "change:active": function() {
                this.render();
            }
        },

        activateMenu: function (event) {

		},
        onMenuItem: function(e){
            this.trigger('menuitem:click', this);
        },
        onRender: function() {
            if(this.model.get('active')) this.$el.addClass('active');
        }

	});
});
