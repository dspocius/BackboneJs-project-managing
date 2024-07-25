define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/projectTemplate.html'
], function( $, _, Backbone, template ) {

    return Backbone.View.extend({
        template: _.template( template )
    });
});
