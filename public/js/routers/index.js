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
			'timeline': 'timeline',
			'logout': 'logout',
            'projects': 'projects',
            'projectsinlist/:project/:list': 'projectsinlist',
            'projectsinlist/:project/:list/:p': 'projectsinlist',
			'project/:project':'project',
			'project/:project/:p':'project',
			'people/:p':'people',
			'add/:project':'addEntry',
			'addlist/:project/:list':'addEntryList',
			'speople/':'search',
			'speople/:search':'search',
			'search/':'search',
			'search/:search':'search',
			'settings':'settings',
			'account':'account',
			'history':'history_forms',
			'posted':'posted',
			'ordered':'ordered_forms',
			'entry/:entry':'entry',
			'entry/:entry/:p':'entry',
			'entry_pdf/:entry/:pdf_id':'entry_pdf',
			':p':'people',
			':p/about':'peopleabout'
		}
	});
});
