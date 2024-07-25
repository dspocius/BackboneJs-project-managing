/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('viewChannelsGrid', ['common', 'view', 'channelsGridRow', function (common, view, channelsGridRow) {
        return function(data, scope, grid){
            var viewGrid = function(){
                this.name = "viewChannelsGrid";
                this.viewTemplate = function(mypScope, addToHtmLChildM,noentries){
var noentrieText = '';
if(typeof noentries != 'undefined' && noentries != ''){
	noentrieText = noentries;
}
                    var htmlIn = '<input ng-if="'+mypScope+'.models.length !== 0" type="search" class="form-control input-lg auth-biginput search_textarea" ng-model="qqchannels" placeholder="'+"{{'Filter' | translate}}"+'" />' +
						'<div ng-repeat="channel in '+mypScope+'.models | filter:qqchannels">' +
                        '<span ng-if="!channel.removedModel">' +
                        '<div id="channel{{channel._id}}" class="userChoose {{channel.hasWrote}}" ng-click="channel.setChosen()">' +
                        '<span class="channel_show" ng-if="channel.show && !channel.Added">' +
                            '<span ng-click="hideChannel(channel._id)" class="glyphicon glyphicon-minus-sign glyph_delete_conv"></span> ' +
                        '</span>' +
                        '<span class="channel_hide" ng-if="!channel.show && !channel.Added">' +
                            '<span ng-click="showChannel(channel._id)" class="glyphicon glyphicon-plus-sign glyph_delete_conv"></span> ' +
                        '</span>' +
                        '<div>{{channel.name}}</div><div>{{channel.about}}</div><div class="bottom"></div>' +
                        addToHtmLChildM+
                        '</div>'+
                        '</span>';
                    htmlIn+='</div>';
                    return htmlIn;
                }
            };
			data.rowview = channelsGridRow;
            var gridId = '#usersGridView';
            if(typeof grid != 'undefined' && grid != ''){
                gridId = grid;
            }
            viewGrid.prototype = new view(data, scope, gridId, new viewGrid());
            viewGrid.prototype.constructor=viewGrid;
            return new viewGrid();
        }
    }]);
});
