function touchHandler(event) {
    var self = this;
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch (event.type) {
        case "touchstart":
            type = "mousedown";
            window.startY = event.pageY;
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /*left*/ , null);

    first.target.dispatchEvent(simulatedEvent);

    var scrollables = [];
    var clickedInScrollArea = false;
    // check if any of the parents has is-scollable class
    var parentEls = jQuery(event.target).parents().map(function() {
        try {
            if (jQuery(this).hasClass('is-scrollable')) {
                clickedInScrollArea = true;
                // get vertical direction of touch event
                var direction = (window.startY < first.clientY) ? 'down' : 'up';
                // calculate stuff... :o)
                if (((jQuery(this).scrollTop() <= 0) && (direction === 'down')) || ((jQuery(this).height() <= jQuery(this).scrollTop()) && (direction === 'up')) ){

                } else {
                    scrollables.push(this);
                }
            }
        } catch (e) {}
    });
    // if not, prevent default to prevent bouncing
    if ((scrollables.length === 0) && (type === 'mousemove') && window.dragStarted) {
        event.preventDefault();
    }

}

function initTouchHandler() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);

}

/*
$(document).ready(function() {
    initTouchHandler();

});*/
