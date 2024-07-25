/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
    'use strict';
    app.run(function($location, $rootScope, $route, authentication, api) {
        $rootScope.$on('$viewContentLoaded', function(evt, next, current) {
			
			if(typeof window.LoadedSettingsData != 'undefined'){
				if(window.notInThere){
					window.notInThere = false;
					setStyles(window.LoadedSettingsData);
				}
			}else{
				api.getSettings().success(function(data) {
					window.LoadedSettingsData = data;
					api.translate = function(name){
						var lang = languageRussian();
						if(typeof lang[name] != 'undefined' && lang[name] != ''){
							name = lang[name];
						}
						return name;
					};
					window.notInThere = false;
					setStyles(data);
				});
			}
		function setStyles(data){
				var websiteStyle = getSetting(data, 'websiteStyle');
					var backgroundPicture = getSetting(data, 'backgroundPicture');
					var outerIconsColor = getSetting(data, 'outerIconsColor');
					var innerIconsColor = getSetting(data, 'innerIconsColor');
					var borderRadius = getSetting(data, 'borderRadius');
					var borderRadius = getSetting(data, 'borderRadius');
					if(websiteStyle === 'Default'){
						$('link[id="looking_style"]').attr('href','/stylesheets/projects/wide.css');
					}
				if(borderRadius != '' && backgroundPicture != ''){
					var styleHtml = 'html{ background-image: url(/files/project_managing_files/ProjectManagementFiles/'+backgroundPicture+'); }';
					styleHtml += '.nav>li{ color:'+innerIconsColor+'!important; background:'+outerIconsColor+'; border-radius:'+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.miniChatmessagesNewUsers{ border-radius: '+parseInt(borderRadius)+'px; color:'+innerIconsColor+'; background-color:'+outerIconsColor+'; }';
					styleHtml += '.nav>li a{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li button{ color:'+innerIconsColor+'!important; }';
					styleHtml += '#left-menu .nav>li{ border-radius: '+parseInt(borderRadius)+'px;'+' }';
					styleHtml += '.userChoose{ border-bottom: 1px solid '+innerIconsColor+'!important;  color:'+innerIconsColor+'!important; background-color:'+outerIconsColor+'; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.userChoose:hover{ border-bottom: 1px solid '+outerIconsColor+'!important; color:'+outerIconsColor+'!important; background-color:'+innerIconsColor+'!important; }';
					styleHtml += '.selectedUser{ border-bottom: 1px solid '+outerIconsColor+'!important; color:'+outerIconsColor+'!important; background-color:'+innerIconsColor+'!important; }';
					styleHtml += '.sendButton{ color:'+innerIconsColor+'; background-color: '+outerIconsColor+'; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.search_textarea{ color:'+innerIconsColor+'!important; background-color: '+outerIconsColor+'!important; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.textareaforuser{ color:'+innerIconsColor+'!important; background-color: '+outerIconsColor+'!important; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.message_text_left{ background-color:'+outerIconsColor+'!important; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.myMessageInChat .message_text_left{ background-color:'+innerIconsColor+'!important; }';
					styleHtml += '#valueSearch{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.menuItemSelected{ color:'+outerIconsColor+'!important; background-color: '+innerIconsColor+'!important; } .menuItem, .menuItemLast{ color:'+innerIconsColor+'; background-color: '+outerIconsColor+'; }';
					if(websiteStyle !== 'Default'){
						styleHtml += '.footer, .header { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
						styleHtml += '#left-menu .nav>li { border-bottom:1px solid '+innerIconsColor+'!important; }';
						styleHtml += '#left-menu { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; border-right:1px solid '+innerIconsColor+'!important; }';
					styleHtml += '.bottomsendmsg{ background:none!important; border: 1px solid '+innerIconsColor+'!important;  }';
					styleHtml += '.usersLeftMenu{ background:none!important; border-bottom: 1px solid '+innerIconsColor+'!important;  }';
						styleHtml += '.containerMessages{ border-left: 1px solid '+outerIconsColor+'!important;  }';
					}else{
					styleHtml += '.usersLeftMenu{ background:none!important;   }';
					styleHtml += '.bottomsendmsg{ background:none!important;  }';
					}
					styleHtml += '.fc-state-hover, .fc-state-active, .fc-button:hover { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.menuItem:hover, .menuItemLast:hover, .sendButton:hover { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.custom_data_in_container, .viewButtonsIn:hover { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.text_groups_there{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover, .nav>li.active { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.nav>li.active a { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover a { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover button { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.allmessages{ border-bottom: 91px solid rgba(0,0,0,0.0)!important;  }';
					styleHtml += '.search_textarea { border: none!important; outline: none!important;  }';
					styleHtml += '#peopleV { background: none!important; border: none!important; outline: none!important;  }';
					$('#manual_style').html(styleHtml);
				}
		}
		function getSetting(model, value){
			var arrays = model.messages;
			var confValue = '';
			for(var i=0; i < arrays.length; i++){
				if(arrays[i].from === value){
					confValue = arrays[i].message;
				}
			}
			return confValue;
		}
		});
        $rootScope.$on('$locationChangeStart', function(evt, next, current) {
		
            var nextPath = $location.path(),
                nextRoute = $route.routes[nextPath];
            if (nextRoute && nextRoute.auth && (typeof authentication.logged == 'undefined' || !authentication.logged)) {
          
			if(typeof window.LoadedSettingsData != 'undefined'){
				/*setStyles(window.LoadedSettingsData);*/
			}else{
				api.getSettings().success(function(data) {
					window.LoadedSettingsData = data;
					window.notInThere = true;
					api.translate = function(name){
						var lang = languageRussian();
						if(typeof lang[name] != 'undefined' && lang[name] != ''){
							name = lang[name];
						}
						return name;
					};
				});
			}
		  
				api.getCredentials().success(function(data) {
                    authentication.logged = true;
                    authentication.email = data.username;
                }).error(function(status, data) {
                    $location.path("/login");
                });
            }
        });
    });
    return app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'login'
        });

        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'Home',
            auth: true
        });

        $routeProvider.when('/people', {
            templateUrl: 'partials/people.html',
            controller: 'People',
            auth: true
        });
		
        $routeProvider.when('/channels', {
            templateUrl: 'partials/channel.html',
            controller: 'Channel',
            auth: true
        });
		
        $routeProvider.when('/logout', {
            templateUrl: 'partials/login.html',
            controller: 'Logout',
            auth: true
        });
        $routeProvider.when('/check', {
            templateUrl: 'partials/loading.html',
            controller: 'Check'
        });
        $routeProvider.otherwise({
            redirectTo: '/check'
        });
    }]);
});
