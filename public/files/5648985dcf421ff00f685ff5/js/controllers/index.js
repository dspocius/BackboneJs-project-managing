/* Caching at controllers level */

define([
	'app',
	'../appmodules/projects/controllers/addController',
	'../appmodules/projects/controllers/projectsController',
	'../appmodules/projects/controllers/entryController',
	'../appmodules/projects/controllers/listController',
	'../appmodules/logging/controllers/loginController',
    'models/logging',
    '../appmodules/logging/models/logout',
    'views/EmptyView',
    'views/Footer',
    'collections/Nav',
	'templates'
], function (app, addController, projectsController, entryController, listController, loginController, logging, logout, EmptyView, Footer, Nav, templates) {
	'use strict';
    var projectsCtrl = new projectsController();
    var projectsProjectCtrl = new projectsController({mainProjectCtrl:projectsCtrl});
    var entryCtrl = new entryController({mainProjectCtrl:projectsCtrl});
    var addCtrl = new addController({mainProjectCtrl:projectsCtrl});
    var listCtrl = new listController({mainProjectCtrl:projectsCtrl});
	return {
        logout: function () {
            this.showPage('logout');
        },
		notfound: function () {
			$('#main').html('Not found');
            app.menuleft.show(new EmptyView());
            app.footernavright.show(new EmptyView());
            app.menu.show(new EmptyView());
            app.footernavleft.show(new EmptyView());
            app.leftmenu.show(new EmptyView());
        },
		firstcheck: function () {
			this.cInitialize().done(function(data){
					templates.loggedIn = true;
					templates.user = data.username;
                    this.projects(data.username);
					app.vent.trigger('refresh:loggedin:places');
                }.bind(this)).fail(function(err){
                    app.vent.trigger('refresh:footermenu');
                    var log = new loginController();
                    log.on('success_logging',function(){
                        this.firstcheck();
                    }.bind(this));
                }.bind(this));
		},
		home: function (username) {
            this.showPage(username,'home');
        },
		showPage: function (username,pageName) {
            //this.addToMenu('glyphicon-blackboard','Friends','projectsinlist/friends/friends');
            if(pageName == null) pageName = 'home';

			var pageModel = app.pages.findWhere({name: pageName});

            app.vent.trigger('menu:activate', pageModel);
            if(pageName == 'first') {
                /*this.cInitialize().done(function(data){
					console.log(data)
                    //this.projects(username);
                }.bind(this)).fail(function(err){
                    app.vent.trigger('refresh:footermenu');
                    var log = new loginController();
                    log.on('success_logging',function(){
                        //this.projects(username);
                    }.bind(this));
                }.bind(this));*/
				
				this.notfound();
            }
            if(pageName == 'home') {
                this.projects(username);
            }
            if(pageName == 'logout') {
                var logoutt = new logout({id:'logout'});
                logoutt.destroy().always(function(){
                    $('#left-menu').css('display','none');
                    app.menuleft.show(new EmptyView());
                    app.footernavright.show(new EmptyView());
                    app.menu.show(new EmptyView());
                    app.footernavleft.show(new EmptyView());
                    app.leftmenu.show(new EmptyView());

                    Backbone.history.navigate('#page/first',{ trigger:true, replace: true });
                });
            }
            /*if(pageName == 'ex') {
                console.log('Example of on demand module loading..');
                require(['modules/Example'], function(Example) {
                    Example.start();
                });
            }*/
		},
        projects: function(username) {
            this.loadingBefore(username);
			var b;
            projectsCtrl.show(b,username);
            this.loadingAfterForProjects();
        },
        projectsinlist: function(username, project, list) {
            this.loadingBefore(username);
            if(project === 'friends' && list === 'friends'){
                this.addToMenu('glyphicon-blackboard','Friends','projectsinlist/friends/friends');
            }else{
                this.addToMenu('glyphicon-th','List','projectsinlist/'+username+'/'+project+'/'+list);
            }
            listCtrl.show({id: project, listId:list}, username);
            this.loadingAfterForProjects();
        },
        project: function(username,project) {
            this.loadingBefore(username);
                this.addToMenu('glyphicon-th','Project','project/'+username+'/'+project);
                projectsProjectCtrl.show({id: project}, username);
        },
        entry: function(username, entry){
            this.loadingBefore(username);
                this.addToMenu('glyphicon-link','Entry','entry/'+username+'/'+entry);
                entryCtrl.show({id:entry}, username);
        },
        addEntryList: function(project, list) {
            this.loadingBefore();
            this.addToMenu('glyphicon-plus-sign','Add','addlist/'+project+'/'+list);
            addCtrl.show({id: project, isList:true, listId:list});
        },
        addEntry: function(project) {
            this.loadingBefore();
                this.addToMenu('glyphicon-plus-sign','Add','add/'+project);
                addCtrl.show({id: project});
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
                iconshow += ' icon-in-menu icon-turn-off" aria-hidden="true"></div><div>'+name+'</div>';
                app.vent.trigger('menu:add', iconshow, url, true);
        },
        loadingBefore: function(username){
            $('#main').html('<div class="loading_main_big">Loading ...</div>');
			//{title: '<div class="glyphicon glyphicon-home icon-in-menu icon-turn-off" aria-hidden="true"></div><div>Home</div>', name: 'home', active: true}
			if(typeof username != 'undefined' && username != ''){
				this.addToMenu('glyphicon-home','Home','projects/'+username);
			}
        },
        loadingAfterForProjects: function(){

        }
	};
});
