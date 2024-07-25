			function miniChatCallFileUpload(objId){
				$('#miniChatfileToUpload'+objId).trigger('click');
			}
             function uploadFilesToServerSendPost(filess,objId,from_id){
				var files = document.getElementById('miniChatfileToUpload'+objId).files;
                var fd = new FormData();
                fd.append("project", 'files');
                for (var i in files) {
                    fd.append("uploadedFile", files[i]);
                }
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
                    //common.trigger('send:message',{msg:'', files:msgIn});
					sendMessageWithText(objId,from_id,'_',msgIn);
                    $('.miniChatonFileUploadProgress'+objId).hide();
                }.bind(this), false);
                //xhr.addEventListener("error", uploadFailed, false);
                //xhr.addEventListener("abort", uploadCanceled, false);
                xhr.open("POST", "/messages_file_upload");
                xhr.send(fd);
            }
function startMiniChat(socket, data){
	api.socketService = socket;
	api.socketService.connectedUsers = '';
	api.getCredData(function(dt){
		if(dt != 'error'){
			listeningToShow();
			miniChatListenSocket();
			var friendsList = dt.friends.filter(function(el){ return el.show; });
			listFriends(friendsList);
			if(friendsList.length > 0){
				miniChatClicked(friendsList[0]._id);
			}
		}else{
			//Not logged in
		}
	}, data);
}
function listFriends(friendsList){
			var friendsHtml = '';
			var msgsFirst = '';
			for(var i=0; i < friendsList.length; i++){
				if(i==0){
					friendsHtml += '<div id="mini_chat'+friendsList[i]._id+'" data-email="'+friendsList[i].email+'" onclick="miniChatClicked('+"'"+friendsList[i]._id+"'"+')" class="userChoose miniChatSelectedUser min_chat_choose_user">';
				}else{
					friendsHtml += '<div id="mini_chat'+friendsList[i]._id+'" data-email="'+friendsList[i].email+'" onclick="miniChatClicked('+"'"+friendsList[i]._id+"'"+')" class="userChoose min_chat_choose_user">';
				}
				if(friendsList[i].pic != ''){
					friendsHtml += '<div class="message_from_left_for_photo">';
					friendsHtml += '<img class="message_from_left miniChatListPhoto" src="/files/'+friendsList[i].pic+'" alt="">';
					friendsHtml += '</div>';
				}
				friendsHtml += '<div class="usersNameBv">';
				friendsHtml += friendsList[i].firstname+' '+friendsList[i].lastname;
				friendsHtml += '</div>';
				friendsHtml += '<div class="bottom"></div>';
				friendsHtml += '</div>';
			}
			$('#friendsView').html(friendsHtml);
			$('#chatWindowView').html(addChatWindow());
}
function miniChatClicked(personsId){
	api.selectedUser = personsId;
	$('.miniChatSelectedUser').removeClass('miniChatSelectedUser');
	$('#mini_chat'+personsId).addClass('miniChatSelectedUser');
	var fetchMessages = api.getMessages(personsId);
	if(fetchMessages !== 'error'){
		fetchMessages.success(function(data) {
			api.selectedUserMessage = data;
						var allMsgs = '';
						var msgs = data.messages;
						msgs.reverse();
						for(var ii=0; ii < msgs.length;ii++){
							addToObjPicFriend(msgs[ii]);
							allMsgs += addChatMessage(msgs[ii]);
						}
						$('#minichatMessages').html(allMsgs);
						if(typeof $('#minichatMessages')[0] != 'undefined'){
						$('#minichatMessages').scrollTop($('#minichatMessages')[0].scrollHeight);	
						}
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
function addChatMessage(msgs){
	var msgDesc = '';
							if(msgs.from != api.data.email){
								msgDesc += '<div id="messagesContainerInnerHere">';
								msgDesc += '<div class="messages_from_them">';
								if(typeof msgs.pic != 'undefined' && msgs.pic != ''){
									msgDesc += '<div class="message_from_left_for_photo">';
									msgDesc += '  <div class="message_from_left">';
									msgDesc += '   <img class="profileListPhoto" src="/files/'+msgs.pic+'" alt="">';
									msgDesc += '  </div>';
									msgDesc += '</div>';
								}
								msgDesc += '<div class="message_text_left">'+msgs.message;
								msgDesc += '<div>';
								if(typeof msgs.files != 'undefined' && msgs.files != ''){
									msgDesc += '<div>';
									msgDesc += msgs.files;
									msgDesc += '</div>';
								}
								msgDesc += '</div>';
								msgDesc += '<div style="font-size:10px;">'+msgs.date+'</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
							}else{
								msgDesc += '<div id="messagesContainerInnerHere">';
								msgDesc += '<div class="messages_from_them myMessageInChat">';
								msgDesc += '<div class="message_text_left">'+msgs.message;
								msgDesc += '<div>';
								if(typeof msgs.files != 'undefined' && msgs.files != ''){
									msgDesc += '<div>';
									msgDesc += msgs.files;
									msgDesc += '</div>';
								}
								msgDesc += '</div>';
								msgDesc += '<div style="font-size:10px;">'+msgs.date+'</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
								msgDesc += '</div>';
							}
	return msgDesc;
}
function getSelectedUsersEmailById(id){
	return $('#mini_chat'+id).attr('data-email');
}
function addChatWindow(){
	return addChatWindowParams('','');
}
function addChatWindowParams(objId, from_id){
	var addHtml = '<div id="minichatMessages"></div>';
	addHtml += '<div class="miniChatonWrittingToUser">Writting ...</div>';
	addHtml += '<div class="miniChatonFileUploadProgress'+objId+'"></div>';
	addHtml += '<div class="bottomsendmsg miniChatBottom" style="background:none!important;">';
    addHtml += '<textarea onkeyup="onMiniChatWritting()" placeholder="Message ..." id="minichatTextareaa'+objId+'" class="minichatTextarea"></textarea>';
    addHtml += '<div class="miniChatLeftSendMsgs"><button onclick="miniChatSendMessage('+"'"+objId+"',"+"'"+from_id+"'"+')" class="sendButton">Send</button>';
    addHtml += '<button onclick="miniChatCallFileUpload('+"'"+objId+"'"+')" class="sendButton addFileButton glyphicon glyphicon-file icon-in-menu icon-turn-off"></button>';
    addHtml += '<input onchange="uploadFilesToServerSendPost('+"this,'"+objId+"',"+"'"+from_id+"'"+')" type="file" id="miniChatfileToUpload'+objId+'" style="display:none;">';
    addHtml += '</div></div>';
	return addHtml;
}
function miniChatSendMessage(objId,from_id){
	var chatMsg = $('#minichatTextareaa'+objId).val();
	$('#minichatTextareaa'+objId).val('');
	sendMessageWithText(objId,from_id,chatMsg,'');
}
function sendMessageWithText(objId,from_id,chatMsg,filesChat){
	if(from_id != ''){
		var fetchMessages = api.getMessages(from_id);
		if(fetchMessages !== 'error'){
			fetchMessages.success(function(data) {
				sendMsg(chatMsg, data._id, from_id, filesChat);
				$('#miniChatObject'+objId).html('');
				setShowNotifHeightButton();
			});
		}
	}else{
		sendMsg(chatMsg,api.selectedUserMessage._id,api.selectedUser,filesChat);
	}
}
function sendMsg(chatMsg,idMsg,selectedUserId, filesChat){
	if(chatMsg != ''){
			var message = {from: api.data.email, message:chatMsg, files:filesChat};
			var msg = api.sendMessage({id:idMsg, message:message});
			if(selectedUserId != ''){
				var emailSel = getSelectedUsersEmailById(selectedUserId);
				sendThroughSocket(api.data._id, api.data.email, api.data.email, message.message, filesChat);
				sendThroughSocket(api.data._id, api.data.email, emailSel, message.message, filesChat);
		}
	}
}
function sendThroughSocket(from_id, from_email, toEmail, msg, filesin){
	api.socketService.emit('chat message',{from_id:from_id, from:from_email, to:'',toEmail:toEmail,msg:msg, message:msg, files:filesin});
}
function onMiniChatWritting(){
	var emailSel = getSelectedUsersEmailById(api.selectedUser);
	api.socketService.emit('message_writting',{from:api.data.email, toEmail:emailSel});
}
function miniChatListenSocket(){
	api.socketService.on('message_writting', function(obj){
		var emailSel = getSelectedUsersEmailById(api.selectedUser);
		if(obj.from === emailSel){
                $('.miniChatonWrittingToUser').show();
                this.onMiniWrittingToUserTimeStamp = Date.now();
                setTimeout(function(){
                    if((Date.now()-this.onMiniWrittingToUserTimeStamp) > 1990){
                        $('.miniChatonWrittingToUser').hide();
                    }
                }.bind(this), 2000);
		}
	});
	api.socketService.on('user_connected', function(obj){
		api.socketService.connectedUsers = obj.users;
	});
	api.socketService.on('user_disconnected', function(obj){
		api.socketService.connectedUsers = obj.users;
	});
	api.socketService.on('chat message', function(obj){
			if(obj.from_id === api.selectedUser || 
				obj.from_id === api.data._id){
					obj.date = nowTime();
					obj.message = obj.msg;
						var msgZ = addChatMessage(obj);
						$('#minichatMessages').append(msgZ);
						$('#minichatMessages').scrollTop($('#minichatMessages')[0].scrollHeight);
			}
		if(!$('#notificationsView').is(':visible')){
			if(obj.from !== api.data.email){
				obj.date = nowTime();
				obj.message = obj.msg;
				addToObjPicFriend(obj);
				var msgZ = addChatMessage(obj);
				var objIdUniq = obj.date.replace(/ /g,'_').replace(':','')+Math.floor((Math.random() * 1000) + 1);
				var chatWindow = addChatWindowParams(objIdUniq,obj.from_id);
				var chatMsg = '<div class="miniChatBackMessage">'+chatWindow+'</div>';
				msgZ = '<div id="miniChatObject'+objIdUniq+'" style="clear:both;"><div class="miniChatMiniNotName">'+obj.firstname+' '+obj.lastname+'</div>'+msgZ+chatMsg+'</div>';
				var wasData = getNotificationMiniHtml();
				showNotificationMini(wasData+msgZ);
			}
		}
		
	});
}
function nowTime(){
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
}