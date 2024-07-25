define([
    'models/base',
    'templates'
], function( base, templates ) {
    'use strict';

    return base.extend({
        urlRoot: templates.urlAddr+'/checkifuserloggedin'
    });
});
