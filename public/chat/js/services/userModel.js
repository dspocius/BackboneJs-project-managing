/* FUNCTIONAL INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('userModel', ['model', 'common', function (model, common) {
        return function(data){
            var that = model(data);
            that.url = '/user';
            return that;
        };
    }]);
});
