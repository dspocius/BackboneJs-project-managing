define([
    '../../../app',
    'marionette',
    'tpl!../templates/login.html'
], function( app, Marionette, templ ) {
    'use strict';

    return Marionette.ItemView.extend({
        ui:{
            username:'#username',
            password:'#password'
        },
        events:{
            'focus #username':'onFocusUsername',
            'blur #username':'onBlurUsername',
            'focus #password':'onFocusPassword',
            'blur #password':'onBlurPassword',
            'click #try_login':'onLogin'
        },
        template: templ,
        onBlurUsername: function(e){
            if(this.ui.username.val() == ''){
                this.ui.username.val('Write your email here!');
            }
        },
        onFocusUsername: function(e){
            if(this.ui.username.val() == 'Write your email here!'){
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
        onLogin: function(e){
            if($(this.ui.username).val() == ""
                || $(this.ui.password).val() == ""
                || $(this.ui.username).val() == "Write your email here!"
                || $(this.ui.password).val() == "Write your password here!"
            ){
                app.commands.execute('app:notify', {
                    type: 'warning',
                    title: 'Really?',
                    description: 'I see you tried a lot to login'
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
