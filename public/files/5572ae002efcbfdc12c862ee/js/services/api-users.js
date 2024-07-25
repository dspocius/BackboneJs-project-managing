define(['./module'], function (services) {
    'use strict';
    services.factory('api', ['$http', function ($http) {
        return {
            login: function(email, password) {
                return $http.post('/login', {email: email, password: password});
            },
            getCredentials: function () {
                return $http.get('/checkifuserloggedin');
            },
            getSettings: function () {
                return $http.get('/commentsU/projectsManagement/'+0+'/true');
            },
            getNotifications: function () {
                return $http.get('/commentsU/notificationsForUser/'+0+'/true');
            },
            setNotification: function (email, emailFrom, message, files) {
                return $http.post('/commentAddByUser',{id:'notificationsForUser'+email, message:{from:emailFrom, message: message,files:files}});
            },
            deleteNotification: function (email,emUser) {
                return $http.post('/commentAddByUser',{id:'notificationsForUser'+email, rFrom:emUser});
            },
            getUsers: function () {
                return $http.get('/users');
            },
            logout: function() {
                return $http.delete('/logout');
            },
            setFriends: function(friends){
                return $http.put('/user/update',{friends:friends});
            }
        };
    }]);
});
