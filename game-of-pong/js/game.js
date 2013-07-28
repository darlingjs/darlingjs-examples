/**
 * TODO:
 * window.innerWidth and window.innerHeight === 0 inside iFrame at 1st moment.
 * Need to wait a moment to get them
 */
setTimeout(init, 0);

function init() {
    'use strict';

    var world = darlingjs.world('pong',
                ['domModule',
                'controlModule',
                'physicsModule',
                'gamePlayModule']),
        aspectRatio = 2;

    /**
     * fit to screen with aspect
     */
    if (window.innerWidth < aspectRatio * window.innerHeight) {
        var width = window.innerWidth,
            height = window.innerWidth / aspectRatio;
    } else {
        var width = aspectRatio * window.innerHeight,
            height = window.innerHeight;
    }

    console.log('width ' + width);
    console.log('height ' + height);

    // add view renderer system

    world.$add('domViewRenderer', {
        target: '#gameStage',
        width: width,
        height: height,
        backgroundColor: 'rgb(127,127,127)'
    });


    // add control systems

    world.$add('controlSystem');
    world.$add('controlMoveUp');
    world.$add('controlMoveDown');


    // add physics systems

    world.$add('impulseUpdate', {
        width: width,
        height: height
    });
    world.$add('pongCollision');


    // add game play system

    world.$add('gamePlay', {
        width: width,
        height: height,

        player1TargetElement: '#playerScore1',
        player2TargetElement: '#playerScore2'
    });


    // build game scene

    var paddleHeight = 50;
    world.$e('LeftPaddle', {
        domView: {color: 'rgb(255,0,0)'},
        ng2D: {x: 20, y: height / 2},
        ng2DSize: {width: 10, height: 100},
        control: {
            up: 87 /* W */, down: 83 /* S */,
            maxY: height - paddleHeight, minY: paddleHeight,
            speed: 4
        },
        solid: {
            type: 'left-paddle'
        }
    });

    world.$e('RightPaddle', {
        domView: {color: 'rgb(0,255,0)'},
        ng2D: {x: width - 20, y: height / 2},
        ng2DSize: {width: 10, height: 100},
        control: {
            up: 38 /* arrow up */, down: 40 /* arrow down */,
            maxY: height - paddleHeight, minY: paddleHeight,
            speed: 4
        },
        solid: {
            type: 'right-paddle'
        }
    });


    //throw the ball

    var angle = Math.PI * Math.random(),
        power = 5;

    if (angle < Math.PI/2) {
        angle -= Math.PI/4;
    } else {
        angle += Math.PI/4;
    }

    world.$e('ball', {
        domView: {color: 'rgb(0,0,255)'},
        ng2D: {x: width / 2, y: height / 2},
        ng2DSize: {width: 10, height: 10},
        impulse: {
            x: power * Math.cos(angle), y: power * Math.sin(angle)
        },
        solid: {
            type: 'ball'
        },
        ball: true
    });

    //Ready, Steady, Go!

    world.$start();
};