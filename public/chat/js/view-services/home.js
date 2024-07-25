define(['./module'], function (services) {
    'use strict';
    services.factory('viewHome', ['common','authentication', 'socketService', '$compile', function (common, authentication, socketService, $compile) {
        return {
            ui: {
                text:'#homeTextUser',
                messages:'#messagesContainer'
            },
            showConv: function (userID, func) {
                var getModel2 = authentication.connectedUser;
                getModel2.url = '/updateuser';
                getModel2.removeFriends = [{_id:userID, remove:false}];
                var promise2 = getModel2.save(['email','removeFriends']);

                $.when( promise2 ).then(function() {
                    authentication.connectedUser.friends = common.changeArrayAttr(authentication.connectedUser.friends, getModel2.removeFriends, 'show', true);
                    if(typeof func != 'undefined'){
						func();
					}
                }.bind(this));
			},
            dontOrLetWrite: function (isBlocked) {
				if(isBlocked){
					$('.sendButton').attr('disabled','disabled');
					$('#homeTextUser').attr('disabled','disabled');
					$('#homeTextUser').text(common.translate('User has blocked you'));
				}else{
					$('#homeTextUser').text(common.translate('Message'));
					$('.sendButton').removeAttr('disabled');
					$('#homeTextUser').removeAttr('disabled');
				}
			},
            blockModelSet: function (model, selUser) {
				if(model._id == selUser._id){
					this.dontOrLetWrite(model.blockedBy);
				}
			},
            blockFriendSet: function (obj, selUser) {
				for(var ii=0; ii < obj.blockFriend.length; ii++){
					if(obj.blockFriend[ii]._id == selUser._id){
						this.dontOrLetWrite(obj.blocked);
					}
				}
			},
            initializeScopeListening: function (scope) {
                scope.sendMessage = function(){
                    var msg = this.replaceAllIcons($(this.ui.text).val());
					
                    common.trigger('send:message',{msg:msg});
                    $(this.ui.text).val('');
                }.bind(this);
                scope.uploadFilesToServer = function(){
                    $('#fileToUpload').trigger('click');
                }
				scope.loadMessagesMore = function(){
                    common.trigger('load:messages');
                }
                $( "#fileToUpload" ).change(function(e) {
                    this.uploadFilesToServerSendPost(e.target.files);
                }.bind(this));
            },
            uploadFilesToServerSendPost: function(files){
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
							$('.onFileUploadProgress').show();
							$('.onFileUploadProgress').html('');
							$('.onFileUploadProgress').css('width', (percentComplete*100)+'%');
						} else {
							$('.onFileUploadProgress').html(common.translate('Uploading ...'));
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
						common.trigger('send:message',{msg:'', files:msgIn});
						$('.onFileUploadProgress').hide();
					}.bind(this), false);
					//xhr.addEventListener("error", uploadFailed, false);
					//xhr.addEventListener("abort", uploadCanceled, false);
					xhr.open("POST", "/messages_file_upload");
					xhr.send(fd);
				}else{
							$('.onFileUploadProgress').show();
							$('.onFileUploadProgress').html('<div style="background:red;">Too big file. Max - 25MB.</div>');
				}
            },
            setSelectedUser: function(userModel, $scope){
                if(typeof this.selectedUserModel != 'undefined' && this.selectedUserModel != ''){
                    this.selectedUserModel.isChosen = '';
                }
                this.selectedUserModel = userModel;
                if(typeof userModel != 'undefined' && userModel != ''){
                    userModel.isChosen = 'selectedUser';
                }
                this.setOnlineUser(userModel, $scope);
                this.setPeopleInGroup(userModel);
            },
            setPeopleInGroup: function(channelModel){
                if(typeof channelModel !== 'undefined' && channelModel !== '' &&
				typeof channelModel.email === 'undefined'){
					$('#custom_data_text_groups').hide();
					
					var peoplesHtml = '';
					var isOnlineThatPerson = '';
					for(var i=0; i < channelModel.people.length; i++){
						var socUsers = socketService.connected.users;
						for(var jj=0; jj < socUsers.length; jj++){
							if(socUsers[jj].name === channelModel.people[i].email){
								isOnlineThatPerson = '<span class="glyphonline glyphicon glyphicon-ok-sign"></span> ';
							}
						}
						
						var seeImghere = '<div class="minichatMakeCircleImage imageCircleForChat"><img class="miniChatFloatingFriendsPhoto" src="/files/brand/logo.png" alt=""></div>';
						if (typeof channelModel.people[i].pic != "undefined" && channelModel.people[i].pic != "") {
							seeImghere = '<div class="minichatMakeCircleImage imageCircleForChat"><img class="miniChatFloatingFriendsPhoto" src="/files/'+channelModel.people[i].email+'/'+channelModel.people[i].pic+'" alt=""></div>';
						}
						
						peoplesHtml += '<span class="onePeopleClass"><a href="/#/'+channelModel.people[i].email+'">'+seeImghere+isOnlineThatPerson+channelModel.people[i].firstname+' '+channelModel.people[i].lastname+'</a></span>';
					}
					
					var addChannelInfoh = "<div class='topAbout'>Name</div><div class='topDesc'>"+channelModel.firstname+"</div>";
					addChannelInfoh += "<div class='topAbout'>Description</div><div class='topDesc'>"+channelModel.about+"</div>";
					var dateCreat = new Date(channelModel.added);
					var datestring = dateCreat.toISOString().slice(0, 10);//dateCreat.getDate()  + "-" + (dateCreat.getMonth()+1) + "-" + dateCreat.getFullYear() + " " + dateCreat.getHours() + ":" + dateCreat.getMinutes();

					addChannelInfoh += "<div class='topAbout'>Created</div><div class='topDesc'>"+datestring+"</div>";
					var hereInfo = '<span onclick="$('+"'#about_in_group'"+').toggle();" class="text_groups_there">'+common.translate('About')+' </span><div id="about_in_group">'+addChannelInfoh+'</div>';
					hereInfo += '<span onclick="$('+"'#peoples_in_group'"+').toggle();" class="text_groups_there">'+common.translate('Members')+' '+channelModel.people.length+'</span><div id="peoples_in_group">'+peoplesHtml+'</div>';
					
					
					$('#custom_data_text_groups').show();
					$('#custom_data_text_groups').html(hereInfo);
				}
			},
            setOnlineUser: function(userModel, scope){
                $('#custom_data_text').hide();
                if(typeof userModel != 'undefined' && userModel != ''){
                    $('#'+userModel._id).removeClass('headerAppend');
                    $('#header_elem .container').css('text-align', 'center');
                    var isOnline = '<span id="checkedIfOnline' + userModel._id + '"></span> ';
                    if (typeof userModel.socketID != 'undefined' && userModel.socketID != '') {
                        isOnline = '<span id="checkedIfOnline' + userModel._id + '" class="glyphicon glyphicon-ok-sign"></span> ';
                    }
					var docallnow = '<span class="glyphicon glyphicon-earphone chatCallingBtn" ng-click="miniChatDoCall('+"'"+userModel.email+"'"+","+"'"+userModel.socketID+"'"+')"></span>';
					
					var seeImghere = '<div class="minichatMakeCircleImage imageCircleForChat"><img class="miniChatFloatingFriendsPhoto" src="/files/brand/logo.png" alt=""></div>';
					if (userModel.pic != "") {
						seeImghere = '<div class="minichatMakeCircleImage imageCircleForChat"><img class="miniChatFloatingFriendsPhoto" src="/files/'+userModel.email+'/'+userModel.pic+'" alt=""></div>';
					}
					
					var channelClass = "";
                    var textIn = '<span class="custom_data_in_container center_top"><a href="/#/'+userModel.email+'">' + seeImghere + isOnline + userModel.firstname + ' ' + userModel.lastname + '</a></span>'+docallnow;
					if(typeof userModel.email == "undefined"){
						textIn = '<span class="custom_data_in_container center_top channelTopAbout">' + isOnline + userModel.firstname + ' ' + userModel.lastname + '</span>';
						channelClass = "channelInfoClass";
					}
					
					var infoButton = '<span onclick="$('+"'.rightInfoAboutMessages'"+').toggleClass('+"'notShowingDisplay'"+'); $('+"'.containerMessages'"+').toggleClass('+"'procent80width'"+');" class="glyphicon glyphicon-info-sign icon-in-menu icon-turn-off infoForButton '+channelClass+'"></span>';
                    var leaveGr = '<span ng-click="hideChannel('+"'"+userModel._id+"'"+')" class="glyphicon glyphicon-minus-sign glyph_delete_conv hideChannelOnMainView"></span>';
					
					$('#custom_data_text').show();
					if ($('#menuConvBack')) { $('#menuConvBack').show(); }
					$('#custom_data_text').html(
                    $compile(
                        textIn+"<div class='rightButtonsOnMainView'>"+infoButton+leaveGr+"</div>"
                    )(scope)
					);
					
					//$('#custom_data_text').html(textIn+infoButton+leaveGr);
					$('#custom_data_text_groups').html("<div class='big_image_about_chatUser'>"+seeImghere+"<div class='big_img_chatRight'>"+userModel.firstname + ' ' + userModel.lastname+"</div>"+"</div>");
                }
            },
            setToBottomMessages: function($scope){
                if(common.checkIfSizeIsSmall()){
                    common.renderManualView(function(){
                        //$(window).scrollTop($(document).height());
                        $('body, html').animate({
                            scrollTop: $(document).height()
                        }, 500);
                    }, $scope);
                    var fixPositionFixedElements = function(elem){
                        elem = elem || document.documentElement;

                        // force a reflow by increasing size 1px
                        var width = elem.style.width,
                            px = elem.offsetWidth+1;

                        elem.style.width = px+'px';

                        setTimeout(function(){
                            // undo resize, unfortunately forces another reflow
                            elem.style.width = width;
                            elem = null;
                        }, 0);
                    };
                }else{
                    common.renderManualView(function(){if($('#messagesContainer').length > 0){$('#messagesContainer').scrollTop($('#messagesContainer')[0].scrollHeight);}}, $scope);
                }
            },
            getSelectedUser: function(){
                return this.selectedUserModel;
            },
            getSelectedUsersImg: function(){
                if(typeof this.selectedUserModel !== 'undefined' && this.selectedUserModel !== '' && this.selectedUserModel.pic !== ''){
                    return '<img class="profileListPhoto" src="/files/'+this.selectedUserModel.email+'/'+this.selectedUserModel.pic+'" alt="" />';
                }
                return '';
            },
			replaceAllIcons: function(msg) {
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
			},
            addToHeader: function(userModel, msg){
				if(userModel != ''){
					userModel.hasWrote = 'headerAppend';
					userModel.bottomText = this.replaceAllIcons(msg);
				}
            },
            changeMessageContentTo: function(userModel){
                userModel.hasWrote = '';
                userModel.bottomText = '';
                $(this.ui.messages).html(common.translate('Loading ...'));
            }
        };
    }]);
});
