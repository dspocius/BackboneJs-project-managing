define([
    'backbone',
    'templates'
], function( Backbone, templates ) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: templates.urlAddr+'/login'
    });
});
