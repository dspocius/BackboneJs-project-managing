/* FUNCTIONAL INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('messagesCollection', ['collection', 'model','viewHome',function (collection, model, viewHome) {
        return function(data){
            var obj = '';
            if(typeof data != 'undefined' && data != ''){
                obj = {model: model, data:data};
            }
            var that = collection(obj);
            that.addToModelsPic = function(){
                var usersPhoto = '', usersEmail = '';
                if(typeof viewHome.getSelectedUser() != 'undefined' && typeof viewHome.getSelectedUser() != ''){
                    usersPhoto = viewHome.getSelectedUsersImg();
                    usersEmail = viewHome.getSelectedUser().email;
                }
                that.appendNewVal('pic',usersPhoto,usersEmail,'from', 'picClass', 'myMessageInChat');
            }
            that.url = '/messages';
            return that;
        };
    }]);
});
