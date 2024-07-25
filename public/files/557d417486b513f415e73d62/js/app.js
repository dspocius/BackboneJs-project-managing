/*global define */

define([
    'jquery',
    'backbone',
	'marionette',
    'regions/notification',
    'regions/dialog',
	'collections/Nav',
	'views/MenuView',
	'views/Footer',
    'models/project',
    'models/user',
    'views/EmptyView',
    'models/logging',
    'socket',
	'lib/translate',
	'lib/russian',
	'/javascripts/projects/notificationsView.js',
    '/javascripts/projects/mini_chat.js'
], function (jquery, Backbone, Marionette, NotifyRegion, DialogRegion, Nav, MenuView, Footer,Project, User, EmptyView, logging,socket,
underi18n, russian) {
	'use strict';
	
	var app = new Marionette.Application();
    app.socketService = io.connect();
	app.isLoadingNow = false;
	app.translate = function(name){
		return name;
	};
	app.getWhenNoBoardItems = function(){
		$('#main').html('<div class="background_color_general padding5 paddingleft15 paddingbottom15" id="imgWhenEmpty"<h1>Project does not have any records</h1></div>');
	}
	app.getWhenNotFoundData = function(){
		$('#main').html('<div class="background_color_general padding5 paddingleft15 paddingbottom15" id="imgWhenEmpty"<h1>Project is not found</h1></div>');
	}
	app.getWhenPrivateData = function(){
		$('#main').html('<div class="background_color_general padding5 paddingleft15 paddingbottom15" id="imgWhenEmpty"><h1>Project is private</h1></div>');
	}
	app.getLoadingIt = function(){
		$('#main').html('<div class="loading_main_big" style=" "><div id="loading_spin"></div></div>');
		new window.Spinner({radius: 30, length: 20, width: 10, color: '#F8FAFD', trail: 40}).spin(document.getElementById('loading_spin'));
	}
	app.noRecordsInIt = function(){
		return "<div>"+app.translate('No records yet')+"</div>";
	}
	var commentsCol = new Backbone.Model();
	commentsCol.set('color','#80BCF0');
	commentsCol.url = '/commentsU/projectsManagement/'+0+'/true';

		app.getSetting = function(model, value){
			var arrays = model.get('messages');
			var confValue = '';
			for(var i=0; i < arrays.length; i++){
				if(arrays[i].from === value){
					confValue = arrays[i].message;
				}
			}
			return confValue;
		}
		app.getSettingsCol = function(){
			return commentsCol;
		};
		app.getDefaultRoots = function(){
			var navLinks = '<a href="#home">'+app.translate('Home')+'</a>'; // (';
			//navLinks += '<a href="#projectsinlist/friends/friends">'+app.translate('Shared')+'</a>)';
		return navLinks;
		};
		/*app.vent.on('render:manual:view', function(){*/
			commentsCol.fetch().done(function(){
			app.translate = function(name){ return 'app'+name;};//underi18n.MessageFactory(russian());
			$('#valueSearch').attr('placeholder', app.translate('Search'));
			app.vent.trigger('refresh:footermenu');
	
				var use_defined_style = app.getSetting(commentsCol, 'use_defined_style');
				var color = app.getSetting(commentsCol, 'color');
				var websiteStyle = app.getSetting(commentsCol, 'websiteStyle');
				var backgroundPicture = app.getSetting(commentsCol, 'backgroundPicture');
				var borderRadius = app.getSetting(commentsCol, 'borderRadius');
				var listsColor = app.getSetting(commentsCol, 'listsColor');
				var outerIconsColor = app.getSetting(commentsCol, 'outerIconsColor');
				var innerIconsColor = app.getSetting(commentsCol, 'innerIconsColor');
				
				if(websiteStyle !== 'Default'){
					$('link[id="looking_style"]').attr('href','/stylesheets/projects/wide.css');
				}
				if(borderRadius != '' && backgroundPicture != '' && use_defined_style != ''){
					var styleHtml = 'html{ background-image: url(/files/project_managing_files/ProjectManagementFiles/'+backgroundPicture+'); }';
					styleHtml += '.nav>li{ color:'+innerIconsColor+'!important; background:'+outerIconsColor+'; border-radius:'+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.miniChatmessagesNewUsers{ border-radius: '+parseInt(borderRadius)+'px; color:'+innerIconsColor+'; background-color:'+outerIconsColor+'; }';
					styleHtml += '.nav>li a{ color:'+innerIconsColor+'!important; }';
					styleHtml += '.nav>li button{ color:'+innerIconsColor+'!important; }';
					styleHtml += '#left-menu .nav>li{ border-radius: '+parseInt(borderRadius)+'px;'+' }';
					styleHtml += '.userChoose{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.sendButton{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.textareaforuser{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.message_text_left{ background-color:'+outerIconsColor+'; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.myMessageInChat .message_text_left{ background-color:'+innerIconsColor+'; }';
					styleHtml += '#valueSearch{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.search_textarea{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.fc-event { color:'+innerIconsColor+';background:'+outerIconsColor+'!important; border:1px solid '+innerIconsColor+'!important; outline:none; }';
					styleHtml += '.fc-button { color:'+innerIconsColor+';background:'+outerIconsColor+'!important; }';
					styleHtml += '.fc-state-active { background:'+innerIconsColor+'!important;color:'+outerIconsColor+'!important; }';
					styleHtml += '.viewButtonsIn { color:'+innerIconsColor+'; background:'+outerIconsColor+'!important; }';
					styleHtml += '.viewButtonsInSelected { background:'+innerIconsColor+'!important;color:'+outerIconsColor+'!important; }';
					if(websiteStyle !== 'Default'){
						styleHtml += '.footer, .header { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
						styleHtml += '#left-menu .nav>li { border-bottom:1px solid '+innerIconsColor+'!important; }';
						styleHtml += '#left-menu { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; border-right:1px solid '+innerIconsColor+'!important; }';
					}
					styleHtml += '#friendsView { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '#showNotifications { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '.userChoose, .miniChatButtons { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					styleHtml += '.userChoose:hover, .miniChatButtons:hover, #showNotifications:hover { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; border:none; }';
					styleHtml += '.userChoose:last-child { border:none!important; }';

					styleHtml += '.fc-state-hover, .fc-state-active, .fc-button:hover { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.viewButtonsIn:hover,.projectMain:hover, .projectsSelected { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover, .nav>li.active { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.nav>li.active a { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover a { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '.nav>li:hover button { background:'+innerIconsColor+'!important;  color:'+outerIconsColor+'!important; }';
					styleHtml += '#navigation_main a {   color:'+outerIconsColor+'!important; }';
					styleHtml += '#navigation_main a:hover {  color:'+innerIconsColor+'!important; }';
				
				$('#manual_style').html(styleHtml);
				}
			}.bind(this)).error(function(){
				app.userIsNotLoggedIn = true;
				app.translate = function(name){ return 'app'+name;};
				app.vent.trigger('refresh:footermenu');
			});
		/*});*/
	
	
    window.dataDrop = function(e){
		var ee = e.target.children;
        if (!jQuery.contains($("#main"), e.target) &&
            !jQuery.contains($('.projectsEdit'), e.target) && typeof ee != 'undefined'){
            
            var canIn = true;
            for(var ii=0;ii < ee.length; ii++){
                if(ee[ii].className == 'projectsDelete' ||
                    ee[ii].className == 'projectsEdit' ){
                    canIn =false;
                }
            }
            if(canIn){
                $('.project_one_good_loading').hide();
                $("#dragHoverElement").remove();
                $("#dragHoverElementHeader").remove();
                Project.selectedVieww = "";
            }
        }
        return true;
    };
    window.resetData = function(e){
        if (!jQuery.contains($("#main"), e.target) &&
        !jQuery.contains($('.projectsEdit'), e.target)){
            var ee = e.target.children;
            var canIn = true;
            for(var ii=0;ii < ee.length; ii++){
                if(ee[ii].className == 'projectsDelete' ||
                    ee[ii].className == 'projectsEdit' ){
                    canIn =false;
                }
            }
            if(canIn){
                $('.project_one_good_loading').hide();
                $("#dragHoverElement").remove();
                $("#dragHoverElementHeader").remove();
            }
        }
        return true;
    };

    var isMobile = false; //initiate as false
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
    app.isMobile = isMobile;

    app.pages = new Nav([
        {title: '<div class="glyphicon glyphicon-home icon-in-menu icon-turn-off" aria-hidden="true"></div><div></div>', name: 'home', active: true}
    ]);

    var menu = new MenuView({collection: app.pages,className:'nav nav-pills nav-center navbar-inner'});
    var leftMenu = new Nav([
        {title: '<div class="glyphicon glyphicon-menu-hamburger icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '', active: false}
    ]);
    var menuNew = [];//[{title: '<div class="glyphicon glyphicon-chevron-right icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: 'right',actionEx:'rightClick', active: false}];
    var leftMenuHidden = new Nav(menuNew);
    var logged = new logging();
    var userConnected = new User();
    app.userConnected = userConnected;
	app.addRegions({
		menu: '#main-nav',
		leftmenu: '#left-menu',
		right_menu_for_data: '#right_menu_for_data',
		menuleft: '#main-nav-left',
		footernavright: '#footer-nav-right',
        footernavleft: '#footer-nav-left',
        footernavcenter: '#footer-nav-center',
        mainHeader: '#main-header',
		main: '#main',
		footer: '#footer',
        notification: {
            selector: "#notification",
            regionType: NotifyRegion
        },
        dialog: {
            selector: "#dialog",
            regionType: DialogRegion
        }
	});

	app.addInitializer(function () {
        app.footernavcenter.show(menu);
	});
    app.vent.on("refresh:footermenu", function(options){
		var homeActive = true;
		var sharedActive = true;
		if(location.href.indexOf('#home') > -1){
		 homeActive = true;
		 sharedActive = false;
		}
        app.pages = new Nav([
            {title: '<div class="glyphicon glyphicon-home icon-in-menu icon-turn-off" aria-hidden="true"></div><div>'+app.translate('Home')+'</div>', name: 'home', active: homeActive}
        ]);
         menu = new MenuView({collection: app.pages,className:'nav nav-pills nav-center navbar-inner'});
         app.footernavcenter.show(menu);
		 //app.vent.trigger('menu:add', '<div class="glyphicon glyphicon-blackboard icon-in-menu icon-turn-off" aria-hidden="true"></div><div>'+app.translate('Shared')+'</div>', 'projectsinlist/friends/friends', sharedActive);
    });
    app.on("initialize:after", function(options){
        if (Backbone.history){
            Backbone.history.start();
        }
    });
    app.socketService.on('commentSend', function (obj) {
		var removeTh = false;
		if(typeof obj.removethis !== 'undefined'){
			removeTh = obj.removethis;
		}
		var commentCol = app.getCommentsCol(obj._id);
		if(commentCol != ''){
		var msgs = commentCol.get('messages');
			if(removeTh){
				var commentDate = obj.date;
				for(var i = msgs.length - 1; i >= 0; i--){
					if(msgs[i].date === commentDate) {
					   msgs.splice(i, 1);
					}
				}
				if(typeof app.CurrentCommentsView != 'undefined'){
					app.CurrentCommentsView.rerenderComments();
				}
			}else{
				msgs.unshift(obj);
				if(typeof app.CurrentCommentsView != 'undefined'){
					app.CurrentCommentsView.rerenderComments();
				}
			}
		}
    });
    app.socketService.on('updateProjectsModel', function (obj) {
		var removeTh = false;
		if(typeof obj.removethis !== 'undefined'){
			removeTh = obj.removethis;
		}
		if(removeTh){
			var modell = new Backbone.Model(obj.modthis);
			app.vent.trigger('remove:cachedCollection:resource', modell, obj.idd);
		}else{
			var modell = new Backbone.Model(obj.modthis);
			app.vent.trigger('update:cachedCollection:resource', modell, obj.idd);
		}
    });
    var cachedCommentsResources = [];
    var cachedCollectionResources = [];
	app.getCommentsCol = function(id){
		if(typeof cachedCommentsResources[id] != 'undefined'){
			return cachedCommentsResources[id];
		}
		return '';
	};
    app.vent.on('add:cachedComments:resource', function (resource) {
		if(typeof cachedCommentsResources[resource._id] == 'undefined'){
			cachedCommentsResources[resource._id] = resource.data;
		}
    });
    app.vent.on('add:cachedModels:resource', function (resource) {
        cachedCollectionResources.push({models: [resource]});
    });
    app.vent.on('add:cachedCollection:resource', function (resource) {
        cachedCollectionResources.push(resource);
    });
    app.vent.on('update:cachedCollection:resource', function (resource, id) {
        var not_updated = true;
        for(var i=0; i < cachedCollectionResources.length; i++){
            for(var j=0; j < cachedCollectionResources[i].models.length; j++){
                if(resource.get('_id') == cachedCollectionResources[i].models[j].get('_id')){
					var letUpdate = true;
					if(typeof cachedCollectionResources[i].idd != 'undefined' && cachedCollectionResources[i].idd == 'friends'){
						if(typeof app.userData != 'undefined'){
							var friendsOfIt = resource.attributes.friends;
							var removeFromCollection = true;
								if(typeof friendsOfIt != 'undefined'){
									for(var ibb=0; ibb < friendsOfIt.length;ibb++){
										if(friendsOfIt[ibb]._id === app.userData._id){
											removeFromCollection = false;
										}
									}
									if(removeFromCollection){
										cachedCollectionResources[i].remove(resource);
										letUpdate = false;
									}
								}
						}
					}
					if(letUpdate){
						cachedCollectionResources[i].models[j].attributes = resource.attributes;
						cachedCollectionResources[i].models[j].attributes.initiateUpdate = true;
						cachedCollectionResources[i].models[j].trigger('change');
						not_updated = false;
						$('#text_id'+cachedCollectionResources[i].models[j].get('_id')).html(cachedCollectionResources[i].models[j].get('text'));
						if(!cachedCollectionResources[i].models[j].get('isHeader')){
							//$('#text_id'+cachedCollectionResources[i].models[j].get('_id')).attr('style','background: '+cachedCollectionResources[i].models[j].get('color'));
							//$('#project_'+cachedCollectionResources[i].models[j].get('_id')).attr('style','position:relative; border: 1px solid '+cachedCollectionResources[i].models[j].get('color'));
							//$('#project_'+cachedCollectionResources[i].models[j].get('_id')+' .glyphicon-list-alt').attr('style','color:'+cachedCollectionResources[i].models[j].get('color'));
						}else{
							//$('#project_'+cachedCollectionResources[i].models[j].get('_id')).attr('style','background: '+cachedCollectionResources[i].models[j].get('color'));
						}
					}
				}
            }
        }
        if(not_updated){
            for(var i=0; i < cachedCollectionResources.length; i++){
                if(typeof cachedCollectionResources[i].idd != 'undefined' && cachedCollectionResources[i].idd == id){
                    cachedCollectionResources[i].add(resource);
                    var inHeaderr = resource.get('inHeader');
                    if(typeof inHeaderr !== 'undefined' && inHeaderr !== ''){
                        for(var j=0; j < cachedCollectionResources.length; j++){
                            if(typeof cachedCollectionResources[j].idd != 'undefined' && cachedCollectionResources[j].idd == inHeaderr){
                                cachedCollectionResources[j].add(resource);
                            }
                        }
                    }
                }
                if(typeof cachedCollectionResources[i].idd != 'undefined' && cachedCollectionResources[i].idd == 'friends'){
                    if(typeof app.userData != 'undefined'){
						var friendsOfIt = resource.attributes.friends;
						var addToCollection = false;
							if(typeof friendsOfIt != 'undefined'){
								for(var ibb=0; ibb < friendsOfIt.length;ibb++){
									if(friendsOfIt[ibb]._id === app.userData._id){
										addToCollection = true;
									}
								}
								if(addToCollection){
									cachedCollectionResources[i].add(resource);
								}
							}
					}
                }
            }
        }
    });
	app.vent.on('remove:cachedCollection:resource', function (resource, id) {
        for(var i=0; i < cachedCollectionResources.length; i++){
            for(var j=0; j < cachedCollectionResources[i].models.length; j++){
                if(resource.get('_id') == cachedCollectionResources[i].models[j].get('_id')){
                    cachedCollectionResources[i].remove(cachedCollectionResources[i].models[j]);
				}
            }
        }
    });
	
	
        logged.fetch().success(function(data){
			$('.header').show();
			$('.footer').show();
			$('#showNotifications').show();
			if(typeof userConnected.data2 == 'undefined'){
				startMiniChat(app.socketService,data.username);
			}
            app.socketService.emit('clientconnected', {id:data.username});
			
            userConnected.urlRoot = '/user/'+data.username;
            userConnected.url = '/user/'+data.username;
            userConnected.fetch().success(function(data2){
                userConnected.data2 = JSON.parse(data2);
				app.userData = JSON.parse(data2);
                app.vent.trigger('userConnected:ready');
                app.vent.trigger('data:triggered:userconnected');
            }.bind(this));
        }.bind(this)).error(function(){
			app.userIsNotLoggedIn = true;
			$('.header').hide();
			$('#showNotifications').hide();
			$('.headerNotLogged').show();
			$('.footer').show();
                userConnected.data2 = {_id:"_", email:"_",firstname:"_", lastname:"_"};
				app.userData = {email:"none",firstname:"none", lastname:"none"};
                app.vent.trigger('userConnected:ready');
                app.vent.trigger('data:triggered:userconnected');
		});
	
	
	app.vent.on('top:leftmenu:show', function () {
        var menuleft = new MenuView({collection: leftMenu, className:'nav nav-pills pull-left'});
        app.menuleft.show(menuleft);
        app.footernavcenter.show(menu);
		if(typeof app.userData == 'undefined'){
			app.vent.on('data:triggered:userconnected', function () {
				app.topLeftShow(menuleft);
			}.bind(this));
		}else{
			app.topLeftShow(menuleft);
		}
    });
	app.emitMessage = function(name, objAdd){
		app.socketService.emit(name, {toEmail:app.userConnected.data2.email, obj:objAdd});
        for(var ii=0; ii < app.userConnected.data2.friends.length; ii++){
            app.socketService.emit(name, {toEmail:app.userConnected.data2.friends[ii].email, obj:objAdd});
        }
	}
	app.topLeftShow = function(menuleft){
                var js = app.userData;
				if(typeof js.programs != "undefined"){
					
                menuNew = [];//[{title: '<div class="glyphicon glyphicon-chevron-right icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: 'right',actionEx:'rightClick', active: false}];
                for(var i=0; i < js.programs.length; i++){
                    menuNew.push({title:app.translate(js.programs[i].name), name:'link',link:'/files/'+js.programs[i]._id+'/index.html', active:false});
                }
                menuNew.push({title: app.translate('Settings'), name: '', active: false, actionEx:'openSettings'});
                menuNew.push({title: app.translate('Account'), name: '', active: false, actionEx:'openAccount'});
                menuNew.push({title: app.translate('Logout'), name: 'logout', active: false});
                leftMenuHidden = new Nav(menuNew);
                var menuleft_inner = new MenuView({collection: leftMenuHidden, className:'nav nav-pills pull-left'});
                this.listenTo(menuleft, 'menuitem:click',function(view){
                    if($('#left-menu').is(':visible')){
                        $('#left-menu').css('display','none');
                    }else{
                        $('#left-menu').css('display','block');
                    }
                    this.listenTo(menuleft_inner, 'menuitem:click',function(view){
						if(view.model.get('actionEx') == 'openSettings'){
                            $('#left-menu').hide();
							Backbone.history.navigate('settings',{ trigger: true });
                        }
						if(view.model.get('actionEx') == 'openAccount'){
                            $('#left-menu').hide();
							Backbone.history.navigate('account',{ trigger: true });
                        }
                    });
                    app.leftmenu.show(menuleft_inner);
                });
			}
	}
    app.vent.on('top:leftmenu:hide', function () {
        app.menuleft.show(new EmptyView());
    });
	app.vent.on('menu:activate', function (activePageModel) {
        if(typeof menu.collection.findWhere({active: true}) != 'undefined'){
            menu.collection.findWhere({active: true}).set('active', false);
        }
        if(typeof activePageModel != 'undefined'){
            activePageModel.set('active', true);
        }
        menu.render();
	});

    app.vent.on('menu:remove', function (projectName) {
        if(typeof menu.collection.findWhere({title: projectName}) != 'undefined'){
            var modell = menu.collection.findWhere({title: projectName});
            menu.collection.remove(modell);
        }
        menu.render();
    });
    app.vent.on('menu:add', function (projectName, namee, activ) {
        if(activ && typeof menu.collection.findWhere({active: true}) != 'undefined'){
            menu.collection.findWhere({active: true}).set('active', false);
        }
        var positionAt = 1;
        if(typeof menu.collection.findWhere({title: projectName}) != 'undefined'){
            var modelT = menu.collection.findWhere({title: projectName});
            positionAt = menu.collection.indexOf(modelT);
            menu.collection.remove(modelT);
        }
        var newMenu = {title: projectName, name: namee, active: activ};
        if(typeof menu.collection.findWhere({name: namee}) == 'undefined'){
            menu.collection.add(newMenu, { at: positionAt });
        }
        menu.render();
    });

    /**
     * Sample JSON Data
     * app.commands.execute("app:notify", {
     *           type: 'warning'    // Optional. Can be info(default)|danger|success|warning
     *           title: 'Success!', // Optional
     *           description: 'We are going to remove Team state!'
     *       });
     */
    app.commands.setHandler("app:notify", function(jsonData) {
        require(['views/NotificationView'], function(NotifyView) {
            app.notification.show(new NotifyView({
                model: new Backbone.Model(jsonData)
            }));
        });
    });

    /**
     * @example
     * app.commands.execute("app:dialog:simple", {
     *           icon: 'info-sign'    // Optional. default is (glyphicon-)bell
     *           title: 'Dialog title!', // Optional
     *           message: 'The important message for user!'
     *       });
     */
    app.commands.setHandler("app:dialog:simple", function(data) {
        require(['views/DialogView', 'models/Dialog', 'tpl!templates/simpleModal.html'],
            function(DialogView, DialogModel, ModalTpl) {

                app.dialog.show(new DialogView({
                    template: ModalTpl,
                    model: new DialogModel(data)
                }));
            });
    });

    /**
     * @example
     * app.commands.execute("app:dialog:confirm", {
     *           icon: 'info-sign'    // Optional. default is (glyphicon-)bell
     *           title: 'Dialog title!', // Optional
     *           message: 'The important message for user!'
     *           'confirmYes': callbackForYes, // Function to execute of Yes clicked
     *           'confirmNo': callbackForNo, // Function to execute of No clicked
     *       });
     */
    app.commands.setHandler("app:dialog:confirm", function(data) {
        require(['views/DialogView', 'models/Dialog', 'tpl!templates/confirmModal.html'],
            function(DialogView, DialogModel, ModalTpl) {

                app.dialog.show(new DialogView({
                    template: ModalTpl,
                    model: new DialogModel(data),
                    events: {
                        'click .dismiss': 'dismiss',
                        'click .confirm_yes': data.confirmYes,
                        'click .confirm_no': data.confirmNo
                    }
                }));
            });
    });
	
    app.commands.setHandler("app:dialog:edit_project", function(data) {
        require(['views/DialogProjectView', 'models/Dialog', 'tpl!templates/editPModal.html'],
            function(DialogView, DialogModel, ModalTpl) {

                app.dialog.show(new DialogView({
                    template: ModalTpl,
                    model: new DialogModel(data),
                    events: {
                        'click .dismiss': 'dismiss',
                        'click .confirm_yes': data.confirmYes,
                        'click .right_model_menu': data.right_model_menu,
                        'click #update_general_info': data.update_general_info,
                        'keyup .textarea_title': data.field_changed_data,
                        'keyup .description_textarea': data.field_changed_data,
                        'change .color_input_data': data.field_changed_data,
                        'keyup .who_is_working_input': data.field_changed_data,
                        'click #commentSubmitminiEditView': data.commentSubmitminiEditView,
                        'click #add_task_reccurence_edit_view': data.addTaskRecc,
                        'click #add_task_estimate_edit_view': data.addTaskEstim,
                        'click #add_task_to_edit_view': data.addTaskTo,
                        'click #save_task_edit_view': data.saveTasks,
                        'click #add_task_edit_view': data.addTask,
                        'change #friendAddToEntry': data.friendAddToEntry,
                        'click .friends_remove_one': data.friends_remove_one,
                        'click .projectsUploadFileDialog': data.onprojectsUploadFile,
                        'click .removeTaskOne': data.listenToRemoveTask,
                        'click .delete_files_one': data.delete_files_one,
                        'click #visible_to_all': data.visible_to_all,
                        'click #visible_to_all_edit': data.visible_to_all_edit,
                        'click #visible_to_none': data.visible_to_none,
                        'click #visible_to_none_edit': data.visible_to_none_edit,
                        'click #visible_to_all_comment': data.visible_to_all_comment,
                        'click #visible_to_none_comment_edit': data.visible_to_none_comment_edit,
                        'click .removeComment': data.listenToRemoveComment,
                        'click .confirm_no': data.confirmNo
                    }
                }));
            });
    });

	return window.app = app;
});
