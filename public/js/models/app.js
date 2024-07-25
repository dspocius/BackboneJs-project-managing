define([
	'underscore',
	'backbone'
], function( _, Backbone ) {
	return Backbone.Model.extend({},{
		header:'#header',
		main:'#main',
		footer:'#footer',
		dialog:'#dialog'
	});
});
