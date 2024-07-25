define([
    '../../../app',
    'marionette',
    'tpl!../templates/register.html'
], function( app, Marionette, templ ) {
    'use strict';

    return Marionette.ItemView.extend({
        ui:{
            username:'#username',
            firstname:'#firstname',
            lastname:'#lastname',
            passwordConfirmation:'#passwordConfirmation',
            password:'#password'
        },
        events:{
            'click #about':'onAbout',
            'click #try_register':'onRegister',
            'click #go_to_login':'onGoToLogin'
        },
        template: templ,
        onAbout: function(e){
			this.trigger('info:about');
		},
        onGoToLogin: function(e){
			this.trigger('login:go');
		},
        onRegister: function(e){
            if($(this.ui.username).val() == ""
                || $(this.ui.firstname).val() == ""
                || $(this.ui.lastname).val() == ""
                || $(this.ui.passwordConfirmation).val() == ""
                || $(this.ui.password).val() == ""
            ){
                app.commands.execute('app:notify', {
                    type: 'warning',
                    title: 'Unsuccessfully',
                    description: 'All fields are important.'
                });
                return;
            }
            this.trigger('register:tryregister',{
                email: $(this.ui.username).val(),
                firstname: $(this.ui.firstname).val(),
                lastname: $(this.ui.lastname).val(),
                password: $(this.ui.password).val(),
                passwordConfirmation: $(this.ui.passwordConfirmation).val()
            });
            $(this.ui.username).val('');
            $(this.ui.firstname).val('');
            $(this.ui.lastname).val('');
            $(this.ui.passwordConfirmation).val('');
            $(this.ui.password).val('');
        }
    });
});
