define(['./module'], function (services) {
    'use strict';
    services.factory('viewLogin', ['common', function (common) {
        return {
            ui: {
                username:'#username',
                password:'#password'
            },
            initializeScopeListening: function (scope) {
                scope.onUsernameBlur = function(){
                    var user = $(this.ui.username);
                    if(user.val() == ''){
                        user.val('Write your email here!');
                    }
                }.bind(this);

                scope.onUsernameFocus = function(){
                    var user = $(this.ui.username);
                    if(user.val() == 'Write your email here!'){
                        user.val('');
                    }
                }.bind(this);

                scope.onPasswordBlur = function(){
                    var pass = $(this.ui.password);
                    if(pass.val() == ''){
                        pass.val('Write your password here!');
                    }
                }.bind(this);

                scope.onPasswordFocus = function(){
                    var pass = $(this.ui.password);
                    if(pass.val() == 'Write your password here!'){
                        pass.val('');
                    }
                }.bind(this);

                scope.login = function(){
                    var pass = $(this.ui.password);
                    var user = $(this.ui.username);
                    if(pass.val() === 'Write your password here!' || user.val() === 'Write your email here!'){
                        return;
                    }
                    common.trigger('view:login',{cPass:pass.val(),cUser:user.val()});
                }.bind(this);
            }
        };
    }]);
});
