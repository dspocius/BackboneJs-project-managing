/* Caching at controllers level */

define([
	'app',
	'../appmodules/projects/controllers/addController',
	'../appmodules/projects/controllers/projectsController',
	'../appmodules/projects/controllers/entryController',
	'../appmodules/logging/controllers/loginController',
    'models/logging',
    '../appmodules/logging/models/logout',
    'views/EmptyView',
    'views/Footer',
    'collections/Nav'
], function (app, addController, projectsController, entryController, loginController, logging, logout, EmptyView, Footer, Nav) {
	'use strict';
    var projectsCtrl = new projectsController();
    var projectsProjectCtrl = new projectsController();
    var entryCtrl = new entryController();
    var addCtrl = new addController();
	return {
        logout: function () {
            this.showPage('logout');
        },
		home: function () {
            this.showPage('home');
        },
		showPage: function (pageName) {
            if(pageName == null) pageName = 'home';

			var pageModel = app.pages.findWhere({name: pageName});

            app.vent.trigger('menu:activate', pageModel);
            if(pageName == 'first') {
                this.cInitialize().done(function(data){
                    this.projects();
                }.bind(this)).fail(function(err){
                    app.vent.trigger('refresh:footermenu');
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
        projects: function() {
                projectsCtrl.show();
        },
        project: function(project) {
                this.addToMenu('glyphicon-th','Project','project/'+project);
                projectsProjectCtrl.show({id: project});
        },
        entry: function(entry){
                this.addToMenu('glyphicon-link','Entry','entry/'+entry);
                entryCtrl.show({id:entry});
        },
        addEntry: function(project) {
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
        }
	};
});
