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
        'ngStats'
    ]);

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

    world.$add('ngConvert3DtoParallax');
    world.$add('ngSimpleParallax');

    world.$add('ngMarkIfOutsideOfTheViewPort');
    world.$add('ngMarkIfInsideOfTheViewPort');
    world.$add('ngCyclic3DLayer');

    world.$add('ngStatsEnd', {
        domId: 'gameView'
    });

    var border = 32,
        xStep = 16,
        yStep = 16,
        icount = Math.ceil((width + 2 * border) / xStep) + 3,
        jcount = Math.ceil((height + 2 * border) / yStep) + 3,
        pixels = ['blue-pixel.jpg', 'green-pixel.jpg', 'purple-pixel.jpg', 'yellow-pixel.jpg'];

    for (var j = 0; j < jcount; j++) {
        for (var i = 0; i < icount; i++) {
            var nodeId = Math.floor(pixels.length * Math.random());
            world.$e('node_' + i + "_" + j, {
                ng3D: {
                    x: xStep * i,
                    y: yStep * j,
                    z: 0.0
                    //z: 0.1 + Math.sin( 2 * Math.PI * j / jcount) * 0.3
                },
                ngConvert3DtoParallax: true,
                ng2D: false,

                ng2DSize: {
                    width: xStep,
                    height: yStep
                },

                ngCyclic: {
                    group: 'nodes',
                    patternWidth: xStep * icount,
                    patternHeight: yStep * jcount,
                    leftRight: true,
                    topBottom: true
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

    setTimeout(update_ng2DViewPort, 1000/60);

    function update_ng2DViewPort() {
        ng2DViewPort.lookAt.x += 1.0 * Math.cos(0.0007 * Date.now());
        ng2DViewPort.lookAt.y += 2 * Math.sin(0.0003 * Date.now());
        setTimeout(update_ng2DViewPort, 1000/60);
    }

})(darlingjs, darlingutil);
