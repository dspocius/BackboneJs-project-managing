define([
	'backbone',
    '../../../app',
    '../../../config',
    'models/base',
    'underscore',
    '../views/settingsView',
    'models/project'
], function( backbone,app, config, base, _, settingsView, project ) {
    return base.extend({
        show: function(options){
			app.vent.trigger('top:leftmenu:show');
				var commentsCol = app.getSettingsCol();

				var cView = new settingsView({model: commentsCol});
				app.main.show(cView);
				//commentsCol.fetch().done(function(){
					var info_about = this.getSetting(commentsCol, 'info_about');
					var make_old_when = this.getSetting(commentsCol, 'make_old_when');
					var outerIconsColor = this.getSetting(commentsCol, 'outerIconsColor');
					var innerIconsColor = this.getSetting(commentsCol, 'innerIconsColor');
					var listsColor = this.getSetting(commentsCol, 'listsColor');
					var entryColor = this.getSetting(commentsCol, 'entryColor');
					//var borderRadius = this.getSetting(commentsCol, 'borderRadius');
					var backgroundPicture = this.getSetting(commentsCol, 'backgroundPicture');
					var color = this.getSetting(commentsCol, 'color');
					var websiteStyle = this.getSetting(commentsCol, 'websiteStyle');
					var textbackgroundcolor = this.getSetting(commentsCol, 'textbackgroundcolor');
					var defaultViewOfSite = this.getSetting(commentsCol, 'defaultViewOfSite');
					var defaultVisibilityAdded = this.getSetting(commentsCol, 'defaultVisibilityAdded');
					var defaultEntryViewWhenAdded = this.getSetting(commentsCol, 'defaultEntryViewWhenAdded');
					var default_show_information_tips = this.getSetting(commentsCol, 'default_show_information_tips');
					var use_defined_style = this.getSetting(commentsCol, 'use_defined_style');
					var backgroundPictureAccount = this.getSetting(commentsCol, 'backgroundPictureAccount');
					var urls = this.getSetting(commentsCol, 'urls');
					commentsCol.set("urls", urls);
					cView.render();
					if(make_old_when !== ""){
						$('#make_old_when').val(make_old_when);
					}
					$('#info_about').val(info_about);
					$('#textbackgroundcolor').val(textbackgroundcolor);
					$('#backgroundPictureAccount').val(backgroundPictureAccount);
					$('#websiteStyle').val(websiteStyle);
					$('#defaultViewOfSite').val(defaultViewOfSite);
					$('#defaultVisibilityAdded').val(defaultVisibilityAdded);
					$('#defaultEntryViewWhenAdded').val(defaultEntryViewWhenAdded);
					$('#default_show_information_tips').val(default_show_information_tips);
					$('#settingColor').val(color);
					$('#listsColor').val(listsColor);
					$('#entryColorrr').val(entryColor);
					$('#backgroundPicture').val(backgroundPicture);
					//$('#borderRadius').val(borderRadius);
					$('#innerIconsColor').val(innerIconsColor);
					$('#outerIconsColor').val(outerIconsColor);
					if(use_defined_style != ''){
						$('#use_defined_style').attr('checked','checked');
						$("#optional_fields_on_off").show();
					}
					
				//}.bind(this));
			this.listenTo(cView,'change:settings',function(obj){
				var objj = {from:'color', message:obj.color};
				var obj2 = {from:'websiteStyle', message:obj.websiteStyle};
				var obj3 = {from:'backgroundPicture', message:obj.backgroundPicture};
				var obj4 = {from:'borderRadius', message:obj.borderRadius};
				var obj5 = {from:'listsColor', message:obj.listsColor};
				var obj6 = {from:'entryColor', message:obj.entryColor};
				var obj7 = {from:'outerIconsColor', message:obj.outerIconsColor};
				var obj8 = {from:'innerIconsColor', message:obj.innerIconsColor};
				var obj9 = {from:'defaultViewOfSite', message:obj.defaultViewOfSite};
				var obj10 = {from:'use_defined_style', message:obj.use_defined_style};
				var obj11 = {from:'textbackgroundcolor', message:obj.textbackgroundcolor};
				var obj12 = {from:'make_old_when', message:obj.make_old_when};
				var obj13 = {from:'urls', message:obj.urls};
				var obj14 = {from:'info_about', message:obj.info_about};
				var obj15 = {from:'backgroundPictureAccount', message:obj.backgroundPictureAccount};
				var obj16 = {from:'defaultVisibilityAdded', message:obj.defaultVisibilityAdded};
				var obj17 = {from:'defaultEntryViewWhenAdded', message:obj.defaultEntryViewWhenAdded};
				var obj18 = {from:'default_show_information_tips', message:obj.default_show_information_tips};
				var commentNew = new backbone.Model();
				commentNew.set('message',[objj, obj2, obj3,obj4, obj5, obj6, obj7, obj8, obj9, obj10, obj11, obj12, obj13, obj14, obj15, obj16, obj17, obj18]);
				commentNew.set('idd',commentsCol.get('_id'));
                commentNew.url = config.urlAddr+'/commentReset';
				commentNew.save();
				setTimeout(function(){
					location.reload();
				}, 1000);
			});
        },
		getSetting:function(model, value){
			var arrays = model.get('messages');
			var confValue = '';
			for(var i=0; i < arrays.length; i++){
				if(arrays[i].from === value){
					confValue = arrays[i].message;
				}
			}
			return confValue;
		}
    });
});