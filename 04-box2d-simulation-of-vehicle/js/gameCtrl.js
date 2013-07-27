/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

game.controller('GameCtrl', ['GameWorld', 'TouchService', 'Levels', 'Player', '$scope', '$routeParams', '$location',
    function(GameWorld, TouchService, Levels, Player, $scope, $routeParams, $location) {

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

        //because of lack of performance
        if (isMobile()) {
            GameWorld.enableSound(false);
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
        /**
         * Set pause on game
         */
        $scope.pause = function() {
            if ($scope.gameState !== 'playing') {
                return;
            }

            GameWorld.pause();
            $scope.paused = true;
            $scope.gameState = 'game-paused';
        };

        /**
         * resume game after it has paused
         */
        $scope.resume = function() {
            GameWorld.unPause();
            $scope.paused = false;
            $scope.gameState = 'playing';
        };

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

        $scope.drivingLeft = false;
        $scope.drivingRight = false;

        $scope.middle = TouchService.getMiddle();

        $scope.$on('drive-left', function() {
            $scope.$apply(function() {
                $scope.drivingLeft = true;
                $scope.drivingRight = false;
            });
        });

        $scope.$on('drive-right', function() {
            $scope.$apply(function() {
                $scope.drivingLeft = false;
                $scope.drivingRight = true;
            });
        });

        $scope.$on('stop-driving', function() {
            $scope.$apply(function() {
                $scope.drivingLeft = false;
                $scope.drivingRight = false;
            });
        })

        $scope.$on('change-touch-control-state', function(name, state) {
            switch (state) {
                case TouchService.LEFT_SIDE_STATE:
                    GameWorld.driveLeft();
                    break;
                case TouchService.RIGHT_SIDE_STATE:
                    GameWorld.driveRight();
                    break;
                default:
                    GameWorld.stopDriving();
                    break;
            }
        });

        function isMobile() {
            if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/PlayBook/i)
            || navigator.userAgent.match(/Windows Phone/i)
            ){
                return true;
            }
            else {
                return false;
            }
        }
    }]);