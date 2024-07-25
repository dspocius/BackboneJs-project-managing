define([
	'app'
], function( app ) {
	'use strict';
    return function(){
		return {
			getWeekNumber: function(){
				var target = new Date(),
					dayNumber = (target.getUTCDay() + 6) % 7,
					firstThursday;

				target.setUTCDate(target.getUTCDate() - dayNumber + 3);
				firstThursday = target.valueOf();
				target.setUTCMonth(0, 1);

				if (target.getUTCDay() !== 4) {
					target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
				}

				return Math.ceil((firstThursday - target) /  (7 * 24 * 3600 * 1000)) + 1;
			},
			translate: function(name){
				var retName = name;
				if(typeof window.app != 'undefined'){
					retName = window.app.translate(name);
				}
				return retName;
			},
			replaceForDate: function(datt){
				return datt.replace(/ /g,"").replace(/:/g,"");
			}
		};
	}
});
