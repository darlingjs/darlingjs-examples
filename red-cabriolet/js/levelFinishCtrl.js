/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

game.controller('LevelFinishCtrl', ['GameWorld', 'TouchService', 'Levels', 'Player', 'FacebookService', '$scope', '$routeParams', '$location', '$window',
    function(GameWorld, TouchService, Levels, Player, FacebookService, $scope, $routeParams, $location, $window) {
        'use strict';
        $scope.isLogin = false;

        function updateScore() {
            console.log('update score');
            FacebookService.isLogin().then(function(result) {
                $scope.isLogin = result;
                FacebookService.setMyScore(Player.getScore());
            });
        };

        $scope.onLogin = function() {
            updateScore();
        };

        updateScore();
    }]);
