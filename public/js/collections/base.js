/* Cache collection */

define([
    'backbone',
    'app'
], function (Backbone, app) {
    'use strict';

    var base = Backbone.Collection.extend({
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
                app.vent.trigger('add:cachedCollection:resource', this);
            }
            // If it failed - maybe due fact that authorization failed - then navigate to home for checking
            this.lastFetchDeferred.fail(function(){
                Backbone.history.navigate('#page/first',{ trigger:true, replace: true });
            });

            // return the promise object in the cache
            return this.lastFetchDeferred;
        }
    });
    return base;
});
