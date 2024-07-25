/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({

    paths: {
        'angular': '../lib/angular/angular',
        'angular-sanitize': '../lib/angular-sanitize/angular-sanitize',
        'angular-route': '../lib/angular-route/angular-route',
        'domReady': '../lib/requirejs-domready/domReady',
        'jquery': '../lib/jquerymin',
        //'socket':'../../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io'
        'socket':'/socket.io/socket.io'
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular',
            deps:['jquery']
        },
        'angular-route': {
            deps: ['angular']
        }
    },

    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
