define([
    '../../../app',
    'backbone',
    'marionette',
    '../views/loginView',
    '../views/registerView',
    '../models/login',
    'views/EmptyView'
], function( app, Backbone, Marionette, loginView, registerView, login, EmptyView ) {
    return Backbone.Model.extend({
        initialize: function(){
            this.cView = new loginView({model: new Backbone.Model()});
            this.cView2 = new registerView({model: new Backbone.Model()});

            app.mainHeader.show(new EmptyView({model: new Backbone.Model()}));
            app.main.show(this.cView);
            var th = this;
            this.makeListening();
        },
		makeListening: function(){
            this.listenTo(this.cView, 'info:about', this.infoAbout.bind(this));
            this.listenTo(this.cView, 'register:try', this.registerTry.bind(this));
            this.listenTo(this.cView, 'login:try', this.loginTry.bind(this));
			this.listenTo(this.cView2, 'login:go', this.loginGo.bind(this));
			this.listenTo(this.cView2, 'register:tryregister', this.registerTryReg.bind(this));
		},
		infoAbout: function(data){
			$(".info_about").toggle();
		},
		registerTry: function(data){
            this.cView = new loginView({model: new Backbone.Model()});
            this.cView2 = new registerView({model: new Backbone.Model()});
			app.main.show(this.cView2);
			this.makeListening();
		},
		loginGo: function(data){
            this.cView = new loginView({model: new Backbone.Model()});
            this.cView2 = new registerView({model: new Backbone.Model()});
			app.main.show(this.cView);
			this.makeListening();
		},
		loginTry: function(data){
                var log = new login(data);
                log.save().done(function(datta){
					location.reload();
                    //th.trigger('success_logging');
                }).fail(function(err){
                app.commands.execute('app:notify', {
                    type: 'warning',
                    title: 'Unsuccessfully',
                    description: 'Wrong password or email'
                });
                    console.log(err);
                });
        },
		registerTryReg: function(data){
                var log = new login(data);
				log.url = '/register';
                log.save().done(function(datta){
					//location.reload();
                    //th.trigger('success_logging');
					this.loginGo();
                }.bind(this)).fail(function(err){
					if(err.status != 200){
						app.commands.execute('app:notify', {
							type: 'warning',
							title: 'Unsuccessfully',
							description: 'Already exists such user'
						});
					}else{
						this.loginGo();
					}
                }.bind(this));
        }
    });
});
