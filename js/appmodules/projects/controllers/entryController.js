define([
    '../../../app',
    'models/base',
    'underscore',
    '../views/entryView',
    'models/project'
], function( app, base, _, entryView, project ) {
    return base.extend({
        initialize: function(){
            this.projects = [];
        },
        show: function(options){
            var entryId = options.id;
            var projec;
            if(typeof this.projects[options.id] != 'undefined'){
                 projec = this.projects[options.id];
            }else{
                projec = new project({'_id': entryId});
                this.projects[options.id] = projec;
            }
            projec.url = '/projectentry/'+entryId;
            projec.fetch().done(function(){
                var cView = new entryView({model: projec});
                cView.render();
                app.main.show(cView);
            });
        }
    });
});