define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('Home', ['api','common', '$scope', '$location', 'viewChannelMessagesGrid', 'viewChannelsGrid', 'viewHome', 'usersCollection','viewUsersGrid', 'socketService','authentication','topMenuView','bottomMenuView','userModel','viewMessagesGrid','messagesCollection','baseCollection','$compile','$routeParams',
        function (api, common, $scope, $location, viewChannelMessagesGrid, viewChannelsGrid, viewHome, usersCollection, viewUsersGrid, socketService, authentication, topMenuView, bottomMenuView, userModel, viewMessagesGrid,messagesCollection, baseCollection,$compile,$routeParams) {
        var users, messagesCol, myChannels;
        var firstDefClick = false;
		var pidp = $routeParams.pid;
		var chn = $routeParams.chn;
		
        var auth = new authentication();
        viewHome.initializeScopeListening($scope);
        viewHome.setSelectedUser('', $scope);
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
			if (myChannels && myChannels.models.length > 0 && chn) {
				let fndchan = myChannels.models.find((itt) => itt._id == chn);
				if (fndchan) {
					setTimeout(() => {
					fndchan.setChosen();
					}, 100);
				}
			}
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
                var friendsList = [];
				if(typeof data != "undefined" && typeof data.friends != "undefined" && typeof data.friends.length != "undefined"){
					friendsList = data.friends.filter(function(el){ if(typeof el == 'undefined'){ return false;  } return el.show; });
					socketService.emitClientConnected(data.email, friendsList);
					socketService.listenToDisconnect($scope);
					socketService.listenToConnect(data, $scope);
					socketService.listenForCalling(data, $scope);
				}
				
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
                if($('#Messaging #numbMsg').length){
                    $('#Messaging #numbMsg').html('');
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
                        hgive = 40;
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
			
           $scope.declinePhone = function(emailSel){
				$(".openCallingWindow").remove();
				var data = authentication.connectedUser;
				socketService.emit('declinePhoneDo',{from:data.email, toEmail:emailSel});
		   }
           $scope.declineTheCall = function(emailSel){
				$(".openCallingWindow").remove();
				var data = authentication.connectedUser;
				socketService.emit('declineTheCallDo',{from:data.email, toEmail:emailSel});
		   }
           $scope.answerCall = function(answ,emailSel){
				$(".openCallingWindow").remove();
				var data = authentication.connectedUser;
				socketService.emit('pickPhoneDo',{from:data.email, toEmail:emailSel});
				window.open("/call.html?room=call"+answ,"_blank");
		   }
           $scope.miniChatDoCall = function(email,callUserIdSocket){
				if(typeof authentication.connectedUser.email != 'undefined' && authentication.connectedUser.email != ''){
					var data = authentication.connectedUser;
					socketService.emit('calling',{from:data.email, namelast: data.firstname+' '+data.lastname, toEmail:email, what:callUserIdSocket+"_"+authentication.connectedUser._id});

					var decline = 'declineTheCall("'+email+'")';
					$("body").append("<div class='openCallingWindow'></div>");
					$('.openCallingWindow').html(
                    $compile(
                        "<div class='whoiscalling'>Calling...</div><button ng-click='"+decline+"' class='glyphicon glyphicon-phone-alt declinePhone'></button>"
                    )($scope)
					);
					window.personsDataOpen = callUserIdSocket+"_"+authentication.connectedUser._id;
				}
			}
            $scope.hideChannel = function(channelId){
				if(channelId !== ''){
					 var addChannel = new userModel();
					 addChannel.url = '/ChangeChannelsView';
					 addChannel.id = channelId;
					 addChannel.show = false;
					 addChannel.people = authentication.connectedUser._id;
					 addChannel.save().done(function(){
						 var channelMod = myChannels.getModelByProperty('_id', channelId);
						 
						 if (typeof channelMod != "undefined" && channelMod != '') {
							 channelMod.removedModel = true;
							 channelMod.show = false; 
							 if(myChannels.models.length > 0){
								 var goodModel = myChannels.findByTwoProperties('removedModel', false, 'show', true);
								 if (typeof goodModel != "undefined" && goodModel != '' && $(window).width() > 770) {
									 goodModel.setChosen();
								 }else{
									if(users && users.models.length > 0){
										 var mod = users.getFirstModelByProperty("removedModel", false);
										 if (typeof mod != "undefined" && mod != '' && $(window).width() > 770) {
											 mod.setChosen();
										 }
									 }
								 }
							 }else{
							 if(users && users.models.length > 0){
								 var mod = users.getFirstModelByProperty("removedModel", false);
								 if (typeof mod != "undefined" && mod != '' && $(window).width() > 770) {
									 mod.setChosen();
								 }
							 }
							 }
						 }
					}.bind(this));
				}
			}.bind(this)
			
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
					if(users && users.models.length > 0){
						var mod = users.getFirstModelByProperty("removedModel", false);
						 if (typeof mod != "undefined" && mod != '' && $(window).width() > 770) {
							 mod.setChosen();
						 }
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
						if (users && users.models.length > 0 && pidp) {
							let fnduser = users.models.find((itt) => itt._id == pidp);
							if (fnduser) {
								fnduser.setChosen();
							}
						} else if(users.models.length != 0 && viewHome.getSelectedUser() == '' && !firstDefClick && $(window).width() > 770){
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
                    $('#channelsGridView').hide();
                    $('.containerMessages').show();
                    $(window).scrollTop($(document).height());
                    topMView.setToDefault();
                    topMView.menuForConversation();
                    viewHome.changeMessageContentTo(userMod);
                    viewHome.setSelectedUser(userMod, $scope);
					viewHome.blockModelSet(userMod,viewHome.getSelectedUser());
                    $scope.$on('menu:conv:back', function(){
                        viewHome.setSelectedUser('', $scope);
                        $('#footer-nav-center').show();
                        $('#usersGridView').show();
                        $('#channelsGridView').show();
                        $('.containerMessages').hide();
                        topMView.setToDefault();
                        topMView.initializeDefaultMenu();
                    });
                }
                if(!common.checkIfSizeIsSmall()){
                    viewHome.changeMessageContentTo(userMod);
                    viewHome.setSelectedUser(userMod, $scope);
					viewHome.blockModelSet(userMod,viewHome.getSelectedUser());
                }
			}
			this.loadMessagesAllInHere = function(connUserId, userMod, whichView){
				var th = this;
                    var messagesModel = new userModel({_id:connUserId});
                    messagesModel.url = '/messages/'+userMod._id;
                    messagesModel.userModId = userMod._id;
					messagesModel.skipMessages = 0;
					messagesModel.lastMessagesCount = 0;
                    messagesModel.fetch().done(function(){
						messagesModel.messages.reverse();
                        viewHome.messagesSelected = messagesModel;
                        viewHome.messagesSelected.lastMessagesCount = messagesModel.messages.length;
                        messagesCol = new messagesCollection();
						messagesModel.messages.map(function(msgg) { msgg.message = th.replaceAllIcons(msgg.message); });
                        messagesCol.bindDataToBeginning(messagesModel.messages);
                        messagesCol.addToModelsPic();
						
						var modelsOfP = messagesCol.models;
						if (typeof userMod != "undefined" && typeof userMod.people != "undefined") {
							for (var i=0, n = modelsOfP.length; i < n; i++) {
								var findMod = userMod.people.find(function(peop) { return peop.email == modelsOfP[i].from; });
								if (typeof findMod != "undefined") {
									modelsOfP[i].firstname = findMod.firstname;
								}else{
									modelsOfP[i].firstname = modelsOfP[i].from;
								}
							}
						}else{
							for (var i=0, n = modelsOfP.length; i < n; i++) {
								modelsOfP[i].firstname = modelsOfP[i].from;
							}
						}
						
                        if(typeof viewHome.messagesLoaded === 'undefined' || viewHome.messagesLoaded === ''){
                            viewHome.messagesLoaded = [messagesCol];
                        }else{
                            viewHome.messagesLoaded.push(messagesCol);
                        }
                        viewHome.messagesCol = messagesCol;

						new whichView({collection: messagesCol}, $scope);
						common.renderManualView(function(){
							if(users && users.models.length > 0){
								new whichView({collection: messagesCol}, $scope); 
								viewHome.setToBottomMessages($scope);  
							}else{
								viewHome.setSelectedUser('', $scope);
								$('#messagesContainer').html('');  
								$('.custom_data_in_container').html('');  
							}}, $scope);
					});
			}
			
            $scope.$on('channel:change', function(event, channelMod) {
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
							viewHome.NotificationsLoaded.messages[i].msg = this.replaceAllIcons(viewHome.NotificationsLoaded.messages[i].msg);
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
				this.setAttributesToChangingMessagesComp(userMod,'');//
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
						messagesModel.messages.reverse();
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
					obj.msg = this.replaceAllIcons(obj.msg);
                    messagesMod.message = {from:authentication.email, message:obj.msg, files:filesin};
                    messagesMod.save(['id','message']).done(function() {
						$(".textareaforuser").attr("style", "");
						
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
						
					  }).fail(function() {
						$(".textareaforuser").val("Error. Message not sent - Check your internet connection. "+obj.msg);
						$(".textareaforuser").attr("style", "border: 1px solid red; color: red;");
					  });
                    //messagesCol.addModel({from:authentication.email, message: obj.msg, date: common.nowTime(), files:filesin});
                    //messagesCol.addToModelsPic();
                    //viewHome.setToBottomMessages($scope);toEmail
                }
                $('#homeTextUser').focus();
            }.bind(this));
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
                socketService.setUsersDisconnected(obj);
				
                users.setDisconnected(obj);
                if(typeof viewHome.getSelectedUser() != 'undefined' && viewHome.getSelectedUser() != ''){
                    viewHome.setSelectedUser(viewHome.getSelectedUser(), $scope);
                }
            });
            socketService.on('user_connected', function(obj){
                socketService.setUsersConnected(obj);
				
                common.trigger('viewUsersGrid:render');
                if(typeof viewHome.getSelectedUser() != 'undefined' && viewHome.getSelectedUser() != ''){
                    viewHome.setSelectedUser(viewHome.getSelectedUser(), $scope);
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
				if (typeof obj != "undefined" && obj != "" && typeof obj.channelId != "undefined" && obj.channelId != "") {
					 var channelMod = myChannels.getModelByProperty('_id',obj.channelId);
					 if (typeof channelMod != "undefined" && channelMod != "" && typeof channelMod.people != "undefined") {
						var findMod = channelMod.people.find(function(peop) { return peop.email == obj.from; });
							if (typeof findMod != "undefined") {
								obj.firstname = findMod.firstname;
							}else{
								obj.firstname = obj.from;
							}
					 }else{
						 obj.firstname = obj.from;
					 }
					if (document.hidden) {
						new Notification(obj.from+" wrote a message in channel", { body: obj.message });
					}
				}else{
					if (("Notification" in window)) {
						if (document.hidden) {
							new Notification(obj.from+" wrote a message to you", { body: obj.message });
						}
					}
					obj.firstname = obj.from;
				}
				obj.msg = this.replaceAllIcons(obj.msg);
				
                if(typeof viewHome.getSelectedUser() != 'undefined' && 
				viewHome.getSelectedUser() != '' && 
				((viewHome.getSelectedUser().get('email') === obj.from ||
				(obj.from === authentication.email && typeof viewHome.getSelectedUser().email !== 'undefined')) || 
				(typeof obj.channelId != 'undefined' && viewHome.getSelectedUser().get('_id') == obj.channelId) 
				 )){
                    viewHome.messagesCol.addModel({firstname:obj.firstname, from:obj.from, message: this.replaceAllIcons(obj.msg), date: common.nowTime(), files: obj.files});
                    viewHome.messagesCol.addToModelsPic();
                    viewHome.setToBottomMessages($scope);
                }else{
					if(typeof obj.channelId != 'undefined'){
						var channelMod = myChannels.getModelByProperty('_id',obj.channelId);
						viewHome.addToHeader(channelMod, this.replaceAllIcons(obj.msg));
					}else{
						var us_auth = new usersCollection();
						var friendsList = [];
						if(typeof authentication.connectedUser.friends != "undefined" && typeof authentication.connectedUser.friends.length != "undefined"){
							friendsList = authentication.connectedUser.friends;
						}
						us_auth.bindData(friendsList);
						var getModel = us_auth.getModelByProperty('email',obj.from);
						if(getModel.show){
							viewHome.addToHeader(getModel, this.replaceAllIcons(obj.msg));
							var ifHas = common.checkIfArrayHasAttrValue(viewHome.messagesLoaded,'userModId',obj.from_id);
								if(ifHas.has){
									ifHas.item.addModel({firstname:obj.firstname, from:obj.from, message: this.replaceAllIcons(obj.msg), date: common.nowTime(), files: obj.files});
									ifHas.item.addToModelsPic();
								}
							if(typeof viewHome.getSelectedUser() === 'undefined' || viewHome.getSelectedUser() === ''){
									if(!$('#Messaging #numbMsg').length){
										$('#'+common.translate('Home')).append('<div class="numberOnIcon" id="numbMsg">1</div>');
									}else{
										var msgCount = 0;
										if($('#Messaging #numbMsg').html() !== ''){
											msgCount = parseInt($('#Messaging #numbMsg').html())+1;
										}
										if(msgCount == 0){
											msgCount = 1;
										}
										$('#Messaging #numbMsg').html(msgCount);
									}
							}
						}else{
							viewHome.showConv(getModel._id, function(){
								common.trigger('update:initializationView');
									if(users && users.models.length != 0 && viewHome.getSelectedUser() == '' && $(window).width() > 770){
										users.models[0].setChosen();
									}else{
										viewHome.addToHeader(getModel, this.replaceAllIcons(obj.msg));
									}
							}.bind(this));
						}
					
					}
                }
            }.bind(this));
        }
		this.replaceAllIcons = function(msg) {
			if (typeof msg == "undefined" || msg == null) {
				return "";
			} else {
				msg = msg.split(";D").join("😁");
				msg = msg.split(":DD").join("😂");
				msg = msg.split("xD").join("😂");
				msg = msg.split(":D").join("😃");
				msg = msg.split(";DD").join("😄");
				msg = msg.split(";))").join("😅");
				msg = msg.split(":x").join("😆");
				msg = msg.split(":X").join("😆");
				msg = msg.split(";)").join("😉");
				msg = msg.split(":)").join("🙂");
				msg = msg.split(":aww").join("😊");
				msg = msg.split(":p").join("😋");
				msg = msg.split(";P").join("😋");
				msg = msg.split(":m").join("😌");
				msg = msg.split(":l").join("😍");
				msg = msg.split(":n").join("😏");
				msg = msg.split(";/").join("😓");
				msg = msg.split(":/").join("😔");
				msg = msg.split(":~").join("😖");
				msg = msg.split(":*").join("😘");
				msg = msg.split(";*").join("😚");
				msg = msg.split(";p").join("😜");
				msg = msg.split(";(").join("😢");
				msg = msg.split(":(").join("😭");
				return msg;
			}
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
