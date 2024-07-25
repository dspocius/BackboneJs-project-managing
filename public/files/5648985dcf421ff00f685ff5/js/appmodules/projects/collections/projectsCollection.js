define([
    'underscore',
    'collections/base',
    'models/project',
    'templates'
], function( _, base, project, templates ) {
    return base.extend({
        model: project,
        url:templates.urlAddr+'/projects',
        initialize: function(options){
            if(typeof options.idd != 'undefined' && options.idd != ''){
                this.idd = options.idd;
            }
        },
        comparator: function( modell ){
            if(typeof modell != 'undefined' && typeof modell.get("created") != 'undefined'){
                /*var str = modell.get("created");
                str = str.toLowerCase();
                str = str.split("");
                str = _.map(str, function(letter) {
                    return String.fromCharCode(-(letter.charCodeAt(0)));
                });*/
                return [new Date(modell.get("position")).getTime()];
            }else{
                return [false];
            }
        }
    });
});
