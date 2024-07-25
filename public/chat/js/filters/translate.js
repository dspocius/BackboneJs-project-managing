/*USING:
* {{ 'Current version is v%VERSION%.' | interpolate }} */

define(['./module'], function (filters) {
    'use strict';

    return filters.filter('translate', ['api',function(api) {
        return function(name){
			//console.log(api);
			//console.log(name);
			var retName = name;
			if(typeof api.translate != 'undefined'){
				retName = api.translate(name);
			}
            return retName;
        };
    }]);
});
