define([
    '../../../app',
    '../../../config',
    'marionette',
	'views/templateHelpers',
    'tpl!../templates/remember.html'
], function( app, config, Marionette, templateHelpers,templ ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        ui:{
            remember_em:'#remember_em'
        },
        events:{
            'click #remember_em_send':'onRemember'
        },
        template: templ,
        onRemember: function(e){
			var remember_em = $(this.ui.remember_em).val();
			if(remember_em !== ""){
				var remembMod = new Backbone.Model();
				remembMod.url = config.urlAddr+'/remember_password';
				remembMod.set("user",remember_em);
				remembMod.save().done(function(data){
						app.commands.execute('app:notify', {
							type: 'warning',
							title: 'Success',
							description: 'Check you email box'
						});
					location.href = "/#page/login";
                }.bind(this)).fail(function(err){
					if(err.status != 200){
						app.commands.execute('app:notify', {
							type: 'warning',
							title: 'Unsuccessfully',
							description: 'User with such username or email not found'
						});
					}else{
						app.commands.execute('app:notify', {
							type: 'warning',
							title: 'Success',
							description: 'Check you email box'
						});
						location.href = "/#page/login";
					}
				});
			}
        }
    });
});
