define([
	'backbone',
    '../../../app',
    'models/base',
    'underscore',
    '../views/accountView',
    'models/project'
], function( backbone,app, base, _, accountView, project ) {
    return base.extend({
        show: function(options){
			app.vent.trigger('top:leftmenu:show');
				var commentsCol = new backbone.Model();
				commentsCol.set('lastname', "");
				commentsCol.set('firstname', "");
				commentsCol.set('username', "");
				commentsCol.set('backgroundPicture', "");
				commentsCol.set('friends', []);
					if(typeof app.userConnected.data2 !== 'undefined'){
						commentsCol.set('friends',app.userConnected.data2.friends);
						commentsCol.set('username',app.userConnected.data2.email);
						commentsCol.set('firstname',app.userConnected.data2.firstname);
						commentsCol.set('lastname',app.userConnected.data2.lastname);
						commentsCol.set('backgroundPicture',app.userConnected.data2.pic);
					}else{
						app.vent.on("userConnected:ready", function(){
							commentsCol.set('friends',app.userConnected.data2.friends);
							commentsCol.set('lastname',app.userConnected.data2.lastname);
							commentsCol.set('firstname',app.userConnected.data2.firstname);
							commentsCol.set('username',app.userConnected.data2.email);
							commentsCol.set('backgroundPicture',app.userConnected.data2.pic);
						});
					}
				var cView = new accountView({model: commentsCol});
				//commentsCol.url = '/commentsU/projectsManagement/'+0+'/true';
				//commentsCol.fetch().done(function(){
				//}.bind(this));
			this.listenTo(cView,'change:settings',function(obj){
				//var objj = {from:'color', message:obj.color};
				//var commentNew = new backbone.Model();
				//commentNew.set('message',[objj, obj2, obj3,obj4, obj5, obj6, obj7, obj8, obj9, obj10]);
				//commentNew.set('idd',commentsCol.get('_id'));
                //commentNew.url = '/commentReset';
				//commentNew.save();
				location.reload();
			});
			app.main.show(cView);
        }
    });
});