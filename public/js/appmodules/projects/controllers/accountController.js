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
				commentsCol.set('pay', "");
				commentsCol.set('moneyhas', "");
			    commentsCol.set('userid', "");
				commentsCol.set('firstname', "");
				commentsCol.set('username', "");
				commentsCol.set('city', "");
				commentsCol.set('yaddress', "");
				commentsCol.set('ycode', "");
				commentsCol.set('vatnumb', 0);
				commentsCol.set('gender', "");
				commentsCol.set('birthday', 0);
				commentsCol.set('birthmonth', 0);
				commentsCol.set('birthyear', 0);
				commentsCol.set('about', "");
				commentsCol.set('countfriendshere', 0);
				commentsCol.set('followerscount', 0);
				commentsCol.set('requestscount', 0);
				commentsCol.set('backgroundPicture', "");
				commentsCol.set('friends', []);
				commentsCol.set('searchtermfrinprofile', "");
				commentsCol.set('approvedfriendsdatasearch', []);
				commentsCol.set('approvedfriends', []);
				commentsCol.set('approvedfriendsdata', []);
				commentsCol.set('followersdata', []);
				commentsCol.set('requestsdata', []);
				commentsCol.set('backgroundPictureAccount',"");
				commentsCol.set('address', {
					country_info:"",
					address1_info:"",
					address2_info:"",
					city_info:"",
					state_info:"",
					zip_code_info:"",
					telephone_info:""
				});
					if(typeof app.userConnected.data2 !== 'undefined'){
						commentsCol.set('friends',app.userConnected.data2.friends);
						commentsCol.set('approvedfriends',app.userConnected.data2.approvedfriends);
						commentsCol.set('username',app.userConnected.data2.email);
						commentsCol.set('firstname',app.userConnected.data2.firstname);
						commentsCol.set('lastname',app.userConnected.data2.lastname);
						commentsCol.set('backgroundPicture',app.userConnected.data2.pic);
						commentsCol.set('city',app.userConnected.data2.city);
						commentsCol.set('yaddress',app.userConnected.data2.yaddress);
						commentsCol.set('ycode',app.userConnected.data2.ycode);
						commentsCol.set('vatnumb',app.userConnected.data2.vatnumb);
						commentsCol.set('gender',app.userConnected.data2.gender);
						commentsCol.set('birthday',app.userConnected.data2.birthday);
						commentsCol.set('birthmonth',app.userConnected.data2.birthmonth);
						commentsCol.set('birthyear',app.userConnected.data2.birthyear);
						commentsCol.set('pay',app.userConnected.data2.pay);
						commentsCol.set('userid',app.userConnected.data2._id);
						commentsCol.set('moneyhas',app.userConnected.data2.moneyhas);
						var countlogged = 0;
						var followerscnt = 0;
						var requestscount = 0;
						if (typeof app.countinfoaboutloggeduser != "undefined") {
							countlogged = app.countinfoaboutloggeduser.approvedfriendscount;
							followerscnt = app.countinfoaboutloggeduser.followerscount;
							requestscount = app.countinfoaboutloggeduser.requestscount;
						}
						commentsCol.set('followerscount',followerscnt);
						commentsCol.set('requestscount',requestscount);
						commentsCol.set('countfriendshere',countlogged);
						//commentsCol.set('address',app.userConnected.data2.address);
						var abb = "";
						if (typeof app.userConnected.data2.about != "undefined") {
							abb = app.userConnected.data2.about;
						}
						commentsCol.set('about',abb.replace(new RegExp('<br>','g'), '\n'));
						if (app.getSettingInWhole("backgroundPictureAccount") != "") {
							commentsCol.set('backgroundPictureAccount',app.getSettingInWhole("backgroundPictureAccount"));
						}
					}else{
						app.vent.on("userConnected:ready", function(){
							commentsCol.set('friends',app.userConnected.data2.friends);
							commentsCol.set('approvedfriends',app.userConnected.data2.approvedfriends);
							commentsCol.set('lastname',app.userConnected.data2.lastname);
							commentsCol.set('firstname',app.userConnected.data2.firstname);
							commentsCol.set('username',app.userConnected.data2.email);
							commentsCol.set('backgroundPicture',app.userConnected.data2.pic);
							//commentsCol.set('address',app.userConnected.data2.address);
							commentsCol.set('city',app.userConnected.data2.city);
							commentsCol.set('yaddress',app.userConnected.data2.yaddress);
							commentsCol.set('ycode',app.userConnected.data2.ycode);
							commentsCol.set('vatnumb',app.userConnected.data2.vatnumb);
							commentsCol.set('gender',app.userConnected.data2.gender);
							commentsCol.set('birthday',app.userConnected.data2.birthday);
							commentsCol.set('birthmonth',app.userConnected.data2.birthmonth);
							commentsCol.set('birthyear',app.userConnected.data2.birthyear);
							commentsCol.set('moneyhas',app.userConnected.data2.moneyhas);
							commentsCol.set('pay',app.userConnected.data2.pay);
						    commentsCol.set('userid',app.userConnected.data2._id);

							var countlogged = 0;
							var followerscnt = 0;
							var requestscount = 0;
							if (typeof app.countinfoaboutloggeduser != "undefined") {
								countlogged = app.countinfoaboutloggeduser.approvedfriendscount;
								followerscnt = app.countinfoaboutloggeduser.followerscount;
								requestscount = app.countinfoaboutloggeduser.requestscount;
							}
							commentsCol.set('requestscount',requestscount);
							commentsCol.set('followerscount',followerscnt);
							commentsCol.set('countfriendshere',countlogged);
							
							var abb = "";
							if (typeof app.userConnected.data2.about != "undefined") {
								abb = app.userConnected.data2.about;
							}
							commentsCol.set('about',abb.replace(new RegExp('<br>','g'), '\n'));

							if (app.getSettingInWhole("backgroundPictureAccount") != "") {
								commentsCol.set('backgroundPictureAccount',app.getSettingInWhole("backgroundPictureAccount"));
							}
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