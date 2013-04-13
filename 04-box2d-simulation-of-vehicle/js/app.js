'use strict';
/**
 * Project: darlingjs / GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

var width = 800;
var height = 600;

var world = darlingjs.world('myGame', ['ngModule', 'ngCommon', 'ngFlatland', 'ngPhysics', 'ngBox2DEmscripten', 'ngStats'], {
    fps: 60
});

// systems

world.$add('ngStatsBegin');

world.$add('ng2DViewPort', {
    lookAt: {
        x: 400, y: 300
    }
});

world.$add('ngBox2DSystem', {
    gravity: {
        x:0,
        y:9.8
    }
});

world.$add('ngBox2DDebugDraw', {
    domID: 'canvas', width: width, height: height
});

world.$add('ngBox2DDraggable', { domId: 'gameView', width: width, height: height });
world.$add('ngBox2DFixRotation');
world.$add('ngBox2DCollisionGroup');
world.$add('ngBox2DRevoluteJoint');
world.$add('ngBox2DPrismaticJoint');
world.$add('ngEnableMotorOnKeyDown');
world.$add('ngBox2DEnableMotorSystem');
world.$add('ngBox2DMotorWithAcceleration');


world.$add('ngStatsEnd');

// entities

// test heap of rocks

for (var i = 0, l = 50; i < l; i++) {
    var fixed = Math.random() > 0.5;
    var boxType = Math.floor(1 + 3 * Math.random());
    var box = world.$add(world.$e('obstacle_' + i, {
//            'ngDOM': { color: fixed?'rgb(0, 255, 0)':'rgb(200, 200, 0)'},
        //Get From : http://www.iconfinder.com/search/?q=iconset%3Aie_ICandies
//            'ngSprite': { name: 'assets/box' + boxType + '.png', fitToSize: true },
//        'ngSpriteAtlas' : { name: 'box' + boxType + '.png', url: 'assets/spritesheet.json', fitToSize: true},
//            'ngMovieClip' : {url: 'assets/explosion.json', fitToSize: true, frames: ['Explosion_Sequence_A 1.png', 'Explosion_Sequence_A 2.png', 'Explosion_Sequence_A 3.png', 'Explosion_Sequence_A 4.png', 'Explosion_Sequence_A 5.png', 'Explosion_Sequence_A 6.png', 'Explosion_Sequence_A 7.png', 'Explosion_Sequence_A 8.png', 'Explosion_Sequence_A 9.png', 'Explosion_Sequence_A 10.png', 'Explosion_Sequence_A 11.png', 'Explosion_Sequence_A 12.png', 'Explosion_Sequence_A 13.png', 'Explosion_Sequence_A 14.png', 'Explosion_Sequence_A 15.png', 'Explosion_Sequence_A 16.png', 'Explosion_Sequence_A 17.png', 'Explosion_Sequence_A 18.png', 'Explosion_Sequence_A 19.png', 'Explosion_Sequence_A 20.png', 'Explosion_Sequence_A 21.png', 'Explosion_Sequence_A 22.png', 'Explosion_Sequence_A 23.png', 'Explosion_Sequence_A 24.png', 'Explosion_Sequence_A 25.png', 'Explosion_Sequence_A 26.png', 'Explosion_Sequence_A 27.png']},
        'ng2D': {x : width / 2 + (width / 2) * Math.random(), y: 40 + (height - 40) * Math.random()},
        'ng2DSize': {width:30, height:30},
        'ng2DRotation': {},
        'ngPhysic': {},
        'ngCollisionGroup': {
            'neverWith': 'stones'
        },
        'ngDraggable': {},
        'ngFixedRotation': {}
    }));
//    (function(box) {
//        setTimeout(function() {
//            world.$remove(box);
//        }, 10000 * Math.random());
//    }) (box);
}

//vehicle

function vehicle(x, y, name){
    var carWidth = 45;
    var carHeight = 10;
    var axleContainerDistance = 30;
    var axleContainerWidth = 5;
    var axleContainerHeight = 20;
    var axleContainerDepth = 10;
    var axleAngle = 20;
    var wheelRadius = 25;

    var wheelMaxSpeed = 10.0;
    var wheelAcceleration = 0.5;

    var degreesToRadians = Math.PI / 180;

    //body
    var bodyName = 'vehicle-body-' + name;
    world.$add(world.$e(bodyName, {
        'ng2D': {x : x, y: y},
        'ng2DSize': {width:2 * carWidth, height:2 * carHeight},
        'ng2DRotation': {},
        'ngDraggable': {},
        'ngPhysic': {
            restitution: 0.0,
            friction: 200.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        }
    }));

    //suspension
    //* left-container
    world.$add(world.$e('vehicle-left-suspension-container-' + name, {
        'ng2D': {x : x - axleContainerDistance, y: y + axleContainerDepth},
        'ng2DSize': {width: 2 * axleContainerWidth, height: 2 * axleContainerHeight},
        'ng2DRotation': { rotation: axleAngle*degreesToRadians },
        'ngPhysic': {
            partOf: bodyName,
            restitution: 0.0,
            friction: 200.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        }
    }));

    //* left-axle
    var leftSuspensionAxleName = 'vehicle-left-suspension-axle-' + name;
    var leftSuspensionAxleX = x - axleContainerDistance - axleContainerHeight * Math.cos((90 - axleAngle) * degreesToRadians);
    var leftSuspensionAxleY = y + axleContainerDepth + axleContainerHeight * Math.sin((90 - axleAngle) * degreesToRadians);

    world.$add(world.$e(leftSuspensionAxleName, {
        'ng2D': {
            x: leftSuspensionAxleX,
            y: leftSuspensionAxleY
        },
        'ng2DSize': {width: 2 * axleContainerWidth / 2, height: 2 * axleContainerHeight},
        'ng2DRotation': { rotation: axleAngle*degreesToRadians },
        'ngPhysic': {
            restitution: 0.0,
            friction: 200.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        }
    }));

    //* right-container
    world.$add(world.$e('vehicle-left-suspension-container-' + name, {
        'ng2D': {x : x + axleContainerDistance, y: y + axleContainerDepth},
        'ng2DSize': {width: 2 * axleContainerWidth, height: 2 * axleContainerHeight},
        'ng2DRotation': { rotation: -axleAngle*degreesToRadians },
        'ngPhysic': {
            partOf: bodyName,
            restitution: 0.0,
            friction: 200.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        }
    }));

    //* right-axle
    var rightSuspensionAxleName = 'vehicle-right-suspension-axle-' + name;
    var rightSuspensionAxleX = x + axleContainerDistance + axleContainerHeight * Math.cos((90 - axleAngle) * degreesToRadians);
    var rightSuspensionAxleY = y + axleContainerDepth + axleContainerHeight * Math.sin((90 - axleAngle) * degreesToRadians);

    world.$add(world.$e(rightSuspensionAxleName, {
        'ng2D': {
            x: rightSuspensionAxleX,
            y: rightSuspensionAxleY
        },
        'ng2DSize': {width: 2 * axleContainerWidth / 2, height: 2 * axleContainerHeight},
        'ng2DRotation': { rotation: -axleAngle*degreesToRadians },
        'ngPhysic': {
            restitution: 0.0,
            friction: 200.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        }
    }));

    //wheels
    //* left-wheel
    var leftWheelName = 'vehicle-left-wheel-' + name;
    world.$add(world.$e(leftWheelName, {
        'ng2D': {
            x: x - axleContainerDistance - 2 * axleContainerHeight * Math.cos((90 - axleAngle) * degreesToRadians),
            y: y + axleContainerDepth + 2 * axleContainerHeight * Math.sin((90 - axleAngle) * degreesToRadians)
        },
        'ng2DCircle': {radius: wheelRadius},
        //'ng2DRotation',
        'ngSelected': {},
        'ngDraggable': {},
        'ngPhysic': {
            restitution: 0.0,
            friction: 200.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        }
    }));

    //* right-wheel
    var rightWheelName = 'vehicle-right-wheel-' + name;
    world.$add(world.$e(rightWheelName, {
        'ng2D': {
            x: x + axleContainerDistance + 2 * axleContainerHeight * Math.cos((90 - axleAngle) * degreesToRadians),
            y: y + axleContainerDepth + 2 * axleContainerHeight * Math.sin((90 - axleAngle) * degreesToRadians)
        },
        'ng2DCircle': {radius: wheelRadius},
        //'ng2DRotation',
        'ngSelected': {},
        'ngDraggable': {},
        'ngPhysic': {
            name: rightWheelName,
            restitution: 0.0,
            friction: 200.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        }
    }));

    //revolute-joints
    //*left
    world.$add(world.$e('vehicle-left-wheel-revolute-joint-' + name, {
        'ng2D': {
            x: x - axleContainerDistance - 2 * axleContainerHeight * Math.cos((90 - axleAngle) * degreesToRadians),
            y: y + axleContainerDepth + 2 * axleContainerHeight * Math.sin((90 - axleAngle) * degreesToRadians)
        },
        'ngRevoluteJoint': {
        },
        'ngEnableMotorOnKeyDown': {
            keyCode: [37, 65],
            keyCodeReverse: [39, 68]
        },
        'ngMotorWithAcceleration': {
            min:-wheelMaxSpeed,
            max: wheelMaxSpeed,
            acceleration: wheelAcceleration
        }
    }));

    //*right
    world.$add(world.$e('vehicle-right-wheel-revolute-joint-' + name, {
        'ng2D': {
            x: x + axleContainerDistance + 2 * axleContainerHeight * Math.cos((90 - axleAngle) * degreesToRadians),
            y: y + axleContainerDepth + 2 * axleContainerHeight * Math.sin((90 - axleAngle) * degreesToRadians)
        },
        'ngRevoluteJoint': {
        }
        /*,
        'ngEnableMotorOnKeyDown': {
            keyCode: [37, 65],
            keyCodeReverse: [39, 68]
        }
        */
    }));

    //primatic-joints
    //*left
    world.$add(world.$e('vehicle-left-wheel-prismatic-joint-' + name, {
        'ngPrismaticJoint': {
            anchorA: {
                x: leftSuspensionAxleX,
                y: leftSuspensionAxleY
            },
            anchorB: {
                x: leftSuspensionAxleX + axleContainerDepth * Math.cos((90-axleAngle)*degreesToRadians),
                y: leftSuspensionAxleY - axleContainerDepth * Math.sin((90-axleAngle)*degreesToRadians)
            },
            bodyA: leftSuspensionAxleName,
            bodyB: bodyName,
            maxMotorForce: 10.0,
            enableLimit: true,
            enableMotor: true,
            motorSpeed: 10
        }
    }));

    //*right

    world.$add(world.$e('vehicle-right-wheel-prismatic-joint-' + name, {
        'ngPrismaticJoint': {
            anchorA: {
                x: rightSuspensionAxleX,
                y: rightSuspensionAxleY
            },
            anchorB: {
                x: rightSuspensionAxleX - axleContainerDepth * Math.cos((90-axleAngle)*degreesToRadians),
                y: rightSuspensionAxleY - axleContainerDepth * Math.sin((90-axleAngle)*degreesToRadians)
            },
            bodyA: rightSuspensionAxleName,
            bodyB: bodyName,
            maxMotorForce: 10.0,
            enableLimit: true,
            enableMotor: true,
            motorSpeed: 10
        }
    }));
}

vehicle(100, 100, 'cabriolet');

world.$add(world.$e('ground', [
    'ng2D', {x: width / 2, y: height},
    'ng2DSize', {width:width, height:10},
    'ngPhysic', {type: 'static', restitution: 0.0}
]));

world.$add(world.$e('ground-slope', [
    'ng2D', {x: width / 2, y: height - 40},
    'ng2DSize', {width:width / 2, height:10.0},
    'ng2DRotation', {rotation: 15.0 * Math.PI / 180},
    'ngPhysic', {type: 'static', restitution: 0.0}
]));

world.$add(world.$e('ground-hill', [
    'ng2D', {x: width / 8 + 10, y: height - 80},
    'ng2DSize', {width:width / 4, height:10.0},
    'ngPhysic', {type: 'static', restitution: 0.0}
]));

world.$add(world.$e('top-frame', [
    'ng2D', {x: width / 2, y: 0.0},
    'ng2DSize', {width:width, height:10},
    'ngPhysic', {type: 'static', restitution: 0.0}
]));

world.$add(world.$e('left-frame', [
    'ng2D', {x: 0.0, y: height / 2},
    'ng2DSize', {width:10, height:height},
    'ngPhysic', {type: 'static', restitution: 0.0}
]));

world.$add(world.$e('right-frame', [
    'ng2D', {x: width, y: height / 2},
    'ng2DSize', {width:10, height:height},
    'ngPhysic', {type: 'static', restitution: 0.0}
]));


world.$start();