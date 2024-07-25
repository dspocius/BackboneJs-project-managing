define([
	'backbone',
    '../../../app',
    'models/base',
    'underscore',
    '../views/settingsView',
    'models/project'
], function( backbone,app, base, _, settingsView, project ) {
    return base.extend({
        show: function(options){
			app.vent.trigger('top:leftmenu:show');
				var commentsCol = new backbone.Model();
				commentsCol.set('color','#80BCF0');
				commentsCol.set('backgroundPicture','');
				commentsCol.set('borderRadius','0');
				commentsCol.set('listsColor','#80BCF0');
				commentsCol.set('entryColor','#80BCF0');
				commentsCol.set('innerIconsColor','#80BCF0');
				commentsCol.set('outerIconsColor','#80BCF0');
				commentsCol.set('defaultViewOfSite','board_view_show');
				commentsCol.set('use_defined_style','');

				var cView = new settingsView({model: commentsCol});
				commentsCol.url = '/commentsU/projectsManagement/'+0+'/true';
				commentsCol.fetch().done(function(){
					var outerIconsColor = this.getSetting(commentsCol, 'outerIconsColor');
					var innerIconsColor = this.getSetting(commentsCol, 'innerIconsColor');
					var listsColor = this.getSetting(commentsCol, 'listsColor');
					var entryColor = this.getSetting(commentsCol, 'entryColor');
					var borderRadius = this.getSetting(commentsCol, 'borderRadius');
					var backgroundPicture = this.getSetting(commentsCol, 'backgroundPicture');
					var color = this.getSetting(commentsCol, 'color');
					var websiteStyle = this.getSetting(commentsCol, 'websiteStyle');
					var defaultViewOfSite = this.getSetting(commentsCol, 'defaultViewOfSite');
					var use_defined_style = this.getSetting(commentsCol, 'use_defined_style');
					
					cView.render();
					$('#websiteStyle').val(websiteStyle);
					$('#defaultViewOfSite').val(defaultViewOfSite);
					$('#settingColor').val(color);
					$('#listsColor').val(listsColor);
					$('#entryColorrr').val(entryColor);
					$('#backgroundPicture').val(backgroundPicture);
					$('#borderRadius').val(borderRadius);
					$('#innerIconsColor').val(innerIconsColor);
					$('#outerIconsColor').val(outerIconsColor);
					
					if(use_defined_style != ''){
						$('#use_defined_style').attr('checked','checked');
						$("#optional_fields_on_off").show();
					}
					
				}.bind(this));
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
				var commentNew = new backbone.Model();
				commentNew.set('message',[objj, obj2, obj3,obj4, obj5, obj6, obj7, obj8, obj9, obj10]);
				commentNew.set('idd',commentsCol.get('_id'));
                commentNew.url = '/commentReset';
				commentNew.save();
				location.reload();
			});
			app.main.show(cView);
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