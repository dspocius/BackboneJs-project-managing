var app = angular.module('app', ['ngRoute', 'appControllers', 'appServices']);


app.config(['$locationProvider', '$routeProvider', 
	function($location, $routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/firstpage.html', 
				controller: 'FirstPageCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/account', {
				templateUrl: 'partials/account.html',
				controller: 'AccountCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/programs', { 
				templateUrl: 'partials/allprograms.html', 
				controller: 'ProgramsPageCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/myprograms', { 
				templateUrl: 'partials/main.html', 
				controller: 'IndexCtrl',
				access: { requiredAuthentication: true }
			}).
	        when('/create/program', {
	            templateUrl: 'partials/create.program.html',
	            controller: 'ProgramCreateCtrl',
	            access: { requiredAuthentication: true }
	        }).
		when('/program/:id', {
	            templateUrl: 'partials/program.html',
	            controller: 'ProgramCtrl',
	            access: { requiredAuthentication: true }
	        }).
		when('/program/edit/:id', {
	            templateUrl: 'partials/program.edit.html',
	            controller: 'ProgramEditCtrl',
	            access: { requiredAuthentication: true }
	        }).
		when('/program/:id/edit/:file', {
	            templateUrl: 'partials/program.file.edit.html',
	            controller: 'ProgramFileEditCtrl',
	            access: { requiredAuthentication: true }
	        }).
	        when('/route/create', {
	            templateUrl: 'partials/route.create.html',
	            controller: 'RouteCreateCtrl',
	            access: { requiredAuthentication: true }
	        }).	        
			when('/route/edit/:id', {
	            templateUrl: 'partials/route.edit.html',
	            controller: 'RouteUpdateCtrl',
	            access: { requiredAuthentication: true }
	        }).
			when('/route/googlemap/:id', {
	            templateUrl: 'partials/google.route.html',
	            controller: 'GoogleMapRouteCtrl',
	            access: { requiredAuthentication: true }
	        }).
			when('/login', { 
				templateUrl: 'partials/login.html', 
				controller: 'UserCtrl' 
			}).
			when('/register', { 
				templateUrl: 'partials/register.html', 
				controller: 'UserCtrl' 
			}).
			otherwise({
			redirectTo: '/'
			});
}]);
/*app.config(function ($httpProvider) {
//    $httpProvider.interceptors.push('TokenInterceptor');
//});


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}*/
