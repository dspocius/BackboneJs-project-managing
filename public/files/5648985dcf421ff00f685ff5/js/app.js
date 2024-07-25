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
	'templates'
], function (jquery, Backbone, Marionette, NotifyRegion, DialogRegion, Nav, MenuView, Footer,Project, User, EmptyView, logging,socket, templates) {
	'use strict';

	var app = new Marionette.Application();
    app.socketService = io.connect();
    window.dataDrop = function(e){
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

    app.pages = new Nav();

    var menu = new MenuView({collection: app.pages,className:'nav nav-pills nav-center navbar-inner'});
    if(templates.loggedIn){
		var leftMenu = new Nav([
			{title: '<div class="glyphicon glyphicon-menu-hamburger icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '', active: false}
		]);
	}else{
		var leftMenu = new Nav([]);
	}
	
    var menuNew = [];//[{title: '<div class="glyphicon glyphicon-chevron-right icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: 'right',actionEx:'rightClick', active: false}];
    var leftMenuHidden = new Nav(menuNew);
    var logged = new logging();
    var userConnected = new User();
    app.userConnected = userConnected;
	app.addRegions({
		menu: '#main-nav',
		leftmenu: '#left-menu',
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
    app.vent.on("refresh:loggedin:places", function(options){
        menu = new MenuView({collection: app.pages,className:'nav nav-pills nav-center navbar-inner'});
		if(templates.loggedIn){
			leftMenu = new Nav([
				{title: '<div class="glyphicon glyphicon-menu-hamburger icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: '', active: false}
			]);
		}else{
			leftMenu = new Nav([]);
		}
		app.vent.trigger('top:leftmenu:show');
    });
    app.vent.on("refresh:footermenu", function(options){
        app.pages = new Nav();
         menu = new MenuView({collection: app.pages,className:'nav nav-pills nav-center navbar-inner'});
         app.footernavcenter.show(menu);
    });
    app.on("initialize:after", function(options){
        if (Backbone.history){
            Backbone.history.start();
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
    var cachedCollectionResources = [];
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
                    cachedCollectionResources[i].models[j].attributes = resource.attributes;
                    not_updated = false;
                    $('#text_id'+cachedCollectionResources[i].models[j].get('_id')).html(cachedCollectionResources[i].models[j].get('text'));
                    //$('#text_id'+cachedCollectionResources[i].models[j].get('_id')).attr('style','background: '+cachedCollectionResources[i].models[j].get('color'));
					//$('#project_'+cachedCollectionResources[i].models[j].get('_id')).attr('style','position:relative; border: 1px solid '+cachedCollectionResources[i].models[j].get('color'));
                    $('#project_'+cachedCollectionResources[i].models[j].get('_id')+' .glyphicon-list-alt').attr('style','color:'+cachedCollectionResources[i].models[j].get('color'));
                }
            }
        }
        if(not_updated){
            for(var i=0; i < cachedCollectionResources.length; i++){
                if(typeof cachedCollectionResources[i].idd != 'undefined' && cachedCollectionResources[i].idd == id){
                    cachedCollectionResources[i].add(resource);
                    var inHeaderr = resource.get('inHeader');
                    if(typeof inHeaderr !== 'undefined' && inHeaderr !== ''){
                        for(var i=0; i < cachedCollectionResources.length; i++){
                            if(typeof cachedCollectionResources[i].idd != 'undefined' && cachedCollectionResources[i].idd == inHeaderr){
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
	app.vent.on('top:leftmenu:show', function () {
        var menuleft = new MenuView({collection: leftMenu, className:'nav nav-pills pull-left'});
        app.menuleft.show(menuleft);
        app.footernavcenter.show(menu);

        logged.fetch().success(function(data){
            app.socketService.emit('clientconnected', {id:data.username});
            userConnected.urlRoot = '/user/'+data.username;
            userConnected.url = '/user/'+data.username;
            userConnected.fetch().success(function(data2){
                userConnected.data2 = JSON.parse(data2);
                app.vent.trigger('userConnected:ready');
                var js = JSON.parse(data2);
                menuNew = [];//[{title: '<div class="glyphicon glyphicon-chevron-right icon-in-menu icon-turn-off" aria-hidden="true"></div>', name: 'right',actionEx:'rightClick', active: false}];
                for(var i=0; i < js.programs.length; i++){
                    menuNew.push({title:js.programs[i].name, name:'link',link:'/files/'+js.programs[i]._id+'/index.html', active:false});
                }
                menuNew.push({title: 'Logout', name: 'logout', active: false});
                leftMenuHidden = new Nav(menuNew);
                var menuleft_inner = new MenuView({collection: leftMenuHidden, className:'nav nav-pills pull-left'});
                this.listenTo(menuleft, 'menuitem:click',function(view){
                    if($('#left-menu').is(':visible')){
                        $('#left-menu').css('display','none');
                    }else{
                        $('#left-menu').css('display','block');
                    }
                    this.listenTo(menuleft_inner, 'menuitem:click',function(view){
                        if(view.model.get('actionEx') == 'rightClick'){
                            $('#left-menu').css('display','none');
                        }
                    });
                    app.leftmenu.show(menuleft_inner);
                });

            }.bind(this));
        }.bind(this));

    });
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

	return window.app = app;
});
