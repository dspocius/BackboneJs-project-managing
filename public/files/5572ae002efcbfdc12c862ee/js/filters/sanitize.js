/*USING:
* {{ 'Current version is v%VERSION%.' | interpolate }} */

define(['./module'], function (filters) {
    'use strict';

    return filters.filter('sanitize', ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    }]);
});
