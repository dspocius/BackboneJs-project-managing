define(['./module'], function (services) {
    'use strict';
    services.factory('socketService', ['$rootScope','authentication',function ($rootScope,authentication) {
        var socket = io.connect();
        var auth = new authentication();
        auth.checkLogin(function(data){
            socket.emit('clientconnected', {id:data});
        });
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },
            sendUpdate: function(model, obj){
                if(typeof model.email != 'undefined' && model.email != ''){
                    this.emit('updateFriends',{obj:obj, to:model.socketID,toEmail:model.email});
                }
            },
            sendUpdateToMyself: function(obj){
                if(typeof authentication.connectedUser.email != 'undefined' && authentication.connectedUser.email != ''){
                    this.emit('updateFriends',{obj:obj, to:authentication.connectedUser.socketID,toEmail:authentication.connectedUser.email});
                }
            }
        };
    }]);
});
