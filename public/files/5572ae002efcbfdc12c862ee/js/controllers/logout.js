define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('Logout', ['$scope', '$compile', '$location', 'api','viewLogin','authentication',
        function ($scope, $compile, $location, api, viewLogin, authentication) {
                api.logout().success(function() {
                    $('#footer-nav-center ul').html('');
                    $('#left-menu').css('display','none');
                    $('#left-menu ul').html('');
                    $('#main-nav-left ul').html('');
                    $location.path("/");
                    location.reload();
                });
        }]);
});
