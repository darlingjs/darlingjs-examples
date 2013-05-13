/**
 * Project: darlingjs / GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function(darlingjs, darlingutil) {
    'use strict';
    var width = 640,
        height = 480;

    //Create game world
    var world = darlingjs.w('theCyclicWorld', [
        'ngFlatland',
        'ngCyclic',
        'ng3D',
        'ngPixijsAdapter',
        'ngStats',
        'ngPerformance'
    ]);

    // ---------------------------------------------------------------
    //
    //  Systems adding section
    //
    // ---------------------------------------------------------------

    //any system add some abilities

    //start log performance
    world.$add('ngPerformanceLogBegin');

    //start log statistics
    world.$add('ngStatsBegin');

    //define viewport properties
    var ng2DViewPort = world.$add('ng2DViewPort', {
        lookAt: {
            x: width / 2, y: height / 2
        },
        width: width,
        height: height
    });

    //visualization
    world.$add('ngPixijsStage', {
        domId: 'gameView',
        width: width,
        height: height,
        useWebGL: true
    });

    //create sprites
    world.$add('ngPixijsSpriteFactory');

    //update positions
    world.$add('ngPixijsUpdateCycle');

    //update position based on viewport
    world.$add('ngPixijsViewPortUpdateCycle');

    //convert ng3D properties to ngParallax.basis
    world.$add('ngConvert3DtoParallax');

    //convert ngParallax and ng3D to ng2D
    world.$add('ngSimpleParallax');

    //support cyclic of ng3D position (use ngCyclic)
    world.$add('ngMarkIfOutsideOfTheViewPortVertical3D');
    world.$add('ngMarkIfOutsideOfTheViewPortHorizontal3D');
    world.$add('ngMarkIfInsideOfTheViewPortVertical3D');
    world.$add('ngMarkIfInsideOfTheViewPortHorizontal3D');
    world.$add('ng3DCyclicLayer');

    //defined custom system for rambling viewport
    var time = 0,
        speed = 2;

    world.$s('ramblingViewport', {
        //every frame we just update position of viewport
        $update: ['ng2DViewPort', function(ng2DViewPort) {
            ng2DViewPort.lookAt.x += speed * Math.cos(0.0007 * time);
            ng2DViewPort.lookAt.y += speed * Math.sin(0.0003 * time);
            time++;
        }]
    });

    //end of collecting statistics
    world.$add('ngStatsEnd', {
        domId: 'gameView'
    });

    //end of collecting performance
    world.$add('ngPerformanceLogEnd');

    // ---------------------------------------------------------------
    //
    //  Entities adding section
    //
    // ---------------------------------------------------------------

    // just feel square with entities

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

    //run world

    world.$start();
})(darlingjs, darlingutil);
