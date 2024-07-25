define([
    '../../../app',
	'../../../config',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/account.html'
], function (app, config, templateHelpers, _, Marionette, templ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: templ,
		ui:{
			changeSettings:'#changeSettings',
			settingColor:'#settingColor'
		},
		events:{
		'click #changeSettings':'changeSettings',
		'click #save_address':'save_address',
		'click .projectsUploadFile':'onprojectsUploadFile',
		'change #fileToUpload':'_fileChangeEvent',
		'click #use_def_style':'changeViewOfDefinedClickedTr',
		'change #use_defined_style':'changeViewOfDefinedClicked',
		'click .messageToUserAccApproved':'messageToUserAccApproved',
		'click .messageToUserAccIgnore':'messageToUserAccIgnore',
		'click .messageToUserAcc':'messageToUserAcc',
		'click #updateAccInfo':'updateAccInfo',
		'click #addmoneyToAcc':'addmoneyToAcc',
		'click #payWithCurrentMon':'payWithCurrentMon',
		'click .loadmorefollowershere':'loadmorefollowershere',
		'click .loadmorerequestshere':'loadmorerequestshere',
		'click .loadmorefriendshere':'loadmorefriendshere',
		'keyup .searchforfriendsinprofile':'searchforfriendsinprofile'
		},
		initialize: function(){
			this.listenTo(this.model,'change',this.render);
		},
		onRender: function () {
			if(typeof app.userConnected.data2 !== 'undefined'){
				this.loadmorefriendshere();
			this.loadmorefollowershere();
			this.loadmorerequestshere();
			} else {
			app.vent.on("userConnected:ready", function(){
			this.loadmorefriendshere();
			this.loadmorefollowershere();
			this.loadmorerequestshere();
			}.bind(this));
			}
		},
		payWithCurrentMon: function(e){
			if (typeof app.userConnected != "undefined" && typeof app.userConnected.data2 != "undefined" && 
			typeof app.userConnected.data2.pay != "undefined") {
				var paypurl = this.getUrlOfPaypal(app.userConnected.data2.pay);
				
				if (paypurl !== "") {
					location.href = paypurl;
				}
			}
		},
		getUrlOfPaypal: function(amount){
			var returl = window.location.href;
			var cancurl = window.location.href;
			if (typeof app.userConnected != "undefined" && typeof app.userConnected.data2 != "undefined" && 
			typeof app.userConnected.data2._id != "undefined") {
				var myid = app.userConnected.data2._id;
				return "https://www.paypal.com/cgi-bin/webscr?business=dspocius@gmail.com&item_name=Cloud&cmd=_xclick&no_note=1&lc=LT&currency_code=EUR&item_amount="+amount+"&amount="+amount+"&item_number=1&custom=mycloud;"+myid+"&return="+returl+"&cancel_return="+returl;
			}else{
				return "";
			}
		},
		addmoneyToAcc: function(e){
			var amount = $("#amntpay").val();
			var paypurl = this.getUrlOfPaypal(amount);
			
			if (paypurl !== "") {
				location.href = paypurl;
			}
		},
		loadmorerequestshere: function(e){
			this.loadmorefunctin(e, "requestsdata", "requests");
		},		
		loadmorefollowershere: function(e){
			this.loadmorefunctin(e, "followersdata", "follower");
		},
		loadmorefriendshere: function(e){
			this.loadmorefunctin(e, "approvedfriendsdata", "friends");
		},
		unloadFriendsArr: function(frdata) {
			var arrfr = [];
			for (var i=0; i < frdata.length; i++) {
if (frdata[i] && frdata[i].friends) {
				arrfr.push(frdata[i].friends);
				} else {
				arrfr.push(frdata[i]);
				}			}
			
			return arrfr;
		},
		loadmorefunctin: function(e, modelname, whichmore){
			var approvedfriends = this.model.get(modelname).filter(frr => (frr != 0)).length;
			var th = this;
			
			$.ajax({
			  method: "GET",
			  url: "/loadmorefriends/"+app.userConnected.data2.email+"/"+approvedfriends+"/"+whichmore,
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
			}).always(function (msg) {
				var loadedjson = th.unloadFriendsArr(JSON.parse(msg));
				var friendsMore = this.model.get(modelname);
				var loadedfr = [];
				loadedjson.map(fr => {
					if (fr != 0 && friendsMore.filter(frr => (frr.email === fr.email)).length == 0) {
						loadedfr.push(fr);
					}
				});
				this.model.set(modelname, friendsMore.concat(loadedfr));
			}.bind(this));
		},
		searchforfriendsinprofile: function(e) {
			//approvedfriendsdata
			var th = this;
			var valofsearch = $(e.currentTarget).val();
				if (valofsearch == "") {
					th.model.set("approvedfriendsdatasearch",[]);
					$(".searchforfriendsinprofile").focus();
				}else{
					this.searchforfriends(valofsearch, function(res) {
						//th.model.set("searchtermfrinprofile",valofsearch);
						th.model.set("approvedfriendsdatasearch",res);
						$(".searchforfriendsinprofile").focus();
						$(".searchforfriendsinprofile").val(valofsearch);
					});
				}
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
		updateAccInfo: function(e){
			var firstname_acc = $('#firstname_acc').val();
			var lastname_acc = $('#lastname_acc').val();
			var gender_acc_female = $('#gender_acc_female').is(':checked');
			var gender_acc_male = $('#gender_acc_male').is(':checked');
			var gender = "";
			if (gender_acc_male) {
				gender = "male";
			}else{
				gender = "female";
			}
			var yaddress_acc = $('#yaddress_acc').val();
			var ycode_acc = $('#ycode_acc').val();
			var vatnumb_acc = $('#vatnumb_acc').val();
			var city_acc = $('#city_acc').val();
			var birthday = $('#birthday').val();
			var birthmonth = $('#birthmonth').val();
			var birthyear = $('#birthyear').val();
			var about_name = $('#about_name').val();
			
			var add = {
				firstname_acc:firstname_acc,
				lastname_acc:lastname_acc,
				yaddress:yaddress_acc,
				ycode:ycode_acc,
				vatnumb:vatnumb_acc,
				city_acc:city_acc,
				gender:gender,
				birthday:birthday,
				birthmonth:birthmonth,
				birthyear:birthyear,
				about_name:about_name,
			};
			app.updateUserInfo(add);
			$(".infomessage").show();
			setTimeout(function(){
				$(".infomessage").hide();
			},2000);
		},
		messageToUserAccIgnore: function(e){
			var userId = e.currentTarget.getAttribute('data-user');
			$(".frapprov"+userId).remove();
			$(".frignor"+userId).text("Ignored");
			$(".frignor"+userId).attr("disabled","disabled");
			
			this.sendRequestForAcc(userId, false);
		},
		messageToUserAccApproved: function(e){
			var userId = e.currentTarget.getAttribute('data-user');
			$(".frignor"+userId).remove();
			$(".frapprov"+userId).text("Approved");
			$(".frapprov"+userId).attr("disabled","disabled");
			
			this.sendRequestForAcc(userId, true);
		},
		sendRequestForAcc: function(friendId, approvehim) {
			$.ajax({
			  method: "PUT",
			  url: "/updateuser",
			  data: JSON.stringify({ friendApprove:friendId, approvehim: approvehim }),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json'
			});
		},
		messageToUserAcc: function(e){
			var userId = e.currentTarget.getAttribute('data-user');
			miniChatClicked(userId);
		},
		changeViewOfDefinedClickedTr: function(){
			$("#use_defined_style").trigger("click");
		},
		changeViewOfDefinedClicked: function(){
			if(!$('#use_defined_style').is(':checked')){
				//$('#use_defined_style').removeAttr('checked');
				$("#optional_fields_on_off").hide();
			}else{
				//$('#use_defined_style').attr('checked','checked');
				$("#optional_fields_on_off").show();
			}
		},
		uploadFilesToServer: function(files){
            var fd = new FormData();
            fd.append("project", 'ProjectManagementFiles');
            fd.append("pfiles", 'do_not_update');
            fd.append("username", app.userConnected.data2.email);
            var files_in = '';
			var canUploadIt = true;
            for (var i in files) {
				if (files && files[i] && files[i].name) {
					var fileSizeInMb = files[i].size/1024/1024;
					if(fileSizeInMb >= 25){//25mb
						canUploadIt = false;
					}
					if(files_in == '' && files[i].name != 'undefined' && files[i].name != 'item'){
						files_in = files[i].name;
					}
					fd.append("uploadedFile", files[i]);
					fd.append("uploadedFileName", files[i].name);
				}
			}
			if(canUploadIt){
				$('#projectManagementFilesProg'+' #info_prog').remove();
				var xhr = new XMLHttpRequest();
				xhr.upload.addEventListener("progress", function(oEvent){
					if(!$('#projectManagementFilesProg'+' #progress').length){
						$('#projectManagementFilesProg').append('<div id="progress" style="color:white;background:red;"></div>');
					}
					if (oEvent.lengthComputable) {
						var percentComplete = oEvent.loaded / oEvent.total;
						$('#projectManagementFilesProg'+' #progress').css('height', '10px');
						$('#projectManagementFilesProg'+' #progress').css('width', (percentComplete*100)+'%');
					} else {
						$('#projectManagementFilesProg'+' #progress').html(app.translate('Uploading ... '));
					}
				}.bind(this), false);
				 xhr.addEventListener("load", function(){
					 if(!$('#backround_image').length){ 
						location.reload(); 
					 }else{
						$('#projectManagementFilesProg'+' #progress').remove();
						$('#backround_image').attr("src",config.filesurl+"/files/"+app.userConnected.data2.email+"/"+app.userConnected.data2.email+".jpg?v="+new Date().getTime());
					 }
				 }.bind(this), false);
				//xhr.addEventListener("error", uploadFailed, false);
				//xhr.addEventListener("abort", uploadCanceled, false);
				//xhr.open("POST", "/project_upload");
				xhr.open("PUT", "/uploaduserphoto");
				//scope.progressVisible = true;
				xhr.send(fd);
			}else{
					if(!$('#projectManagementFilesProg'+' #info_prog').length){
						$('#projectManagementFilesProg').append('<div id="info_prog" style="color:white;background:red;">Too big file. Max - 25MB.</div>');
					}
			}
        },
		_fileChangeEvent: function(e){
            if(e.target.getAttribute('identity') == 'ProjectManagementFiles'){
                console.log('files:', e.target.files);
                this.uploadFilesToServer(e.target.files);
                //this.$el.find('#fileToUpload').val('');
            }
        },
		onprojectsUploadFile:function(e){
            if(e.currentTarget.getAttribute('identity') == 'ProjectManagementFiles'){
                this.$el.find('#fileToUpload').trigger('click');
            }
        },
		save_address:function(){
			var country_info = $('#country_info').val();
			var address1_info = $('#address1_info').val();
			var address2_info = $('#address2_info').val();
			var city_info = $('#city_info').val();
			var state_info = $('#state_info').val();
			var zip_code_info = $('#zip_code_info').val();
			var telephone_info = $('#telephone_info').val();
			if(country_info !== "" && address1_info !== "" && address2_info !== "" && city_info !== "" && zip_code_info !== "" && telephone_info !== ""){
				var addressOfUser = {
					country_info:country_info,
					address1_info:address1_info,
					address2_info:address2_info,
					city_info:city_info,
					state_info:state_info,
					zip_code_info:zip_code_info,
					telephone_info:telephone_info
				};
				var addressOk = JSON.stringify(addressOfUser);
				app.updateUserAddress(addressOk);
				location.reload();
			}
		},
		changeSettings:function(){
			var color = $('#settingColor').val();
			var websiteStyle = $('#websiteStyle').val();
			var backgroundPicture = $('#backgroundPicture').val();
			var borderRadius = $('#borderRadius').val();
			var listsColor = $('#listsColor').val();
			var entryColor = $('#entryColorrr').val();
			var innerIconsColor = $('#innerIconsColor').val();
			var outerIconsColor = $('#outerIconsColor').val();
			var defaultViewOfSite = $('#defaultViewOfSite').val();
			var use_defined_style = "";
			if($('#use_defined_style').is(':checked')){
				use_defined_style = "true";
			}
			this.trigger('change:settings',{use_defined_style:use_defined_style, defaultViewOfSite:defaultViewOfSite, outerIconsColor:outerIconsColor, innerIconsColor:innerIconsColor, entryColor:entryColor, listsColor:listsColor, borderRadius:borderRadius, backgroundPicture:backgroundPicture, color:color, websiteStyle:websiteStyle});
		}
    });
});
