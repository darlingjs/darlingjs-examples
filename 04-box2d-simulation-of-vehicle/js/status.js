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
            dynanicDatas();

            function dynanicDatas() {
                $scope.document = document;
                $scope.window = window;
                $scope.landscape = window.innerWidth > window.innerHeight;
                $timeout(dynanicDatas, 1000);
            }

            function staticDatas() {
                $scope.webgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();
            }

            document.addEventListener('mousemove', function(event) {
                $scope.$apply(function() {
                    $scope.mouse = event;
                });
            });

            document.addEventListener("touchstart", handleStart, false);

            function handleStart(event) {
                $scope.$apply(function() {
                    $scope.touches = event.touches;
                });
            }

            document.addEventListener("touchend", handleEnd, false);

            function handleEnd(event) {
                /*$scope.$apply(function() {
                    $scope.touches = event.touches;
                });*/
            }

            document.addEventListener('touchmove', function(event) {
                $scope.$apply(function() {
                    $scope.touches = event.touches;
                });
            });
        }
    ]);
})();