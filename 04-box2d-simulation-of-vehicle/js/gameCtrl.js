/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

game.controller('GameCtrl', ['GameWorld', 'Levels', 'Player', '$scope', '$routeParams', '$location',
    function(GameWorld, Levels, Player, $scope, $routeParams, $location) {

        'use strict';
        var bonusForLevelFinish = 1000;
        var levelId = Math.floor(Number($routeParams.levelId));
        var level = Player.getPlayedLevelAt(levelId);

        $scope.life = 1;
        $scope.score = 0;

        $scope.gameState = 'preparing';

        if (!level || !level.available) {
            $location.url('/menu');
            return;
        }

        $scope.levelId = levelId;
        GameWorld.selectLevel(levelId);
        $scope.urlToReplay = levelId + Math.random();

        //adapt to 'gameView' element size
        var gameView = document.getElementById('gameView');
        if (gameView.clientWidth < 600) {
            GameWorld.setStageSize(400, 300);
        } else {
            GameWorld.setStageSize(640, 480);
        }


        if (GameWorld.isLoaded()) {
            $scope.loadProgress = 0.0;
            $scope.loadProgressInPercent = '0';
            $scope.gameState = 'playing';
            GameWorld.destroy();
            setTimeout(function() {
                //wait a second to show
                GameWorld.build(level);
                GameWorld.start(levelId);
            }, 1000);
        } else {
            GameWorld.load();
            $scope.$on('loadProgress', function(name, evt) {
                $scope.$apply(function() {
                    $scope.loadProgress = (evt.availableCount / evt.totalCount);
                    $scope.loadProgressInPercent = Math.floor(evt.availableCount / evt.totalCount * 100);
                });
            });

            $scope.$on('loadComplete', function() {
                $scope.$apply(function() {
                    $scope.loadProgress = 1;
                    $scope.gameState = 'playing';
                });
                GameWorld.build(level);
                GameWorld.start(levelId);
            });
        }

        $scope.soundStateSwitchTo = 'off';
        $scope.soundSwitch = function() {
            if (GameWorld.isPaused()) {
                return;
            }
            if (GameWorld.isMute()) {
                GameWorld.unMute();
                $scope.soundStateSwitchTo = 'off'
            } else {
                GameWorld.mute();
                $scope.soundStateSwitchTo = 'on'
            }
        };

        $scope.paused = false;
        $scope.pause = function() {
            if (GameWorld.isPaused()) {
                GameWorld.unPause();
                $scope.paused = false;
            } else {
                GameWorld.pause();
                $scope.paused = true;
            }
        }

        $scope.$on('world/finish', function() {
            $scope.score+=bonusForLevelFinish;
            Player.finishLevel(levelId, $scope.score);
            GameWorld.stopVehicle();

            var currentLevel = Levels.getLevelAt(levelId);
            if (currentLevel.final) {
                $scope.$apply(function() {
                    $scope.gameState = 'game-completed';
                });
            } else {
                $scope.$apply(function() {
                    $scope.gameState = 'level-completed';
                });
            }
        });

        $scope.$on('world/lifeChanging', function(name, life) {
            if (life <= 0) {
                $scope.$apply(function() {
                    $scope.life = 0;
                    $scope.gameState = 'game-over';
                });
                GameWorld.stopVehicle();

                //TODO : game over, replay!
            } else {
                $scope.$apply(function() {
                    $scope.life = life;
                });
            }
        });

        $scope.$on('world/scoreChanging', function(name, score) {
            $scope.$apply(function() {
                $scope.score = score;
            });
        });
    }]);