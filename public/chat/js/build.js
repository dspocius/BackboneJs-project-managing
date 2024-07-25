({
    appDir: './',
    baseUrl: './',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        'angular': '../lib/angular/angular',
        'angular-sanitize': '../lib/angular-sanitize/angular-sanitize',
        'angular-route': '../lib/angular-route/angular-route',
        'domReady': '../lib/requirejs-domready/domReady',
        'jquery': '../lib/jquerymin'
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
    ]//node r.js -o build.js
})