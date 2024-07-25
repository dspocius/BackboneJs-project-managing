define(['./module'], function (services) {
    'use strict';
    services.factory('collection', ['common','model',function (common, model) {
        return function(data){
            var collection = {model:model};
            if(typeof data != 'undefined' && data != ''){
                collection = data;
				if(typeof data.model === 'undefined'){
					collection.model = model;
				}
            }
            collection.models = [];
            collection.bindData = function (jsonData, remove_id) {
                var index;
                for (index = 0; index < jsonData.length; ++index) {
                    if(typeof jsonData[index] !='undefined' && (typeof jsonData[index].email === 'undefined' || jsonData[index].email != remove_id)){
                        this.models.push(new collection.model(jsonData[index]));
                    }
                }
            }
            collection.bindDataToBeginning = function (jsonData, remove_id) {
                var index;
                for (index = 0; index < jsonData.length; ++index) {
                    if(typeof jsonData[index].email === 'undefined' || jsonData[index].email != remove_id){
                        this.models.unshift(new collection.model(jsonData[index]));
                    }
                }
            }
            collection.appendNewVal = function(key, val, compareToVal, compareInModelKey, key2, val2){
                for(var i=0; i < this.models.length; i++){
                    if(this.models[i][compareInModelKey] === compareToVal){
                        this.models[i][key] = val;
                        this.models[i][key2] = '';
                    }else{
                        this.models[i][key] = '';
                        this.models[i][key2] = val2;
                    }
                }
            }
            collection.addModel = function (jsonData) {
                this.models.push(new collection.model(jsonData));
            }
            collection.fetch = function () {
                var remove_id = '';
                if(typeof collection.data != 'undefined' && collection.data != ''
                    && typeof collection.data.rem != 'undefined' && collection.data.rem != '' ){
                    remove_id = collection.data.rem;
                }
                var dfd = $.Deferred();
                common.fetchData(this.url,function(data) {
                    var jsonData = data;
					try {
						var fixBadJson = JSON.parse(data);
						jsonData = JSON.parse(fixBadJson);
					}
					catch(err) {}
                    this.bindData(jsonData, remove_id);
                    /*for (index = 0; index < jsonData.length; ++index) {
                        if(jsonData[index].email != remove_id){
                            this.models.push(new collection.model(jsonData[index]));
                        }
                    }*/
                    dfd.resolve(data);
                }.bind(this),function(status,data){
                    dfd.reject(status,data);
                });
                return dfd.promise();
            }
            collection.getModelByProperty = function(property, value){
                var index, i;
                var model = '';
                for (index = 0; index < collection.models.length; ++index) {
                    if(collection.models[index][property] === value){
                        model = collection.models[index];
                    }
                }
                return model;
            }
            collection.unsetRemoved = function(){
                var index;
                for (index = 0; index < this.models.length; ++index) {
                    this.models[index].removedModel = false;
                }
            }
            collection.removeModels = function(modelsRemove){
                var index, j;
                for (index = 0; index < this.models.length; ++index) {
                    for (j = 0; j < modelsRemove.length; ++j) {
                        if(this.models[index]._id === modelsRemove[j]._id){
                            this.models[index].removedModel = true;
                        }
                    }
                }
            }
            collection.setAttribute = function(attr, modelsRemove){
                var index, j;
                for (index = 0; index < this.models.length; ++index) {
                    for (j = 0; j < modelsRemove.length; ++j) {
                        if(this.models[index]._id === modelsRemove[j]._id){
                            this.models[index][attr] = true;
                        }
                    }
                }
            }
            collection.unsetAttributes = function(attr){
                var index;
                for (index = 0; index < this.models.length; ++index) {
                    this.models[index][attr] = false;
                }
            }
            collection.setAttributeByArrayInsideAttrById = function(attr, insideAttr, insideAttrId){
                var index, j;
                for (index = 0; index < this.models.length; ++index) {
					var insideAttrs = this.models[index][insideAttr];
                    for (j = 0; j < insideAttrs.length; ++j) {
                        if(insideAttrs[j]._id === insideAttrId){
                            this.models[index][attr] = insideAttrs[j][attr];
                        }
                    }
                }
			}
            collection.setInnersArraysAttribute = function(attr, attrVal, innerAttr, innerVal, attrinn, val){
                var index, j;
                for (index = 0; index < this.models.length; ++index) {
					var insideAttrs = this.models[index][innerAttr];
					if(this.models[index][attr] === attrVal){
						for (j = 0; j < insideAttrs.length; ++j) {
							if(insideAttrs[j]._id === innerVal){
								insideAttrs[j][attrinn] = val;
							}
						}
					}
                }
			}
            collection.removeByAttribute = function(attr, attrVal){
                var index;
				var newModels = [];
                for (index = 0; index < this.models.length; ++index) {
                    if(this.models[index][attr] !== attrVal){
						newModels.push(this.models[index]);
					}
                }
				this.models = newModels;
            }
            return collection;
        };
    }]);
});
