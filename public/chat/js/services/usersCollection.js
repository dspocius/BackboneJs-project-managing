/* FUNCTIONAL INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('usersCollection', ['collection', 'userModel',function (collection, userModel) {
        return function(data){
            var that = collection({model: userModel, data:data});
            that.setConnected = function(obj){
                var index, i;
				if(typeof obj != "undefined" && typeof obj.users != "undefined" && typeof obj.users.length != "undefined"){
					for (i = 0; i < obj.users.length; ++i) {
						for (index = 0; index < this.models.length; ++index) {
							if(typeof this.models[index] !== 'undefined' && 
							typeof this.models[index].get === 'function' && 
							this.models[index].get('email') == obj.users[i].name){
								this.models[index].setConnected(obj.users[i].socket_id);
							}
						}
					}
                }
            }
            that.setDisconnected = function(obj){
                var index, i;
                for (index = 0; index < this.models.length; ++index) {
                        this.models[index].removeConnected();
                }
                this.setConnected(obj);
            }
            that.setInFriendsList = function(obj){
                var index, i;
				if(typeof obj != "undefined" && typeof obj.length != "undefined"){
					for (i = 0; i < obj.length; ++i) {
						for (index = 0; index < this.models.length; ++index) {
							if(typeof this.models[index] != 'undefined' &&
							typeof obj[i] != 'undefined' &&
							(this.models[index].get('email') == obj[i].email && !obj[i].removed)){
								this.models[index].setInFriendsList();
							}
						}
					}
                }
            }
            that.url = '/users';
            return that;
        };
    }]);
});
