require.config({
	paths: {
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		marionette: '../bower_components/backbone.marionette/lib/backbone.marionette',
		jquery: '../bower_components/jquery/jquery',
		jqueryui: '../bower_components/jquery/jqueryui',
		jquerytouch: '../bower_components/jquery/jquerytouch',
		localStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		tpl: 'lib/tpl',
        bootstrap: 'lib/bootstrap.min'
	},

	shim: {
		underscore: {
			exports: '_'
		},

		backbone: {
			exports: 'Backbone',
			deps: ['jquery', 'jqueryui', 'jquerytouch', 'underscore']
		},

		marionette: {
			exports: 'Backbone.Marionette',
			deps: ['jquery','backbone']
		},

        bootstrap: {
            deps: ['jquery','jqueryui','jquerytouch']
        }

	},
    waitSeconds: 60
});

require([
	'jquery',
	'app',
    'modules/Pages',
	'bootstrap'
], function (jquery, app, PagesModule, bootstrap) {
	'use strict';
	$(document).ready(function() {
		initTouchHandler();

	});
    app.addInitializer(function() {
        PagesModule.start();
    });

	app.start();
});
