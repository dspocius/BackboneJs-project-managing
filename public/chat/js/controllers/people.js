define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('People', ['api', 'common', '$scope', '$location', 'viewPeople', 'usersCollection','viewUsersGrid', 'socketService','authentication','topMenuView','bottomMenuView','viewHome',
        function (api, common, $scope, $location, viewPeople, usersCollection, viewUsersGrid, socketService, authentication, topMenuView, bottomMenuView, viewHome) {
            viewHome.setSelectedUser('', $scope);
            $('#custom_data_text').hide();
			if ($('#menuConvBack')) { $('#menuConvBack').hide(); }
            viewPeople.initializeScopeListening($scope);
            var users, friendsRequests, 
			activeCol, friendsCol, loggedUserEmail, requestsList,allFriendsUsers,
			friendsList, activeList;
            var auth = new authentication();
            var topMView = new topMenuView('',$scope);
            topMView.initializeScopeListening();
            var bottomMView = new bottomMenuView('',$scope);
            this.initializeUsersView = function(data){
            topMView.initializeDefaultMenu();
            bottomMView.initializeDefaultMenu(common.translate('People'));
                //$('#peopleV #usersGridView').html('');
                $('#peopleV #requestsGridView').html('');
                $('#peopleV #friendsGridView').html('');
                friendsRequests = new usersCollection();
                activeCol = new usersCollection();
                friendsCol = new usersCollection();
                allFriendsUsers = new usersCollection();
                requestsList = data.friends.filter(function(el){ if(typeof el == 'undefined'){ return false; } return  !el.removed && (el.blocked || el.blockedBy); }).sort(function(el){ if(typeof el == 'undefined'){ return false; } return el.isConnected; });
                friendsList = data.friends.filter(function(el){ if(typeof el == 'undefined'){ return false; } return el.show && !el.removed && !el.blocked && !el.blockedBy; }).sort(function(el){ if(typeof el == 'undefined'){ return false; } return el.isConnected; });
                activeList = data.friends.filter(function(el){ if(typeof el == 'undefined'){ return false; } return !el.show && !el.removed && !el.blocked && !el.blockedBy; }).sort(function(el){ if(typeof el == 'undefined'){ return false; } return el.isConnected; });
                friendsCol.bindData(friendsList);
                allFriendsUsers.bindData(data.friends);
                activeCol.bindData(activeList);
                friendsRequests.bindData(requestsList);
                var gridViewFriendsList = new viewUsersGrid({collection: friendsCol, noentries:'{{"Add friends by searching them in People view" | translate}}', addHtmlToChild:'<div ng-if="!user.blocked && !user.blockedBy" ng-click="blockUserClick(user._id)" id="user_block" class="user_block">Block</div><div ng-if="user.blocked && !user.blockedBy" ng-click="unblockUserClick(user._id)" id="user_unblock" class="user_unblock">Unblock</div>'}, $scope,'#peopleV #friendsGridView');
                var gridViewActList = new viewUsersGrid({collection: activeCol, noentries:'{{"No friends active" | translate}}', addHtmlToChild:''}, $scope,'#peopleV #activeGridView');
                var gridViewReq = new viewUsersGrid({collection: friendsRequests, noentries:'{{"You have no friend requests" | translate}}', addHtmlToChild:'<div ng-if="!user.blocked && !user.blockedBy" ng-click="blockUserClick(user._id)" id="user_block" class="user_block">Block</div><div ng-if="user.blocked && !user.blockedBy" ng-click="unblockUserClick(user._id)" id="user_unblock" class="user_unblock">Unblock</div>'}, $scope,'#peopleV #requestsGridView');
				loggedUserEmail = data.email;
				$('#friendsNumb').html('('+friendsList.length+')');
				$('#activeNumb').html('('+activeList.length+')');
				var redReq = '';
				if(requestsList.length != 0){
					redReq = 'color:red;';
				}
				$('#requestsNumb').html('<span style="'+redReq+'">('+requestsList.length+')</span>');
                common.renderView($scope);
            };
			$scope.searchPeople = function(){
				var searchVal = $('#people_search').val();
				if(searchVal !== ''){
					users = new usersCollection({rem:loggedUserEmail});
					users.url = '/users/'+searchVal;
                    users.fetch().done(function(){
                        usersCollection.loadedUsers = users;
                        users.unsetAttributes('isFriend');
                        users.setAttribute('isFriend',authentication.connectedUser.friends);
                        var gridView = new viewUsersGrid({noentries:'{{"No people found" | translate}}', collection: users, addHtmlToChild:'<div ng-if="!user.isFriend" ng-click="addUserClick(user._id)" id="user_add" class="glyphicon glyphicon-plus icon-in-menu icon-turn-off user-add"></div>'}, $scope, '#peopleV #usersGridViewRows');
                    });
				}
			};
            $scope.removeConv = function(userID){
                var getModel2 = authentication.connectedUser;
                var getModel = allFriendsUsers.getModelByProperty('_id',userID);
                getModel2.url = '/updateuser';
                getModel2.removeFriends = [{_id:getModel._id, remove:true}];
                var promise2 = getModel2.save(['email','removeFriends']);

                $.when( promise2 ).then(function() {
                    authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, getModel2.removeFriends, 'show', false);
                    common.renderView($scope);
                }.bind(this));
            }
            $scope.showConv = function(userID){
                var getModel2 = authentication.connectedUser;
                var getModel = allFriendsUsers.getModelByProperty('_id',userID);
                getModel2.url = '/updateuser';
                getModel2.removeFriends = [{_id:getModel._id, remove:false}];
                var promise2 = getModel2.save(['email','removeFriends']);

                $.when( promise2 ).then(function() {
                    authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, getModel2.removeFriends, 'show', true);
					common.renderView($scope);
                }.bind(this));
            }.bind(this)
            $scope.addUserClick = function(userID){
                var getModel2 = authentication.connectedUser;
				var getModel = '';
				if(allFriendsUsers.getModelByProperty('_id',userID) != ''){
					 getModel = allFriendsUsers.getModelByProperty('_id',userID);
				}else{
					 getModel = usersCollection.loadedUsers.getModelByProperty('_id',userID);
				}
                
                getModel.url = '/updateuser';
                getModel2.url = '/updateuser';
                if($('#'+userID+' #user_add').hasClass('glyphicon-plus')){
                    getModel.friendsAdd = [{_id:getModel2._id, email:getModel2.email, real_email:getModel2.real_email, firstname:getModel2.firstname,
                        lastname:getModel2.lastname, pic:getModel2.pic, approved: false, pending: false, removed:false, show:true}];
                    getModel2.friendsAdd = [{_id:getModel._id, email:getModel.email, real_email:getModel.real_email, firstname:getModel.firstname,
                        lastname:getModel.lastname, pic:getModel.pic, approved: true, pending: true, removed:false, show:true}];
                    var promise = getModel.save(['email','friendsAdd']);
                    var promise2 = getModel2.save(['email','friendsAdd']);
                    $('#'+userID+' #user_add').removeClass('glyphicon-plus');
                    $('#'+userID+' #user_add').addClass('glyphicon-refresh');
                    $.when( promise, promise2 ).then(function() {
                        $('#'+userID+' #user_add').removeClass('glyphicon-refresh');
                        socketService.sendUpdate(getModel,{addFriend:getModel.friendsAdd});
                        authentication.connectedUser.friends = common.addToArrayEl(authentication.connectedUser.friends, getModel2.friendsAdd);
                        this.initializeUsersView(authentication.connectedUser);
                    }.bind(this));
                }
            }.bind(this)
            $scope.unblockUserClick = function(userID){
                var getModel2 = authentication.connectedUser;
				var getModel = '';
				if(allFriendsUsers.getModelByProperty('_id',userID) != ''){
					 getModel = allFriendsUsers.getModelByProperty('_id',userID);
				}else{
					 getModel = usersCollection.loadedUsers.getModelByProperty('_id',userID);
				}
                
                getModel.url = '/updateuser';
                getModel2.url = '/updateuser';

					var getModel2 = authentication.connectedUser;
					var getModel = allFriendsUsers.getModelByProperty('_id',userID);
					getModel2.removeFriends = [{_id:getModel._id, block:false}];
					getModel.removeFriends = [{_id:getModel2._id, blockedBy:false}];
					var promise2 = getModel2.save(['email','removeFriends']);
					var promise = getModel.save(['email','removeFriends']);
					$.when( promise, promise2 ).then(function() {
					socketService.sendUpdate(getModel,{blockFriend:[{_id:getModel2._id}],blocked:false});
					socketService.sendUpdateToMyself({blockFriendMine:[{_id:getModel._id}],blocked:false});
						common.renderView($scope);
					}.bind(this));
			}.bind(this)
            $scope.blockUserClick = function(userID){
                var getModel2 = authentication.connectedUser;
				var getModel = '';
				if(allFriendsUsers.getModelByProperty('_id',userID) != ''){
					 getModel = allFriendsUsers.getModelByProperty('_id',userID);
				}else{
					 getModel = usersCollection.loadedUsers.getModelByProperty('_id',userID);
				}
                
                getModel.url = '/updateuser';
                getModel2.url = '/updateuser';

					var getModel2 = authentication.connectedUser;
					var getModel = allFriendsUsers.getModelByProperty('_id',userID);
					getModel2.removeFriends = [{_id:getModel._id, block:true}];
					getModel.removeFriends = [{_id:getModel2._id, blockedBy:true}];
					var promise2 = getModel2.save(['email','removeFriends']);
					var promise = getModel.save(['email','removeFriends']);
					$.when( promise, promise2 ).then(function() {
					socketService.sendUpdate(getModel,{blockFriend:[{_id:getModel2._id}],blocked:true});
					socketService.sendUpdateToMyself({blockFriendMine:[{_id:getModel._id}],blocked:true});
						//authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, getModel2.removeFriends, 'blocked', true);
						common.renderView($scope);
					}.bind(this));
            }.bind(this)
            auth.connectedUser(this.initializeUsersView);

            this.listenTo = function(){
                $scope.$on('viewUsersGrid:render', function(event) {
				if(typeof viewHome.NotificationsLoaded == 'undefined'){
					api.getNotifications().success(function(data) {
						viewHome.NotificationsLoaded = data;
						for(var i=0; i < viewHome.NotificationsLoaded.messages.length; i++){
							if(typeof viewHome.NotificationsLoaded.messages[i].from != 'undefined' && typeof allFriendsUsers != 'undefined'){
								//allFriendsUsers
								var getModel = allFriendsUsers.getModelByProperty('email',viewHome.NotificationsLoaded.messages[i].from);
								if(getModel != '' && typeof getModel.messagesWrote != 'undefined'){
									getModel.messagesWrote = getModel.messagesWrote+1;
								}else{
									getModel.messagesWrote = 1;
								}
								//viewHome.addToHeader(getModel, viewHome.NotificationsLoaded.messages[i].message);
							}
						}
					});
				}else{
						for(var i=0; i < viewHome.NotificationsLoaded.messages.length; i++){
							if(typeof viewHome.NotificationsLoaded.messages[i].from != 'undefined' && typeof allFriendsUsers != 'undefined'){
								var getModel = allFriendsUsers.getModelByProperty('email',viewHome.NotificationsLoaded.messages[i].from);
								if(getModel != '' && typeof getModel.messagesWrote != 'undefined'){
									getModel.messagesWrote = getModel.messagesWrote+1;
								}else{
									if (getModel != "") {
										getModel.messagesWrote = 1;
									}
								}
								//viewHome.addToHeader(getModel, viewHome.NotificationsLoaded.messages[i].message);
							}
						}
				}
                    if(typeof socketService.connected != 'undefined' && typeof users != 'undefined' && users.models.length > 0 &&
                        $('#'+users.models[0]._id).length){
                            users.setConnected(socketService.connected);
                            friendsRequests.setConnected(socketService.connected);
                            activeCol.setConnected(socketService.connected);
                            allFriendsUsers.setConnected(socketService.connected);
                            friendsCol.setConnected(socketService.connected);
                            auth.connectedUser(function(data){ users.setInFriendsList(data.friends); });
                            common.renderView($scope);
                        }
						common.trigger('$viewContentLoaded',{});
                });
                socketService.on('updateFriends', function(obj){
                        /*authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, obj.removeFriend, 'removed', true);*/
						if(typeof obj.blockFriendMine != 'undefined' && obj.blockFriendMine != ''){
							authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, obj.blockFriendMine, 'blocked', obj.blocked);
						}else{
							if(typeof obj.blockFriend != 'undefined' && obj.blockFriend != ''){
								authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, obj.blockFriend, 'blockedBy', obj.blocked);
							}else{
								authentication.connectedUser.friends = common.addToArrayEl(authentication.connectedUser.friends, obj.addFriend);
							}
						}
                        this.initializeUsersView(authentication.connectedUser);
                        common.trigger('viewUsersGrid:render');
                }.bind(this));
            }
            this.listenToOnce = function(){
                viewPeople.listenToOnceInit = true;
                socketService.on('user_disconnected', function(obj){
                    socketService.setUsersDisconnected(obj);
                    /*users.setDisconnected(obj);*/
                    common.trigger('viewUsersGrid:render');
                });
                socketService.on('user_connected', function(obj){
                    socketService.setUsersConnected(obj);
                    common.trigger('viewUsersGrid:render');
                });
                socketService.on('chat message', function(obj){
                    if(typeof viewHome.listenToOnceInit === 'undefined' || !viewHome.listenToOnceInit){
                        var us_auth = new usersCollection();
                        var friendsList = authentication.connectedUser.friends;
                        us_auth.bindData(friendsList);
                        var getModel = us_auth.getModelByProperty('email',obj.from);
                        if(getModel.show){
							viewHome.addToHeader(getModel, obj.msg);
							var ifHas = common.checkIfArrayHasAttrValue(viewHome.messagesLoaded,'userModId',obj.from_id);
							if(ifHas.has){
								ifHas.item.addModel({from:obj.from, message: obj.msg, date: common.nowTime()});
							}
							if(!$('li#Messaging #numbMsg').length){
								$('li#Messaging').append('<div class="numberOnIcon" id="numbMsg">1</div>');
							}else{
								var msgCount = 0;
								if($('li#Messaging #numbMsg').html() !== ''){
									msgCount = parseInt($('li#Messaging #numbMsg').html())+1;
								}
								$('li#Messaging #numbMsg').html(msgCount);
							}
						}else{
							viewHome.showConv(getModel._id, function(){
								common.renderView($scope);
							if(!$('li#Messaging #numbMsg').length){
								$('li#Messaging').append('<div class="numberOnIcon" id="numbMsg">1</div>');
							}else{
								var msgCount = 0;
								if($('li#Messaging #numbMsg').html() !== ''){
									msgCount = parseInt($('li#Messaging #numbMsg').html())+1;
								}
								$('li#Messaging #numbMsg').html(msgCount);
							}
							});
						}
                    }else{
						if(location.hash.indexOf('home') == -1){
							if(!$('li#Messaging #numbMsg').length){
								$('li#Messaging').append('<div class="numberOnIcon" id="numbMsg">1</div>');
							}else{
								var msgCount = 1;
								if($('li#Messaging #numbMsg').html() !== ''){
									msgCount = parseInt($('li#Messaging #numbMsg').html())+1;
								}
								$('li#Messaging #numbMsg').html(msgCount);
							}
						}
					}
                });
            }
            if(typeof viewPeople.listenToOnceInit === 'undefined' && !viewPeople.listenToOnceInit){
                this.listenToOnce();
            }
            this.listenTo();
            if(typeof socketService.connected != 'undefined'){
                common.trigger('viewUsersGrid:render');
            }
        }]);
});
