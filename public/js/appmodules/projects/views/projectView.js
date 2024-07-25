define([
	'views/templateHelpers',
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/projectTemplate.html'
], function( templateHelpers, $, _, Backbone, template ) {

    return Backbone.View.extend({
		templateHelpers:templateHelpers,
        template: _.template( template )
    });
});
