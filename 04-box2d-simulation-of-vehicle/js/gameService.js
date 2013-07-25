/**
 * Project: darlingjs / GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 *
 * Game World Service deal with all game interaction
 */

game.factory('GameWorld', ['$rootScope', 'Levels', function($rootScope, Levels) {
    'use strict';

    var world,
        width,
        height,
        debugDraw = false,
        renderWithPixiJs = true,
        useStats = false,
        levelId,
        levelProgress,
        currentTile = 'unknown',

        soundIsEnabled = true,
        fullStopped = false;

    world = darlingjs.world('myGame', [
        'myApp',
        'ngFlatland',
        'ngCyclic',
        'ng3D',
        'ngPhysics',
        'ngBox2DEmscripten',
        'ngPixijsAdapter',
        'ngStats',
        'ngPerformance',
        'ngInfinity1DWorld',
        'ngPlayer',
        'ngParticleSystem',
        'ngSound',
        'ngHowlerAdapter',
        'ngResources'
    ], {
        fps: 60
    });

    /**
     * component-marker for ground entities
     */
    world.$c('ground', {});

    //resource loading
    var ngResourceLoader = world.$add('ngResourceLoader');
    ngResourceLoader.on('progress', function() {
        $rootScope.$broadcast('loadProgress', ngResourceLoader);
    });

    ngResourceLoader.on('complete', function() {
        assetsHaveLoaded = true;
        assetsAreLoading = false;
        $rootScope.$broadcast('loadComplete', ngResourceLoader);
    });

    var assetsAreLoading = false,
        assetsHaveLoaded = false;

    /**
     * Have resources loaded?
     * @public
     *
     * @returns {boolean}
     */
    function isLoaded() {
        return assetsHaveLoaded;
    }

    /**
     * load all resources
     *
     * @public
     *
     */
    function load() {
        if (assetsAreLoading || assetsHaveLoaded) {
            return;
        }

        assetsAreLoading = true;

        //sounds
        if (soundIsEnabled) {
            var ngHowlerResources = world.$add('ngHowlerResources');
            ngHowlerResources.load(['assets/sfx/pickup-bonus-A.ogg', 'assets/sfx/pickup-bonus-A.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/pickup-bonus-E.ogg', 'assets/sfx/pickup-bonus-E.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/drops-damage.ogg', 'assets/sfx/drops-damage.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/doom-damage-0.ogg', 'assets/sfx/doom-damage-0.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/engine-loop-0.ogg', 'assets/sfx/engine-loop-0.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/tires-squal-loop-0.ogg', 'assets/sfx/tires-squal-loop-0.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/rain-loop-0.ogg', 'assets/sfx/rain-loop-0.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/thunder-0.ogg', 'assets/sfx/thunder-0.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/thunder-1.ogg', 'assets/sfx/thunder-1.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/drops-1.ogg', 'assets/sfx/drops-1.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/cicada-0.ogg', 'assets/sfx/cicada-0.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/bird-nightingale-0.ogg', 'assets/sfx/bird-nightingale-0.mp3'], ngResourceLoader);
            ngHowlerResources.load(['assets/sfx/frogs-0.ogg', 'assets/sfx/frogs-0.mp3'], ngResourceLoader);

            //sound track
            ngHowlerResources.load(['assets/sfx/rock-drums-120-0.ogg', 'assets/sfx/rock-drums-120-0.mp3'], ngResourceLoader);
        }

        //images
        var ngPixijsResources = world.$add('ngPixijsResources');
        ngPixijsResources.load('assets/spritesheet.json', ngResourceLoader);
        $rootScope.$broadcast('loadStart');
    }

    var hawlerAdapter,
        pixijsStage,
        enableMotorOnKeyDownSystem,
        playerVehicle;

    var muted = false;

    /**
     * Mute the sound
     *
     * @public
     *
     */
    function mute() {
        if (!hawlerAdapter || muted) {
            return;
        }
        muteGame();
        restoreMutedSound = false;
        muted = true;
    }

    /**
     * @private
     */
    function muteGame() {
        if (!hawlerAdapter) {
            return;
        }
        hawlerAdapter.mute();
    }

    /**
     * unmute the sound
     *
     * @public
     *
     */
    function unMute() {
        if (!hawlerAdapter || !muted || !soundIsEnabled) {
            return;
        }
        unMuteGame();
        muted = false;
    }

    /**
     * @private
     */
    function unMuteGame() {
        if (!hawlerAdapter) {
            return;
        }

        hawlerAdapter.unmute();
    }

    function enableSound(value) {
        soundIsEnabled = value;
    }

    /**
     * Return state of sound on/off
     *
     * @public
     *
     * @returns {boolean}
     */
    function isMute() {
        //return darlingutil.isDefined(hawlerAdapter)? hawlerAdapter.isMute(): false;
        return muted;
    }

    var restoreMutedSound = false;

    /**
     * Is game is started
     * @private
     * @type {boolean}
     */
    world.isStarted = false;

    /**
     *
     * Stop the game
     *
     * @public
     *
     */
    function stop() {
        world.$stop();
        if (pixijsStage) {
            //pixijsStage.hide();
        }

        restoreMutedSound = !isMute();
        if (restoreMutedSound) {
            muteGame();
        }

        if (!world.isStarted ) {
            return;
        }

        world.isStarted = false;
    }

    /**
     *
     * @param {number} levelId      Build World of levelId
     */
    function selectLevel(newLevelId) {
        levelId = newLevelId;
    }

    /**
     * Start the game
     *
     * @public
     *
     * @param {boolean} [rebuild]   Rebuild the World is it already exist
     */
    function start(rebuild) {
        if (restoreMutedSound) {
            unMuteGame();
        }

        if (world.isStarted) {
            return;
        }

        world.isStarted = true;

        if (pixijsStage) {
            //pixijsStage.show();
        }

        world.$start();
    }

    /**
     * Is game paused
     * @returns {*}
     */
    function isPaused() {
        return !world.$playing;
    }

    /**
     * set game on pause
     */
    function pause() {
        world.$stop();
        muteGame();
    }

    /**
     * resume game from pause
     */
    function unpause() {
        world.$start();
        if (!isMute()) {
            unMuteGame();
        }
    }

    /**
     * Destroy the Game World
     *
     * @public
     */
    function destroy() {
        if (!isBuilded) {
            return;
        }

        isBuilded = false;

        darlingjs.removeWorld('myGame');
        world = darlingjs.world('myGame', [
            'myApp',
            'ngFlatland',
            'ngCyclic',
            'ng3D',
            'ngPhysics',
            'ngBox2DEmscripten',
            'ngPixijsAdapter',
            'ngStats',
            'ngPerformance',
            'ngInfinity1DWorld',
            'ngPlayer',
            'ngParticleSystem',
            'ngSound',
            'ngHowlerAdapter',
            'ngResources'
        ], {
            fps: 60
        });
        world.$c('ground', {});
    }

    /**
     * Is game is builded
     * @private
     * @type {boolean}
     */
    var isBuilded = false;

    function setStageSize(newWidth, newHeight) {
        width = newWidth;
        height = newHeight;
    }

    /**
     *
     * Build the Game World
     *
     * @public
     *
     */
    function build(levelSettings) {
        if (isBuilded) {
            return;
        }

        isBuilded = true;

        fullStopped = false;

        // systems
        if (useStats) {
            world.$add('ngStatsBegin');
        }

        world.$add('ngPerformanceLogBegin');

        world.$add('ng2DViewPort', {
            lookAt: {
                x: 400, y: 300
            },
            width: width,
            height: height
        });

        world.$add('ngBox2DSystem', {
            gravity: {
                x: 0,
                y: 9.8
            },
            velocityIterations: 7,
            positionIterations: 7
        });

        //world.$add('ngBox2DDraggable', { domId: 'gameView', width: width, height: height });
        world.$add('ngBox2DFixRotation');
        world.$add('ngBox2DCollisionGroup');
        world.$add('ngBox2DRevoluteJoint');
        world.$add('ngBox2DPrismaticJoint');
        world.$add('ngBox2DDistanceJoint');
        world.$add('ngBox2DSensorSystem');
        world.$add('ngBox2DCollision');

        enableMotorOnKeyDownSystem = world.$add('ngEnableMotorOnKeyDown');
        world.$add('ngBox2DEnableMotorSystem');
        world.$add('ngBox2DMotorWithAcceleration');

        world.$add('ngBindAngularDampingToPhysics');

        //world.$add('ng2DViewPort', {
        //    width: width,
        //    height: height
        //});

        world.$add('ngFollowSelected', {
            shift: {
                x: 100.0,
                y: -100.0
            }
        });

        world.$add('ngCollectBonuses');

        world.$add('ngRemoveSelectionFromWinner');

        if (soundIsEnabled) {
            hawlerAdapter = world.$add('ngHowlerAdapter');

            world.$add('ngHowlerAmbientSoundAdapter');
        }

        var firstTile = true;

        var levelLength = levelSettings.levelLength;

        var tileSettings = levelSettings.tileSettings;

        var probabilitySum = 0;
        var tileCumulativeProbability = [];

        //store probability and normalize
        for (var tileName in tileSettings) {
            probabilitySum += tileSettings[tileName].probability;
        }

        var lastCumulativeProbability = 0;
        for (var tileName in tileSettings) {
            var currentProbability = lastCumulativeProbability + tileSettings[tileName].probability / probabilitySum;
            tileCumulativeProbability.push({
                name : tileName,
                probability: currentProbability
            });
            lastCumulativeProbability = currentProbability;
        }

        world.$add('ngInfinity1DWorld', {
            seed: {
                leftEdge: 0.0,
                leftHeight: 0.0,
                rightEdge: 0.0,
                rightHeight: 600.0//140 + 200 * Math.random()
            },
            generator: function(newTile, leftSeedTile, rightSeedTile) {
                if (leftSeedTile && leftSeedTile.rightEdge <= 0.0 || rightSeedTile && rightSeedTile.rightEdge <= 0.0) {
                    generateByTiledFile(newTile, leftSeedTile, rightSeedTile, 'assets/maps/start.json');
                    firstTile = false;
                    if (leftSeedTile) {
                        updateLevelProgress('start', leftSeedTile.rightEdge / levelLength);
                    }
                } else {

                    if (leftSeedTile && leftSeedTile.rightEdge > levelLength) {
                        generateByTiledFile(newTile, leftSeedTile, rightSeedTile, 'assets/maps/finish.json');
                        updateLevelProgress('finish', leftSeedTile.rightEdge / levelLength);
                    } else {
                        //var seed = Math.random();
                        var tileSetting = getTileSettingByRandomValue(Math.random());
                        if (tileSetting === null || darlingutil.isUndefined(tileSetting)) {
                            throw new Error('Missing tile Settings');
                        }

                        var tileSettingForLevel = levelSettings.tileSettings[tileSetting.name];

                        switch(tileSetting.type) {
                            case 'hill':
                                hillGenerator(newTile, leftSeedTile, rightSeedTile, {
                                    hillWidth: tileSettingForLevel.minHillWidth +
                                        (tileSettingForLevel.maxHillWidth - tileSettingForLevel.minHillWidth) * Math.random(),
                                    hillHeight: tileSettingForLevel.minHillHeight +
                                        (tileSettingForLevel.maxHillHeight - tileSettingForLevel.minHillHeight) * Math.random()
                                });
                                currentTile = 'hill';
                                break;
                            case 'tile':
                                generateByTiledFile(newTile, leftSeedTile, rightSeedTile, tileSetting.tileUrl);
                                break;
                            default:
                                throw new Error('undefined tile');
                                break;
                        }

                        if (leftSeedTile) {
                            updateLevelProgress(tileSetting.name, leftSeedTile.rightEdge / levelLength);
                        }
//                        if (seed <= 0.9) {
//                        } else if (false) {
//                            generateStraightLine(newTile, leftSeedTile, rightSeedTile);
//                            updateLevelProgress('straight-line', leftSeedTile.rightEdge / levelLength);
//                        } else {
//                        }
                    }
                }
            }
        });

        function getTileSettingByRandomValue(value) {
            for (var i = 0, count = tileCumulativeProbability.length; i < count; i++) {
                if (value <= tileCumulativeProbability[i].probability) {
                    return Levels.getTileSettings(tileCumulativeProbability[i].name);
                }
            }
        }

        world.$add('ngBindPositionToPhysics');

        world.$add('ngBindLifeToAlpha');

        if (renderWithPixiJs) {
            pixijsStage = world.$add('ngPixijsStage', {
                domId: 'gameCanvas',
                width: width,
                height: height,
                useWebGL: true,
                fitToWindow: true
            });

            world.$add('ngPixijsPositionUpdateCycleWithViewPort');
            world.$add('ngPixijsSpriteShiftUpdate');
            world.$add('ngPixijsRotationUpdateCycle');
            world.$add('ngPixijsViewPortUpdateCycle');

            world.$add('ngPixijsStaticZ', {
                layers: [
                    'background',
                    'mountain-2',
                    'mountain-1',
                    'mountain-0',
                    'city-2',
                    'city-1',
                    'city-0',
                    'clouds',
                    'road-1',
                    'car',
                    'road-0',
                    'foreground'
                ]
            });

            world.$add('ngPixijsSpriteFactory');

            //world.$add('ngPixijsMovieClip');
        }

        world.$add('ng2DShiftMovingSystem');

        world.$add('ngRandomEmitterSystem');
        world.$add('ngSquareEmitterSystem');
        world.$add('ngCircleEmitterSystem');
        world.$add('ngCubicEmitterSystem');
        world.$add('ngRectangleZone');

        world.$add('ngRemoveIfDead');
        world.$add('ngReduceLifeIfOutOfLifeZone');
        world.$add('ngDeadIfOutOfLife');
        world.$add('ngLifeIsGrooving');
        world.$add('ngDecreaseLifeOnDamage');
        world.$add('ngDecreaseLifeOnContinuousDamage');

        world.$add('ngLockOnViewPortOnShiftToIt');

        world.$add('ngLifeHandler');

        world.$add('ngConvert3DtoParallax');
        world.$add('ngSimpleParallax');

        world.$add('ngMarkIfOutsideOfTheViewPortHorizontal3D');
        world.$add('ngMarkIfInsideOfTheViewPortHorizontal3D');
        world.$add('ng3DCyclicLayer');

        if (debugDraw) {
            world.$add('ngBox2DDebugDraw', {
                domID: 'gameView', width: width, height: height
            });
        }

        world.$add('ngPerformanceLogEnd');

        if (useStats) {
            world.$add('ngStatsEnd', {
                domId: 'gameUI'
            });
        }

        world.$e('sky', {
            'ng2D': {
                x:0.0, y:0.0
            },

            ngSprite: {
                name: 'blue-sky.png',
                spriteSheetUrl: 'assets/spritesheet.json',
                layerName: 'background'
            },

            'ngLockViewPort': {
            }
        });

        //construct world env

        buildCloudFront({
            useCloudFactory: true,
            cloudMinRate: 0.0,
            cloudMaxRate: 0.1,

            frontStart: levelSettings.doom.start,
            frontSpeed: levelSettings.doom.speed
        });

        buildMountain({
            depth: 2.0,
            depthDeviation: 0.5
        });

        buildCity({
            step: 1000,
            y: 950,
            count: 2,
            depth: 1.0,
            depthDeviation: 0.3
        });

        playerVehicle = buildVehicle(400, 500, 'cabriolet', {
            axleContainerDistance: 30,
            axleContainerHeight: 5,
            axleContainerDepth: 2.5,
            wheelRadius: 12,
            wheelMaxSpeed: 30.0,
            layerName: 'car'
        });
    }

    function updateLevelProgress(tile, progress) {
        currentTile = tile;

        levelProgress = darlingutil.clamp(progress);

        googleAnalytics('send', 'event', 'game', 'progress', currentTile, levelId + levelProgress);
    }

    /**
     * Handlers
     *
     */

    /**
     * Finish handler
     *
     * @private
     *
     */
    function onCrossedTheFinishLine() {
        $rootScope.$broadcast('world/finish');
        return true;
    }

    /**
     * Handle life changing
     *
     * @param $entity
     * @param life
     */
    function onLifeChanging($entity, life) {
        $rootScope.$broadcast('world/lifeChanging', life);
    }

    /**
     * Handle RollOver the Vehicle
     *
     * @param $entity
     */
    function onRollOverTheVehicle($entity) {
        if ($entity.ngLife.value <= 0) {
            return;
        }
        $entity.ngLife.value = 0.0;
        onLifeChanging($entity, 0);
        googleAnalytics('send', 'event', 'game', 'roll-over', currentTile, levelId + levelProgress);
    }

    function onChangeCurrentTile() {
    }

    /**
     * Handle score changing
     *
     * @param $entity
     * @param score
     */
    function onScoreChanging(score) {
        $rootScope.$broadcast('world/scoreChanging', score);
    }

    /**
     *  Generators
     */

    /**
     * Hill Generator
     *
     * @param newTile
     * @param leftSeedTile
     */

    function hillGenerator(newTile, leftSeedTile, rightSeedTile, ops) {
        var xOffset, yOffset, goRight, sign, startIndex;
        var pixelStep = 32;

        if (leftSeedTile) {
            xOffset = leftSeedTile.rightEdge;
            yOffset = leftSeedTile.rightHeight;
            goRight = true;
            sign = 1;
            startIndex = 0;
        } else {
            xOffset = rightSeedTile.leftEdge;
            yOffset = rightSeedTile.leftHeight;
            goRight = false;
            sign = -1;
            startIndex = 0;
        }

        var hillSliceWidth = Math.floor(ops.hillWidth / pixelStep);
        ops.hillWidth = hillSliceWidth * pixelStep;
        var randomHeight = ops.hillHeight;

        //    if (xOffset!==0) {

        var hillStartY = -yOffset - randomHeight;
        //    }

        var entities = [];

        var diamondLeft = 0,
            diamondType,
            diamondScore;

        for (var j = startIndex; j < hillSliceWidth; j++) {
            var heightBegin = hillStartY + randomHeight * Math.cos(2*Math.PI/hillSliceWidth * j);
            var heightEnd = hillStartY + randomHeight * Math.cos(2*Math.PI/hillSliceWidth * (j + sign));

            var angle = Math.atan(randomHeight / hillSliceWidth * Math.sin(2 * Math.PI/hillSliceWidth * j)) / (2 * Math.PI);

            var bottom = 0;
            var lowHeight = Math.min(heightBegin, heightEnd);
            var x = sign * j * pixelStep + xOffset;
            bottom = -lowHeight + 32;

            entities.push(
                world.$e('ground-' + x, {
                    'ng2D': {
                        x: x,
                        y: 0
                    },
                    'ng2DPolygon': {
                        'line': [{
                            x: 0,
                            y: bottom
                        }, {
                            x: 0,
                            y: -heightBegin
                        }, {
                            x: pixelStep,
                            y: -heightEnd
                        }, {
                            x: pixelStep,
                            y: bottom
                        }]
                    },
                    'ngPhysic': {
                        partOf: 'ground',
                        type: 'static', restitution: 0.0
                    },
                    'ground': true
                })
            );

            entities.push(world.$e('grass-0-' + x, {
                ng2D: {
                    x: x,
                    y: -lowHeight
                },

                ng2DSize: {
                    width: 34,
                    height: -lowHeight
                },

                ngSprite: {
                    name: 'grass-0.png',
                    spriteSheetUrl: 'assets/spritesheet.json',
                    fitToSize: true,
                    anchor: {
                        x: 0.0,
                        y: 0.0
                    },
                    layerName: 'foreground'
                }
            }));

            entities.push(world.$e('grass-top-0-' + x, {
                'ng2D': {
                    x: x,
                    y: -lowHeight
                },

                'ng2DRotation': {
                    rotation: angle
                },

                ngSprite: {
                    name: 'grass-top-0.png',
                    spriteSheetUrl: 'assets/spritesheet.json',
                    layerName: 'foreground'
                }
            }));

            //        if (false) {
            //            var topItemsIndex = Math.floor(topItems.length * Math.random());
            //            entities.push(world.$e('grass-top-0-' + x, {
            //                'ng2D': {
            //                    x: x,
            //                    y: -lowHeight
            //                },
            //
            //                'ng2DRotation': {
            //                    rotation: angle
            //                },
            //
            //                ngPixijsSprite: false,
            //                'ngSpriteAtlas' : {
            //                    name: topItems[topItemsIndex],
            //                    url: 'assets/spritesheet.json',
            //                    anchor: {
            //                        x: 0.5,
            //                        y: 0.5
            //                    }
            //                },
            //
            //                ngLayer: {
            //                    layerName: 'foreground'
            //                }
            //            }));
            //        }

            if (Math.random() > 0.95) {
                entities.push(world.$e('cicada-0-' + x, {
                    ng2D: {
                        x: x,
                        y: -lowHeight
                    },

                    ngSound: {
                        urls: ['assets/sfx/cicada-0.ogg', 'assets/sfx/cicada-0.mp3'],
                        volume: 0.7 + 0.3 * Math.random(),
                        loop: true,
                        stopPlayAfterRemove: true,
                        distance: 5 + 3 * Math.random()
                    }
                }));
            }


            if (Math.random() > 0.97) {
                entities.push(world.$e('bird-nightingale-0-' + x, {
                    ng2D: {
                        x: x,
                        y: -lowHeight
                    },

                    ngSound: {
                        urls: ['assets/sfx/bird-nightingale-0.ogg', 'assets/sfx/bird-nightingale-0.mp3'],
                        volume: 1.3 + 0.3 * Math.random(),
                        loop: true,
                        stopPlayAfterRemove: true,
                        distance: 5 + 3 * Math.random(),
                        offset: 100 * Math.random()
                    }
                }));
            }

            var seed = Math.floor(100 * Math.random());
            if (seed < 10) {
                entities.push(world.$e('tree-wind-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },

                    ngSound: {
                        urls: ['assets/sfx/tree-wind-0.ogg', 'assets/sfx/tree-wind-0.mp3'],
                        volume: 1.5 + 0.3 * Math.random(),
                        distance: 2,
                        loop: true,
                        stopPlayAfterRemove: true
                    }
                }));

                entities.push(world.$e('tree-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },

                    ngSprite: {
                        name: 'tree-0.png',
                        spriteSheetUrl: 'assets/spritesheet.json',
                        layerName: 'road-1',
                        anchor: {
                            x: 0.5,
                            y: 1.0
                        }
                    }
                }));
            } else if (seed < 20) {
                entities.push(world.$e('three-1-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },

                    ngSprite: {
                        name: 'tree-1.png',
                        spriteSheetUrl: 'assets/spritesheet.json',
                        layerName: 'road-0',
                        anchor: {
                            x: 0.5,
                            y: 1.0
                        }
                    }
                }));
            } else if (seed < 22) {
                entities.push(world.$e('fence-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight + 100 * Math.random() + 100
                    },

                    ngSprite: {
                        name: 'fence-0.png',
                        spriteSheetUrl: 'assets/spritesheet.json',
                        layerName: 'foreground',
                        anchor: {
                            x: 0.5,
                            y: 1.0
                        }
                    }
                }));
            } else if (seed > 99) {
                entities.push(world.$e('rail-road-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },

                    ngSprite: {
                        name: 'rail-road-0.png',
                        spriteSheetUrl: 'assets/spritesheet.json',
                        layerName: 'foreground',
                        anchor: {
                            x: 0.5,
                            y: 0.0
                        }
                    }
                }));
            }

            if (Math.random() > 0.5) {
                entities.push(world.$e('flowers-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },

                    ngSprite: {
                        name: 'flowers-0.png',
                        spriteSheetUrl: 'assets/spritesheet.json',
                        layerName: 'foreground',
                        anchor: {
                            x: 0.5,
                            y: -4.0 * Math.random()
                        }
                    }
                }));
            }

            if (Math.random() > 0.9 && diamondLeft <= 0) {
                diamondLeft = Math.floor(3 + 7 * Math.random());
                if (Math.random() > 0.5) {
                    diamondType = 'diamond-0';
                    diamondScore = 10;
                } else {
                    diamondType = 'diamond-1';
                    diamondScore = 15;
                }
            }
            if (diamondLeft > 0) {
                diamondLeft--;
                entities.push(world.$e(diamondType + '-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight - 42
                    },

                    'ngPhysic': {
                        type: 'static'
                    },

                    'ng2DCircle': {
                        radius: 16
                    },

                    'ngSensor': true,

                    'ngBonus': {
                        score: diamondScore
                    },

                    ngSprite: {
                        name: diamondType + '.png',
                        spriteSheetUrl: 'assets/spritesheet.json',
                        layerName: 'road-0'
                    }
                }));
            }
        }

        newTile.entities = entities;

        if (goRight) {
            newTile.leftEdge = xOffset;
            newTile.rightEdge = leftSeedTile.rightEdge + ops.hillWidth;
        } else {
            newTile.leftEdge = rightSeedTile.leftEdge - ops.hillWidth;
            newTile.rightEdge = xOffset;
        }

        newTile.leftHeight = yOffset;
        newTile.rightHeight = yOffset;
    }

    var topItems = ['flower-2.png', 'stone-0.png', 'stone-1.png', 'stone-2.png', 'stone-4.png'];

    /**
     * Generate tile with straight line
     * @param newTile
     * @param leftSeedTile
     * @param rightSeedTile
     */
    function generateStraightLine(newTile, leftSeedTile, rightSeedTile) {
        //    console.log('generateStraightLine');
        var goRight;
        if (leftSeedTile) {
            goRight = true;
            newTile.rightEdge = leftSeedTile.rightEdge + width;
            newTile.rightHeight = leftSeedTile.rightHeight;
            newTile.leftEdge = leftSeedTile.rightEdge;
            newTile.leftHeight = leftSeedTile.rightHeight;
        } else {
            goRight = false;
            newTile.rightEdge = rightSeedTile.leftEdge;
            newTile.rightHeight = rightSeedTile.leftHeight;
            newTile.leftEdge = rightSeedTile.leftEdge - width;
            newTile.leftHeight = rightSeedTile.rightHeight;
        }

        var entities = [];
        newTile.entities = entities;

        entities.push(world.$e('ground-straight', {
            'ng2D': {
                x: newTile.leftEdge,
                y: newTile.leftHeight
            },
            'ng2DPolygon': {
                'line': [{
                    x: 0,
                    y: 0
                }, {
                    x: width,
                    y: 0
                }, {
                    x: width,
                    y: 10
                }, {
                    x: 0,
                    y: 10
                }]
            },
            'ngPhysic': {
                //partOf: 'ground',
                type: 'static', restitution: 0.0
            }
        }));
    }

    /**
     * Generate tile by tiled file
     *
     * @param newTile
     * @param leftSeedTile
     * @param rightSeedTile
     */
    function generateByTiledFile(newTile, leftSeedTile, rightSeedTile, fileName) {
        //    console.log('generateByTiledFile' + [newTile, leftSeedTile, rightSeedTile, fileName].join(', '));
        var goRight;
        if (leftSeedTile) {
            goRight = true;

            newTile.leftEdge = leftSeedTile.rightEdge;
            newTile.leftHeight = leftSeedTile.rightHeight;

            //1st aproximation
            newTile.rightEdge = leftSeedTile.leftEdge + 10 * width;
            newTile.rightHeight = leftSeedTile.rightHeight;
        } else {
            goRight = false;

            newTile.rightEdge = rightSeedTile.rightEdge;
            newTile.rightHeight = rightSeedTile.rightHeight;

            //1st aproximation
            newTile.leftEdge = rightSeedTile.leftEdge - 10 * width;
            newTile.leftHeight = rightSeedTile.rightHeight;
        }


        loadMap(fileName)
            .then(function(data) {
                var map = parseMap(data);

                var entities = map.entities;

                var dx = newTile.leftEdge - map.leftEdge.x;
                var dy = newTile.leftHeight - map.leftEdge.y;

                for(var i = 0, count = entities.length; i < count; i++) {
                    var entity = entities[i];
                    entity.ng2D.x += dx;
                    entity.ng2D.y += dy;
                    world.$add(entity);
                }

                newTile.entities = entities;
                newTile.rightEdge = dx + map.rightEdge.x;
                newTile.rightHeight = dy + map.rightEdge.y;
            });
    }

    /**
     * @private
     * @param file
     * @return Promise https://github.com/kriskowal/q
     */
    function loadMap(file) {
        var deferred = Q.defer();
        var oReq = new XMLHttpRequest();
        oReq.onload = function(data) {
            var map = JSON.parse(data.target.response);
            deferred.resolve(map);
        };

        //TODO: handle error
        //deferred.reject(new Error(error));
        oReq.open("get", file, true);
        oReq.send();

        return deferred.promise;
    }

    function parseMap(data) {
        try {
            return parseMapUnSafe(data);
        } catch(e) {
            console.log(e);
        }
    }

    function parseMapUnSafe(data) {
        var entities = [],
            rightEdge = {},
            leftEdge = {};

        for(var j = 0, lj = data.layers.length; j < lj; j++) {
            parseLayer(j, data, rightEdge, leftEdge, entities);
        }

        return {
            entities: entities,
            leftEdge: leftEdge,
            rightEdge: rightEdge
        };
    }

    function parseLayer(j, data, rightEdge, leftEdge, entities) {
        var layer = data.layers[j];
        switch(layer.type) {
            case 'tilelayer':
                //TODO: Do we really need to transform flat array to separate entities?
                //                var tile = data.tilesets[0];
                //                parseTileLayerData(layer.data, layer.width, layer.height, {
                //                    ng2D: {x:0, y:0},
                //                    ng2DSize: {width:tile.tilewidth, height:tile.tileheight},
                //                    ngTileSprite: {tilesheetUrl: 'assets/' + tile.image, tileId: 0}
                //                });
                break;
            case 'imagelayer':
                //TODO: whole image.
                break;
            case 'objectgroup':
                parseObjectGroup(layer, rightEdge, leftEdge, entities);
                break;
        }
    }

    function parseObjectGroup(layer, rightEdge, leftEdge, entities) {
        for(var i = 0, li = layer.objects.length; i < li; i++) {
            var object = layer.objects[i];
            var components = {};

            components = convertTiledPropertiesToComponents(object.properties);
            switch(object.type) {
                case 'right-edge':
                    rightEdge.x = object.x + 0.5 * object.width;
                    rightEdge.y = object.y + 0.5 * object.height;
                    continue;
                case 'left-edge':
                    leftEdge.x = object.x + 0.5 * object.width;
                    leftEdge.y = object.y + 0.5 * object.height;
                    continue;
                case 'static':
                    if (components.ngPhysic) {
                        components.ngPhysic.type = 'static';
                        components.ngPhysic.restitution = 0.0;
                    } else {
                        components.ngPhysic = {type: 'static', restitution: 0.0};
                    }
                    break;
                case 'dynamic':
                    if (components.ngPhysic) {
                        components.ngPhysic.type = 'dynamic';
                    } else {
                        components.ngPhysic = {type: 'dynamic'};
                    }
                    break;
                case 'revolute-joint':
                    if (!components.ngRevoluteJoint) {
                        components.ngRevoluteJoint = true;
                    }
                    break;
                case 'distance-joint':
                    if (!components.ngDistanceJoint) {
                        components.ngDistanceJoint = {};
                    }

                    parseAnchors(components.ngDistanceJoint, object);
                    break;
                case 'prismatic-joint':
                    if (!components.ngPrismaticJoint) {
                        components.ngPrismaticJoint = {};
                    }
                    parseAnchors(components.ngPrismaticJoint, object);
                    break;
                case 'pulley-joint':
                    if (!components.ngPulleyJoint) {
                        components.ngPulleyJoint = true;
                    }
                    break;
                case '':
                    //TODO:
                    //console.log('undefined object', object);
                    //continue;
                    break;
                default:
                    throw new Error('Need to implement new object type : "' + object.type + '"');
                    break;
            }

            components.ng2D = {
                x: object.x,
                y: object.y
            };

            if (object.ellipse) {
                //Because Box2D can't interact with ellipse we just take average value
                components.ng2DCircle = {
                    radius: 0.25 * (object.width + object.height)
                };
                components.ng2D.x+= 0.5 * object.width;
                components.ng2D.y+= 0.5 * object.height;
            } else if (object.polyline) {
                //TODO : create complex shape
                //object.polyline[].{x,y};// custom shape
                components.ng2DPolygon = {
                    line: object.polyline
                };
                //continue;
            } else if (object.polygon) {
                components.ng2DPolygon = {
                    line: object.polygon
                };
            } else {
                components.ng2DSize = {
                    width: object.width,
                    height: object.height
                };

                components.ng2D.x += 0.5 * object.width;
                components.ng2D.y += 0.5 * object.height;
            }

            entities.push(world.$e(object.name, components, true));
        }
    }



    function parseAnchors(component, object) {
        component.anchorA = {
            x: object.polyline[0].x,
            y: object.polyline[0].y
        };
        component.anchorB = {
            x: object.polyline[1].x,
            y: object.polyline[1].y
        };
    }

    function convertTiledPropertiesToComponents(properties) {
        var components = {};
        for (var key in properties) {
            var params = key.split('.');
            var componentParam = components;
            var previousParam;
            if (params.length === 0) {
                previousParam = key;
            } else {
                for (var i = 0, l = params.length - 1; i < l; i++) {
                    previousParam = params[i];
                    if (!componentParam.hasOwnProperty(previousParam)) {
                        componentParam[previousParam] = {};
                    }

                    componentParam = componentParam[previousParam];
                }
                previousParam = params[i];
            }

            if (previousParam === '') {
                continue;
            }

            var value;
            try {
                value = JSON.parse(properties[key]);
            } catch(e) {
                value = properties[key];
            }

            if(value === 'true') {
                componentParam[previousParam] = true;
            } else if(value === 'false') {
                componentParam[previousParam] = false;
            } else if (isNaN(value)) {
                componentParam[previousParam] = value;
            } else {
                componentParam[previousParam] = Number(value);
            }
        }

        return components;
    }

    //vehicle

    function buildVehicle(x, y, name, newOps){
        newOps = newOps || {};
        var ops = {
            width: newOps.width || 45.0,
            height: newOps.height || 10.0,
            axleContainerDistance: newOps.axleContainerDistance || 30.0,
            axleContainerWidth: newOps.axleContainerWidth ||  5.0,
            axleContainerHeight: newOps.axleContainerHeight || 20.0,
            axleContainerDepth: newOps.axleContainerDepth || 10.0,
            axleAngle: newOps.axleAngle || 20.0,
            wheelRadius: newOps.wheelRadius || 25.0,
            wheelMaxSpeed: newOps.wheelMaxSpeed || 20.0,
            wheelAcceleration: newOps.wheelAcceleration || 1.0,
            rearWheelDrive: true,
            frontWheelDrive: true,
            layerName: newOps.layerName
        };

        var leftWheelRevoluteJoint,
            rightWheelRevoluteJoint,
            leftWheel,
            rightWheel,
            vehicleBody;

        var degreesToRadians = Math.PI / 180.0;

        var wheelAngularDampingNormal = 1.0,
            wheelAngularDampingOnStop = 10.0;

        //wheels
        //* left-wheel
        var leftWheelName = 'vehicle-left-wheel-' + name;
        leftWheel = world.$e(leftWheelName, {
            'ng2D': {
                x: x - ops.axleContainerDistance - 2 * ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians),
                y: y + ops.axleContainerDepth + 2 * ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians)
            },
            'ng2DCircle': {radius: ops.wheelRadius},
            'ng2DRotation': {},
            'ngDraggable': {},
            'ngBindAngularDampingToPhysics': true,
            'ngPhysic': {
                restitution: 0.2,
                friction: 15.0,
                density: 1.0,
                angularDamping: wheelAngularDampingNormal
            },
            'ngCollisionGroup': {
                'neverWith': 'vehicle'
            },

            ngSprite: {
                name: name + '-wheel.png',
                spriteSheetUrl: 'assets/spritesheet.json',
                layerName: ops.layerName
            }
        });

        //* right-wheel
        var rightWheelName = 'vehicle-right-wheel-' + name;
        rightWheel = world.$e(rightWheelName, {
            'ng2D': {
                x: x + ops.axleContainerDistance + 2 * ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians),
                y: y + ops.axleContainerDepth + 2 * ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians)
            },
            'ng2DCircle': {radius: ops.wheelRadius},
            'ng2DRotation': {},
            'ngDraggable': {},
            'ngBindAngularDampingToPhysics': true,
            'ngPhysic': {
                name: rightWheelName,
                restitution: 0.2,
                friction: 15.0,
                density: 1.5,
                angularDamping: wheelAngularDampingNormal
            },
            'ngCollisionGroup': {
                'neverWith': 'vehicle'
            },

            ngSprite: {
                name: name + '-wheel.png',
                spriteSheetUrl: 'assets/spritesheet.json',
                layerName: ops.layerName
            }
        });

        var TwoPI = 2 * Math.PI,
            HalfPI = 0.5 * Math.PI;

        /**
         * Map angle to interval [0, 2*pi]
         * @param angle
         */
        function mapAngleToZeroAndTwoPI(angle) {
            while(angle < 0) {
                angle += TwoPI;
            }

            while(angle > TwoPI) {
                angle -= TwoPI;
            }

            return angle;
        }

        //body
        var bodyName = 'vehicle-body-' + name;
        vehicleBody = world.$e(bodyName, {
            'ng2D': {x : x, y: y},
            'ng2DSize': {width: 2.0 * ops.width, height: 2.0 * ops.height},
            'ng2DRotation': true,
            'ngDraggable': true,
            'ngPhysic': {
                restitution: 0.3,
                friction: 3.0,
                density: 0.5
            },
            'ngCollisionGroup': {
                'neverWith': 'vehicle'
            },
            'ngSelected': true,
            'ngWantsToCollide': {
                'with': [
                    {
                        'any': ['ngFinish'],
                        'andGet': {
                            'ngWinner' : onCrossedTheFinishLine
                        }
                    },
                    {
                        'any': ['ngBonus'],
                        'andGet': {
                            'ngGetBonus': true,
                            'ngSound': function() {
                                var soundName;
                                if (Math.random() > 0.25) {
                                    soundName = 'pickup-bonus-A';
                                } else {
                                    soundName = 'pickup-bonus-E';
                                }
                                return {
                                    urls: ['assets/sfx/' + soundName + '.ogg', 'assets/sfx/' + soundName + '.mp3'],
                                    volume: 0.3,
                                    loop: false,
                                    stopPlayAfterRemove: false,
                                    removeEntityOnEnd: false,
                                    removeComponentOnEnd: true
                                };
                            }
                        }
                    },
                    {
                        'any': ['drop'],
                        'andGet': {
                            'ngDamage': {
                                damage: 0.1
                            },
                            'ngSound': {
                                urls: ['assets/sfx/drops-damage.ogg', 'assets/sfx/drops-damage.mp3'],
                                volume: 0.3,
                                loop: false,
                                stopPlayAfterRemove: false,
                                removeEntityOnEnd: false,
                                removeComponentOnEnd: true
                            }
                        }
                    },
                    {
                        'any': ['cloudsFront'],
                        'andGet': {
                            'ngContinuousDamage': {
                                damage: 0.5
                            },
                            'ngSound': {
                                urls: ['assets/sfx/doom-damage-0.ogg', 'assets/sfx/doom-damage-0.mp3'],
                                volume: 1.0,
                                loop: false,
                                stopPlayAfterRemove: false,
                                removeEntityOnEnd: false,
                                removeComponentOnEnd: true
                            }
                        }
                    },
                    {
                        'any': ['ground'],
                        'andGet' : function() {
                            console.log('hit the ground');
                            console.log('this.ng2DRotation.rotation', this.ng2DRotation.rotation);
                            var angle = mapAngleToZeroAndTwoPI(this.ng2DRotation.rotation);
                            console.log('angle = ' + angle);
                            if (3 * Math.PI / 4 < angle && angle < 6 * Math.PI / 4) {
                                //dead
                                onRollOverTheVehicle(this);
                            }
                        }
                    }
                ]
            },

            'ngLife': {
                life: 1.0
            },

            'ngOnLifeChange': {
                handler: onLifeChanging
            },

            'ngLive': {},

            ngSprite: {
                name: name + '-body.png',
                spriteSheetUrl: 'assets/spritesheet.json',
                layerName: ops.layerName,
                anchor: {
                    x: 0.52,
                    y: 0.76
                }
            },

            'ngScores': {
                score: 0.0,
                handler: onScoreChanging
            }
        });

        //suspension
        //* left-container
        world.$e('vehicle-left-suspension-container-' + name, {
            'ng2D': {
                x: x - ops.axleContainerDistance,
                y: y + ops.axleContainerDepth},
            'ng2DSize': {width: 2 * ops.axleContainerWidth, height: 2 * ops.axleContainerHeight},
            'ng2DRotation': { rotation: ops.axleAngle*degreesToRadians },
            'ngPhysic': {
                partOf: bodyName,
                restitution: 0.0,
                friction: 200.0,
                density: 1.0
            },
            'ngCollisionGroup': {
                'neverWith': 'vehicle'
            }
        });

        //* left-axle
        var leftSuspensionAxleName = 'vehicle-left-suspension-axle-' + name;
        var leftSuspensionAxleX = x - ops.axleContainerDistance - ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians);
        var leftSuspensionAxleY = y + ops.axleContainerDepth + ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians);

        world.$e(leftSuspensionAxleName, {
            'ng2D': {
                x: leftSuspensionAxleX,
                y: leftSuspensionAxleY
            },
            'ng2DSize': {width: 2 + 2 * ops.axleContainerWidth / 2, height: 2 * ops.axleContainerHeight},
            'ng2DRotation': { rotation: ops.axleAngle * degreesToRadians },
            'ngPhysic': {
                restitution: 0.0,
                friction: 200.0,
                density: 1.0
            },
            'ngCollisionGroup': {
                'neverWith': 'vehicle'
            }
        });

        //* right-container
        world.$e('vehicle-left-suspension-container-' + name, {
            'ng2D': {x : x + ops.axleContainerDistance, y: y + ops.axleContainerDepth},
            'ng2DSize': {width: 2 * ops.axleContainerWidth, height: 2 * ops.axleContainerHeight},
            'ng2DRotation': { rotation: -ops.axleAngle * degreesToRadians },
            'ngPhysic': {
                partOf: bodyName,
                restitution: 0.0,
                friction: 200.0,
                density: 0.5
            },
            'ngCollisionGroup': {
                'neverWith': 'vehicle'
            }
        });

        //* right-axle
        var rightSuspensionAxleName = 'vehicle-right-suspension-axle-' + name;
        var rightSuspensionAxleX = x + ops.axleContainerDistance + ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians);
        var rightSuspensionAxleY = y + ops.axleContainerDepth + ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians);

        world.$e(rightSuspensionAxleName, {
            'ng2D': {
                x: rightSuspensionAxleX,
                y: rightSuspensionAxleY
            },
            'ng2DSize': {width: 2 + 2 * ops.axleContainerWidth / 2, height: 2 * ops.axleContainerHeight},
            'ng2DRotation': { rotation: -ops.axleAngle * degreesToRadians },
            'ngPhysic': {
                restitution: 0.0,
                friction: 200.0,
                density: 0.5
            },
            'ngCollisionGroup': {
                'neverWith': 'vehicle'
            }
        });

        //revolute-joints
        //*left
        leftWheelRevoluteJoint = world.$e('vehicle-left-wheel-revolute-joint-' + name, {
            'ng2D': {
                x: x - ops.axleContainerDistance - 2 * ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians),
                y: y + ops.axleContainerDepth + 2 * ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians)
            },
            'ngRevoluteJoint': {
                //maxMotorTorque: 20.0,
                bodyA: leftWheelName,
                bodyB: leftSuspensionAxleName
            },
            'ngEnableMotorOnKeyDown': ops.rearWheelDrive?{
                keyCode: [37, 65],
                keyCodeReverse: [39, 68]
            }:{},
            ngAnyJoint: {
                onEnabledReverse: [
                    {
                        ngAmbientSound : {
                            urls: ['assets/sfx/engine-loop-0.ogg', 'assets/sfx/engine-loop-0.mp3'],
                            volume: 0.03,
                            loop: true,
                            stopPlayAfterRemove: true
                        }
                    },
                    driveRightHandler
                ],
                onEnabled:[
                    {
                        ngAmbientSound : {
                            urls: ['assets/sfx/tires-squal-loop-0.ogg', 'assets/sfx/tires-squal-loop-0.mp3'],
                            volume: 0.03,
                            loop: true,
                            stopPlayAfterRemove: true
                        }
                    },
                    driveLeftHandler
                ],
                onDisabled: stopDrivingHandler
            },
            'ngSelected': true,
            'ngMotorWithAcceleration': {
                min:-ops.wheelMaxSpeed,
                max: ops.wheelMaxSpeed,
                acceleration: ops.wheelAcceleration
            }
        });

        //*right
        rightWheelRevoluteJoint = world.$e('vehicle-right-wheel-revolute-joint-' + name, {
            'ng2D': {
                x: x + ops.axleContainerDistance + 2 * ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians),
                y: y + ops.axleContainerDepth + 2 * ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians)
            },
            'ngRevoluteJoint': {
                //maxMotorTorque: 20.0,
                bodyA: rightWheelName,
                bodyB: rightSuspensionAxleName
            },
            'ngEnableMotorOnKeyDown': ops.frontWheelDrive?{
                keyCode: [37, 65],
                keyCodeReverse: [39, 68]
            }:{},
            'ngSelected': true,
            'ngMotorWithAcceleration': {
                min:-ops.wheelMaxSpeed,
                max: ops.wheelMaxSpeed,
                acceleration: ops.wheelAcceleration
            }
        });

        //prismatic-joints
        //*left
        world.$e('vehicle-left-wheel-prismatic-joint-' + name, {
            'ng2D': {
                x: leftSuspensionAxleX,
                y: leftSuspensionAxleY
            },
            'ngPrismaticJoint': {
                anchorA: {
                    x: 0.0,
                    y: 0.0
                },
                anchorB: {
                    x: + ops.axleContainerDepth * Math.cos((90 - ops.axleAngle)*degreesToRadians),
                    y: - ops.axleContainerDepth * Math.sin((90 - ops.axleAngle)*degreesToRadians)
                },
                bodyA: leftSuspensionAxleName,
                bodyB: bodyName,
                maxMotorForce: 10.0,
                enableLimit: true,
                enableMotor: true,
                motorSpeed: 10.0
            }
        });

        //*right

        world.$e('vehicle-right-wheel-prismatic-joint-' + name, {
            'ng2D': {
                x: rightSuspensionAxleX,
                y: rightSuspensionAxleY
            },
            'ngPrismaticJoint': {
                anchorA: {
                    x: 0.0,
                    y: 0.0
                },
                anchorB: {
                    x: - ops.axleContainerDepth * Math.cos((90 - ops.axleAngle) * degreesToRadians),
                    y: - ops.axleContainerDepth * Math.sin((90 - ops.axleAngle) * degreesToRadians)
                },
                bodyA: rightSuspensionAxleName,
                bodyB: bodyName,
                maxMotorForce: 10.0,
                enableLimit: true,
                enableMotor: true,
                motorSpeed: 10.0
            }
        });

        function fullStop() {
            stop();

            leftWheel.ngPhysic.angularDamping = wheelAngularDampingOnStop;
            rightWheel.ngPhysic.angularDamping = wheelAngularDampingOnStop;
        }

        function stop() {
            leftWheelRevoluteJoint.$remove('ngEnableMotor');
            leftWheelRevoluteJoint.$remove('ngEnableMotorReverse');
            rightWheelRevoluteJoint.$remove('ngEnableMotor');
            rightWheelRevoluteJoint.$remove('ngEnableMotorReverse');
        }

        function left() {
            leftWheelRevoluteJoint.$remove('ngEnableMotorReverse');
            rightWheelRevoluteJoint.$remove('ngEnableMotorReverse');
            leftWheelRevoluteJoint.$add('ngEnableMotor');
            rightWheelRevoluteJoint.$add('ngEnableMotor');
        }

        function right() {
            leftWheelRevoluteJoint.$add('ngEnableMotorReverse');
            rightWheelRevoluteJoint.$add('ngEnableMotorReverse');
            leftWheelRevoluteJoint.$add('ngEnableMotor');
            rightWheelRevoluteJoint.$add('ngEnableMotor');
        }

        function immortal() {
            vehicleBody.$remove('ngLive');
        }

        return {
            fullStop: fullStop,
            stop: stop,
            left: left,
            right: right,
            immortal: immortal
        }
    }

    function buildCity(ops) {
        var count = ops.count,
            last,
            distance = Math.floor(3 * Math.random());
        for(var i = 0; i < count; i++) {
            last = world.$e('city-' + i, {

                ng3D: {
                    x: i * ops.step,
                    y: ops.y,
                    z: ops.depth + ops.depthDeviation * ( 2 * distance / 3 - 1)
                },
                ngConvert3DtoParallax: true,
                ng2D: false,

                ng2DSize: {
                    width: ops.step,
                    height: 512
                },

                ngCyclic: {
                    patternWidth: (count + 2) * ops.step
                },

                ngSprite: {
                    name: 'city-0.png',
                    spriteSheetUrl: 'assets/spritesheet.json',
                    layerName: 'city-' + distance,
                    anchor: {
                        x: 0.5,
                        y: 1.0
                    }
                }
            });
        }
    }

    function buildCloudFront(ops) {
        world.$e('rain-sound', {
            'ng2D': {
                x: ops.frontStart,
                y: 500.0
            },

            'ngShiftMove': {
                dx: ops.frontSpeed,
                dy: 0.0
            },

            ngSound: {
                urls: ['assets/sfx/rain-loop-0.ogg', 'assets/sfx/rain-loop-0.mp3'],
                loop: true,
                stopPlayAfterRemove: true,
                distance: 100
            }
        });

        world.$e('clouds-front-sensor', {
                'cloudsFront': {},

                'ng2D': {
                    x: ops.frontStart - 512,
                    y: 500.0
                },

                'ng2DSize': {
                    width: 512,
                    height: 480
                },

                'ngPhysic': {},

                'ngSensor': {},

                'ngBindPositionToPhysics': {},

                'ngShiftMove': {
                    dx: ops.frontSpeed,
                    dy: 0.0
                }
            }
        );

        world.$e('doom-sky', {
                'ng2D': {
                    x: ops.frontStart - 320.0,
                    y: 0.0
                },

                'ng2DSize': {
                    width: width,
                    height: height
                },

                'ngShiftMove': {
                    dx: ops.frontSpeed,
                    dy: 0.0
                },

                'ngLockOnViewPortOnShiftToIt': {
                    entitiesToRemove: ['clouds-front', 'clouds-factory', 'sky']
                },

                ngSprite: {
                    name: 'doom.png',
                    spriteSheetUrl: 'assets/spritesheet.json',
                    layerName: 'background'
                },

                'ngLockViewPort': {
                    lockX: false,
                    lockY: true
                }
            }
        );

        world.$e(
            'clouds-front', {
                'ng2D': {
                    x: ops.frontStart - 3,
                    y: 0.0
                },

                'ngShiftMove': {
                    dx: ops.frontSpeed,
                    dy: 0.0
                },

                ngSprite: {
                    name: 'doom-front.png',
                    spriteSheetUrl: 'assets/spritesheet.json',
                    layerName: 'background',
                    anchor: {
                        x: 0.0,
                        y: 0.5
                    }
                },

                'ngLockViewPort': {
                    lockX: false,
                    lockY: true
                }
            }
        );

        if (ops.useCloudFactory) {
            world.$e('clouds-factory', {
                'ng2D': {
                    x: ops.frontStart,
                    y: 275.0
                },

                'ng2DSize': {
                    width: 1.0,
                    height: 200.0
                },

                'ngShiftMove': {
                    dx: ops.frontSpeed,
                    dy: 0.0
                },

                'ngEmitterRandomCounter': {
                    minRate: ops.cloudMinRate || 0.75,
                    maxRate: ops.cloudMaxRate || 2.0
                },

                'ngEmitter': {
                    generate: function(emitter) {
                        var edge = width;
                        var distance = Math.random();

                        return {
                            $name: 'cloud',

                            ng2D: {},

                            'ng2DSize': {
                                width: 60.0,
                                height: 1.0
                            },

                            ngSprite: {
                                name: 'cloud-' + Math.floor(3 * Math.random()) + '.png',
                                spriteSheetUrl: 'assets/spritesheet.json',
                                layerName: 'clouds'
                            },

                            'ngShiftMove': {
                                dx: 20 + ops.frontSpeed + 80 * distance,
                                dy: 0.0
                            },

                            'ngRemoveIfDead': true,


                            'ngLifeZone': true,

                            'ngLife': {
                                life: 0.01
                            },

                            'ngLifeIsGrooving': {
                                delta: 0.1
                            },

                            'ngBindLifeToAlpha': true,

                            'ngLive': true,

                            'ngRectangleZone': {
                                left: -edge + emitter.ng2D.x,
                                right: edge + emitter.ng2D.x,
                                top:  -edge + emitter.ng2D.y,
                                bottom:edge + emitter.ng2D.y
                            },

                            'ngEmitterRandomCounter': {
                                minRate: 0.0,
                                maxRate: 1.0
                            },

                            'ngEmitter': {
                                generate: function(emitter) {
                                    if (Math.random() > 0.95) {
                                        var lightningType = Math.floor(2 * Math.random());
                                        return [{
                                            $name: 'thunder-of-' + emitter.$name,

                                            ng2D: {
                                                x : emitter.ng2D.x,
                                                y: emitter.ng2D.y
                                            },

                                            ngSound: {
                                                urls: ['assets/sfx/thunder-' + lightningType + '.ogg', 'assets/sfx/thunder-' + lightningType + '.mp3'],
                                                loop: false,
                                                distance: 50
                                            }
                                        },{
                                            '$name': 'lightning-of-' + emitter.$name,

                                            'ng2D': {x : emitter.ng2D.x, y: emitter.ng2D.y},

                                            ngSprite: {
                                                name: 'lightning-' + lightningType + '.png',
                                                spriteSheetUrl: 'assets/spritesheet.json',
                                                layerName: 'clouds'
                                            },

                                            'ngLife': {
                                                life: 1.0
                                            },

                                            'ngLifeIsGrooving': {
                                                delta: -1.0
                                            },

                                            'ngBindLifeToAlpha': true,

                                            'ngLive': true,

                                            'ngRemoveIfDead': true
                                        }];
                                    } else {
                                        return {
                                            '$name': 'drop-of-' + emitter.$name,

                                            'drop': true,

                                            'ng2D': {x : emitter.ng2D.x, y: emitter.ng2D.y},

                                            'ng2DCircle': {radius: 3},

                                            'ng2DRotation': true,

                                            'ngPhysic': {
                                                density: 2.0
                                            },

                                            ngSprite: {
                                                name: 'drop.png',
                                                spriteSheetUrl: 'assets/spritesheet.json',
                                                layerName: 'clouds'
                                            },

                                            'ngLife': {
                                                life: 0.01
                                            },

                                            'ngLifeIsGrooving': {
                                                delta: 0.2
                                            },

                                            'ngBindLifeToAlpha': true,

                                            'ngLive': true,

                                            'ngRemoveIfDead': true,

                                            'ngWantsToCollide': {
                                                'with': [
                                                    {
                                                        'andGet': {
                                                            'ngEmitter': {
                                                                generate: {
                                                                    ngSound: {
                                                                        urls: ['assets/sfx/drops-1.ogg', 'assets/sfx/drops-1.mp3'],
                                                                        loop: false,
                                                                        distance: 10
                                                                    }
                                                                }
                                                            },
                                                            'ngEmit': true,
                                                            'ngDead': true
                                                        }
                                                    }
                                                ]
                                            }
                                        };
                                    }
                                }
                            }
                        };
                    }
                }
            });
        }
    }

    function buildMountain(ops) {
        var count = 4,
            step = 1000,
            distance =  Math.floor(3 * Math.random());

        for(var i = 0; i < count; i++) {
            world.$e('mountain-' + i, {

                ng3D: {
                    x: i * step,
                    y: 1100,
                    //z: 1.8 + 0.3 * distance / 3,
                    z: ops.depth + ops.depthDeviation * ( 2 * distance / 3 - 1)
                },
                ngConvert3DtoParallax: true,
                ng2D: false,

                ng2DSize: {
                    width: step,
                    height: 512
                },

                ngCyclic: {
                    patternWidth: count * step + 2000
                },

                ngSprite: {
                    name: 'mountain-' + i + '.png',
                    spriteSheetUrl: 'assets/spritesheet.json',
                    layerName: 'mountain-' + distance,
                    anchor: {
                        x: 0.5,
                        y: 1.0
                    }
                }
            });
        }
    }

    /**
     * @public
     */
    function fullStopVehicle() {
        fullStopped = true;

        world.$remove(enableMotorOnKeyDownSystem);
        if (playerVehicle) {
            playerVehicle.fullStop();
            playerVehicle.immortal();
        }
    }

    function driveLeft() {
        if (fullStopped) {
            return false;
        }
        if (playerVehicle) {
            playerVehicle.left();
        }
        return true;
    }

    function driveRight() {
        if (fullStopped) {
            return false;
        }
        if (playerVehicle) {
            playerVehicle.right();
        }
        return true;
    }

    function stopDriving() {
        if (playerVehicle) {
            playerVehicle.stop();
        }
    }

    function driveLeftHandler() {
        $rootScope.$broadcast('drive-left');
    }

    function driveRightHandler() {
        $rootScope.$broadcast('drive-right');
    }

    function stopDrivingHandler() {
        $rootScope.$broadcast('stop-driving');
    }

    /**
     * API of Game Service
     */
    return {
        isLoaded: isLoaded,
        load: load,

        build: build,
        destroy: destroy,

        selectLevel: selectLevel,

        start: start,
        stop: stop,

        isPaused: isPaused,
        pause: pause,
        unPause: unpause,

        enableSound: enableSound,
        isMute: isMute,
        unMute: unMute,
        mute: mute,

        setStageSize: setStageSize,

        stopVehicle: fullStopVehicle,

        driveLeft: driveLeft,
        driveRight: driveRight,
        stopDriving: stopDriving
    };
}]);