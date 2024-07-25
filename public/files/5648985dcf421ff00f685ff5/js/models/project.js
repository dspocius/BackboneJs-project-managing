define([
    'models/base',
    'templates'
], function( base, templates ) {
	'use strict';
	
    return base.extend({
        idAttribute:'_id',
        urlRoot: templates.urlAddr+'/projectt',
        defaults: {
            isProject: false,
            updated: new Date().toJSON().toString(),
            isHeader:false,
            position:0,
            color:"#80BCF0",
            files:'',
            text:'',
			loggedIn: templates.loggedIn
        },
		initialize: function(){
			this.set('loggedIn',templates.loggedIn);
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
