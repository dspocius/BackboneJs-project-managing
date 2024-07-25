define([
    'models/base',
    'templates'
], function( base, templates ) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: templates.urlAddr+'/checkifuserloggedin'
    });
});
