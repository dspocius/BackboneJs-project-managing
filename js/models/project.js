define([
    'models/base',
    'templates'
], function( base, templates ) {
	'use strict';
	
    return base.extend({
        idAttribute:'_id',
        urlRoot: templates.urlAddr+'/project',
        defaults: {
            isProject: false,
            updated: new Date().toJSON().toString(),
            isHeader:false,
            position:0,
            color:"#80BCF0",
            files:''
        }
    });
});
