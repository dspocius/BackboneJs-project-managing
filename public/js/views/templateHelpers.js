define([
	'app',
	'../config',
	'../lib/ltlang',
], function( app,config,ltlang) {
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
		escapeHtml: function(unsafe) {
			if(typeof unsafe != "undefined"){
				unsafe = unsafe.toString();
			return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
		 }else{
			 return unsafe;
		 }
		},
			isloggedin: function(){
				if (typeof window.app.userConnected != "undefined" && 
				typeof window.app.userConnected.data2 != "undefined"
				&& typeof window.app.userConnected.data2.email != "undefined" 
				&& window.app.userConnected.data2.email != ""
				&& window.app.userConnected.data2.email != "_") {
					return true;
				}else{
					return false;
				}
			},
			getLoggedInEmail: function(){
				if (typeof window.app.userConnected != "undefined" && typeof window.app.userConnected.data2 != "undefined") {
					return window.app.userConnected.data2.email;
				}else{
					return "";
				}
			},
			addInfoAbout: function(info){
				return window.app.addInfoAbout(info);
			},
			getDefaultVisibility: function(){
				var get_def_visibility = window.app.getSettingInWhole('defaultVisibilityAdded');

				return get_def_visibility;
			},
			getMainImageSrc: function(){
				return config.srclogo;
			},
			getFilesUrl: function(){
				return config.filesurl;
			},
			translate: function(name){
				var retName = name;
				if (config.lang != "") {
					if (config.lang == "lt") {
						var allm = ltlang();
							if (allm[name]) {
								return allm[name];
							} else {
								return name;
							}
					}
				}
				return retName;
			},
			replaceForDate: function(datt){
				return datt.replace(/ /g,"").replace(/:/g,"");
			}
		};
	}
});
