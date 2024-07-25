define([
    '../../../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/settings.html'
], function (app, templateHelpers, _, Marionette, templ) {
    'use strict';

    return Marionette.ItemView.extend({
		templateHelpers:templateHelpers,
        template: templ,
		ui:{
			changeSettings:'#changeSettings',
			settingColor:'#settingColor'
		},
		events:{
		'click .add_new_meniu_links':'add_new_meniu_links',
		'click #changeSettings':'changeSettings',
		'click .projectsUploadFile':'onprojectsUploadFile',
		'change #fileToUpload':'_fileChangeEvent',
		'change #fileToUploadAccount':'_fileChangeEvent',
		'click #use_def_style':'changeViewOfDefinedClickedTr',
		'change #use_defined_style':'changeViewOfDefinedClicked'
		},
		add_new_meniu_links: function(e){
			var meniu_links = '<div>Link: <input style="width:300px;" type="text" class="urls_link" value="" />';
			meniu_links += ' Name: <input style="width:300px;" type="text" class="urls_name" value="" /></div>';
			$(".settings_meniu_links_here").append(meniu_links);
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
		uploadFilesToServer: function(files, acc){
            var fd = new FormData();
            fd.append("project", 'ProjectManagementFiles');
            fd.append("pfiles", 'do_not_update');
            var files_in = '';
			var canUploadIt = true;
            for (var i in files) {
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
			if(canUploadIt){
				$('#projectManagementFilesProg'+' #info_upload').remove();
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
					 $('#projectManagementFilesProg'+' #progress').remove();
					 if(typeof acc !== "undefined" && acc !== ""){
						 $('#backgroundPictureAccount').val(files_in);
					 }else{
						 $('#backgroundPicture').val(files_in);
					 }
				 }.bind(this), false);
				//xhr.addEventListener("error", uploadFailed, false);
				//xhr.addEventListener("abort", uploadCanceled, false);
				xhr.open("POST", "/project_upload");
				//scope.progressVisible = true;
				xhr.send(fd);
			}else{
					if(!$('#projectManagementFilesProg'+' #info_upload').length){
						$('#projectManagementFilesProg').append('<div id="info_upload" style="color:white;background:red;">Too big file. Max - 25MB.</div>');
					}
			}
        },
		_fileChangeEvent: function(e){
            if(e.target.getAttribute('identity') == 'ProjectManagementFiles'){
                console.log('files:', e.target.files);
                this.uploadFilesToServer(e.target.files);
                //this.$el.find('#fileToUpload').val('');
            }
            if(e.target.getAttribute('identity') == 'ProjectManagementFilesAccount'){
                console.log('files:', e.target.files);
                this.uploadFilesToServer(e.target.files, "ok");
                //this.$el.find('#fileToUpload').val('');
            }
        },
		onprojectsUploadFile:function(e){
            if(e.currentTarget.getAttribute('identity') == 'ProjectManagementFilesAccount'){
                this.$el.find('#fileToUploadAccount').trigger('click');
            }
            if(e.currentTarget.getAttribute('identity') == 'ProjectManagementFiles'){
                this.$el.find('#fileToUpload').trigger('click');
            }
        },
		changeSettings:function(){
			var info_about = $('#info_about').val();
			var color = $('#settingColor').val();
			var textbackgroundcolor = $('#textbackgroundcolor').val();
			var websiteStyle = "Default";
			var backgroundPicture = $('#backgroundPicture').val();
			var borderRadius = "0";
			var listsColor = $('#listsColor').val();
			var entryColor = $('#entryColorrr').val();
			var innerIconsColor = $('#innerIconsColor').val();
			var outerIconsColor = $('#outerIconsColor').val();
			var make_old_when = $('#make_old_when').val();
			var defaultViewOfSite = $('#defaultViewOfSite').val();
			var defaultVisibilityAdded = $('#defaultVisibilityAdded').val();
			var default_show_information_tips = $('#default_show_information_tips').val();
			var defaultEntryViewWhenAdded = $('#defaultEntryViewWhenAdded').val();
			
			var urls_links = "";
			$( ".urls_link" ).each(function( index ) {
				var url_link = $( ".urls_link" ).eq(index).val();
				var url_name = $( ".urls_name" ).eq(index).val();
				var regex = /(<([^>]+)>)/ig;
				var regexkav = /,/ig;
				url_link = url_link.replace(regex, "");
				url_link = url_link.replace(regexkav, "");
				url_name = url_name.replace(regex, "");
				url_name = url_name.replace(regexkav, "");
				if(typeof url_link != "" && url_link != ""){
					if(typeof url_name != "" && url_name != ""){
						urls_links += ";"+url_link+","+url_name;
					}
				}
			});
			var urls = urls_links;
			var regexxxx = /(<([^>]+)>)/ig;
			info_about = info_about.replace(regexxxx, "");
			var use_defined_style = "";
			var backgroundPictureAccount = $('#backgroundPictureAccount').val();
			if(!$('#useBackgroundpictureAccount').is(':checked')){
				backgroundPictureAccount = "";
			}
			if(!$('#usebackgroundcolor').is(':checked')){
				backgroundPicture = "";
			}
			if($('#use_defined_style').is(':checked')){
				use_defined_style = "true";
			}
			this.trigger('change:settings',{use_defined_style:use_defined_style, defaultViewOfSite:defaultViewOfSite, outerIconsColor:outerIconsColor, innerIconsColor:innerIconsColor, entryColor:entryColor, listsColor:listsColor, borderRadius:borderRadius, backgroundPicture:backgroundPicture, color:color, websiteStyle:websiteStyle, textbackgroundcolor:textbackgroundcolor, make_old_when:make_old_when, urls:urls, info_about:info_about, backgroundPictureAccount:backgroundPictureAccount, defaultVisibilityAdded:defaultVisibilityAdded, defaultEntryViewWhenAdded:defaultEntryViewWhenAdded, default_show_information_tips:default_show_information_tips});
		}
    });
});
/*
		<div>
		<%= translate("Border radius (in pixels):") %> <input type="number" id="borderRadius" value="<%=borderRadius %>" />
		</div>
		
		<div><%= translate("Style:") %>
			<select id="websiteStyle">
				<option value="Default"><%= translate("Default") %></option>
				<option value="gray_blue"><%= translate("Gray - blue") %></option>
			</select>
		</div>
*/