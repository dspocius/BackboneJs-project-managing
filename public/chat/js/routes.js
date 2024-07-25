/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
    'use strict';
    app.run(['$location', '$rootScope', '$route', 'authentication', 'api', function($location, $rootScope, $route, authentication, api) {
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
					var use_defined_style = getSetting(data, 'use_defined_style');
					var textbackgroundcolor = getSetting(data, 'textbackgroundcolor');
					//if(websiteStyle === 'Default'){
					//	$('link[id="looking_style"]').attr('href','/stylesheets/projects/wide.css');
					//}
				if(borderRadius != '' && use_defined_style != ''){
					var styleHtml = "";
					if(backgroundPicture != ""){
						styleHtml = 'html{ background-color:'+outerIconsColor+'!important;  background-image: url(/files/project_managing_files/ProjectManagementFiles/'+backgroundPicture+'); }';
					}
					styleHtml += '.bottomsendmsg,#custom_data_text,.chatWindowView,.innerIconsColorBackground, .users_settings_info, .left_side_of_modal,.right_side_of_modal{ background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.list_view_all_projects_default, .containerOfNewAdd, .list_all_view_of_project .project_one, #suggestions, .projects_one_in_header, .projects_one_in_header li, #calendar{ box-shadow: none!important; background: '+outerIconsColor+'!important; border: none!important; }';
					styleHtml += '.innerIconsColorBackground{ background-color:'+outerIconsColor+'!important; }';
					styleHtml += '.innerIconsColorColor{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.outerIconsColorBackground{ background-color:'+outerIconsColor+'!important; }';
					styleHtml += '.outerIconsColorColor{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.innerIconsColorBackground{ background-color:'+outerIconsColor+'!important; }';
					styleHtml += '.innerIconsColorColor{ color:'+innerIconsColor+'!important; }';
					
					styleHtml += '.allmessages,.rightInfoContainer,.innerUsersLeftMenu{ background:none; }';
					styleHtml += '.projects_one_in_header{ border:none; }';
					styleHtml += '#suggestions{ right: 39px; }';
					styleHtml += '.menutoppositioning a, .menutoppositioning button, .menutoppositioning #menitem{ background:none!important; outline:none!important; border-bottom:2px solid '+innerIconsColor+'!important; }';
					styleHtml += '.menutoppositioning #menitem{     top: 4px!important; }';
					styleHtml += '.menutoppositioning a:hover, .menutoppositioning button:hover, .menutoppositioning #menitem:hover{ outline:none!important; border-bottom:2px solid '+innerIconsColor+'!important; }';
					styleHtml += '#suggestions .searchOne{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; }';
					styleHtml += '#suggestions .searchOne:hover{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; }';
					styleHtml += '.project_one button, .projects_one_in_header a, .commentInModal button, .commentInModal a{ outline:none!important; border-radius:0px!important; box-shadow:none!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.project_one button:hover, .projects_one_in_header a:hover, .commentInModal button:hover, .commentInModal a:hover{ outline:none!important; border-radius:0px!important; box-shadow:none!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.selectedUrlHref, .modalTextareaMine, select, input, textarea{ outline:none!important; border-radius:0px!important; border-bottom:1px solid '+innerIconsColor+'!important; box-shadow:none!important; outline:none!important; background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.selectedUrlHref:hover, .modalTextareaMine:hover, select:hover, input:hover, textarea:hover{ border-bottom:1px solid '+innerIconsColor+'!important; outline:none!important; box-shadow:none!important; outline:none!important; background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.general_button{ background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.right_model_menu{ background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.commentInModal{ background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.buttonChange{ background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.confirmModalButton{ background:none!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.background_default{ background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.tableOfPrice tr:hover{ background:'+outerIconsColor+'; }';
					styleHtml += '.selectedRowOfFormsDataTable{ background:'+outerIconsColor+'; }';
					styleHtml += '.standart_show_forms_background, .searchContainer{ background:'+outerIconsColor+'; }';
					styleHtml += '.statistical_view_grid{ color:'+innerIconsColor+'; }';
					styleHtml += '.generalbutton{ color:'+innerIconsColor+'; background:'+outerIconsColor+'; border:1px solid '+innerIconsColor+'!important; }';
					styleHtml += '.generalbutton:hover{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:1px solid '+innerIconsColor+'!important; }';
					styleHtml += '.meniu_of_whole a{ color:'+innerIconsColor+'!important; background:'+outerIconsColor+'!important; border:1px solid '+innerIconsColor+'!important; }';
					styleHtml += '.meniu_of_whole a, .meniu_of_whole button{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border-bottom:2px solid '+innerIconsColor+'!important; }';
					styleHtml += '.meniu_of_whole a:hover, .meniu_of_whole button:hover{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border-bottom:2px solid '+innerIconsColor+'!important; }';
					
					styleHtml += '.nav>li{ color:'+innerIconsColor+'!important;  }';
					styleHtml += '.miniChatmessagesNewUsers{ border-radius: '+parseInt(borderRadius)+'px; color:'+innerIconsColor+'; background-color:'+innerIconsColor+'; }';
					styleHtml += '.projects_one_in_header, .projects_one_in_header a{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.catalogViewAll .project_text_back_main{ color:'+innerIconsColor+'!important; background:'+outerIconsColor+'!important; }';
					styleHtml += '.project_text_back_main, .users_user_glyph_on_top_front_page, .project_one, .whitebackground, .containerOfNewAdd textarea{ background: '+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.showMoreInfoOnPost button{ background:none!important; color:'+innerIconsColor+'!important; box-shadow: none!important; border:none!important; }';
					styleHtml += '.project_one button{ background: '+outerIconsColor+'!important; color:'+innerIconsColor+'!important; box-shadow: none!important; border:none!important; }';
					styleHtml += '.articles_only_view .show_only_for_article, .project_one{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.project_one .glyphicon, .project_one .glyphicon:hover{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.catalogViewAll .project_one_buttons { background: none!important; color:'+innerIconsColor+'!important; }';

					styleHtml += '.headercoloradded{ box-shadow: 0px 2px 4px '+outerIconsColor+'!important; background: '+outerIconsColor+'!important; border: none!important; }';
					styleHtml += '.menutoppositioning a, .menutoppositioning .glyphicon, .meniu_of_whole .glyphicon, .meniu_of_whole button, .big_icon_glyph_lik_text, .menutoppositioning #menitem, .projects_one_in_header a{  color: '+innerIconsColor+'!important; }';
					
					styleHtml += '.header_top_logo_about{ color:'+innerIconsColor+'!important; border-bottom: 2px solid '+innerIconsColor+'!important; }';
					styleHtml += '.header_top_logo_about{ color:'+innerIconsColor+'!important; border-bottom: 2px solid '+innerIconsColor+'!important; }';
					styleHtml += '.project_entry_one .glyphicon .project_entry_one .glyphicon:hover{ color:'+innerIconsColor+'!important; border: none!important; }';
					styleHtml += '.glyph_plus_with_text, .create_project label{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li a{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li button{ color:'+innerIconsColor+'!important; }';
					styleHtml += '#left-menu .nav>li{ border-radius: '+parseInt(borderRadius)+'px;'+' }';
					styleHtml += '.userChoose{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.sendButton{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.textareaforuser{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.message_text_left{ background-color:'+innerIconsColor+'; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.myMessageInChat .message_text_left{ background-color:'+innerIconsColor+'; }';
					styleHtml += '#valueSearch{ border:1px solid '+innerIconsColor+'!important; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.search_textarea{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.fc-event { color:'+innerIconsColor+';background:'+outerIconsColor+'!important; border:1px solid '+innerIconsColor+'!important; outline:none; }';
					styleHtml += '.fc-button { color:'+innerIconsColor+';background:'+outerIconsColor+'!important; }';
					styleHtml += '.fc-state-active { background:'+outerIconsColor+'!important;color:'+innerIconsColor+'!important; }';
					styleHtml += '.viewButtonsIn, .visibility_perm_desc { background:'+outerIconsColor+'!important;color:'+innerIconsColor+'!important; }';
					styleHtml += '.visibility_perm_descSelected { color:'+innerIconsColor+'!important; background:'+outerIconsColor+'!important; }';
					styleHtml += '.viewButtonsInSelected, .viewButtonsIn:hover, .visibility_perm_desc:hover { color:'+innerIconsColor+'!important; background:'+outerIconsColor+'!important; }';
					//if(websiteStyle !== 'Default'){
					//	styleHtml += '.footer, .header { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					//	styleHtml += '#left-menu .nav>li { border-bottom:1px solid '+innerIconsColor+'!important; }';
					//	styleHtml += '#left-menu { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border-right:1px solid '+innerIconsColor+'!important; }';
					//}
					styleHtml += '#friendsView { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '#showNotifications {  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '.userChoose, .miniChatButtons, #left-menu .nav>li>button, #left-menu .nav li a { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '.userChoose:hover, .miniChatButtons:hover, #left-menu .nav>li>button:hover, #left-menu .nav li a:hover { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '#showNotifications:hover {  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '.userChoose:last-child { border:none!important; }';

					styleHtml += '.fc-state-hover, .fc-state-active, .fc-button:hover { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; }';
					styleHtml += '.viewButtonsIn:hover, .projectsSelected { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; }';
					styleHtml += '.viewButtonsIn { border:1px solid '+innerIconsColor+'!important;  }';
					styleHtml += '.nav>li:hover, .nav>li.active, .glyph_plus_with_text:hover {  color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li.active a { color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover a { color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover button { color:'+innerIconsColor+'!important; }';
					styleHtml += '#navigation_main a {   color:'+innerIconsColor+'!important; }';
					styleHtml += '#navigation_main a:hover {  color:'+innerIconsColor+'!important; }';
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
				if ($('#menuConvBack')) { $('#menuConvBack').hide(); }
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
					window.authenticationInfo = data;
					
					if (window.authenticationInfo.pic != "") {
						$(".profileHereGlyph").hide();
						var userHtmlImg = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="/files/'+window.authenticationInfo.username+'/'+window.authenticationInfo.pic+'" alt="" /></div>';
						$(".profileHereWithPhoto").html(userHtmlImg);
						$(".profileHereWithPhoto").show();
					}
                }).error(function(status, data) {
                    $location.path("/login");
                });
            }
        });
    }]);
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
		$routeProvider.when('/p/:pid', {
            templateUrl: 'partials/home.html',
            controller: 'Home',
            auth: true
        });
		$routeProvider.when('/ch/:chn', {
            templateUrl: 'partials/home.html',
            controller: 'Home',
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
