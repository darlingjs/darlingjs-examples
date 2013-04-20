'use strict';
/**
 * Project: darlingjs / GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

var width = 640;
var height = 480;

var world = darlingjs.world('myGame', [
    'myApp',
    'ngCommon',
    'ngFlatland',
    'ngPhysics',
    'ngBox2DEmscripten',
    'ngPixijsAdapter',
    'ngStats',
    'ngInfinity1DWorld',
    'ngPlayer',
    'ngParticleSystem'
], {
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

world.$add('ngBox2DSystem', {
    gravity: {
        x: 0,
        y: 9.8
    },
    velocityIterations: 10,
    positionIterations: 10
});

//world.$add('ngBox2DDraggable', { domId: 'gameView', width: width, height: height });
world.$add('ngBox2DFixRotation');
world.$add('ngBox2DCollisionGroup');
world.$add('ngBox2DRevoluteJoint');
world.$add('ngBox2DPrismaticJoint');
world.$add('ngBox2DDistanceJoint');
world.$add('ngBox2DSensorSystem');
world.$add('ngBox2DCollision');

world.$add('ngEnableMotorOnKeyDown');
world.$add('ngBox2DEnableMotorSystem');
world.$add('ngBox2DMotorWithAcceleration');
world.$add('ng2DViewPort', {
    width: width,
    height: height
});

world.$add('ngFollowSelected', {
    shift: {
        x: 100.0,
        y: -100.0
    }
});

world.$add('ngCollectBonuses');

world.$add('ngRemoveSelectionFromWinner');

var firstTile = true;
var levelLength = 10000;

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
        } else {

            if (leftSeedTile && leftSeedTile.rightEdge > levelLength) {
                generateByTiledFile(newTile, leftSeedTile, rightSeedTile, 'assets/maps/finish.json');
            } else {
                var seed = Math.random();
                if (seed <= 0.9) {
                    hillGenerator(newTile, leftSeedTile, rightSeedTile, {
                        hillWidth: 640 + 50 * Math.random(),
                        hillHeight: 50 * Math.random()
                    });
                } else if (seed < 0.95) {
                    generateByTiledFile(newTile, leftSeedTile, rightSeedTile, 'assets/maps/bridge-0.json');
                } else {
                    generateStraightLine(newTile, leftSeedTile, rightSeedTile);
                }
            }
        }
    }
});

world.$add('ngBindPositionToPhysics');

world.$add('ngBindLifeToAlpha');
world.$add('ngPixijsStage', {
    domId: 'gameView',
    width: width,
    height: height,
    useWebGL: false
});

world.$add('ngPixijsSprite');
world.$add('ngPixijsMovieClip');
world.$add('ngPixijsSheetSprite');

world.$add('ng2DShiftMovingSystem');

world.$add('ngRandomEmitterSystem');
world.$add('ngSquareEmitterSystem');
world.$add('ngRectangleZone');

world.$add('ngRemoveIfDead');
world.$add('ngReduceLifeIfOutOfLifeZone');
world.$add('ngDeadIfOutOfLife');
world.$add('ngLifeIsGrooving');
world.$add('ngDecreaseLifeOnDamage');
world.$add('ngDecreaseLifeOnContinuousDamage');

world.$add('ngLockOnViewPortOnShiftToIt');

world.$add('ngLifeHandler');

world.$add('ngBox2DDebugDraw', {
    domID: 'gameView', width: width, height: height
});

world.$add('ngStatsEnd');

// entities

// test heap of rocks

var rocksCount = 0;
for (var i = 0, l = rocksCount; i < l; i++) {
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
        'ngSelected': {},
        'ngWantsToCollide': {
            'with': [
                {
                    'any': ['ngFinish'],
                    'andGet': 'ngWinner'
                },
                {
                    'any': ['ngBonus'],
                    'andGet': 'ngGetBonus'
                },
                {
                    'any': ['drop'],
                    'andGet': {
                        'ngDamage': {
                            damage: 0.1
                        }
                    }
                },
                {
                    'any': ['cloudsFront'],
                    'andGet': {
                        'ngContinuousDamage': {
                            damage: 0.5
                        }
                    }
                }
            ]
        },
        'ngLife': {
            life: 1.0
        },
        'ngOnLifeChange': {
            handler: function($node, life) {
                console.log('life:' + life);
            }
        },
        'ngLive': {},
        'ngSpriteAtlas' : {
            name: name + '-body.png',
            url: 'assets/spritesheet.json',
            fitToSize: false,
            anchor: {
                x: 0.52,
                y: 0.76
            }
        },
        'ngScores': {
            score: 0.0
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
        'ngSelected': {},
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
        'ngSelected': {},
        'ngMotorWithAcceleration': {
            min:-ops.wheelMaxSpeed,
            max: ops.wheelMaxSpeed,
            acceleration: ops.wheelAcceleration
        }
    }));

    //prismatic-joints
    //*left
    world.$add(world.$e('vehicle-left-wheel-prismatic-joint-' + name, {
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
    }));

    //*right

    world.$add(world.$e('vehicle-right-wheel-prismatic-joint-' + name, {
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
    }));
}

world.$add(
    world.$e('sky', {
        'ng2D': {
            x:0.0, y:0.0
        },
        'ngSpriteAtlas' : {
            name: 'blue-sky.png',
            url: 'assets/spritesheet.json',
            fitToSize: false
        },
        'ngLockViewPort': {
        }
    })
);

function buildCloudFront(ops) {
    var frontStart = 200.0,
        frontSpeed = 40.0;

    world.$add(world.$e(
        'doom-sky', {
            'ng2D': {
                x: frontStart - 400.0,
                y: 0.0
            },

            'ngShiftMove': {
                dx: frontSpeed,
                dy: 0.0
            },

            'ngLockOnViewPortOnShiftToIt': {
                entitiesToRemove: ['clouds-front', 'clouds-factory', 'sky']
            },

            'ngSpriteAtlas' : {
                name: 'doom.png',
                url: 'assets/spritesheet.json',
                fitToSize: false,
                anchor: {
                    x: 0.5,
                    y: 0.5
                }
            },

            'ngLockViewPort': {
                lockX: false,
                lockY: true
            }
        }
    ));

    world.$add(world.$e(
        'clouds-front-sensor', {
            'cloudsFront': {},

            'ng2D': {
                x: frontStart - 200,
                y: 500.0
            },

            'ng2DSize': {
                width: 10,
                height: 480
            },

            'ngPhysic': {},

            'ngSensor': {},

            'ngBindPositionToPhysics': {},

            'ngShiftMove': {
                dx: frontSpeed,
                dy: 0.0
            }
        }
    ));

    world.$add(world.$e(
        'clouds-front', {
            'ng2D': {
                x: frontStart - 3,
                y: 0.0
            },

            'ngShiftMove': {
                dx: frontSpeed,
                dy: 0.0
            },

            'ngSpriteAtlas' : {
                name: 'doom-front.png',
                url: 'assets/spritesheet.json',
                fitToSize: false,
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
    ));

    if (ops.useCloudFactory) {
        world.$add(
            world.$e('clouds-factory', {
                'ng2D': {
                    x: frontStart,
                    y: 275.0
                },

                'ng2DSize': {
                    width: 1.0,
                    height: 200.0
                },

                'ngShiftMove': {
                    dx: frontSpeed,
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
                        var ops = {
                            move: { dx: 100 * (0.2 + 0.4 * distance) },
                            basis: 0.2 + 0.4 * distance,
                            type: Math.floor(3 * Math.random())
                        };

                        return {
                            $name: 'cloud',

                            'ng2D': {},

                            'ng2DSize': {
                                width: 60.0,
                                height: 1.0
                            },

                            'ngSpriteAtlas' : {
                                name: 'cloud-' + ops.type + '.png',
                                url: 'assets/spritesheet.json',
                                fitToSize: false
                            },

                            'ngParallax': {
                                basis: 1.0//ops.basis
                            },

                            'ngShiftMove': {
                                dx: ops.move.dx || 0.0,
                                dy: ops.move.dy || 0.0
                            },

                            'ngRemoveIfDead': {},

                            'ngLifeZone': {},

                            'ngLife': {
                                life: 0.01
                            },

                            'ngLifeIsGrooving': {
                                delta: 0.1
                            },

                            'ngBindLifeToAlpha': {},

                            'ngLive': {},

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
                                        return {
                                            '$name': 'lightning-of-' + emitter.$name,
                                            'ng2D': {x : emitter.ng2D.x, y: emitter.ng2D.y},
                                            'ngSpriteAtlas' : {
                                                name: 'lightning-' + lightningType + '.png',
                                                url: 'assets/spritesheet.json',
                                                fitToSize: false
                                            },

                                            'ngLife': {
                                                life: 1.0
                                            },

                                            'ngLifeIsGrooving': {
                                                delta: -1.0
                                            },

                                            'ngBindLifeToAlpha': {},

                                            'ngLive': {},

                                            'ngRemoveIfDead': {}
                                        };
                                    } else {
                                        return {
                                            '$name': 'drop-of-' + emitter.$name,

                                            'drop': {},

                                            'ng2D': {x : emitter.ng2D.x, y: emitter.ng2D.y},

                                            'ng2DCircle': {radius: 3},

                                            'ng2DRotation': {},

                                            'ngPhysic': {
                                                density: 2.0
                                            },
                                            'ngDraggable': {},

                                            'ngSpriteAtlas' : {
                                                name: 'drop.png',
                                                url: 'assets/spritesheet.json',
                                                fitToSize: false
                                            },

                                            'ngLife': {
                                                life: 0.01
                                            },

                                            'ngLifeIsGrooving': {
                                                delta: 0.2
                                            },

                                            'ngBindLifeToAlpha': {},

                                            'ngLive': {},

                                            'ngRemoveIfDead': {},

                                            'ngWantsToCollide': {
                                                'with': [
                                                    {
                                                        'andGet': 'ngDead'
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
            })
        );
    }
}


vehicle(400, 500, 'cabriolet', {
    axleContainerDistance: 30,
    axleContainerHeight: 5,
    axleContainerDepth: 2.5,
    wheelRadius: 12,
    wheelMaxSpeed: 30.0
});

buildCloudFront({
    useCloudFactory: true,
    cloudMinRate: 0.0,
    cloudMaxRate: 0.1
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
            world.$add(world.$e('ground-' + x, {
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
                }
            }))
        );

        entities.push(world.$add(world.$e('grass-0-' + x, {
            'ng2D': {
                x: x,
                y: -lowHeight
            },
            'ng2DSize': {
                width: 34,
                height: -lowHeight
            },
            'ngSpriteAtlas' : {
                name: 'grass-0.png',
                url: 'assets/spritesheet.json',
                fitToSize: true,
                anchor: {
                    x: 0.0,
                    y: 0.0
                }
            }
        })));

         entities.push(world.$add(world.$e('grass-top-0-' + x, {
            'ng2D': {
                x: x,
                y: -lowHeight
            },
            'ng2DRotation': {
                rotation: angle
            },
            'ngSpriteAtlas' : {
                name: 'grass-top-0.png',
                url: 'assets/spritesheet.json',
                anchor: {
                    x: 0.5,
                    y: 0.5
                }
            }
        })));

        if (false) {
            var topItemsIndex = Math.floor(topItems.length * Math.random());
            entities.push(world.$add(world.$e('grass-top-0-' + x, {
                'ng2D': {
                    x: x,
                    y: -lowHeight
                },
                'ng2DRotation': {
                    rotation: angle
                },
                'ngSpriteAtlas' : {
                    name: topItems[topItemsIndex],
                    url: 'assets/spritesheet.json',
                    anchor: {
                        x: 0.5,
                        y: 0.5
                    }
                }
            })));
        }

        var seed = Math.floor(100 * Math.random());
        if (seed < 10) {
                entities.push(world.$add(world.$e('three-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },
                    'ngSpriteAtlas' : {
                        name: 'tree-0.png',
                        url: 'assets/spritesheet.json',
                        fitToSize: false,
                        anchor: {
                            x: 0.5,
                            y: 1.0
                        }
                    }
                })));
        } else if (seed < 20) {
                entities.push(world.$add(world.$e('three-1-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },
                    'ngSpriteAtlas' : {
                        name: 'tree-1.png',
                        url: 'assets/spritesheet.json',
                        fitToSize: false,
                        anchor: {
                            x: 0.5,
                            y: 1.0
                        }
                    }
                })));
        } else if (seed < 22) {
                entities.push(world.$add(world.$e('fence-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight + 100 * Math.random() + 100
                    },
                    'ngSpriteAtlas' : {
                        name: 'fence-0.png',
                        url: 'assets/spritesheet.json',
                        fitToSize: false,
                        anchor: {
                            x: 0.5,
                            y: 0.5
                        }
                    }
                })));
        } else if (seed > 99) {
                entities.push(world.$add(world.$e('rail-road-0-' + x, {
                    'ng2D': {
                        x: x,
                        y: -lowHeight
                    },
                    'ngSpriteAtlas' : {
                        name: 'rail-road-0.png',
                        url: 'assets/spritesheet.json',
                        fitToSize: false,
                        anchor: {
                            x: 0.5,
                            y: 0.0
                        }
                    }
                })));
        }

        if (Math.random() > 0.5) {
            entities.push(world.$add(world.$e('flowers-0-' + x, {
                'ng2D': {
                    x: x,
                    y: -lowHeight
                },
                'ngSpriteAtlas' : {
                    name: 'flowers-0.png',
                    url: 'assets/spritesheet.json',
                    fitToSize: false,
                    anchor: {
                        x: 0.5,
                        y: -4.0 * Math.random()
                    }
                }
            })));
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
            entities.push(world.$add(world.$e(diamondType + '-' + x, {
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
                'ngSensor': {},
                'ngBonus': {
                    score: diamondScore
                },
                'ngSpriteAtlas' : {
                    name: diamondType + '.png',
                    url: 'assets/spritesheet.json',
                    fitToSize: false
                }
            })));
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

    entities.push(
        world.$add(world.$e('ground-straight', {
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
        }))
    );
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
 *
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
    var entities = [],
        rightEdge = {},
        leftEdge = {};

    try {
        for(var j = 0, lj = data.layers.length; j < lj; j++) {
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
                                    components.ngRevoluteJoint = {};
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
                                    components.ngPulleyJoint = {};
                                }
                                break;
                            case '':
                                //TODO:
                                console.log('undefined object', object);
                                continue;
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

                        entities.push(world.$e(object.name, components));
                    }
                    break;
            }
        }
    } catch(e) {
        console.log(e);
    }

    return {
        entities: entities,
        leftEdge: leftEdge,
        rightEdge: rightEdge
    };
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
            value = eval(properties[key]);
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