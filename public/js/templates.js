/*global define */

define(function (require) {
	'use strict';
	var urll = 'http://159.89.227.26:8001';
	urll = window.location.protocol+"//"+window.location.host;
	
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
        //urlAddr: 'http://192.168.1.71'
        //urlAddr: 'http://diocas.net'
        //urlAddr: 'https://waymanage.com'
        urlAddr: urll
        //urlAddr: 'http://78.61.3.32:80'
        //urlAddr: 'http://78.61.3.32:81'
        //urlAddr: 'http://88.222.178.254:81'
		//urlAddr: 'http://localhost:80'
	};
});

