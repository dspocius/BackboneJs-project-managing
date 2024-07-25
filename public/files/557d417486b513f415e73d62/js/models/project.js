define([
    'models/base',
    'templates'
], function( base, templates ) {
	'use strict';
	
    return base.extend({
        idAttribute:'_id',
        urlRoot: templates.urlAddr+'/project',
        defaults: {
            isProject: false,
            updated: new Date().toJSON().toString(),
            isHeader:false,
            position:0,
            color:"#80BCF0",
            colorLighter:"#80BCF0",
            files:'',
            text:'',
            parentvisibility:'private',
			friendsThere:'',
			tasks:[]
        },
		getVisibilityOfTheProject: function(app){
			var thisProj = this;
			var canView = false;
			var visibilityOfIt = thisProj.get("visibility");
			if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
									var friendsInThatProj = thisProj.get("friends");
									if(typeof friendsInThatProj != "undefined"){
										for(var ii=0; ii < friendsInThatProj.length; ii++){
											if(typeof friendsInThatProj[ii] != "undefined" && friendsInThatProj[ii] != "" && typeof friendsInThatProj[ii]._id != "undefined" && friendsInThatProj[ii]._id != ""){
												if(typeof app.userData == "undefined" || app.userData._id == friendsInThatProj[ii]._id){
													canView = true;
												}
											}
										}
									}
									if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
										canView = true;
										visibilityOfIt = "editpublic";
									}
			}
							return {visibilityOfIt:visibilityOfIt, canView:canView};
		},
        addToFriends: function(friendID){
            var th_fmodels = this.get('friends');
            var newModell = this.get('friends');
            var addThem = true;
            for(var i=0; i < th_fmodels.length; i++){
                if(th_fmodels[i]._id === friendID){
                    addThem = false;
                }
            }
            if(addThem){
                newModell.push({_id:friendID});
            }
        },
        removeFromFriends: function(friendID){
            var th_fmodels = this.get('friends');
            var newModell = [];
            for(var i=0; i < th_fmodels.length; i++){
                var addThem = true;
                if(th_fmodels[i]._id === friendID){
                    addThem = false;
                }
                if(addThem){
                    newModell.push(th_fmodels[i]);
                }
            }
            this.set('friends', newModell);
        }
    });
});
