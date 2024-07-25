
var api = {
			objData: [],
            getCredentials: function (id) {
                return $.get('/user/'+id);
            },
			addToArrayData: function(key,data){
				api.objData[key] = data;
			},
			getNotifications: function () {
                return $.get('/commentsU/notificationsForUser/'+0+'/true');
            },
            setNotification: function (email, emailFrom, message, files) {
                return api.sendPostData('/commentAddByUser',{id:'notificationsForUser'+email, message:{from:emailFrom, message: message,files:files}});
            },
            deleteNotification: function (email,emUser) {
                return api.sendPostData('/commentAddByUser',{id:'notificationsForUser'+email, rFrom:emUser});
            },
            sendShowConv: function (userID) {
                return api.sendPutData('/updateuser',{email:api.data.email, removeFriends:[{_id:userID, remove:false}]});
            },
			getDataFromArray: function(key){
				return api.objData[key];
			},
			sendPutData: function(url,dataObj){
			return $.ajax({
				type:"PUT",
				contentType: 'application/json; charset=utf-8',
				url: url,
				data: JSON.stringify(dataObj),
				dataType: 'json'
				});
			},
			sendPostData: function(url,dataObj){
			return $.ajax({
				type:"POST",
				contentType: 'application/json; charset=utf-8',
				url: url,
				data: JSON.stringify(dataObj),
				dataType: 'json'
				});
			},
            sendMessage: function (obj) {
			return $.ajax({
            type:"POST",
            contentType: 'application/json; charset=utf-8',
            url: "/message",
            data: JSON.stringify(obj)
			});
            },
            getMessagesCustomFirstId: function (id, id2) {
                    return $.get('/messages/'+id+'/'+id2);
			},
            getMessages: function (id2) {
				if(typeof api.data != 'undefined' && api.data != ''){
                    return $.get('/messages/'+api.data._id+'/'+id2);
                }else{
					return 'error';
				}
            },
            getMyChannels: function (skip) {
				if(typeof api.data != 'undefined' && api.data != ''){
                    return $.get('/getMyChannels/'+api.data._id+'/'+skip);
                }else{
					return 'error';
				}
            },
			getChannelsData: function(callback){
				if(typeof api.dataChannels != 'undefined' && api.dataChannels != ''){
                    callback(api.dataChannels);
                }else{
					api.getMyChannels(0).success(function(data) {
						callback(data);
					}).error(function(status, data) {
						callback('error');
					});
				}
			},
			getCredData: function(callback, id, resetData=false){
				if(typeof api.data != 'undefined' && api.data != '' && !resetData){
                    callback(api.data);
                }else{
					api.getCredentials(id).success(function(data) {
						api.data = JSON.parse(data);
						callback(JSON.parse(data));
					}).error(function(status, data) {
						callback('error');
					});
				}
			}
        };
function hideOrShowNotificationn(){
		if($('#miniNotificationsView').is(':visible') && $('#miniNotificationsView').css('height') != '0px'){
			hideNotificationMini();
		}else{
			if($('#notificationsView').is(':visible') && $('#showNotifications').css('bottom') != '0px'){
				$('#showNotifications').css('bottom','0px');
				$('#showNotifications').addClass('bottom0px');
				$('#notificationsView').hide();
				menuDownAdd();
			}else{
				$('.miniChatmessagesNewUsers').html('');
				$('.miniChatmessagesNewUsers').hide();
				$('#showNotifications').css('bottom','400px');
				$('#showNotifications').removeClass('bottom0px');
				$('#notificationsView').show();
				$('#showNotifications').removeClass('newMessageNotification');
				menuUpAdd();
			}
		}
}
function listeningToShow(){
	$('#showNotifications').off('click');
	$('#showNotifications').click(function(){
		hideOrShowNotificationn();
	});
}
function hideMiniNotificationsViewIfIs(objId){
		if($('#miniNotificationsView').is(':visible') && $('#miniNotificationsView').css('height') != '0px'){
			$('#miniChatObject'+objId).html('');
			setShowNotifHeightButton();
		}
}
function hideNotificationMini(){
	$('#miniNotificationsView').html('');
	$('#miniNotificationsView').hide();
	$('#showNotifications').css('top','0px');
}
function showNotificationMini(htmlData){
	$('#miniNotificationsView').show();
	$('#miniNotificationsView').html(htmlData);
	setShowNotifHeightButton();
	menuUpAdd();
}
function setShowNotifHeightButton(){
		$('#showNotifications').css('top',$('#miniNotificationsView').css('height'));
}
function getNotificationMiniHtml(){
	return $('#miniNotificationsView').html();
}
function menuDownAdd(){
	//$('.openCloseMiniNot').removeClass('glyphicon-menu-up');
	//$('.openCloseMiniNot').addClass('glyphicon-menu-down');
}
function menuUpAdd(){
	//$('.openCloseMiniNot').removeClass('glyphicon-menu-down');
	//$('.openCloseMiniNot').addClass('glyphicon-menu-up');
}