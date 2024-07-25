/**
 * Check
 */
define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('Check', ['$scope', '$compile', '$location', 'api',
        function ($scope, $compile, $location, api) {
            api.getCredentials().success(function() {
                $location.path("/home");
            }).error(function(status, data) {
                $location.path("/login");
            });
        }]);
});
