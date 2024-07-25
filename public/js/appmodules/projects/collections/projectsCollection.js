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
		add: function(model){
			var isDupe = this.any(function(_model) { 
				return _model.get('_id') === model.get('_id');
			});

			// Up to you either return false or throw an exception or silently ignore
			// NOTE: DEFAULT functionality of adding duplicate to collection is to IGNORE and RETURN. Returning false here is unexpected. ALSO, this doesn't support the merge: true flag.
			// Return result of prototype.add to ensure default functionality of .add is maintained. 
			return isDupe ? false : Backbone.Collection.prototype.add.call(this, model);
		},
        comparator: function( modell ){
            if(typeof modell != 'undefined' && typeof modell.get("created") != 'undefined'){
                /*var str = modell.get("created");
                str = str.toLowerCase();
                str = str.split("");
                str = _.map(str, function(letter) {
                    return String.fromCharCode(-(letter.charCodeAt(0)));
                });*/
				var timeof = (new Date(modell.get("position")).getTime());
				if(this.url.indexOf("projectsinlist") > -1){
					return -timeof;
				}
                return timeof;
            }else{
                return false;
            }
        },
		addSharedModelOne: function(modell){
			var isSharedCreated = false;
			if(this.models.length > 0){
				var modelsAll = this.models;
				for(var i=0; i < modelsAll.length; i++){
					if(modelsAll[i].get("_id") === "friends"){
						isSharedCreated = true;
					}
				}
			}
			if(!isSharedCreated){
						var jsonDate = (new Date()).toJSON();//"1970-01-01T00:00:00.511Z";//(new Date()).toJSON();
						var sharedHeader = {
							InHeadersAll: [],
							InProjectsAll:[],
							id: "friends",
							_id: "friends",
							color:"#616161",
							created: jsonDate.toString(),
							email: "",
							files: [],
							friends: [],
							friendsDeeper: [],
							friendsThere:"",
							inHeader:"",
							inProjects:"",
							isHeader:true,
							isProject:false,
							name:"-",
							position:"1969-01-01T00:00:00.511Z",
							tasks:[],
							text:app.translate("Shared"),
							updated:jsonDate.toString(),
							visibility:'public',
							parentvisibility:'public'
						}
					this.add(new project(sharedHeader));
			}
				var attrModel = modell.attributes;
				attrModel.inHeader = "friends";
				attrModel.shared_model = "true";
				this.add(new project(attrModel));
		},
		addSharedModels: function(projectsShared,cView=null){
					projectsShared.url = templates.urlAddr+'/projectsfriend/'+app.userConnected.data2._id;
					projectsShared.fetch().done(function(){
						var jsonDate = (new Date()).toJSON();//"1970-01-01T00:00:00.511Z";//(new Date()).toJSON();
						var sharedHeader = {
							InHeadersAll: [],
							InProjectsAll:[],
							id: "friends",
							_id: "friends",
							color:"#ffffff",
							created: jsonDate.toString(),
							email: "",
							files: [],
							friends: [],
							friendsDeeper: [],
							friendsThere:"",
							inHeader:"",
							inProjects:"",
							isHeader:true,
							isProject:false,
							name:"-",
							position:"1969-01-01T00:00:00.511Z",
							tasks:[],
							text:app.translate("Shared"),
							updated:jsonDate.toString(),
							visibility:"public",
							parentvisibility:'public'
						}
			if(projectsShared.models.length > 0){
				this.add(new project(sharedHeader));				

								var modelsShared = projectsShared.models;
								for(var i=0; i < modelsShared.length; i++){
									projectsShared.models[i].set('parentvisibility', projectsShared.models[i].get("visibility"));
									var attrModel = modelsShared[i].attributes;
									if (attrModel.isProject) {
										attrModel.parentvisibility = "editpublic";
									}
									attrModel.inHeader = "friends";//"55a52ff62470a77406a50d2d";
									//attrModel.isHeader = false;
									attrModel.InHeadersAll = ["friends"];
									attrModel.shared_model = "true";
									this.add(new project(attrModel));
								}
								this.sort(this.comparator());
								if (cView !== null) {
									cView.render();
								}
			}else{
				if(this.length == 0 && projectsShared.models.length == 0){
					setTimeout(function(){
					if(this.length == 0 && projectsShared.models.length == 0){ app.getWhenNoBoardItemsWhereToTheCreator("#project_all_inner_container_one"); }
					}.bind(this),1);
				}
			}
					}.bind(this));
			},
			getModelFromCol: function(pid){
				var thisItem = this.get(pid);
				var collectionThat = this;
				if(typeof thisItem == 'undefined'){
					var colsO = this.otherCols;
					for(var ii=0; ii < colsO.length; ii++){
						if(typeof colsO[ii].get(pid) != 'undefined'){
							thisItem = colsO[ii].get(pid);
							collectionThat = colsO[ii];
						}
					}
				}
				return {thisItem:thisItem, collectionThat:collectionThat};
			},
			removeModelFromCol: function(pid){
				this.remove(pid);
				if(typeof thisItem == 'undefined'){
					var colsO = this.otherCols;
					for(var ii=0; ii < colsO.length; ii++){
						if(typeof colsO[ii].get(pid.get("_id")) != 'undefined'){
							colsO[ii].remove(pid);
						}
					}
				}
			}
    });
});
