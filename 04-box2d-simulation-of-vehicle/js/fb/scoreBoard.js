/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var gameFBModule = window.gameFBModule || angular.module('GameFBModule', []);

gameFBModule
    // Register the 'myCurrentTime' directive factory method.
    // We inject $timeout and dateFilter service since the factory method is DI.
    .directive('fbScoreboard', ['FacebookService', function(FacebookService) {
        'use strict';
        // return the directive link function. (compile function not needed)
        return {
            restrict: 'E',

            template:
                '<div class="scoreboard">' +
                 ' <ul> '+
//                        '  <li ng-repeat="score in scores | orderBy:'score':'name' | limitTo:10"> '+
                  '  <li ng-repeat="score in scores | orderBy:\'name\':\'false\'"> '+
                  '    <img ng-src="{{ score.picture.data.url }}"/> '+
                  '    <span>{{ score.score }}</span> '+
                  '    <span>{{ score.user.name }}</span> '+
                  '  </li> '+
                 ' </ul>' +
                 ' <div ng-if="isShowLogin" class="fbLoginRequest">' +
                    ' <p>To see scoreboard of friends you need to login</p>' +
                    ' <fb-login onLogin="onLoginHandler()"></fb-login> ' +
                 ' </div>' +
                '</div>',

            link: function(scope, element, attrs) {
                scope.isShowLogin = false;

                scope.onLoginHandler = validate;
                function validate() {
                    console.log('validate');
                    FacebookService.isLogin().then(function(result) {
                        if (result) {
                            FacebookService.getFriendsScores().then(function(scores) {
                                scope.scores = scores;
                            });
                            scope.isShowLogin = false;
                        } else if (attrs.hasOwnProperty('asktologin')){
                            scope.isShowLogin = true;
                        }
                    });
                }
                validate();
            }
        };
    }]);