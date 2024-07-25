/* Caching at models level */
define([
    'backbone',
    'app'
], function( Backbone, app ) {
    return Backbone.Model.extend({
        fetch: function(options) {
            var forceRefetch = options && options.forceRefetch;
            var FETCH_CACHE_TIMEOUT = 300000;
            // set a flag to bust the cache if we have ever set it
            // before, and it's been more than 300 seconds
            var bustCache = !(this.lastFetched && new Date() - this.lastFetched < FETCH_CACHE_TIMEOUT);

            // if we've never cached the call to `fetch`, or if we're busting
            // the cache, make a note of the current time, hit the server, and
            // set the cache to this.lastFetchDeferred.
            if (!this.lastFetchDeferred || bustCache || forceRefetch) {
                this.lastFetched = new Date();
                this.lastFetchDeferred = Backbone.Model.prototype.fetch.apply(this, arguments);
            }
            // If it failed - maybe due fact that authorization failed - then navigate to home for checking
            this.lastFetchDeferred.fail(function(){
                Backbone.history.navigate('#page/first',{ trigger:true, replace: true });
            });
            // return the promise object in the cache
            return this.lastFetchDeferred;
        },
        destroy: function(options){
            var destroy = Backbone.Model.prototype.destroy.apply(this, arguments);
            destroy.always(function(){
                var id = '';
                if(typeof options != 'undefined'&& options != null && typeof options.idd != 'undefined' && options.idd != ''){
                    id = options.idd;
                }
                var th_mod= this;
                for(var ii=0; ii < window.app.userConnected.data2.friends.length; ii++){
					if(th_mod.canSendSocketUpdateTo(window.app.userConnected.data2.friends[ii]._id)){
						window.app.socketService.emit('updateProjectsModel', {toEmail:window.app.userConnected.data2.friends[ii].email, obj:{modthis: th_mod, idd:id, removethis:true}});
					}
                }
                window.app.vent.trigger('update:cachedCollection:resource', this, id);
				window.app.socketService.emit('updateProjectsModel', {toEmail:window.app.userConnected.data2.email, obj:{modthis: th_mod, idd:id, removethis:true}});
            }.bind(this)).fail(function(data,status){
                if(data.status != 200){
                    Backbone.history.navigate('#page/first',{ trigger:true, replace: true });
                }
            });
            return destroy;
		},
		canSendSocketUpdateTo: function(friends_id){
			var thisProj = this;
			var canView = false;
			var visibilityOfIt = thisProj.get("visibility");
			var friendsInThatProj = thisProj.get("friends");
			if(typeof friendsInThatProj != "undefined" && friendsInThatProj != ""){
				for(var ii=0; ii < friendsInThatProj.length; ii++){
						if(typeof friendsInThatProj[ii] != "undefined" && friendsInThatProj[ii] != "" && typeof friendsInThatProj[ii]._id != "undefined" && friendsInThatProj[ii]._id != ""){
							if(friends_id == friendsInThatProj[ii]._id){
								canView = true;
							}
						}
				}
			}
			if(visibilityOfIt == "editcommentfriends" || visibilityOfIt == "friends" || visibilityOfIt == "editfriends" || visibilityOfIt == "editcommentpublic" || visibilityOfIt == "editpublic" || visibilityOfIt == "public" || canView){
				return true;
			}else{
				return false;
			}
		},
        save: function(options){
			this.set("firstlastname",window.app.userConnected.data2.firstname+" "+window.app.userConnected.data2.lastname);
			
            var saved = Backbone.Model.prototype.save.apply(this, arguments);
            saved.always(function(){
                var id = '';
                if(typeof options != 'undefined' && options != null && typeof options.idd != 'undefined' && options.idd != ''){
                    id = options.idd;
                }
                var th_mod= this;
                for(var ii=0; ii < window.app.userConnected.data2.friends.length; ii++){
					if(th_mod.canSendSocketUpdateTo(window.app.userConnected.data2.friends[ii]._id)){
						window.app.socketService.emit('updateProjectsModel', {toEmail:window.app.userConnected.data2.friends[ii].email, obj:{modthis: th_mod, idd:id}});
					}
                }
				window.app.vent.trigger('update:cachedCollection:resource', this, id);
				window.app.socketService.emit('updateProjectsModel', {toEmail:window.app.userConnected.data2.email, obj:{modthis: th_mod, idd:id}});
            }.bind(this)).fail(function(data,status){
                if(data.status != 200){
                    Backbone.history.navigate('#page/first',{ trigger:true, replace: true });
                }
            });
            return saved;
        },
		getParameterByName: function(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		}
    });
});
