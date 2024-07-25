/* FUNCTIONAL INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('baseCollection', ['collection',function (collection) {
        return function(data){
            var that = collection({data:data});
            that.url = data.FullUrl;
            return that;
        };
    }]);
});
