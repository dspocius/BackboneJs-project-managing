define([
    'models/base',
    'templates'
], function( base, templates ) {
    'use strict';

    return base.extend({
        idAttribute:'_id',
        urlRoot: templates.urlAddr+'/user'
    });
});
