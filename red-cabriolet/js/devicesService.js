/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

game.factory('DeviceService', ['$rootScope', function($rootScope) {
    'use strict';

    var deviceAPI = {};
    deviceAPI.type = {};

    var d = navigator.userAgent;
    if (/Android/.test(d)) {
        deviceAPI.type.android = true;
    } else {
        if (/CrOS/.test(d)) {
            deviceAPI.type.chromeOS = true;
        } else {
            if (/iP[ao]d|iPhone/i.test(d)) {
                deviceAPI.type.iOS = true;
            } else {
                if (/Linux/.test(d)) {
                    deviceAPI.type.linux = true;
                } else {
                    if (/Mac OS/.test(d)) {
                        deviceAPI.type.macOS = true;
                    } else {
                        if (/Windows/.test(d)) {
                            deviceAPI.type.windows = true;
                        }
                    }
                }
            }
        }
    }
    if (deviceAPI.type.windows || deviceAPI.type.macOS || deviceAPI.type.linux) {
        deviceAPI.type.desktop = true;
    } else {
        deviceAPI.type.desktop = false;
    }

    /**
     * hide top url bar in mobile browsers
     */
    deviceAPI.hideUrlBar = function() {
        setTimeout(function() {
            if (deviceAPI.type.android && deviceAPI.type.chrome == false) {
                window.scrollTo(0, 1);
            } else {
                window.scrollTo(0, 0);
            }
        }, 1000);
    };

    var rotationMatrix00 = 1,
        rotationMatrix01 = 0,
        rotationMatrix10 = 0,
        rotationMatrix11 = 1;

    function onOrientationChangeHandler(e) {
        var orientation;
        if (darlingutil.isDefined(window.orientation)) {
            orientation = window.orientation;
        } else if (darlingutil.isDefined(screen.orientation)) {
            orientation = screen.orientation;
        }

        deviceAPI.hideUrlBar();

        switch(orientation) {
            case 180:
                rotationMatrix00 = -1;
                rotationMatrix01 = 0;
                rotationMatrix10 = 0;
                rotationMatrix11 = -1;
                break;
            case -90:
                rotationMatrix00 = 0;
                rotationMatrix01 = -1;
                rotationMatrix10 = 1;
                rotationMatrix11 = 0;
                break;
            case 90:
                rotationMatrix00 = 0;
                rotationMatrix01 = 1;
                rotationMatrix10 = -1;
                rotationMatrix11 = 0;
                break;
            default:
                rotationMatrix00 = 1;
                rotationMatrix01 = 0;
                rotationMatrix10 = 0;
                rotationMatrix11 = 1;
                break;
        }
    }


    //BUG: Android Chrome Bug: if orientation change from left to right landscape event doesn't fire handle
    //and even 'window.orientation' doesn't change, test by
    //setInterval(onOrientationChangeHandler, 1000);

    onOrientationChangeHandler();
    window.addEventListener('orientationchange', onOrientationChangeHandler);

    return deviceAPI;
}]);
