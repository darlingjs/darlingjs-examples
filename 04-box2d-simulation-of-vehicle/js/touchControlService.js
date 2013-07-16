/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 *
 * define on which part of screen Gamer has touch
 * and update touch control
 *
 */

game.factory('TouchService', ['$rootScope', function($rootScope) {
    'use strict';

    var NONE_SIDE_STATE = 0,
        LEFT_SIDE_STATE = 1,
        RIGHT_SIDE_STATE = 2;

    var ctrlState = NONE_SIDE_STATE,
        middle = window.innerWidth / 2;

    window.addEventListener('resize', resizeHandle, false);

    function resizeHandle() {
        middle = document.width / 2;
    }

    function fingerAt(x, y) {
        if (x < middle) {
            setState(LEFT_SIDE_STATE);
        } else {
            setState(RIGHT_SIDE_STATE);
        }
    }

    function setState(value) {
        if (ctrlState === value) {
            return;
        }

        ctrlState = value;

        $rootScope.$broadcast('change-touch-control-state', value);
    }

//    Touch

    document.addEventListener("touchstart", touchStartHandler, false);
    document.addEventListener("touchend", touchStopHandler, false);

    function touchStartHandler(e) {
        var firstTouch = e.touches[0];
        fingerAt(firstTouch.pageX, firstTouch.pageY);
        document.addEventListener('touchmove', touchMoveHandler);
    }

    function touchMoveHandler(e) {
        e.cancelBubble = true;
        e.returnValue = false;
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        var firstTouch = e.touches[0];
        fingerAt(firstTouch.pageX, firstTouch.pageY);
    }

    function touchStopHandler(e) {
        setState(NONE_SIDE_STATE);
        document.removeEventListener('touchmove', touchMoveHandler);
    }

//    Mouse

    document.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    function mouseDownHandler(e) {
        fingerAt(e.pageX, e.pageY);
        document.addEventListener('mousemove', mouseMoveHandler);
    }

    function mouseMoveHandler(e) {
        e.cancelBubble = true;
        e.returnValue = false;
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        fingerAt(e.pageX, e.pageY);
    }

    function mouseUpHandler(e) {
        setState(NONE_SIDE_STATE);
        document.removeEventListener('mousemove', mouseMoveHandler);
    }

    function getMiddle() {
        return middle;
    }

    return {
        NONE_SIDE_STATE: NONE_SIDE_STATE,
        LEFT_SIDE_STATE: LEFT_SIDE_STATE,
        RIGHT_SIDE_STATE: RIGHT_SIDE_STATE,
        getMiddle: getMiddle
    }
}]);