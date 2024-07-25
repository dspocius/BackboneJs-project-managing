define([
	'../../../app',
	'../../../config',
    'backbone',
    'underscore',
    '../views/createView',
    '../views/projectGridView',
    '../views/projectGridRowView',
    '../collections/projectsCollection',
    'models/project',
    'collections/Nav',
    'views/MenuView',
    'views/EmptyView',
    'views/rightModalView',
	'../../viewmodules/projectViews/calendar/projectCalendarView',
	'../../viewmodules/projectViews/list/projectListView',
	'controllers/baseController',
	'../../viewmodules/projectView'
], function( app, config, Backbone, _, createView, projectGridView, projectGridRowView, projectsCollection, project, Nav, MenuView, EmptyView, rightModalView, projectCalendarView, projectListView, baseController, projectViews ) {
    var projectsContr = baseController.extend({
        show: function(options){
			var thh = this;
			var peopleColAdd = "";
			if (typeof options != "undefined" && typeof options.peopleCol != "undefined") {
				peopleColAdd = options.peopleCol;
			}

			thh.optionsInPro = options;
			var mainViewShowingNow = this.getMainViewOfSite(options);
			this.mainViewShowingInNow = mainViewShowingNow;
			var pressedOtherView = false;
			var mainViewObject = {};
			var navigationModelObj = "";
            var id = '';
            var id_on_link = '_';
            var islistOne = false;
            var projectsShared = this.getProject("friends");
            var projects = this.mainProject;
			if(typeof options != 'undefined' && typeof options.people != 'undefined' && options.people != ''){
				projects = this.getProjectOfPerson(options.people);
			}
			
            var visibilityOfItGlobal = "";
            var navigation_pr = "";
            var cView = "";
            var cBoardView = "";
            var cCalendarView = "";
            var cListView = "";
			var cCreatedViews = [];
			var cCreatedViewsFunc = [];
            var navLinks = '<a href="#home">'+app.translate('Home')+'</a>';
			var functionToBeCalledToAddShared = "";
			
			var renderHeadersData = function(thisProj){
				app.renderHeadersData(thisProj);
			}
			
			var addToFriendsArray = function(addHimToMe, addMeToThat, email, reload=true, showMessages=false, alreadySend=false, which="") {
				addHimToMe.onlyupdate = alreadySend;
				addHimToMe.which = which;
				addMeToThat.onlyupdate = alreadySend;
				addMeToThat.which = which;

				$.ajax({
				  method: "PUT",
				  url: "/updateuser",
				  data: JSON.stringify({ friendemail:email, addMeToThat:addMeToThat, friendsAdd: [addHimToMe] }),
					contentType: 'application/json; charset=utf-8',
					dataType: 'json'
				}).always(function (msg) {
				  if (reload) {
					startMiniChat(app.socketService,app.userConnected.data2.email, true, function(){
						if (showMessages) {
							miniChatClicked(options.peopleCol.get('_id'));
						}
					});
				  }
				});
			}
			
			var sendWhichRequest = function(which, isAlreadySent=false) {
				var addMeToThat = {
					_id:app.userConnected.data2._id,
					request_sent:true,
					following: false,
					follower: true,
					real_email:app.userConnected.data2.real_email,
					firstname:app.userConnected.data2.firstname,
					lastname:app.userConnected.data2.lastname,
					pic:app.userConnected.data2.pic,
					removed:false,
					show:true
				};
				var addHimToMe = {
					_id: options.peopleCol.get('_id'),
					request_sent:true,
					follower: false,
					email: options.peopleCol.get('email'),
					following: true,
					real_email: options.peopleCol.get('real_email'),
					firstname: options.peopleCol.get('firstname'),
					lastname: options.peopleCol.get('lastname'),
					pic: options.peopleCol.get('pic'),
					removed:false,
					show:true
				};
				
				var writeMessage = false;
				var alreadySend = false;
				
				if (which == "sendMessage") {
					addHimToMe.following = false;
					addHimToMe.request_sent = false;
					addHimToMe.show = true;
					addMeToThat.follower = false;
					addMeToThat.request_sent = false;
					addMeToThat.show = true;
					writeMessage = true;
					
					if ($("#addthatuserone").attr("disabled") == "disabled" || 
					$("#followthatuser").attr("disabled") == "disabled") {
						alreadySend = true;
					}
				}
				
				if (which == "addFriend") {
					if ($("#followthatuser").attr("disabled") == "disabled" || 
					$("#writemessagethatuserOnly").is(":visible")) {
						alreadySend = true;
					}
				}
				if (which == "onlyFollow") {
					addMeToThat.show = false;
					addMeToThat.request_sent = false;
					addHimToMe.request_sent = false;
					addHimToMe.show = false;
					
					if ($("#addthatuserone").attr("disabled") == "disabled" || 
					$("#writemessagethatuserOnly").is(":visible")) {
						alreadySend = true;
					}
				}
				
				if ($("#addthatuserone").attr("disabled") == "disabled" || 
					$("#writemessagethatuserOnly").is(":visible")) {
					addMeToThat.show = true;
					addMeToThat.request_sent = true;
					addHimToMe.request_sent = true;
					addHimToMe.show = true;
				}
				if ($("#addthatuserone").attr("disabled") == "disabled" || 
				$("#followthatuser").attr("disabled") == "disabled") {
					addMeToThat.follower = true;
					addHimToMe.following = true;
				}
				
				if (isAlreadySent) {
					alreadySend = true;
					if ($("#addthatuseroneAlready").attr("disabled") == "disabled" || 
					!$("#addthatuseroneAlready").length) {
						addMeToThat.show = true;
						addMeToThat.request_sent = true;
						addHimToMe.request_sent = true;
						addHimToMe.show = true;
					}
					if ($("#followthatuserAlready").attr("disabled") == "disabled" || 
					!$("#followthatuserAlready").length) {
						addMeToThat.follower = true;
						addHimToMe.following = true;
					}
				}
				
				if (which == "unfollow") {
					addMeToThat.follower = false;
					addHimToMe.following = false;
					if ($("#cancelThatRequestAlready").length && $("#cancelThatRequestAlready").attr("disabled") == "disabled") {
						addMeToThat.show = true;
						addMeToThat.request_sent = false;
						addHimToMe.request_sent = false;
						addHimToMe.show = true;
					}
					
					if ($("#addthatuseroneAlready").length && $("#addthatuseroneAlready").attr("disabled") != "disabled") {
						addMeToThat.show = true;
						addMeToThat.request_sent = false;
						addHimToMe.request_sent = false;
						addHimToMe.show = true;
					}
				}
				if (which == "cancelRequest") {
					addMeToThat.show = true;
					addMeToThat.request_sent = false;
					addHimToMe.request_sent = false;
					addHimToMe.show = true;
					
					if ($("#unfollowThatUserAlready").length && $("#unfollowThatUserAlready").attr("disabled") == "disabled") {
						addMeToThat.follower = false;
						addHimToMe.following = false;
					}
					
					if ($("#followthatuserAlready").length && $("#followthatuserAlready").attr("disabled") != "disabled") {
						addMeToThat.follower = false;
						addHimToMe.following = false;
					}
				}
				
				//addToFriendsArray(addMeToThat, options.peopleCol.get('email'), false, false, alreadySend);
				addToFriendsArray(addHimToMe, addMeToThat, options.peopleCol.get('email'), true, writeMessage, alreadySend, which);
			}
			
			var renderPhotoAccount = function(){
				var getSettingOfInfo = app.getSettingInWhole("info_about");
				if(typeof app.userIsNotLoggedIn === "undefined" || !app.userIsNotLoggedIn){
				if(typeof options != "undefined" && options.peopleCol != "undefined" && typeof options.people != 'undefined' && options.people != '' && (typeof app.userConnected.data2 !== 'undefined' && options.people != app.userConnected.data2.email)){
						
						var userPic = options.peopleCol.get('pic');
						var userID = options.peopleCol.get('_id');
						var userEmail = options.peopleCol.get('email');
						var firstLastname = options.peopleCol.get('firstname')+' '+options.peopleCol.get('lastname');
						var friends_of_me = app.userConnected.data2.friends;
						
						var infoabout = options.peopleCol.get("infoabouthim");
						var infoaboutfr = "";
						if (typeof infoabout != "undefined" && infoabout != "" && infoabout.length > 0) {
							infoaboutfr = infoabout[0];
						}
						var isInFriendsLine = false;
						var isHeBlocked = false;
						var isHeBlockedBy = false;
						var isHeShowing = true;
						var isHeFollowing = false;
						var isRequest_sent = false;
						var isApproved = false;
						var whichFriendObj = "";
						//if(typeof infoaboutfr !== "undefined" && infoaboutfr !== ""){
							for(var j=0; j < friends_of_me.length; j++){
								if(friends_of_me[j]._id === userID){
									isInFriendsLine = true;
									isHeFollowing = friends_of_me[j].following;
									isRequest_sent = friends_of_me[j].request_sent;
									isHeBlocked = friends_of_me[j].blocked;
									isHeBlockedBy = friends_of_me[j].blockedBy;
									isApproved = friends_of_me[j].approved;
									isHeShowing = friends_of_me[j].show;
									whichFriendObj = friends_of_me[j];
								}
							}
						//}
						//$("#addthatuserone .addfriendtext").text(app.translate("Request sent"));

						var ehbuttonsdataFor = '<div class="dropdown" style="display:inline-block;">';
							
						var hehbuttonsdataFor = '  <button id="addthatuserone" class="btn btn-default viewButtonsIn viewsSmallButtonLight" type="button">';
							hehbuttonsdataFor += '<div class="glyphicon glyphicon-user icon-in-menu icon-turn-off" aria-hidden="true"></div><span class="addfriendtext">'+app.translate('Add a friend')+"</span>";
							hehbuttonsdataFor += '</button>';
							
							hehbuttonsdataFor += '  <button id="followthatuser" class="btn btn-default viewButtonsIn viewsSmallButtonLight" type="button">';
							hehbuttonsdataFor += '<div class="glyphicon glyphicon-signal icon-in-menu icon-turn-off" aria-hidden="true"></div><span class="followingtext">'+app.translate('Follow')+"</span>";
							hehbuttonsdataFor += '</button>';
							if (isInFriendsLine) {
								hehbuttonsdataFor = "";
							}
							hehbuttonsdataFor += '  <button id="writemessagethatuser" class="btn btn-default viewButtonsIn viewsSmallButtonLight" type="button">';
							hehbuttonsdataFor += '<div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div>'+app.translate('Message');
							hehbuttonsdataFor += '</button>';
							
							var showAnotherButt = "style='display:none'";
							if(isInFriendsLine){
								showAnotherButt = "";
								hehbuttonsdataFor = "";
								
								if ((isRequest_sent == false || isRequest_sent == 'false') && (isApproved == false || isApproved == 'false')) {
									hehbuttonsdataFor = '  <button id="addthatuseroneAlready" class="btn btn-default viewButtonsIn viewsSmallButtonLight" type="button">';
									hehbuttonsdataFor += '<div class="glyphicon glyphicon-user icon-in-menu icon-turn-off" aria-hidden="true"></div><span class="addfriendtext">'+app.translate('Add a friend')+"</span>";
									hehbuttonsdataFor += '</button>';
								}
								if (isHeFollowing == false || isHeFollowing == 'false') {
									hehbuttonsdataFor += '  <button id="followthatuserAlready" class="btn btn-default viewButtonsIn viewsSmallButtonLight" type="button">';
									hehbuttonsdataFor += '<div class="glyphicon glyphicon-signal icon-in-menu icon-turn-off" aria-hidden="true"></div><span class="followingtext">'+app.translate('Follow')+"</span>";
									hehbuttonsdataFor += '</button>';
								}
							}
							
							hehbuttonsdataFor += '  <button '+showAnotherButt+' id="writemessagethatuserOnly" class="btn btn-default viewButtonsIn viewsSmallButtonLight" type="button">';
							hehbuttonsdataFor += '<div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div>'+app.translate('Message');
							hehbuttonsdataFor += '</button>';
							
							if (isHeBlockedBy || isHeBlockedBy == 'true' || isHeBlocked || isHeBlocked == 'true') {
								hehbuttonsdataFor = "";
							}
						
						
						ehbuttonsdataFor += hehbuttonsdataFor;
							
							var sehbuttonsdataFor = '<div class="expandGoHere"><button class="btn btn-default dropdown-toggle viewButtonsIn viewsSmallButtonLight" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
							sehbuttonsdataFor += '<div class="glyphicon glyphicon-option-horizontal icon-in-menu icon-turn-off" aria-hidden="true"></div>';
							sehbuttonsdataFor += '	<span class="caret"></span>';
							sehbuttonsdataFor += '</button>';
							
							sehbuttonsdataFor += '';
 							sehbuttonsdataFor +=  '<ul id="addAllMenuData" class="dropdown-menu" aria-labelledby="dropdownMenu1">';
						
						var buttonsForData = '';//'<li><button id="addthatuserone" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Add a friend')+'</button></li>';
						//buttonsForData += '<li><button id="addthatuserone" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Follow')+'</button></li>';
						//buttonsForData += '<li><button id="addthatuserone" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Message')+'</button></li>';
						if(isInFriendsLine){
							buttonsForData = '';
							if(isHeShowing){
								//buttonsForData += '<li><button id="writeAMessage" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Message')+'</button></li>';
								if (isHeFollowing == true || isHeFollowing == 'true') {
									buttonsForData += '<li><button id="unfollowThatUserAlready" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Unfollow')+'</button></li>';
								}
								if ((isRequest_sent == true || isRequest_sent == 'true') && (isApproved == false || isApproved == 'false')) {
									buttonsForData += '<li><button id="cancelThatRequestAlready" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Cancel Request')+'</button></li>';
								}
								if (isApproved == true || isApproved == 'true') {
									buttonsForData += '<li><button id="removeThatUser" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Remove Friend')+'</button></li>';
								}
								buttonsForData += '<li><button id="removeThatUserHideNow" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Hide')+'</button></li>';
							}else{
								buttonsForData += '<li><button id="removeThatUserShowNow" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Show')+'</button></li>';
							}
							if(isHeBlocked){
								buttonsForData = "";
								buttonsForData += '<li><button id="UnblockThatUser" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Unblock')+'</button></li>';
							}else{
								buttonsForData += '<li><button id="blockThatUser" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Block')+'</button></li>';
							}
						}
						sehbuttonsdataFor += buttonsForData;
						sehbuttonsdataFor += '</ul></div>';
						if (buttonsForData != "") {
							ehbuttonsdataFor += sehbuttonsdataFor;
						}
						ehbuttonsdataFor += '</div>';
							
						
						var htmlImg = '';
						var userHtmlImg = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+userEmail+'/'+userEmail+'.jpg" alt="" /></div>';
						if(userPic != ""){
							htmlImg = userHtmlImg;
						}
						var meniuh = '<div class="meniuContentOfAcc">';
							meniuh += '<a href="#'+userEmail+'" class="btn btn-default viewButtonsIn marginbottom0 meniuContentElement meniuContentTopFRadius meniuSelectedOfAcc">'+app.translate('Timeline')+'</button>';
							meniuh += '<a href="#'+userEmail+'/about" class="btn btn-default viewButtonsIn meniuContentElement meniuContentLastOneEl">'+app.translate('About')+'</button>';
						meniuh += '</div>';
		
						var profileInfo = '<div class="users_user_glyph_on_top_front_page glyphicon glyphicon-user"></div><div class="users_info_all_about"><div class="users_info_in_projects"><div class="usersEmail_of">'+userEmail+'</div><div class="usersInfo_of"><b>'+firstLastname+ehbuttonsdataFor+'</b></div></div></div>';
						if(getSettingOfInfo !== ""){
							profileInfo = profileInfo+'<div class="users_info_all_about users_settings_info">'+getSettingOfInfo+'</div>';
						}
						if(options.settings.backgroundPictureAccount != ""){
							$("#users_account_in_project_small").css("background-image", 'url('+config.filesurl+'/filesproject_managing_files/ProjectManagementFiles/'+options.settings.backgroundPictureAccount+'")');
							$("#users_account_in_project_small").css("background-size", 'cover');
						}
						
						$("#users_account_in_project_small").html('<div class="all_users_info_in_front_page">'+htmlImg+"<div class='profile_data_all_front_page'>"+profileInfo+'</div><div style="clear:both;"></div>'+meniuh+'</div>');
						
						$("#writeAMessage").click(function(){
							miniChatClicked(options.peopleCol.get('_id'));
						});
						$("#writemessagethatuserOnly").click(function(){
							miniChatClicked(options.peopleCol.get('_id'));
						});
						$("#addthatuseroneAlready").click(function(){
							sendWhichRequest("addFriend", true);
							$("#addthatuseroneAlready").attr("disabled", "disabled");
							$("#addthatuseroneAlready .addfriendtext").text(app.translate("Request sent"));
						});
						$("#followthatuserAlready").click(function(){
							sendWhichRequest("onlyFollow", true);
							$("#followthatuserAlready").attr("disabled", "disabled");
							$("#followthatuserAlready .followingtext").text(app.translate("Following"));
						});
						$("#unfollowThatUserAlready").click(function(){
							sendWhichRequest("unfollow", true);
							$("#unfollowThatUserAlready").attr("disabled", "disabled");
							$("#unfollowThatUserAlready").text(app.translate("Unfollowed"));
						});
						$("#cancelThatRequestAlready").click(function(){
							sendWhichRequest("cancelRequest", true);
							$("#cancelThatRequestAlready").attr("disabled", "disabled");
							$("#cancelThatRequestAlready").text(app.translate("Cancelled request"));
						});
						
						$("#addthatuserone").click(function(){
							sendWhichRequest("addFriend");
							$("#addthatuserone").attr("disabled", "disabled");
							$("#addthatuserone .addfriendtext").text(app.translate("Request sent"));
						});
						
						$("#followthatuser").click(function(){
							sendWhichRequest("onlyFollow");
							$("#followthatuser").attr("disabled", "disabled");
							$("#followthatuser .followingtext").text(app.translate("Following"));
						});
						$("#writemessagethatuser").click(function(){
							if(typeof options != "undefined" && options.peopleCol != "undefined" && typeof options.people != 'undefined' && options.people != '' && (typeof app.userConnected.data2 !== 'undefined' && options.people != app.userConnected.data2.email)){
							
								var userID = options.peopleCol.get('_id');
								var isInFriendsLine = false;
									for(var j=0; j < friends_of_me.length; j++){
										if(friends_of_me[j]._id === userID){
											isInFriendsLine = true;
										}
									}
								if (!isInFriendsLine) {
									sendWhichRequest("sendMessage");
								}
							}
							$("#writemessagethatuserOnly").show();
							$("#writemessagethatuser").remove();
						});
						
						$("#removeThatUser").click(function(){
							whichFriendObj.show = false;
							$("#removeThatUser").remove();
							var removeThat = {remove:true, _id: options.peopleCol.get('_id')};
							
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: app.userConnected.data2.email, removeFriends: [removeThat] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
						});
						$("#removeThatUserHideNow").click(function(){
							whichFriendObj.show = true;
							$("#removeThatUserHideNow").attr("disabled","disabled");
							$("#removeThatUserHideNow").text("User Hiding Now");
							var removeThat = {onlyhide:false, _id: options.peopleCol.get('_id')};
							
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ removeFriends: [removeThat] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								}).always(function (msg) {
									startMiniChat(app.socketService,app.userConnected.data2.email, true, function(){
									});
								});
						});
						$("#removeThatUserShowNow").click(function(){
							whichFriendObj.show = true;
							$("#removeThatUserShowNow").attr("disabled","disabled");
							$("#removeThatUserShowNow").text("User Showing Now");
							var removeThat = {remove:false, _id: options.peopleCol.get('_id')};
							
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ removeFriends: [removeThat] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								}).always(function (msg) {
									startMiniChat(app.socketService,app.userConnected.data2.email, true, function(){
										miniChatClicked(options.peopleCol.get('_id'));
									});
								});
						});
						
						
						$("#blockThatUser").click(function(){
							whichFriendObj.blocked = true;
							$("#addthatuseroneAlready").remove();
							$("#followthatuserAlready").remove();
							$("#writemessagethatuserOnly").remove();
							$("#addthatuserone").remove();
							$("#followthatuser").remove();
							$("#writemessagethatuser").remove();
							$("#blockThatUser").attr("disabled","disabled");
							$("#blockThatUser").text("User Blocked");
							var addHimToMe = {
								_id: options.peopleCol.get('_id'),
								block:true
							};
							
							$.ajax({
							  method: "PUT",
							  url: "/updateuser",
							  data: JSON.stringify({ removeFriends: [addHimToMe] }),
								contentType: 'application/json; charset=utf-8',
								dataType: 'json'
							}).always(function (msg) {
								startMiniChat(app.socketService,app.userConnected.data2.email, true, function(){
								});
							});
						});
						$("#UnblockThatUser").click(function(){
							whichFriendObj.blocked = false;
							$("#UnblockThatUser").attr("disabled","disabled");
							$("#UnblockThatUser").text("User Unblocked");
							var addHimToMe = {
								_id: options.peopleCol.get('_id'),
								block:false
							};
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ removeFriends: [addHimToMe] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								}).always(function (msg) {
									startMiniChat(app.socketService,app.userConnected.data2.email, true, function(){
										miniChatClicked(options.peopleCol.get('_id'));
									});
								});
						});
						
				}else{
					if(typeof app.userConnected.data2 !== 'undefined'){
						var userPic = app.userConnected.data2.pic;
						var userEmail = app.userConnected.data2.email;
						var firstLastname = app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname;
						var htmlImg = '';
						var userHtmlImg = '';
						if(userPic != "" && $(".hereProfilePhoto").is(":hidden")){
							htmlImg = userHtmlImg;
							$(".hereProfilePhoto").html(htmlImg);
							$(".hereProfilePhoto").show();
							$(".meHerePro").hide();
						}
						var acc_info_about = app.addInfoAbout("Here - main your information. You can press on user icon and change account photo");
						var change_settings_info_about = app.addInfoAbout("Change settings - there you can upload front page image, background image, add description and change colors of site");
						var profileInfo = '<a href="/#account"><div class="users_user_glyph_on_top_front_page glyphicon glyphicon-user"></div></a>'+acc_info_about+'<div class="users_info_all_about"><div class="users_info_in_projects"><div class="usersEmail_of">'+userEmail+'</div><div class="usersInfo_of"><b>'+firstLastname+'</b></div></div></div>';
						if(getSettingOfInfo !== ""){
							profileInfo = profileInfo+'<div class="users_info_all_about users_settings_info">'+getSettingOfInfo+'</div>';
						}
						if(options.settings.backgroundPictureAccount != ""){
							$("#users_account_in_project_small").css("background-image", 'url('+config.filesurl+'/filesproject_managing_files/ProjectManagementFiles/'+options.settings.backgroundPictureAccount+'")');
							$("#users_account_in_project_small").css("background-size", 'cover');
						}
						var addOrChangeBackground = "<div class='users_info_only_change_background'><div class='change_settings_front_button'><a href='/#settings'>Change settings</a>"+change_settings_info_about+"</div><a href='/#settings'><div class='change_settings_front_butt_glyph glyphicon glyphicon-cog'></div></a></div>";
						
						//$("#users_account_in_project_small").html('<div class="all_users_info_in_front_page">'+htmlImg+"<div class='profile_data_all_front_page'>"+profileInfo+'</div><div style="clear:both;"></div></div>'+addOrChangeBackground);
					}
				}
				
				}else{
					var userPic = "";
					var userEmail = "";
					var firstLastname = "";
					if(typeof options.peopleCol !== "undefined"){
						 userPic = options.peopleCol.get('pic');
						 userEmail = options.peopleCol.get('email');
						 firstLastname = options.peopleCol.get('firstname')+' '+options.peopleCol.get('lastname');
					}
						var htmlImg = '';
						var userHtmlImg = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+userEmail+'/'+userPic+'" alt="" /></div>';
						if(userPic != ""){
							htmlImg = userHtmlImg;
						}
						var profileInfo = '<div class="users_user_glyph_on_top_front_page glyphicon glyphicon-user"></div><div class="users_info_all_about"><div class="users_info_in_projects"><div class="usersEmail_of">'+userEmail+'</div><div class="usersInfo_of"><b>'+firstLastname+'</b></div></div></div>';
						if(getSettingOfInfo !== ""){
							profileInfo = profileInfo+'<div class="users_info_all_about users_settings_info">'+getSettingOfInfo+'</div>';
						}
						if(options.settings.backgroundPictureAccount != ""){
							$("#users_account_in_project_small").css("background-image", 'url('+config.filesurl+'/filesproject_managing_files/ProjectManagementFiles/'+options.settings.backgroundPictureAccount+'")');
							$("#users_account_in_project_small").css("background-size", 'cover');
						}
						$("#users_account_in_project_small").html('<div class="all_users_info_in_front_page">'+htmlImg+"<div class='profile_data_all_front_page'>"+profileInfo+'</div><div style="clear:both;"></div></div>');
				}
			}
			thh.renderMainView = function(){
				var canReRend = false;
				var lok_href = location.href;
				var canViewBecauseItsPeople = false;//if(typeof options != 'undefined' && typeof options.people != 'undefined' && options.people != ''){
				if(typeof options != 'undefined' && typeof options.people != 'undefined' && options.people != '' && lok_href.split("/").length == 4 && location.href.indexOf("home") == -1 && (location.href.indexOf("project/") == -1 && thisProj == "" && location.href.indexOf("projectsinlist") == -1 && location.href.indexOf("entry/") == -1)){
					canViewBecauseItsPeople = true;
				}
				if(canViewBecauseItsPeople || location.href.split("/").length < 6 || location.href.indexOf("home") > -1 || (location.href.indexOf("project/") > -1 && typeof thisProj != "undefined" && thisProj != "" && location.href.indexOf(thisProj.get("_id")) > -1)){
					canReRend = true;
				}
				if(canReRend){
					app.hideAddButtonGlobal();
					if(visibilityOfItGlobal != ""){
						if(visibilityOfItGlobal == "editfriends" || visibilityOfItGlobal == "editpublic" || visibilityOfItGlobal == "editprivate"){ app.showAddButtonGlobal(); }
					}
					if(pressedOtherView){
						if(mainViewShowingNow == "board_view_show"){
							cBoardView.render();
						}
						/*if(mainViewShowingNow == "calendar_view_show"){
							cCalendarView.render();
						}
						if(mainViewShowingNow == "list_view_show"){
							cListView.render();
						}*/
						for(var i=0; i < projectViews.length; i++){
							if(mainViewShowingNow == projectViews[i].id){
								if(typeof cCreatedViews[mainViewShowingNow] == "undefined" || cCreatedViews[mainViewShowingNow] != ""){
									cCreatedViews[mainViewShowingNow].render();	
								}
							}
						}
						if(typeof cCreatedViewsFunc[mainViewShowingNow] != "undefined" && cCreatedViewsFunc[mainViewShowingNow] != ""){
							cCreatedViewsFunc[mainViewShowingNow](thisProj);
						}
					}else{
						if(typeof cView !== "undefined" && cView !== ""){
							cView.render();	
						}
					}
					if(typeof options == 'undefined' || typeof options.id == 'undefined' || options.id == ''){
						if(location.href.indexOf("project") === -1){
							renderPhotoAccount();
						}else{
							$("#users_account_in_project_small").hide();
						}
					}else{
						$("#users_account_in_project_small").hide();
					}
				}
			}
			
			var setViewCreated = function(mainViewShowingNow, mainViewObject){
					if(mainViewShowingNow == "board_view_show"){
						cView = new projectGridView(mainViewObject);
						cView.options.dontdrag = false;
					}
					for(var i=0; i < projectViews.length; i++){
						if(mainViewShowingNow == projectViews[i].id){
							cView = new projectViews[i].view(mainViewObject);
							this.listenTo(cView, 'render', this.listenToChangeView);
							this.listenTo(cView, 'project:edit', this.refreshProjectsRender);
							//this.listenTo(cView, 'project:delete', this.refreshProjectsRender);
							cView.options.dontdrag = projectViews[i].dontdrag;
						}
					}
					/*if(mainViewShowingNow == "calendar_view_show"){
						cView = new projectCalendarView(mainViewObject);
					}
					if(mainViewShowingNow == "list_view_show"){
						cView = new projectListView(mainViewObject);
					}*/
			}.bind(this)
			
			var setViewOnWhenClicked = function(show_view){
						if(typeof cCreatedViews[show_view] == "undefined" || cCreatedViews[show_view] != ""){
							var projectViewSel = "";
							for(var ij=0; ij < projectViews.length; ij++){
								if(projectViews[ij].id == show_view){
									projectViewSel = projectViews[ij];
								}
							}
							if(projectViewSel != ""){
								cCreatedViews[show_view] = new projectViewSel.view(mainViewObject);
								cCreatedViews[show_view].options.dontdrag = projectViewSel.dontdrag;
								if(navigationModelObj != ""){
									cCreatedViews[show_view].options.navigationModel = navigationModelObj;
									cCreatedViews[show_view].renderNavigation();
								}
								this.listenTo(cCreatedViews[show_view], 'render', this.listenToChangeView);
								this.listenTo(cCreatedViews[show_view], 'project:edit', this.refreshProjectsRender);
								this.listenTo(cCreatedViews[show_view], 'project:delete', this.refreshProjectsRender);
								if(typeof projectViewSel.onAfterRendered != "undefined" && projectViewSel.onAfterRendered != ""){
									cCreatedViewsFunc[show_view] = projectViewSel.onAfterRendered;
								}
							}
						}
						mainViewShowingNow = show_view;
						this.mainViewShowingInNow = mainViewShowingNow;
						pressedOtherView = true;
						app.main.show(cCreatedViews[show_view]);
						thh.renderMainView();
			}.bind(this)
			
			this.refreshProjectsRender = function(view, options){
				if(typeof options != "undefined" && typeof options.addModels !== "undefined" && options.addModels != ""){
					var modelsAdd = options.addModels;
					
					for (var onModel in modelsAdd) {
						var modelToAdd = new project(modelsAdd[onModel]);
							if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
								modelToAdd.set('hisinproject_this', options.id);
							}
							if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
								modelToAdd.set('parentvisibility', 'editcommentpublic');
							}else{
								if(typeof app.userData != "undefined" 
								&& typeof modelToAdd != "undefined" && typeof modelToAdd.get != "undefined"
								&& modelToAdd.get("email") == app.userData.email){
									modelToAdd.set('parentvisibility', "editpublic");
								}else{
									/*if(typeof app.userData != "undefined" && typeof thisProj != "undefined" && thisProj != "" && thisProj.get("email") == app.userData.email){
										modelToAdd.set('parentvisibility', visibilityOfItGlobal);
									}else{/*/
										modelToAdd.set('parentvisibility', modelToAdd.get("visibility"));
									/*}/*/
								}
							}
						//if(projects.get(modelToAdd) == "undefined"  && projects.get(modelToAdd.get("_id")) == "undefined"){
							projects.add(modelToAdd);
						//}
					}
				}
				projects.sort(projects.comparator());
                thh.renderMainView();
			}
			
			this.listenToChangeView = function(){
				var isBoardMain = "";
				if(mainViewShowingNow == "board_view_show"){ isBoardMain = 'viewButtonsInSelected'; }
				var addedViewsHtml = '<li id="board_view_show" class="viewButtonsIn '+isBoardMain+'">'+app.translate("Board view")+'</li>';
				for(var i=0; i < projectViews.length; i++){
					var isViewSelected = "";
					if(projectViews[i].id === mainViewShowingNow){ isViewSelected = 'viewButtonsInSelected'; }
					addedViewsHtml += projectViews[i].html(isViewSelected);
				}
				$("#viewsAdded").html(addedViewsHtml);
				
				for(var i=0; i < projectViews.length; i++){
					$('#'+projectViews[i].id).click(function(e){
						var show_view = e.currentTarget.getAttribute('id');
						setViewOnWhenClicked(show_view);
					}.bind(this));
				}
				/*$('#list_view_show').click(function(){
					var type = 'list_view_show';
					if(type === 'list_view_show'){
						if(cListView === ''){
							cListView = new projectListView(mainViewObject);
							if(navigationModelObj != ""){
								cListView.options.navigationModel = navigationModelObj;
								cListView.renderNavigation();
							}
							this.listenTo(cListView, 'render', this.listenToChangeView);
						}
						mainViewShowingNow = "list_view_show";
						this.mainViewShowingInNow = mainViewShowingNow;
						pressedOtherView = true;
						app.main.show(cListView);
						thh.renderMainView();
						$("#the_all_projects").attr('style','width:auto; margin:auto;');
					}
				}.bind(this));
				$('#calendar_view_show').click(function(){
					var type = 'calendar_view_show';
					if(type === 'calendar_view_show'){
						if(cCalendarView === ''){
							cCalendarView = new projectCalendarView(mainViewObject);
							if(navigationModelObj != ""){
								cCalendarView.options.navigationModel = navigationModelObj;
								cCalendarView.renderNavigation();
							}
							this.listenTo(cCalendarView, 'render',  this.listenToChangeView);
						}
						mainViewShowingNow = "calendar_view_show";
						this.mainViewShowingInNow = mainViewShowingNow;
						pressedOtherView = true;
						app.main.show(cCalendarView);
						thh.renderMainView();
					}
				}.bind(this));*/
				$('#board_view_show').click(function(){
				var type = 'board_view_show';
				if(type === 'board_view_show'){
					if(cBoardView === ''){
						cBoardView = new projectGridView(mainViewObject);
						cBoardView.options.dontdrag = false;
						if(navigationModelObj != ""){
							cBoardView.options.navigationModel = navigationModelObj;
							cBoardView.renderNavigation();
						}
						this.listenTo(cBoardView, 'render',  this.listenToChangeView);
						this.listenTo(cBoardView, 'project:edit', this.refreshProjectsRender);
						this.listenTo(cBoardView, 'project:delete', this.refreshProjectsRender);
					}
					mainViewShowingNow = "board_view_show";
					this.mainViewShowingInNow = mainViewShowingNow;
					pressedOtherView = true;
					app.main.show(cBoardView);
					thh.renderMainView();
				}
				}.bind(this));
				if(mainViewShowingNow == "board_view_show"){
					setTimeout(function(){
					for(var ii=0; ii < projects.models.length; ii++){
						var modell = projects.models[ii];
						if(typeof modell != "undefined" && (typeof modell.get('inCollectionData') === 'undefined' ||
								modell.get('inCollectionData') === '')){
							
							var treeProjectsOnn = modell.get("treeprojectsallproject");
							if(typeof treeProjectsOnn != "undefined"){
								if(!modell.get("isHeader")){
									var id_of_that_model = modell.get('_id');
									var in_head_id = modell.get("inHeader");
										var treedataView = treeProjectsOnn;
										$('.treeInShowHere'+id_of_that_model).html(treedataView.$el);
										treedataView.render();
										if(treedataView.display_on_it == "true"){
											$('.treeInShowHere'+id_of_that_model).show();
											$('.projectclass_'+in_head_id).css('width','auto');
										}
								}
							}
						}
					}
					}, 1);
				}
			}
			var thisProj = "";
            if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
                id = options.id;
                id_on_link = id;
				projects = this.getProject(id_on_link, options.p);
				navigation_pr = this.getNavigationAllL(projects);
                if(navigation_pr === ''){
                    if(typeof this.projectModels[projects.idd] != 'undefined'){
                        thisProj = this.projectModels[projects.idd];
                    }else{
                        thisProj = new project({_id:projects.idd});
						thisProj.url = config.urlAddr+'/projectentryy/'+projects.idd;
						
						if (typeof this.optionsInPro.people != "undefined" && this.optionsInPro.people != "") {
							thisProj.url = config.urlAddr+'/projectentryy/'+projects.idd+"/0/"+this.optionsInPro.people;
						}
                        /*thisProj.url = '/projectentry/'+projects.idd;
						if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
							thisProj.fetch().done(function(){
								navigationModelObj = thisProj;
								if(cView != ''){
								cView.options.navigationModel = thisProj;
								cView.renderNavigation();
								}
									app.vent.on("userConnected:ready", function(){
										thh.renderMainView();
									}.bind(this));
							}.bind(this)).error(function(){
								app.getWhenNotFoundData();
							});
						}*/
                        this.projectModels[projects.idd] = thisProj;
						app.vent.trigger('add:cachedModels:resource', this.projectModels[projects.idd]);
                    }
					
					if (peopleColAdd != "") {
						projects.peopleColAdd = peopleColAdd;
					}
					mainViewObject = {collection: projects, navigationModel:thisProj, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')};
					setViewCreated(mainViewShowingNow, mainViewObject);
                }else{
					if (peopleColAdd != "") {
						projects.peopleColAdd = peopleColAdd;
					}
					
					thisProj = navigation_pr;
					mainViewObject = {collection: projects, navigationModel:navigation_pr, projectsAll:this.projects, mainP:this.get('mainProjectCtrl')};
					
					setViewCreated(mainViewShowingNow, mainViewObject);
                }
				
					if(typeof thisProj != "undefined" && thisProj != ""){//typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
						var thhhhh = this;
						var projectDataWhenLoaded = function(visibilityOfIt, viewOfProject){
							if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){}else{
									projects.url = config.urlAddr+"/projectt/"+projects.idd;
									if (typeof options != "undefined" && typeof options.people != "undefined" && options.people != "") {
										projects.url = config.urlAddr+"/projectt/"+projects.idd+"/"+options.people;
									}
							}
									projects.fetch().done(function(){
										if(viewOfProject !== "board_view_show"){
											setViewCreated(viewOfProject, mainViewObject);
											setViewOnWhenClicked(viewOfProject);
											pressedOtherView = false;
										}else{
											setViewCreated(viewOfProject, mainViewObject);
											setTimeout(function(){
											mainViewShowingNow = "board_view_show";
											viewOfProject = "board_view_show";
											thhhhh.listenToChangeView();
											}, 1);
											
										}
										for(var ii=0; ii < projects.models.length; ii++){
											if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
												projects.models[ii].set('hisinproject_this', options.id);
											}
											var count_every_header = new Backbone.Model();
											
											if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
												count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+projects.models[ii].get('_id');
												projects.models[ii].set('parentvisibility', 'editcommentpublic');
											}else{
												if(typeof app.userData != "undefined" && projects.models[ii].get("email") == app.userData.email){
													count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+projects.models[ii].get('_id');
													projects.models[ii].set('parentvisibility', "editpublic");
												}else{
													/*if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
														count_every_header.url = '/projectsinlistt_old_count/'+projects.models[ii].get('_id');
														projects.models[ii].set('parentvisibility', visibilityOfIt);
													}else{*/
														count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+projects.models[ii].get('_id');
														projects.models[ii].set('parentvisibility', projects.models[ii].get("visibility"));
													/*}*/
												}
											}
											if(projects.models[ii].get('isHeader')){
												if(typeof projects.models[ii].get("header_count_old_numb_loaded") == "undefined"){
													projects.models[ii].fetchHeaderCount(count_every_header, thh);
													
													/*count_every_header.set("parent_model", projects.models[ii]);
													count_every_header.fetch({
														success : function(collection, response) {
															var parent_mod = collection.get("parent_model");
															parent_mod.set("header_count_old_numb", response.count);
															parent_mod.set("header_count_old_numb_loaded", true);
															collection.set("count", response.count);
															thh.renderMainView();
														}
													});*/
												}
											}
										}
										if (typeof comparator == 'function') {
											projects.sort(projects.comparator());
										}
										if(functionToBeCalledToAddShared != ""){
											functionToBeCalledToAddShared();
										}
										if(cView != ''){
											app.main.show(cView);
										}
										
										thh.renderMainView(); 
										app.vent.on("userConnected:ready", function(){
											thh.renderMainView(); 
										});
										setTimeout(function(){
											thh.startListeningProjects();
										},10);
									});
						}
						var getVisibilityOfTheProject = function(thisProj, visibilityOfIt, canView){
									var friendsInThatProj = thisProj.get("friends");
									if(typeof friendsInThatProj !== "undefined" && typeof friendsInThatProj.length !== "undefined"){
										for(var ii=0; ii < friendsInThatProj.length; ii++){
											if(typeof friendsInThatProj[ii] != "undefined" && friendsInThatProj[ii] != "" && typeof friendsInThatProj[ii]._id != "undefined" && friendsInThatProj[ii]._id != ""){
												if(typeof app.userData == "undefined" || app.userData._id == friendsInThatProj[ii]._id){
													canView = true;
												}
											}
										}
									}
									if(typeof app.userData != "undefined"
&& typeof thisProj != "undefined" && typeof thisProj.get != "undefined"
									&& thisProj.get("email") == app.userData.email){
										canView = true;
										visibilityOfIt = "editpublic";
									}
							return {visibilityOfIt:visibilityOfIt, canView:canView};
						}
						thisProj.url = config.urlAddr+'/projectentryy/'+projects.idd;
						if (typeof this.optionsInPro.people != "undefined" && this.optionsInPro.people != "") {
							thisProj.url = config.urlAddr+'/projectentryy/'+projects.idd+"/0/"+this.optionsInPro.people;
						}
						
							thisProj.fetch().done(function(){
								renderHeadersData(thisProj);
								if(typeof app.userData == "undefined"){
									app.vent.on("userConnected:ready", function(){
										var canView = false;
										var viewOfProject = thisProj.get("view_main");
										var visibilityOfIt = thisProj.get("visibility");
										if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
											var getVisibilityOff = getVisibilityOfTheProject(thisProj, visibilityOfIt, canView);
											visibilityOfIt = getVisibilityOff.visibilityOfIt;
											canView = getVisibilityOff.canView;
										}
										visibilityOfItGlobal = visibilityOfIt;
										if(visibilityOfIt == "editcommentfriends" || visibilityOfIt == "friends" || visibilityOfIt == "editfriends" || 
										visibilityOfIt == "editcommentpublic" || visibilityOfIt == "editpublic" || visibilityOfIt == "public" || canView){
											projectDataWhenLoaded(visibilityOfIt, viewOfProject);
										}else{
											app.getWhenPrivateData();
										}
									});
								}else{
									var canView = false;
									var viewOfProject = thisProj.get("view_main");
									var visibilityOfIt = thisProj.get("visibility");
									if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
										var getVisibilityOff = getVisibilityOfTheProject(thisProj, visibilityOfIt, canView);
										visibilityOfIt = getVisibilityOff.visibilityOfIt;
										canView = getVisibilityOff.canView;
									}
									visibilityOfItGlobal = visibilityOfIt;
									if(visibilityOfIt == "editcommentfriends" || visibilityOfIt == "friends" || visibilityOfIt == "editfriends" || 
									visibilityOfIt == "editcommentpublic" || visibilityOfIt == "editpublic" || visibilityOfIt == "public" || canView){
										projectDataWhenLoaded(visibilityOfIt, viewOfProject);
									}else{
										app.getWhenPrivateData();
									}
								}
							}).error(function(){
								app.getWhenNotFoundData();
							});
					}
				
            }
            else{
				if(typeof options != 'undefined' && typeof options.people != 'undefined' && options.people != ''){
					if (peopleColAdd != "") {
						projects.peopleColAdd = peopleColAdd;
					}
					mainViewObject = {collection: projects};
					setViewCreated(mainViewShowingNow, mainViewObject);
					if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
						//location.href = "#page/first";
					}
					
				}else{
						
					/*First window */
					//projectsShared
					functionToBeCalledToAddShared = function(){
						if(typeof app.userConnected.data2 !== 'undefined'){
							projects.addSharedModels(projectsShared,cView);
						}else{
							app.vent.on("userConnected:ready", function(){
								projects.addSharedModels(projectsShared,cView);
							});
						}
					}
					if (peopleColAdd != "") {
						projects.peopleColAdd = peopleColAdd;
					}
					mainViewObject = {collection: projects};
					setViewCreated(mainViewShowingNow, mainViewObject);
					if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
						location.href = "#page/first";
					}
				}
            }

			if(cView != ''){
				this.listenTo(cView, 'render', this.listenToChangeView);
				this.listenTo(cView, 'project:edit', this.refreshProjectsRender);
				this.listenTo(cView, 'project:delete', this.refreshProjectsRender);
			}
			if(typeof options == 'undefined' || typeof options.id == 'undefined' || options.id == ''){
					projects.fetch().done(function(){
						for(var ii=0; ii < projects.models.length; ii++){
							var count_every_header = new Backbone.Model();
							count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+projects.models[ii].get('_id');
							if(typeof app.userData != "undefined" && projects.models[ii].get("email") == app.userData.email){
								count_every_header.url = config.urlAddr+'/projectsinlistt_old_count/'+projects.models[ii].get('_id');
							}
							if(typeof options != 'undefined' && typeof options.id != 'undefined' && options.id != ''){
								projects.models[ii].set('hisinproject_this', options.id);
							}
							if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
								projects.models[ii].set('parentvisibility', 'editcommentpublic');
							}else{
								if(typeof options !== 'undefined' && typeof options.people !== 'undefined' && options.people !== ''){
									projects.models[ii].set('parentvisibility', projects.models[ii].get("visibility"));
								}else{
									if(projects.models[ii].get("inHeader") !== "friends" && projects.models[ii].get("_id") !== "friends"){
										projects.models[ii].set('parentvisibility', 'editprivate');
									}else{
										projects.models[ii].set('parentvisibility', projects.models[ii].get("visibility"));
									}
								}
							}
							if(projects.models[ii].get('isHeader')){
								projects.models[ii].fetchHeaderCount(count_every_header, thh);
							}
						}
						if (typeof comparator == 'function') {
							projects.sort(projects.comparator());
						}
						if(typeof options == 'undefined' || ((typeof options.people == 'undefined' || options.people != '') && (typeof options.id == 'undefined' || options.id != ''))){
							if(functionToBeCalledToAddShared != ""){
								functionToBeCalledToAddShared();
							}
						}
						if(cView != ''){
							app.main.show(cView);
						}
						thh.renderMainView();
						if(typeof options.people == 'undefined' || options.people != ''){
							if(projects.length == 0){
								setTimeout(function(){ if(projects.length == 0){ app.getWhenNoBoardItemsWhereToForPeople("#project_all_inner_container_one"); } });
							}
						}
							app.vent.on("userConnected:ready", function(){
								thh.renderMainView();
								if(typeof options.people == 'undefined' || options.people != ''){
									if(projects.length == 0){
										setTimeout(function(){ if(projects.length == 0){ app.getWhenNoBoardItemsWhereToForPeople("#project_all_inner_container_one"); } });
									}
								}
							});
						setTimeout(function(){
							thh.startListeningProjects();
						},1000);
					});
			}
            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-menu-hamburger fontsize23"></div><div></div>Menu', name: '',actionEx:'open_right_menu', active: false}
				//{title: '<div class="rightAdd"><div class="glyphicon glyphicon-plus-sign fontsize23"></div><div></div>'+app.translate('Create')+'</div>', name: '',actionEx:'add', active: false}
            ]);
			if(thisProj == ""){
				 menuTopRightCol = new Nav([
					//{title: '<div class="glyphicon glyphicon-plus-sign fontsize23"></div><div></div>'+app.translate('Create'), name: '',actionEx:'add', active: false}
				]);
			}
            var menuTopRight = new MenuView({collection: menuTopRightCol});
            app.menu.show(menuTopRight);
            app.vent.trigger('top:leftmenu:show');
            app.footernavright.show(new EmptyView());
            app.footernavleft.show(new EmptyView());

            thh.renderMainView();
            this.listenTo(menuTopRight, 'menuitem:click',function(view){
                if(view.model.get('actionEx') == 'home'){
					Backbone.history.navigate('#home',{ trigger:true, replace: true });
				}
				if(view.model.get('actionEx') == 'openChat'){
					location.href = "/chat";
				}
                if(view.model.get('actionEx') == 'open_right_menu'){
					if(thisProj != ""){
						if($("#right_menu_for_data").html() == ""){
							var visibilityOfThisproj = thisProj.getVisibilityOfTheProject(app);
							thisProj.set("parentvisibility",visibilityOfThisproj.visibilityOfIt);
							var projectGridRow = new rightModalView({model:thisProj});
							app.right_menu_for_data.show(projectGridRow);
							projectGridRow.render();
						}
						$("#right_menu_for_data").toggle();
					}
				}
                if(view.model.get('actionEx') == 'add'){
                    Backbone.history.navigate('#add/'+id_on_link,{ trigger:true, replace: true });
                }
            }.bind(this));
			
			
			this.prjsprojects = projects;
        },
		startListeningProjects: function() {
            this.listenTo(this.prjsprojects, 'remove add',function(modell){
					//thh.renderMainView();
					$("#viewsAdded .viewButtonsInSelected").trigger("click");
					setTimeout(function(){
						$("#viewsAdded .viewButtonsInSelected").trigger("click");
					}, 1);
            });
            this.listenTo(this.prjsprojects, 'change:inHeaderUpdateView',function(modell){
                if(typeof modell != "undefined" && typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    this.prjsprojects.sort(this.prjsprojects.comparator());
                    modell.unset('inHeaderUpdateView', 'silent');
					/*thh.renderMainView();*/
					//thh.renderMainView();
					//$("#viewsAdded .viewButtonsInSelected").trigger("click");
                }
			}.bind(this));
            this.listenTo(this.prjsprojects, 'change:onAddModelsGoGo',function(modell){
                if(typeof modell != "undefined" && typeof modell.get('onAddModelsGoGo') != 'undefined'
                    && modell.get('onAddModelsGoGo') !== ''){
                    this.refreshProjectsRender("", modell.get('onAddModelsGoGo'));
                    modell.unset('onAddModelsGoGo', 'silent');
					/*thh.renderMainView();*/
					//thh.renderMainView();
					//$("#viewsAdded .viewButtonsInSelected").trigger("click");
                }
			}.bind(this));
            this.listenTo(this.prjsprojects, 'change:inCollectionData',function(modell){
				this.onProjectChange(modell);
			}.bind(this));
		}
    });
    return projectsContr;
});
