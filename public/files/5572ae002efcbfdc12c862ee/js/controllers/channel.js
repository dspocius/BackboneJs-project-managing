define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('Channel', ['api', 'common', '$scope', '$location', 'viewChannel', 'usersCollection','viewChannelsGrid', 'viewUsersGrid', 'socketService','authentication','topMenuView','bottomMenuView','viewHome', 'userModel','baseCollection',
        function (api, common, $scope, $location, viewChannel, usersCollection, viewChannelsGrid, viewUsersGrid,  socketService, authentication, topMenuView, bottomMenuView, viewHome, userModel, baseCollection) {
            viewHome.setSelectedUser('');
            $('#custom_data_text').html('');
            viewChannel.initializeScopeListening($scope);
            var users, myChannels, 
			connectedCol, archivedCol, channelsSearch, loggedUserEmail, allFriendsUsers,
			friendsList, usersAddCol;
			var peoplesToAddToNewChannel = [];
            var auth = new authentication();
            var topMView = new topMenuView('',$scope);
            topMView.initializeScopeListening();
            var bottomMView = new bottomMenuView('',$scope);
            this.initializeUsersView = function(data){
			myChannels = new baseCollection({FullUrl:'/getMyChannels/'+data._id+'/0'});
			channelsSearch = myChannels;
			if(typeof viewHome.ChannelsColLoaded != 'undefined'){
				myChannels = viewHome.ChannelsColLoaded;
				this.AfterFetchFunction();
			}else{
				myChannels.fetch().done(this.AfterFetchFunction);
			}
            topMView.initializeDefaultMenu();
            bottomMView.initializeDefaultMenu(common.translate('Channels'));
            }.bind(this);
			this.AfterFetchFunction = function(){
				viewHome.ChannelsColLoaded = myChannels;
				myChannels.setAttributeByArrayInsideAttrById('show', 'people', authentication.connectedUser._id);
				//$('#peopleV #usersGridView').html('');
                $('#peopleV #requestsGridView').html('');
                $('#peopleV #friendsGridView').html('');
                connectedCol = new baseCollection({FullUrl:''});
                archivedCol = new baseCollection({FullUrl:''});
				connectedCol.bindData(myChannels.models);
				archivedCol.bindData(myChannels.models);
				connectedCol.removeByAttribute('show',false);
				archivedCol.removeByAttribute('show',true);
				usersAddCol = new usersCollection();
				friendsList = authentication.connectedUser.friends.filter(function(el){ if(typeof el == 'undefined'){ return false; } return !el.removed && !el.blocked && !el.blockedBy; }).sort(function(el){ if(typeof el == 'undefined'){ return false; } return el.isConnected; });
                usersAddCol.bindData(friendsList);
				new viewUsersGrid({collection: usersAddCol, noentries:'{{"Add friends by searching them in People view" | translate}}', addHtmlToChild:'<div ng-click="addUserToChannel(user._id)" id="channelTo_addUser" class="channelTo_addUserClass glyphicon glyphicon-plus icon-in-menu icon-turn-off user-add ng-scope"></div>'}, $scope,'#peopleV #peopleToAdd');
                new viewChannelsGrid({collection: connectedCol, noentries:'{{"You do not have any connections to channels" | translate}}', addHtmlToChild:''}, $scope,'#peopleV #friendsGridView');
                new viewChannelsGrid({collection: archivedCol, noentries:'{{"You do not have any archyved channels" | translate}}', addHtmlToChild:''}, $scope,'#peopleV #activeGridView');
				loggedUserEmail = authentication.connectedUser.email;
				$('#friendsNumb').html('('+connectedCol.models.length+')');
				$('#activeNumb').html('('+archivedCol.models.length+')');
                common.renderView($scope);
			}
			this.addToChannelsCol = function(model){
				myChannels.addModel(model);
				myChannels.setAttributeByArrayInsideAttrById('show', 'people', model._id);
				connectedCol.addModel(model);
				connectedCol.setAttributeByArrayInsideAttrById('show', 'people', model._id);
				$('#friendsNumb').html('('+connectedCol.models.length+')');
			}
			this.setChannelsColAttrByName = function(id, attr, attrVal){
				if(typeof myChannels.getModelByProperty('_id',id) != 'undefined' &&
				 typeof myChannels.getModelByProperty('_id',id)[attr] != 'undefined'){
					myChannels.getModelByProperty('_id',id)[attr] = attrVal;
					myChannels.setInnersArraysAttribute('_id',id, 'people', authentication.connectedUser._id, 'show', attrVal);
				}
				if(typeof connectedCol.getModelByProperty('_id',id) != 'undefined' &&
				 typeof connectedCol.getModelByProperty('_id',id)[attr] != 'undefined'){
					connectedCol.getModelByProperty('_id',id)[attr] = attrVal;
				}
				if(typeof archivedCol.getModelByProperty('_id',id) != 'undefined' &&
				 typeof archivedCol.getModelByProperty('_id',id)[attr] != 'undefined'){
					archivedCol.getModelByProperty('_id',id)[attr] = attrVal;
				}
			}
			$scope.addUserToChannel = function(userId){
				var personObj = usersAddCol.getModelByProperty('_id',userId);
				personObj.id = personObj._id;
				personObj.show = true;
				peoplesToAddToNewChannel.push(personObj);
				$('#'+userId+' #channelTo_addUser').hide();
			}.bind(this);
			$scope.addChannelNew = function(){
				var name = $('#channelName').val();
				var about = $('#channelAbout').val();
				var type = $('#channelsType').val();
				var people = peoplesToAddToNewChannel;
				people.push({email:authentication.connectedUser.email, show:true, id: authentication.connectedUser._id, firstname:authentication.connectedUser.firstname, lastname:authentication.connectedUser.lastname});
				if(name !== '' && about !== '' && type !== ''){
					 var addChannel = new userModel();
					 addChannel.url = '/createChannel';
					 addChannel.name = name;
					 addChannel.about = about;
					 addChannel.type = type;
					 addChannel.people = people;
					 addChannel.save().done(function(dataResp){
						 peoplesToAddToNewChannel = [];
						 $('.channelTo_addUserClass').show();
						 $('#channelName').val('');
						 $('#channelAbout').val('');
						 dataResp.show = true;
						 this.addToChannelsCol(dataResp);
					 }.bind(this));
				}
			}.bind(this);
			$scope.searchChannel = function(){
				var searchVal = $('#people_search').val();
				if(searchVal !== ''){
					channelsSearch = new baseCollection({FullUrl:'/channelsOpen/'+searchVal+'/0'});
                    channelsSearch.fetch().done(function(){
						channelsSearch.setAttribute('Added', myChannels.models);
                        var gridView = new viewChannelsGrid({noentries:'{{"No channels found" | translate}}', collection: channelsSearch, addHtmlToChild:'<div ng-if="!channel.Added" ng-click="addChannelClick(channel._id)" id="channel_add" class="glyphicon glyphicon-plus icon-in-menu icon-turn-off user-add"></div>'}, $scope, '#peopleV #usersGridViewRows');
                    });
				}
			};
            $scope.hideChannel = function(channelId){
				if(channelId !== ''){
					 var addChannel = new userModel();
					 addChannel.url = '/ChangeChannelsView';
					 addChannel.id = channelId;
					 addChannel.show = false;
					 addChannel.people = authentication.connectedUser._id;
					 addChannel.save().done(function(){
						 this.setChannelsColAttrByName(channelId, 'show', false);
						//var channelsModel = channelsSearch.getModelByProperty('_id',channelId);
						//this.addToChannelsCol(channelsModel);
					}.bind(this));
				}
			}.bind(this)
            $scope.showChannel = function(channelId){
				if(channelId !== ''){
					 var addChannel = new userModel();
					 addChannel.url = '/ChangeChannelsView';
					 addChannel.id = channelId;
					 addChannel.show = true;
					 addChannel.people = authentication.connectedUser._id;
					 addChannel.save().done(function(){
						 this.setChannelsColAttrByName(channelId, 'show', true);
						//var channelsModel = channelsSearch.getModelByProperty('_id',channelId);
						//this.addToChannelsCol(channelsModel);
					}.bind(this));
				}
            }.bind(this)
            $scope.addChannelClick = function(channelId){
                if($('#channel'+channelId+' #channel_add').hasClass('glyphicon-plus')){
					var people = {email: authentication.connectedUser.email, show: true, id: authentication.connectedUser._id, firstname:authentication.connectedUser.firstname, lastname:authentication.connectedUser.lastname};
					if(channelId !== ''){
						 var addChannel = new userModel();
						 addChannel.url = '/addPeopleToChannel';
						 addChannel.id = channelId;
						 addChannel.people = people;
						 addChannel.save().done(function(dataResp){
							 var channelsModel = channelsSearch.getModelByProperty('_id',channelId);
							 channelsModel.people.push(people);
							 this.addToChannelsCol(channelsModel);
							 $('#channel'+channelId+' #channel_add').remove();
						 }.bind(this));
					}
                }
            }.bind(this)
            auth.connectedUser(this.initializeUsersView);

            this.listenTo = function(){
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
                viewChannel.listenToOnceInit = true;
                socketService.on('user_disconnected', function(obj){
                    socketService.connected = obj;
                });
                socketService.on('user_connected', function(obj){
                    socketService.connected = obj;
                });
                socketService.on('chat message', function(obj){
						if(location.hash.indexOf('home') == -1){
							if(!$('li#'+common.translate('Home')+' #numbMsg').length){
								$('li#'+common.translate('Home')+'').append('<div class="numberOnIcon" id="numbMsg">1</div>');
							}else{
								var msgCount = 1;
								if($('li#'+common.translate('Home')+' #numbMsg').html() !== ''){
									msgCount = parseInt($('li#'+common.translate('Home')+' #numbMsg').html())+1;
								}
								$('li#'+common.translate('Home')+' #numbMsg').html(msgCount);
							}
						}
                });
            }
            if(typeof viewChannel.listenToOnceInit === 'undefined' && !viewChannel.listenToOnceInit){
                this.listenToOnce();
            }
            this.listenTo();
        }]);
});
