define(['./module'], function (services) {
    'use strict';
    services.factory('socketService', ['$rootScope','authentication','$compile',function ($rootScope,authentication,$compile) {
        var socket = io.connect();
        var auth = new authentication();
        auth.checkLogin(function(data){
            //socket.emit('clientconnected', {id:data});
        });
		
        return {
			emitClientConnected: function(username, friendsList) {
			var friendsSend = [];
			for (var ii=0, n = friendsList.length; ii < n; ii++) { friendsSend.push({ email: friendsList[ii].email }); }
			
				socket.emit('clientconnected', {id:username, friendslist: friendsSend});
			},
				
			listenToDisconnect: function($scope) {
				var th = this;
				$scope.isConnectedToScope = true;
				
				socket.on("disconnect", function() {
					$scope.isConnectedToScope = false;
					$scope.$apply();
				});
			},
			listenForCalling: function(data, $scope) {
				socket.on("getcall", function(obj) {
					if (("Notification" in window)) {
						  if (document.hidden) {
							new Notification(obj.namelast+" is calling", { body: "Answer it" });
						  }
					  }
					var answer = 'answerCall("'+obj.what+'","'+obj.from+'")';
					var decline = 'declinePhone("'+obj.from+'")';
					$("body").append("<div class='openCallingWindow'></div>");
					$('.openCallingWindow').html(
                    $compile(
                        "<div class='whoiscalling'>"+obj.namelast+" is calling...</div><button ng-click='"+answer+"' class='glyphicon glyphicon-earphone answercall'></button><button ng-click='"+decline+"' class='glyphicon glyphicon-phone-alt declinePhone'></button>"
                    )($scope)
					);
					window.audio = new Audio('/assets/call.mp3');
					window.audio.play();
				});
				socket.on('pickPhone', function(obj) {
					$(".openCallingWindow").remove();
					if (window.audio) {
						window.audio.pause();	
					}
					window.open("/call.html?room=call"+window.personsDataOpen,"_blank");
				});	
				socket.on('declinePhone', function(obj) {
					if (window.audio) {
						window.audio.pause();	
					}
					$(".openCallingWindow").remove();
				});	
				socket.on('declineTheCall', function(obj) {
					$(".openCallingWindow").remove();
				});
			},
			listenToConnect: function(data, $scope) {
				var th = this;
				$scope.isConnectedToScope = true;
				
				socket.on("connect", function() {
					$scope.isConnectedToScope = true;	
					$scope.$apply();
					
					var friendsList = data.friends.filter(function(el){ if(typeof el == 'undefined'){ return false;  } return el.show; });

					th.emitClientConnected(data.email, friendsList);
				});
			},
			
			setUsersDisconnected: function(obj) {
				var socketService = this;
				
					if (typeof obj.users != "undefined") {
						socketService.connected = obj;
					}
					if (typeof obj.user != "undefined") {
						if (typeof socketService != "undefined") {
							if (typeof socketService.connected == "undefined") {
								socketService.connected = {users:[]};
							}else{
								var newArr = [];
								var usrsconn = socketService.connected.users;
								
								for (var ii=0, n= usrsconn.length; ii < n; ii++) {
									if (usrsconn[ii].name != obj.user.name) {
										newArr.push(usrsconn[ii]);
									}
								}
								
								socketService.connected = {users: [newArr]};
							}
						}
					}
			},
			setUsersConnected: function(obj) {
				var socketService = this;
				
					if (typeof obj.user != "undefined") {
						if (typeof socketService != "undefined") {
							if (typeof socketService.connected == "undefined") {
								socketService.connected = {users: [obj.user]};
							}else{
								if (typeof socketService.connected.users.find(function(usr) { return usr.name == obj.user.name }) == "undefined") {
									socketService.connected.users.push(obj.user);
								}
							}
						}
					}
					
					if (typeof obj.users != "undefined") {
						socketService.connected = obj;
					}
			},
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },
            sendUpdate: function(model, obj){
                if(typeof model.email != 'undefined' && model.email != ''){
                    this.emit('updateFriends',{obj:obj, to:model.socketID,toEmail:model.email});
                }
            },
            sendUpdateToMyself: function(obj){
                if(typeof authentication.connectedUser.email != 'undefined' && authentication.connectedUser.email != ''){
                    this.emit('updateFriends',{obj:obj, to:authentication.connectedUser.socketID,toEmail:authentication.connectedUser.email});
                }
            }
        };
    }]);
});
