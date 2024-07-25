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
        bootstrap: 'lib/bootstrap.min',
		Spinner:'/javascripts/spin/spin',
		/*socket:'../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io',*/
		socket:'../javascripts/socket.io',
		jquerysvg:'/javascripts/draggfunc',
		nicEdit:'/javascripts/nicEdit',
		tinymce:'/javascripts/tinymce.min'
	},

	shim: {
		tinymce: {
			exports:'tinymce'
		},
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
    waitSeconds: 240
});

require([
	'jquery',
	'app',
    'modules/Pages',
	'bootstrap',
	'Spinner'
], function (jquery, app, PagesModule, bootstrap, Spinner) {
	window.Spinner = Spinner;
	'use strict';
	$(document).ready(function() {
		initTouchHandler();

	});
    app.addInitializer(function() {
        PagesModule.start();
    });
	$(".just_on_the_start_loading_ok").hide();
	app.start();
});
