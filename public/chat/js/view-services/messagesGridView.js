/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('viewMessagesGrid', ['common', 'view', function (common, view) {
        return function(data, scope, grid){
            var viewGrid = function(){
                this.name = "viewMessagesGrid";
                this.viewTemplate = function(mypScope, addToHtmLChildM){
                    var htmlIn = '<div ng-if="'+mypScope+'.models.length != 0" id="load_messages_more" ng-click="loadMessagesMore()">{{"Load messages ..." | translate}}</div>' +
                        '<div id="messagesContainerInnerHere" ng-repeat="msg in '+mypScope+'.models | filter:qqmessages">' +
                        '<div class="messages_from_them {{msg.picClass}}">';
						htmlIn += '<div ng-if="msg.pic" class="message_from_left_for_photo"><div class="message_from_left" ng-bind-html="msg.pic | sanitize"></div></div>';
				htmlIn += '<div class="message_text_left">{{msg.message}}<div ng-bind-html="msg.files | sanitize"></div> <div class="datetimehere" style="font-size:10px;">{{msg.date}}<div></div></div></div></div>';
                        '';
                    htmlIn+='</div>';
                    htmlIn+='<div ng-if="qqmessages.length == 0"></div>';
                    return htmlIn;
                }
            };
            data.rowview = '';
            var gridId = '#messagesContainer';
            if(typeof grid != 'undefined' && grid != ''){
                gridId = grid;
            }
            viewGrid.prototype = new view(data, scope, gridId, new viewGrid());
            viewGrid.prototype.constructor=viewGrid;
            return new viewGrid();
        }
    }]);
});
