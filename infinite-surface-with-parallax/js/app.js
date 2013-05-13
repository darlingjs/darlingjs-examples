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
        'ng3D',
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
        width: width,// + 100,
        height: height,// + 100,
        useWebGL: true
    });

    world.$add('ngPixijsUpdateCycle');
    world.$add('ngPixijsViewPortUpdateCycle');
    world.$add('ngPixijsSpriteFactory');

    world.$add('ngConvert3DtoParallax');
    world.$add('ngSimpleParallax');

    world.$add('ngMarkIfOutsideOfTheViewPortVertical3D');
    world.$add('ngMarkIfOutsideOfTheViewPortHorizontal3D');
    world.$add('ngMarkIfInsideOfTheViewPortVertical3D');
    world.$add('ngMarkIfInsideOfTheViewPortHorizontal3D');
    world.$add('ng3DCyclicLayer');

    var time = 0,
        speed = 2;
    world.$s('', {
        $update: ['ng2DViewPort', function(ng2DViewPort) {
            ng2DViewPort.lookAt.x += speed * Math.cos(0.0007 * time);
            ng2DViewPort.lookAt.y += speed * Math.sin(0.0003 * time);
            time++;
        }]
    });

    world.$add('ngStatsEnd', {
        domId: 'gameView'
    });

    world.$add('ngPerformanceStopLog');

    var xStep = 16,
        yStep = 16,
        icount = Math.ceil(width / xStep) + 13,
        jcount = Math.ceil(height / yStep) + 10,
        pixels = ['blue-pixel.jpg', 'green-pixel.jpg', 'yellow-pixel.jpg', 'purple-pixel.jpg'];

    for (var j = 0; j < jcount; j++) {
        for (var i = 0; i < icount; i++) {
            var depth = Math.cos( 2 * Math.PI * j / jcount) * Math.cos( 2 * Math.PI * i / icount);
            world.$e('node_' + i + "_" + j, {
                ng3D: {
                    x: xStep * i,
                    y: yStep * j,
                    z: 0.1 + 0.2 * depth
                },
                ngConvert3DtoParallax: true,

                ngCyclic: {
                    group: 'nodes',
                    patternWidth: xStep * icount,
                    patternHeight: yStep * jcount
                },

                ngPixijsSprite: false,
                ngSprite : {
                    name: pixels[Math.floor(i) % 4],
                    spriteSheetUrl: 'assets/spritesheet.json',
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
