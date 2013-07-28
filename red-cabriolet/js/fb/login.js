/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var gameFBModule = window.gameFBModule || angular.module('GameFBModule', []);

gameFBModule
    // Register the 'myCurrentTime' directive factory method.
    // We inject $timeout and dateFilter service since the factory method is DI.
    .directive('fbLogin', ['$parse', 'FacebookService', function($parse, FacebookService) {
        'use strict';
        // return the directive link function. (compile function not needed)
        return {
            scope: false,
            restrict: 'E',
            template: '<div class="fb-login-button" '+
                                  ' data-show-faces="true" '+
                                  ' data-width="200" '+
                                  ' data-height="200" '+
                                  ' data-max-rows="1" '+
                                  ' data-scope="publish_actions" '+
                                  ' data-onlogin="fbLoginHandlers.handler()" '+
//                                  ' data-scope="user_games_activity,friends_games_activity,publish_actions" '+
                                  '     ></div>',
            link: function(scope, element, attrs) {
                var expressionFn = $parse(attrs.onlogin);
                window.fbLoginHandlers = {};
                window.fbLoginHandlers.handler = function() {
                    expressionFn(scope);
                };
                FacebookService.refreshElement(element[0]);
            }
        };
    }]);