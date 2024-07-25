/*global define */

define([
	'marionette'
], function (Marionette) {
	'use strict';

	return Marionette.AppRouter.extend({
		appRoutes: {
			'': 'firstcheck',
			'page/:pageName': 'firstcheck',
			'page/:username/:pageName': 'showPage',
			'logout': 'logout',
            'projects/:username': 'projects',
            'projectsinlist/:username/:project/:list': 'projectsinlist',
			'project/:username/:project':'project',
			'add/:project':'addEntry',
			'addlist/:project/:list':'addEntryList',
			'entry/:username/:entry':'entry'
		}
	});
});
