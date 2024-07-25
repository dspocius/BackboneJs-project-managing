/*
FUNCTION:
 broadcastChange
 CONTROLLER:
 $scope.$watch(function () {
 return viewLogin.tags;
 },
 function(newVal, oldVal) {
 console.log(newVal);
 console.log(oldVal);
 }, true);
 SERVICE:
 common.broadcastChange(function(){
 this.tags.a = true;
 }.bind(this));
 * */
define(['./module'], function (services) {
    'use strict';
    services.factory('common', ['$rootScope', '$http', 'api',function ($rootScope, $http, api) {
        return {
            broadcastChange: function(f){
                if($rootScope.$root.$$phase != '$apply' && $rootScope.$root.$$phase != '$digest'){
                    $rootScope.$apply(function() {
                        f();
                    }.bind(this));
                }
                else {
                    f();
                }
            },
			translate: function(name){
				var retName = name;
				if(typeof api.translate != 'undefined'){
					retName = api.translate(name);
				}
				return retName;
			},
            trigger: function(name,obj){
                $rootScope.$broadcast(name, obj);
            },
            fetchData: function(name, onSuccessCallback, onFailCallback){
                $http.get(name).success(function(data) {
                    onSuccessCallback(data);
                }).error(function(status, data) {
                    this.locateToLogin();
                    onFailCallback(status,data);
                }.bind(this));
            },
            isPromise: function(value) {
                if (typeof value.then !== "function") {
                    return false;
                }
                var promiseThenSrc = String($.Deferred().then);
                var valueThenSrc = String(value.then);
                return promiseThenSrc === valueThenSrc;
            },
            locateToLogin: function(){
                window.location = '#/login';
            },
            removeArrayEl: function(array, removeArr){
                if(typeof removeArr != 'undefined' && removeArr != ''){
                    var newFriendList = [];
                    for(var i=0; i < array.length; i++){
                        var canAdd = true;
                        for(var j=0; j < removeArr.length; j++){
                            if(typeof array[i] != 'undefined' &&
                            typeof removeArr[j] != 'undefined'
							&& array[i]._id == removeArr[j]._id){
                                canAdd = false;
                            }
                        }
                        if(canAdd){
                            newFriendList.push(array[i]);
                        }
                    }
                    array = newFriendList;
                }
                return array;
            },
            changeArrayAttr: function(array, removeArr, attr, newValue){
                if(typeof removeArr != 'undefined' && removeArr != ''){
                    var newFriendList = [];
                    for(var i=0; i < array.length; i++){
                        var canAdd = true;
                        for(var j=0; j < removeArr.length; j++){
                            if(array[i]._id == removeArr[j]._id){
                                array[i][attr] = newValue;
                            }
                        }
                        if(canAdd){
                            newFriendList.push(array[i]);
                        }
                    }
                    array = newFriendList;
                }
                return array;
            },
            addToArrayEl: function(array, addArr){
                if(typeof addArr !== 'undefined' && addArr !== ''){
                    for(var i=0; i < addArr.length; i++){
                        var canAdd = true;
                        for(var j=0; j < array.length; j++){
							if(typeof addArr[i] != 'undefined' && 
							typeof array[j] != 'undefined'){
								if(addArr[i]['_id'] === array[j]['_id']){
									array[i] = addArr[j];
									canAdd = false;
								}
							}
                        }
                        if(canAdd){
                            array.push(addArr[i]);
                        }
                    }
                }
                return array;
            },
            checkIfSizeIsSmall: function(){
                var mq = window.matchMedia( "(max-width: 768px)" );
                return mq.matches;
            },
            renderView: function($scope){
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            },
            nowTime: function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1;
                var hours = today.getHours();
                var minutes = today.getMinutes();

                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd
                }
                if(mm<10){
                    mm='0'+mm
                }
                var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes;
                return today;
            },
            checkIfArrayHasAttrValue: function(array, attr, attrValue){
                var has = {has:false,item:''};
                if(typeof array != 'undefined' && array != '' &&
                    typeof attr != 'undefined' && attr != '' &&
                    typeof attrValue != 'undefined' && attrValue != ''){
                    for(var i=0; i < array.length; i++){
                        if(array[i][attr] === attrValue){
                            has = {has:true,item:array[i]};
                        }
                    }
                }
                return has;
            },
            renderManualView: function(func, $scope){
                setTimeout(function(){
                    func();
                    this.renderView($scope);
                }.bind(this), 0);
            }
        };
    }]);
});
