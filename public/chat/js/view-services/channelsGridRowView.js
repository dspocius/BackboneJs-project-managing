/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('channelsGridRow', ['common', 'viewRow', '$location',function (common, viewRow, $location) {
        return function(data, scope, parent){
            var viewUsersGrid = function(){
                this.setChosen = function(){
											console.log("AS",this._id);

					if ($(window).width() > 770 || location.href.indexOf("/ch") > -1) {
						common.trigger('channel:change',this);
					} else {
						$location.url('/ch/'+this._id);
					}
                }
                this.setInFriendsList = function(){
                    $("#"+this._id+" .user-add").removeClass('glyphicon-plus');
                    /*$("#"+this._id+" .user-add").addClass('glyphicon-minus');*/
                }
                this.setConnected = function(socketID){
                    this.socketID = socketID;
                    this.isConnected = true;
                    $("#"+this._id+" .connected").html('<span class="glyphonline glyphicon glyphicon-ok-sign"></span>');
                }
                this.removeConnected = function(){
                    this.socketID = '';
                    this.isConnected = false;
                    $("#"+this._id+" .connected").html('');
                }
                this.setBindingsToModel = function(){
                    this.model.isChosed = false;
                    this.model.socketID = '';
                    this.model.isConnected = false;
                    this.model.removeConnected = this.removeConnected;
                    this.model.setConnected = this.setConnected;
                    this.model.setChosen = this.setChosen;
                    this.model.setInFriendsList = this.setInFriendsList;
                }
                this.render = function(){
                    this.setBindingsToModel();
                    var addHtml = '';
                    if(typeof this.addHtml != 'undefined'){
                        addHtml = this.addHtml.replace(/{_id}/g,this.model._id);
                    }
                    var imgInsert = '';
                    if(typeof this.model.pic != 'undefined' && this.model.pic != ''){
                        imgInsert = '<img class="profileListPhoto" src="/files/'+this.model.email+'/'+this.model.pic+'" alt="" />';
                    }
                    var html = imgInsert+'<span class="connected"></span>{{p'+this.model._id+'.firstname}} {{p'+this.model._id+'.lastname}} <div class="bottom"></div>'+addHtml;
                    if(typeof this.model.removedModel == 'undefined'|| !this.model.removedModel){
                        this.renderHtml(html, this.model, 'class="userChoose" ng-focus="p'+this.model._id+'.setChosen()" ng-click="p'+this.model._id+'.setChosen()"');
                    }
                }
                this.renderForCycle = function(){
                    this.setBindingsToModel();
                    var addHtml = '';
                    if(typeof this.addHtml != 'undefined'){
                        this.model.addHtml = this.addHtml.replace(/{_id}/g,this.model._id);
                        this.addHtml = this.addHtml.replace(/{_id}/g,this.model._id);
                    }else{
                        this.addHtml = '';
                        this.model.addHtml = '';
                    }
                }
            };
            viewUsersGrid.prototype = new viewRow(data, scope, parent);
            viewUsersGrid.prototype.constructor=viewUsersGrid;
            return new viewUsersGrid();
        }
    }]);
});
