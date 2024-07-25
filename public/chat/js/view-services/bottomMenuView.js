/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('bottomMenuView', ['common', 'viewRow', 'authentication', function (common, viewRow, authentication) {
        return function(data, scope){
            var thisView = function(){
                this.ui = {
                    footerNavCenter: '#footer-nav-center ul',
                    footerNavLeft: '#footer-nav-left ul',
                    footerNavRight: '#footer-nav-right ul'
                };
                scope.leftMenuClick = function(itemName){
                    common.trigger('left:menu:click',{name:itemName});
                }
                this.footerNavCenter = [];
                this.initializeDefaultMenu = function(active){
                    var homeAdd = 'class="padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"';
                    var nonFilterAdd = 'class="padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"';
                    var nonFilterAddLeftBorder = 'class="menuRightHere padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"';
                    var peopleAdd = 'class="padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"';
                    var menuAdd = 'class="padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80 showalsoonmobile"';
                    var channelsAdd = 'class="padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"';
                    if(active == common.translate('Home')){ homeAdd = 'class="active padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"'; }
                    if(active == common.translate('People')){ peopleAdd = 'class="active padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"'; }
                    if(active == common.translate('Channels')){ channelsAdd = 'class="active padding10 backgroundOrange marginleft2 relativezindex defaultLinkOf defaultMenuLink width80"'; }
                    $('.active').removeClass('active');
                    $('#'+active).addClass('active');
					var auth = new authentication();
					auth.checkLogin(function(){});
					
					setTimeout(function(){
						if(!$('#Messaging').length){
						var userHtmlImg = "<div style='display:none;' class='profileHereWithPhoto hereProfilePhoto'></div><div class='profileHereGlyph glyphicon glyphicon-user icon-in-menu icon-turn-off'></div>";
						if (typeof window.authenticationInfo != "undefined" && 
						window.authenticationInfo.pic != "") {
							userHtmlImg = '<div class="friend_front_page_cont hereProfilePhoto" id="friends_photo_container"><img id="friends_photo" src="/files/'+window.authenticationInfo.username+'/'+window.authenticationInfo.pic+'" alt="" /></div>';
						}
						
						//this.addMenuFooterCenter({mel:homeAdd, linktext:'/',glyphicon:'glyphicon-home',name:common.translate('Home')});
						this.addMenuFooterCenter({mel:nonFilterAdd, linktext:'#/home',glyphicon:'glyphicon-comment',name:common.translate('Messaging')});
						this.addMenuFooterCenter({mel:peopleAdd, linktext:'/#account',html: userHtmlImg,name:common.translate('Me')});
						this.addMenuFooterCenter({mel:menuAdd, button:'glyphicon-menu-hamburger',glyphicon:'glyphicon-menu-hamburger',name:common.translate('Menu')});
						this.addMenuFooterCenter({mel:nonFilterAddLeftBorder, linktext:'#/people',glyphicon:'glyphicon-user',name:common.translate('People')});
						this.addMenuFooterCenter({mel:channelsAdd, linktext:'#/channels',glyphicon:'glyphicon-equalizer',name:common.translate('Channels')});
						}
					}.bind(this),300);
				}
                this.setToDefault = function(){
                    $(this.ui.footerNavLeft).html('');
                    $(this.ui.footerNavCenter).html('');
                    $(this.ui.footerNavRight).html('');
                }
                this.addMenuFooterCenter = function(model){
					var exiss = true;
					for(var ii=0; ii < this.footerNavCenter.length; ii++){
						if(this.footerNavCenter[ii].name == model.name){
							exiss = false;
						}
					}
					if(exiss){
						this.footerNavCenter.push(model);
						var html = this.htmlTemplate(model);
						model._id = model.name;
						var el = '';
						if(typeof model.mel != 'undefined'){
							el = model.mel;
						}
						this.renderHtmlInParent(html,model,this.ui.footerNavCenter,el,'li');
					}
                }
                this.htmlTemplate = function(model){
                    var html = '';
                    if(typeof model.button != 'undefined'){
                        var inHtml = '<div class="glyphicon '+model.button+' icon-in-menu icon-turn-off" aria-hidden="true"></div><div>'+model.name+'</div>';
                        html = '<button ng-click="leftMenuClick('+"'"+model.name+"'"+')" id="menitem">'+inHtml+'</button>';
                    }
                    if(typeof model.link != 'undefined'){
                        html = '<a href="'+model.link+'">'+model.name+'</a>';
                    }
                    if(typeof model.div != 'undefined'){
                        var glyph = '';
                        if(typeof model.glyphicon != 'undefined'){
                            glyph = '<div ng-click="leftMenuClick('+"'"+model.name+"'"+')" class="glyphicon '+model.glyphicon+' icon-in-menu icon-turn-off" aria-hidden="true"></div>';
                        }
                        html = '<div id="'+model.div+'">'+glyph+'</div>';
                    }
                    if(typeof model.linktext != 'undefined'){
                        var glyph = '';
                        var itemText = '';
                        if(typeof model.glyphicon != 'undefined'){
                            glyph = '<div class="glyphicon '+model.glyphicon+' icon-in-menu icon-turn-off" aria-hidden="true"></div>';
                        }                        
						if(typeof model.html != 'undefined'){
                            glyph = model.html;
                        }
                        if(typeof model.name != 'undefined'){
                            itemText = '<div>'+model.name+'</div>';
                        }
                        html = '<a href="'+model.linktext+'">'+glyph+itemText+'</a>';
                    }
                    return html;
                }
            };
            thisView.prototype = new viewRow(data, scope, '');
            thisView.prototype.constructor=thisView;
            return new thisView();
        }
    }]);
});
