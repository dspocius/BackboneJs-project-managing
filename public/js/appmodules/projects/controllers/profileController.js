define([
	'backbone',
    '../../../app',
    'models/base',
    'underscore',
    '../views/profileView',
    'models/project'
], function( backbone,app, base, _, profileView, project ) {
    return base.extend({
        show: function(options){
			options.people.set("backgroundPictureAccount", options.settings.backgroundPictureAccount);
			var cView = new profileView({model: options.people});
			app.main.show(cView);
        }
    });
});