define(['./module'], function (services) {
    'use strict';
    services.factory('viewRow', ['common','$compile', function (common, $compile) {
        return function(data, scope, parent){
            this.model = {};
            this.el = 'div';
            this.property = '_id';
            this.parent = parent;
            if(typeof data != 'undefined' && data != ''){
                this.model = data.model;
                if(typeof data.el != 'undefined' && data.el != ''){
                    this.el = data.el;
                }
                if(typeof data.addHtml != 'undefined' && data.addHtml != ''){
                    this.addHtml = data.addHtml;
                }
                if(typeof data.property != 'undefined' && data.property != ''){
                    this.property = data.property;
                }
            }
            this.model.get = function(propertyName){
                if(typeof this[propertyName] != 'undefined'){
                    return this[propertyName];
                }else{
                    return '';
                }
            }
            this.remove = function(){
                $("#"+this.model[this.property]).remove();
            }
            this.render = function(){
                $(this.parent).append('Not added render function in child');
            }
            this.renderHtml = function(html, model, elem){
                var el_more = '';
                if(typeof elem != 'undefined' && elem != ''){
                    el_more = elem;
                }
                scope['p'+model[this.property]] = model;
                if(!$('#'+model[this.property]).length){
                    $(this.parent).append(
                        $compile(
                            '<'+this.el+' '+el_more+' id="{{p'+model[this.property]+'.'+this.property+'}}">'+html+'</'+this.el+'>'
                        )(scope)
                    );
                }
            }
            this.renderHtmlInParent = function(html, model, parent, elem, ell){
                var el_more = '';
                var el = this.el;
                if(typeof elem != 'undefined' && elem != ''){
                    el_more = elem;
                }
                if(typeof el != 'undefined' && el != ''){
                    el = ell;
                }
                scope['p'+model[this.property]] = model;
                if(!$('#'+model[this.property]).length){
                    $(parent).append(
                        $compile(
                            '<'+el+' '+el_more+' id="{{p'+model[this.property]+'.'+this.property+'}}">'+html+'</'+this.el+'>'
                        )(scope)
                    );
                }
            }
        };
    }]);
});
