/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'angular-route',
    'socket',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index',
    './view-services/index',
	'./lib/russian'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'app.controllers',
        'app.directives',
        'app.filters',
        'app.services',
        'app.viewServices',
        'ngRoute'
    ]);
});
