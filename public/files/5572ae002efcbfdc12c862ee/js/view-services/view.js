define(['./module'], function (services) {
    'use strict';
    services.factory('view', ['common', 'viewRow','$compile', function (common, viewRow, $compile) {
        return function(data, scope, grid, childObj){
            this.render = function(){
                var index;
                $(grid).html('');
                var firstView = '';
                var addToHtmLChildM = '';
                if(typeof this.addHtmlToChild != 'undefined'){
                    addToHtmLChildM = this.addHtmlToChild;
                }
                var noentries = '';
                if(typeof this.noentries != 'undefined'){
                    noentries = this.noentries;
                }
                if(typeof this.rowview != 'undefined' && this.rowview != '' && this.rowview != null){
                    for (index = 0; index < this.collection.models.length; ++index) {
                        var childModel = {model: this.collection.models[index]};
                        if(typeof this.addHtmlToChild != 'undefined'){
                            childModel = {model: this.collection.models[index], addHtml: this.addHtmlToChild};
                        }
                        var view = new this.rowview(childModel, scope, grid);
                        view.renderForCycle();
                        if(index == 0){
                            firstView = view;
                        }
                    }
                }
                /*for (index = 0; index < this.collection.models.length; ++index) {
                    var childModel = {model: this.collection.models[index]};
                    if(typeof this.addHtmlToChild != 'undefined'){
                        childModel = {model: this.collection.models[index], addHtml: this.addHtmlToChild};
                    }
                    var view = new this.rowview(childModel, scope, grid);
                    view.render();
                    if(index == 0){
                        firstView = view;
                    }addHtml
                }*/
                var replc = grid.replace(/#/g,'').replace(/ /g,'');
                var mypScope = 'p'+replc;
                scope[mypScope] = this.collection;
				if(noentries == ''){
					var htmlIn = childObj.viewTemplate(mypScope, addToHtmLChildM);
				}else{
					var htmlIn = childObj.viewTemplate(mypScope, addToHtmLChildM, noentries);
				}

                $(grid).html(
                    $compile(
                        htmlIn
                    )(scope)
                );
                if(this.collection.models.length > 0){
                    var myInterval = setInterval(function(){
                        if(firstView === '' || ($('#'+firstView.model[firstView.property]).length)){
                            common.trigger(childObj.name+':render');
                            clearInterval(myInterval);
                        }
                    }.bind(this), 1);
                }
            }
            this.collection = {};
            this.rowview = viewRow;
            this.grid = grid;
            if(typeof data != 'undefined' && data != ''){
                this.rowview = data.rowview;
                this.collection = data.collection;
                if(typeof data.addHtmlToChild != 'undefined' && data.addHtmlToChild != ''){
                    this.addHtmlToChild = data.addHtmlToChild;
                }
                if(typeof data.noentries != 'undefined' && data.noentries != ''){
                    this.noentries = data.noentries;
                }
                this.collection = data.collection;
                if(common.isPromise(data.collection)){
                    data.collection.done(function(data){
                        this.render();
                    }.bind(this));
                }else{
                    this.render();
                }
            }

        };
    }]);
});
