/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

game.controller('LevelFinishCtrl', ['GameWorld', 'TouchService', 'Levels', 'Player', 'FacebookService', '$scope', '$routeParams', '$location', '$window',
    function(GameWorld, TouchService, Levels, Player, FacebookService, $scope, $routeParams, $location, $window) {
        'use strict';
        FacebookService.refreshDOM();

        $scope.isLogin = false;
        $scope.isScoreStored = false;

        FacebookService.isLogin().then(function(result) {
            $scope.isLogin = result;
            FacebookService.setMyScore(Player.getScore()).then(setScoreAsStored);
        });

        $window.game = $window.game || {};
        $window.game.onFBLogin = function(result) {
            console.log('start Login!', result);
            FacebookService.isLogin().then(function(result) {
                $scope.isLogin = result;
                FacebookService.setMyScore(Player.getScore()).then(setScoreAsStored);
            });
        };

        function setScoreAsStored() {
            $scope.isScoreStored = true;
        }

        $scope.getFBLoginHandler = function() {
            return 'game.onFBLogin()';
        }
    }]);
