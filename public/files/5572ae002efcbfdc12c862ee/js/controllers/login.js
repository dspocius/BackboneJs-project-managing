define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('login', ['$scope', '$compile', '$location', 'api','viewLogin','authentication',
        function ($scope, $compile, $location, api, viewLogin, authentication) {
            $('#custom_data_text').html('');
            if (typeof authentication.logged != 'undefined' && authentication.logged) {
                api.getCredentials().success(function(data) {
                    $location.path("/home");
                });
            }else{
                viewLogin.initializeScopeListening($scope);
                $scope.$on('view:login', function(event, obj) {
                    api.login(obj.cUser,obj.cPass).success(function(data) {
                        authentication.logged = true;
                        authentication.email = obj.cUser;
                        $location.path("/home");
                    }).error(function(status, data) {
                        authentication.logged = false;
                        authentication.email = '';
                    });
                });
            }
    }]);
});
