appControllers.controller('AccountCtrl', ['$scope', 'ProgramService', '$location', '$window', '$sce','AuthenticationService','globalMenuService',
    function($scope, ProgramService, $location, $window, $sce,AuthenticationService, globalMenuService) {
        var contrFunction = function(){
        $scope.firstPage = function() {
            $location.path("/");
        }
        $scope.pic = AuthenticationService.pic;
        ProgramService.upload($scope);
            globalMenuService.initializeScopeListening($scope, $location, AuthenticationService);
        $scope.save = function save() {
            if (AuthenticationService.UserIsAuthenticated(AuthenticationService)) {
                if($scope.files == undefined || $scope.files == "" || $scope.files.length < 1){
                }else{
                    var fd = new FormData();
                    for (var i in $scope.files) {
                        fd.append("uploadedFile", $scope.files[i]);
                    }
                    var xhr = new XMLHttpRequest();
                    //xhr.upload.addEventListener("progress", uploadProgress, false);
                    xhr.addEventListener("load", function(evt){ location.reload(); }, false);
                    //xhr.addEventListener("error", uploadFailed, false);
                    //xhr.addEventListener("abort", uploadCanceled, false);
                    xhr.open("PUT", "/uploaduserphoto");
                    //scope.progressVisible = true;
                    xhr.send(fd);
                }
            }else{

            }
        }
        }
        var authent = AuthenticationService.UserIsAuthenticated(AuthenticationService);
        if(typeof authent == "boolean" && authent){
            contrFunction();
        }else{
            //it is a promise
            authent.then(function(isAuthent) {
                if(isAuthent){
                    contrFunction();
                }else{
                    $location.path("/login");
                }

            }).catch(function() {
                $location.path("/login");
            });
        }
    }]);