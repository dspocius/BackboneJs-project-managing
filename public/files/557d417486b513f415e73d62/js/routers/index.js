/*global define */

define([
	'marionette'
], function (Marionette) {
	'use strict';

	return Marionette.AppRouter.extend({
		appRoutes: {
			'': 'home',
			'page/:pageName': 'showPage',
			'home': 'home',
			'logout': 'logout',
            'projects': 'projects',
            'projectsinlist/:project/:list': 'projectsinlist',
			'project/:project':'project',
			'add/:project':'addEntry',
			'addlist/:project/:list':'addEntryList',
			'search/:search':'search',
			'settings':'settings',
			'account':'account',
			'entry/:entry':'entry'
		}
	});
});
