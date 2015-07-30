/*global define */

define(function (require) {
	'use strict';

	return {
        pages : {
          home: require('tpl!templates/pages/home.html'),
          about: require('tpl!templates/pages/about.html'),
          contact: require('tpl!templates/pages/contact.html')
        },
        page: require('tpl!templates/page.html'),
        menuItem: require('tpl!templates/menuItem.html'),
		footer: require('tpl!templates/footer.html'),
        empty: require('tpl!templates/empty.html'),
        urlAddr: 'http://78.61.3.32:81'
        //urlAddr: 'http://88.222.178.254:81'
	};
});

