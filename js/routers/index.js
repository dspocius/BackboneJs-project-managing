/*global define */

define([
	'marionette'
], function (Marionette) {
	'use strict';

	return Marionette.AppRouter.extend({
		appRoutes: {
			'': 'projects',
			'page/:pageName': 'showPage',
			'home': 'home',
			'logout': 'logout',
            'projects': 'projects',
			'project/:project':'project',
			'add/:project':'addEntry',
			'entry/:entry':'entry'
		}
	});
});
