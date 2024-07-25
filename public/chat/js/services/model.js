define(['./module'], function (services) {
    'use strict';
    services.factory('model', ['common','$http',function (common, $http) {
        return function(data){
            var model = {};
            if(typeof data != 'undefined' && data != ''){
                model = data;
            }
            model.save = function(attributes){
                var attributesToSend = model;
                if(typeof attributes != 'undefined'){
                    var index;
                    attributesToSend = {};
                    for(index=0; attributes.length > index; index++){
                        attributesToSend[attributes[index]] = model[attributes[index]];
                    }
                }
                if(typeof model[model.idAttribute] != 'undefined' && model[model.idAttribute] != ''){
                    return model.put(attributesToSend);
                }else{
                    return model.post(attributesToSend);
                }
            }
            model.post = function(attributes){
                var dfd = $.Deferred();
                $http.post(model.url, attributes).success(function(data){
                    dfd.resolve(data);
                }).error(function(status, data) {
                    common.locateToLogin();
                    dfd.reject(status,data);
                });
                return dfd.promise();
            }
            model.put = function(attributes){
                var dfd = $.Deferred();
                 $http.put(model.url, attributes).success(function(data){
                     dfd.resolve(data);
                 }).error(function(status, data) {
                     common.locateToLogin();
                     dfd.reject(status,data);
                 });
                return dfd.promise();
            }
            model.fetch = function(){
                var dfd = $.Deferred();
                $http.get(model.url+'/'+model[model.idAttribute]).success(function(data){
                    var jsonData = '';
                    if(typeof data === 'object'){
                        jsonData = data;
                    }else{
                        var jsonD = JSON.parse(data);
                        jsonData = JSON.parse(jsonD);
                    }
                    for(var propertyName in jsonData) {
                        model[propertyName] = jsonData[propertyName];
                    }
                    dfd.resolve(data);
                }).error(function(status, data) {
                    common.locateToLogin();
                    dfd.reject(status,data);
                });
                return dfd.promise();
            }
            model.delete = function(){

            }
            model.idAttribute = '_id';
            return model;
        };
    }]);
});
