define([
	'app',
    'models/base',
    'templates'
], function( app, base, templates ) {
	'use strict';
	
    return base.extend({
        idAttribute:'_id',
        urlRoot: templates.urlAddr+'/project',
        defaults: {
            isProject: false,
            updated: new Date().toJSON().toString(),
            isHeader:false,
            fromTimeline:false,
            belongs_to_is_email:false,
            position:0,
            color:"#c6e0f9",
            colorLighter:"#c6e0f9",
            files:'',
            text:'',
            created:'',
            parentvisibility:'private',
			friendsThere:'',
			assignedID:'',
			files_show:'',
			filesurl:'',
			comments_count:'0',
			read_it_count:'0',
			view_main:'board_view_show',
			statsdats_data:'[]',
			routes_data:'[]',
			forms_data:'[]',
			is_old:'false',
			what_to_show:'all',
			hisinproject_this:'_',
			forms_data_info:'[]',
			submitted_data:'[]',
			submitted_data_can_answer_more:'true',
			user_submitted_form:'false',
			photobook_data:'[]',
			likes:[],
			custom_view_html:'',
			tasks:[],
			firstlastname:"",
			header_count_old_numb:0,
			header_count_old_numb_used:0,
			header_count_old_numb_used_list:0,
			show_main_html:true,
			disabled_pages_number:"",
			disabled_list_name_size:"",
			shared_model:"false",
			email:"",
			firstname:""
        },
		getVisibilityOfTheProject: function(app){
			var thisProj = this;
			var canView = false;
			var visibilityOfIt = thisProj.get("visibility");
			if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
									var friendsInThatProj = thisProj.get("friends");
									if(typeof friendsInThatProj != "undefined"){
										for(var ii=0; ii < friendsInThatProj.length; ii++){
											if(typeof friendsInThatProj[ii] != "undefined" && friendsInThatProj[ii] != "" && typeof friendsInThatProj[ii]._id != "undefined" && friendsInThatProj[ii]._id != ""){
												if(typeof app.userData == "undefined" || app.userData._id == friendsInThatProj[ii]._id){
													canView = true;
												}
											}
										}
									}
									if(typeof app.userData != "undefined" && thisProj.get("email") == app.userData.email){
										canView = true;
										visibilityOfIt = "editpublic";
									}
			}
							return {visibilityOfIt:visibilityOfIt, canView:canView};
		},
        addToFriends: function(friendID){
            var th_fmodels = this.get('friends');
            var newModell = this.get('friends');
            var addThem = true;
            for(var i=0; i < th_fmodels.length; i++){
                if(th_fmodels[i]._id === friendID){
                    addThem = false;
                }
            }
            if(addThem){
                newModell.push({_id:friendID});
            }
        },
        removeFromFriends: function(friendID){
            var th_fmodels = this.get('friends');
            var newModell = [];
            for(var i=0; i < th_fmodels.length; i++){
                var addThem = true;
                if(th_fmodels[i]._id === friendID){
                    addThem = false;
                }
                if(addThem){
                    newModell.push(th_fmodels[i]);
                }
            }
            this.set('friends', newModell);
        },
		fetchHeaderCount: function(header_count_old, thh){
			if(typeof this.get("header_count_old") === "undefined" || this.get("header_count_old") === ""){
				this.set("header_count_old", "0");
				var idd = this.get("_id");
				header_count_old.set("parent_model", this);
					header_count_old.fetch({
						success : function(collection, response) {
							var parent_mod = collection.get("parent_model");
							if(typeof parent_mod.get("header_count_old_numb_loaded") === "undefined" || parent_mod.get("header_count_old_numb_loaded") === ""){
								var parent_mod = collection.get("parent_model");
								parent_mod.set("header_count_old_numb", response.count);
								parent_mod.set("header_count_old_numb_list", response.count);
								parent_mod.set("header_count_old_numb_loaded", true);
								collection.set("count", response.count);
								if (response.count > 0) {
									$("#loadMoreGoProGrid"+idd).show();
								} else {
									$("#loadMoreGoProGrid"+idd).hide();
								}
							}
						}
					});
				
				
			}
		},
		setLighterColor: function() {
			this.set('colorLighter',this.ColorLuminance(this.get("color"), 0.2));
		},
		ColorLuminance: function(hex, lum) {

			// validate hex string
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
			}
			lum = lum || 0;

			// convert to decimal and change luminosity
			var rgb = "#", c, i;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i*2,2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
				rgb += ("00"+c).substr(c.length);
			}

			return rgb;
		}
    });
});
