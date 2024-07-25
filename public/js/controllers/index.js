/* Caching at controllers level */

define([
	'app',
	'config',
	'../appmodules/projects/controllers/addController',
	'../appmodules/projects/controllers/projectsController',
	'../appmodules/projects/controllers/timelineController',
	'../appmodules/projects/controllers/entryController',
	'../appmodules/projects/controllers/listController',
	'../appmodules/logging/controllers/loginController',
	'../appmodules/projects/controllers/searchController',
	'../appmodules/projects/controllers/settingsController',
	'../appmodules/projects/controllers/accountController',
	'../appmodules/projects/controllers/profileController',
	'../appmodules/projects/controllers/formsController',
    'models/logging',
    '../appmodules/logging/models/logout',
    'views/EmptyView',
    'views/Footer',
    'collections/Nav',
	'backbone'
], function (app, config, addController, projectsController, timelineController, entryController, listController, loginController, 
searchController, settingsController, accountController, profileController, formsController, logging, logout, EmptyView, Footer, Nav, Backbone) {
	'use strict';
    /*var projectsCtrl = new projectsController();
    var projectsProjectCtrl = new projectsController({mainProjectCtrl:projectsCtrl});
    var entryCtrl = new entryController({mainProjectCtrl:projectsCtrl});
    var addCtrl = new addController({mainProjectCtrl:projectsCtrl});
    var listCtrl = new listController({mainProjectCtrl:projectsCtrl});
    var searchCtrl = new searchController();
    var settingsCtrl = new settingsController();
    var accountCtrl = new accountController();
    var formsCtrl = new formsController();*/
	return {
		getSettingsAll: function(func, people){
			app.resetHeaderData();
			var options = {};
			if((typeof people !== "undefined" && people !== "") || (typeof config.firstPage !== "undefined" && config.firstPage !== "" && config.for_every_logged_in)){
				var confofpeople = config.firstPage;
				if(typeof people !== "undefined" && people !== ""){
					confofpeople = people;
				}
				app.setSettingsCol(confofpeople);
				options.forceRefetch = true;
			}else{
				app.setDefaultSettingsCol();
			}
			app.getSettingsCol().fetch(options).done(function(){
				app.whenSettingsLoaded();
				var color = app.getSetting(app.getSettingsCol(), 'color');
				var listsColor = app.getSetting(app.getSettingsCol(), 'listsColor');
				var entryColor = app.getSetting(app.getSettingsCol(), 'entryColor');
				var websiteStyle = app.getSetting(app.getSettingsCol(), 'websiteStyle');
				var backgroundPicture = app.getSetting(app.getSettingsCol(), 'backgroundPicture');
				var backgroundPictureAccount = app.getSetting(app.getSettingsCol(), 'backgroundPictureAccount');
				var borderRadius = app.getSetting(app.getSettingsCol(), 'borderRadius');
				var defaultViewOfSite = app.getSetting(app.getSettingsCol(), 'defaultViewOfSite');

				func({backgroundPictureAccount:backgroundPictureAccount, defaultViewOfSite:defaultViewOfSite, entryColor:entryColor, listsColor:listsColor, color:color,websiteStyle:websiteStyle});
			}.bind(this)).error(function(){
				app.whenSettingsLoaded();
				func({defaultViewOfSite:"", entryColor:"", listsColor:"", color:"",websiteStyle:""});
			});
		},
		settings: function () {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
    var settingsCtrl = new settingsController();
				settingsCtrl.show({settings:settings});
			});
        },
		account: function () {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
    var accountCtrl = new accountController();
				accountCtrl.show({settings:settings});
			});
        },
        logout: function () {
            this.showPage('logout');
        },
		home: function () {
            this.showPage('home');
        },
		showPage: function (pageName) {
            //this.addToMenu('glyphicon-blackboard','Shared','projectsinlist/friends/friends');
            if(pageName == null) pageName = 'home';

			var pageModel = app.pages.findWhere({name: pageName});

            app.vent.trigger('menu:activate', pageModel);
            if(pageName == 'first') {
                this.cInitialize().done(function(data){
                    this.show_first_projects();
					
                }.bind(this)).fail(function(err){
					this.show_first_page();
                    /*app.vent.trigger('refresh:footermenu');*/
                }.bind(this));
            }
            if(pageName == 'register') {
                this.cInitialize().done(function(data){
                    this.show_first_projects();
                }.bind(this)).fail(function(err){
                    /*app.vent.trigger('refresh:footermenu');*/
                    var log = new loginController();
					log.registerTry();
                    log.on('success_logging',function(){
                        this.show_first_projects();
                    }.bind(this));
                }.bind(this));
			}
            if(pageName == 'login') {
                this.cInitialize().done(function(data){
                    this.show_first_projects();
                }.bind(this)).fail(function(err){
                    /*app.vent.trigger('refresh:footermenu');*/
                    var log = new loginController();
					log.loginGo();
                    log.on('success_logging',function(){
                        this.show_first_projects();
                    }.bind(this));
                }.bind(this));
            }
            if(pageName == 'remember') {
                this.cInitialize().done(function(data){
                    this.show_first_projects();
                }.bind(this)).fail(function(err){
                    /*app.vent.trigger('refresh:footermenu');*/
                    var log = new loginController();
					log.rememberPassword();
                    log.on('success_logging',function(){
                        this.show_first_projects();
                    }.bind(this));
                }.bind(this));
            }
            if(pageName == 'timeline') {
				this.show_timeline_projects();
			}
            if(pageName == 'home') {
                this.show_first_projects();
            }
            if(pageName == 'logout') {
                var logoutt = new logout({id:'logout'});
				if(typeof app.userData != "undefined" && typeof app.userData.is_google !== "undefined" && app.userData.is_google == "true"){
					signOut();
				}
                logoutt.destroy().always(function(){
                    /*$('#left-menu').css('display','none');
                    app.menuleft.show(new EmptyView());
                    app.footernavright.show(new EmptyView());
                    app.menu.show(new EmptyView());
                    app.footernavleft.show(new EmptyView());
                    app.leftmenu.show(new EmptyView());

                    Backbone.history.navigate('#page/first',{ trigger:true, replace: true });*/
					location.href = "";
                });
            }
            /*if(pageName == 'ex') {
                console.log('Example of on demand module loading..');
                require(['modules/Example'], function(Example) {
                    Example.start();
                });
            }*/
		},
        projects: function() {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
    var projectsCtrl = new projectsController();
				projectsCtrl.show({settings:settings});
			});
        },        
		timeline: function() {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				var timelineCtrl = new timelineController();
				timelineCtrl.show({settings:settings});
			});
        },
        projectsinlist: function(project, list, p="") {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				if(project === 'friends' && list === 'friends'){
					this.addToMenu('glyphicon-blackboard','Shared','projectsinlist/friends/friends');
				}else{
					this.addToMenu('glyphicon-th','List','projectsinlist/'+project+'/'+list);
				}
				var projectsCtrl = new projectsController();
				var listCtrl = new listController({mainProjectCtrl:projectsCtrl});
				var objdata = {id: project, listId:list, settings:settings};
				if (p != "") {
					this.addToMenu('glyphicon-user','People',''+p);
					objdata.people = p;
				}
				listCtrl.show(objdata);
			}.bind(this));
        },
        peopleabout: function(p) {
            this.loadingBefore();
				var peopleCol = new Backbone.Model();
				peopleCol.url = config.urlAddr+'/user/'+p;
			this.getSettingsAll(function(settings){
				peopleCol.fetch().done(function(data){
					if(typeof data !== "undefined" && data !== "null" && data != 400 && data != "400"){
						this.addToMenu('glyphicon-user','People',''+p);
						var parsedData = JSON.parse(data);
						peopleCol.attributes = parsedData;
						var profileCtrl = new profileController();
						profileCtrl.show({people: peopleCol, settings: settings});
					}else{
						app.getWhenPeopleNotFound();
					}
				}.bind(this));
			}.bind(this), p);
		},
        people: function(p) {
            this.loadingBefore();
				var peopleCol = new Backbone.Model();
				peopleCol.url = config.urlAddr+'/user/'+p;
			this.getSettingsAll(function(settings){
				//projectsCtrl.show({people: p,settings:settings});
				peopleCol.fetch().done(function(data){
					if(typeof data !== "undefined" && data !== "null" && data != 400 && data != "400"){
						this.addToMenu('glyphicon-user','People',''+p);
						var parsedData = JSON.parse(data);
						peopleCol.attributes = parsedData;
						var projectsCtrl = new projectsController();
						projectsCtrl.show({people: p, settings:settings, peopleCol: peopleCol});
					}else{
						app.getWhenPeopleNotFound();
					}
				}.bind(this));
			}.bind(this), p);
		},
        project: function(project, p="") {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				if (p == "") {
					this.addToMenu('glyphicon-th','Project','project/'+project);
					var projectsCtrl = new projectsController();
					var projectsProjectCtrl = new projectsController({mainProjectCtrl:projectsCtrl});

					projectsProjectCtrl.show({id: project,settings:settings});
				}else{
					var peopleCol = new Backbone.Model();
					peopleCol.url = config.urlAddr+'/user/'+p;
					//TODO: recheck if needed
					//peopleCol.fetch().done(function(data){
						//if(typeof data !== "undefined" && data !== "null"){
							this.addToMenu('glyphicon-user','People',''+p);
							//var parsedData = JSON.parse(data);
							//peopleCol.attributes = parsedData;
							var projectsCtrl = new projectsController();
							projectsCtrl.show({id: project, people: p, settings:settings}); //peopleCol: peopleCol
						//}else{
						//	app.getWhenPeopleNotFound();
						//}
					//}.bind(this));
				}
			}.bind(this));
        },
		search: function(search){
			this.loadingBefore();
			this.getSettingsAll(function(settings){
			var searchCtrl = new searchController();
				if (typeof search == "undefined") {
					search = "-";
				}
				searchCtrl.show({search:search,settings:settings});
			});
		},
		speople: function(search){
			this.loadingBefore();
			this.getSettingsAll(function(settings){
			var searchCtrl = new searchController();
				if (typeof search == "undefined") {
					search = "-";
				}
				searchCtrl.show({search:search,settings:settings, people: true});
			});
		},
        entry: function(entry, p=""){
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				if (p == "") {
					this.addToMenu('glyphicon-link','Entry','entry/'+entry);
					var projectsCtrl = new projectsController();
					var entryCtrl = new entryController({mainProjectCtrl:projectsCtrl});
					entryCtrl.show({id:entry,settings:settings});
				}else{
					this.addToMenu('glyphicon-link','Entry','entry/'+entry+"/"+p);
					var peopleCol = new Backbone.Model();
					peopleCol.url = config.urlAddr+'/user/'+p;
					//TODO: recheck is this needed
					//peopleCol.fetch().done(function(data){
					//	if(typeof data !== "undefined" && data !== "null"){
							this.addToMenu('glyphicon-user','People',''+p);
							//var parsedData = JSON.parse(data);
							//peopleCol.attributes = parsedData;
							
							var projectsCtrl = new projectsController();
							var entryCtrl = new entryController({mainProjectCtrl:projectsCtrl});
							entryCtrl.show({id:entry,settings:settings, people: p}); //peopleCol: peopleCol
					//	}else{
					//		app.getWhenPeopleNotFound();
					//	}
					//}.bind(this));
				}
			}.bind(this));
        },
        entry_pdf: function(entry, pdf_id){
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				this.addToMenu('glyphicon-link','Entry','entry/'+entry);
    var projectsCtrl = new projectsController();
    var entryCtrl = new entryController({mainProjectCtrl:projectsCtrl});
				entryCtrl.show({id:entry,settings:settings, user_file_pdf:pdf_id});
			}.bind(this));
        },
        addEntryList: function(project, list) {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				this.addToMenu('glyphicon-plus-sign','Add','addlist/'+project+'/'+list);
    var projectsCtrl = new projectsController();
    var addCtrl = new addController({mainProjectCtrl:projectsCtrl});
				addCtrl.show({id: project, isList:true, listId:list,settings:settings});
			}.bind(this));
        },
        addEntry: function(project) {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				this.addToMenu('glyphicon-plus-sign','Add','add/'+project);
    var projectsCtrl = new projectsController();
    var addCtrl = new addController({mainProjectCtrl:projectsCtrl});
				addCtrl.show({id: project,settings:settings});
			}.bind(this));
        },
		posted: function(){
           this.loadingBefore();
			this.getSettingsAll(function(settings){
				    var formsCtrl = new formsController();
				formsCtrl.show({settings:settings, which:"posted"});
			});
		},
		history_forms: function(){
           this.loadingBefore();
			this.getSettingsAll(function(settings){
				var formsCtrl = new formsController();
				formsCtrl.show({settings:settings, which:"history"});
			});
		},
		ordered_forms: function(){
           this.loadingBefore();
			this.getSettingsAll(function(settings){
				var formsCtrl = new formsController();
				formsCtrl.show({settings:settings, which:"ordered_items"});
			});
		},
        cInitialize: function(){
            var pageModel = app.pages.findWhere({name: 'home'});
            app.vent.trigger('menu:activate', pageModel);

            var logged = new logging();
            var promise = logged.fetch({forceRefetch:true})
            return promise;
        },
        addToMenu: function(icon,name,url){
                var iconshow = '<div class="glyphicon ';
                iconshow += icon;
                iconshow += ' icon-in-menu icon-turn-off" aria-hidden="true"></div><div>'+app.translate(name)+'</div>';
                app.vent.trigger('menu:add', iconshow, url, true);
        },
        loadingBefore: function(){
			$("#right_menu_for_data").hide();
			$("#right_menu_for_data").html("");
            app.getLoadingIt();
        },
		show_first_page: function(){
					if(typeof config.firstPage !== "undefined" && config.firstPage !== ""){
						this.people(config.firstPage);
					}else{
						var log = new loginController();
						log.on('success_logging',function(){
							this.projects();
						}.bind(this));
					}
		},
		show_first_projects: function(){
					if(typeof config.firstPage !== "undefined" && config.firstPage !== ""){
						if(typeof app.userData == "undefined"){
							app.vent.on("userConnected:ready", function(){
								if(app.userData.email === config.firstPage){
										this.projects();
								}
							}.bind(this));
							if(config.for_every_logged_in){
								this.people(config.firstPage);
							}else{
								this.projects();
							}
							
						}else{
							if(app.userData.email === config.firstPage || !config.for_every_logged_in){
								this.projects();
							}else{
								this.people(config.firstPage);
							}
						}
					}else{
						this.projects();
					}
		},
		show_timeline_projects: function(){
					if(typeof config.firstPage !== "undefined" && config.firstPage !== ""){
						if(typeof app.userData == "undefined"){
							app.vent.on("userConnected:ready", function(){
								if(app.userData.email === config.firstPage){
										this.timeline();
								}
							}.bind(this));
							if(config.for_every_logged_in){
								this.people(config.firstPage);
							}else{
								this.timeline();
							}
							
						}else{
							if(app.userData.email === config.firstPage || !config.for_every_logged_in){
								this.timeline();
							}else{
								this.people(config.firstPage);
							}
						}
					}else{
						this.timeline();
					}
		}
	};
});
