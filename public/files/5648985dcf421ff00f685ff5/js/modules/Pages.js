define([
    'app',
    'marionette',
    'routers/index',
    'controllers/index'
], function(app, Marionette, Router, Controller){
    var PagesModule = app.module("Pages", function(Pages) {
        this.startWithParent = false;

        this.addInitializer(function(){
            this.router = new Router({ controller: Controller });
        });


    });

//    PagesModule.addFinalizer(function(){
//        app.someRegion.close();
//    });

    return PagesModule;
});