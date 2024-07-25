define([
    '../../../app',
    '../../../config',
    'backbone',
    'marionette',
    '../views/loginView',
    '../views/registerView',
    '../views/rememberView',
    '../models/login',
    'views/EmptyView'
], function( app, config, Backbone, Marionette, loginView, registerView, rememberView, login, EmptyView ) {
    return Backbone.Model.extend({
        initialize: function(){
			var loginMod = new Backbone.Model();
			loginMod.set("can_login", true);
			loginMod.set("can_register", true);
			var registerMod = new Backbone.Model();
			registerMod.set("can_login", true);
			registerMod.set("can_register", true);
			if(!config.letLogin){ registerMod.set("can_login", false); loginMod.set("can_login", false); }
			if(!config.letRegister){ registerMod.set("can_register", false); loginMod.set("can_register", false); }
			
            this.cView = new loginView({model: loginMod});
            this.cView2 = new registerView({model: registerMod});
            this.cView3 = new rememberView({model: registerMod});

            app.mainHeader.show(new EmptyView({model: new Backbone.Model()}));
            app.main.show(this.cView);
            var th = this;
            this.makeListening();
        },
		rememberPassword: function(){
			app.main.show(this.cView3);
		},
		makeListening: function(){
            this.listenTo(this.cView, 'info:about', this.infoAbout.bind(this));
            this.listenTo(this.cView, 'register:try', this.registerTry.bind(this));
            this.listenTo(this.cView, 'login:try', this.loginTry.bind(this));
            this.listenTo(this.cView, 'remember:password', this.rememberPassword.bind(this));
			this.listenTo(this.cView2, 'login:go', this.loginGo.bind(this));
			this.listenTo(this.cView2, 'register:tryregister', this.registerTryReg.bind(this));
		},
		infoAbout: function(data){
			$(".info_about").toggle();
		},
		registerTry: function(data){
			
			var loginMod = new Backbone.Model();
			loginMod.set("can_login", true);
			loginMod.set("can_register", true);
			var registerMod = new Backbone.Model();
			registerMod.set("can_login", true);
			registerMod.set("can_register", true);
			if(!config.letLogin){ registerMod.set("can_login", false); loginMod.set("can_login", false); }
			if(!config.letRegister){ registerMod.set("can_register", false); loginMod.set("can_register", false); }
			
            this.cView = new loginView({model: loginMod});
            this.cView2 = new registerView({model: registerMod});
			app.main.show(this.cView2);
			this.makeListening();
		},
		loginGo: function(data){
			var loginMod = new Backbone.Model();
			loginMod.set("can_login", true);
			loginMod.set("can_register", true);
			var registerMod = new Backbone.Model();
			registerMod.set("can_login", true);
			registerMod.set("can_register", true);
			if(!config.letLogin){ registerMod.set("can_login", false); loginMod.set("can_login", false); }
			if(!config.letRegister){ registerMod.set("can_register", false); loginMod.set("can_register", false); }
			
            this.cView = new loginView({model: loginMod});
            this.cView2 = new registerView({model: registerMod});
			app.main.show(this.cView);
			this.makeListening();
		},
		loginTry: function(data){
                var log = new login(data);
				if(typeof data.is_google !== "undefined" && data.is_google == "true"){
					log.url = config.urlAddr+'/login_google';
				}
                log.save().done(function(datta){
					location.reload();
                    //th.trigger('success_logging');
                }).fail(function(err){
                app.commands.execute('app:notify', {
                    type: 'warning',
                    title: 'Unsuccessfully',
                    description: 'Wrong password or username'
                });
                    console.log(err);
                });
        },
		registerTryReg: function(data){ 
                var log = new login(data);
				log.url = config.urlAddr+'/register';
				if(typeof data.is_google != "undefined" && data.is_google == "true"){
					log.url = config.urlAddr+'/register_google';
				}
                log.save().done(function(datta){
					//location.reload();
                    //th.trigger('success_logging');
					//this.loginGo();
					this.loginTry(data);
                }.bind(this)).fail(function(err){
					if(err.status != 200){
						app.commands.execute('app:notify', {
							type: 'warning',
							title: 'Unsuccessfully',
							description: 'User with such username or email already exists'
						});
					}else{
						this.loginTry(data);
					}
                }.bind(this));
        }
    });
});
