define(['./module'], function (services) {
    'use strict';
    services.factory('authentication', ['api','$location','userModel', function (api, $location, userModel) {
        var fn = function(){
            this.checkLogin = function(callback){
                if(typeof fn.logged == 'undefined' || !fn.logged){
                    api.getCredentials().success(function(data) {
                        fn.logged = true;
                        fn.email = data.username;
                        callback(data.username);
                    }).error(function(status, data) {
                        $location.path("/login");
                    });
                }else{
                    callback(fn.email);
                }
            }
            this.connectedUser = function(callback){
                if(typeof fn.connectedUser != 'undefined' && fn.connectedUser != ''){
                    callback(fn.connectedUser);
                }else{
                    this.checkLogin(function(data){
                        var authModel = new userModel({_id:data});
                        authModel.fetch().done(function(data){
                            fn.connectedUser = authModel;
                            callback(fn.connectedUser);
                        }.bind(this));
                    });
                }
            }
            this.reconnectUser = function(){
                var def = $.Deferred();
                    this.checkLogin(function(data){
                        var authModel = new userModel({_id:data});
                        authModel.fetch().done(function(data){
                            def.resolve();
                            fn.connectedUser = authModel;
                        }.bind(this));
                    });
                return def.promise();
            }
        }
        if(typeof fn.logged == 'undefined' || !fn.logged){
            api.getCredentials().success(function(data) {
                fn.logged = true;
                fn.email = data.username;
            }).error(function(status, data) {
                $location.path("/login");
            });
        }
        return fn;
    }]);
});
