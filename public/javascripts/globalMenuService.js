appServices.factory('globalMenuService', function () {
    return {
        initializeScopeListening: function($scope, $location, AuthenticationService){
            $scope.logOut = function() {
                if (AuthenticationService.UserIsAuthenticated(AuthenticationService)) {
                    AuthenticationService.LogOutUser(AuthenticationService);
                }
                else {
                    $location.path("/login");
                }
            }
            $scope.firstPage = function() {
                $location.path("/");
            }
            $scope.ShowAllPrograms = function() {
                $location.path("/programs");
            }
            $scope.ShowPrograms = function() {
                $location.path("/myprograms");
            }
            $scope.myAccount = function() {
                $location.path("/account");
            }
        }
    }
});