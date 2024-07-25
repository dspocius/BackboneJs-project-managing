({
    appDir: "./",
    baseUrl: "./",
    dir: "./dist",
    modules: [
        {
            name: "main"
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: "standard",
    removeCombined: true,
	paths: {
		underscore: "../bower_components/underscore/underscore",
		backbone: "../bower_components/backbone/backbone",
		marionette: "../bower_components/backbone.marionette/lib/backbone.marionette",
		jquery: "../bower_components/jquery/jquery",
		jqueryui: "../bower_components/jquery/jqueryui",
		jquerytouch: "../bower_components/jquery/jquerytouch",
		localStorage: "../bower_components/backbone.localStorage/backbone.localStorage",
		tpl: "lib/tpl",
        bootstrap: "lib/bootstrap.min",
		Spinner:"../javascripts/spin/spin",
		socket:"../javascripts/socket.io",
		//socket:"../javascripts/socket.io-client/dist/socket.io",
		/*socket:"../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io",*/
		jquerysvg:"../javascripts/draggfunc",
		nicEdit:"../javascripts/nicEdit",
		tinymce:"../javascripts/tinymce.min",
		chartutils:"../javascripts/chartutils",
		chartutilsbundle:"../javascripts/Chart.bundle"
	},

	shim: {
		tinymce: {
			exports:"tinymce"
		},
		underscore: {
			exports: "_"
		},

		backbone: {
			exports: "Backbone",
			deps: ["jquery", "jqueryui", "jquerytouch", "underscore"]
		},

		marionette: {
			exports: "Backbone.Marionette",
			deps: ["jquery","backbone"]
		},

        bootstrap: {
            deps: ["jquery","jqueryui","jquerytouch"]
        }

	}//node r.js -o build.js
})