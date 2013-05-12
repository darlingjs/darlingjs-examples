/**
 * Project: darlingjs / GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function(darlingjs, darlingutil) {
    'use strict';
    var width = 640,
        height = 480,
        world = darlingjs.w('theCyclicWorld', [
        'ngFlatland',
        'ngCyclic',
        'ngPixijsAdapter',
        'ngStats',
        'ngPerformance'
    ]);

    world.$add('ngPerformanceStartLog');

    world.$add('ngStatsBegin');

    var ng2DViewPort = world.$add('ng2DViewPort', {
        lookAt: {
            x: width / 2, y: height / 2
        },
        width: width,
        height: height
    });

    world.$add('ngPixijsStage', {
        domId: 'gameView',
        width: width,
        height: height,
        useWebGL: true
    });

    world.$add('ngPixijsSheetSprite');

    world.$add('ng2DCyclicLayer');
    world.$add('ngMarkIfOutsideOfTheViewPortVertical2D');
    world.$add('ngMarkIfOutsideOfTheViewPortHorizontal2D');
    world.$add('ngMarkIfInsideOfTheViewPortVertical2D');
    world.$add('ngMarkIfInsideOfTheViewPortHorizontal2D');

    var time = 445;
    world.$s('', {
        $update: ['ng2DViewPort', function(ng2DViewPort) {
            ng2DViewPort.lookAt.x += 8 * 0.25 * Math.cos(0.0007 * time);
            ng2DViewPort.lookAt.y += 8 * 0.5 * Math.sin(0.0003 * time);
            time++;
        }]
    });

    world.$add('ngStatsEnd', {
        domId: 'gameView'
    });

    world.$add('ngPerformanceStopLog');

    var xStep = 32,
        yStep = 32,
        icount = Math.ceil(width / xStep) + 1,
        jcount = Math.ceil(height / yStep) + 1,
        pixels = ['blue-pixel.jpg', 'green-pixel.jpg', 'yellow-pixel.jpg', 'purple-pixel.jpg'];

    for (var j = 0; j < jcount; j++) {
        for (var i = 0; i < icount; i++) {
            var nodeId = Math.floor(pixels.length * Math.random());
            world.$e('node_' + i + "_" + j, {
                ng2D: {
                    x: xStep * i,
                    y: yStep * j
                },

                ngCyclic: {
                    patternWidth: xStep * icount,
                    patternHeight: yStep * jcount
                },

                ngPixijsSprite: false,
                ngSpriteAtlas : {
                    name: pixels[nodeId],
                    url: 'assets/spritesheet.json',
                    anchor: {
                        x: 0.0,
                        y: 1.0
                    }
                }
            });
        }
    }

    world.$start();

})(darlingjs, darlingutil);
