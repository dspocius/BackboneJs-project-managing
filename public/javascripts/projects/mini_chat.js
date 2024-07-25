			function miniChatCallFileUpload(objId){
				$('#miniChatfileToUpload'+objId).trigger('click');
			}
             function uploadFilesToServerSendPost(filess,objId,from_id, chat){
				var files = document.getElementById('miniChatfileToUpload'+objId).files;
                var fd = new FormData();
                fd.append("project", 'files');
				var canUploadIt = true;
                for (var i in files) {
					var fileSizeInMb = files[i].size/1024/1024;
					if(fileSizeInMb >= 25){//25mb
						canUploadIt = false;
					}
                    fd.append("uploadedFile", files[i]);
                }
				if(canUploadIt){
					var xhr = new XMLHttpRequest();
					xhr.upload.addEventListener("progress", function(oEvent){
						if (oEvent.lengthComputable) {
							var percentComplete = oEvent.loaded / oEvent.total;
							$('.miniChatonFileUploadProgress'+objId).show();
							$('.miniChatonFileUploadProgress'+objId).html('');
							$('.miniChatonFileUploadProgress'+objId).css('width', (percentComplete*100)+'%');
						} else {
							$('.miniChatonFileUploadProgress'+objId).html('Uploading ... ');
						}
					}.bind(this), false);
					xhr.addEventListener("load", function(e){
						var jsonDataResponse = JSON.parse(e.currentTarget.response);
						var partsCt = jsonDataResponse.name.split("\.");
						var msgIn = '<a href='+"'"+jsonDataResponse.filepath+"'"+'>'+jsonDataResponse.name+'</a>';
						if(partsCt[partsCt.length-1] === 'png' ||
							partsCt[partsCt.length-1] === 'jpg' ||
							partsCt[partsCt.length-1] === 'gif'){
							msgIn = '<img class='+"'user_photos_class"+"'"+' src='+"'"+jsonDataResponse.filepath+"'"+' alt='+"'"+"'"+' />';
						}
						/* common.trigger('send:message',{msg:'', files:msgIn}); */
						sendMessageWithText(objId,from_id,'_',msgIn, chat);
						$('.miniChatonFileUploadProgress'+objId).hide();
					}.bind(this), false);
					//xhr.addEventListener("error", uploadFailed, false);
					//xhr.addEventListener("abort", uploadCanceled, false);
					xhr.open("POST", "/messages_file_upload");
					xhr.send(fd);
				}else{
							$('.miniChatonFileUploadProgress'+objId).show();
							$('.miniChatonFileUploadProgress'+objId).html('Too big file. Max - 25MB.');
				}
            }
function answerCall(answ,emailSel) {
	$(".openCallingWindow").remove();
	api.socketService.emit('pickPhoneDo',{from:api.data.email, toEmail:emailSel});

	window.open("/call.html?room=call"+answ,"_blank");
}
function declinePhone(emailSel) {
	$(".openCallingWindow").remove();
	api.socketService.emit('declinePhoneDo',{from:api.data.email, toEmail:emailSel});
}
function startMiniChat(socket, data, resetData=false, callback=null){
	api.socketService = socket;
	api.socketService.connectedUsers = '';
	miniChatListenSocket();
	api.isSocketConnected = true;
	
	api.socketService.on('disconnect', function(obj){
		$(".minichatTextarea").each(function(i, obj) {
			var vall = $(obj).val();
			$(obj).attr("style","border:1px solid red; color:red; ");
			$(obj).attr("disabled","disabled");
			$(obj).val("Lost connection to server. Trying to reconnect... "+vall);
		});
		$(".sendButton").attr("style","border:1px solid #ccc; background: #ccc; color: black;");
		$(".sendButton").attr("disabled","disabled");
		api.isSocketConnected = false;
	});
	api.socketService.on('getcall', function(obj) {
		var answer = 'answerCall("'+obj.what+'","'+obj.from+'")';
		var decline = 'declinePhone("'+obj.from+'")';
		$("body").append("<div class='openCallingWindow'><div class='whoiscalling'>"+obj.namelast+" is calling...</div><button onclick='"+answer+"' class='glyphicon glyphicon-earphone answercall'></button><button onclick='"+decline+"' class='glyphicon glyphicon-phone-alt declinePhone'></button></div>");
		  api.socketService.audiocall = new Audio('/assets/call.mp3');
		  api.socketService.audiocall.play();
		  if (("Notification" in window)) {
			  if (document.hidden) {
				new Notification(obj.namelast+" is calling", { body: "Answer it" });
			  }
		  }
  });	
	api.socketService.on('pickPhone', function(obj) {
		$(".openCallingWindow").remove();
		if (api.socketService.audiocall) {
			api.socketService.audiocall.pause();
		}		
		window.open("/call.html?room=call"+window.personsDataOpen,"_blank");
	});	
	api.socketService.on('declinePhone', function(obj) {
		$(".openCallingWindow").remove();
		if (api.socketService.audiocall) {
			api.socketService.audiocall.pause();
		}
	});	
	api.socketService.on('declineTheCall', function(obj) {
		$(".openCallingWindow").remove();
	});
	api.socketService.on('connect', function(obj){
		if (typeof api.friendsSendForSocket != "undefined") {
			api.socketService.emit('clientconnected', api.friendsSendForSocket);
		}
		
		$(".minichatTextarea").each(function(i, obj) {
			var vall = $(obj).val().replace("Lost connection to server. Trying to reconnect...", "");
			$(obj).val(vall);
			$(obj).prop("disabled", false);
			$(obj).attr("style","");
		});
		$(".sendButton").prop("disabled", false);
		$(".sendButton").attr("style","");
		api.isSocketConnected = true;
	});
	
	api.getCredData(function(dt){
		if(dt != 'error'){
			api.getChannelsData(function(dt){
				api.channelsData = dt;
				var friendsList = api.allFriends.filter(function(el){ return el.show; });
				listFriends(friendsList);
				setConnectedUsers(api.socketService.user_connected);
				showAllNotificationsIn(api.notificationsGet);
				for(var i=0; i < api.channelsData.length; i++){
					api.socketService.emit('channelconnected',{email:api.data.email, channelId:api.channelsData[i]._id});
				}
			});
			listeningToShow();
			api.allFriends = dt.friends;
			var friendsList = api.allFriends.filter(function(el){ return el.show; });
			listFriends(friendsList);
			api.friendsList = friendsList;

			var friendsSend = [];
			for (var ii=0, n = friendsList.length; ii < n; ii++) { friendsSend.push({ email: friendsList[ii].email }); }
            api.socketService.emit('clientconnected', { id:data, friendslist: friendsSend });
			api.friendsSendForSocket = { id:data, friendslist: friendsSend };
			
			setConnectedUsers(api.socketService.user_connected);
			api.getNotifications().success(function(data){
				var notificationsData = data;
				api.notificationsGet = notificationsData;
				showAllNotificationsIn(api.notificationsGet);
			});
			if (callback != null) {
				callback();
			}
		}else{
			//Not logged in
		}
	}, data, resetData);
}
function showAllNotificationsIn(notificationsData){
	if(typeof notificationsData != 'undefined'){
				for(var i=0; i < notificationsData.messages.length; i++){
					if(typeof notificationsData.messages[i].from != 'undefined' && 
					notificationsData.messages[i].from.split("___").length > 1){
						var data = getFriendDataByEmail(notificationsData.messages[i].from.split("___")[0]);
						var obj = notificationsData.messages[i];
						obj.toID = data._id;
						chatMessageShowNotification(obj, 'chat');
					}
				}
	}
}
function addFriendToList(friend){
	var add = true;
	for(var i=0; i < api.allFriends.length; i++){
		if(api.allFriends[i]._id === friend._id){
			add = false;
		}
	}
	if(add){
		api.allFriends.push(friend);
	}
	rerenderSocketFriends();
}
function setFriendsAttrById(id, attr, attrVal){
	for(var i=0; i < api.allFriends.length; i++){
		if(api.allFriends[i]._id === id){
			api.allFriends[i][attr] = attrVal;
		}
	}
	for(var i=0; i < api.friendsList.length; i++){
		if(api.friendsList[i]._id === id){
			api.friendsList[i][attr] = attrVal;
		}
	}
}
function setChannelsAttrById(id, attr, attrVal){
	for(var i=0; i < api.channelsData.length; i++){
		if(api.channelsData[i]._id === id){
			api.channelsData[i][attr] = attrVal;
		}
	}
}
function getChannelDataById(id){
	var friendData = '';
	for(var i=0; i < api.channelsData.length; i++){
		if(api.channelsData[i]._id === id){
			friendData = api.channelsData[i];
		}
	}
	return friendData;
}
function getFriendDataById(id){
	var friendData = '';
	for(var i=0; i < api.friendsList.length; i++){
		if(api.friendsList[i]._id === id){
			friendData = api.friendsList[i];
		}
	}
	return friendData;
}
function getFriendDataByEmail(email){
	var friendData = '';
	if(typeof api.friendsList != 'undefined'){
		for(var i=0; i < api.friendsList.length; i++){
			if(api.friendsList[i].email === email){
				friendData = api.friendsList[i];
			}
		}
	}
	return friendData;
}
function listChannels(friendsList){
			var friendsHtml = '';
			var msgsFirst = '';
			if (friendsList.length > 0) {
				friendsHtml = '<div class="channelsTopHere">Channels</div>';
			}
			
			for(var i=0; i < friendsList.length; i++){
				if(i==0){
					friendsHtml += '<div id="mini_chat'+friendsList[i]._id+'" data-email="'+friendsList[i]._id+'" onclick="miniChannelClicked('+"'"+friendsList[i]._id+"'"+')" class="userChoose miniChatSelectedUser min_chat_choose_user">';
				}else{
					friendsHtml += '<div id="mini_chat'+friendsList[i]._id+'" data-email="'+friendsList[i]._id+'" onclick="miniChannelClicked('+"'"+friendsList[i]._id+"'"+')" class="userChoose min_chat_choose_user">';
				}
				
				friendsHtml += '<div id="miniChatIsLoggedInUser'+friendsList[i]._id+'" class="glyphicon glyphicon-ok-sign miniChatisLoggedInUser"></div>';
				friendsHtml += '<div id="miniChatIsUserWritting'+friendsList[i]._id+'" class="glyphicon glyphicon-option-horizontal miniChatIsUserWrittingSmall"></div>';
				friendsHtml += '<div class="usersNameBv">';
				if (friendsList[i].type == "Private") {
					friendsHtml += "<b class='channelType'><span class='glyphicon glyphicon-lock'></span></b>";
				}
				if (friendsList[i].type == "Open") {
					friendsHtml += "<b class='channelType'>#</b>";
				}
				friendsHtml += friendsList[i].name;
				friendsHtml += '</div><div class="aboutSomething"><b>'+friendsList[i].about+'</b></div>';
				friendsHtml += '<div class="bottom"></div>';
				friendsHtml += '</div>';
			}
			
			var buttonsInput = '<div id=""><button class="miniChatButtons" onclick="miniChatshowAllUsers();">All</button>';
			buttonsInput += '<button class="miniChatButtons" onclick="miniChatshowOnlyOnlineUsers();">Online</button>';
			buttonsInput += '<button class="miniChatButtons" onclick="hideOrShowNotificationn();">Close</button>';
			buttonsInput += '<a class="miniChatButtons" href="/chat/#/channels">Create Channel</a>';
			buttonsInput += '<input class="miniChatInputs" placeholder="Filter" type="text" onkeyup="miniChatFilterUsersFriends(this);" /></div>';
			/*$('#channelsView').html(buttonsInput+friendsHtml);*/
			return friendsHtml;
}
function listFriends(friendsList){
			var friendsHtml = '';
			var msgsFirst = '';
			if (friendsList.length > 0) {
				friendsHtml = '<div class="friendsTopHere">Direct Messages</div>';
			}
			for(var i=0; i < friendsList.length; i++){
				if(i==0){
					friendsHtml += '<div id="mini_chat'+friendsList[i]._id+'" data-email="'+friendsList[i].email+'" onclick="miniChatClicked('+"'"+friendsList[i]._id+"'"+')" class="userChoose miniChatSelectedUser min_chat_choose_user">';
				}else{
					friendsHtml += '<div id="mini_chat'+friendsList[i]._id+'" data-email="'+friendsList[i].email+'" onclick="miniChatClicked('+"'"+friendsList[i]._id+"'"+')" class="userChoose min_chat_choose_user">';
				}
				friendsHtml += '<div id="miniChatIsLoggedInUser'+friendsList[i]._id+'" class="glyphicon glyphicon-ok-sign miniChatisLoggedInUser"></div>';
				friendsHtml += '<div id="miniChatIsUserWritting'+friendsList[i]._id+'" class="glyphicon glyphicon-option-horizontal miniChatIsUserWrittingSmall"></div>';
				if(friendsList[i].pic != ''){
					friendsHtml += '<div class="message_from_left_for_photo">';
					friendsHtml += '<img class="message_from_left miniChatListPhoto" src="/files/'+friendsList[i].email+'/'+friendsList[i].pic+'" alt="">';
					friendsHtml += '</div>';
				}else{
					friendsHtml += '<div class="message_from_left_for_photo">';
					friendsHtml += '<img class="message_from_left miniChatListPhoto" src="/files/brand/logo.png" alt="">';
					friendsHtml += '</div>';
				}
				friendsHtml += '<div class="usersNameBv">';
				friendsHtml += friendsList[i].firstname+' '+friendsList[i].lastname;
				friendsHtml += '</div><div><b></b></div>';
				friendsHtml += '<div class="bottom"></div>';
				friendsHtml += '</div>';
			}
			var channelsHtml = "";
			if(typeof api.channelsData != 'undefined' && api.channelsData != ''){
				channelsHtml = listChannels(api.channelsData);
				friendsHtml = channelsHtml+friendsHtml;
			}

			var fhtmlnot = '<div style="height:25px;" id="mini_chat'+api.data._id+'" data-email="'+api.data.email+'" onclick="miniChatClickedNotif('+"'"+api.data._id+"'"+')" class="userChoose min_chat_choose_user">';
fhtmlnot += '<div class="usersNameBv">';
				fhtmlnot += "<b>Notifications</b>";
				fhtmlnot += '</div>';
				fhtmlnot += '<div class="bottom"></div>';
				fhtmlnot += '</div>';
				
				
			if(friendsHtml == ""){ friendsHtml = "<div class='nocontacts'><div class='big_icon_glyph_lik_text glyphicon glyphicon-search'></div><div class='nocontactstext'>You have no contacts. Write name in search field and add</div></div>"; }
			var buttonsInput = '<div id=""><button class="miniChatButtons" onclick="miniChatshowAllUsers();">All</button>';
			buttonsInput += '<button class="miniChatButtons" onclick="miniChatshowOnlyOnlineUsers();">Online</button>';
			buttonsInput += '<button class="miniChatButtons" onclick="hideOrShowNotificationn();">Close</button>';
			buttonsInput += '<a class="miniChatButtons" href="/chat/#/channels">Create Channel</a>';
			buttonsInput += fhtmlnot;
			buttonsInput += '<input class="miniChatInputs" placeholder="Filter" type="text" onkeyup="miniChatFilterUsersFriends(this);" /></div>';
			$('#friendsView').html(buttonsInput+friendsHtml);
}
function listenFriendsOptions(personsId){
	$(document).keypress(function(e) {
		if(e.which == 13) {
			if(event.shiftKey){}else{
				$(".sendButtonFromTheChat").trigger("click");
			}
		}
	});
	/*$( '#miniChatUsersFriendsViewFloatingUs'+personsId).draggable({
	handle: '#miniChatFloatingThiss'+personsId,
		stop: function (event,ui) {
			$( event.toElement ).one('click', function(e){ e.stopImmediatePropagation(); } );
		}
	});*/
	$('#miniChatFloatingThiss'+personsId).click(function(){
			if(typeof $(this).attr('data-pid') != 'undefined' && $(this).attr('data-pid') != ''){
				if($('#miniChatMsgsOuter'+$(this).attr('data-pid')).is(':visible')){
					$('#miniChatMsgsOuter'+$(this).attr('data-pid')).hide();
					$('#miniChatRemoveThatHidden'+$(this).attr('data-pid')).addClass("expandedMenuHereRem");
					$('#miniChatFloatingThiss'+$(this).attr('data-pid')).addClass("expandedMenuHere");
				}else{
					$('#miniChatRemoveThatHidden'+$(this).attr('data-pid')).removeClass("expandedMenuHereRem");
					$('#miniChatFloatingThiss'+$(this).attr('data-pid')).removeClass("expandedMenuHere");
					$('#mini_chat'+$(this).attr('data-pid')).removeClass('wroteToUser');
					$('#showNotifications').removeClass('newMessageNotification');
					$('#miniChatMiniIconIsUserWrote'+$(this).attr('data-pid')).hide();
					$('#miniChatMsgsOuter'+$(this).attr('data-pid')).show();
					var personsId = $(this).attr('data-pid');
							if(typeof $('#minichatMessages'+personsId)[0] != 'undefined'){
								//setTimeout(function(){
									$('#minichatMessages'+personsId).scrollTop($('#minichatMessages'+personsId)[0].scrollHeight+2000);
								setTimeout(function(){
									$('#minichatMessages'+personsId).scrollTop($('#minichatMessages'+personsId)[0].scrollHeight+2000);
								},100);	
							}
				}
			}
		
	});
}
function miniChatFilterUsersFriends(elem){
	var elValue = elem.value;
	$( ".min_chat_choose_user" ).each(function( index ) {
	  if(!new RegExp(elValue,'gi').test($( this ).find('.usersNameBv').text())){
		  $( this ).hide();
	  }else{
		  $( this ).show();
	  }
	});
}
function miniChatshowOnlyOnlineUsers(){
	$( ".min_chat_choose_user" ).each(function( index ) {
	  if(!$( this ).find('.miniChatisLoggedInUser').is(':visible')){
		  $( this ).hide();
	  }else{
		  $( this ).show();
	  }
	});
}
function miniChatshowAllUsers(){
	$( ".min_chat_choose_user" ).show();
}
function miniChatCloseWindowChatInMin(personsId){
	$('#miniChatMsgsOuter'+personsId).hide();
}
function miniChatDoCall(personsId){
	doCallAperson(personsId,personsId+"_"+api.data._id);
	var decline = 'declineTheCall("'+personsId+'")';
	$("body").append("<div class='openCallingWindow'><div class='whoiscalling'>Calling...</div><button onclick='"+decline+"' class='glyphicon glyphicon-phone-alt declinePhone'></button></div>");
	window.personsDataOpen = personsId+"_"+api.data._id;
}
function doCallAperson(from_id,whattosend){
	var emailSel = getSelectedUsersEmailById(from_id);
	api.socketService.emit('calling',{from:api.data.email, namelast: api.data.firstname+' '+api.data.lastname, toEmail:emailSel, what:whattosend});
}
function declineTheCall(from_id){
	$(".openCallingWindow").remove();
	var emailSel = getSelectedUsersEmailById(from_id);
	api.socketService.emit('declineTheCallDo',{from:api.data.email, toEmail:emailSel});
}
function miniChatRemoveWindowChatInMin(personsId){
	$('#miniChatUsersFriendsViewFloatingUs'+personsId).remove();
}
function miniChannelClicked(channelsId){
	if(!$('#miniChatUsersFriendsViewFloatingUs'+channelsId).length){
		var dataFriend = getChannelDataById(channelsId);
		//api.deleteNotification(api.data.email, dataFriend.email);
		var dtFriendHtml = '';
		var xInHead= '<div onclick="miniChatRemoveWindowChatInMin('+"'"+channelsId+"'"+')"  id="miniChatRemoveThatHidden'+channelsId+'" class="miniChatHeadTitleCloseSmall glyphicon glyphicon-remove"></div>';
		var isOnlineUser= '<div id="miniChatMiniIconIsOnline'+channelsId+'" class="miniChatHeadTitleOnlineIs glyphicon glyphicon-ok-sign"></div>';
		var hasUserWrote= '<div id="miniChatMiniIconIsUserWrote'+channelsId+'" class="miniChatHeadTitleUserWroteIs glyphicon glyphicon-envelope"></div>';
			if(typeof dataFriend.pic != 'undefined' && dataFriend.pic != ''){
				dtFriendHtml += '<div id="miniChatFloatingThiss'+channelsId+'" data-pid="'+dataFriend._id+'" class="miniChatFloatingCircle miniChatFloatingThis"><div class="minichatMakeCircleImage"><img class="miniChatFloatingFriendsPhoto" src="/files/'+dataFriend.email+'/'+dataFriend.pic+'" alt=""></div><div class="miniChatTextOfUser">'+dataFriend.name+'</div></div>';
			}else{
				dtFriendHtml += '<div id="miniChatFloatingThiss'+channelsId+'" data-pid="'+dataFriend._id+'" class="miniChatFloatingCircle miniChatFloatingThis"><div class="minichatMakeCircleImage"><img class="miniChatFloatingFriendsPhoto" src="/files/brand/logo.png" alt=""></div><div class="miniChatTextOfUser">'+dataFriend.name+'</div></div>';
				
				//dtFriendHtml += '<div id="miniChatFloatingThiss'+channelsId+'" data-pid="'+dataFriend._id+'" class="miniChatFloatingThis miniChatFloatingThisTextStyle"><div>'+dataFriend.name+'</div></div>';
			}
		var addHtml = '<div id="miniChatUsersFriendsViewFloatingUs'+channelsId+'" class="miniChatFloatingUsersFriend">'+hasUserWrote+isOnlineUser+xInHead+dtFriendHtml+'</div>';
		$('#miniChatUsersFriendsViewFloating').append(addHtml);
		listenFriendsOptions(channelsId);
		miniChatClickedAddTo(channelsId, true);
		setConnectedUsers(api.socketService.user_connected);
	}
}
function miniChatClickedNotif(personsId){
	if(!$('#miniChatUsersFriendsViewFloatingUs'+personsId).length){
		var dataFriend = { _id: api.data._id  };
	$(".friend_req_h").removeClass("notifmakered");
		var dtFriendHtml = '';
		var xInHead= '<div onclick="miniChatRemoveWindowChatInMin('+"'"+personsId+"'"+')" id="miniChatRemoveThatHidden'+personsId+'" class="miniChatHeadTitleCloseSmall glyphicon glyphicon-remove"></div>';
		//var callsmth = '<span onclick="miniChatDoCall('+"'"+personsId+"'"+')" class="glyphicon glyphicon-earphone chatCallingBtn"></span>';
		//var isOnlineUser= '<div id="miniChatMiniIconIsOnline'+personsId+'" class="miniChatHeadTitleOnlineIs glyphicon glyphicon-ok-sign"></div>'+callsmth;
		//var hasUserWrote= '<div id="miniChatMiniIconIsUserWrote'+personsId+'" class="miniChatHeadTitleUserWroteIs glyphicon glyphicon-envelope"></div>';
			//if(typeof dataFriend.pic != 'undefined' && dataFriend.pic != ''){
			//	dtFriendHtml += '<div id="miniChatFloatingThiss'+personsId+'" data-pid="'+dataFriend._id+'" class="miniChatFloatingCircle miniChatFloatingThis"> '+' <div class="minichatMakeCircleImage"><img class="miniChatFloatingFriendsPhoto" src="/files/'+dataFriend.email+'/'+dataFriend.pic+'" alt=""></div><div class="miniChatTextOfUser">'+dataFriend.firstname+' '+dataFriend.lastname+'</div></div>';
			//}else{
				dtFriendHtml += '<div id="miniChatFloatingThiss'+personsId+'" data-pid="'+dataFriend._id+'" class="miniChatFloatingCircle miniChatFloatingThis"> '+' <div class="minichatMakeCircleImage"></div><div class="miniChatTextOfUser">Notifications</div></div>';

			//}
		var addHtml = '<div id="miniChatUsersFriendsViewFloatingUs'+personsId+'" class="miniChatFloatingUsersFriend">'+xInHead+dtFriendHtml+'</div>';
		$('#miniChatUsersFriendsViewFloating').append(addHtml);
		listenFriendsOptions(personsId);
		miniChatClickedAddTo(personsId, false, true);
	}
}
function miniChatClicked(personsId){
	if ($(window).width() < 816) {
		hideOrShowNotificationn();
	}
	if(!$('#miniChatUsersFriendsViewFloatingUs'+personsId).length){
		var dataFriend = getFriendDataById(personsId);
		api.deleteNotification(api.data.email, dataFriend.email);
		var dtFriendHtml = '';
		var xInHead= '<div onclick="miniChatRemoveWindowChatInMin('+"'"+personsId+"'"+')" id="miniChatRemoveThatHidden'+personsId+'" class="miniChatHeadTitleCloseSmall glyphicon glyphicon-remove"></div>';
		var callsmth = '<span onclick="miniChatDoCall('+"'"+personsId+"'"+')" class="glyphicon glyphicon-earphone chatCallingBtn"></span>';
		var isOnlineUser= '<div id="miniChatMiniIconIsOnline'+personsId+'" class="miniChatHeadTitleOnlineIs glyphicon glyphicon-ok-sign"></div>'+callsmth;
		var hasUserWrote= '<div id="miniChatMiniIconIsUserWrote'+personsId+'" class="miniChatHeadTitleUserWroteIs glyphicon glyphicon-envelope"></div>';
			if(typeof dataFriend.pic != 'undefined' && dataFriend.pic != ''){
				dtFriendHtml += '<div id="miniChatFloatingThiss'+personsId+'" data-pid="'+dataFriend._id+'" class="miniChatFloatingCircle miniChatFloatingThis"> '+hasUserWrote+isOnlineUser+' <div class="minichatMakeCircleImage"><img class="miniChatFloatingFriendsPhoto" src="/files/'+dataFriend.email+'/'+dataFriend.pic+'" alt=""></div><div class="miniChatTextOfUser">'+dataFriend.firstname+' '+dataFriend.lastname+'</div></div>';
			}else{
				dtFriendHtml += '<div id="miniChatFloatingThiss'+personsId+'" data-pid="'+dataFriend._id+'" class="miniChatFloatingCircle miniChatFloatingThis"> '+hasUserWrote+isOnlineUser+' <div class="minichatMakeCircleImage"><img class="miniChatFloatingFriendsPhoto" src="/files/brand/logo.png" alt=""></div><div class="miniChatTextOfUser">'+dataFriend.firstname+' '+dataFriend.lastname+'</div></div>';

			}
		var addHtml = '<div id="miniChatUsersFriendsViewFloatingUs'+personsId+'" class="miniChatFloatingUsersFriend">'+xInHead+dtFriendHtml+'</div>';
		$('#miniChatUsersFriendsViewFloating').append(addHtml);
		listenFriendsOptions(personsId);
		miniChatClickedAddTo(personsId, false);
		setConnectedUsers(api.socketService.user_connected);
	}
}
function startListiningOnImgsToOpenShow(){
									$(".minichatMessages img").unbind( "click" );
									$(".minichatMessages img").click(function(){
										var this_img = $(this).attr("src");
										var html_th_img = "<img class='mini_chat_img_here_top_all' src='"+this_img+"' alt='' />";
										window.app.commands.execute("app:dialog:simple", {
											title:"",
											message:html_th_img
										});
									});
}
function miniChatClickedAddTo(personsId, isChannel, isNotif=false){
	/*$('#mini_chat'+personsId).removeClass('wroteToUser');*/
	var peopleHtml = "";
	var peopleHtmlIs = "";
	var fetchMessages = "";
	var dataFriend = [];
	
	if(isChannel && !isNotif){
		fetchMessages = api.getMessagesCustomFirstId(personsId,personsId);
		dataFriend = getChannelDataById(personsId);
		dataFriend.firstname = dataFriend.name;
		dataFriend.lastname = '';
		peopleHtmlIs = " <span class='channelShowMorePeople' onclick='$("+'"#showPeopleOfThat'+personsId+'"'+").toggle();'><span class='glyphicon glyphicon-user'></span> "+dataFriend.people.length+' <span class="glyphicon glyphicon-ok-sign"></span>  <span class="howmanyOnlineinChannelsAll" id="howmanychannel'+personsId+'">0</span> </span></span>';
		peopleHtml += "<div class='minichatMessagesTop channelPeopleAllInIt' data-id='"+personsId+"' id='showPeopleOfThat"+personsId+"' style='display:none;   position: absolute; '>";
		for(var ii=0; ii < dataFriend.people.length; ii++){
			if(ii == 0){
				peopleHtml += "<span id='inChannelPeopleConn"+dataFriend.people[ii]._id+"'><span class='isOnlinePersonInChannel glyphicon glyphicon-ok-sign' style='display:none;'></span><a href='/#/"+dataFriend.people[ii].email+"'>"+dataFriend.people[ii].firstname+" "+dataFriend.people[ii].lastname+"</a></span>";
			}else{
				peopleHtml += ", "+"<span id='inChannelPeopleConn"+dataFriend.people[ii]._id+"'><span class='isOnlinePersonInChannel glyphicon glyphicon-ok-sign' style='display:none;'></span><a href='/#/"+dataFriend.people[ii].email+"'>"+dataFriend.people[ii].firstname+" "+dataFriend.people[ii].lastname+"</a></span>";
			}
		}
		peopleHtml += "</div>";
	}else {
		dataFriend = getFriendDataById(personsId);
		if (isNotif) {
			dataFriend = {_id: api.data._id, firstname: api.data.firstname, lastname: api.data.lastname, email: api.data.email };
		}
		fetchMessages = api.getMessages(personsId);
	}
	if(fetchMessages !== 'error'){
		fetchMessages.success(function(data) {
						var allMsgs = '';
						var itsChannel = "";
						if(isChannel){
							itsChannel = personsId;
						}
						api.addToArrayData('messagesData'+personsId+itsChannel,data);
						var msgs = data.messages;
						//msgs.reverse();
						var currentDay = "";
						var utcToday = new Date().toJSON().slice(0,10).replace(/-/g,'/').split("/");
						
						for(var ii=0; ii < msgs.length;ii++){
							if (msgs[ii].date && msgs[ii].date.split) {
								var dateHere = msgs[ii].date.split(" ");
								if (currentDay != dateHere[2]) {
									currentDay = dateHere[2];
									msgs[ii].addCurrentDay = dateHere[0]+"/"+dateHere[1]+"/"+dateHere[2];
									
									if (utcToday[2] == dateHere[2]) {
										msgs[ii].addCurrentDay = "TODAY";
									}
								}
								addToObjPicFriend(msgs[ii]);
								msgs[ii].isChannel = isChannel;
								
								allMsgs += addChatMessage(msgs[ii], dataFriend);
							}
						}
						if(!$('#minichatMessages'+personsId).length){
							var chatWindowtml = addChatWindowParams(personsId, personsId, isChannel);
							var xInHead= '';//'<div onclick="miniChatCloseWindowChatInMin('+"'"+personsId+"'"+')" class="miniChatHeadTitleClose glyphicon glyphicon-remove"></div>';
							var headerInHtml = '<div class="minichatMessagesTop" style="display:none;"><a href="/#'+dataFriend.email+'">'+dataFriend.firstname+' '+dataFriend.lastname+'</a>'+peopleHtmlIs+xInHead+'</div>'+peopleHtml;
							if(typeof dataFriend.email == "undefined"){
								headerInHtml = '<div class="minichatMessagesTop"><div class="aboutchannel">'+dataFriend.firstname+' '+dataFriend.lastname+'</div> '+peopleHtmlIs+xInHead+'</div>'+peopleHtml;
							}
							
							var addchannelClassTo = "";
							if(isChannel){
								addchannelClassTo = "channelOfWindow";
							}		
							
							$('#miniChatUsersFriendsViewFloatingUs'+personsId).append('<div id="miniChatMsgsOuter'+personsId+'" class="chatWindowView '+addchannelClassTo+'">'+headerInHtml+chatWindowtml+'</div>');
							$('#minichatMessages'+personsId).html(allMsgs);
							$('#minichatMessages'+personsId).scrollTop($('#minichatMessages'+personsId)[0].scrollHeight+2200);
							setTimeout(function(){
								$('#minichatMessages'+personsId).scrollTop($('#minichatMessages'+personsId)[0].scrollHeight+2200);
									startListiningOnImgsToOpenShow();
							},10);
							/*var widthOfChat = "200px";
							var sizeOfchV = $('#chatView').length;
							widthOfChat = (sizeOfchV+205+200)+'px';
							$('#chatVieww').css('width',widthOfChat);*/
						}
						/*$('#minichatMessages').html(allMsgs);
						if(typeof $('#minichatMessages')[0] != 'undefined'){
						$('#minichatMessages').scrollTop($('#minichatMessages')[0].scrollHeight);	
						}*/
						setConnectedUsers(api.socketService.user_connected);
					}).error(function(status, data) {});
	}
	
}
function addToObjPicFriend(obj){
	for(var i=0; i < api.data.friends.length; i++){
		if(obj.email === api.data.friends[i].from){
			if(typeof api.data.friends[i].pic != 'undefined' && api.data.friends[i].pic != ''){
				obj.pic = api.data.friends[i].pic;
			}
			obj.firstname = api.data.friends[i].firstname;
			obj.lastname = api.data.friends[i].lastname;
		}
	}
}
function addChatMessage(msgs, getFriendsData = ""){
	var msgDesc = '';
	
	if (typeof msgs.addCurrentDay != "undefined" && msgs.addCurrentDay != "") {
									msgDesc += '<div class="daySeparator"><div class="dayy">'+msgs.addCurrentDay+'</div></div>';
								}
							if(msgs.from != api.data.email){
								msgDesc += '<div id="messagesContainerInnerHere">';
								msgDesc += '<div class="messages_from_them">';
								if(typeof msgs.pic != 'undefined' && msgs.pic != ''){
									msgDesc += '<div class="message_from_left_for_photo">';
									msgDesc += '  <div class="message_from_left">';
									msgDesc += '   <img class="profileListPhoto" src="/files/'+msgs.from+'/'+msgs.pic+'" alt="">';
									msgDesc += '  </div>';
									msgDesc += '</div>';
								}
								var nameof = "";
								if (msgs.isChannel) {
									nameof = msgs.from+": ";
									if (getFriendsData != "" && typeof getFriendsData != "undefined" && typeof getFriendsData.people != "undefined") {
										var findFriendsData = getFriendsData.people.find(function(peop) { return peop.email ==  msgs.from});
										if (typeof findFriendsData != "undefined") {
											nameof = findFriendsData.firstname+": ";
										}
									}
								}
								var msggs = replaceAllIcons(msgs.message);
								msgDesc += '<div class="message_text_left">'+nameof+msggs;
								msgDesc += '<div>';
								if(typeof msgs.files != 'undefined' && msgs.files != ''){
									msgDesc += '<div>';
									msgDesc += msgs.files;
									msgDesc += '</div>';
								}
								msgDesc += '</div>';
								msgDesc += '<div class="dayyydateright">'+msgs.date.split(" ")[3]+'</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
							}else{
								var msggss = replaceAllIcons(msgs.message);
								msgDesc += '<div id="messagesContainerInnerHere">';
								msgDesc += '<div class="messages_from_them myMessageInChat">';
								msgDesc += '<div class="message_text_left">'+msggss;
								msgDesc += '<div>';
								if(typeof msgs.files != 'undefined' && msgs.files != ''){
									msgDesc += '<div>';
									msgDesc += msgs.files;
									msgDesc += '</div>';
								}
								msgDesc += '</div>';
								msgDesc += '<div class="dayyydateright">'+msgs.date.split(" ")[3]+'</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
							}
	return msgDesc;
}
function getSelectedUsersEmailById(id){
	return $('#mini_chat'+id).attr('data-email');
}
function addChatWindowParams(objId, from_id, isChannel){
	var addHtml = '';
	var onWritting = 'Writing ...';
	var onWhatWritting = 'onMiniChatWritting';
	var miniChatSendMessageSimple = 'chat';
	if(isChannel){
		onWhatWritting = 'onChannelWritting';
		miniChatSendMessageSimple = 'channel';
		var addGetModel = getChannelDataById(objId);
		onWritting = '';
	}else{
		var addGetModel = getFriendDataById(objId);
	}
	var blockedByIt = '';
	var blockedByItText = 'Write a message...';
	if(typeof addGetModel.blockedBy != 'undefined' && addGetModel.blockedBy != '' &&
	addGetModel.blockedBy){
		blockedByIt = 'disabled';
		blockedByItText = 'User has blocked you';
	}
	addHtml += '<div id="minichatMessages'+objId+'" class="minichatMessages"></div>';
	addHtml += '<div id="miniChatonWrittingToUser'+objId+'" class="miniChatonWrittingToUser">'+onWritting+'</div>';
	addHtml += '<div class="miniChatonFileUploadProgress'+objId+'"></div>';
	addHtml += '<div class="bottomsendmsg miniChatBottom" style="background:none!important;">';
	
	var addtoHtmlText = "";
	var disabledProp = "";
	var stylingForDis = "";
	var forSendButtonStyle = "";
	if (!api.isSocketConnected) {
		addtoHtmlText = "Lost connection to server. Trying to reconnect... ";
		disabledProp = 'disabled="disabled"';
		stylingForDis = 'style="border:1px solid red; color:red;"';
		forSendButtonStyle = 'style="border:1px solid #ccc; background: #ccc; color: black;"';
	}
	
    addHtml += '<textarea '+stylingForDis+' '+disabledProp+' '+blockedByIt+' onkeyup="'+onWhatWritting+'('+"'"+from_id+"'"+')" placeholder="'+blockedByItText+'" id="minichatTextareaa'+objId+'" class="minichatTextarea">'+addtoHtmlText+'</textarea>';
    addHtml += '<div class="miniChatLeftSendMsgs"><button '+forSendButtonStyle+' '+blockedByIt+' onclick="miniChatSendMessage('+"'"+objId+"',"+"'"+from_id+"',"+"'"+miniChatSendMessageSimple+"'"+')" class="sendButton sendButtonFromTheChat">Send</button>';
    addHtml += '<button '+forSendButtonStyle+' '+blockedByIt+' onclick="miniChatCallFileUpload('+"'"+objId+"'"+')" class="sendButton addFileButton glyphicon glyphicon-file icon-in-menu icon-turn-off"></button>';
    addHtml += '<input onchange="uploadFilesToServerSendPost('+"this,'"+objId+"',"+"'"+from_id+"','"+miniChatSendMessageSimple+"'"+')" type="file" id="miniChatfileToUpload'+objId+'" style="display:none;">';
    addHtml += '</div></div>';
	return addHtml;
}
function miniChatSendMessage(objId, from_id, chat){
	var chatMsg = $('#minichatTextareaa'+objId).val();
	$('#minichatTextareaa'+objId).val('');
	sendMessageWithText(objId,from_id,chatMsg,'', chat);
	setTimeout(function(){
		$('#minichatTextareaa'+objId).val('');
	},100);
}
function sendMessageWithText(objId,from_id,chatMsg,filesChat, chat){
	var fetchData = "";
	if(chat == 'chat'){
		fetchData = api.getDataFromArray('messagesData'+from_id);
	}else{
		fetchData = api.getDataFromArray('messagesData'+from_id+from_id);
	}
	if(from_id != '' && typeof fetchData == 'undefined'){
		var fetchMessages = "";
		if(chat == 'chat'){
			fetchMessages = api.getMessages(from_id);
		}else{
			fetchMessages = api.getMessagesCustomFirstId(from_id, from_id);
		}
		if(fetchMessages !== 'error'){
			fetchMessages.success(function(data) {
				if(chat == 'chat'){
					sendMsg(chatMsg, data._id, from_id, filesChat);
					hideMiniNotificationsViewIfIs(objId);
				}else{
					sendMsgChannel(chatMsg, data._id, from_id, filesChat);
				}
			});
		}
	}else{
		if(chat == 'chat'){
			sendMsg(chatMsg, fetchData._id, from_id, filesChat);
			hideMiniNotificationsViewIfIs(objId);
		}else{
			sendMsgChannel(chatMsg, fetchData._id, from_id, filesChat);
		}
	}
}
function sendMsg(chatMsg,idMsg,selectedUserId, filesChat){
	if(chatMsg != ''){
			var message = {from: api.data.email, message:chatMsg, files:filesChat};
			var msg = api.sendMessage({id:idMsg, message:message}).done(function() {
				$(".minichatTextarea").attr("style", "");
				
				if(selectedUserId != ''){
					var emailSel = getSelectedUsersEmailById(selectedUserId);
					if (emailSel != api.data.email) {
						api.setNotification(emailSel,message.from+"___"+api.data.firstname+' '+api.data.lastname,message.message,message.files);
						sendThroughSocket(api.data._id, api.data.email, emailSel, message.message, filesChat, api.data._id);
					}
					sendThroughSocket(api.data._id, api.data.email, api.data.email, message.message, filesChat, selectedUserId);
				}
			  })
			  .fail(function() {
				$(".minichatTextarea").val("Error. Message not sent - Check your internet connection. "+chatMsg);
				$(".minichatTextarea").attr("style", "border: 1px solid red; color: red;");
					setTimeout(function(){
						$(".minichatTextarea").val("Error. Message not sent - Check your internet connection. "+chatMsg);
					},101);
			  });
	}
}
function sendMsgChannel(chatMsg, idMsg, selectedUserId, filesChat){
	if(chatMsg != ''){
			var message = {from: api.data.email, message:chatMsg, files:filesChat};
			var msg = api.sendMessage({id:idMsg, message:message}).done(function() {
				$(".minichatTextarea").attr("style", "");

				if(selectedUserId != '') {
				//var emailSel = getSelectedUsersEmailById(selectedUserId);
				//api.setNotification(emailSel,message.from,message.message,message.files);
					sendThroughSocketChannelMessage(selectedUserId, api.data._id, api.data.email, api.data.email, message.message, filesChat, api.data._id);
				}
			})
			.fail(function() {
				$(".minichatTextarea").val("Error. Message not sent - Check your internet connection. "+chatMsg);
				$(".minichatTextarea").attr("style", "border: 1px solid red; color: red;");
				setTimeout(function(){
					$(".minichatTextarea").val("Error. Message not sent - Check your internet connection."+chatMsg);
				},101);
			});
	}
}
function sendThroughSocketChannelMessage(channelId, from_id, from_email, toEmail, msg, filesin, toID){
	api.socketService.emit('channelmessage',{channelId: channelId, from_id:from_id, from:from_email, to:'',toEmail:toEmail,msg:msg, files:filesin,toID:toID});
}
function sendThroughSocket(from_id, from_email, toEmail, msg, filesin,toID){
	api.socketService.emit('chat message',{from_id:from_id, from:from_email, to:'',toEmail:toEmail,msg:msg, message:msg, files:filesin, toID:toID});
}
function onMiniChatWritting(from_id){
	var emailSel = getSelectedUsersEmailById(from_id);
	api.socketService.emit('message_writting',{from:api.data.email, toEmail:emailSel});
}
function onChannelWritting(channelId){
	api.socketService.emit('channel_writting',{fromName:api.data.firstname+' '+api.data.lastname, channelId:channelId, from:api.data.email, toEmail:''});
}
function setConnectedUsers(usersArr){
	$('.miniChatisLoggedInUser').hide();
	$('.miniChatHeadTitleOnlineIs').hide();
	$('.isOnlinePersonInChannel').hide();
	$('.howmanyOnlineinChannelsAll').text('0');
	if(typeof usersArr != 'undefined'){
		for(var i=0;i < usersArr.length; i++){
			var inChannelPeople = $('#inChannelPeopleConn'+getFriendDataByEmail(usersArr[i].name)._id);
			var miniChatReg = $('#miniChatIsLoggedInUser'+getFriendDataByEmail(usersArr[i].name)._id);
			var miniChatRegMiniOnline = $('#miniChatMiniIconIsOnline'+getFriendDataByEmail(usersArr[i].name)._id);
			if(inChannelPeople.length){
				inChannelPeople.find('.isOnlinePersonInChannel').show();
			}
			if(miniChatReg.length){
				miniChatReg.show();
			}
			if(miniChatRegMiniOnline.length){
				miniChatRegMiniOnline.show();
			}
		}
		$('.channelPeopleAllInIt').each(function(){
			var idOfChannel = $( this ).attr("data-id");
				$("#showPeopleOfThat"+idOfChannel+" .isOnlinePersonInChannel").each(function(){
					if($(this).css('display').indexOf('block') > -1){
						var isNowPlusOne = parseInt($("#howmanychannel"+idOfChannel).text())+1;
						$("#howmanychannel"+idOfChannel).text(isNowPlusOne);
					}
				});
			
		});
	}
}
function miniChatListenSocket(){
	api.socketService.off('message_writting');
	api.socketService.off('user_connected');
	api.socketService.off('user_disconnected');
	api.socketService.off('updateFriends');
	api.socketService.off('chat message');

	api.socketService.on('message_writting', function(obj){
		if(typeof obj.channelId != "undefined"){
			var channelData = getChannelDataById(obj.channelId);
			if($('#miniChatonWrittingToUser'+obj.channelId).length){
				$('#miniChatonWrittingToUser'+obj.channelId).show();
				if(!$('#writtingThatGuy'+obj.fromName.replace(' ','')).length){
					if($('#miniChatonWrittingToUser'+obj.channelId).text().indexOf(obj.fromName) == -1){
						$('#miniChatonWrittingToUser'+obj.channelId).prepend('<span class="allThatAreWrittingNow" data-time="'+Date.now()+'" id="writtingThatGuy'+obj.fromName.replace(' ','')+'">'+obj.fromName+' </span>');
					}
				}else{
					$('#writtingThatGuy'+obj.fromName.replace(' ','')).attr('data-time',Date.now());
				}
				setTimeout(function(){
					$( ".allThatAreWrittingNow" ).each(function( index ) {
					var dateTimeStamp = parseInt($( this ).attr('data-time'));
					if((Date.now()-dateTimeStamp) > 1990){
							$( this ).remove();
						if(!$( ".allThatAreWrittingNow" ).length){
							$('#miniChatonWrittingToUser'+obj.channelId).hide();
						}
					}
				});
				}.bind(this), 2000);
			}
		}else{
			var friendData = getFriendDataByEmail(obj.from);
			var emailSel = '';
			if(friendData != ''){
				emailSel = friendData.email;
			}
			if($('#miniChatonWrittingToUser'+friendData._id).length){
					$('#miniChatonWrittingToUser'+friendData._id).show();
					this.onMiniWrittingToUserTimeStamp = Date.now();
					setTimeout(function(){
						if((Date.now()-this.onMiniWrittingToUserTimeStamp) > 1990){
							$('#miniChatonWrittingToUser'+friendData._id).hide();
						}
					}.bind(this), 2000);
			}else{
					var miniChatIsUserWritting = $('#miniChatIsUserWritting'+friendData._id);
					if(miniChatIsUserWritting.length){
						miniChatIsUserWritting.show();
							this.onMiniWrittingToUserTimeStamp = Date.now();
							setTimeout(function(){
								if((Date.now()-this.onMiniWrittingToUserTimeStamp) > 1990){
									miniChatIsUserWritting.hide();
								}
							}.bind(this), 2000);
					}
			}
		}
	});
	api.socketService.on('user_connected', function(obj){
		if (typeof obj.user != "undefined") {
			if (typeof api.socketService != "undefined") {
				if (typeof api.socketService.user_connected == "undefined") {
					api.socketService.user_connected = [obj.user];
				}else{
					if (typeof api.socketService.user_connected.find(function(usr) { return usr.name == obj.user.name }) == "undefined") {
						api.socketService.user_connected.push(obj.user);
					}
				}
			}
		}
		
		if (typeof obj.users != "undefined") {
			api.socketService.user_connected = obj.users;
		}
		setConnectedUsers(api.socketService.user_connected);
	});
	api.socketService.on('user_disconnected', function(obj){
		if (typeof obj.users != "undefined") {
			api.socketService.user_connected = obj.users;
		}
		if (typeof obj.user != "undefined") {
			if (typeof api.socketService != "undefined") {
				if (typeof api.socketService.user_connected == "undefined") {
					api.socketService.user_connected = [];
				}else{
					var newArr = [];
					var usrsconn = api.socketService.user_connected;
					
					for (var ii=0, n= usrsconn.length; ii < n; ii++) {
						if (usrsconn[ii].name != obj.user.name) {
							newArr.push(usrsconn[ii]);
						}
					}
					
					api.socketService.user_connected = newArr;
				}
			}
		}
		
		setConnectedUsers(api.socketService.user_connected);
	});
	api.socketService.on('updateFriends', function(obj){
			if(typeof obj.blockFriendMine != 'undefined' && obj.blockFriendMine != ''){
				for(var ii = 0; ii < obj.blockFriendMine.length; ii++){
					setFriendsAttrById(obj.blockFriendMine[ii]._id, 'blocked', obj.blocked);
				}
			}else{
				if(typeof obj.blockFriend != 'undefined' && obj.blockFriend != ''){
					for(var ii = 0; ii < obj.blockFriend.length; ii++){
						setFriendsAttrById(obj.blockFriend[ii]._id, 'blockedBy', obj.blocked);
						if(obj.blocked){
							if($('#miniChatMsgsOuter'+obj.blockFriend[ii]._id).length){
								$('#minichatTextareaa'+obj.blockFriend[ii]._id).attr('placeholder','User has blocked you');
								$('#minichatTextareaa'+obj.blockFriend[ii]._id).attr('disabled','disabled');
								$('#miniChatMsgsOuter'+obj.blockFriend[ii]._id+' .sendButton').attr('disabled','disabled');
							}
						}else{
							if($('#miniChatMsgsOuter'+obj.blockFriend[ii]._id).length){
								$('#minichatTextareaa'+obj.blockFriend[ii]._id).attr('placeholder','Write a message...');
								$('#minichatTextareaa'+obj.blockFriend[ii]._id).removeAttr('disabled');
								$('#miniChatMsgsOuter'+obj.blockFriend[ii]._id+' .sendButton').removeAttr('disabled');
							}
						}
					}
				}else{
					if(typeof obj.addFriend != 'undefined' && obj.addFriend != ''){
						for(var ii = 0; ii < obj.addFriend.length; ii++){
							addFriendToList(obj.addFriend[ii]);
						}
						rerenderFriendsList();
					}
				}
			}
	});
	api.socketService.on('chat message', function(obj){
		var chat = 'chat';
		if(typeof obj.channelId != 'undefined'){
			chat = 'channel';
			if(getChannelDataById(obj.channelId) == ''){
				showThoseOffChannel(obj);
			}
			obj.date = nowTime();
			obj.msg = replaceAllIcons(obj.msg);
			obj.message = obj.msg;
			obj.isChannel = true;
			var msgZ = addChatMessage(obj, getChannelDataById(obj.channelId));
			if($('#minichatMessages'+obj.channelId).length){
				$('#minichatMessages'+obj.channelId).append(msgZ);
				$('#minichatMessages'+obj.channelId).scrollTop($('#minichatMessages'+obj.channelId)[0].scrollHeight);
			}
			if (document.hidden) {
				new Notification(obj.from+" wrote a message in channel", { body: obj.message });
			}
			chatMessageShowNotification(obj, chat);
		}else{
			if(getFriendDataById(obj.from_id) == ''){
				showThoseOff(obj);
			}
			obj.date = nowTime();
			obj.msg = replaceAllIcons(obj.msg);
			obj.message = obj.msg;
			obj.isChannel = false;
			var msgZ = addChatMessage(obj);
			if($('#minichatMessages'+obj.toID).length){
				$('#minichatMessages'+obj.toID).append(msgZ);
				$('#minichatMessages'+obj.toID).scrollTop($('#minichatMessages'+obj.toID)[0].scrollHeight);
			}
			chatMessageShowNotification(obj, chat);
			if (("Notification" in window)) {
				if (document.hidden) {
					new Notification(obj.from+" wrote a message to you", { body: obj.message });
					
				}
		    }
		}
		startListiningOnImgsToOpenShow();
	});
}
function replaceAllIcons(msg) {
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
function showThoseOff(obj){
		api.sendShowConv(obj.from_id);
		setFriendsAttrById(obj.from_id, 'show', true);
		rerenderFriendsList();
}
function showThoseOffChannel(obj){
		setChannelsAttrById(obj.from_id, 'show', true);
		rerenderFriendsList();
}
function rerenderFriendsList(){
			var friendsList = api.allFriends.filter(function(el){ return el.show; });
			listFriends(friendsList);
			api.friendsList = friendsList;
			rerenderSocketFriends();
			
			setConnectedUsers(api.socketService.user_connected);
}
function rerenderSocketFriends() {
	var allfriends = api.allFriends.filter(function(el){ return el.show; });
	
	var friendsSend = [];
	for (var ii=0, n = allfriends.length; ii < n; ii++) { friendsSend.push({ email: allfriends[ii].email }); }
	
	if (typeof api.friendsSendForSocket != "undefined") {
		api.friendsSendForSocket.friendslist = friendsSend;
	}
}
function chatMessageShowNotification(obj, chat){
	var tid = obj.toID;
	if(chat != 'chat'){
		tid = obj.channelId;
	}
	if($('#minichatMessages'+tid).length){
		$('#minichatMessages'+tid).scrollTop($('#minichatMessages'+tid)[0].scrollHeight);
	}else{
		$('#mini_chat'+tid).addClass('wroteToUser');
	}
		if($('#miniChatMiniIconIsUserWrote'+tid).length){
			if(!$('#miniChatMsgsOuter'+tid).is(':visible')){
				$('#miniChatMiniIconIsUserWrote'+tid).show();
			}
		}else{
			if(!$('#notificationsView').is(':visible')){
				var edata = "";
				if(chat == 'chat'){
					edata = getFriendDataByEmail(obj.from);
				}else{
					edata = getChannelDataById(obj.channelId);
				}
				if(obj.from !== api.data.email && edata != ''){
					var numb = $('.miniChatmessagesNewUsers').html();
					if(numb == ''){
						numb = 1;
					}else{
						numb = parseInt(numb);
						numb++;
					}
					$('.miniChatmessagesNewUsers').html(numb);
					$('.miniChatmessagesNewUsers').addClass("showNewMessages");
					$('.miniChatmessagesNewUsers').show();
					$('#showNotifications').addClass('newMessageNotification');
				}
			}
		}
}
function nowTime(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1;
                var hours = today.getHours();
                var minutes = today.getMinutes();

                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd;
                }
                if(mm<10){
                    mm='0'+mm;
                }                
				if(hours<10){
                    hours='0'+hours;
                }                
				if(minutes<10){
                    mm='0'+minutes;
                }
                var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes;
                return today;
}