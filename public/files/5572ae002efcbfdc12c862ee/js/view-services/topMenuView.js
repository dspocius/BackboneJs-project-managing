/* PROTOTYPE BASED INHERITANCE */
define(['./module'], function (services) {
    'use strict';
    services.factory('topMenuView', ['common', 'viewRow','authentication', function (common, viewRow, authentication) {
        return function(data, scope){
            var thisView = function(){
                this.ui = {
                    menuLeftTop: '#main-nav-left ul',
                    menuRightTop: '#main-nav ul',
                    leftMenu: '#left-menu'
                };
                this.initializeScopeListening = function(){
                    scope.$on('left:menu:click', function(event, item) {
                        if(item.name === 'closeMenu'){
                            this.toggleLeftMenu();
                        }
                        if(item.name === 'menuConvBack'){
                            common.trigger('menu:conv:back');
                        }
                        if(item.name === 'menuOpen'){
                            this.toggleLeftMenu();
                        }
                    }.bind(this));
                }
                this.initializeDefaultMenu = function(){
                    this.addMenuItemTopLeft({button:'glyphicon-menu-hamburger',name:'menuOpen'});
                    //this.addMenuItemInnerLeft({_id:'closeMenu', div:'rightitem',glyphicon:'glyphicon-chevron-right',name:'closeMenu'});
                    var auth = new authentication();
                    auth.connectedUser(function(data){
                        for(var i=0; i < data.programs.length; i++){
                            this.addMenuItemInnerLeft({_id:data.programs[i]._id, link:'/files/'+data.programs[i]._id+'/index.html',name:common.translate(data.programs[i].name)});
                        }
                        this.addMenuItemInnerLeft({_id:'Logout', link:'#logout',name:'{{"Logout" | translate}}'});
                    }.bind(this));
                }
                this.menuForConversation = function(){
                    this.addMenuItemTopLeft({button:'glyphicon-arrow-left',name:'menuConvBack'});
                }
                this.toggleLeftMenu = function(){
                    $(this.ui.leftMenu).toggle();
                }
                this.setToDefault = function(){
                    $(this.ui.menuLeftTop).html('');
                    $(this.ui.menuRightTop).html('');
                    $(this.ui.leftMenu+' ul').html('');
                }
                scope.leftMenuClick = function(itemName){
                    common.trigger('left:menu:click',{name:itemName});
                }
                this.leftMenuInnerItems = [];
                this.leftMenuItems = [];
                this.rightMenuItems = [];
                this.addMenuItemTopLeft = function(model){
                    this.leftMenuItems.push(model);
                    model._id = model.name;
                    var html = this.htmlTemplate(model);
                    this.renderHtmlInParent(html,model,this.ui.menuLeftTop,'','li');
                }
                this.addMenuItemInnerLeft = function(model){
                    this.leftMenuInnerItems.push(model);
                    var html = this.htmlTemplate(model);
                    this.renderHtmlInParent(html,model,this.ui.leftMenu+' ul','','li');
                }
                this.htmlTemplate = function(model){
                    var html = '';
                    if(typeof model.button != 'undefined'){
                        var inHtml = '<div class="glyphicon '+model.button+' icon-in-menu icon-turn-off" aria-hidden="true"></div>';
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
                    return html;
                }
            };
            thisView.prototype = new viewRow(data, scope, '');
            thisView.prototype.constructor=thisView;
            return new thisView();
        }
    }]);
});
