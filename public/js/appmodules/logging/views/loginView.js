define([
    '../../../app',
    'marionette',
	'views/templateHelpers',
    'tpl!../templates/login.html'
], function( app, Marionette, templateHelpers, templ ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        ui:{
            username:'#username',
            password:'#password'
        },
        events:{
			'click #about':'onAbout',
            'focus #username':'onFocusUsername',
            'blur #username':'onBlurUsername',
            'focus #password':'onFocusPassword',
            'blur #password':'onBlurPassword',
            'click #try_login':'onLogin',
            'click #go_to_register':'onRegister',
            'click #remember_button':'remember_button'
        },
        remember_button: function(e){
			location.href = "/#page/remember";
			this.trigger('remember:password');
		},
        onAbout: function(e){
			this.trigger('info:about');
		},
        template: templ,
        onBlurUsername: function(e){
            if(this.ui.username.val() == ''){
                this.ui.username.val('Write your username here!');
            }
        },
        onFocusUsername: function(e){
            if(this.ui.username.val() == 'Write your username here!'){
                this.ui.username.val('');
            }
        },
        onBlurPassword: function(e){
            if(this.ui.password.val() == ''){
                this.ui.password.attr('type', 'text');
                this.ui.password.val('Write your password here!');
            }
        },
        onFocusPassword: function(e){
            if(this.ui.password.val() == 'Write your password here!'){
                this.ui.password.attr('type', 'password');
                this.ui.password.val('');
            }
        },
        onRegister: function(e){
			this.trigger('register:try');
		},
        onLogin: function(e){
            if($(this.ui.username).val() == ""
                || $(this.ui.password).val() == ""
                || $(this.ui.username).val() == "Write your username here!"
                || $(this.ui.password).val() == "Write your password here!"
            ){
                app.commands.execute('app:notify', {
                    type: 'warning',
                    title: 'Unsuccessfully',
                    description: 'Wrong password or username'
                });
                return;
            }
            this.trigger('login:try',{
                email: $(this.ui.username).val(),
                password: $(this.ui.password).val()
            });
            $(this.ui.username).val('');
            $(this.ui.password).val('');
        }
    });
});
