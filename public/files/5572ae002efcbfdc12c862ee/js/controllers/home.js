define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('Home', ['api','common', '$scope', '$location', 'viewChannelMessagesGrid', 'viewChannelsGrid', 'viewHome', 'usersCollection','viewUsersGrid', 'socketService','authentication','topMenuView','bottomMenuView','userModel','viewMessagesGrid','messagesCollection','baseCollection',
        function (api, common, $scope, $location, viewChannelMessagesGrid, viewChannelsGrid, viewHome, usersCollection, viewUsersGrid, socketService, authentication, topMenuView, bottomMenuView, userModel, viewMessagesGrid,messagesCollection, baseCollection) {
        var users, messagesCol, myChannels;
        var firstDefClick = false;
        var auth = new authentication();
        viewHome.initializeScopeListening($scope);
        viewHome.setSelectedUser('');
            if(common.checkIfSizeIsSmall()){$('.containerMessages').hide();}
        var topMView = new topMenuView('',$scope);
		topMView.initializeScopeListening();
        var bottomMView = new bottomMenuView('',$scope);
		this.AfterFetchFunctionFirstly = function(){
			for(var i=0; i < myChannels.models.length; i++){
				socketService.emit('channelconnected',{email:authentication.connectedUser.email, channelId:myChannels.models[i]._id});
			}
			this.AfterFetchFunction();
		}.bind(this);
		this.AfterFetchFunction = function(){
			viewHome.ChannelsColLoaded = myChannels;
			myChannels.setAttributeByArrayInsideAttrById('show', 'people', authentication.connectedUser._id);
			$('#channelsGridView').html('');
			var connectedCol = new baseCollection({FullUrl:''});
			connectedCol.bindData(myChannels.models);
			connectedCol.removeByAttribute('show',false);
			new viewChannelsGrid({collection: connectedCol, noentries:'', addHtmlToChild:''}, $scope,'#channelsGridView');
		}.bind(this)
        this.initializeView = function(){
            auth.connectedUser(function(data){
			myChannels = new baseCollection({FullUrl:'/getMyChannels/'+data._id+'/0'});
			if(typeof viewHome.ChannelsColLoaded != 'undefined'){
				myChannels = viewHome.ChannelsColLoaded;
				this.AfterFetchFunction();
			}else{
				myChannels.fetch().done(this.AfterFetchFunctionFirstly);
			}
        topMView.initializeDefaultMenu();
        bottomMView.initializeDefaultMenu(common.translate('Home'));
                users = new usersCollection();
                var friendsList = data.friends.filter(function(el){ if(typeof el == 'undefined'){ return false;  } return el.show; });
                users.bindData(friendsList);
				users.data = data;
                var gridView = new viewUsersGrid({collection: users}, $scope);
                if(friendsList.length == 0){
                    $(gridView.grid).html(common.translate('You have no friends added. Go to People -> People and find your friends.'));
                    $('#messagesContainer').html('');
                    $('.allmessages').html('');
                    $('.sendButton').attr('disabled','disabled');
                }else{
                    $('.sendButton').removeAttr('disabled');
                }
                if($('#'+common.translate('Home')+' #numbMsg').length){
                    $('#'+common.translate('Home')+' #numbMsg').html('');
                }
            }.bind(this));
        }.bind(this)
        this.initializeView();
        this.listenTo = function(){
            $scope.usersMsgTextareas = '';
            $scope.onWrittingToUser = function(){
                var text = document.getElementById('homeTextUser');
                function resize () {
                    text.style.height = 'auto';
                    var hgive = text.scrollHeight;
                    if(hgive < 55 && hgive > 40){
                        hgive = 30;
                    }
                    text.style.height = hgive+'px';
                }
                function delayedResize () {
                    window.setTimeout(resize, 0);
                }
                resize();
				if(typeof viewHome.getSelectedUser().email === 'undefined'){
					socketService.emit('channel_writting',{fromName:authentication.connectedUser.firstname+' '+authentication.connectedUser.lastname, channelId:viewHome.getSelectedUser()._id, from:authentication.email, toEmail:viewHome.getSelectedUser().email});
				}else{
					if(typeof viewHome.getSelectedUser().socketID != 'undefined' && viewHome.getSelectedUser().socketID != ''){
						socketService.emit('message_writting',{from:authentication.email, toEmail:viewHome.getSelectedUser().email});
					}
				}
            }
            $scope.removeConv = function(userID){
                var getModel2 = authentication.connectedUser;
                var getModel = users.getModelByProperty('_id',userID);
                getModel2.url = '/updateuser';
                getModel2.removeFriends = [{_id:getModel._id, remove:true}];
                var promise2 = getModel2.save(['email','removeFriends']);

                $.when( promise2 ).then(function() {
                    authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, getModel2.removeFriends, 'show', false);
                    common.renderView($scope);
					this.initializeView();
					if(users.models.length > 0){
						users.models[0].setChosen();
					}
                }.bind(this));
            }.bind(this)
			$scope.$on('update:initializationView', function(event, obj) {
				this.initializeView();
			}.bind(this));
            $scope.$on('viewUsersGrid:render', function(event) {
				if(typeof viewHome.NotificationsLoaded == 'undefined'){
					api.getNotifications().success(function(data) {
						viewHome.NotificationsLoaded = data;
						for(var i=0; i < viewHome.NotificationsLoaded.messages.length; i++){
							if(typeof viewHome.NotificationsLoaded.messages[i].from != 'undefined' && typeof users != 'undefined'){
								var getModel = users.getModelByProperty('email',viewHome.NotificationsLoaded.messages[i].from);
								viewHome.addToHeader(getModel, viewHome.NotificationsLoaded.messages[i].message);
							}
						}
					});
				}else{
						for(var i=0; i < viewHome.NotificationsLoaded.messages.length; i++){
							if(typeof viewHome.NotificationsLoaded.messages[i].from != 'undefined'){
								var getModel = users.getModelByProperty('email',viewHome.NotificationsLoaded.messages[i].from);
								viewHome.addToHeader(getModel, viewHome.NotificationsLoaded.messages[i].message);
							}
						}
				}
                if(typeof socketService.connected != 'undefined' && typeof users != 'undefined' &&
                    users.models.length > 0 && $('#'+users.models[0]._id).length){
                        users.setConnected(socketService.connected);
                        if(users.models.length != 0 && viewHome.getSelectedUser() == '' && !firstDefClick){
                            users.models[0].setChosen();
                        }
                        common.renderView($scope);
						common.trigger('$viewContentLoaded',{});
					}
            });
			this.setAttributesToChangingMessagesComp = function(userMod, idOfUser){
                $(".selectedUser").removeClass('selectedUser');
                $("#"+idOfUser+userMod._id).addClass('selectedUser');
				
                if(common.checkIfSizeIsSmall() && firstDefClick){
                    $('#footer-nav-center').hide();
                    $('#usersGridView').hide();
                    $('.containerMessages').show();
                    $(window).scrollTop($(document).height());
                    topMView.setToDefault();
                    topMView.menuForConversation();
                    viewHome.changeMessageContentTo(userMod);
                    viewHome.setSelectedUser(userMod);
					viewHome.blockModelSet(userMod,viewHome.getSelectedUser());
                    $scope.$on('menu:conv:back', function(){
                        viewHome.setSelectedUser('');
                        $('#footer-nav-center').show();
                        $('#usersGridView').show();
                        $('.containerMessages').hide();
                        topMView.setToDefault();
                        topMView.initializeDefaultMenu();
                    });
                }
                if(!common.checkIfSizeIsSmall()){
                    viewHome.changeMessageContentTo(userMod);
                    viewHome.setSelectedUser(userMod);
					viewHome.blockModelSet(userMod,viewHome.getSelectedUser());
                }
			}
			this.loadMessagesAllInHere = function(connUserId, userMod, whichView){
                    var messagesModel = new userModel({_id:connUserId});
                    messagesModel.url = '/messages/'+userMod._id;
                    messagesModel.userModId = userMod._id;
					messagesModel.skipMessages = 0;
					messagesModel.lastMessagesCount = 0;
                    messagesModel.fetch().done(function(){
                        viewHome.messagesSelected = messagesModel;
                        viewHome.messagesSelected.lastMessagesCount = messagesModel.messages.length;
                        messagesCol = new messagesCollection();
                        messagesCol.bindDataToBeginning(messagesModel.messages);
                        messagesCol.addToModelsPic();
                        if(typeof viewHome.messagesLoaded === 'undefined' || viewHome.messagesLoaded === ''){
                            viewHome.messagesLoaded = [messagesCol];
                        }else{
                            viewHome.messagesLoaded.push(messagesCol);
                        }
                        viewHome.messagesCol = messagesCol;
						new whichView({collection: messagesCol}, $scope);
						common.renderManualView(function(){
							if(users.models.length > 0){
								new whichView({collection: messagesCol}, $scope); 
								viewHome.setToBottomMessages($scope);  
							}else{
								viewHome.setSelectedUser('');
								$('#messagesContainer').html('');  
								$('.custom_data_in_container').html('');  
							}}, $scope);
					});
			}
            $scope.$on('channel:change', function(event, channelMod){
				var ifHas = common.checkIfArrayHasAttrValue(viewHome.messagesLoaded,'userModId',channelMod._id);
				if(ifHas.has){
                    common.renderManualView(function(){ new viewChannelMessagesGrid({collection: ifHas.item}, $scope); viewHome.setToBottomMessages($scope);  }, $scope);
                }else{
					this.loadMessagesAllInHere(channelMod._id, channelMod, viewChannelMessagesGrid);
				}
				channelMod.firstname = channelMod.name;
				channelMod.lastname = '';
				this.setAttributesToChangingMessagesComp(channelMod,'channel');
                firstDefClick = true;
			}.bind(this));
            $scope.$on('user:change', function(event, userMod) {
                var connected_us = authentication.connectedUser;
                var ifHas = common.checkIfArrayHasAttrValue(viewHome.messagesLoaded,'userModId',userMod._id);
				
				api.deleteNotification(connected_us.email,userMod.email);
				if(typeof viewHome.NotificationsLoaded != 'undefined'){
					for(var i=0; i < viewHome.NotificationsLoaded.messages.length; i++){
						if(typeof viewHome.NotificationsLoaded.messages[i].from != 'undefined'){
							if(userMod.email == viewHome.NotificationsLoaded.messages[i].from){
								viewHome.NotificationsLoaded.messages.splice(i, 1);
							}
						}
					}
				}
                if(ifHas.has){
                    common.renderManualView(function(){ new viewMessagesGrid({collection: ifHas.item}, $scope); viewHome.setToBottomMessages($scope);  }, $scope);
                }else{
					this.loadMessagesAllInHere(connected_us._id, userMod, viewMessagesGrid);
                }
				this.setAttributesToChangingMessagesComp(userMod,'');
                firstDefClick = true;
            }.bind(this));
			$scope.$on('viewMessagesGrid:render', function() {
				if(viewHome.messagesSelected.lastMessagesCount < 50){
					$("#load_messages_more").hide();
				}
				common.trigger('$viewContentLoaded',{});
			});
			$scope.$on('viewChannelMessagesGrid:render', function() {
				if(viewHome.messagesSelected.lastMessagesCount < 50){
					$("#load_messages_more").hide();
				}
				common.trigger('$viewContentLoaded',{});
			});
			$scope.$on('load:messages', function(event) {
				var connected_us = authentication.connectedUser;
				viewHome.messagesSelected.skipMessages = viewHome.messagesSelected.skipMessages+50;
				var messagesModel = new userModel({_id:viewHome.messagesSelected.skipMessages});
                    messagesModel.url = '/messages/'+viewHome.messagesSelected.userModId+'/'+connected_us._id;
                    messagesModel.userModId = viewHome.messagesSelected.userModId;
					$("#load_messages_more").hide();
                    messagesModel.fetch().done(function(){
						viewHome.messagesSelected.lastMessagesCount = messagesModel.messages.length;
						viewHome.messagesCol.bindDataToBeginning(messagesModel.messages);
                        viewHome.messagesCol.addToModelsPic();
						new viewMessagesGrid({collection: viewHome.messagesCol}, $scope);
					});
			});
            $scope.$on('send:message', function(event, obj) {
                if(obj.msg !== '' || (typeof obj.files !== 'undefined' && obj.files !== '')){
                    var filesin = '';
                    if(typeof obj.files !== 'undefined' && obj.files !== ''){
                        filesin = obj.files;
                    }
                    var messagesMod = new userModel({id:viewHome.messagesSelected._id});
                    messagesMod.url = '/message';
                    messagesMod.message = {from:authentication.email, message:obj.msg, files:filesin};
                    messagesMod.save(['id','message']);
                    //messagesCol.addModel({from:authentication.email, message: obj.msg, date: common.nowTime(), files:filesin});
                    //messagesCol.addToModelsPic();
                    //viewHome.setToBottomMessages($scope);toEmail
					if(typeof viewHome.getSelectedUser().email === 'undefined'){
						socketService.emit('channelmessage',{channelId: viewHome.getSelectedUser()._id, from_id:authentication.connectedUser._id, from:authentication.email, to:authentication.connectedUser.socketID,toEmail:authentication.connectedUser.email,msg:obj.msg, files:filesin,toID:viewHome.getSelectedUser()._id});
					}else{
						if(typeof authentication.connectedUser.email != 'undefined' && authentication.connectedUser.email != ''){
							socketService.emit('chat message',{from_id:authentication.connectedUser._id, from:authentication.email, to:authentication.connectedUser.socketID,toEmail:authentication.connectedUser.email,msg:obj.msg, files:filesin,toID:viewHome.getSelectedUser()._id});
						}
						api.setNotification(viewHome.getSelectedUser().email, authentication.email, obj.msg,filesin);
						if(typeof viewHome.getSelectedUser().email != 'undefined' && viewHome.getSelectedUser().email != ''){
							socketService.emit('chat message',{from_id:authentication.connectedUser._id, from:authentication.email, to:viewHome.getSelectedUser().socketID,toEmail:viewHome.getSelectedUser().email,msg:obj.msg, files:filesin,toID:authentication.connectedUser._id});
						}
					}
                }
                $('#homeTextUser').focus();
            });
            socketService.on('updateFriends', function(obj){
                    if(typeof authentication.connectedUser != 'undefined' && authentication.connectedUser != ''){
                        /*authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, obj.removeFriend, 'removed', true);*/
						if(typeof obj.blockFriendMine != 'undefined' && obj.blockFriendMine != ''){
							authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, obj.blockFriendMine, 'blocked', obj.blocked);
						}else{
							if(typeof obj.blockFriend != 'undefined' && obj.blockFriend != ''){
								viewHome.blockFriendSet(obj,viewHome.getSelectedUser());
								authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, obj.blockFriend, 'blockedBy', obj.blocked);
							}else{
								authentication.connectedUser.friends = common.addToArrayEl(authentication.connectedUser.friends, obj.addFriend);
							}
						}
					}
            }.bind(this));
        }
        this.listenToOnce = function(){
            viewHome.listenToOnceInit = true;
            window.addEventListener("keydown",function (e) {
                if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
                    if($(".search_in_messages").is(':visible')){
                        $(".search_in_messages").hide();
                    }else{
                        $(".search_in_messages").show();
                    }
                    e.preventDefault();
                }
                if (e.shiftKey && e.keyCode === 13) {
                    //var heightt = parseInt($("#homeTextUser").height());
                    //$("#homeTextUser").height(heightt+22+'px');
                    //$("#homeTextUser").append('///n');
                }else{
                    if (e.keyCode === 13) {
                       // e.preventDefault();
                    }
                }
            });

            socketService.on('user_disconnected', function(obj){
                socketService.connected = obj;
                users.setDisconnected(obj);
                if(typeof viewHome.getSelectedUser() != 'undefined' && viewHome.getSelectedUser() != ''){
                    viewHome.setSelectedUser(viewHome.getSelectedUser());
                }
            });
            socketService.on('user_connected', function(obj){
                socketService.connected = obj;
                common.trigger('viewUsersGrid:render');
                if(typeof viewHome.getSelectedUser() != 'undefined' && viewHome.getSelectedUser() != ''){
                    viewHome.setSelectedUser(viewHome.getSelectedUser());
                }
            });
            socketService.on('message_writting', function(obj){
                if(typeof viewHome.getSelectedUser() != 'undefined' && 
				viewHome.getSelectedUser() != '' && 
				typeof viewHome.getSelectedUser().email !== 'undefined' &&
				viewHome.getSelectedUser().get('email') === obj.from &&
				typeof obj.channelId === 'undefined'){
                    $('.onWrittingToUser').show();
                    this.onWrittingToUserTimeStamp = Date.now();
                    setTimeout(function(){
                        if((Date.now()-this.onWrittingToUserTimeStamp) > 1990){
                            $('.onWrittingToUser').hide();
                        }
                    }.bind(this), 2000);
                }else{
					if(typeof viewHome.getSelectedUser() != 'undefined' && 
					viewHome.getSelectedUser() != '' && 
					typeof viewHome.getSelectedUser().email === 'undefined' &&
					typeof obj.channelId != 'undefined' && 
					viewHome.getSelectedUser().get('_id') == obj.channelId &&
					obj.from !== authentication.connectedUser.email){
						$('.onWrittingToUser').show();
						if(!$('#writtingThatGuy'+obj.fromName.replace(' ','')).length){
							$('.onWrittingToUser').prepend('<span class="allThatAreWrittingNow" data-time="'+Date.now()+'" id="writtingThatGuy'+obj.fromName.replace(' ','')+'">'+obj.fromName+' </span>');
						}else{
							$('#writtingThatGuy'+obj.fromName.replace(' ','')).attr('data-time',Date.now());
						}
						setTimeout(function(){
							$( ".allThatAreWrittingNow" ).each(function( index ) {
								var dateTimeStamp = parseInt($( this ).attr('data-time'));
								if((Date.now()-dateTimeStamp) > 1990){
									$( this ).remove();
									if(!$( ".allThatAreWrittingNow" ).length){
										$('.onWrittingToUser').hide();
									}
								}
							});
						}.bind(this), 2000);
						
					}
				}
            });
            socketService.on('chat message', function(obj){
                if(typeof viewHome.getSelectedUser() != 'undefined' && 
				viewHome.getSelectedUser() != '' && 
				((viewHome.getSelectedUser().get('email') === obj.from ||
				(obj.from === authentication.email && typeof viewHome.getSelectedUser().email !== 'undefined')) || 
				(typeof obj.channelId != 'undefined' && viewHome.getSelectedUser().get('_id') == obj.channelId) 
				 )){
                    viewHome.messagesCol.addModel({from:obj.from, message: obj.msg, date: common.nowTime(), files: obj.files});
                    viewHome.messagesCol.addToModelsPic();
                    viewHome.setToBottomMessages($scope);
                }else{
					if(typeof obj.channelId != 'undefined'){
						var channelMod = myChannels.getModelByProperty('_id',obj.channelId);
						viewHome.addToHeader(channelMod, obj.msg);
					}else{
						var us_auth = new usersCollection();
						var friendsList = authentication.connectedUser.friends;
						us_auth.bindData(friendsList);
						var getModel = us_auth.getModelByProperty('email',obj.from);
						if(getModel.show){
							viewHome.addToHeader(getModel, obj.msg);
							var ifHas = common.checkIfArrayHasAttrValue(viewHome.messagesLoaded,'userModId',obj.from_id);
								if(ifHas.has){
									ifHas.item.addModel({from:obj.from, message: obj.msg, date: common.nowTime(), files: obj.files});
									ifHas.item.addToModelsPic();
								}
							if(typeof viewHome.getSelectedUser() === 'undefined' || viewHome.getSelectedUser() === ''){
									if(!$('#'+common.translate('Home')+' #numbMsg').length){
										$('#'+common.translate('Home')).append('<div class="numberOnIcon" id="numbMsg">1</div>');
									}else{
										var msgCount = 0;
										if($('#'+common.translate('Home')+' #numbMsg').html() !== ''){
											msgCount = parseInt($('#'+common.translate('Home')+' #numbMsg').html())+1;
										}
										if(msgCount == 0){
											msgCount = 1;
										}
										$('#'+common.translate('Home')+' #numbMsg').html(msgCount);
									}
							}
						}else{
							viewHome.showConv(getModel._id, function(){
								common.trigger('update:initializationView');
									if(users.models.length != 0 && viewHome.getSelectedUser() == ''){
										users.models[0].setChosen();
									}else{
										viewHome.addToHeader(getModel, obj.msg);
									}
							}.bind(this));
						}
					
					}
                }
            }.bind(this));
        }
            if(typeof viewHome.listenToOnceInit === 'undefined' && !viewHome.listenToOnceInit){
                this.listenToOnce();
            }
            this.listenTo();
            if(typeof socketService.connected != 'undefined'){
                common.trigger('viewUsersGrid:render');
            }
    }]);
});
