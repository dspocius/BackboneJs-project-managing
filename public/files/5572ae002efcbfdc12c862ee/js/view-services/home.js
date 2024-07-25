define(['./module'], function (services) {
    'use strict';
    services.factory('viewHome', ['common','authentication', 'socketService', function (common, authentication, socketService) {
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
                    var msg = $(this.ui.text).val();
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
                for (var i in files) {
                    fd.append("uploadedFile", files[i]);
                }
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
            },
            setSelectedUser: function(userModel){
                if(typeof this.selectedUserModel != 'undefined' && this.selectedUserModel != ''){
                    this.selectedUserModel.isChosen = '';
                }
                this.selectedUserModel = userModel;
                if(typeof userModel != 'undefined' && userModel != ''){
                    userModel.isChosen = 'selectedUser';
                }
                this.setOnlineUser(userModel);
                this.setPeopleInGroup(userModel);
            },
            setPeopleInGroup: function(channelModel){
                $('#custom_data_text_groups').html('');
                if(typeof channelModel !== 'undefined' && channelModel !== '' &&
				typeof channelModel.email === 'undefined'){
					var peoplesHtml = '';
					var isOnlineThatPerson = '';
					for(var i=0; i < channelModel.people.length; i++){
						var socUsers = socketService.connected.users;
						for(var jj=0; jj < socUsers.length; jj++){
							if(socUsers[jj].name === channelModel.people[i].email){
								isOnlineThatPerson = '<span class="glyphonline glyphicon glyphicon-record"></span> ';
							}
						}
					peoplesHtml += '<span class="onePeopleClass">'+isOnlineThatPerson+channelModel.people[i].firstname+' '+channelModel.people[i].lastname+'</span>';
					}
					$('#custom_data_text_groups').html('<span onclick="$('+"'#peoples_in_group'"+').toggle();" class="center_top text_groups_there">'+common.translate('Connected')+': '+channelModel.people.length+'</span><div style="display:none;" id="peoples_in_group">'+peoplesHtml+'</div>');
				}
			},
            setOnlineUser: function(userModel){
                $('#custom_data_text').html('');
                if(typeof userModel != 'undefined' && userModel != ''){
                    $('#'+userModel._id).removeClass('headerAppend');
                    $('#header_elem .container').css('text-align', 'center');
                    var isOnline = '<span id="checkedIfOnline' + userModel._id + '"></span> ';
                    if (typeof userModel.socketID != 'undefined' && userModel.socketID != '') {
                        isOnline = '<span id="checkedIfOnline' + userModel._id + '" class="glyphicon glyphicon-ok-sign"></span> ';
                    }
                    var textIn = '<span class="custom_data_in_container center_top">' + isOnline + userModel.firstname + ' ' + userModel.lastname + '</span>';
                    $('#custom_data_text').html(textIn);
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
                    return '<img class="profileListPhoto" src="/files/'+this.selectedUserModel.pic+'" alt="" />';
                }
                return '';
            },
            addToHeader: function(userModel, msg){
				if(userModel != ''){
					userModel.hasWrote = 'headerAppend';
					userModel.bottomText = msg;
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
