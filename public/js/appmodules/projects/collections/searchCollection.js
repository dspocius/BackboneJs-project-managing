define([
    'underscore',
    'collections/base',
    'models/search',
    'templates'
], function( _, base, search, templates ) {
    return base.extend({
        model: search,
        url:templates.urlAddr+'/users',
		add: function(model){
			var isDupe = this.any(function(_model) { 
				return _model.get('_id') === model.get('_id');
			});

			// Up to you either return false or throw an exception or silently ignore
			// NOTE: DEFAULT functionality of adding duplicate to collection is to IGNORE and RETURN. Returning false here is unexpected. ALSO, this doesn't support the merge: true flag.
			// Return result of prototype.add to ensure default functionality of .add is maintained. 
			return isDupe ? false : Backbone.Collection.prototype.add.call(this, model);
		},
		 parse: function(response){
			 if (response.constructor === Array) {
				 return response;
			 }
			 
			if (typeof response == "string") {
				return JSON.parse(response);
			}else{
				return [];
			}
		},
			getModelFromCol: function(pid){
				var thisItem = this.get(pid);
				var collectionThat = this;
				if(typeof thisItem == 'undefined'){
					var colsO = this.otherCols;
					for(var ii=0; ii < colsO.length; ii++){
						if(typeof colsO[ii].get(pid) != 'undefined'){
							thisItem = colsO[ii].get(pid);
							collectionThat = colsO[ii];
						}
					}
				}
				return {thisItem:thisItem, collectionThat:collectionThat};
			},
			removeModelFromCol: function(pid){
				this.remove(pid);
				if(typeof thisItem == 'undefined'){
					var colsO = this.otherCols;
					for(var ii=0; ii < colsO.length; ii++){
						if(typeof colsO[ii].get(pid.get("_id")) != 'undefined'){
							colsO[ii].remove(pid);
						}
					}
				}
			}
    });
});
