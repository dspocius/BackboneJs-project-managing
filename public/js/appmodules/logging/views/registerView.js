define([
    '../../../app',
    'marionette',
	'views/templateHelpers',
    'tpl!../templates/register.html'
], function( app, Marionette, templateHelpers, templ ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        ui:{
            google_id_token:'#google_id_token',
            username:'#username',
            real_email:'#real_email',
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
			var regex = /(<([^>]+)>)/ig;
			var regex_spec = /[^a-zA-Z0-9. ]/g;
			
			if($(this.ui.google_id_token).val() !== ""){
				
				this.trigger('register:tryregister',{
					email: $(this.ui.username).val().replace(regex, "").replace(regex_spec, ""),
					real_email: $(this.ui.real_email).val(),
					firstname: $(this.ui.firstname).val().replace(regex, "").replace(regex_spec, ""),
					lastname: $(this.ui.lastname).val().replace(regex, "").replace(regex_spec, ""),
					password: $(this.ui.google_id_token).val(),
					passwordConfirmation: $(this.ui.google_id_token).val(),
					id_token: $(this.ui.google_id_token).val(),
					is_google: "true"
				});
				$(this.ui.username).val('');
			}else{
				
				if($(this.ui.username).val().replace(regex, "").replace(regex_spec, "") == ""
					|| $(this.ui.real_email).val().replace(regex, "") == ""
					|| $(this.ui.firstname).val().replace(regex, "").replace(regex_spec, "") == ""
					|| $(this.ui.lastname).val().replace(regex, "").replace(regex_spec, "") == ""
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
				if($(this.ui.username).val().replace(regex, "").replace(regex_spec, "").length < 3
					|| $(this.ui.real_email).val().replace(regex, "").length < 3
					|| $(this.ui.firstname).val().replace(regex, "").replace(regex_spec, "").length < 3
					|| $(this.ui.lastname).val().replace(regex, "").replace(regex_spec, "").length < 3
					|| $(this.ui.passwordConfirmation).val().length < 3
					|| $(this.ui.password).val().length < 3
				){
					app.commands.execute('app:notify', {
						type: 'warning',
						title: 'Unsuccessfully',
						description: 'All fields are important and there cannot be less than 3 letters on each.'
					});
					return;
				}
				this.trigger('register:tryregister',{
					email: $(this.ui.username).val().replace(regex, "").replace(regex_spec, ""),
					real_email: $(this.ui.real_email).val().replace(regex, ""),
					firstname: $(this.ui.firstname).val().replace(regex, "").replace(regex_spec, ""),
					lastname: $(this.ui.lastname).val().replace(regex, "").replace(regex_spec, ""),
					password: $(this.ui.password).val(),
					passwordConfirmation: $(this.ui.passwordConfirmation).val()
				});
				$(this.ui.username).val('');
				$(this.ui.real_email).val('');
				$(this.ui.firstname).val('');
				$(this.ui.lastname).val('');
				$(this.ui.passwordConfirmation).val('');
				$(this.ui.password).val('');
				
			}
        },
		onRender: function(){
			setTimeout(function(){
				if(typeof window.google_login !== "undefined" && window.google_login !== ""){
					var id_token = window.google_login.id_token;
					var users_email = window.google_login.users_email;
					var firstname_of_person = window.google_login.firstname_of_person;
					var lastname_of_person = window.google_login.lastname_of_person;
								$("#google_id_token").val(id_token);
								$("#real_email").attr("type","hidden");
								$("#firstname").attr("type","hidden");
								$("#lastname").attr("type","hidden");
								$("#password").attr("type","hidden");
								$("#passwordConfirmation").attr("type","hidden");
								$("#real_email").val(users_email);
								$("#firstname").val(firstname_of_person);
								$("#lastname").val(lastname_of_person);
								$("#username").val(users_email.split("@")[0]);
					
				}
				$("input").focusout(function(){
					var regex = /(<([^>]+)>)/ig;
					var regex_spec = /[^a-zA-Z0-9. ]/g;
					var valll = $(this).val();
					if($(this).attr("id") === "real_email"){
						valll = valll.replace(regex, "");
					}
					if($(this).attr("id") !== "real_email" && $(this).attr("id") !== "passwordConfirmation" && $(this).attr("id") !== "password"){
						valll = valll.replace(regex, "").replace(regex_spec, "");
					}
					 $(this).val(valll);
				});
			},100);
		}
    });
});
