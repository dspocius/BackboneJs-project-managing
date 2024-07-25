/* Caching at controllers level */

define([
	'app',
	'../appmodules/projects/controllers/addController',
	'../appmodules/projects/controllers/projectsController',
	'../appmodules/projects/controllers/entryController',
	'../appmodules/projects/controllers/listController',
	'../appmodules/logging/controllers/loginController',
	'../appmodules/projects/controllers/searchController',
	'../appmodules/projects/controllers/settingsController',
	'../appmodules/projects/controllers/accountController',
    'models/logging',
    '../appmodules/logging/models/logout',
    'views/EmptyView',
    'views/Footer',
    'collections/Nav',
	'backbone'
], function (app, addController, projectsController, entryController, listController, loginController, 
searchController, settingsController, accountController, logging, logout, EmptyView, Footer, Nav, Backbone) {
	'use strict';
    var projectsCtrl = new projectsController();
    var projectsProjectCtrl = new projectsController({mainProjectCtrl:projectsCtrl});
    var entryCtrl = new entryController({mainProjectCtrl:projectsCtrl});
    var addCtrl = new addController({mainProjectCtrl:projectsCtrl});
    var listCtrl = new listController({mainProjectCtrl:projectsCtrl});
    var searchCtrl = new searchController();
    var settingsCtrl = new settingsController();
    var accountCtrl = new accountController();
	return {
		getSettingsAll: function(func){
			app.getSettingsCol().fetch().done(function(){
				var color = app.getSetting(app.getSettingsCol(), 'color');
				var listsColor = app.getSetting(app.getSettingsCol(), 'listsColor');
				var entryColor = app.getSetting(app.getSettingsCol(), 'entryColor');
				var websiteStyle = app.getSetting(app.getSettingsCol(), 'websiteStyle');
				var backgroundPicture = app.getSetting(app.getSettingsCol(), 'backgroundPicture');
				var borderRadius = app.getSetting(app.getSettingsCol(), 'borderRadius');
				var defaultViewOfSite = app.getSetting(app.getSettingsCol(), 'defaultViewOfSite');

				func({defaultViewOfSite:defaultViewOfSite, entryColor:entryColor, listsColor:listsColor, color:color,websiteStyle:websiteStyle});
			}.bind(this)).error(function(){
				console.log("appSettings ERROR");
				func({defaultViewOfSite:"", entryColor:"", listsColor:"", color:"",websiteStyle:""});
			});
		},
		settings: function () {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				settingsCtrl.show({settings:settings});
			});
        },
		account: function () {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
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
                    this.projects();
                }.bind(this)).fail(function(err){
                    /*app.vent.trigger('refresh:footermenu');*/
                    var log = new loginController();
                    log.on('success_logging',function(){
                        this.projects();
                    }.bind(this));
                }.bind(this));
            }
            if(pageName == 'home') {
                this.projects();
            }
            if(pageName == 'logout') {
                var logoutt = new logout({id:'logout'});
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
				projectsCtrl.show({settings:settings});
			});
        },
        projectsinlist: function(project, list) {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				if(project === 'friends' && list === 'friends'){
					this.addToMenu('glyphicon-blackboard','Shared','projectsinlist/friends/friends');
				}else{
					this.addToMenu('glyphicon-th','List','projectsinlist/'+project+'/'+list);
				}
				listCtrl.show({id: project, listId:list, settings:settings});
			}.bind(this));
        },
        project: function(project) {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				this.addToMenu('glyphicon-th','Project','project/'+project);
				projectsProjectCtrl.show({id: project,settings:settings});
			}.bind(this));
        },
		search: function(search){
			this.loadingBefore();
			this.getSettingsAll(function(settings){
				searchCtrl.show({search:search,settings:settings});
			});
		},
        entry: function(entry){
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				this.addToMenu('glyphicon-link','Entry','entry/'+entry);
				entryCtrl.show({id:entry,settings:settings});
			}.bind(this));
        },
        addEntryList: function(project, list) {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				this.addToMenu('glyphicon-plus-sign','Add','addlist/'+project+'/'+list);
				addCtrl.show({id: project, isList:true, listId:list,settings:settings});
			}.bind(this));
        },
        addEntry: function(project) {
            this.loadingBefore();
			this.getSettingsAll(function(settings){
				this.addToMenu('glyphicon-plus-sign','Add','add/'+project);
				addCtrl.show({id: project,settings:settings});
			}.bind(this));
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
        }
	};
});
