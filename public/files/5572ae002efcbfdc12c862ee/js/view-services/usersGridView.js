/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('viewUsersGrid', ['common', 'view', 'viewUsersGridRow', function (common, view, viewUsersGridRow) {
        return function(data, scope, grid){
            var viewGrid = function(){
                this.name = "viewUsersGrid";
                this.viewTemplate = function(mypScope, addToHtmLChildM,noentries){
var noentrieText = 'No data found';
if(typeof noentries != 'undefined' && noentries != ''){
	noentrieText = noentries;
}
                    var htmlIn = '<input type="search" class="form-control input-lg auth-biginput search_textarea" ng-model="qq" placeholder="'+"{{'Filter' | translate}}"+'" />' +
                        '<div class="userChoose" ng-if="'+mypScope+'.models.length === 0"><h1>'+noentrieText+'</h1></div>' +
						'<div ng-repeat="user in '+mypScope+'.models | filter:qq">' +
                        '<span ng-if="!user.removedModel">' +
                        '<div id="{{user._id}}" class="userChoose {{user.isChosen}} {{user.hasWrote}}" ng-click="user.setChosen()">' +
                        '<span ng-if="user.pic != '+"''"+'">' +
                            '<div class="message_from_left_for_photo"><img class="message_from_left profileListPhoto" src="/files/{{user.pic}}" alt="" /></div>' +
                        '</span>'+
                        '<div class="usersNameBv"><span class="connected" ng-if="user.isConnected != '+"''"+'">' +
                            '<span class="glyphonline glyphicon glyphicon-record"></span>' +
                        '</span>' +
                        '<span class="user_remove" ng-if="user.approved !== undefined && user.show !== undefined && user.show">' +
                            '<span ng-click="removeConv(user._id)" class="glyphicon glyphicon-remove glyph_delete_conv"></span> ' +
                        '</span>' +
                        '<span class="user_remove" ng-if="user.approved !== undefined && user.show !== undefined && !user.show">' +
                            '<span ng-click="showConv(user._id)" class="glyphicon glyphicon-plus-sign glyph_delete_conv"></span> ' +
                        '</span>' +
						'<span ng-if="user.messagesWrote !== undefined && user.messagesWrote != '+"''"+'">' +
                            '<span class="glyphicon glyphicon-envelope numbUserMsged"></span>' +
                        '</span>' +
                        '{{user.firstname}} {{user.lastname}}</div><div class="bottom">{{user.bottomText}}</div>' +
                        addToHtmLChildM+
                        '</div>'+
                        '</span>';
                    htmlIn+='</div>';
                    return htmlIn;
                }
            };
            data.rowview = viewUsersGridRow;
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
