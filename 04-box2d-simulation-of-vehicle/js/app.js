'use strict';
/**
 * Project: darlingjs / GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

var width = 800;
var height = 600;

var world = darlingjs.world('myGame', [
    'ngModule',
    'ngCommon',
    'ngFlatland',
    'ngPhysics',
    'ngBox2DEmscripten',
    'ngPixijsAdapter',
    'ngStats',
    'ngInfinity1DWorld'], {
    fps: 60
});

// systems

world.$add('ngStatsBegin');

world.$add('ng2DViewPort', {
    lookAt: {
        x: 400, y: 300
    },
    width: width,
    height: height
});

world.$add('ngPixijsStage', { domId: 'gameView', width: width, height: height });
world.$add('ngPixijsSprite');
world.$add('ngPixijsMovieClip');
world.$add('ngPixijsSheetSprite');

world.$add('ngBox2DSystem', {
    gravity: {
        x: 0,
        y: 9.8
    },
    velocityIterations: 10,
    positionIterations: 10
});

world.$add('ngBox2DDebugDraw', {
    domID: 'gameView', width: width, height: height
});

world.$add('ngBox2DDraggable', { domId: 'gameView', width: width, height: height });
world.$add('ngBox2DFixRotation');
world.$add('ngBox2DCollisionGroup');
world.$add('ngBox2DRevoluteJoint');
world.$add('ngBox2DPrismaticJoint');
world.$add('ngEnableMotorOnKeyDown');
world.$add('ngBox2DEnableMotorSystem');
world.$add('ngBox2DMotorWithAcceleration');
world.$add('ng2DViewPort', {
    width: width,
    height: height
});

world.$add('ngFollowSelected');
world.$add('ngInfinity1DWorld', {
    seed: {
        leftEdge: 0.0,
        leftHeight: 0.0,
        rightEdge: 0.0,
        rightHeight: 0.0//140 + 200 * Math.random()
    },
    generator: function(newTile, leftSeedTile, rightSeedTile) {
        hillGenerator(newTile, leftSeedTile, rightSeedTile, {
            hillWidth: 640 + 50 * Math.random(),
            hillHeight: 100 * Math.random()
        });
    }
});

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
        'ng2DSize': {width:3, height:3},
        //'ng2DCircle': {radius: 3},
        'ng2DRotation': {},
        'ngPhysic': {},
        'ngDraggable': {}
    }));
//    (function(box) {
//        setTimeout(function() {
//            world.$remove(box);
//        }, 10000 * Math.random());
//    }) (box);
}

//vehicle

function vehicle(x, y, name, newOps){
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
        frontWheelDrive: true
    };

    var degreesToRadians = Math.PI / 180.0;

    //wheels
    //* left-wheel
    var leftWheelName = 'vehicle-left-wheel-' + name;
    world.$add(world.$e(leftWheelName, {
        'ng2D': {
            x: x - ops.axleContainerDistance - 2 * ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians),
            y: y + ops.axleContainerDepth + 2 * ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians)
        },
        'ng2DCircle': {radius: ops.wheelRadius},
        'ng2DRotation': {},
        'ngSelected': {},
        'ngDraggable': {},
        'ngPhysic': {
            restitution: 0.2,
            friction: 15.0,
            density: 1.0
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        },
        'ngSpriteAtlas' : {
            name: name + '-wheel.png',
            url: 'assets/spritesheet.json',
            fitToSize: false
        }
    }));

    //* right-wheel
    var rightWheelName = 'vehicle-right-wheel-' + name;
    world.$add(world.$e(rightWheelName, {
        'ng2D': {
            x: x + ops.axleContainerDistance + 2 * ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians),
            y: y + ops.axleContainerDepth + 2 * ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians)
        },
        'ng2DCircle': {radius: ops.wheelRadius},
        'ng2DRotation': {},
        'ngSelected': {},
        'ngDraggable': {},
        'ngPhysic': {
            name: rightWheelName,
            restitution: 0.2,
            friction: 15.0,
            density: 1.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        },
        'ngSpriteAtlas' : {
            name: name + '-wheel.png',
            url: 'assets/spritesheet.json',
            fitToSize: false
        }
    }));

    //body
    var bodyName = 'vehicle-body-' + name;
    world.$add(world.$e(bodyName, {
        'ng2D': {x : x, y: y},
        'ng2DSize': {width: 2.0 * ops.width, height: 2.0 * ops.height},
        'ng2DRotation': {},
        'ngDraggable': {},
        'ngPhysic': {
            restitution: 0.3,
            friction: 3.0,
            density: 0.5
        },
        'ngCollisionGroup': {
            'neverWith': 'vehicle'
        },
        'ngSpriteAtlas' : {
            name: name + '-body.png',
            url: 'assets/spritesheet.json',
            fitToSize: false,
            anchor: {
                x: 0.5,
                y: 0.6
            }
        }
    }));

    //suspension
    //* left-container
    world.$add(world.$e('vehicle-left-suspension-container-' + name, {
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
    }));

    //* left-axle
    var leftSuspensionAxleName = 'vehicle-left-suspension-axle-' + name;
    var leftSuspensionAxleX = x - ops.axleContainerDistance - ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians);
    var leftSuspensionAxleY = y + ops.axleContainerDepth + ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians);

    world.$add(world.$e(leftSuspensionAxleName, {
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
    }));

    //* right-container
    world.$add(world.$e('vehicle-left-suspension-container-' + name, {
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
    }));

    //* right-axle
    var rightSuspensionAxleName = 'vehicle-right-suspension-axle-' + name;
    var rightSuspensionAxleX = x + ops.axleContainerDistance + ops.axleContainerHeight * Math.cos((90 - ops.axleAngle) * degreesToRadians);
    var rightSuspensionAxleY = y + ops.axleContainerDepth + ops.axleContainerHeight * Math.sin((90 - ops.axleAngle) * degreesToRadians);

    world.$add(world.$e(rightSuspensionAxleName, {
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
    }));



    //revolute-joints
    //*left
    world.$add(world.$e('vehicle-left-wheel-revolute-joint-' + name, {
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
        'ngMotorWithAcceleration': {
            min:-ops.wheelMaxSpeed,
            max: ops.wheelMaxSpeed,
            acceleration: ops.wheelAcceleration
        }
    }));

    //*right
    world.$add(world.$e('vehicle-right-wheel-revolute-joint-' + name, {
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
        'ngMotorWithAcceleration': {
            min:-ops.wheelMaxSpeed,
            max: ops.wheelMaxSpeed,
            acceleration: ops.wheelAcceleration
        }
    }));

    //prismatic-joints
    //*left
    world.$add(world.$e('vehicle-left-wheel-prismatic-joint-' + name, {
        'ngPrismaticJoint': {
            anchorA: {
                x: leftSuspensionAxleX,
                y: leftSuspensionAxleY
            },
            anchorB: {
                x: leftSuspensionAxleX + ops.axleContainerDepth * Math.cos((90 - ops.axleAngle)*degreesToRadians),
                y: leftSuspensionAxleY - ops.axleContainerDepth * Math.sin((90 - ops.axleAngle)*degreesToRadians)
            },
            bodyA: leftSuspensionAxleName,
            bodyB: bodyName,
            maxMotorForce: 10.0,
            enableLimit: true,
            enableMotor: true,
            motorSpeed: 10.0
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
                x: rightSuspensionAxleX - ops.axleContainerDepth * Math.cos((90 - ops.axleAngle) * degreesToRadians),
                y: rightSuspensionAxleY - ops.axleContainerDepth * Math.sin((90 - ops.axleAngle) * degreesToRadians)
            },
            bodyA: rightSuspensionAxleName,
            bodyB: bodyName,
            maxMotorForce: 10.0,
            enableLimit: true,
            enableMotor: true,
            motorSpeed: 10.0
        }
    }));
}

vehicle(400, 500, 'cabriolet', {
    axleContainerHeight: 5,
    axleContainerDepth: 2.5,
    wheelRadius: 12
});

world.$start();

//Generators

/**
 * Hill Generator
 *
 * @param newTile
 * @param leftSeedTile
 */

function hillGenerator(newTile, leftSeedTile, rightSeedTile, ops) {
    var xOffset, yOffset, goRight, sign;
    var pixelStep = 32;

    if (leftSeedTile) {
        xOffset = leftSeedTile.rightEdge;
        yOffset = leftSeedTile.rightHeight;
        goRight = true;
        sign = 1;
    } else {
        xOffset = rightSeedTile.leftEdge;
        yOffset = rightSeedTile.leftHeight;
        goRight = false;
        sign = -1;
    }

    var hillStartY = yOffset;
    var hillSliceWidth = ops.hillWidth / pixelStep;
    var randomHeight = ops.hillHeight;

    if (xOffset!==0) {
        hillStartY-=randomHeight;
    }

    var entities = [];

    for (var j = 0; j < hillSliceWidth; j++) {
        var heightBegin = hillStartY + randomHeight * Math.cos(2*Math.PI/hillSliceWidth * j);
        var heightEnd = hillStartY + randomHeight * Math.cos(2*Math.PI/hillSliceWidth * (j + sign));
        var bottom = 0;
        var lowHeight = Math.min(heightBegin, heightEnd);
        bottom = -lowHeight + 32;

        entities.push(
            world.$add(world.$e('ground', {
                'ng2D': {
                    x: sign * j * pixelStep + xOffset,
                    y: 600
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
                }
            }))
        );
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
    newTile.rightHeight = hillStartY + randomHeight;
}