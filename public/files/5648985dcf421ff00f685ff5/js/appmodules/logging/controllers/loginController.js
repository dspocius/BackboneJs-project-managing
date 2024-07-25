define([
    '../../../app',
    'backbone',
    'marionette',
    '../views/loginView',
    '../models/login',
    'views/EmptyView'
], function( app, Backbone, Marionette, loginView, login, EmptyView ) {
    return Backbone.Model.extend({
        initialize: function(){
            var cView = new loginView({model: new Backbone.Model()});

            app.mainHeader.show(new EmptyView({model: new Backbone.Model()}));
            app.main.show(cView);
            var th = this;
            this.listenTo(cView, 'login:try', function(data){
                var log = new login(data);
                log.save().done(function(datta){
                    th.trigger('success_logging');
                }).fail(function(err){
                    console.log(err);
                });
            });
        }
    });
});
