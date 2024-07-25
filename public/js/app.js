/*global define */

define([
    'socket',
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
	'lib/translate',
	'lib/russian',
	'lib/ltlang',
	'config',
	'templates',
	'../../javascripts/projects/notificationsView.js',
    '../../javascripts/projects/mini_chat.js',
], function (socket, jquery, Backbone, Marionette, NotifyRegion, DialogRegion, Nav, MenuView, Footer,Project, User, EmptyView, logging,
underi18n, russian, ltlang, config, templates, notif, miniChat) {
	'use strict';
	window.treeprojects = [];
	var app = new Marionette.Application();
    app.socketService = socket.connect(templates.urlAddr);
	/*
	TODO: maybe in the future will need this -> for user to show a notification about disconnection or so on
	app.socketService.on("disconnect", function() {
		console.log("SOCKET DISCONNECTED");
	});
	app.socketService.on("connect", function() {
		console.log("SOCKET connect");
	});*/
	
	app.isLoadingNow = false;
	app.translate = function(name){
		return name;
	};
	if (config.lang != "") {
				if (config.lang == "lt") {
					var allm = ltlang();
					app.translate = function (name) {
						if (allm[name]) {
							return allm[name];
						} else {
							return name;
						}
					};
				} else {
					return name;
				}
			}
	app.addInfoAbout = function(info){
		if(app.getSettingInWhole("default_show_information_tips") == "no"){
			return "";
		}
		if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
			return "";
		}
		var html_inf = "<div class='glyphicon glyphicon-info-sign information_about_item no_moving_zero'><div class='inner_informaiton_about'>"+info+"</div></div>";
		return html_inf;
	};
	
	app.getTimeNow = function(plius){
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var seconds = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(seconds<10){
					seconds='0'+seconds
				} 
				if(typeof plius != "undefined" && plius != ""){
					seconds = today.getSeconds()+1;
				}
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+seconds;
				return today;
		}
	
	if(config.addBottomHtml !== ""){
		$("#allTheBottom").show();
		$("#allTheBottom").html(config.addBottomHtml);
	}
	if(!config.showBottom){
		$(".footer-container").hide();
	}
	app.getWhenNoData = function(){
		return '<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"<h1>No data</h1></div>';
	}
	app.getWhenNoBoardItemsWhereToForPeople = function(where){
		//$(where).html('<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"><div class="right_info_big_project"><h1 class="project_do_not_have_empt">No records here<div class="more_info_on_empt_proj">Tap plus to add entries</div></h1> <div class="big_icon_glyph_lik_text glyphicon glyphicon-info-sign"></div></div><div class="clear_both"></div></div>');
	}
	app.getWhenNoBoardItemsWhereToTheCreator = function(where){
		//$(where).html('<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"><div class="right_info_big_project"><h1 class="project_do_not_have_empt">You did not create any records yet<div class="more_info_on_empt_proj">Tap plus to add entries</div></h1> <div class="big_icon_glyph_lik_text glyphicon glyphicon-info-sign"></div></div><div class="clear_both"></div></div>');
	}
	app.getWhenNoBoardItemsWhereTo = function(where){
		//$(where).html('<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"><div class="right_info_big_project"><h1 class="project_do_not_have_empt">Project does not have any records<div class="more_info_on_empt_proj">Tap plus to add entries</div></h1> <div class="big_icon_glyph_lik_text glyphicon glyphicon-info-sign"></div></div><div class="clear_both"></div></div>');
	}
	app.getWhenNoBoardItems = function(){
		$('#main').html('<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"><div class="right_info_big_project"><h1 class="project_do_not_have_empt">Project does not have any records<div class="more_info_on_empt_proj">Tap plus to add entries</div></h1> <div class="big_icon_glyph_lik_text glyphicon glyphicon-info-sign"></div></div><div class="clear_both"></div></div>');
	}
	app.getWhenNotFoundData = function(){
		$('#main').html('<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"><div class="right_info_big_project"><h1 class="project_do_not_have_empt">Project is not found<div class="more_info_on_empt_proj">Oh well...</div></h1> <div class="big_icon_glyph_lik_text glyphicon glyphicon-info-sign"></div></div><div class="clear_both"></div></div>');
	}
	app.getWhenPrivateData = function(){
		$('#main').html('<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"><div class="right_info_big_project"><h1 class="project_do_not_have_empt">Project is private<div class="more_info_on_empt_proj">Maybe contact creator?</div></h1> <div class="big_icon_glyph_lik_text glyphicon glyphicon-info-sign"></div></div><div class="clear_both"></div></div>');
	}
	app.getWhenPeopleNotFound = function(){
		$('#main').html('<div class="background_color_general padding15 text_when_empty" id="imgWhenEmpty"><div class="right_info_big_project"><h1 class="project_do_not_have_empt">Person not found<div class="more_info_on_empt_proj">Maybe person is now in the park..</div></h1> <div class="big_icon_glyph_lik_text glyphicon glyphicon-info-sign"></div></div><div class="clear_both"></div></div>');
	}
	app.getLoadingIt = function(){
		//setTimeout(function(){ 
		$('#main').html('<div class="loading_main_big" style=" "><div id="loading_spin"></div></div>');
		new window.Spinner({radius: 30, length: 20, width: 10, color: '#6b47e9', trail: 40}).spin(document.getElementById('loading_spin'));
		//}, 1000);
		
	}
	app.showAddButtonGlobal = function(){
		$(".header .pull-right .glyphicon-plus").parent().show();
	}
	app.hideAddButtonGlobal = function(){
		if(location.href.indexOf("project/") > -1 || location.href.indexOf("projectsinlist/") > -1){
			$(".header .pull-right .glyphicon-plus").parent().hide();
		}
	}
	app.renderHeadersData = function(thisProj){
		if(typeof thisProj !== "undefined" && typeof thisProj.get("name") !== "undefined"){
			$("title").text(thisProj.get("text").replace(/<[^>]*>/g, "").substring(0, 30));
			$('meta[name="description"]').attr("content", thisProj.get("name").replace(/<[^>]*>/g, "").substring(0, 30));
			$('meta[name="author"]').attr("content", thisProj.get("email"));
		}
	}
	app.resetHeaderData = function(){
		$("body").scrollTop( 0 );
		if(config.addBottomHtml !== ""){
			$("#allTheBottom").show();
			$("#allTheBottom").html(config.addBottomHtml);
		}
		$("title").text(config.titleText);
		$('meta[name="description"]').attr("content", config.desc);
	}
	app.noRecordsInIt = function(){
		return "<div>"+app.translate('No records yet')+"</div>";
	}
	var read_cookies_info_set_read_it = new Backbone.Model();
	var read_cookies_info = new Backbone.Model();
	read_cookies_info_set_read_it.url = templates.urlAddr+'/setUserReadCookies';
	read_cookies_info.url = templates.urlAddr+'/check_if_cookie_read';
	read_cookies_info.fetch().done(function(){ if(!read_cookies_info.get("success")){ 
		$(".text_cookies").show();
		$(".cookies_button").click(function(){
			$(".text_cookies").hide();
			read_cookies_info_set_read_it.fetch();
		});
	} });
	
	var formsColOfCa = new Backbone.Model();
	var formsColOfCaSubmitted = new Backbone.Model();
	formsColOfCaSubmitted.url = templates.urlAddr+'/commentsU/formsManagementSubmitted/'+0+'/true';
	formsColOfCa.url = templates.urlAddr+'/commentsU/formsManagement/'+0+'/true';
	formsColOfCaSubmitted.fetch().done(function(){ app.setMenuNumbers(); });
	formsColOfCa.fetch().done(function(){ app.setMenuNumbers(); });
	
	app.setMenuNumbers = function(){
			var getNumbOff = app.getNumberCart();
			var getNumbOffOrdered = app.getNumberOrdered();
			var allArray = [
				{title: '<div class="glyphicon glyphicon-menu-hamburger fontsize23"></div><div></div>Menu', name: '', active: false, actionEx:'openMenu'}
			];
			if(getNumbOff > 0){
				//allArray.push({title: '<div class="glyphicon glyphicon-shopping-cart icon-in-menu icon-turn-off" aria-hidden="true"></div><div style="display:inline-block;" id="my_open_cart">'+getNumbOff+'</div>', name: '', active: false, actionEx:'openCart'});
			}
			if(getNumbOffOrdered > 0){
				//allArray.push({title: '<div class="glyphicon glyphicon-ok icon-in-menu icon-turn-off" aria-hidden="true"></div><div style="display:inline-block;" id="my_open_cartOrdered">'+getNumbOffOrdered+'</div>', name: '', active: false, actionEx:'openOrdered'});
			}
			 leftMenu = new Nav(allArray);
	}
	
	app.getNumberCart = function(){
		var numbOf = 0;
		var messagesAll = app.getAllFormsModel().get("messages");
		if(typeof messagesAll !== "undefined" && messagesAll !== ""){
			for(var ii=0; ii < messagesAll.length; ii++){
				if(messagesAll[ii].files === ""){
					numbOf++;
				}
			}
		}
		return numbOf;
	}
	app.getNumberOrdered = function(){
		var numbOf = 0;
		var messagesAll = app.getAllFormsModelOrdered().get("messages");
		if(typeof messagesAll !== "undefined" && messagesAll !== ""){
			for(var ii=0; ii < messagesAll.length; ii++){
					numbOf++;
			}
		}
		return numbOf;
	}
	app.getAllFormsModelOrdered = function(){
		return formsColOfCaSubmitted;
	};
	app.getAllFormsModel = function(){
		return formsColOfCa;
	};
	app.addToAllFormsCollection = function(message, usernam){
		//{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'"}
		var ffmAdd = new Backbone.Model();
				ffmAdd.set('message',message);
				ffmAdd.set('id',"formsManagement"+usernam);//app.getAllFormsModel().get("_id"));//id
                ffmAdd.url = templates.urlAddr+'/commentAddByUser';
				ffmAdd.save(null, { type: 'POST' });
	};
	
	app.addToAllFormsCollectionSubmitted = function(message, usernam){
		//{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'"}
		var ffmAdd = new Backbone.Model();
				ffmAdd.set('message',message);
				ffmAdd.set('id',"formsManagementSubmitted"+usernam);//app.getAllFormsModel().get("_id"));//id
                ffmAdd.url = templates.urlAddr+'/commentAddByUser';
				ffmAdd.save(null, { type: 'POST' });
	};	
	app.addToAllFormsCollectionSubmittedRemoveByGuid = function(guid, fromwhere){
		//{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'"}
		var idofthewhat = fromwhere;
		var ffmAdd = new Backbone.Model();
				ffmAdd.set('rFrom',guid);
				ffmAdd.set('id',idofthewhat);
                ffmAdd.url = templates.urlAddr+'/commentAddByUser';
				ffmAdd.save(null, { type: 'POST' });
	};
	
	app.updateUserAddress = function(address){
		//{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'"}
		var ffmAdd = new Backbone.Model();
				//ffmAdd.set('email',app.userData.email);
				ffmAdd.set('address',address);
				ffmAdd.set('id',"idas");//app.getAllFormsModel().get("_id"));//id
                ffmAdd.url = templates.urlAddr+'/updateuser';
				ffmAdd.save(null, { type: 'PUT' });
	};
	app.updateUserInfo = function(data){
		var ffmAdd = new Backbone.Model();
		ffmAdd.set('additional_data',data);
		ffmAdd.url = templates.urlAddr+'/updateuser';
		ffmAdd.save(null, { type: 'PUT' });
	};
	
	app.updateAllFormsCollectionSubmitted = function(commentsCol, guid, newstatus){
		var messagesAll = commentsCol.get("messages");
		var mssgnew = "";
		var emailBuyer = ""
		for(var ii=0; ii < messagesAll.length; ii++){
			var parsemsg = JSON.parse(messagesAll[ii].message);
			if(messagesAll[ii].from === guid){
				emailBuyer = parsemsg[0].email_buyer;
				mssgnew = messagesAll[ii];
			}
		}
		if(mssgnew !== ""){
			mssgnew.files = newstatus;
			mssgnew.date = app.getTimeNow();
			var mssgtwo = mssgnew;
			mssgtwo.date = app.getTimeNow("add");
			app.addToAllFormsCollectionSubmitted(mssgnew, app.userData.email);
			app.addToAllFormsCollection(mssgtwo, emailBuyer);
		}
	}
	app.removeToAllFormsCollection = function(date){
		//{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'"}
		var ffmAdd = new Backbone.Model();
				ffmAdd.set('date',date);
				ffmAdd.set('id',app.getAllFormsModel().get("_id"));//id
                ffmAdd.url = templates.urlAddr+'/comment';
				ffmAdd.save(null, { type: 'POST' });
	};
	app.removeToAllFormsCollectionOrdered = function(date){
		//{"from":"'+ message.from+'","message":"'+ encodeURIComponent(message.message)+'","date":"'+message.date+'","files":"'+message.files+'"}
		var ffmAdd = new Backbone.Model();
				ffmAdd.set('date',date);
				ffmAdd.set('id',app.getAllFormsModelOrdered().get("_id"));//id
                ffmAdd.url = templates.urlAddr+'/comment';
				ffmAdd.save(null, { type: 'POST' });
	};
	var innerIconsColor = '#FFFFFF';
	var outerIconsColor = '#464f58';
	var textbackgroundcolor = '#FFFFFF';
	app.getDefaultInnerIconsColor = function(){
		return innerIconsColor;
	}
	app.getDefaultouterIconsColor = function(){
		return outerIconsColor;
	}
	app.getDefaulttextbackgroundcolor = function(){
		return textbackgroundcolor;
	}
	var commentsCol = new Backbone.Model();
	commentsCol.set('color','#ffffff');
	commentsCol.url = templates.urlAddr+'/commentsU/projectsManagement/'+0+'/true';
				commentsCol.set('urls','');
				commentsCol.set('defaultEntryViewWhenAdded','all');
				commentsCol.set('default_show_information_tips','yes');
				commentsCol.set('info_about','');
				commentsCol.set('make_old_when',10);
				commentsCol.set('backgroundPicture','');
				commentsCol.set('borderRadius','0');
				commentsCol.set('textbackgroundcolor',textbackgroundcolor);
				commentsCol.set('listsColor','#ffffff');
				commentsCol.set('entryColor','#ffffff');
				commentsCol.set('innerIconsColor',innerIconsColor);
				commentsCol.set('outerIconsColor',outerIconsColor);
				commentsCol.set('defaultViewOfSite','board_view_show');
				commentsCol.set('use_defined_style','');
				commentsCol.set('backgroundPictureAccount','');
				commentsCol.set('defaultVisibilityAdded','editcommentfriends');
				
		app.getSettingInWhole = function(value){
			return app.getSetting(app.getSettingsCol(), value);
		}
		app.getSetting = function(model, value){
			var arrays = model.get('messages');
			var confValue = '';
			if(typeof arrays !== "undefined"){
				for(var i=0; i < arrays.length; i++){
					if(arrays[i].from === value){
						confValue = arrays[i].message;
					}
				}
			}
			if(confValue === ""){
				return model.get(value);
			}
			return confValue;
		}
		app.setSettingsCol = function(people){
			commentsCol.url = templates.urlAddr+'/comments/projectsManagement'+people+'/'+0;
		};
		app.setDefaultSettingsCol = function(people){
			commentsCol.url = templates.urlAddr+'/commentsU/projectsManagement/'+0+'/true';
		};
		app.getSettingsCol = function(){
			return commentsCol;
		};
		app.getDefaultRoots = function(){
			var navLinks = '<a href="#home">'+app.translate('Home')+'</a>'; // (';
			//navLinks += '<a href="#projectsinlist/friends/friends">'+app.translate('Shared')+'</a>)';
		return navLinks;
		};
		
		app.isSettingsApplied = false;
		app.whenSettingsLoaded = function(){
			
			$('#valueSearch').attr('placeholder', app.translate('Search'));
			if(!app.isSettingsApplied){
				app.vent.trigger('refresh:footermenu');
				app.isSettingsApplied = true;
			}
			$(".meniu_of_whole").html("");
			
				var urls = app.getSetting(commentsCol, 'urls');
				if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
					if(urls !== ""){
						var splitUrl = urls.split(";");
						var meniu_of_whole = '<button class="btn btn-default dropdown-toggle viewButtonsIn" type="button" id="dropdownMenu44" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><div class="glyphicon glyphicon-menu-hamburger fontsize23"></div><div></div> <span id="selectedViewInGeneralViews">Meniu</span><span class="caret"></span>  </button>';
						 meniu_of_whole += '<ul class="dropdown-menu" aria-labelledby="dropdownMenu44">';
						 meniu_of_whole += "<li><a href='/#home'>"+app.translate('Home')+"</a></li>";
						 meniu_of_whole += "<li><a href='/#page/login'>"+app.translate('Login')+"</a></li>";
						 meniu_of_whole += "<li><a href='/#page/register'>"+app.translate('Register')+"</a></li>";
						for(var ii=0; ii < splitUrl.length; ii++){
							var splittedUrl = splitUrl[ii].split(",");
							if(splittedUrl.length > 1){
								var linkOfUrl = splittedUrl[0];
								var nameOfUrl = splittedUrl[1];
								var selectedOff = "class='meniuinheadertop'";
								if(linkOfUrl.indexOf("home") > -1 && (location.href.indexOf("#page/first") > -1 || location.href.indexOf("#home") > -1)){
									selectedOff = "class='meniuinheadertop selectedUrlHref'";
								}
								if(location.href.indexOf(linkOfUrl) > -1){
									selectedOff = "class='meniuinheadertop selectedUrlHref'";
								}
								var alink = "<li><a "+selectedOff+" href='"+linkOfUrl+"'>"+nameOfUrl+"</a></li>";
								meniu_of_whole += alink;
							}
						}
						meniu_of_whole += "</ul>";
						$(".meniu_of_whole").html(meniu_of_whole);
					}else{
						var selectedOff = "";
						var selectedOffReg = "";
						var selectedOffLog = "";
						if((location.href.indexOf("#page/first") > -1 || location.href.indexOf("#home") > -1)){
							selectedOff = "class='meniuinheadertop selectedUrlHref'";
						}
						if(location.href.indexOf("#page/register") > -1){
							selectedOffReg = "class='meniuinheadertop selectedUrlHref'";
						}
						if(location.href.indexOf("#page/login") > -1){
							selectedOffLog = "class='meniuinheadertop selectedUrlHref'";
						}
								
						var meniu_of_whole = '<button class="dropdown-toggle defaultLinkOf backgroundOrange padding10 width80" type="button" id="dropdownMenu44" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><div class="glyphicon glyphicon-menu-hamburger fontsize23"></div><div></div> <span id="selectedViewInGeneralViews">Meniu</span><span class="caret"></span>  </button>';
						 meniu_of_whole += '<ul class="dropdown-menu" aria-labelledby="dropdownMenu44">';
						 meniu_of_whole += "<li><a href='/#home'>"+app.translate('Home')+"</a></li>";
						 meniu_of_whole += "<li><a href='/#page/login'>"+app.translate('Login')+"</a></li>";
						 meniu_of_whole += "<li><a href='/#page/register'>"+app.translate('Register')+"</a></li>";
						meniu_of_whole += "</ul>";
						$(".meniu_of_whole").html(meniu_of_whole);
					}
                }

				var use_defined_style = app.getSetting(commentsCol, 'use_defined_style');
				var color = app.getSetting(commentsCol, 'color');
				var websiteStyle = app.getSetting(commentsCol, 'websiteStyle');
				var textbackgroundcolor = app.getSetting(commentsCol, 'textbackgroundcolor');
				var backgroundPicture = app.getSetting(commentsCol, 'backgroundPicture');
				var borderRadius = app.getSetting(commentsCol, 'borderRadius');
				var listsColor = app.getSetting(commentsCol, 'listsColor');
				var outerIconsColor = app.getSetting(commentsCol, 'outerIconsColor');
				var innerIconsColor = app.getSetting(commentsCol, 'innerIconsColor');
				
				//if(websiteStyle === 'Default'){
				//	$('link[id="looking_style"]').attr('href','/stylesheets/projects/wide.css');
				//}
				if(borderRadius != '' && use_defined_style != ''){
					borderRadius = 0;
					var styleHtml = "";
					if(backgroundPicture != ""){
						styleHtml = 'html{ background-color:'+outerIconsColor+'!important; background-image: url('+config.filesurl+'/files/project_managing_files/ProjectManagementFiles/'+backgroundPicture+'); }';
					}
					styleHtml += ' .dropdown-menu>li>a:hover, .dropdown-menu>li>a, .login-screen,.chatWindowView,.innerIconsColorBackground, .users_settings_info, .all_users_info_in_front_page, .left_side_of_modal,.right_side_of_modal{ background:'+outerIconsColor+'!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.list_view_all_projects_default, .containerOfNewAdd, .list_all_view_of_project .project_one, #suggestions, .projects_one_in_header, .projects_one_in_header li, #calendar{ box-shadow: none!important; background: '+outerIconsColor+'!important; border: none!important; }';
					styleHtml += '.innerIconsColorBackground,.dropdown-menu{ background-color:'+outerIconsColor+'!important; }';
					styleHtml += '.innerIconsColorColor{ color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.outerIconsColorBackground, .modal-dialog .modal-content{ background-color:'+outerIconsColor+'!important; }';
					styleHtml += '.outerIconsColorColor, .modal-dialog .modal-content .modal-title, .modal-dialog .modal-body{ color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.daySeparator .dayy{ border-radius:5px!important; }';
					styleHtml += '.innerIconsColorBackground{ background-color:'+outerIconsColor+'!important; }';
					styleHtml += '.innerIconsColorColor, .menutoppositioning a, textarea:hover{ color:'+textbackgroundcolor+'!important; }';
					
					styleHtml += '.projects_one_in_header{ border:none; }';
					styleHtml += '#suggestions{ right: 39px; }';
					styleHtml += '.menutoppositioning a, .menutoppositioning button, .menutoppositioning #menitem{ background:none!important; outline:none!important; border-bottom:2px solid '+textbackgroundcolor+'!important; }';
					styleHtml += '.menutoppositioning #menitem{     top: 4px!important; }';
					styleHtml += '.menutoppositioning a:hover, .menutoppositioning button:hover, .menutoppositioning #menitem:hover{ outline:none!important; border-bottom:2px solid '+innerIconsColor+'!important; }';
					styleHtml += '#suggestions .searchOne{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; }';
					styleHtml += '#suggestions .searchOne:hover{ background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; }';
					styleHtml += '.project_one button, .commentInModal button, .commentInModal a{ outline:none!important; border-radius:0px!important; box-shadow:none!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.project_one button:hover, .projects_one_in_header a:hover, .commentInModal button:hover, .commentInModal a:hover{ outline:none!important; border-radius:0px!important; box-shadow:none!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.selectedUrlHref{ outline:none!important; border-radius:0px!important; border-bottom:1px solid '+innerIconsColor+'!important; box-shadow:none!important; outline:none!important; background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.modalTextareaMine, .modalTextareaMine:hover, select, input, textarea{ outline:none!important; border-radius:0px!important; border-bottom:1px solid '+innerIconsColor+'!important; box-shadow:none!important; outline:none!important; background:'+outerIconsColor+'!important; }';
					styleHtml += '.modal-body .containerTopButtonsOfModal a:hover, .modal-body .containerTopButtonsOfModal a, .modalTextareaMine, .modalTextareaMine:hover, .personOnDialogOnRight .firstlastnameTop, select, input, textarea,select:hover, input:hover, textarea:hover, .modal-body .containerTopButtonsOfModal button, .modal-body .containerTopButtonsOfModal button:hover, .topbuttondialog, .topbuttondialog:hover{ font-weight: 500!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.selectedUrlHref:hover{ border-bottom:1px solid '+innerIconsColor+'!important; outline:none!important; box-shadow:none!important; outline:none!important; background:'+outerIconsColor+'!important; color:'+innerIconsColor+'!important; }';
					styleHtml += '.general_button{ background:'+outerIconsColor+'!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.right_model_menu, .right_model_menu:hover, #mainlogofallpages, .dayy, .searchOneTypeOf, .searchOneTypeOf:hover, .searchAboutComplete,.searchAboutComplete:hover, .searchOne:hover,.friends_data_in_acc a, .searchOnePerson:hover{ background:'+outerIconsColor+'!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.commentInModal{ background:'+outerIconsColor+'!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.buttonChange{ background:'+outerIconsColor+'!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.confirmModalButton{ background:none!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.background_default{ background:'+outerIconsColor+'!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.tableOfPrice tr:hover{ background:'+outerIconsColor+'; }';
					styleHtml += '.selectedRowOfFormsDataTable{ background:'+outerIconsColor+'; }';
					styleHtml += '.standart_show_forms_background, .searchContainer{ background:'+outerIconsColor+'; }';
					styleHtml += '.statistical_view_grid{ color:'+textbackgroundcolor+'; }';
					styleHtml += '.generalbutton{ color:'+textbackgroundcolor+'; background:'+outerIconsColor+'; border:1px solid '+innerIconsColor+'!important; }';
					styleHtml += '.generalbutton:hover{ background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; border:1px solid '+innerIconsColor+'!important; }';
					styleHtml += '.meniu_of_whole a{ color:'+textbackgroundcolor+'!important; background:'+outerIconsColor+'!important; border:1px solid '+innerIconsColor+'!important; }';
					styleHtml += '.meniu_of_whole a, .meniu_of_whole button{ background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; border-bottom:2px solid '+innerIconsColor+'!important; }';
					styleHtml += '.meniu_of_whole a:hover, .meniu_of_whole button:hover{ background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; border-bottom:2px solid '+innerIconsColor+'!important; }';
					
					styleHtml += '.nav>li{ color:'+textbackgroundcolor+'!important;  }';
					styleHtml += '.project_one .project_one_buttons{     border-top: 1px solid '+innerIconsColor+'!important;  }';
					styleHtml += '.miniChatmessagesNewUsers{ border-radius: '+parseInt(borderRadius)+'px; color:'+textbackgroundcolor+'; background-color:'+innerIconsColor+'; }';
					styleHtml += '.catalogViewAll .project_text_back_main{ color:'+textbackgroundcolor+'!important; background:'+outerIconsColor+'!important; }';
					styleHtml += '.project_text_back_main, .users_user_glyph_on_top_front_page, .project_one, .whitebackground, .containerOfNewAdd textarea{ background: '+outerIconsColor+'!important; color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.showMoreInfoOnPost button, .showMoreInfoOnPost button:hover{ background:none!important; color:'+textbackgroundcolor+'!important; box-shadow: none!important; border:none!important; }';
					styleHtml += '.articles_only_view .show_only_for_article, .project_one{ color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.catalogViewAll .project_one_buttons { background: none!important; color:'+textbackgroundcolor+'!important; }';

					styleHtml += '.headercoloradded{ box-shadow: 0px 2px 4px '+textbackgroundcolor+'!important; background: '+outerIconsColor+'!important; border: none!important; }';
					styleHtml += '.meniu_of_whole .glyphicon, .meniu_of_whole button, .big_icon_glyph_lik_text, .menutoppositioning #menitem{  color: '+textbackgroundcolor+'!important; }';
					styleHtml += '.projects_one_in_header, .projects_one_in_header a,.menutoppositioning .glyphicon, .projects_one_in_header .glyphicon, .project_one .glyphicon, .project_one .glyphicon:hover{  color: '+innerIconsColor+'!important; }';
					
					styleHtml += '.header_top_logo_about{ color:'+textbackgroundcolor+'!important; border-bottom: 2px solid '+innerIconsColor+'!important; }';
					styleHtml += '.header_top_logo_about{ color:'+textbackgroundcolor+'!important; border-bottom: 2px solid '+innerIconsColor+'!important; }';
					styleHtml += '.project_entry_one .glyphicon .project_entry_one .glyphicon:hover{ color:'+textbackgroundcolor+'!important; border: none!important; }';
					styleHtml += '.glyph_plus_with_text, .create_project label{ color:'+textbackgroundcolor+'!important; }';
					styleHtml += '#loading_spin .spinner div{ background:'+textbackgroundcolor+'!important; }';
					styleHtml += '.nav>li a{ color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.nav>li button{ color:'+textbackgroundcolor+'!important; }';
					styleHtml += '#left-menu .nav>li{ border-radius: '+parseInt(borderRadius)+'px;'+' }';
					styleHtml += '.userChoose{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.sendButton{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.textareaforuser{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.message_text_left{ background-color:'+innerIconsColor+';  }';
					styleHtml += '.myMessageInChat .message_text_left{ background-color:'+innerIconsColor+'; }';
					styleHtml += '#valueSearch{ border:1px solid '+innerIconsColor+'!important; border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.search_textarea{ border-radius: '+parseInt(borderRadius)+'px!important;'+' }';
					styleHtml += '.fc-event { color:'+textbackgroundcolor+';background:'+outerIconsColor+'!important; border:1px solid '+innerIconsColor+'!important; outline:none; }';
					styleHtml += '.fc-button { color:'+textbackgroundcolor+';background:'+outerIconsColor+'!important; }';
					styleHtml += '.fc-state-active { background:'+outerIconsColor+'!important;color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.viewButtonsIn, .visibility_perm_desc { background:'+outerIconsColor+'!important;color:'+innerIconsColor+'!important; }';
					styleHtml += '.visibility_perm_descSelected { color:'+textbackgroundcolor+'!important; background:'+outerIconsColor+'!important; }';
					styleHtml += '.viewButtonsInSelected, .viewButtonsIn:hover, .visibility_perm_desc:hover { color:'+innerIconsColor+'!important; background:'+outerIconsColor+'!important; }';
					//if(websiteStyle !== 'Default'){
					//	styleHtml += '.footer, .header { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border:none; }';
					//	styleHtml += '#left-menu .nav>li { border-bottom:1px solid '+innerIconsColor+'!important; }';
					//	styleHtml += '#left-menu { background:'+outerIconsColor+'!important;  color:'+innerIconsColor+'!important; border-right:1px solid '+innerIconsColor+'!important; }';
					//}
					styleHtml += '#friendsView { background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; border:none; }';
					styleHtml += '#showNotifications {  color:'+textbackgroundcolor+'!important; border:none; }';
					styleHtml += '.userChoose, .miniChatButtons, #left-menu .nav>li>button, #left-menu .nav li a { background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; border:none; }';
					styleHtml += '.userChoose:hover, .miniChatButtons:hover, #left-menu .nav>li>button:hover, #left-menu .nav li a:hover { background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; border:none; }';
					styleHtml += '#showNotifications:hover {  color:'+textbackgroundcolor+'!important; border:none; }';
					styleHtml += '.userChoose:last-child { border:none!important; }';

					styleHtml += '.fc-state-hover, .fc-state-active, .fc-button:hover { background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.viewButtonsIn:hover, .projectsSelected { background:'+outerIconsColor+'!important;  color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.viewButtonsIn { border:1px solid '+innerIconsColor+'!important;  }';
					styleHtml += '.nav>li:hover, .nav>li.active, .glyph_plus_with_text:hover {  color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.nav>li.active a { color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.nav>li:hover a { color:'+textbackgroundcolor+'!important; }';
					styleHtml += '.nav>li:hover button { color:'+textbackgroundcolor+'!important; }';
					styleHtml += '#navigation_main a {   color:'+textbackgroundcolor+'!important; }';
					styleHtml += '#navigation_main a:hover {  color:'+textbackgroundcolor+'!important; }';
				
				$('#manual_style').html(styleHtml);
				}else{
					var styleHtml = "";
					if(backgroundPicture != ""){
						styleHtml = 'html{ background-image: url('+config.filesurl+'/files/project_managing_files/ProjectManagementFiles/'+backgroundPicture+'); }';
					}
					$('#manual_style').html(styleHtml);
				}
			}.bind(this)
		
		
		/*app.vent.on('render:manual:view', function(){
			commentsCol.fetch().done(app.whenSettingsLoaded).error(function(){
				app.userIsNotLoggedIn = true;
				app.translate = function(name){ return 'app'+name;};
				app.vent.trigger('refresh:footermenu');
			});
		});*/
	
	
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

    var menu = new MenuView({collection: app.pages,className:'nav nav-pills'});
    var leftMenu = new Nav([
        {title: '<div class="glyphicon glyphicon-menu-hamburger icon-in-menu icon-turn-off" aria-hidden="true"></div><div></div>Menu', name: '', active: false, actionEx:'openMenu'}
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
         menu = new MenuView({collection: app.pages,className:'nav nav-pills'});
         app.footernavcenter.show(menu);
		 //app.vent.trigger('menu:add', '<div class="glyphicon glyphicon-blackboard icon-in-menu icon-turn-off" aria-hidden="true"></div><div>'+app.translate('Shared')+'</div>', 'projectsinlist/friends/friends', sharedActive);
    });
    app.on("initialize:after", function(options){
        if (Backbone.history){
            Backbone.history.start();
        }
    });
    app.socketService.on('commentSend', function (obj) {
		app.reloadUserDataGo(false);
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
				msgs.push(obj);
				if(typeof app.CurrentCommentsView != 'undefined'){
					app.CurrentCommentsView.rerenderComments();
				}
			}
		}
    });
    app.socketService.on('updateProjectsModel', function (obj) {
		app.reloadUserDataGo(false);
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
	app.setVisibilityForResource = function(resource){
											if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
												resource.set('parentvisibility', 'editcommentpublic');
											}else{
												if(typeof app.userData != "undefined"  && typeof resource != "undefined" && typeof resource.get != "undefined" && resource.get("email") == app.userData.email){
													resource.set('parentvisibility', "editpublic");
												}else{
													resource.set('parentvisibility', resource.get("visibility"));
												}
											}
	}
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
		app.setVisibilityForResource(resource);
		for(var i=0; i < cachedCollectionResources.length; i++){
			var idOfThis = cachedCollectionResources[i].idd;
			if (idOfThis == "_") {
				idOfThis = "";
			}
			if (typeof resource != "undefined" && typeof resource.get("inProjects") != "undefined" && resource.get("inProjects") == idOfThis) {
				cachedCollectionResources[i].add(resource);
			}
		}
		//cachedCollectionResources.trigger('change');
		//resource.trigger('change');
    });
    app.vent.on('add:cachedCollection:resource', function (resource) {
		app.setVisibilityForResource(resource);
        cachedCollectionResources.push(resource);
    });
    app.vent.on('update:cachedCollection:resource', function (resource, id) {
			var inprrr = resource.get('inProjects');
		/*if(typeof window.treeprojects != "undefined" && typeof window.treeprojects['.treeInShowHere'+inprrr] != "undefined"){
			var treeIn_show = window.treeprojects['.treeInShowHere'+inprrr].collection;
			var tree_not_updated_on = true;
			//for(var i=0; i < treeIn_show.length; i++){
				for(var j=0; j < treeIn_show.models.length; j++){
					if(resource.get('_id') == treeIn_show.models[j].get('_id')){
						 var canChageItttt = true;
						if(typeof treeIn_show.idd != 'undefined' && (treeIn_show.idd == 'friends' || (treeIn_show.idd == '_' && app.userData.email !== resource.get('email')))){
							if(typeof app.userData != 'undefined'){
								canChageItttt = false;
							}
						}
						if(canChageItttt){
							treeIn_show.models[j].attributes = resource.attributes;
							tree_not_updated_on = false;
						}
					}
				}
			//}
			if(tree_not_updated_on){
										if(typeof treeIn_show.get(resource) == "undefined"  && typeof treeIn_show.get(resource.attributes._id) == "undefined"){
											//treeIn_show.add(resource);
										}
			}
		}*/
		
        var not_updated = true;
        for(var i=0; i < cachedCollectionResources.length; i++){
            for(var j=0; j < cachedCollectionResources[i].models.length; j++){
                if(resource.get('_id') == cachedCollectionResources[i].models[j].get('_id')){
					var letUpdate = true;
					if(typeof cachedCollectionResources[i].idd != 'undefined' && (cachedCollectionResources[i].idd == 'friends' || (cachedCollectionResources[i].idd == '_' &&
  typeof resource != "undefined" && typeof resource.get != "undefined" &&
					app.userData.email !== resource.get('email')))){
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
						//$('#text_id'+cachedCollectionResources[i].models[j].get('_id')).html(cachedCollectionResources[i].models[j].get('text'));
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
					app.setVisibilityForResource(resource);
					if(cachedCollectionResources[i].get(resource) == "undefined" && cachedCollectionResources[i].get(resource.attributes._id) == "undefined"){
						cachedCollectionResources[i].add(resource);
					}
                    var inHeaderr = resource.get('inHeader');
                    if(typeof inHeaderr !== 'undefined' && inHeaderr !== ''){
                        for(var j=0; j < cachedCollectionResources.length; j++){
                            if(typeof cachedCollectionResources[j].idd != 'undefined' && cachedCollectionResources[j].idd == inHeaderr){
								app.setVisibilityForResource(resource);
								if(cachedCollectionResources[j].get(resource) == "undefined"  && cachedCollectionResources[j].get(resource.attributes._id) == "undefined"){
									cachedCollectionResources[j].add(resource);
								}
                            }
                        }
                    }
                }
                if(typeof cachedCollectionResources[i].idd != 'undefined' && (cachedCollectionResources[i].idd == 'friends' || (cachedCollectionResources[i].idd == '_' && 
				typeof resource != "undefined" && typeof resource.get != "undefined" &&
				app.userData.email !== resource.get('email')))){
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
									app.setVisibilityForResource(resource);
									if(cachedCollectionResources[i].idd == '_'){
										cachedCollectionResources[i].addSharedModelOne(resource);
									}else{
										if(typeof cachedCollectionResources[i].get(resource) == "undefined"  &&  typeof cachedCollectionResources[i].get(resource.attributes._id) == "undefined"){
											cachedCollectionResources[i].add(resource);
										}
									}
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
					if(typeof cachedCollectionResources[i].remove === 'function'){
						cachedCollectionResources[i].remove(cachedCollectionResources[i].models[j]);
					}
				}
            }
        }
    });
	
	app.getCachedCollectionsRes = function (idd) {
		var collection = null;
		var defcollection = null;
		for(var i=0; i < cachedCollectionResources.length; i++){
			if(cachedCollectionResources[i].idd == idd){
				collection = cachedCollectionResources[i];
			}
			
			if(cachedCollectionResources[i].idd == '_'){
				defcollection = cachedCollectionResources[i];
			}
		}
		
		if (collection == null) {
			return defcollection;
		}else{
			return collection;
		}
	};
	app.reloadGoUpdate = function (triggerr) {
		let userConnectedf = new User();
        userConnectedf.urlRoot = templates.urlAddr+'/user/'+app.allUserDatag.username;
        userConnectedf.url = templates.urlAddr+'/user/'+app.allUserDatag.username;
		userConnectedf.fetch().success(function(data2){
					if(typeof data2 != 'undefined'){
						var dt2g = JSON.parse(data2);
						let classadd = "";
						if (dt2g.notifications > 0) {
							classadd = "notifmakered";
						}
						var userHtmlImgg = '<span style="display:none;" onclick="miniChatClickedNotif('+"'"+dt2g._id+"'"+')" class="friend_req_h '+classadd+'">'+dt2g.notifications+'</span>';
						$(".notificationstop").html(userHtmlImgg);
						$(".notifsgo").attr("onclick", "miniChatClickedNotif('"+dt2g._id+"')");
					}
					$(".friend_req_h").show();
				
				userConnected.data2 = JSON.parse(data2);
				app.userData = JSON.parse(data2);
				if (app.userData.pay == 0) {
					$(".mamoney").hide();
				}else{
					//$(".mamoney").text(app.userData.pay.toFixed(2)+"€/"+app.userData.moneyhas.toFixed(2)+"€");
				}
				if (triggerr) {
					app.vent.trigger('userConnected:ready');
					app.vent.trigger('data:triggered:userconnected');
				}
			}.bind(this));
	};
	app.reloadUserDataGo = function(triggerr) {
		if (!triggerr) {
			setTimeout(() => {
				app.reloadGoUpdate(triggerr);
			}, 2000);
			setTimeout(() => {
				app.reloadGoUpdate(triggerr);
			}, 4000);
		} else {
		userConnected.fetch().success(function(data2){
					if(typeof data2 != 'undefined'){
						var dt2g = JSON.parse(data2);
						let classadd = "";
						if (dt2g.notifications > 0) {
							classadd = "notifmakered";
						}
						var userHtmlImgg = '<span style="display:none;" onclick="miniChatClickedNotif('+"'"+dt2g._id+"'"+')" class="friend_req_h '+classadd+'">'+dt2g.notifications+'</span>';
						$(".notifsgo").attr("onclick", "miniChatClickedNotif('"+dt2g._id+"')");
						$(".notificationstop").html(userHtmlImgg);
					}
					$(".friend_req_h").show();
				
				userConnected.data2 = JSON.parse(data2);
				app.userData = JSON.parse(data2);
				if (app.userData.pay == 0) {
					$(".mamoney").hide();
				}else{
					//$(".mamoney").text(app.userData.pay.toFixed(2)+"€/"+app.userData.moneyhas.toFixed(2)+"€");
				}
				if (triggerr) {
					app.vent.trigger('userConnected:ready');
					app.vent.trigger('data:triggered:userconnected');
				}
			}.bind(this));
		}
	};
	
	
        logged.fetch().success(function(data){
			
			
			$('.header').show();
			$('.footer').show();
			$('#showNotifications').show();
			if(typeof userConnected.data2 == 'undefined'){
				startMiniChat(app.socketService,data.username);
			}
			var countinfo = new User();
			app.allUserDatag = data;
            userConnected.urlRoot = templates.urlAddr+'/user/'+data.username;
            userConnected.url = templates.urlAddr+'/user/'+data.username;
            countinfo.urlRoot = templates.urlAddr+'/countforfriends/'+data.username;
            countinfo.url = templates.urlAddr+'/countforfriends/'+data.username;			
			
			var userHtmlImg = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+data.username+'/'+data.username+'.jpg" alt="" /> <span class="mamoney"></span></div>';
			$(".hereProfilePhoto").html(userHtmlImg);
			$(".hereProfilePhoto").show();
			$(".meHerePro").hide();
			countinfo.fetch().success(function(datacount){
				var countinf = JSON.parse(datacount);
				if (typeof countinf != "undefined" && countinf != "" && countinf.length > 0) {
					app.countinfoaboutloggeduser = countinf[0];
				}
            }.bind(this));
            app.reloadUserDataGo(true);
			
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
        var menuleft = new MenuView({collection: leftMenu, className:'nav nav-pills'});
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
                //var js = app.userData;
				//if(typeof js.programs != "undefined"){
					
                menuNew = [];//[{title: '<div class="glyphicon glyphicon-chevron-right icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: 'right',actionEx:'rightClick', active: false}];
               // for(var i=0; i < js.programs.length; i++){
               //     menuNew.push({title:app.translate(js.programs[i].name), name:'link',link:'/files/'+js.programs[i]._id+'/index.html', active:false});
               // }
               /* menuNew.push({title: app.translate('Ordered'), name: '', active: false, actionEx:'openOrdered'});
                menuNew.push({title: app.translate('History'), name: '', active: false, actionEx:'openHistory'});
                menuNew.push({title: app.translate('Forms'), name: '', active: false, actionEx:'openForms'}); */
				
				var urls = app.getSetting(commentsCol, 'urls');
				if(urls !== ""){
					var splitUrl = urls.split(";");
					var selectedOff = "";
					for(var ii=0; ii < splitUrl.length; ii++){
						var splittedUrl = splitUrl[ii].split(",");
						if(splittedUrl.length > 1){
							var linkOfUrl = splittedUrl[0];
							var nameOfUrl = splittedUrl[1];
							var selectedOff = "class='meniuinheadertop'";
							if(linkOfUrl.indexOf("home") > -1 && (location.href.indexOf("#page/first") > -1 || location.href.indexOf("#home") > -1)){
								selectedOff = "class='meniuinheadertop selectedUrlHref'";
							}
							if(location.href.indexOf(linkOfUrl) > -1){
								selectedOff = "class='meniuinheadertop selectedUrlHref'";
							}
							menuNew.push({title: nameOfUrl, name: linkOfUrl, active: false, actionEx:''});
						}
					}
				}
				
                menuNew.push({title: app.translate('Home'), formobile: true, name: 'timeline', active: false, actionEx:'openTimeline'});
                menuNew.push({title: app.translate('Search'), formobile: true, name: 'speople/', active: false, actionEx:'openSearch'});
                menuNew.push({title: app.translate('Projects'), formobile: true, name: 'projects', active: false, actionEx:'openProjects'});
                menuNew.push({title: app.translate('Messaging'),formobile: true, name: '', active: false, actionEx:'openMessaging'});
                menuNew.push({title: app.translate('My Account'),formobile: true, name: 'account', active: false, actionEx:'openAccount'});
                menuNew.push({title: app.translate('Settings'), name: '', active: false, actionEx:'openSettings'});
                menuNew.push({title: app.translate('Logout'), name: 'logout', active: false});
                leftMenuHidden = new Nav(menuNew);
                var menuleft_inner = new MenuView({collection: leftMenuHidden, className:'nav nav-pills'});
                this.listenTo(menuleft, 'menuitem:click',function(view){
					if(view.model.get('actionEx') == "openOrdered"){
							Backbone.history.navigate('ordered',{ trigger: true });
					}
					if(view.model.get('actionEx') == "openCart"){
							Backbone.history.navigate('posted',{ trigger: true });
					}
					if(view.model.get('actionEx') == "openMenu"){
						if($('#left-menu').is(':visible')){
							$('body').removeClass("leftMenuOpened");
							$('#left-menu').css('display','none');
						}else{
							$('body').addClass("leftMenuOpened");
							$('#left-menu').css('display','block');
						}
					}
					
                    this.listenTo(menuleft_inner, 'menuitem:click',function(view){
						if(view.model.get('actionEx') == 'openOrdered'){
							Backbone.history.navigate('ordered',{ trigger: true });
						}
						if(view.model.get('actionEx') == 'openChat'){
							location.href = "/chat";
						}
						if(view.model.get('actionEx') == 'openForms'){
							Backbone.history.navigate('posted',{ trigger: true });
                        }
						if(view.model.get('actionEx') == 'openHistory'){
							Backbone.history.navigate('history',{ trigger: true });
                        }
						if(view.model.get('actionEx') == 'openSearch'){
							location.href = "/#speople/";
                        }
						if(view.model.get('actionEx') == 'openMessaging'){
							location.href = "/chat";
						}
						if(view.model.get('actionEx') == 'openTimeline'){
							Backbone.history.navigate('timeline',{ trigger: true });
						}
						if(view.model.get('actionEx') == 'openProjects'){
							Backbone.history.navigate('home',{ trigger: true });
						}
						if(view.model.get('actionEx') == 'openSettings'){
							Backbone.history.navigate('settings',{ trigger: true });
                        }
						if(view.model.get('actionEx') == 'openAccount'){
							Backbone.history.navigate('account',{ trigger: true });
                        }
                    });
                    app.leftmenu.show(menuleft_inner);
                });
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
                    model: new DialogModel(data),
					events: {
						'keyup .searchforfriends': data.searchforfriends,
						'click .loadmorehereindialog': data.loadmorehereindialog,
						'click .sendSharelink': data.sendSharelink,
                        'click .sendlinkButton': data.sendlinkButton,
					}
                }));
            });
    });
	
	app.showSimpleDialog = function(data, th) {
		app.commands.execute("app:dialog:simple", {
			onRenderView: function() {
				setTimeout(function(){
					$(".modal-dialog").show();
				},100);
			},
			message: data.message,
			title: data.title,
			icon: data.icon,
			moredata: data.moredata,
			sendlinkButton: function(e){
				th.sendlinkButton(e);
			},
			sendSharelink: function(e){
				th.sendSharelink(e);
			},
			loadmorehereindialog: function(e) {
				data.loadmorehereindialog(e);
			},
			searchforfriends: function(e) {
				data.searchforfriends(e);
			}
		});	
	};

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
                        'click #set_html_editor': data.set_html_editor,
                        'click #set_normal_editor': data.set_normal_editor,
                        'click #update_general_info': data.update_general_info,
                        'keyup .textarea_title': data.field_changed_data,
                        'keyup .description_textarea': data.field_changed_data,
                        'change .color_input_data': data.field_changed_data,
                        'change #view_main_on_project_showing': data.field_changed_data,
                        'keyup .who_is_working_input': data.field_changed_data,
                        'click #commentSubmitminiEditView': data.commentSubmitminiEditView,
                        //'click #add_task_reccurence_edit_view': data.addTaskRecc,
                        //'click #add_task_estimate_edit_view': data.addTaskEstim,
                        //'click #add_task_to_edit_view': data.addTaskTo,
                        //'click #save_task_edit_view': data.saveTasks,
                        //'click #add_task_edit_view': data.addTask,
                        'click .sendSharelink': data.sendSharelink,
                        'click .sendlinkButton': data.sendlinkButton,
                        'change #friendAddToEntry': data.friendAddToEntry,
                        'click .friends_remove_one': data.friends_remove_one,
                        'click .projectsUploadFileDialog': data.onprojectsUploadFile,
                        //'click .removeTaskOne': data.listenToRemoveTask,
                        'click .delete_files_one': data.delete_files_one,
                        'click .use_files_one': data.use_files_one,
                        'click .remove_use_files_one': data.remove_use_files_one,
                        'click #visible_to_all': data.visible_to_all,
                        'click #visible_to_all_edit': data.visible_to_all_edit,
                        'click #visible_to_none': data.visible_to_none,
                        'click #visible_to_none_edit': data.visible_to_none_edit,
                        'click #visible_to_all_comment': data.visible_to_all_comment,
                        'click #visible_to_none_comment_edit': data.visible_to_none_comment_edit,
                        'click #friends_comments_id': data.friends_comments_id,
                        'click #friends_publ_id': data.friends_publ_id,
                        'click #friends_edit_id': data.friends_edit_id,
                        'click .replyButtonHere': data.commentReplyItHere,
                        'click .commentAnswerIt': data.commentAnswerItHere,
                        'click .commentLikeIt': data.commentLikeItHere,
                        'click .removeComment': data.listenToRemoveComment,
                        'click .confirm_no': data.confirmNo
                    }
                }));
            });
    });

	return window.app = app;
});
