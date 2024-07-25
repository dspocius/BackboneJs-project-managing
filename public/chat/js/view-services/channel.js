define(['./module'], function (services) {
    'use strict';
    services.factory('viewChannel', ['common', function (common) {
        return {
            ui: {
                text:'#homeTextUser',
                messages:'#messagesContainer'
            },
            initializeScopeListening: function (scope) {
				scope.menuItemRightPeopleClick = function(menu, grid){
					$('.showingInPeople').hide();
					$('.showingInPeople').removeClass('showingInPeople');
					$('.menuItemSelected').removeClass('menuItemSelected');
					$('#'+menu).addClass('menuItemSelected');
					$('#'+grid).addClass('showingInPeople');
					$('#'+grid).show();
				};
            }
        };
    }]);
});
