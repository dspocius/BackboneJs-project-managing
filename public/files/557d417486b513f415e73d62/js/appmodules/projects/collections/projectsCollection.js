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
        },
		addSharedModels: function(projectsShared){
					projectsShared.url = '/projectsfriend/'+app.userConnected.data2._id;
					projectsShared.fetch().done(function(){
						var jsonDate = (new Date()).toJSON();//"1970-01-01T00:00:00.511Z";//(new Date()).toJSON();
						var sharedHeader = {
							InHeadersAll: [],
							InProjectsAll:[],
							_id: "friends",
							color:"#616161",
							created: jsonDate.toString(),
							email: "test",
							files: [],
							friends: [],
							friendsDeeper: [],
							friendsThere:"",
							inHeader:"",
							inProjects:[""],
							isHeader:true,
							isProject:false,
							name:"-",
							position:"1969-01-01T00:00:00.511Z",
							tasks:[],
							text:app.translate("Shared"),
							updated:jsonDate.toString()
						}
			if(projectsShared.models.length > 0){
				this.add(new project(sharedHeader));				

								var modelsShared = projectsShared.models;
								for(var i=0; i < modelsShared.length; i++){
									var attrModel = modelsShared[i].attributes;
									attrModel.inHeader = "friends";//"55a52ff62470a77406a50d2d";
									this.add(new project(attrModel));
								}
			}
					}.bind(this));
			}
    });
});
