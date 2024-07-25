define([
    '../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/profile.html'
], function (app, templateHelpers, _, Marionette, templ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: templ,
		initialize: function(){
			this.listenTo(this.model,'change',this.render);
		}
    });
});
