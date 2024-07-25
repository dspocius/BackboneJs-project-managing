/*global define */

define([
	'tinymce',
	'../config',
	'marionette',
	'templates',
    'underscore',
	'models/project',
	'appmodules/viewmodules/customData',
	'appmodules/viewmodules/projectViewSimple',
	'appmodules/viewmodules/listViewSimple',
	'appmodules/viewmodules/entryViewSimple',
	'appmodules/projects/collections/projectsCollection'
], function (tinymce, config, Marionette, templates, _, Project, customData, projectView, listView, entryView, projectsCollection) {
	'use strict';

	return Marionette.ItemView.extend({
		initialize: function(){
			this.projects = [];
			this.timelineCommentsAdded = false;
            this.$el.attr("pid", this.model.get('_id'));
			if(this.model.get('inProjects') != '' &&
			typeof this.model.get('inProjects') != 'undefined'){
				this.$el.attr("pid_project", this.model.get('inProjects'));
			}else{
				this.$el.attr("pid_project", '');
			}
            this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
            this.$el.bind("drop", _.bind(this._dropEvent, this));

            this._draghoverClassAdded = false;
            this._draghoverClassAddedFile = false;
            Project.selectedVieww = "";
			this.model.set('friendsThis',[]);
			this.model.set('colorLighter',this.ColorLuminance(this.model.get("color"), 0.2));
			
			
			if(typeof app.userConnected != 'undefined' && 
				typeof app.userConnected.data2 != 'undefined'){
				//this.friendsAddedV(app.userConnected.data2.friends);
			}
			this.listenTo(this.model,'change:position',this.onAfterDropInHere);
			this.listenTo(this.model,'change',this.rerenderEverything);
        },
		projectsShareH: function(){
			var ret = this.projectsShareGetH();
			var th = this;
			app.showSimpleDialog(
			{message:ret, title: this.model.get("text"), icon:"", 
			searchforfriends: function(e) {
				var valofsearch = $(e.currentTarget).val();
				if (valofsearch == "") {
					$(".searchShareChooseFrom").hide();
					$(".currentShareChooseFrom").show();
				}else{
					th.searchforfriends(valofsearch, function(ret) {
						var datad = "";
						for (var i=0, n=ret.length; i < n; i++) {
							datad += th.getShareButtonHtml(ret[i]);
						}
						if (valofsearch == "") {
							$(".searchShareChooseFrom").hide();
							$(".currentShareChooseFrom").show();
						}else{
							$(".searchShareChooseFrom").html(datad);
							$(".searchShareChooseFrom").show();
							$(".currentShareChooseFrom").hide();
						}
					});
				}
			}},
			this);
		},
		unloadFriendsArr: function(frdata) {
			var arrfr = [];
			for (var i=0; i < frdata.length; i++) {
				if (frdata[i] && frdata[i].friends) {
				arrfr.push(frdata[i].friends);
				} else {
				arrfr.push(frdata[i]);
				}
			}
			
			return arrfr;
		},
		searchforfriends: function(searchval, callback) {
			var th = this;
			$.ajax({
			  method: "GET",
			  url: "/friends/"+searchval,
			  contentType: 'application/json; charset=utf-8',
			  dataType: 'json'
			}).always(function (msg) {
				callback(th.unloadFriendsArr(JSON.parse(msg)));
			});
		},
		projectsShareGetH: function(){
			if(typeof app.userConnected != 'undefined' && 
				typeof app.userConnected.data2 != 'undefined'&& 
				typeof app.userConnected.data2.friends != 'undefined'){
				var likes = app.userConnected.data2.friends;
				var datad = "<div><input type='text' class='searchforfriends' placeholder='Search for friend' /></div><div class='searchShareChooseFrom'></div><div class='currentShareChooseFrom'>";
				for (var i=0, n=likes.length; i < n; i++) {
					datad += this.getShareButtonHtml(likes[i]);
				}
				datad += "</div>";
				return datad;
			}
			return "";
		},
		getShareButtonHtml: function(onedata){
			var rethtml = "";
			var canChoose = true;
			var canAssign = true;
			var workingon = this.model.get("assignedID");
			
			if (workingon == onedata._id) {
				canAssign = false;
			}
					
			var ffriends = this.model.get('friends');
			if(typeof ffriends !== "undefined" && typeof ffriends.length !== "undefined" && ffriends.length > 0 && ffriends !== ''){
				for(var jj=0; jj < ffriends.length; jj++){
					if(onedata._id === ffriends[jj]._id){
						canChoose = false;
					}
				}
			}
			
			var hasshared = "false";
			var shareButton = "<button data-action='share' data-id='"+onedata._id+"' class='shareThatRow"+onedata._id+" shareDialogH sendSharelink btn btn-default viewButtonsIn inlineblock'>Share</button>";
			
			if(!canChoose){
				hasshared = "true";
				shareButton = "Shared ";
			} 
			var assignTicketButton = "<button data-action='assign' data-remail='"+onedata.real_email+"' data-isshared='"+hasshared+"' data-name='"+onedata.firstname+" "+onedata.lastname+"' data-id='"+onedata._id+"' class='assignThatRow"+onedata._id+" shareDialogH sendSharelink btn btn-default viewButtonsIn inlineblock'>Assign ticket</button>";
			if (!canAssign) {
				assignTicketButton = " Assigned ";
			}
			var notifyByEmailButton = "";//"<button data-action='notify' data-remail='"+onedata.real_email+"' data-id='"+onedata._id+"' class='notifyThatRow"+onedata._id+" shareDialogH sendSharelink btn btn-default viewButtonsIn inlineblock'>Notify by email</button>";
			if (typeof onedata != "undefined" && onedata != 0) {
				var imgus = '<div class="commenthereGohere likesDialogViewContainer"><div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+onedata.email+'/'+onedata.email+'.jpg" alt=""></div><div class="commentInModal likesDialogView">'+onedata.firstname+' '+onedata.lastname+'</div></div>';
				rethtml += "<div class='bottomBorder1'><a class='inlineblock' href='#"+onedata.email+"'>"+imgus+"</a> "+shareButton+assignTicketButton+notifyByEmailButton+" <button data-id='"+onedata._id+"' class='sendThatRow"+onedata._id+" shareDialogH sendlinkButton btn btn-default viewButtonsIn inlineblock'>Send Link</button></div>";
			}
			return rethtml;
		},
		showProLikesH: function(){
			var idh = this.model.get("_id");
			var likes = this.model.get("likes");
			var th = this;
			var datad = "<div class='apendedlikespeoplehere'>";
			for (var i=0, n=likes.length; i < n; i++) {
				if (likes[i] != "" && likes[i] != 0) {
					var imgus = '<div class="commenthereGohere likesDialogViewContainer"><div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+likes[i].em+'/'+likes[i].em+'.jpg" alt=""></div><div class="commentInModal likesDialogView">'+likes[i].nm+'</div></div>';
					datad += "<div class='bottomBorder1'><a href='#"+likes[i].em+"'>"+imgus+"</a></div>";
				}
			}
			if (this.model.get("countlikes") > likes.length) {
				datad += "</div>"+'<button type="button" class="btn btn-default loadmorehereindialog">Load more</button>';
			}
			app.showSimpleDialog({message:datad, title: this.model.get("text"), icon:"",
			loadmorehereindialog: function(e) {
				var mylikes = th.model.get("likes");
				var removeone = 0;
				for (var ii=0, nn = mylikes.length; ii < nn; ii++) {
					if (typeof mylikes[ii].likeloaded == "undefined" || !mylikes[ii].likeloaded) {
						removeone = 1;
					}
				}
				
				var countit = th.model.get("likes").length - removeone;
				$.ajax({
				  method: "GET",
				  url: "/projectentryy/"+idh+"/"+countit,
				  contentType: 'application/json; charset=utf-8',
				  dataType: 'json'
				}).always(function (msg) {
					if (typeof msg != "undefined" && typeof msg.likes != "undefined" && msg.likes.length > 0) {
						var mylikesh = th.model.get("likes");
						var addlikesnew = [];
						for (var ii=0, nn = msg.likes.length; ii < nn; ii++) {
							var can_addNew = true;
							
							for (var jj=0, njj=mylikesh.length; jj < njj; jj++) {
								if (mylikesh[jj].em == msg.likes[ii].em) {
									mylikesh[jj].likeloaded = true;
									can_addNew = false;
								}
							}
							
							if (can_addNew) {
								msg.likes[ii].likeloaded = true;
								addlikesnew.push(msg.likes[ii]);
							}
						}
						
						th.model.set("likes",mylikesh.concat(addlikesnew));
						var likes = addlikesnew;//msg.likes;
						for (var i=0; i < likes.length; i++) {
							if (likes[i] != "" && likes[i] != 0) {
								var onelike = '<div class="commenthereGohere likesDialogViewContainer"><div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+likes[i].em+'/'+likes[i].em+'.jpg" alt=""></div><div class="commentInModal likesDialogView">'+likes[i].nm+'</div></div>';
								var addlike = "<div class='bottomBorder1'><a href='#"+likes[i].em+"'>"+onelike+"</a></div>";
								$(".apendedlikespeoplehere").append(addlike);
							}
						}
						if (th.model.get("countlikes") <= th.model.get("likes").length) {
							$(".loadmorehereindialog").hide();
						}
					}else{
						$(".loadmorehereindialog").hide();
					}
				}.bind(this));
			}
			}, this);
		},
		likesPostHere: function(){
			var myModel = this.model;
				if(typeof app.userConnected.data2 !== 'undefined'){
					var firstLastname = app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname;
					var addlik = {em: app.userConnected.data2.email, nm: firstLastname, likeloaded: false};
					var likess = myModel.get("likes");
					var canaddh = true;
					for (var ii=0; ii < likess.length; ii++) {
						if (likess[ii].em == addlik.em) {
							canaddh = false;
						}
					}
					if (canaddh) {
						likess.push(addlik);
					}
					myModel.set("likes", likess);
					myModel.set('addlike', firstLastname);
					myModel.save();
					myModel.set('addlike', "false");
				}
		},
		setWhichEntriesIsOld: function(data, projects){
			var howmanycanbethere = parseInt(app.getSettingInWhole('make_old_when'));
							var how_many = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									how_many++;
								}
							}
							var how_many_should_be_set = how_many-howmanycanbethere;
							var how_many_now_set = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									if(how_many_should_be_set > how_many_now_set){
										projects.models[pr].set('is_old', 'true');
										projects.models[pr].save();
										how_many_now_set++;
									}
								}
							}
		},
		saveNewPostHere: function(e){
			e.stopPropagation();
            e.stopImmediatePropagation();
			var belongsto = "";
			
			var ident = e.currentTarget.getAttribute('identity');
			var pid_project = e.currentTarget.getAttribute('pid_project');
			
			var locationPidProj = location.href;
			if (locationPidProj.indexOf("project/") > -1) {
				pid_project = locationPidProj.split("project/")[1];
			}
			
			if (typeof this.model.collection.peopleColAdd != "undefined") {
				pid_project = "_";
				
				if (locationPidProj.indexOf("project/") > -1) {
					pid_project = locationPidProj.split("project/")[1].split("/")[0];
				}
				
				belongsto = this.model.collection.peopleColAdd.get("email");
			}
			
			var isProject = false;
			var projectText = $("#project_text_entry"+ident).val();
			
			if ($("#project_text_project"+ident).is(":visible")) {
				isProject = true;
				projectText = $("#project_text_project"+ident).val();
			}
			
			if (projectText != "") {
				var visibleHereThere = $("#visibilityOfNewHere"+ident).val();
				$("#project_text_entry"+ident).val("");
				$("#project_text_project"+ident).val("");
				var id_on_link = pid_project;
				var inPro = pid_project;
				
				if (id_on_link == "_") {
					inPro = "";
				}
				//var get_def_visibility = app.getSettingInWhole('defaultVisibilityAdded');
				var data = {
					color: "#ffffff",
					inHeader: ident,
					inProjects: inPro,
					isHeader: false,
					isProject: isProject,
					name: "-",
					belongs_to: belongsto,
					text: projectText,
					visibility: visibleHereThere
				};
				this.id = id_on_link;
				this.savePostHere(data, e);
			}
		},
		createNewButton: function(e){
			var ident = e.currentTarget.getAttribute('identity');

			$(".showAddNewButtonFor"+ident).toggle();
			$("#project_text_entry"+ident).show();
			$("#project_text_project"+ident).show();
			$("#project_text_project"+ident).removeAttr("style");
			$("#project_text_project"+ident).removeAttr("width");
			$("#project_text_project"+ident).removeAttr("height");		
			$("#project_text_entry"+ident).removeAttr("width");
			$("#project_text_entry"+ident).removeAttr("height");
			$("#project_text_entry"+ident).removeAttr("style");
		},
		savePostHere: function(data, e) {
               var newP = new Project(data);
				
				var what_to_show = app.getSettingInWhole('defaultEntryViewWhenAdded');
				var thh = this;
				
			//	if(typeof thisProj != "" && typeof app.userData != "undefined" 
	//&& typeof thisProj != "undefined" && typeof thisProj.get != "undefined"
		//		&& thisProj.get("email") != app.userData.email){
			//		newP.set("visibility", "editpublic");
				//}
				
				newP.set("what_to_show", what_to_show);
                var id_to_save = this.id;
				var pid_project = id_to_save;
			var locationPidProj = location.href;
			if (locationPidProj.indexOf("project/") > -1) {
				pid_project = locationPidProj.split("project/")[1];
			}
				
                    if(pid_project === '_'){
                        newP.set('inProjects','');
                        newP.set('hisinproject_this','_');
                    }else{
                        newP.set('inProjects',pid_project);
                        newP.set('hisinproject_this',[pid_project]);
                    }
					var th = this;
					
                newP.save({idd:id_to_save}).done(function(data2){
					var mypro = new Project(data2);
					app.vent.trigger('add:cachedModels:resource', mypro);
					
					if(!data2.isHeader){
						if (typeof th.model != "undefined" && typeof th.model.collection != "undefined") {
							th.setWhichEntriesIsOld(data2, th.model.collection);
						}else{
							if (typeof th.collection != "undefined") {
								th.setWhichEntriesIsOld(data2, th.collection);
							}
						}
					}
					if (typeof th.model.collection.peopleColAdd != "undefined") {
						location.reload();
					}
					th.createNewButton(e);
					th.trigger('project:edit',{addModels: data2});
					th.model.set("onAddModelsGoGo", {addModels: data2, id:data2._id});
				});					
		},
		setWhichEntriesIsOld: function(data, projects){
			var howmanycanbethere = parseInt(app.getSettingInWhole('make_old_when'));
							var how_many = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									how_many++;
								}
							}
							var how_many_should_be_set = how_many-howmanycanbethere;
							var how_many_now_set = 0;
							for(var pr in projects.models){
								if(projects.models[pr].get('inHeader') === data.inHeader && !projects.models[pr].get('isHeader')){
									if(how_many_should_be_set > how_many_now_set){
										projects.models[pr].set('is_old', 'true');
										projects.models[pr].save();
										how_many_now_set++;
									}
								}
							}
		},
		load_more_for_header: function(e){
			e.stopImmediatePropagation();
			e.stopPropagation();
			var th = this;
			var count = e.currentTarget.getAttribute('count');
			var newcnt = parseInt(count)-20;
			if(newcnt < 0){ newcnt = 0; }
			var header_used_numb = this.model.get("header_count_old_numb_used");
			this.model.set("header_count_old_numb", newcnt, {silent: true});
			var count_every_header = new Backbone.Model();
			
			var url_of_entries = '/projectsinlistt_old/';
			var adduseremaill = "";
			if(typeof app.userIsNotLoggedIn !== "undefined" && app.userIsNotLoggedIn){
				url_of_entries = '/projectsinlistt_old/';
			}else{
				if(typeof app.userData != "undefined" && this.model.get("email") == app.userData.email){
					url_of_entries = '/projectsinlistt_old/';
				}else{
					url_of_entries = '/projectsinlistt_old/';
					adduseremaill = "/"+this.model.get("email");
				}
			}
			
			count_every_header.url = templates.urlAddr+url_of_entries+this.model.get('_id')+"/"+header_used_numb+adduseremaill;/* LIMIT - 20 */
			
												count_every_header.fetch().done(function(){
													header_used_numb = header_used_numb+20;
													th.model.set("header_count_old_numb_used", header_used_numb, {silent: true});
													th.trigger('project:edit',{addModels: count_every_header.attributes});
													th.model.set("onAddModelsGoGo", {addModels: count_every_header.attributes, id:this.model.get('_id')});
												}.bind(this));
		},
		sendTriggerProjectEdit: function(){
			this.trigger('project:edit');
		},
		rerenderEverything: function(){
			//this.rerenderTasks();
			var initiateUpdate = this.model.get('initiateUpdate');
			if(typeof initiateUpdate != "undefined" && initiateUpdate != "" && initiateUpdate){
					var fhtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
					var fshared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
					$("#shared_count").text(fshared_in.count);
					$("#friendsHtmlV").html(fhtmlV);
					$("#shared_inHtml").html(fshared_in.html);
					
					var html_files = this.getFilesHtmlAndCount();
					$("#files_count").text(html_files.count);
					$("#htmlfiles_inner").html(html_files.html);
					
					/*var tasksN = this.getTasksView();
					var tasksNumber = this.model.get('tasks').filter(function(e){return e}).length;
					$("#tasksViewAllIn").html(tasksN);
					$("#tasksNumb").text(tasksNumber);*/
					for(var i=0; i < customData.length; i++){
						customData[i].onRerender();
					}
					
					var view_main = this.model.get('view_main');
					$("#view_main_on_project_showing").val(view_main);
					
					var textModel = this.model.get('text');
					$(".textarea_title").val(textModel);
					
					var nameText = this.model.get('name');
					$(".description_textarea").val(nameText);
					
					var colorText = this.model.get('color');
					$(".color_input_data").val(colorText);
					
					var friendsThereText = this.model.get('friendsThere');
					$(".who_is_working_input").val(friendsThereText);
					if($("#text_id"+this.model.get("_id")).find(".project_text_back_main").length){
						$("#text_id"+this.model.get("_id")).find(".project_text_back_main").text(this.model.get("text"));
					}else{
						$("#text_id"+this.model.get("_id")).text(this.model.get("text"));
					}
					var dataNameTextHere = this.model.get("name");
					var isithtml = true;
					if(!$("#text_id_article"+this.model.get("_id")).hasClass("itswholename")){
						dataNameTextHere = this.model.get("name").replace(/<[^>]*>/g, "").substring(0,250);
						isithtml = false;
					}
					
					if($("#text_id_article"+this.model.get("_id")).find(".project_text_back_main").length){
						if(isithtml){
							$("#text_id_article"+this.model.get("_id")).find(".project_text_back_main").html(dataNameTextHere);
						}else{
							$("#text_id_article"+this.model.get("_id")).find(".project_text_back_main").text(dataNameTextHere);
						}
					}else{
						if(isithtml){
						$("#text_id_article"+this.model.get("_id")).html(dataNameTextHere);
						}else{
						$("#text_id_article"+this.model.get("_id")).text(dataNameTextHere);
						}
					}
					
					if(typeof friendsThereText != "undefined" && friendsThereText != ""){
						var get_okkk = "";
						var split_friends = friendsThereText.split(",");
							for(var ij=0; ij < split_friends.length;ij++){
								var ofriend = split_friends[ij];
									get_okkk += '<div class="friendInProjectMini">'+ofriend+'</div>';
							}
						$("#friendsInThisProjects"+this.model.get("_id")).html(get_okkk);
					}else{
						$("#friendsInThisProjects"+this.model.get("_id")).html("");
					}
					if(!$("#project_"+this.model.get("_id")).hasClass("showcaseproject")){
						$("#project_"+this.model.get("_id")).css("background",this.model.get("color"));
					}else{
						if($("#project_"+this.model.get("_id")).attr("style").indexOf("url") > -1){
							$("#project_"+this.model.get("_id")).find(".project_text_back_main").css("color",this.model.get("color"));
						}else{
							$("#project_"+this.model.get("_id")).css("background",this.model.get("color"));
						}
					}
					var files_in_pro_html = "";
					var class_id = ".files_container_for_the_entr_project"+this.model.get("_id");
					var files_on_there = this.getFilesShownHtm();
						$(class_id).html(files_on_there);
						$(".files_images_show").click(this.onprojectsImageView.bind(this));
					this.model.set('initiateUpdate', false);
					//$("#viewsAdded .viewButtonsInSelected").trigger("click");
			}
		},
		getFilesShownHtm: function(){
			var return_html_fil = "";
			var files_show = this.model.get("files_show");
			var _id = this.model.get("_id");
			 if(typeof files_show != "undefined" && files_show != "") {
			return_html_fil += '<div class="files_images_show" identity="'+_id+'">';
			return_html_fil += '<div class="absolute_comments_count_on_img_show">';
				return_html_fil += '<div class="comments_on_count_data"><div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div></div>';
			return_html_fil += '</div>';
			
			var split_files_show = files_show.split(",");
			for(var ii=0; ii < split_files_show.length; ii++){
				var offile = split_files_show[ii];
				if(typeof offile.split(";")[0] != "undefined" && offile.split(";")[0] != ""){
					var was_used_that_file = false;
					if(offile.split(";")[0].split(".").length > 1 && (offile.split(";")[0].split(".")[1].toLowerCase() === "jpg" || offile.split(";")[0].split(".")[1].toLowerCase() === "png" || offile.split(";")[0].split(".")[1].toLowerCase() === "gif")){
						was_used_that_file = true;
						return_html_fil += '<img src="'+this.model.get("filesurl")+'/files/project_managing_files/'+ _id + '/'+ offile.split(";")[0] +'" alt="" />';
					}
					if(offile.split(";")[0].split(".").length > 1 && (offile.split(";")[0].split(".")[1].toLowerCase() === "mp4" || offile.split(";")[0].split(".")[1].toLowerCase() === "ogg" || offile.split(";")[0].split(".")[1].toLowerCase() === "webm")){
						was_used_that_file = true;
						return_html_fil += '<video controls>';
						return_html_fil += '<source src="'+this.model.get("filesurl")+'/files/project_managing_files/'+_id+'/'+ offile.split(";")[0] +'" type="video/'+ offile.split(";")[0].split(".")[1] +'">';
						return_html_fil += 'Your browser does not support the video tag.';
						return_html_fil += '</video>';
					}
					if(offile.split(";")[0].split(".").length > 1 && (offile.split(";")[0].split(".")[1].toLowerCase() === "mp3")){
						was_used_that_file = true;
						return_html_fil += '<audio controls>';
						return_html_fil += '  <source src="'+this.model.get("filesurl")+'/files/project_managing_files/'+ _id +'/'+ offile.split(";")[0] +'" type="audio/mpeg">';
						return_html_fil += 'Your browser does not support the audio element.';
						return_html_fil += '</audio>';
					}
					if(offile.split(";")[0].split(".").length > 1 && (offile.split(";")[0].split(".")[1].toLowerCase() === "wav")){
						was_used_that_file = true;
					return_html_fil += '<audio controls>';
					 return_html_fil += ' <source src="'+this.model.get("filesurl")+'/files/project_managing_files/'+ _id +'/'+ offile.split(";")[0] +'" type="audio/wav">';
					return_html_fil += 'Your browser does not support the audio element.';
					return_html_fil += '</audio>';
					}
					if(!was_used_that_file){
					 return_html_fil += '<div class="download_entry_file_in">';
					 return_html_fil += '<a href="'+this.model.get("filesurl")+'/files/project_managing_files/'+ _id +'/'+ offile.split(";")[0] +'">'+ offile.split(";")[0] +'</a>';
					 return_html_fil += '</div>';
					}
				}
			}
			return_html_fil += '</div>';
		 }
		 return return_html_fil;
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
		},
        onpprojectMain: function(e){
			if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
            if(this.model.get('isHeader')){
                return;
            }
			if (e.currentTarget.getAttribute('datasave') === "yes") {
				var valofd = $('#updateTextForEntry'+this.model.get('_id')).val();
				this.model.set('text',valofd);
				this.model.save();
				$('#gotextofentrymain'+this.model.get('_id')).show();
				$('#entryjustedit'+this.model.get('_id')).hide();
				return;
			}
			
				if(this.model.get('isProject')){
					if (this.model.get("email") != app.userConnected.data2.email) {
						window.location = '#/project/'+this.model.get('_id')+"/"+this.model.get("email");
					}else{
						window.location = '#/project/'+this.model.get('_id');
					}
				}else{
					this.model.set('id', this.model.get('_id'));
					var myModel = this.model;
					
					if (typeof this.model.get("vm_data") !== "undefined" && this.model.get("vm_data") !== "") {
						this.editDialog(myModel);
					}else{
						$('#gotextofentrymain'+this.model.get('_id')).hide();
						$('#entryjustedit'+this.model.get('_id')).show();
					}
					//window.location = '#/entry/'+this.model.get('_id');
				}
			e.stopImmediatePropagation();
			e.stopPropagation();
            }
        },
        onprojectsEdit: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                var myModel = this.model;
                this.editDialog(myModel);
				e.stopImmediatePropagation();
				e.stopPropagation();
            }
        },
        onprojectsImageView: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
				if(this.model.get('isProject')){
					var pgo = "";
					var userspath = "";
					if (typeof window.app.userConnected != "undefined" && typeof window.app.userConnected.data2 != "undefined") {
						pgo = window.app.userConnected.data2.email;
					}
					if (pgo != this.model.get('email')) {
						userspath = "/"+this.model.get('email');
					}
					window.location = '#/project/'+this.model.get('_id')+userspath;
				}else{
					this.model.set('id', this.model.get('_id'));
					var myModel = this.model;
					this.showImageAndOtherMultimedia(myModel);
					//window.location = '#/entry/'+this.model.get('_id');
					e.stopImmediatePropagation();
					e.stopPropagation();
				}
            }
        },
		setCommentsColData: function(){
			if(typeof this.commentsCol == "undefined"){
				app.CurrentCommentsView = this;
				var commentsCol = app.getCommentsCol(this.model.get('_id'));
				if(commentsCol === ''){
					commentsCol = new Project();
					app.vent.trigger('add:cachedComments:resource', {_id:this.model.get('_id'),data: commentsCol});
					commentsCol.url = config.urlAddr+'/comments/'+this.model.get('_id')+'/'+0;
				}
				this.commentsCol = commentsCol;
			}
		},
		load_everything_more_real_comments: function(e){
			e.stopImmediatePropagation();
			e.stopPropagation();
			var dataOf_loaded_real = this.commentsCol.get('messages');
			var skip_count = dataOf_loaded_real.length;
			var commentsCol_load_real = new Backbone.Model();
			commentsCol_load_real.url = config.urlAddr+'/comments/'+this.model.get("_id")+'/'+skip_count;
			var eh_model_th = this;
			commentsCol_load_real.fetch().done(function(){
				var hist_col = commentsCol_load_real.get("messages");
					for(var ij=0; ij < hist_col.length; ij++){
						dataOf_loaded_real.push(hist_col[ij]);
					}
				eh_model_th.rerenderComments();
			});
		},
		countNumberOfCommentsRealComments: function(commentsCol){
			var commentsColllReal = new Backbone.Model();
			commentsColllReal.url = config.urlAddr+'/countByUsername/'+this.model.get("_id");
			if(typeof commentsCol.get("comm_count_sended_load") == "undefined" || commentsCol.get("comm_count_sended_load") == ""){
				commentsCol.set("comm_count_sended_load","true");
				var eh_model_th = commentsCol;
				var eh_model_th_out = this;
				eh_model_th.set("real_comm_info_only_is_comment_count", 0);
				commentsColllReal.fetch().done(function(){
					if(typeof commentsColllReal.attributes[0] !== "undefined"){
						var countAttr = commentsColllReal.attributes[0].numberOfMessages;
						eh_model_th.set("real_comm_info_only_is_comment_count", countAttr);
						eh_model_th_out.rerenderComments();
					}
				});
			}
		},
		commentReplyItHere: function(e){
			var commentDate = e.currentTarget.getAttribute('data-date');
			var th = this;
			var idOf = th.commentsCol.get('_id');
			var comments = $('#commentAddminiTimeLineViewReply'+th.model.get("_id")+commentDate.replace(/ /g,'').replace(/:/g,'')).val();
			if(comments != ''){
				th.addComment(comments, idOf, commentDate);
			}
			$('#commentAddminiTimeLineViewReply'+th.model.get("_id")+commentDate.replace(/ /g,'').replace(/:/g,'')).val('');			
		},
		commentAnswerItHere: function(e){
			var commentDate = e.currentTarget.getAttribute('data-date');
			$("#replyingToWhat"+this.model.get("_id")+commentDate.replace(/ /g,'').replace(/:/g,'')).toggleClass("replyingtextToCommentShow");
		},
		commentLikeItHere: function(e){
				var commentDate = e.currentTarget.getAttribute('data-date');
				$(e.currentTarget).remove();
				var commentNew = new Project();
				commentNew.set('datelike',commentDate);
				commentNew.set('id',this.commentsCol.get('_id'));
				commentNew.set('taskid',this.model.get('_id'));
				commentNew.url = config.urlAddr+'/comment';
				commentNew.save();
				var msgs = this.commentsCol.get('messages');
				var addlikedme = { likeloaded: false, em: app.userConnected.data2.email, nm: app.userConnected.data2.firstname+" "+app.userConnected.data2.lastname };
				
				for(var i = msgs.length - 1; i >= 0; i--){
					if(msgs[i].date === commentDate) {
						var canaddlik = true;
						if (typeof msgs[i].likes == "undefined") {
							msgs[i].likes = [];
						}
						for (var inn=0; inn < msgs[i].likes.length; inn++) {
							if (msgs[i].likes[inn].em == addlikedme.em) {
								canaddlik = false;
							}
						}
						if (canaddlik) {
							msgs[i].countlikes = 1;
							msgs[i].liked = true;
							msgs[i].likes.push(addlikedme);
						}
					}
				}
		},
		setlikesHere: function(likes) {
			var datad = "";
			for (var i=0, n=likes.length; i < n; i++) {
				var imgus = '<div class="commenthereGohere likesDialogViewContainer"><div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+likes[i].em+'/'+likes[i].em+'.jpg" alt=""></div><div class="commentInModal likesDialogView">'+likes[i].nm+'</div></div>';
				datad += "<div class='bottomBorder1'><a href='#"+likes[i].em+"'>"+imgus+"</a></div>";
			}
			return datad;
		},
		commentShowLikesDialog: function(e){
			var commentDate = e.currentTarget.getAttribute('data-date');
			var msgs = this.commentsCol.get('messages');
			var th = this;
			var fndmsg = "";
			for(var i = msgs.length - 1; i >= 0; i--){
				if(msgs[i].date === commentDate) {
					fndmsg = msgs[i];
				}
			}
			
			if (fndmsg != "") {
				var likes = fndmsg.likes;
				if (fndmsg.countlikes > 0){
					var datad = "<div><div class='likescontainerforcomm'>";
					datad += this.setlikesHere(likes)+"</div>";
					if (fndmsg.countlikes > likes.length) {
						datad += "<button class='btn btn-default loadmoreCommentsHere loadmorehereindialog'>Load more</button>";
					}
					datad += "</div>";
					app.showSimpleDialog({loadmorehereindialog: function(e) {
					var removeone = 0;
					
					for (var ii=0, nn = fndmsg.likes.length; ii < nn; ii++) {
						if (typeof fndmsg.likes[ii].likeloaded != "undefined" && fndmsg.likes[ii].likeloaded) {
							removeone = 1;
						}
					}
					
					var commdate = commentDate.replace(/ /g, "_");
					var lengthrem = fndmsg.likes.length - removeone;
					
						$.ajax({
						  method: "GET",
						  url: "/comments/"+th.commentsCol.get("_id")+"/0/"+commdate+"/"+lengthrem,
						  contentType: 'application/json; charset=utf-8',
						  dataType: 'json'
						}).always(function (msg) {
							var addingarr = [];
							if (typeof msg.messages != "undefined" && msg.messages.length > 0) {
								for (var ii=0; ii < msg.messages[0].likes.length; ii++) {
									var canadd = true;
									
									for (var jj=0; jj < fndmsg.likes.length; jj++) {
										if (fndmsg.likes[jj].em == msg.messages[0].likes[ii].em) {
											canadd = false;
											fndmsg.likes[jj].likeloaded = true;
										}
									}
									if (canadd) {
										addingarr.push(msg.messages[0].likes[ii]);
									}
								}
								
								fndmsg.likes = fndmsg.likes.concat(addingarr);
								var datad = th.setlikesHere(fndmsg.likes);
								$(".likescontainerforcomm").html(datad);
								
								if (fndmsg.countlikes <= fndmsg.likes.length) {
									$(".loadmorehereindialog").hide();
								}
							}
						}.bind(this));
					},message:datad, title: fndmsg.message, icon:""});
				}
			}
		},
		listenToRemoveCommentTime: function(e){
			$('.removeComment').unbind();
			$('.commentShowLikesHere').click(function(e){
				this.commentShowLikesDialog(e);
			}.bind(this));
			$('.commentLikeIt').click(function(e){
				this.commentLikeItHere(e);
			}.bind(this));
			$('.commentAnswerIt').click(function(e){
				this.commentAnswerItHere(e);
			}.bind(this));
			$('.replyButtonHere').click(function(e){
				this.commentReplyItHere(e);
			}.bind(this));
			$('.removeComment').click(function(e){
				var commentDate = e.currentTarget.getAttribute('data-date');

				var commentNew = new Project();
				commentNew.set('date',commentDate);
				commentNew.set('id',this.commentsCol.get('_id'));
				commentNew.set('taskid',this.model.get('_id'));
				commentNew.url = config.urlAddr+'/comment';
				commentNew.save();
				var msgs = this.commentsCol.get('messages');
				for(var i = msgs.length - 1; i >= 0; i--){
					if(msgs[i].date === commentDate) {
					   msgs.splice(i, 1);
					   $('#commentUnId'+commentDate.replace(/ /g,'').replace(/:/g,'')).remove();
					   var numbC = parseInt($('#commentsNumb').html());
					   $('#commentsNumb').html(numbC-1);
					}
				}
				
			}.bind(this));
		},
		getAllCommentsAndAdd: function(){
            var th = this;
			this.timelineCommentsAdded = true;
			var historyVisible = false;
			var commentsVisible = true;
			app.CurrentCommentsView = this;
			var commentHtml = '';
			var commentsCol = app.getCommentsCol(this.model.get('_id'));
			if(commentsCol === ''){
				commentsCol = new Project();
				app.vent.trigger('add:cachedComments:resource', {_id:this.model.get('_id'),data: commentsCol});
				commentsCol.url = config.urlAddr+'/comments/'+this.model.get('_id')+'/'+0;
			}
			this.commentsCol = commentsCol;
				commentsCol.fetch().done(function(){
					var comments = commentsCol.get('messages');
					var getCommObj = th.getCommentsHistoryObj(comments);
					var commHtml = getCommObj.commHtml;
					var commCount = getCommObj.commCount;
					commentHtml = commHtml;
					setTimeout(function(){
						$('#comments_edit_view').html(app.translate('Comments ')+'(<span id="commentsNumb">'+commCount+'</span>)');
						$('#commentsOfTime'+th.model.get("_id")).html(commHtml);
					}.bind(this), 200);

					setTimeout(function(){
						th.listenToRemoveCommentTime(th);
					}.bind(this), 200);
				}.bind(this));
		},
		rerenderComments: function(){
			if (this.timelineCommentsAdded) {
				this.getAllCommentsAndAdd();
			}
			for(var i=0; i < customData.length; i++){
				customData[i].onRender();
			}
			setTimeout(function(){
				$(".modal-dialog").show();
				if(config.use_tinymce_editor){
					tinymce.remove("#name");
					$(".mce-tinymce").remove();
					tinymce.init({
						selector:'#name',
						   setup : function(ed) {
								  ed.on('change', function(e) {
									$(".mce-statusbar .mce-container-body").addClass("red_background_tiny_mce");
									$(".mce-toolbar-grp").addClass("red_background_tiny_mce");
								  });
						   }
					});
					$(".mce-tinymce").attr("style","");
					
				}
			}, 100);
			var commentsCol = this.commentsCol;
			this.countNumberOfCommentsRealComments(commentsCol);
				commentsCol.fetch().done(function(){
					setTimeout(function(){
						var comments = this.commentsCol.get('messages');
						var getCommObj = this.getCommentsHistoryObj(comments);
						var commHtml = getCommObj.commHtml;
						var historyHtml = getCommObj.historyHtml;
						var commCount = getCommObj.commCount;
						var historyyCount = getCommObj.historyyCount;
						var canAddComment = false;
						if(this.model.get("parentvisibility") == "editcommentfriends" || this.model.get("parentvisibility") == "friends" || this.model.get("parentvisibility") == "editfriends" ||
						this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate" || this.model.get("parentvisibility") == "editcommentprivate" || this.model.get("parentvisibility") == "editcommentpublic"){
							if(typeof app.userIsNotLoggedIn == "undefined" || !app.userIsNotLoggedIn){
								canAddComment = true;
							}
						}
						
						$("#history_count").html(" (<span id='history_count_inner'>"+historyyCount+"</span>)");
						$("#comments_count").html(" (<span id='comments_count_inner'>"+commCount+"</span>)");
						/*$('#historyOfT').html(historyHtml);*/
						//$('#comments_inner_all').html(commHtml);
						if(commHtml != ""){
							$('#comments_inner_all').html(commHtml);
						}else{
							$('#comments_inner_all').html(app.noRecordsInIt());
						}
						if(historyHtml != ""){
							$('.history_info_view').html(historyHtml);
						}else{
							$('.history_info_view').html(app.noRecordsInIt());
						}
						var button_for_loading_more = "";
						var dataNumber = 0;
						if(typeof this.commentsCol != "undefined"){
							 if(typeof this.commentsCol.get("real_comm_info_only_is_comment_count") != "undefined" && !isNaN(this.commentsCol.get("real_comm_info_only_is_comment_count"))){
								 dataNumber = this.commentsCol.get("real_comm_info_only_is_comment_count");
								 $("#comments_count").html(" (<span id='comments_count_inner'>"+dataNumber+"</span>)");
										var dataOf_loaded = comments;
										var cnt_every = dataNumber-dataOf_loaded.length;
										if(cnt_every > 0){
											button_for_loading_more = "<button class='load_everything_more_real_comments'>Load more</button> Loaded - "+dataOf_loaded.length+". Not loaded - "+cnt_every;
										}
									
							 }
						}
						
						var writeAComment = button_for_loading_more+'<div style="clear:both;"></div>';
						if(canAddComment){
							writeAComment += '<div>';
							writeAComment += '<textarea class="commentsWidthAll" id="commentAddminiEditView"></textarea>';
							writeAComment += '</div>';
							writeAComment += '<div>'+this.friendsHtmlVNotifyWhich(app.userConnected.data2.friends)+'</div>';
							writeAComment += '<div><button class="buttonChange general_button" id="commentSubmitminiEditView" data-pid="'+commentsCol.get('_id')+'">'+app.translate('Add comment')+'</button></div>';
						}
						
						$('#comments_add_more').html(writeAComment);
						$(".load_everything_more_real_comments").click(this.load_everything_more_real_comments.bind(this));
						$(".modal-dialog").show();
					}.bind(this), 0);
					
				}.bind(this));
		},
		escapeHtml: function(unsafe) {
			if(typeof unsafe != "undefined"){
			return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
		 }else{
			 return unsafe;
		 }
		},
		getTimeNow: function(){
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var seconds = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(seconds<10){
					seconds='0'+seconds
				} 
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+seconds;
				return today;
		},
		setorRemoveButtonChangeActiveClass: function(id){
			var hasClass = $(id).hasClass('buttonChangeActive');
			$('.buttonChange').removeClass('buttonChangeActive');
			if(!hasClass){
				$(id).addClass('buttonChangeActive');
			}
		},
		getCommentsHistoryObj: function(comments){
					var commHtml = '';
					var historyHtml = '';
					var commCount = 0;
					var historyyCount = 0;
					var canRemoveComments = false;
					if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
						canRemoveComments = true;
					}
					if (typeof comments.gotReversed == "undefined") {
						comments.reverse();
						comments.gotReversed = true;
					}
					
					var newCommArr = [];
					for(var i=0; i < comments.length; i++){
						comments[i].addedRep = [];
					}
					
					var newArr = [];
					
					for(var i=0; i < comments.length; i++) {
						for (var jj=0, n=comments.length; jj < n; jj++) {
							if (typeof comments[jj].date != 'undefined' 
							&& comments[jj].date == comments[i].reply) {
								comments[jj].addedRep.push(comments[i]);
							}
						}
					}
					
					for(var i=0; i < comments.length; i++) {
						if (typeof comments[i].reply == "undefined" || comments[i].reply == "") {
							newArr.push(comments[i]);
						}
					}
					
					for(var i=0; i < comments.length; i++){
						if(typeof comments[i].message != 'undefined' && 
						comments[i].message.indexOf('hhhhistoryyy') > -1){
							historyyCount++;
							var msgComm = comments[i].message.replace(/hhhhistoryyy/g,'');
							historyHtml+= '<div class="commentInModal" id="commentUnId'+comments[i].date.replace(/ /g,'').replace(/:/g,'')+'"><b>'+this.escapeHtml(comments[i].from+': ')+'</b>'+this.escapeHtml(msgComm)+'</div>';
						}else{
							if (typeof comments[i].reply == "undefined" || comments[i].reply == "") {
								commHtml+= this.getCommentString(comments[i], canRemoveComments, comments);
							}
							commCount++;
							for (var jj=0; jj < comments[i].addedRep.length; jj++) {
								commHtml+= this.getCommentString(comments[i].addedRep[jj], canRemoveComments, comments[i]);
								commCount++;
							}
						}
					}
					return {commHtml:commHtml, historyHtml:historyHtml,commCount:commCount,historyyCount:historyyCount };
		},
		getCommentString: function(comments, canRemoveComments, commentParent){
			var strRet = "";
			if(typeof comments.date != 'undefined'){
				var removeComm = '<button data-date="'+comments.date+'" class="removeComment"><span data-date="'+comments.date+'" class="glyphicon glyphicon-remove"></span> Remove</button>';/*background_comment*/
				var emMine = this.escapeHtml(comments.from.split(";")[0]+': ');
				var its_mine_comm = false;
				var addImageOfPerson = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+this.model.get("email")+'/'+this.model.get("email")+'.jpg" alt=""></div>';

				if(comments.from.split(";").length > 1){ 
					var splitCommFEmail = comments.from.split(";")[1];
					addImageOfPerson = '<div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+splitCommFEmail+'/'+splitCommFEmail+'.jpg" alt=""></div>';

					emMine = "<a href='/#"+splitCommFEmail+"'>"+this.escapeHtml(comments.from.split(";")[0]+': ')+"</a>"; 
						if(typeof app.userConnected.data2 != "undefined" && splitCommFEmail === app.userConnected.data2.email){ its_mine_comm = true; } 
				}
				if(!canRemoveComments && !its_mine_comm){
					removeComm = "";
				}

				var addtextArr = '<textarea class="commentsWidthAllTime" id="commentAddminiTimeLineViewReply'+this.model.get("_id")+comments.date.replace(/ /g,'').replace(/:/g,'')+'"></textarea>';
				var buttonToAddText = '<button class="replyButtonHere" data-date="'+comments.date+'">Reply</button>';
				var addTextareaHer = "<div class='replyingtextToComment' id='replyingToWhat"+this.model.get("_id")+comments.date.replace(/ /g,'').replace(/:/g,'')+"'>"+addtextArr+buttonToAddText+"</div>";

				var likes = "";
				var likesArr = [];
				
				if (typeof comments.likes != "undefined" && comments.likes.length > 0) {
					likes = "("+comments.countlikes+")";
					var dropd = '';
					dropd  += '<button data-date="'+comments.date+'" class="commentShowLikesHere" type="button">';
					dropd  += app.translate('Likes')+' '+"("+comments.countlikes+")";
					dropd  += '  </button>';
					dropd  += '';
					likes = dropd;
					likesArr = comments.likes;
				}
				
				var likeButt = '<button data-date="'+comments.date+'" class="commentLikeIt"><span data-date="'+comments.date+'" class="glyphicon glyphicon-hand-left"></span> Like</button> '+likes+"";
				var answButt = '<button data-date="'+comments.date+'" class="commentAnswerIt"><span data-date="'+comments.date+'" class="glyphicon glyphicon-comment"></span> Reply</button>';

				for (var iij=0; iij < likesArr.length; iij++){
					if (typeof app.userConnected.data2 != "undefined" && likesArr[iij].em == app.userConnected.data2.email){
						likeButt = likes;
					}
				}
				
				if (typeof comments.liked != "undefined" && comments.liked) {
					likeButt = likes;
				}
				if (typeof app.userConnected.data2 == "undefined" || app.userConnected.data2.email == "_" || app.userConnected.data2.email == "") {
					likeButt = likes;
					answButt = "";
				}
				var addlikingAndAns = "<div class='likeAnswerCom'>"+likeButt+answButt+removeComm+"<div class='fontsize10 commentHereTimeRight'>"+this.makeDateString(comments.date)+"</div>"+"</div>";
				
				var leftmargin = "";
				if (typeof comments.reply == "undefined" || comments.reply == "") {
					comments.movereply = 1;
				}else{
					if (typeof commentParent.reply == "undefined" || commentParent.reply == "") {
						comments.movereply = 1;
						leftmargin = "style='margin-left:"+(25*comments.movereply)+"px;'";
					}else{
						if (typeof commentParent.movereply != "undefined") {
							comments.movereply = commentParent.movereply+1;
						}else{
							comments.movereply = 1;
						}
						leftmargin = "style='margin-left:"+(25*comments.movereply)+"px;'";
					}
				}
				
				strRet = '<div '+leftmargin+' class="commenthereGohere" id="commentUnId'+comments.date.replace(/ /g,'').replace(/:/g,'')+'">'+addImageOfPerson+"<div class='commentInModal'>"+'<b>'+emMine+'</b>'+this.escapeHtml(comments.message)+addlikingAndAns+addTextareaHer+'<div style="clear:both;"></div></div></div>';
			}
			return strRet;
		},
		makeDateString: function(dateSel) {
			var retDate = "";
			var currentDay = "";
			var utcToday = new Date().toJSON().slice(0,10).replace(/-/g,'/').split("/");
			
			var dateHere = dateSel.split(" ");
			var timee = dateHere[3].split(":");
			retDate = dateHere[0]+"/"+dateHere[1]+"/"+dateHere[2]+" at "+timee[0]+":"+timee[1];
			
			if (utcToday[2] == dateHere[2]) {
				retDate = timee[0]+":"+timee[1];
			}
			
			
			return retDate;
		},
		listenToRemoveComment: function(e){
						//$('.removeComment').unbind();
						//$('.removeComment').click(function(e){
							var commentDate = e.currentTarget.getAttribute('data-date');

							var commentNew = new Project();
							commentNew.set('date',commentDate);
							commentNew.set('taskid',this.model.get('_id'));
							commentNew.set('id',this.commentsCol.get('_id'));
							commentNew.url = config.urlAddr+'/comment';
							commentNew.save();
							var msgs = this.commentsCol.get('messages');
							for(var i = msgs.length - 1; i >= 0; i--){
								if(msgs[i].date === commentDate) {
								   msgs.splice(i, 1);
								   $('#commentUnId'+commentDate.replace(/ /g,'').replace(/:/g,'')).remove();
								   var numbC = parseInt($('#comments_count_inner').html());
								   var numbEx = numbC-1;
								   $('#comments_count_inner').text(numbEx);
								   var commentsCountNow = 0;
								   if(!isNaN(parseInt(this.model.get('comments_count')))){
									    commentsCountNow = parseInt(this.model.get('comments_count'))-1;
										if(commentsCountNow < 0){ commentsCountNow = 0; }
								   }
								}
							}
							app.emitMessage('commentSend',{removethis:true, _id: this.model.get('_id'), date: commentDate});
						//}.bind(this));
		},
		getPermissionsHtmlSelection: function(){
			var visible_to_all = "";
			var visible_to_all_edit = "";
			var visible_to_none = "";
			var visible_to_none_edit = "";
			var visible_to_none_comment_edit = "";
			var visible_to_all_comment = "";
			
			var friends_comments_id = "";
			var friends_publ_id = "";
			var friends_edit_id = "";
			var notOnHover = " visibility_perm_desc_not_hover";
			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate" 
			 || this.model.get("parentvisibility") == "editfriends"){
				visible_to_all = "visible_to_all";
				visible_to_all_edit = "visible_to_all_edit";
				visible_to_none = "visible_to_none";
				visible_to_none_edit = "visible_to_none_edit";
				visible_to_none_comment_edit = "visible_to_none_comment_edit";
				visible_to_all_comment = "visible_to_all_comment";
				
				friends_comments_id = "friends_comments_id";
				friends_publ_id = "friends_publ_id";
				friends_edit_id = "friends_edit_id";
				notOnHover = "";
			}
			var publicV = "";
			var publicVEdit = "";
			var privateV = "";
			var privateVEdit = "";
			var privateVCoomentEdit = "";
			var publicVCoomentEdit = "";
			
			var friendsComm = "";
			var friendsPubl = "";
			var friendsPrivat = "";
			var sel = "private";
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "public"){ sel = "public"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editpublic"){ sel = "editpublic"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editprivate"){ sel = "editprivate"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editcommentprivate"){ sel = "editcommentprivate"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editcommentpublic"){ sel = "editcommentpublic"; }
			
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editcommentfriends"){ sel = "editcommentfriends"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "friends"){ sel = "friends"; }
			if(typeof this.model.get("visibility") != "undefined" && this.model.get("visibility") == "editfriends"){ sel = "editfriends"; }
			
			if(sel == "public"){ publicV = "visibility_perm_descSelected"; }
			if(sel == "editpublic"){ publicVEdit = "visibility_perm_descSelected"; }
			if(sel == "editprivate"){ privateVEdit = "visibility_perm_descSelected"; }
			if(sel == "private"){ privateV = "visibility_perm_descSelected"; }
			if(sel == "editcommentpublic"){ publicVCoomentEdit = "visibility_perm_descSelected"; }
			if(sel == "editcommentprivate"){ privateVCoomentEdit = "visibility_perm_descSelected"; }
			
			if(sel == "editcommentfriends"){ friendsComm = "visibility_perm_descSelected"; }
			if(sel == "friends"){ friendsPrivat = "visibility_perm_descSelected"; }
			if(sel == "editfriends"){ friendsPubl = "visibility_perm_descSelected"; }
			
			var permSelc = "<div>";
			permSelc += "<div class='visibility_perm_desc "+publicV+notOnHover+"' id='"+visible_to_all+"'><h3>"+app.translate('Public (comments disabled)')+"</h3><p>"+app.translate('It is seen to everyone that has a link in readonly mode.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+publicVEdit+notOnHover+"' id='"+visible_to_all_edit+"'><h3>"+app.translate('Public (edit post)')+"</h3><p>"+app.translate('It is seen to everyone that has a link in edit mode for those who is logged in.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+publicVCoomentEdit+notOnHover+"' id='"+visible_to_all_comment+"'><h3>"+app.translate('Public')+"</h3><p>"+app.translate('It is seen to everyone that has a link and can only write comments.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+privateV+notOnHover+"' id='"+visible_to_none+"'><h3>"+app.translate('Private (comments disabled)')+"</h3><p>"+app.translate('Only people added to the board can view it in readonly mode.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+privateVEdit+notOnHover+"' id='"+visible_to_none_edit+"'><h3>"+app.translate('Private (edit post)')+"</h3><p>"+app.translate('Only people added to the board can view and edit it.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+privateVCoomentEdit+notOnHover+"' id='"+visible_to_none_comment_edit+"'><h3>"+app.translate('Private')+"</h3><p>"+app.translate('Only people added to the board can view and add comments only.')+"</p></div>";

			permSelc += "<div class='visibility_perm_desc "+friendsComm+notOnHover+"' id='"+friends_comments_id+"'><h3>"+app.translate('Friends')+"</h3><p>"+app.translate('Post can be seen by friends and they can add comments.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+friendsPrivat+notOnHover+"' id='"+friends_publ_id+"'><h3>"+app.translate('Friends (comments disabled)')+"</h3><p>"+app.translate('Post can be seen by friends but they cannot add comments.')+"</p></div>";
			permSelc += "<div class='visibility_perm_desc "+friendsPubl+notOnHover+"' id='"+friends_edit_id+"'><h3>"+app.translate('Friends (edit post)')+"</h3><p>"+app.translate('Post can be seen by friends and they can add comments and edit post.')+"</p></div>";
			permSelc += "</div>";
			return permSelc;
		},
		getEditDialogWindowHtmlRightModal: function(){
			var permissionsButtonOn = "";
			var htmlOfPersonWhoCreated = "<a href='/#"+this.model.get("email")+"'>"+this.model.get("email")+"</a> ";
			if(typeof app.userData != "undefined" && this.model.get("email") == app.userData.email){
				permissionsButtonOn = '<button id="permissions_info_view" class="right_model_menu"><div class="glyphicon glyphicon-eye-open icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Visibility')+'</button>';
			}
			var customButtons = "";
			for(var i=0; i < customData.length; i++){
				customButtons += customData[i].buttonHtml(this.model);
			}
			var customInnerHtml = "";
			for(var i=0; i < customData.length; i++){
				customInnerHtml += customData[i].innerHtml();
			}
			var myModel = this.model;
			myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
			var projectItIsHtml = "";
			var projectItIsHtmlSelection = "";
			var headerItIsHtml = "";
			
			var whatToShow = myModel.get('what_to_show');
			var whatToShowHtml = "<div class='whatToShowHere'><div class='hereAboutTop'>What to Show</div><div>";
				whatToShowHtml += '<select class="modalTextareaMine modalSelectAreaMin" id="what_to_show">';
				if(whatToShow === "all"){
					whatToShowHtml += '<option value="all" selected>'+app.translate("All")+'</option>';
				}else{
					whatToShowHtml += '<option value="all">'+app.translate("All")+'</option>';
				}
				if(whatToShow === "comments"){
					whatToShowHtml += '<option value="comments" selected>'+app.translate("Only comments")+'</option>';
				}else{
					whatToShowHtml += '<option value="comments">'+app.translate("Only comments")+'</option>';
				}
				if(whatToShow === "nothing"){
					whatToShowHtml += '<option value="nothing" selected>'+app.translate("Nothing")+'</option>';
				}else{
					whatToShowHtml += '<option value="nothing">'+app.translate("Nothing")+'</option>';
				}
				whatToShowHtml += '</select></div></div>';
			
			var entryItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/entry/'+this.model.get("_id")+'"><span class="glyphicon glyphicon-arrow-right"></span></a>';
			if(this.model.get("isProject")){
				projectItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/project/'+this.model.get("_id")+'"><span style="" class="glyphLink glyphicon glyphicon-list-alt"></span></a>';
				projectItIsHtmlSelection = '<div class="whatToShowHere"><div class="hereAboutTop">View</div><div>';
				var mainViewItIsoNproj = myModel.get("view_main");
				projectItIsHtmlSelection += '<select class="modalTextareaMine modalSelectAreaMin" id="view_main_on_project_showing">';
				projectItIsHtmlSelection += '<option value="board_view_show">'+app.translate("Board view")+'</option>';
				for(var i=0; i < projectView.length; i++){
					if(mainViewItIsoNproj === projectView[i].id){
						projectItIsHtmlSelection += '<option selected value="'+projectView[i].id+'">'+app.translate(projectView[i].name)+'</option>';
					}else{
						projectItIsHtmlSelection += '<option value="'+projectView[i].id+'">'+app.translate(projectView[i].name)+'</option>';
					}
				}
				projectItIsHtmlSelection += '</select></div></div>';
			}
			if(this.model.get("isHeader")){
				headerItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/projectsinlist/'+this.model.get("_id")+'/_"><span style="" class="glyphLink glyphicon glyphicon-equalizer"></span></a>';
				var mainViewItIsoNproj = myModel.get("view_main");
				headerItIsHtml += '<select class="modalTextareaMine modalSelectAreaMin" id="view_main_on_project_showing">';
				headerItIsHtml += '<option value="board_view_show">'+app.translate("Board view")+'</option>';
				for(var i=0; i < listView.length; i++){
					if(mainViewItIsoNproj === listView[i].id){
						headerItIsHtml += '<option selected value="'+listView[i].id+'">'+app.translate(listView[i].name)+'</option>';
					}else{
						headerItIsHtml += '<option value="'+listView[i].id+'">'+app.translate(listView[i].name)+'</option>';
					}
				}
				headerItIsHtml += '</select>';
			}
			if(!this.model.get("isHeader") && !this.model.get("isProject")){
				headerItIsHtml = '';
				var mainViewItIsoNproj = myModel.get("view_main");
				headerItIsHtml += '<select class="modalTextareaMine modalSelectAreaMin" id="view_main_on_project_showing">';
				headerItIsHtml += '<option value="board_view_show">'+app.translate("Simple view")+'</option>';
				for(var i=0; i < entryView.length; i++){
					if(mainViewItIsoNproj === entryView[i].id){
						headerItIsHtml += '<option selected value="'+entryView[i].id+'">'+app.translate(entryView[i].name)+'</option>';
					}else{
						headerItIsHtml += '<option value="'+entryView[i].id+'">'+app.translate(entryView[i].name)+'</option>';
					}
				}
				headerItIsHtml += '</select>';
			}
			this.setCommentsColData();
			var shared_in = {html:"",count:0};
			var shared_in_html_one = shared_in.html;
			var friendsHtmlV = "";
			if(typeof app.userConnected.data2 !== 'undefined'){
				friendsHtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
				shared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
				shared_in_html_one = shared_in.html;
				if(shared_in.count == 0){
					shared_in_html_one = app.noRecordsInIt();
				}
			}else{
				app.vent.on("userConnected:ready", function(){
					var fhtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
					var fshared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
					var shared_in_html_one = fshared_in.html;
					if(fshared_in.count == 0){
						shared_in_html_one = app.noRecordsInIt();
					}
					$("#shared_count").text(fshared_in.count);
					$("#friendsHtmlV").html(fhtmlV);
					$("#shared_inHtml").html(shared_in_html_one);
				}.bind(this));
			}
			var permsLetEdit = false;
			var readonlyIfNotEdit = "";
			var dontShowElement = "";
			var dontShowShared = "";
			//var taskViewButtons = this.getTasksViewButtons();
			//var tasksViewAll = this.getTasksView();
			//if(tasksViewAll == ""){
			//	tasksViewAll = app.noRecordsInIt();
			//} 
			if(this.model.get("parentvisibility") == "editpublic" 
			|| this.model.get("parentvisibility") == "editfriends"
			|| this.model.get("parentvisibility") == "editprivate"
			){
				permsLetEdit = true; 
			}else{
				readonlyIfNotEdit = "readonly";
				dontShowElement = " style='display:none;' ";
				//taskViewButtons = "";
			}
			if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
				dontShowShared = "style= 'display:none;' ";
			}
			var html_files = this.getFilesHtmlAndCount();
			var html_files_inner_html = html_files.html;
			if(html_files.count == 0){
				html_files_inner_html = app.noRecordsInIt();
			}
			return 	'<div class="right_side_of_modal right_modal_dialog_meniu" style="width:100%; float:none; display:block;">' +
				'<button id="general_info_view" class="right_model_menu right_model_menu_selected"><div class="glyphicon glyphicon-home icon-in-menu icon-turn-off" aria-hidden="true"></div></button>' +
				//'<button id="history_info_view" class="right_model_menu"><div class="glyphicon glyphicon-sort icon-in-menu icon-turn-off" aria-hidden="true"></div><span id="history_count"></span></button>' +
				'<button id="comments_info_view" class="right_model_menu"><div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div><span id="comments_count"></span></button>' +
				//'<button id="tasks_info_view" class="right_model_menu"><div class="glyphicon glyphicon-tasks icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="tasksNumb">'+this.model.get('tasks').filter(function(e){return e}).length+'</span>)</button>' +
				'<button id="files_info_view" class="right_model_menu"><div class="glyphicon glyphicon-file icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="files_count">'+html_files.count+'</span>)'+'</button>' +
				'<button '+dontShowShared+' id="shared_info_view" class="right_model_menu"><div class="glyphicon glyphicon-share icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="shared_count">'+shared_in.count+'</span>)</button>' +
				permissionsButtonOn +
				customButtons+
				'</div>'+
				'<div class="left_side_of_modal" style="width:100%; float:none;">'+
				'<div class="views_in_all comments_info_view" style="display:none;">'+
				'<div id="comments_add_more"></div>'+
				'<div id="comments_inner_all"></div>'+
				'</div>'+
				//'<div class="views_in_all tasks_info_view" style="display:none;">'+
				//taskViewButtons+'<div id="tasksViewAllIn">'+tasksViewAll+'</div>'+
				//'</div>'+
				customInnerHtml+
				'<div class="views_in_all permissions_info_view" style="display:none;">'+
				this.getPermissionsHtmlSelection()+
				'</div>'+
				'<div class="views_in_all shared_info_view" style="display:none;">'+
				'<div id="friendsHtmlV">'+friendsHtmlV+'</div>'+
                '<div id="shared_inHtml">'+shared_in_html_one+'</div>'+
				'</div>'+
				'<div class="views_in_all files_info_view" style="display:none;">'+
				'<input type="file" id="fileToUpload" class="FileUploadIt'+this.model.get('_id')+'" identity="'+this.model.get('_id')+'" style="display:none;" />'+
				'<div class="projectclass_'+this.model.get('_id')+'"></div>'+
				'<button '+dontShowElement+' identity="'+this.model.get('_id')+'" class="projectsUploadFileDialog general_button">'+app.translate('Upload file')+'</button>'+
				'<div id="files_inner_view_in_dialog'+this.model.get('_id')+'"><div id="htmlfiles_inner">'+html_files_inner_html+'</div></div>'+
				'</div>'+
				'<div class="views_in_all history_info_view" style="display:none;">'+
				'</div>'+
				'<div class="views_in_all general_info_view">'+
				htmlOfPersonWhoCreated+projectItIsHtml+headerItIsHtml+entryItIsHtml+
				'<button '+dontShowElement+' id="update_general_info" class="general_button margintop10 topm5">'+app.translate('Update')+'</button>'+
				'<button '+dontShowElement+' id="set_html_editor" class="general_button margintop10 topm5">'+app.translate('HTML text')+'</button>'+
				'<button '+dontShowElement+' id="set_normal_editor" class="general_button margintop10 topm5">'+app.translate('Editor')+'</button>'+
				'<textarea '+readonlyIfNotEdit+' class="modalTextareaMine textarea_title" id="text">'+this.model.get('text')+'</textarea><div class="separator"></div>'+
                '<textarea '+readonlyIfNotEdit+' class="modalTextareaMine description_textarea" id="name">'+this.model.get('name')+'</textarea><div class="separator"></div>'+
                '<input '+readonlyIfNotEdit+' type="color" class="modalTextareaMine form-control left_float20 color_input_data" id="color" value="'+this.model.get('color')+'" /><div class="left_float3" style="height:2px;"></div>'+
                '<input '+readonlyIfNotEdit+' type="text" class="modalTextareaMine form-control left_float75 who_is_working_input" id="friendsThere" placeholder="'+app.translate('Who is working')+'" value="'+this.model.get('friendsThere')+'" />'+
				whatToShowHtml+
				projectItIsHtmlSelection+
				'<div style="clear:both;"></div>' +
				'</div></div>';
		},
		getEditDialogWindowHtml: function(options){
			var opt_is = "";
			if(typeof options !== "undefined" && options !== ""){
				opt_is = options;
			}
			
			var permsLetEdit = false;
			var readonlyIfNotEdit = "";
			var dontShowElement = "";
			var dontShowShared = "";

			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate" 
			 || this.model.get("parentvisibility") == "editfriends" || 
			 (this.model.get("belongs_to_is_email") && this.model.get("belongs_to") == app.userConnected.data2.email)){
				permsLetEdit = true; 
			}else{
				readonlyIfNotEdit = "readonly";
				dontShowElement = " style='display:none;' ";
			}
			
			var personFt = '<div class="hereProfilePhoto2" style=""><div class="friend_front_page_cont" id="friends_photo_container"><img id="friends_photo" src="'+config.filesurl+'/files/'+this.model.get("email")+'/'+this.model.get("email")+'.jpg" alt=""></div></div>';
			
			var htmlOfPersonWhoCreated = "<a class='personOnDialogOnRight' href='/#"+this.model.get("email")+"'>"+personFt+"<div class='firstlastnameTop'>"+this.model.get("firstlastname")+"</div></a> ";
			var permissionsButtonOn = "";
			if(typeof app.userData != "undefined" && this.model.get("email") == app.userData.email){
				permissionsButtonOn = '<button id="permissions_info_view" class="right_model_menu"><div class="glyphicon glyphicon-eye-open icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Visibility')+'</button>';
			}
			var customButtons = "";
			for(var i=0; i < customData.length; i++){
				customButtons += customData[i].buttonHtml(this.model);
			}
			var customInnerHtml = "";
			for(var i=0; i < customData.length; i++){
				customInnerHtml += customData[i].innerHtml();
			}
			var myModel = this.model;
			myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
			this.setCommentsColData();
			var projectItIsHtml = "";
			var projectItIsHtmlSelection = "";
			var whatToShow = myModel.get('what_to_show');
			var whatToShowHtml = "<div class='whatToShowHere'>";
				whatToShowHtml += '<select '+dontShowElement+' class="modalTextareaMine modalSelectAreaMin" id="what_to_show">';
				if(whatToShow === "all"){
					whatToShowHtml += '<option value="all" selected>'+app.translate("All")+'</option>';
				}else{
					whatToShowHtml += '<option value="all">'+app.translate("All")+'</option>';
				}
				if(whatToShow === "comments"){
					whatToShowHtml += '<option value="comments" selected>'+app.translate("Only comments")+'</option>';
				}else{
					whatToShowHtml += '<option value="comments">'+app.translate("Only comments")+'</option>';
				}
				if(whatToShow === "nothing"){
					whatToShowHtml += '<option value="nothing" selected>'+app.translate("Nothing")+'</option>';
				}else{
					whatToShowHtml += '<option value="nothing">'+app.translate("Nothing")+'</option>';
				}
				whatToShowHtml += '</select></div>';
				whatToShowHtml += "<div class='modal_near_select_info'>"+app.addInfoAbout("In entries view (press arrow) on bottom show: all - (comments, files and so on), only comments and nothing (only your text)")+"</div>";
			var headerItIsHtml = "";
			
			var entryItIsHtml = '<a class="project_dialog_links general_button margintop10 topm5 topbuttondialog" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/entry/'+this.model.get("_id")+'"><span class="glyphicon glyphicon-arrow-right icon-in-menu icon-turn-off"></span><div>Link</div></a>';
			if(this.model.get("isProject")){
				projectItIsHtml = '<a class="project_dialog_links general_button margintop10 topm5 topbuttondialog" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/project/'+this.model.get("_id")+'"><span style="" class="glyphLink glyphicon glyphicon-list-alt icon-in-menu icon-turn-off"></span><div>Project</div></a>';
				projectItIsHtmlSelection = '<div class="whatToShowHere">';
				var mainViewItIsoNproj = myModel.get("view_main");
				projectItIsHtmlSelection += '<select '+dontShowElement+' class="modalTextareaMine modalSelectAreaMin" id="view_main_on_project_showing">';
				projectItIsHtmlSelection += '<option value="board_view_show">'+app.translate("Board view")+'</option>';
				for(var i=0; i < projectView.length; i++){
					if(mainViewItIsoNproj === projectView[i].id){
						projectItIsHtmlSelection += '<option selected value="'+projectView[i].id+'">'+app.translate(projectView[i].name)+'</option>';
					}else{
						projectItIsHtmlSelection += '<option value="'+projectView[i].id+'">'+app.translate(projectView[i].name)+'</option>';
					}
				}
				projectItIsHtmlSelection += '</select></div>';
				projectItIsHtmlSelection +="<div class='modal_near_select_info'>"+ app.addInfoAbout("Choose default view when entering project")+"</div>";
			}
			if(this.model.get("isHeader")){
				headerItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/projectsinlist/'+this.model.get("_id")+'/_"><span style="" class="glyphLink glyphicon glyphicon-equalizer"></span></a>';
				var mainViewItIsoNproj = myModel.get("view_main");
				headerItIsHtml += '<select '+dontShowElement+' class="modalTextareaMine modalSelectAreaMin" id="view_main_on_project_showing">';
				headerItIsHtml += '<option value="board_view_show">'+app.translate("Board view")+'</option>';
				for(var i=0; i < listView.length; i++){
					if(mainViewItIsoNproj === listView[i].id){
						headerItIsHtml += '<option selected value="'+listView[i].id+'">'+app.translate(listView[i].name)+'</option>';
					}else{
						headerItIsHtml += '<option value="'+listView[i].id+'">'+app.translate(listView[i].name)+'</option>';
					}
				}
				headerItIsHtml += '</select>';
				headerItIsHtml += "<div class='modal_near_select_info'>"+app.addInfoAbout("Choose default view when entering list")+"</div>";
			}
			if(!this.model.get("isHeader") && !this.model.get("isProject")){
				headerItIsHtml = '';
				var mainViewItIsoNproj = myModel.get("view_main");
				headerItIsHtml += '<select '+dontShowElement+' class="modalTextareaMine modalSelectAreaMin" id="view_main_on_project_showing">';
				headerItIsHtml += '<option value="board_view_show">'+app.translate("Simple view")+'</option>';
				for(var i=0; i < entryView.length; i++){
					if(mainViewItIsoNproj === entryView[i].id){
						headerItIsHtml += '<option selected value="'+entryView[i].id+'">'+app.translate(entryView[i].name)+'</option>';
					}else{
						headerItIsHtml += '<option value="'+entryView[i].id+'">'+app.translate(entryView[i].name)+'</option>';
					}
				}
				headerItIsHtml += '</select>';
				headerItIsHtml += "<div class='modal_near_select_info'>"+app.addInfoAbout("Entry can be also a photobook")+"</div>";
			}
			var shared_in = {html:"",count:0};
			var shared_in_html_one = shared_in.html;
			var friendsHtmlV = "";
			if(typeof app.userConnected.data2 !== 'undefined'){
				friendsHtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
				shared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
				shared_in_html_one = shared_in.html;
				if(shared_in.count == 0){
					shared_in_html_one = app.noRecordsInIt();
				}
			}else{
				app.vent.on("userConnected:ready", function(){
					var fhtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
					var fshared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
					var shared_in_html_one = fshared_in.html;
					if(fshared_in.count == 0){
						shared_in_html_one = app.noRecordsInIt();
					}
					$("#shared_count").text(fshared_in.count);
					$("#friendsHtmlV").html(fhtmlV);
					$("#shared_inHtml").html(shared_in_html_one);
				}.bind(this));
			}

			if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
				dontShowShared = "style= 'display:none;' ";
			}
			var html_files = this.getFilesHtmlAndCount();
			var html_files_inner_html = html_files.html;
			if(html_files.count == 0){
				html_files_inner_html = app.noRecordsInIt();
			}
			
			
			var allButtons = '<button id="general_info_view" class="right_model_menu right_model_menu_selected"><div class="glyphicon glyphicon-home icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Home')+'</button>' +
				//'<button id="history_info_view" class="right_model_menu"><div class="glyphicon glyphicon-sort icon-in-menu icon-turn-off" aria-hidden="true"></div><span id="history_count"></span></button>' +
				'<button id="comments_info_view" class="right_model_menu"><div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Comments ')+'<span id="comments_count"></span></button>' +
				//'<button id="tasks_info_view" class="right_model_menu"><div class="glyphicon glyphicon-tasks icon-in-menu icon-turn-off" aria-hidden="true"></div>(<span id="tasksNumb">'+this.model.get('tasks').filter(function(e){return e}).length+'</span>)</button>' +
				'<button id="files_info_view" class="right_model_menu"><div class="glyphicon glyphicon-file icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Files ')+'(<span id="files_count">'+html_files.count+'</span>)'+'</button>' +
				'<button '+dontShowShared+' id="shared_info_view" class="right_model_menu"><div class="glyphicon glyphicon-share icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Share ')+'(<span id="shared_count">'+shared_in.count+'</span>)</button>' +
				permissionsButtonOn +
				customButtons;
			
			if(opt_is === "only_comments"){
				allButtons = '<button id="comments_info_view" class="right_model_menu"><div class="glyphicon glyphicon-comment icon-in-menu icon-turn-off" aria-hidden="true"></div> '+app.translate('Comments ')+'<span id="comments_count"></span></button>';
			}
			
			var buttForTextarea = '<div class=""><button '+dontShowElement+' id="set_html_editor" class="general_button margintop10 topm5 floatright topbuttondialog"><div class="glyphicon glyphicon-pencil icon-in-menu icon-turn-off"></div><div>'+app.translate('Set HTML editor')+'</div></button>'+
					'<button '+dontShowElement+' id="set_normal_editor" class="general_button margintop10 topm5 floatright topbuttondialog"><div class="glyphicon glyphicon-text-color icon-in-menu icon-turn-off"></div><div>'+app.translate('Set Normal editor')+'</div></button></div><div class="separatorWithHeight"></div>';
			var buttonsHereRight = '<div class="right_side_of_modal right_goes_buttons">' +
				allButtons +
				'</div>';
			var buttonsHereLeftGo = "";
			if ($(window).width() < 880) {
				buttonsHereLeftGo = buttonsHereRight;
				buttonsHereRight = "";
			}
				
			return buttonsHereLeftGo+'<div class="left_side_of_modal">'+
				'<div class="views_in_all comments_info_view" style="display:none;">'+
				'<div id="comments_add_more"></div>'+
				'<div id="comments_inner_all"></div>'+
				'</div>'+
				customInnerHtml+
				'<div class="views_in_all permissions_info_view" style="display:none;">'+
				this.getPermissionsHtmlSelection()+
				'</div>'+
				'<div class="views_in_all shared_info_view" style="display:none;">'+
				'<div id="friendsHtmlV">'+friendsHtmlV+'</div>'+
                '<div id="shared_inHtml">'+shared_in_html_one+'</div>'+
				'</div>'+
				'<div class="views_in_all files_info_view" style="display:none;">'+
				'<input type="file" id="fileToUpload" class="FileUploadIt'+this.model.get('_id')+'" identity="'+this.model.get('_id')+'" style="display:none;" />'+
				'<div class="projectclass_'+this.model.get('_id')+'"></div>'+
				'<button '+dontShowElement+' identity="'+this.model.get('_id')+'" class="projectsUploadFileDialog general_button">'+app.translate('Upload file')+'</button>'+
				'<div id="files_inner_view_in_dialog'+this.model.get('_id')+'"><div id="htmlfiles_inner">'+html_files_inner_html+'</div></div>'+
				'</div>'+
				'<div class="views_in_all history_info_view" style="display:none;">'+
				'</div>'+
				'<div class="views_in_all general_info_view">'+
				'<div class="containerTopButtonsOfModal">'+htmlOfPersonWhoCreated+entryItIsHtml+
					projectItIsHtml+headerItIsHtml+
					'<button '+dontShowElement+' id="update_general_info" class="general_button margintop10 topm5 topbuttondialog"><div class="glyphicon glyphicon-edit icon-in-menu icon-turn-off" aria-hidden="true"></div><div>'+app.translate('Update')+'</div></button>'+
				'</div><div class="aboutInfoIfOkIs"></div>'+
				'<textarea '+readonlyIfNotEdit+' class="modalTextareaMine textarea_title" id="text">'+this.model.get('text')+'</textarea><div class="separator"></div>'+
				buttForTextarea+
                '<textarea '+readonlyIfNotEdit+' class="modalTextareaMine description_textarea" id="name">'+this.model.get('name')+'</textarea><div class="separator"></div>'+
                '<input '+readonlyIfNotEdit+' type="color" class="modalTextareaMine form-control left_float20 color_input_data" id="color" value="'+this.model.get('color')+'" /><div class="left_float3" style="height:2px;"></div>'+
                '<input '+readonlyIfNotEdit+' type="text" class="modalTextareaMine form-control left_float75 who_is_working_input" id="friendsThere" placeholder="'+app.translate('Who is working')+'" value="'+this.model.get('friendsThere')+'" />'+
				whatToShowHtml+
				projectItIsHtmlSelection+
				'<div style="clear:both;"></div>' +
				'</div></div>'+buttonsHereRight;
		},
		getJustImageEdit: function(firstText){
			var firstTextIn = "";
			if(typeof firstText != "undefined" && firstText != ""){
				firstTextIn = firstText;
			}
			var onClick_what = 'onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');"';
			var htmlOfPersonWhoCreated = "<a "+onClick_what+" href='/#"+this.model.get("email")+"'>"+this.model.get("email")+"</a> <a "+onClick_what+" href='/#/entry/"+this.model.get("_id")+"'><span class='glyphicon glyphicon-arrow-right'></span></a>";
			var customButtons = "";
			for(var i=0; i < customData.length; i++){
				customButtons += customData[i].buttonHtml(this.model);
			}
			var customInnerHtml = "";
			for(var i=0; i < customData.length; i++){
				customInnerHtml += customData[i].innerHtml();
			}
			var myModel = this.model;
			myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
			this.setCommentsColData();
			var projectItIsHtml = "";
			var headerItIsHtml = "";
			var entryItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/entry/'+this.model.get("_id")+'"><span class="glyphicon glyphicon-arrow-right"></span></a>';
			if(this.model.get("isProject")){
				projectItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/project/'+this.model.get("_id")+'"><span style="" class="glyphLink glyphicon glyphicon-list-alt"></span></a>';
				var mainViewItIsoNproj = myModel.get("view_main");
				projectItIsHtml += '<select class="modalTextareaMine modalSelectAreaMin" id="view_main_on_project_showing">';
				projectItIsHtml += '<option value="board_view_show">'+app.translate("Board view")+'</option>';
				for(var i=0; i < projectView.length; i++){
					if(mainViewItIsoNproj === projectView[i].id){
						projectItIsHtml += '<option selected value="'+projectView[i].id+'">'+app.translate(projectView[i].name)+'</option>';
					}else{
						projectItIsHtml += '<option value="'+projectView[i].id+'">'+app.translate(projectView[i].name)+'</option>';
					}
				}
				projectItIsHtml += '</select>';
			}
			if(this.model.get("isHeader")){
				headerItIsHtml = '<a class="project_dialog_links" onclick="$('+"'.confirm_no'"+').trigger('+"'click'"+');" href="#/projectsinlist/'+this.model.get("_id")+'/_"><span style="" class="glyphLink glyphicon glyphicon-equalizer"></span></a>';
			}
			var shared_in = {html:"",count:0};
			var shared_in_html_one = shared_in.html;
			var friendsHtmlV = "";
			if(typeof app.userConnected.data2 !== 'undefined'){
				friendsHtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
				shared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
				shared_in_html_one = shared_in.html;
				if(shared_in.count == 0){
					shared_in_html_one = app.noRecordsInIt();
				}
			}else{
				app.vent.on("userConnected:ready", function(){
					var fhtmlV = this.friendsHtmlV(app.userConnected.data2.friends);
					var fshared_in = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
					var shared_in_html_one = fshared_in.html;
					if(fshared_in.count == 0){
						shared_in_html_one = app.noRecordsInIt();
					}
					$("#shared_count").text(fshared_in.count);
					$("#friendsHtmlV").html(fhtmlV);
					$("#shared_inHtml").html(shared_in_html_one);
				}.bind(this));
			}
			var permsLetEdit = false;
			var readonlyIfNotEdit = "";
			var dontShowElement = "";
			var dontShowShared = "";
			//var taskViewButtons = this.getTasksViewButtons();
			//var tasksViewAll = this.getTasksView();
			//if(tasksViewAll == ""){
			//	tasksViewAll = app.noRecordsInIt();
			//}
			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
				permsLetEdit = true; 
			}else{
				readonlyIfNotEdit = "readonly";
				dontShowElement = " style='display:none;' ";
				//taskViewButtons = "";
			}
			if(typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn){
				dontShowShared = "style= 'display:none;' ";
			}
			var html_files = this.getFilesHtmlAndCount();
			var html_files_inner_html = html_files.html;
			if(html_files.count == 0){
				html_files_inner_html = app.noRecordsInIt();
			}
			var files_show_arr = this.model.get('files_show').split(",");
			var html_of_image_data = "";
			for(var ii=0; ii < files_show_arr.length; ii++){
				var was_used_that_file = false;
				var offile = files_show_arr[ii];
				if(typeof offile.split(";")[0] != "undefined" && offile.split(";")[0] != ""){
					var offile_split_it = offile.split(";")[0].split(".");
					if(offile_split_it.length > 1 && 
					(offile_split_it[1].toLowerCase() === "jpg" || offile_split_it[1].toLowerCase() === "png" || offile_split_it[1].toLowerCase() === "gif")){
						was_used_that_file = true;
						html_of_image_data += '<img src="'+this.model.get("filesurl")+'/files/project_managing_files/'+this.model.get('_id')+'/'+offile.split(";")[0]+'" alt="" />';
					}
					if(offile_split_it.length > 1 && 
					(offile_split_it[1].toLowerCase() === "mp4" || offile_split_it[1].toLowerCase() === "ogg" || offile_split_it[1].toLowerCase() === "webm")){
						was_used_that_file = true;
						html_of_image_data += '<video controls>';
						html_of_image_data += '  <source src="'+this.model.get("filesurl")+'/files/project_managing_files/'+this.model.get('_id')+'/'+offile.split(";")[0]+'" type="video/'+offile.split(";")[0].split(".")[1]+'">';
						html_of_image_data += 'Your browser does not support the video tag.';
						html_of_image_data += '</video>';
					}
					if(offile_split_it.length > 1 && 
					(offile_split_it[1].toLowerCase() === "mp3")){
						was_used_that_file = true;
						html_of_image_data += '<audio controls>';
					 html_of_image_data += ' <source src="'+this.model.get("filesurl")+'/files/project_managing_files/'+this.model.get('_id')+'/'+offile.split(";")[0]+'" type="audio/mpeg">';
					html_of_image_data += 'Your browser does not support the audio element.';
					html_of_image_data += '</audio>';
					}
					if(offile_split_it.length > 1 && 
					(offile_split_it[1].toLowerCase() === "wav")){
						was_used_that_file = true;
						html_of_image_data += '<audio controls>';
					 html_of_image_data += ' <source src="'+this.model.get("filesurl")+'/files/project_managing_files/'+this.model.get('_id')+'/'+offile.split(";")[0]+'" type="audio/wav">';
					html_of_image_data += 'Your browser does not support the audio element.';
					html_of_image_data += '</audio>';
					}
					if(!was_used_that_file){
					 html_of_image_data += '<div class="download_entry_file_in">';
					 html_of_image_data += '<a href="'+this.model.get("filesurl")+'/files/project_managing_files/'+ this.model.get('_id') +'/'+ offile.split(";")[0] +'">'+ offile.split(";")[0] +'</a>';
					 html_of_image_data += '</div>';
					}
				}
			}
			var textData = "";
			var nameData = "";
			if(this.model.get('text') !== "" && this.model.get('text') !== "-"){ textData = '<div>'+this.model.get('text')+'</div>'; }
			if(this.model.get('name') !== "" && this.model.get('name') !== "-"){ nameData = '<div>'+this.model.get('name')+'</div>'; }
			return '<div class="left_side_of_modal width70p">'+
				//'<div class="views_in_all comments_info_view" style="display:none;">'+
				//'<div id="comments_add_more"></div>'+
				//'<div id="comments_inner_all"></div>'+
				//'</div>'+
				'<div class="views_in_all general_info_view images_videos_container_all">'+
				firstTextIn+
				textData+
				nameData+
				'<div>'+html_of_image_data+'</div>'+
				'<div style="clear:both;"></div>' +
				'</div></div>'+
				
				'<div class="right_side_of_modal width30p">' +
				htmlOfPersonWhoCreated+
				'<div id="comments_add_more"></div>'+
				'<div id="comments_inner_all"></div>'+
				'</div>';
		},
        showImageAndOtherMultimedia: function(myModel, firstText){
			var isThatOn = $("#right_menu_for_data").is(":visible");
			var whatWasOn = $(".right_model_menu_selected").attr("id");
			$("#right_menu_for_data").hide();
			$("#right_menu_for_data").html("");
            var th = this;
			var historyVisible = false;
			var commentsVisible = true;
			app.CurrentCommentsView = this;
			var commentsCol = app.getCommentsCol(this.model.get('_id'));
			if(commentsCol === ''){
				commentsCol = new Project();
				app.vent.trigger('add:cachedComments:resource', {_id:this.model.get('_id'),data: commentsCol});
				commentsCol.url = config.urlAddr+'/comments/'+this.model.get('_id')+'/'+0;
			}
			this.commentsCol = commentsCol;
            app.commands.execute("app:dialog:edit_project", {
				onRenderView: this.rerenderComments.bind(this),
                icon: '',
                title: '',
                commentsCol: commentsCol,
                message: this.getJustImageEdit(firstText),
                addTask: function(e) {
					th.addTask();
				},
                friends_comments_id: function(e) {
					th.friends_comments_id(e);
				},                
				friends_publ_id: function(e) {
					th.friends_publ_id(e);
				}, 
				friends_edit_id: function(e) {
					th.friends_edit_id(e);
				},                
				visible_to_all_comment: function(e) {
					th.visible_to_all_comment(e);
				},
                visible_to_none_comment_edit: function(e) {
					th.visible_to_none_comment_edit(e);
				},
                visible_to_none_edit: function(e) {
					th.visible_to_none_edit(e);
				},
                visible_to_none: function(e) {
					th.visible_to_none(e);
				},
                visible_to_all_edit: function(e) {
					th.visible_to_all_edit(e);
				},
                visible_to_all: function(e) {
					th.visible_to_all(e);
				},
                saveTasks: function(e) {
					th.saveTasks();
				},
                delete_files_one: function(e) {
					th.delete_files_one(e);
				},
                remove_use_files_one: function(e) {
					th.remove_use_files_one(e);
				},
                use_files_one: function(e) {
					th.use_files_one(e);
				},
                addTaskTo: function(e) {
					th.addTaskTo();
				},
                addTaskEstim: function(e) {
					th.addTaskEstim();
				},
                addTaskRecc: function(e) {
					th.addTaskRecc();
				},
				listenToRemoveTask: function(e){
					th.listenToRemoveTask(e);
				},
				friends_remove_one: function(e){
					th.friends_remove_one(e);
				},
				friendAddToEntry: function(e){
					th.friendAddToEntry();
				},
				sendlinkButton: function(e){
					th.sendlinkButton(e);
				},
				sendSharelink: function(e){
					th.sendSharelink(e);
				},
				onprojectsUploadFile: function(e){
					th.onprojectsUploadFile(e);
				},
				listenToRemoveComment: function(e){
					th.listenToRemoveComment(e);
				},				
				commentReplyItHere: function(e){
					th.commentReplyItHere(e);
				},
				commentAnswerItHere: function(e){
					th.commentAnswerItHere(e);
				},				
				commentLikeItHere: function(e){
					th.commentLikeItHere(e);
				},
                commentSubmitminiEditView: function(e) {
					th.commentSubmitminiEditView();
				},
                set_normal_editor: function(e) {
					th.set_normal_editor(e);
				},
                set_html_editor: function(e) {
					th.set_html_editor(e);
				},
                update_general_info: function(e) {
					th.update_general_info(e);
				},
                right_model_menu: function(e) {
					th.right_model_menu(e);
				},
                field_changed_data: function(e) {
					th.field_changed_data(e);
				},
                confirmNo: function() {
					if(isThatOn){
						$(".pull-right").find(".glyphicon-th-list").trigger("click");
						$("#"+whatWasOn).trigger("click");
					}
                },
                confirmYes: function() {
                }
            });
        },
        editDialog: function(myModel){
			var isThatOn = $("#right_menu_for_data").is(":visible");
			var whatWasOn = $(".right_model_menu_selected").attr("id");
			$("#right_menu_for_data").hide();
			$("#right_menu_for_data").html("");
            var th = this;
			var historyVisible = false;
			var commentsVisible = true;
			app.CurrentCommentsView = this;
			var commentsCol = app.getCommentsCol(this.model.get('_id'));
			if(commentsCol === ''){
				commentsCol = new Project();
				app.vent.trigger('add:cachedComments:resource', {_id:this.model.get('_id'),data: commentsCol});
				commentsCol.url = config.urlAddr+'/comments/'+this.model.get('_id')+'/'+0;
			}
			this.commentsCol = commentsCol;
            app.commands.execute("app:dialog:edit_project", {
				onRenderView: this.rerenderComments.bind(this),
                icon: '',
                title: '',
                commentsCol: commentsCol,
                message: this.getEditDialogWindowHtml(),
                addTask: function(e) {
					th.addTask();
				},
                visible_to_all_comment: function(e) {
					th.visible_to_all_comment(e);
				},
                visible_to_none_comment_edit: function(e) {
					th.visible_to_none_comment_edit(e);
				},
                visible_to_none_edit: function(e) {
					th.visible_to_none_edit(e);
				},
                visible_to_none: function(e) {
					th.visible_to_none(e);
				},
                visible_to_all_edit: function(e) {
					th.visible_to_all_edit(e);
				},
                visible_to_all: function(e) {
					th.visible_to_all(e);
				},
				friends_publ_id: function(e) {
					th.friends_publ_id(e);
				},
				friends_comments_id: function(e) {
					th.friends_comments_id(e);
				},
				friends_edit_id: function(e) {
					th.friends_edit_id(e);
				},
                saveTasks: function(e) {
					th.saveTasks();
				},
                delete_files_one: function(e) {
					th.delete_files_one(e);
				},
                remove_use_files_one: function(e) {
					th.remove_use_files_one(e);
				},
                use_files_one: function(e) {
					th.use_files_one(e);
				},
                addTaskTo: function(e) {
					th.addTaskTo();
				},
                addTaskEstim: function(e) {
					th.addTaskEstim();
				},
                addTaskRecc: function(e) {
					th.addTaskRecc();
				},
				listenToRemoveTask: function(e){
					th.listenToRemoveTask(e);
				},
				friends_remove_one: function(e){
					th.friends_remove_one(e);
				},
				friendAddToEntry: function(e){
					th.friendAddToEntry();
				},
				sendlinkButton: function(e){
					th.sendlinkButton(e);
				},
				sendSharelink: function(e){
					th.sendSharelink(e);
				},
				onprojectsUploadFile: function(e){
					th.onprojectsUploadFile(e);
				},
				listenToRemoveComment: function(e){
					th.listenToRemoveComment(e);
				},
				commentReplyItHere: function(e){
					th.commentReplyItHere(e);
				},
				commentAnswerItHere: function(e){
					th.commentAnswerItHere(e);
				},				
				commentLikeItHere: function(e){
					th.commentLikeItHere(e);
				},
                commentSubmitminiEditView: function(e) {
					th.commentSubmitminiEditView();
				},
                set_normal_editor: function(e) {
					tinymce.remove("#name");
				},
                set_html_editor: function(e) {
					tinymce.remove("#name");
					$(".mce-tinymce").remove();
					tinymce.init({
						selector:'#name',
						   setup : function(ed) {
								  ed.on('change', function(e) {
									$(".mce-statusbar .mce-container-body").addClass("red_background_tiny_mce");
									$(".mce-toolbar-grp").addClass("red_background_tiny_mce");
								  });
						   }
					});
					$(".mce-tinymce").attr("style","");
				},
                update_general_info: function(e) {
					th.update_general_info(e);
				},
                right_model_menu: function(e) {
					th.right_model_menu(e);
				},
                field_changed_data: function(e) {
					th.field_changed_data(e);
				},
                confirmNo: function() {
					if(isThatOn){
						$(".pull-right").find(".glyphicon-th-list").trigger("click");
						$("#"+whatWasOn).trigger("click");
					}
                },
                confirmYes: function() {
                }
            });
        },
                friends_comments_id: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editcommentfriends");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#friends_comments_id").addClass("visibility_perm_descSelected");
				},
                friends_publ_id: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "friends");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#friends_publ_id").addClass("visibility_perm_descSelected");
				},   
				friends_edit_id: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editfriends");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#friends_edit_id").addClass("visibility_perm_descSelected");
				},
				
                visible_to_none_comment_edit: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editcommentprivate");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_none_comment_edit").addClass("visibility_perm_descSelected");
				},
                visible_to_all_comment: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editcommentpublic");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_all_comment").addClass("visibility_perm_descSelected");
				},
                visible_to_none_edit: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editprivate");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_none_edit").addClass("visibility_perm_descSelected");
				},
                visible_to_none: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "private");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_none").addClass("visibility_perm_descSelected");
				},
                visible_to_all_edit: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "editpublic");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_all_edit").addClass("visibility_perm_descSelected");
				},
                visible_to_all: function(e) {
					var myModel = this.model;
					myModel.set('visibility', "public");
					myModel.save();
					$(".visibility_perm_desc").removeClass("visibility_perm_descSelected");
					$("#visible_to_all").addClass("visibility_perm_descSelected");
				},
                set_normal_editor: function(e) {
					tinymce.remove("#name");
				},
                set_html_editor: function(e) {
					tinymce.remove("#name");
					$(".mce-tinymce").remove();
					tinymce.init({
						selector:'#name',
						   setup : function(ed) {
								  ed.on('change', function(e) {
									$(".mce-statusbar .mce-container-body").addClass("red_background_tiny_mce");
									$(".mce-toolbar-grp").addClass("red_background_tiny_mce");
								  });
						   }
					});
					$(".mce-tinymce").attr("style","");
				},
                update_general_info: function(e) {
					var myModel = this.model;
					myModel.url = config.urlAddr+'/project/'+myModel.get('_id');
					var whatChanged = '';
					myModel.set('id', myModel.get('_id'));
					var contenttt = "";
					if(config.use_tinymce_editor){
						if(tinymce.get('name') != null){
							contenttt = tinymce.get('name').getContent({format : 'raw'});
						}else{
							contenttt = $("#name").val();
						}
					}else{
						contenttt = $("#name").val();
					}
					
					if(myModel.get('name') !== contenttt){
						whatChanged+= app.translate('Changed name: ')+myModel.get('name')+' ';
					}
					if(myModel.get('text') !== $('#text').val()){
						whatChanged+= app.translate('Changed description: ')+myModel.get('text')+' ';
					}
					if(myModel.get('color') !== $('#color').val()){
						whatChanged+= app.translate('Changed color: ')+myModel.get('color')+' ';
					}
					if(myModel.get('friendsThere') !== $('#friendsThere').val()){
						whatChanged+= app.translate('Changed who is working: ')+myModel.get('friendsThere')+' ';
					}
					if(myModel.get('view_main') !== $('#view_main_on_project_showing').val()){
						whatChanged+= app.translate('Changed view main: ')+myModel.get('view_main')+' ';
					}
					if(myModel.get('what_to_show') !== $('#what_to_show').val()){
						whatChanged+= app.translate('Changed view main on entry: ')+myModel.get('what_to_show')+' ';
					}
					if(whatChanged != ""){
						this.addNewHistoryData(whatChanged);
						var nameData = contenttt;
						var textData = $("#text").val();
						var regex = /(<([^>]+)>)/ig;
						if(!config.let_add_html_data_title){
							textData = textData.replace(regex, "");
						}
						if(!config.let_add_html_data){
							nameData = nameData.replace(regex, "");
						}
						$(".modalTextareaMine").removeClass("red_background");
						if(config.use_tinymce_editor){
							$(".mce-statusbar .mce-container-body").removeClass("red_background_tiny_mce");
							$(".mce-toolbar-grp").removeClass("red_background_tiny_mce");
						}
						myModel.set('name', nameData);
						myModel.set('text', textData);
						myModel.set('color', $('#color').val());
						myModel.set('friendsThere', $('#friendsThere').val());
						myModel.set('view_main', $('#view_main_on_project_showing').val());
						myModel.set('what_to_show', $('#what_to_show').val());
						myModel.save().fail(function(errObj){
							if (typeof errObj != "undefined" && errObj.status != 200) {
								$(".aboutInfoIfOkIs").text("Not Saved. Check your internet connection. ");
								$(".aboutInfoIfOkIs").attr("style", "border:1px solid red; color:red;");
							}else{
								$(".aboutInfoIfOkIs").text("");
							}
						});
					}
				},
			addNewHistoryData: function(data){
					var commentNew = new Backbone.Model();
					var id = 'history'+this.model.get("_id");
					
					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1;
					var hours = today.getHours();
					var minutes = today.getMinutes();
					var sec = today.getSeconds();

					var yyyy = today.getFullYear();
					if(dd<10){
						dd='0'+dd
					}
					if(mm<10){
						mm='0'+mm
					} 
					if(sec<10){
						sec='0'+sec
					} 
					var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+sec;

					var msgsObj = {from:app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname,message:data,files:'',date:today};
					commentNew.set('message',msgsObj);
					commentNew.set('id',id);
					commentNew.set('taskid',this.model.get('_id'));
					commentNew.url = config.urlAddr+'/commentAddByUser';
					commentNew.save(null, {  type: 'POST' });
					
			},
        field_changed_data: function(e) {
			var myModel = this.model;
					var elemJq = $(e.currentTarget);
					if(myModel.get(e.currentTarget.getAttribute('id')) !== elemJq.val()){
						elemJq.addClass("red_background");
					}else{
						elemJq.removeClass("red_background");
					}
		},
        right_model_menu: function(e) {
					var id = e.currentTarget.getAttribute('id');
					$(".right_model_menu").removeClass("right_model_menu_selected");
					$(e.currentTarget).addClass("right_model_menu_selected");
					$('.views_in_all').hide();
					$('.'+id).show();
		},
       commentSubmitminiEditView: function() {
			var idOf = this.commentsCol.get('_id');
			var comments = $('#commentAddminiEditView').val();
			var friendToNotiff = $('#friendToNotifyWhich').val();
			if(comments != ''){
				this.addCommentSubmittingComm(comments, idOf,friendToNotiff);
			}
			$('#commentAddminiEditView').val('');
		},
		sendSharelink: function(e) {
			e.stopImmediatePropagation();
			e.stopPropagation();
			var id = e.currentTarget.getAttribute('data-id');
			var idaction = e.currentTarget.getAttribute('data-action');

            if (idaction == "share") {
                this.shareWithFriend(id);
            }
            if (idaction == "notify") {
                if (e.currentTarget.getAttribute("data-remail") != "undefined" && e.currentTarget.getAttribute("data-remail") != "") {
                    this.sendNotificationByEmail(e.currentTarget.getAttribute("data-remail"), this.model.get("_id"), "notify");
                }
            }
            if (idaction == "assign") {
                if (e.currentTarget.getAttribute("data-isshared") == "false" && (this.model.get("visibility") == "editcommentprivate" || this.model.get("visibility") == "editprivate" || 
                this.model.get("visibility") == "private")) {
                    this.shareWithFriend(id);
                }
                
                this.assignWithFriend(e.currentTarget.getAttribute("data-name"), id);
                if (e.currentTarget.getAttribute("data-remail") != "undefined" && e.currentTarget.getAttribute("data-remail") != "") {
                    this.sendNotificationByEmail(e.currentTarget.getAttribute("data-remail"), this.model.get("_id"), "assign");
                }
            }
        },
 		sendNotificationByEmail: function(email, ticketid, type) {
			let eml = email.split("@");
			if (eml.length == 2) {
				if (eml[1] == "gmail") {
					email = email+".com";
				}
				
				$.post( "/notifybyemail", { email: email, ticketid: ticketid, type: type })
				  .done(function( data ) { });
			}
		},
		sendlinkButton: function(e){
			e.stopImmediatePropagation();
			e.stopPropagation();
			var id = e.currentTarget.getAttribute('data-id'); 
			var linkData = "<a href='/#entry/"+id+"'>Shared with you: "+this.model.get("text")+"</a>";
			miniChatClicked(id);
			sendMessageWithText(id,id,linkData,'', 'chat');
			
		},
		friendAddToEntry: function(){
			var add_ff = $("#friendAddToEntry").val();
			this.shareWithFriend(add_ff);
		},
		assignWithFriend: function(name, add_ff){
			var myModel = this.model;
			myModel.set('assignedID', add_ff);
			myModel.set('friendsThere', name);
			$(".assignThatRow"+add_ff).hide();
			myModel.save();
		},
		shareWithFriend: function(add_ff){
			var myModel = this.model;
			var friendsDataInfoEmail = "";
			var allfriends = app.userConnected.data2.friends;
			if(typeof allfriends !== "undefined" && typeof allfriends.length !== "undefined"){
				for(var ii=0; ii < allfriends.length; ii++){
					if(allfriends[ii]._id === add_ff){
						friendsDataInfoEmail = allfriends[ii].email;
					}
				}
			}
			if(typeof add_ff != "undefined" && add_ff != "" && friendsDataInfoEmail != ""){
				myModel.set('friendDeleteEntry', '');
				myModel.set('friendAddToEntry', '');
				if(add_ff !== ''){
					myModel.set('friendAddToEntry', add_ff);
					myModel.set('friendAddToEntryEmail', friendsDataInfoEmail);
					myModel.addToFriends(add_ff);
				}
				myModel.save();
				$(".shareThatRow"+add_ff).hide();
				$("#friendAddToEntry option[value='"+add_ff+"']").remove();
				var f_data = this.friendsAlreadyInHtmlCount(app.userConnected.data2.friends);
				$('#shared_count').html(f_data.count);
				$(".friends_in_now_remove_it").replaceWith(f_data.html);
			}
		},
		friends_remove_one: function(e){
			var myModel = this.model;
			var removed_ff = e.currentTarget.getAttribute('data-id');
			if(typeof removed_ff != "undefined" && removed_ff != ""){
                myModel.set('friendDeleteEntry', '');
                myModel.set('friendAddToEntry', '');
                myModel.set('friendDeleteEntry', removed_ff);
                myModel.removeFromFriends(removed_ff);
				myModel.save();
				$(e.currentTarget).parent().remove();
				var f_data = this.friendsHtmlV(app.userConnected.data2.friends);
				var numbC = parseInt($('#shared_count').html());
				$('#shared_count').html(numbC-1);
				$(".friendAddToEntry_list").replaceWith(f_data);
			}
		},
		delete_files_one: function(e){
			var myModel = this.model;
			var file_to_delete = e.currentTarget.getAttribute('data-file_name');
			if(typeof file_to_delete != "undefined" && file_to_delete != ""){
				var filess = this.eraseFiles([file_to_delete]);
				myModel.set('files', [filess]);
				var files_show_rem = this.removeFilesShow(file_to_delete);
				myModel.set('files_show', files_show_rem);
				myModel.set('files', [filess]);
				myModel.save();
				$(e.currentTarget).parent().remove();
				var numbC = parseInt($('#files_count').html());
				$('#files_count').html(numbC-1);
				
			}
		},
		remove_use_files_one: function(e){
			var myModel = this.model;
			var remove_use_files_one = e.currentTarget.getAttribute('data-file_name');
			if(typeof remove_use_files_one != "undefined" && remove_use_files_one != ""){
				var files_show_rem = this.removeFilesShow(remove_use_files_one);
				myModel.set('files_show', files_show_rem);
				$(e.currentTarget).remove();
				myModel.save();
			}
		},
		use_files_one: function(e){
			var myModel = this.model;
			var use_files_one = e.currentTarget.getAttribute('data-file_name');
			if(typeof use_files_one != "undefined" && use_files_one != ""){
				var files_show = this.getFilesShow(use_files_one);
				if(files_show.nr != 0){
					$(e.currentTarget).remove();
					myModel.set('files_show', files_show.files_show);
					myModel.save();
				}
			}
		},
		getFilesShow: function(file_name){
			var myModel = this.model;
			var files_show = myModel.get("files_show");
			var files_split = files_show.split(",");
			var canAdd = true;
			var nr = 0;
			for(var i=0; i < files_split.length; i++){
				var sp_file = files_split[i].split(";");
				var sp_file_one = sp_file[0];
				if(sp_file_one === file_name){
					canAdd = false;
				}
				nr = parseInt(sp_file[1]);
			}
			if(isNaN(nr)){
				nr = 0;
			}
			if(canAdd){
				nr = nr+1;
				if(files_show == ""){
					files_show += file_name+";"+nr;
				}else{
					files_show += ","+file_name+";"+nr;
				}
			}
			return {files_show: files_show, nr:nr};
		},
		removeFilesShow: function(file_name){
			var myModel = this.model;
			var files_show = myModel.get("files_show");
			var files_split = files_show.split(",");
			var new_files_show = "";
			for(var i=0; i < files_split.length; i++){
				var sp_file = files_split[i].split(";");
				var sp_file_one = sp_file[0];
				if(sp_file_one !== file_name){
					if(new_files_show === ""){
						new_files_show += files_split[i];
					}else{
						new_files_show += ","+files_split[i];
					}
				}
			}
			return new_files_show;
		},
		addCommentSubmittingComm: function(comment, id, friendToNotiff){
				var commentNew = new Project();
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var sec = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(sec<10){
					sec='0'+sec
				} 
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+sec;
				if(typeof friendToNotiff !== "undefined" && friendToNotiff != ""){
					commentNew.set('friend_notify',friendToNotiff);
					commentNew.set('model_id',this.model.get("_id"));
					comment = comment+" - notified: "+friendToNotiff;
				}
				var msgsObj = {from:app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname+';'+app.userConnected.data2.email,message:comment,files:'',date:today};
				commentNew.set('message',msgsObj);
				commentNew.set('id',id);
				commentNew.set('taskid',this.model.get('_id'));
                commentNew.url = config.urlAddr+'/comment';
				commentNew.save();
				var commentsCountNow = 0;
				if(!isNaN(parseInt(this.model.get('comments_count')))){
					commentsCountNow = parseInt(this.model.get('comments_count'))+1;
				}
				msgsObj._id = this.model.get('_id');
				
		/*		var obj = msgsObj;
					var removeTh = false;
		if(typeof obj.removethis !== 'undefined'){
			removeTh = obj.removethis;
		}
		var commentCol = app.getCommentsCol(obj._id);
		if(commentCol != ''){
		var msgs = commentCol.get('messages');
			if(removeTh){
				var commentDate = obj.date;
				for(var i = msgs.length - 1; i >= 0; i--){
					if(msgs[i].date === commentDate) {
					   msgs.splice(i, 1);
					}
				}
				if(typeof app.CurrentCommentsView != 'undefined'){
					app.CurrentCommentsView.rerenderComments();
				}
			}else{
				msgs.unshift(obj);
				if(typeof app.CurrentCommentsView != 'undefined'){
					app.CurrentCommentsView.rerenderComments();
				}
			}
		}*/
				
				
				app.emitMessage('commentSend',msgsObj);
		},
		addComment: function(comment, id, datereply=null){
				var commentNew = new Project();
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1;
				var hours = today.getHours();
				var minutes = today.getMinutes();
				var sec = today.getSeconds();

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				} 
				if(sec<10){
					sec='0'+sec
				} 
				var today = yyyy+' '+mm+' '+dd+' '+hours+':'+minutes+':'+sec;

				var msgsObj = {from:app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname+';'+app.userConnected.data2.email,message:comment,files:'',date:today};
				commentNew.set('message',msgsObj);
				commentNew.set('id',id);
				commentNew.set('taskid',this.model.get('_id'));
				if (datereply != null) {
					commentNew.set('datereply',datereply);
				}
                commentNew.url = config.urlAddr+'/comment';
				commentNew.save();
				var commentsCountNow = 0;
				if(!isNaN(parseInt(this.model.get('comments_count')))){
					commentsCountNow = parseInt(this.model.get('comments_count'))+1;
				}
				msgsObj._id = this.model.get('_id');
				app.emitMessage('commentSend',msgsObj);
		},
		friendsGetHtmlToChange: function(){
			var friendsHtml = '';
			var fr = this.model.get('friendsThere');
			if(fr != ''){
				var thFr = fr.split(',');
				for(var i=0; i < thFr.length; i++){
					friendsHtml += '<div class="friendInProjectMini">'+thFr[i]+'</div>';
				}
			}
			return friendsHtml;
		},
        friendsAlreadyInHtmlCount: function(friends){
			if((typeof app.userIsNotLoggedIn != "undefined" && app.userIsNotLoggedIn) || typeof friends == "undefined"){
				return { html:"", count:0 };
			}else{
			var count = 0;
            var html = '<div class="friends_in_now_remove_it">';
            var ffriends = this.model.get('friends');
            var my_id = app.userConnected.data2._id;
			var ffArrays = [];
			if(typeof ffriends != 'undefined' && typeof ffriends.length !== "undefined"){
				for(var jj=0; jj < ffriends.length; jj++){
					var name = app.translate('Friend was removed');
					if(typeof friends !== "undefined" && typeof friends.length !== "undefined"){
						for(var ii=0; ii < friends.length; ii++){
							if(friends[ii]._id === ffriends[jj]._id){
								name = friends[ii].firstname+' '+friends[ii].lastname;
							}
						}
					}
					if(my_id === ffriends[jj]._id){
						name = app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname;
					}
					ffArrays[jj] = name;
					var removeEpublicVis = '';
					if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
						removeEpublicVis = '<div class="friends_remove_one general_button" data-id="'+ffriends[jj]._id+'">'+app.translate('Remove')+'</div>';
					}
					html += "<div>"+name+removeEpublicVis+'</div>';
					count++;
				}
			}
			this.model.set('friendsThis',ffArrays);
            html += '</div>';
            return { html:html, count:count };
			}
		},
        friendsAddedV: function(friends){
            var html = '<select name="remove_friend_f_f" class="modalSelectMine" id="remove_friend_f_f">';
            //html += '<option value="">'+app.translate('Remove friend')+'</option>';
            var ffriends = this.model.get('friends');
            var my_id = app.userConnected.data2._id;
			var ffArrays = [];
			if(typeof ffriends != 'undefined' && typeof ffriends.length !== "undefined"){
				for(var jj=0; jj < ffriends.length; jj++){
					var name = app.translate('Friend was removed');
					if(typeof friends !== "undefined" && typeof friends.length !== "undefined"){
						for(var ii=0; ii < friends.length; ii++){
							if(friends[ii]._id === ffriends[jj]._id){
								name = friends[ii].firstname+' '+friends[ii].lastname;
							}
						}
					}
					if(my_id === ffriends[jj]._id){
						name = app.userConnected.data2.firstname+' '+app.userConnected.data2.lastname;
					}
					ffArrays[jj] = name;
					html += '<option value="'+ffriends[jj]._id+'">'+name+'</option>';
					
				}
			}
			this.model.set('friendsThis',ffArrays);
            html += '</select>';
            return html;
        },
		friendsInOptionsValue: function(friends){
            var html = '<option value="">'+app.translate('Add friend')+'</option>';
            if(typeof friends !== "undefined" && typeof friends.length !== "undefined"){
                for(var i=0; i < friends.length; i++){
                    var canChoose = true;
                    var ffriends = this.model.get('friends');
                    if(typeof ffriends !== "undefined" && typeof ffriends.length !== "undefined" && ffriends.length > 0 && ffriends !== ''){
                        for(var jj=0; jj < ffriends.length; jj++){
                            if(friends[i]._id === ffriends[jj]._id){
                                canChoose = false;
                            }
                        }
                    }
                    if(canChoose){
                        html += '<option value="'+friends[i]._id+'">'+friends[i].email+' - '+friends[i].firstname+' '+friends[i].lastname+'</option>';
                    }
                }
            }
			return html;
		},
        friendsHtmlV: function(friends){
			var showSelection = " style='display:none; ' ";
			if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
				showSelection = "";
			}
           // var html = '<select '+showSelection+' class="friendAddToEntry_list" name="friendAddToEntry" id="friendAddToEntry">';
			//html += this.friendsInOptionsValue(friends);
           // html += '</select>';
			var html = "<div "+showSelection+">"+this.projectsShareGetH()+"</div>";
            return html;
        },
        friendsHtmlVNotifyWhich: function(friends){
			var showSelection = " style='display:none; ' ";
			if(this.model.get("parentvisibility") == "editcommentfriends" || this.model.get("parentvisibility") == "friends" || this.model.get("parentvisibility") == "editfriends" ||
			this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate" || this.model.get("parentvisibility") == "editcommentprivate" || this.model.get("parentvisibility") == "editcommentpublic"){
				showSelection = "";
			}
			if(typeof friends !== "undefined" && typeof friends.length !== "undefined"){
				var get_f_html = this.friendsInOptionsValueForNotify(friends);
                if(friends.length > 0 && get_f_html != ""){
					var html = '<select '+showSelection+' class="friendToNotifyWhich" name="friendToNotifyWhich" id="friendToNotifyWhich">';
					html += get_f_html;
					html += '</select>';
					return html;
				}else{
					return "";
				}
			}else{
				return "";
			}
        },
		friendsInOptionsValueForNotify: function(friends){
			var was_found_some = false;
            var html = '<option value="">'+app.translate('Notify:')+'</option>';
            if(typeof friends !== "undefined" && typeof friends.length !== "undefined"){
                for(var i=0; i < friends.length; i++){
                    var canChoose = true;
                    if(canChoose){
						if(typeof friends[i].real_email != "undefined" && friends[i].real_email != "" && friends[i].real_email.indexOf("@") > -1){
							was_found_some = true;
							html += '<option value="'+friends[i].real_email+'">'+friends[i].email+' - '+friends[i].firstname+' '+friends[i].lastname+'</option>';
						}
                    }
                }
            }
			if(was_found_some){
				return "";
			}
			return "";
		},
        eraseFiles: function(files_delete){
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (let i=0, n=files.length; i < n; i++) {
                    if(files[i] != '' && files[i] != 'undefined' && $.inArray(files[i], files_delete) == -1) {
                        if(files_in==""){
                            files_in += files[i];
                        }else{
                            files_in += ','+files[i];
                        }
                    }
                }
                return files_in;
            }
            return '';
        },
        projectsSharedRemoveMe: function(e){
			if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
				this.model.set("remove_shared_from_project", "true");
				this.model.save();
				this.model.collection.remove(this.model);
			}
		},
        goonnewtext: function(e){
			var ident = e.currentTarget.getAttribute('identity');
			$(".showAddNewButtonFor"+ident).show();
			if (e.currentTarget.getAttribute('data-text') === "project") {
				$("#project_text_entry"+ident).hide();
				$("#project_text_project"+ident).attr("style", "resize:vertical;overflow:auto;");
				$("#project_text_project"+ident).height(50);
				$("#project_text_project"+ident).width("96%");
			}
			if (e.currentTarget.getAttribute('data-text') === "entry") {
				$("#project_text_entry"+ident).attr("style", "resize:vertical;overflow:auto;");
				$("#project_text_entry"+ident).height(50);
				$("#project_text_entry"+ident).width("96%");
				$("#project_text_project"+ident).hide();
			}
		},
        onprojectsDelete: function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
                this.model.set('id', this.model.get('_id'));
                this.model.url = config.urlAddr+'/project/'+this.model.get('_id');
				var myModel = this;
				
            app.commands.execute("app:dialog:confirm", {
                icon: 'info-sign',
                title: app.translate('Delete action'),
                message: app.translate('Do you really want to delete ')+myModel.model.get('text')+' ?',
                confirmNo: function() {
                },
                confirmYes: function() {
					$('#project_'+myModel.model.get('_id')).remove();
					/*//myModel.model.destroy();*/
					var model_id = myModel.model.get("_id");
					var removeModels = [myModel.model];
					if(myModel.model.get("isHeader")){
						$("#projects_one_in"+model_id).find(".project_row_one").each(function(){
							var thpid_project = $(this).attr('pid');
							var getModl = myModel.model.collection.getModelFromCol(thpid_project);
							if(typeof getModl.thisItem != "undefined" && getModl.thisItem != ""){
								removeModels.push(getModl.thisItem);
							}
						});
					}
					for(var ii=0; ii < removeModels.length; ii++){
						var modOne = removeModels[ii];
						modOne.destroy();
						/*var ocollOn = modOne.collection;
						//ocollOn.removeModelFromCol(modOne);*/
					}
					
					/*myModel.trigger("project:edit",{removeModels:removeModels});*/
					myModel.trigger('project:delete');
                }.bind(this)
            });
			e.stopImmediatePropagation();
			e.stopPropagation();
            }
        },
        onprojectsOpenTreeView:function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
				var in_head_id = this.model.get("inHeader");
					if($('.treeInShowHere'+this.model.get('_id')).is(':visible')){
						$('.treeInShowHere'+this.model.get('_id')).hide();//projectclass_5818d3ebbf53eed82b26c8dd
						$('.projectclass_'+in_head_id).css('width','214px');
						/*$('#project_'+this.model.get('_id')).css('width','210px');
						if(location.hash.indexOf('projectsinlist') == -1){
							$('#project_'+this.model.get('_id')).parent().parent().parent().css('width','214px');
							$('.treeShowContainer table').each(function(){
								$(this).css('width', 'auto');
								var widd = $(this).width()+197;
								$(this).css('width', widd +'px');
							});
						}*/
						var treeProjectsOnn = this.model.get("treeprojectsallproject");
						if(typeof treeProjectsOnn != "undefined"){
								var treeIn_show = treeProjectsOnn;
								treeIn_show.display_on_it = "false";
							}
					}else{
						if($('.treeInShowHere'+this.model.get('_id')).html() === ""){
							$('.treeInShowHere'+this.model.get('_id')).show();
							var dt = {el:'.treeInShowHere'+this.model.get('_id'),id:this.model.get('_id')};
							this.model.set('inCollectionData',dt);
							/*$('#project_'+this.model.get('_id')).css('width','auto');
							if(location.hash.indexOf('projectsinlist') == -1){
								$('#project_'+this.model.get('_id')).parent().parent().parent().css('width','auto');
							}*/
						}
							var treeProjectsOnn = this.model.get("treeprojectsallproject");
							if(typeof treeProjectsOnn != "undefined"){
								var treeIn_show = treeProjectsOnn;
								treeIn_show.display_on_it = "true";
							}
						$('.treeInShowHere'+this.model.get('_id')).show();
						$('.projectclass_'+in_head_id).css('width','auto');
					}
					e.stopImmediatePropagation();
					e.stopPropagation();
            }
		},
        onprojectsUploadFile:function(e){
            if(e.currentTarget.getAttribute('identity') == this.model.get('_id')){
				this.model.set("ident_nr",e.currentTarget.getAttribute('ident'));
               /* this.$el.find('#fileToUpload').trigger('click'); */
                $('.FileUploadIt'+this.model.get('_id')).first().trigger('click');
				e.stopImmediatePropagation();
				e.stopPropagation();
            }
        },
        _fileChangeEvent: function(e){
				e.stopImmediatePropagation();
				e.stopPropagation();
            if(e.target.getAttribute('identity') == this.model.get('_id')){
				e.stopImmediatePropagation();
				e.stopPropagation();
				var isHeadd = e.target.getAttribute('isheader');
				if( typeof isHeadd != "undefined" && isHeadd != null &&  isHeadd != "" ){
					 var ifpicture_model = new Project();
						 ifpicture_model.set("name","-");
						 ifpicture_model.set("text","-");
						 ifpicture_model.set("color",this.model.get("color"));
						 ifpicture_model.set("isProject","false");
						 ifpicture_model.set("isHeader","false");
						 ifpicture_model.set("inHeader",this.model.get("_id"));
						 ifpicture_model.set("inProjects",this.model.get("inProjects"));
					ifpicture_model.save().done(function(data2){
						var nproject = new Project(data2);
						this.uploadFilesToServerWithHead(e.target.files, nproject);
					}.bind(this));
				
				}else{
					this.uploadFilesToServerWithHead(e.target.files, "");
				}
            }
        },
        _dragOverEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault){
					e.preventDefault();
				}
                e.dataTransfer.dropEffect = 'copy';
            }
        },

        _dragEnterEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            if (e.preventDefault) e.preventDefault()
        },

        _dragLeaveEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)
            this.dragLeave(data, e.dataTransfer, e)
        },

        _dropEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent
            var data = this._getCurrentDragData(e)

            if (e.preventDefault) e.preventDefault()
            if (e.stopPropagation) e.stopPropagation()

            if (this._draghoverClassAdded) this.$el.removeClass("draghover")

            this.drop(data, e.dataTransfer, e)
        },

        _getCurrentDragData: function (e) {
            var data = null
            if (window._backboneDragDropObject) data = window._backboneDragDropObject
            return data
        },

        dragOver: function (data, dataTransfer, e) {
            var ok = dataTransfer && dataTransfer.types && dataTransfer.types.indexOf('Files') >= 0;
            if(Project.selectedVieww == ""){
                if(ok){
                    if(!this.model.get('isHeader')){
                        this._draghoverClassAddedFile = true;
                        $('.project_one_good_loading').hide();
                        this.$el.find('.project_one_good_loading').show();
                    }
                }
            }
        },

        dragLeave: function (data, dataTransfer, e) {
            if (this._draghoverClassAdded){
                if(this.model.get('isHeader')){
                    this.$el.removeClass("draghover");
                }else{
                    this.$el.removeClass("dragHoverElement");
                }
            }
        },
		/*getFilesHtmlWithOrWithout: function(wOrw){
            if(this.model.get('files') != ''){
				var showing = this.model.get("files_show");
				console.log(showing);
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (let i=0, n=files.length; i < n; i++) {
                    if(files[i] != 'undefined') {
						var delFile= '';
						if(wOrw){
							if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
								delFile = '<input file_name="'+files[i]+'" type="checkbox" class="delete_files">'+app.translate('Delete');
							}
						}
                        files_in += '<div class="fileOneProjectInModel"><a target="_blank" href="'+config.filesurl+'/files/project_managing_files/'+this.model.get('_id')+'/'+files[i]+'">'+files[i]+'</a> '+delFile+'</div>';
                    }
                }
                return files_in;
            }
            return '';
		},*/
		getFilesHtmlAndCount: function(){
			var wOrw = true;
			var count = 0;
            if(this.model.get('files') != ''){
                var files = this.model.get('files')[0].split(',');
                var files_in = "";
                for (let i=0, n=files.length; i < n; i++) {
                    if(files[i] != 'undefined' && files[i] != "") {
						var delFile= '';
						if(wOrw){
							if(this.model.get("parentvisibility") == "editpublic" || this.model.get("parentvisibility") == "editprivate"){
								var inUse = '<div data-file_name="'+files[i]+'" class="use_files use_files_one general_button">'+app.translate('Use')+'</div>';
								var nr_if_is = this.checkIfFileIsInUse(files[i]);
								if(nr_if_is !== 0){
									inUse = ' <div data-file_name="'+files[i]+'" class="remove_used_files remove_use_files_one general_button">'+app.translate('Remove using')+'</div>';
								}
								delFile = '<div data-file_name="'+files[i]+'" class="delete_files delete_files_one general_button">'+app.translate('Delete')+
								'</div>'+inUse;
							}
						}
                        files_in += '<div class="fileOneProjectInModel"><a target="_blank" href="'+this.model.get("filesurl")+'/files/project_managing_files/'+this.model.get('_id')+'/'+files[i]+'">'+files[i]+'</a> '+delFile+'</div>';
						count++;
                    }
                }
                return {html: files_in, count:count};
            }
            return {html:'', count:count};
		},
		checkIfFileIsInUse: function(file_name){
			var myModel = this.model;
			var files_show = myModel.get("files_show");
			var files_split = files_show.split(",");
			var nr = 0;
			for(var i=0; i < files_split.length; i++){
				var sp_file = files_split[i].split(";");
				var sp_file_one = sp_file[0];
				if(sp_file_one === file_name){
					nr = parseInt(sp_file[1]);
				}
			}
			return nr;
		},
        renderr: function(){
			return '';//this.getFilesHtmlWithOrWithout(true);
        },
        uploadFilesToServer: function(files){
			this.uploadFilesToServerWithHead(files, "");
		},
        uploadFilesToServerWithHead: function(files, headerModel){
			var isnotheader_on = true;
			if(typeof headerModel !== "undefined" && headerModel !== ""){
				isnotheader_on = false;
			}
			
            var fd = new FormData();
			if(isnotheader_on){
				fd.append("project", this.model.get('_id'));
				fd.append("pfiles", this.model.get('files'));
			}else{
				fd.append("project", headerModel.get('_id'));
				fd.append("pfiles", headerModel.get('files'));
			}
            var files_in = this.model.get('files')[0];
			var canUploadIt = true;
            for (let i=0, n=files.length; i < n; i++) {
				var fileSizeInMb = files[i].size/1024/1024;
                if(files[i] && typeof files[i].name != 'undefined' && files[i].name != 'undefined' && files[i].name != 'item'){
                    files_in += ','+files[i].name;
                }
				if(fileSizeInMb >= 25){//25mb
					canUploadIt = false;
				}
                fd.append("uploadedFile", files[i]);
                fd.append("uploadedFileName", files[i].name);
            }
			if(canUploadIt){
				if(isnotheader_on){
					this.model.set('files', [files_in]);
				}

				var xhr = new XMLHttpRequest();
				xhr.upload.addEventListener("progress", function(oEvent){
					if(!$('.projectclass_'+this.model.get('_id')+' .progress').length){
						$('.projectclass_'+this.model.get('_id')).prepend('<div class="progress" style="color:white;background:red;"></div>');
					}
					if (oEvent.lengthComputable) {
						var percentComplete = oEvent.loaded / oEvent.total;
						$('.projectclass_'+this.model.get('_id')+' .progress').css('height', '10px');
						$('.projectclass_'+this.model.get('_id')+' .progress').css('width', (percentComplete*100)+'%');
					} else {
						$('.projectclass_'+this.model.get('_id')+' .progress').html(app.translate('Uploading ... '));
					}
				}.bind(this), false);
				 xhr.addEventListener("load", function(){
					 var flsz = xhr.responseText.replace(/"/g,'').replace('[','').replace(']','');
					 if(isnotheader_on){
						this.model.set('files',[flsz]);
					 }else{
						 headerModel.set("files",[flsz]);
					 }
					var getTheLastFile = flsz.split(",");
					var flsplitt = getTheLastFile[getTheLastFile.length-1].split(".");
					if(flsplitt[flsplitt.length-1] === "mp4" || flsplitt[flsplitt.length-1] === "MP4" ||
					flsplitt[flsplitt.length-1] === "png" || flsplitt[flsplitt.length-1] === "PNG" || flsplitt[flsplitt.length-1] === "JPG" || flsplitt[flsplitt.length-1] === "jpg" || flsplitt[flsplitt.length-1] === "gif" || flsplitt[flsplitt.length-1] === "GIF"){
						if(!$('.projectclass_uploaded_files_for_user'+this.model.get('_id')).length && !$(".photobook_all_container_top").length){
							var getTheLastFile = flsz.split(",");
							var flsplittLast = getTheLastFile[getTheLastFile.length-1];
							if(isnotheader_on){
								this.model.set('files_show', flsplittLast+";1");	
							}else{
								headerModel.set('files_show', flsplittLast+";1");	
							}
						}
					}
					 if(isnotheader_on){
						this.model.url = config.urlAddr+'/project/'+this.model.get('_id');
						this.model.save();
					 }else{
						 headerModel.save();
						 headerModel.set("parentvisibility",this.model.get("parentvisibility"));
						 this.model.collection.add(headerModel);
					 }
					 if(isnotheader_on && $('.projectclass_uploaded_files_for_user'+this.model.get('_id')).length){
						 var ident = this.model.get("ident_nr");
						 if(typeof ident == "undefined" && ident != ""){
							 ident = "1";
						 }
						 var flsplit = flsz.split(".");
						 var htmlFilesOn = '<div class="fileOneProjectInModel"><a target="_blank" href="'+this.model.get("filesurl")+'/files/project_managing_files/'+this.model.get('_id')+'/'+flsz+'">Uploaded file</a> - '+flsz+'</div>';
						 $('.projectclass_uploaded_files_for_user'+this.model.get('_id')+ident).html(htmlFilesOn);
							$('.projectclass_uploaded_files_for_user'+this.model.get('_id')+ident).parent().css("border", "none");
							$('.projectclass_uploaded_files_for_user'+this.model.get('_id')+ident).parent().css("padding", "0px");
						
						 var allHtmlFilessz = $('.projectclass_uploaded_files_for_user'+this.model.get('_id')+ident).html();
						 this.model.set("projectclass_uploaded_files_for_user"+ident, allHtmlFilessz);
						 
						 var getModelsOfUploadedFiles = this.model.get("projectclass_uploaded_files_for_user_file");
						 if(typeof getModelsOfUploadedFiles !== "undefined"){
							 getModelsOfUploadedFiles.push(ident);
							 this.model.set("projectclass_uploaded_files_for_user_file", getModelsOfUploadedFiles);
						 }else{
							 this.model.set("projectclass_uploaded_files_for_user_file", [ident]);
						 }
					 }
					 if(isnotheader_on && $('#files_inner_view_in_dialog'+this.model.get('_id')).length){
						 var html_files = this.getFilesHtmlAndCount();
						 $('#files_inner_view_in_dialog'+this.model.get('_id')).html(html_files.html);
						 $('#files_count').text(html_files.count);
					 }
					 
					 if($('.photobook_existing_images').length){
						$(".photobook_top_button_data_hereSave").trigger("click");
						$("#photobook_trigger_this_for_rerendering").trigger("click");
					 }
					 
					 if(isnotheader_on && $('#project_'+this.model.get('_id')).length && $('#project_'+this.model.get('_id')).hasClass("showcaseproject")){
						 var filePathLast = getTheLastFile[getTheLastFile.length-1];
						 var filesPathWhole = config.filesurl+"/files/project_managing_files/"+this.model.get('_id')+"/"+filePathLast;
						 $('#project_'+this.model.get('_id')).attr("style", "border:none; position:relative; background: url('"+filesPathWhole+"');");
					 }
					 
					 $('.projectclass_'+this.model.get('_id')+' .too_big_file').remove();
					 $('.projectclass_'+this.model.get('_id')+' .progress').remove();
				 }.bind(this), false);
				 if(isnotheader_on && $('.projectclass_uploaded_files_for_user'+this.model.get('_id')).length){
					xhr.open("POST", "/project_upload_customer/true");
				 }else{
					 xhr.open("POST", "/project_upload");
				 }
				xhr.send(fd);
			}else{
				$('.projectclass_'+this.model.get('_id')).append('<div class="too_big_file" style="color:white;background:red;">'+app.translate('Too big file. Max - 25MB.')+'</div>');
			}
        },
        drop: function (data, dataTransfer, e) {
            if(Project.selectedVieww == "" && !this.model.get('isHeader')){
                this.uploadFilesToServer(dataTransfer.files);
            }
            Project.selectedVieww = "";
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
        },

        _dragStartEvent:function(e){
            var data = "";
            if (e.originalEvent) e = e.originalEvent
            e.dataTransfer.effectAllowed = "copy"
            data = this.dragStart(e.dataTransfer, e)

            window._backboneDragDropObject = null
            if (data !== undefined && data !== "") {
                window._backboneDragDropObject = data;
            }
        },
        dragStart: function (dataTransfer, e) {
            $('.project_one_good_loading').hide();
            $("#dragHoverElement").remove();
            $("#dragHoverElementHeader").remove();
            if(Project.selectedVieww == ""){
                Project.selectedVieww = this;
            }
        }
	});
});
