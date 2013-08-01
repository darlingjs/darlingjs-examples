(function() {
    'use strict';

    var world = darlingjs.world('pong',
                ['domModule',
                'controlModule',
                'physicsModule',
                'gamePlayModule']),
        aspectRatio = 2,
    /**
     * window.innerWidth and window.innerHeight === 0 inside iFrame at 1st moment.
     * Need to get size from documentElement
     */
        windowWidth = document.documentElement.clientWidth,
        windowHeight = document.documentElement.clientHeight;

    /**
     * fit to screen with aspect
     */
    if (windowWidth < aspectRatio * windowHeight) {
        var width = windowWidth,
            height = windowWidth / aspectRatio;
    } else {
        var width = aspectRatio * windowHeight,
            height = windowHeight;
    }

    // add view renderer system

    world.$add('domViewRenderer', {
        //target div element
        target: '#gameStage',
        width: width,
        height: height,
        backgroundColor: '#008B9A'
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

        //target DOM element for player 1 score output
        player1TargetElement: '#playerScore1',

        //target DOM element for player 2 score output
        player2TargetElement: '#playerScore2'
    });


    // build game scene

    var paddleHeight = height/3;
    if (paddleHeight > 100) paddleHeight = 100;
    world.$e('LeftPaddle', {
        domView: {color: '#ED4501'},
        ng2D: {x: 20, y: height / 2},
        ng2DSize: {width: 10, height: paddleHeight},
        control: {
            up: 87 /* W */, down: 83 /* S */,
            maxY: height - paddleHeight/2, minY: paddleHeight/2,
            speed: 4
        },
        solid: {
            type: 'left-paddle'
        }
    });

    world.$e('RightPaddle', {
        domView: {color: '#BBD401'},
        ng2D: {x: width - 20, y: height / 2},
        ng2DSize: {width: 10, height: paddleHeight},
        control: {
            up: 38 /* arrow up */, down: 40 /* arrow down */,
            maxY: height - paddleHeight/2, minY: paddleHeight/2,
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
        domView: {color: 'rgb(255,255,255)'},
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
})();