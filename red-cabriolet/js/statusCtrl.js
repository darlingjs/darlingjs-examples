/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function() {
    'use strict';
    game.controller('StatusCtrl', ['$scope', '$timeout'
        ,function($scope, $timeout) {
            // BORROWED from Mr Doob (mrdoob.com)

            staticDatas();
            dynamicDatas();

            function onOrientationChangeHandler(e) {
                var orientation;
                if (darlingutil.isDefined(window.orientation)) {
                    orientation = window.orientation;
                } else if (darlingutil.isDefined(screen.orientation)) {
                    orientation = screen.orientation;
                }

                $scope.landscape = orientation == -90 || orientation == 90;
            }

            //BUG: Android Chrome Bug: if orientation change from left to right landscape event doesn't fire handle
            //and even 'window.orientation' doesn't change, test by
            //setInterval(onOrientationChangeHandler, 1000);

            onOrientationChangeHandler();
            window.addEventListener('orientationchange', function() {
                $scope.$apply(onOrientationChangeHandler);
            });

            function dynamicDatas() {
                $scope.document = document;
                $scope.window = window;
                $timeout(dynamicDatas, 1000);
            }

            function staticDatas() {
                $scope.webgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();
                $scope.navigator = navigator;
            }

            document.addEventListener('mousemove', function(event) {
                $scope.$apply(function() {
                    $scope.mouse = event;
                });
                event.cancelBubble = true;
                event.returnValue = false;
                if (event.stopPropagation) event.stopPropagation();
                if (event.preventDefault) event.preventDefault();
            });

            document.addEventListener("touchstart", handleStart, false);

            function handleStart(event) {
                $scope.$apply(function() {
                    $scope.touches = event.touches;
                });
            }

            document.addEventListener("touchend", handleEnd, false);

            var emptyArray = [];

            function handleEnd(event) {
                $scope.$apply(function() {
                    $scope.touches = emptyArray;
                });
            }

            document.addEventListener('touchmove', function(event) {
                $scope.$apply(function() {
                    $scope.touches = event.touches;
                });
                event.cancelBubble = true;
                event.returnValue = false;
                if (event.stopPropagation) event.stopPropagation();
                if (event.preventDefault) event.preventDefault();
            });
        }
    ]);
})();