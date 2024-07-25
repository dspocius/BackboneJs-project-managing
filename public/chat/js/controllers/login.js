define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('login', ['$scope', '$compile', '$location', 'api','viewLogin','authentication',
        function ($scope, $compile, $location, api, viewLogin, authentication) {
            $('#custom_data_text').hide();
			if ($('#menuConvBack')) { $('#menuConvBack').hide(); }
            if (typeof authentication.logged != 'undefined' && authentication.logged) {
                api.getCredentials().success(function(data) {
                    $location.path("/home");
                });
            }else{
                viewLogin.initializeScopeListening($scope);
                $scope.$on('view:login', function(event, obj) {
                    api.login(obj.cUser,obj.cPass).success(function(data) {
						window.authenticationInfo = data;
                        authentication.logged = true;
                        authentication.email = obj.cUser;
						
						if (window.authenticationInfo.pic != "") {
							$(".profileHereGlyph").hide();
							var userHtmlImg = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="/files/'+window.authenticationInfo.username+'/'+window.authenticationInfo.pic+'" alt="" /></div>';
							$(".profileHereWithPhoto").html(userHtmlImg);
							$(".profileHereWithPhoto").show();
						}
                        $location.path("/home");
                    }).error(function(status, data) {
                        authentication.logged = false;
                        authentication.email = '';
                    });
                });
            }
    }]);
});
