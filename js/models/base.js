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
        save: function(options){
            var saved = Backbone.Model.prototype.save.apply(this, arguments);
            saved.always(function(){
                var id = '';
                if(typeof options != 'undefined'&& typeof options.idd != 'undefined' && options.idd != ''){
                    id = options.idd;
                }
                window.app.vent.trigger('update:cachedCollection:resource', this, id);
            }.bind(this)).fail(function(data,status){
                if(data.status != 200){
                    Backbone.history.navigate('#page/first',{ trigger:true, replace: true });
                }
            });
            return saved;
        }
    });
});
