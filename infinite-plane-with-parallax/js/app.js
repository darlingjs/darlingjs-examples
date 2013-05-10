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
        width: width,// + 100,
        height: height,// + 100,
        useWebGL: true
    });

    world.$add('ngPixijsSheetSprite');

    world.$add('ngConvert3DtoParallax');
    world.$add('ngSimpleParallax');

    world.$add('ngMarkIfOutsideOfTheViewPortVertical3D');
    world.$add('ngMarkIfOutsideOfTheViewPortHorizontal3D');
    world.$add('ngMarkIfInsideOfTheViewPortVertical3D');
    world.$add('ngMarkIfInsideOfTheViewPortHorizontal3D');
    world.$add('ng3DCyclicLayer');

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

    var xStep = 16,
        yStep = 16,
        icount = Math.ceil(width / xStep) + 14,
        jcount = Math.ceil(height / yStep) + 10,
        pixels = ['blue-pixel.jpg', 'green-pixel.jpg', 'yellow-pixel.jpg', 'purple-pixel.jpg'];

    for (var j = 0; j < jcount; j++) {
        for (var i = 0; i < icount; i++) {
            var nodeId = Math.floor(pixels.length * Math.random());
            var depth = Math.cos( 2 * Math.PI * j / jcount) * Math.cos( 2 * Math.PI * i / icount);
//            var depth = Math.random();
//            var depth = 0.0;
            //nodeId = Math.floor(pixels.length * (depth / 2 + 0.4));
//            console.log('depth = ' + depth + '\tnodeId = ' + nodeId);
            world.$e('node_' + i + "_" + j, {
                ng3D: {
                    x: xStep * i,
                    y: yStep * j,
//                    z: 0.0
                    z: 0.1 + 0.2 * depth
                },
                ngConvert3DtoParallax: true,
                ng2D: false,

                ng2DSize: {
                    width: 0,//xStep - 8,
                    height: 0//yStep - 8
                },

                ngCyclic: {
                    group: 'nodes',
                    patternWidth: xStep * icount,
                    patternHeight: yStep * jcount
                },

                ngPixijsSprite: false,
                ngSpriteAtlas : {
//                    name: pixels[nodeId],
//                    name: pixels[Math.floor(pixels.length * (depth + 1) / 2 + Math.random())%4],
//                    name: pixels[Math.floor(i + 4.3 * (Math.sin(2 * Math.PI * j / jcount + 1 ) + 1)) % 4],
                    name: pixels[Math.floor(i) % 4],
                    url: 'assets/spritesheet.json',
//                    fitToSize: true,
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
