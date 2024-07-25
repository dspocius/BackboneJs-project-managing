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
			
			var mainViewShowingNow = "time_view_show";//this.getMainViewOfSite(options);
			this.mainViewShowingInNow = mainViewShowingNow;
			var pressedOtherView = false;
			var mainViewObject = {};
			var navigationModelObj = "";
            var id = '';
            var id_on_link = '_';
            var islistOne = false;
            var projectsShared = this.getProject("friends");
            var projects = this.timelineProject;
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
			var renderPhotoAccount = function(){
				var getSettingOfInfo = app.getSettingInWhole("info_about");
				if(typeof app.userIsNotLoggedIn === "undefined" || !app.userIsNotLoggedIn){
				if(typeof options != "undefined" && options.peopleCol != "undefined" && typeof options.people != 'undefined' && options.people != '' && (typeof app.userConnected.data2 !== 'undefined' && options.people != app.userConnected.data2.email)){
						
						var userPic = options.peopleCol.get('pic');
						var userID = options.peopleCol.get('_id');
						var userEmail = options.peopleCol.get('email');
						var firstLastname = options.peopleCol.get('firstname')+' '+options.peopleCol.get('lastname');
						var friends_of_me = app.userConnected.data2.friends;
						var isInFriendsLine = false;
						var isHeBlocked = false;
						var isHeShowing = true;
						var whichFriendObj = "";
						if(typeof friends_of_me !== "undefined" && typeof friends_of_me.length !== "undefined"){
							for(var j=0; j < friends_of_me.length; j++){
								if(friends_of_me[j]._id === userID){
									isInFriendsLine = true;
									isHeBlocked = friends_of_me[j].blocked;
									isHeShowing = friends_of_me[j].show;
									whichFriendObj = friends_of_me[j];
								}
							}
						}
						
						var ehbuttonsdataFor = '<div class="dropdown" style="display:inline-block;">';
							ehbuttonsdataFor += '  <button class="btn btn-default dropdown-toggle viewButtonsIn viewsSmallButtonLight" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">';
							ehbuttonsdataFor += '<div class="glyphicon glyphicon-option-horizontal icon-in-menu icon-turn-off" aria-hidden="true"></div>';
							ehbuttonsdataFor += '	<span class="caret"></span>';
							ehbuttonsdataFor += '</button>';
							ehbuttonsdataFor += '';
 							ehbuttonsdataFor +=  '<ul id="addAllMenuData" class="dropdown-menu" aria-labelledby="dropdownMenu1">';
						
						var buttonsForData = '<li><button id="addthatuserone" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Add')+'</button></li>';
						if(isInFriendsLine){
							buttonsForData = '';
							if(isHeShowing){
								buttonsForData += '<li><button id="writeAMessage" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Message')+'</button></li>';
								buttonsForData += '<li><button id="removeThatUser" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Archive')+'</button></li>';
							}else{
								buttonsForData += '<li><button id="removeThatUserShowNow" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Show')+'</button></li>';
							}
							if(isHeBlocked){
								buttonsForData += '<li><button id="UnblockThatUser" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Unblock')+'</button></li>';
							}else{
								buttonsForData += '<li><button id="blockThatUser" class="general_button rounded_button_small viewButtonsIn margin0">'+app.translate('Block')+'</button></li>';
							}
						}
						ehbuttonsdataFor += buttonsForData;
						ehbuttonsdataFor +=  '</ul>';
						ehbuttonsdataFor += '</div>';
							
						
						var htmlImg = '';
						var userHtmlImg = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+userEmail+'/'+userPic+'" alt="" /></div>';
						if(userPic != ""){
							htmlImg = userHtmlImg;
						}
						var profileInfo = '<div class="users_user_glyph_on_top_front_page glyphicon glyphicon-user"></div><div class="users_info_all_about"><div class="users_info_in_projects"><div class="usersEmail_of">'+userEmail+'</div><div class="usersInfo_of"><b>'+firstLastname+ehbuttonsdataFor+'</b></div></div></div>';
						if(getSettingOfInfo !== ""){
							profileInfo = profileInfo+'<div class="users_info_all_about users_settings_info">'+getSettingOfInfo+'</div>';
						}
						if(options.settings.backgroundPictureAccount != ""){
							$("#users_account_in_project_small").css("background-image", 'url('+config.filesurl+'/filesproject_managing_files/ProjectManagementFiles/'+options.settings.backgroundPictureAccount+'")');
							$("#users_account_in_project_small").css("background-size", 'cover');
						}
						$("#users_account_in_project_small").html('<div class="all_users_info_in_front_page">'+htmlImg+"<div class='profile_data_all_front_page'>"+profileInfo+'</div><div style="clear:both;"></div></div>');
						
						$("#writeAMessage").click(function(){
							miniChatClicked(options.peopleCol.get('_id'));
						});
						$("#addthatuserone").click(function(){
							$("#addthatuserone").remove();
							var addMeToThat = {
								_id:app.userConnected.data2._id,
								approved:false,
								email:app.userConnected.data2.email,
								real_email:app.userConnected.data2.real_email,
								firstname:app.userConnected.data2.firstname,
								lastname:app.userConnected.data2.lastname,
								pending:false,
								pic:app.userConnected.data2.pic,
								removed:false,
								show:true
							};
							var addHimToMe = {
								_id: options.peopleCol.get('_id'),
								approved:false,
								email: options.peopleCol.get('email'),
								real_email: options.peopleCol.get('real_email'),
								firstname: options.peopleCol.get('firstname'),
								lastname: options.peopleCol.get('lastname'),
								pending:false,
								pic: options.peopleCol.get('pic'),
								removed:false,
								show:true
							};
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: app.userConnected.data2.email, friendsAdd: [addHimToMe] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: options.peopleCol.get('email'), friendsAdd: [addMeToThat] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
								location.reload();
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
						$("#removeThatUserShowNow").click(function(){
							whichFriendObj.show = true;
							$("#removeThatUserShowNow").remove();
							var removeThat = {remove:false, _id: options.peopleCol.get('_id')};
							
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: app.userConnected.data2.email, removeFriends: [removeThat] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
						});
						
						
						$("#blockThatUser").click(function(){
							whichFriendObj.blocked = true;
							$("#blockThatUser").remove();
							var addMeToThat = {
								_id:app.userConnected.data2._id,
								blockedBy:true
							};
							var addHimToMe = {
								_id: options.peopleCol.get('_id'),
								block:true
							};
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: app.userConnected.data2.email, removeFriends: [addHimToMe] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: options.peopleCol.get('email'), removeFriends: [addMeToThat] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
						});
						$("#UnblockThatUser").click(function(){
							whichFriendObj.blocked = false;
							$("#UnblockThatUser").remove();
							var addMeToThat = {
								_id:app.userConnected.data2._id,
								blockedBy:false
							};
							var addHimToMe = {
								_id: options.peopleCol.get('_id'),
								block:false
							};
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: app.userConnected.data2.email, removeFriends: [addHimToMe] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
								$.ajax({
								  method: "PUT",
								  url: "/updateuser",
								  data: JSON.stringify({ email: options.peopleCol.get('email'), removeFriends: [addMeToThat] }),
									contentType: 'application/json; charset=utf-8',
									dataType: 'json'
								});
						});
						
				}else{
					if(typeof app.userConnected.data2 !== 'undefined'){
						var userPic = app.userConnected.data2.pic;
						var userEmail = app.userConnected.data2.email;
						var firstLastname = app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname;
						var htmlImg = '';
						var userHtmlImg = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+userEmail+'/'+userPic+'" alt="" /></div>';
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
				console.log("modelsAddmodelsAdd",modelsAdd);
				if(typeof options != "undefined" && typeof options.addModels !== "undefined" && options.addModels != ""){
					var modelsAdd = options.addModels;
					console.log("modelsAddmodelsAdd",modelsAdd);
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
				projects = this.getProject(id_on_link);
				navigation_pr = this.getNavigationAllL(projects);
                if(navigation_pr === ''){
                    if(typeof this.projectModels[projects.idd] != 'undefined'){
                        thisProj = this.projectModels[projects.idd];
                    }else{
                        thisProj = new project({_id:projects.idd});
						thisProj.url = config.urlAddr+'/projectentryy/'+projects.idd;
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
					thisProj = navigation_pr;
					if (peopleColAdd != "") {
						projects.peopleColAdd = peopleColAdd;
					}
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
											}, 1000);
											
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
							projects.addSharedModels(projectsShared);
						}else{
							app.vent.on("userConnected:ready", function(){
								projects.addSharedModels(projectsShared);
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
										projects.models[ii].set('parentvisibility', projects.models[ii].get("visibility"));
										//projects.models[ii].set('parentvisibility', 'editprivate');
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
					});
			}
            var menuTopRightCol = new Nav([
                {title: '<div class="glyphicon glyphicon-menu-hamburger fontsize23"></div><div></div>Menu', name: '',actionEx:'open_right_menu', active: false},
				//{title: '<div class="rightAdd"><div class="glyphicon glyphicon-plus-sign fontsize23"></div><div></div>Create</div>', name: '',actionEx:'add', active: false}
            ]);
			if(thisProj == ""){
				 menuTopRightCol = new Nav([
					//{title: '<div class="glyphicon glyphicon-plus-sign fontsize23"></div><div></div>Create', name: '',actionEx:'add', active: false}
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
            this.listenTo(projects, 'remove add',function(modell){
					//thh.renderMainView();
					$("#viewsAdded .viewButtonsInSelected").trigger("click");
					setTimeout(function(){
						$("#viewsAdded .viewButtonsInSelected").trigger("click");
					}, 1);
            });
			this.prjsprojects = projects;
            this.listenTo(projects, 'change:inHeaderUpdateView',function(modell){
                if(typeof modell != "undefined" && typeof modell.get('inHeaderUpdateView') != 'undefined'
                    && modell.get('inHeaderUpdateView') == 'yes'){
                    this.prjsprojects.sort(this.prjsprojects.comparator());
                    modell.unset('inHeaderUpdateView', 'silent');
					/*thh.renderMainView();*/
					//thh.renderMainView();
					//$("#viewsAdded .viewButtonsInSelected").trigger("click");
                }
			}.bind(this));
            this.listenTo(projects, 'change:onAddModelsGoGo',function(modell){
                if(typeof modell != "undefined" && typeof modell.get('onAddModelsGoGo') != 'undefined'
                    && modell.get('onAddModelsGoGo') !== ''){
                    this.refreshProjectsRender("", modell.get('onAddModelsGoGo'));
                    modell.unset('onAddModelsGoGo', 'silent');
					/*thh.renderMainView();*/
					//thh.renderMainView();
					//$("#viewsAdded .viewButtonsInSelected").trigger("click");
                }
			}.bind(this));
            this.listenTo(projects, 'change:inCollectionData',function(modell){
				this.onProjectChange(modell);
			}.bind(this));
        }
    });
    return projectsContr;
});
