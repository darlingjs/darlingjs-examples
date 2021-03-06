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

world.$add('ngStatsBegin');

world.$add('ng2DViewPort', {
    lookAt: {
        x: 400, y: 300
    }
});

world.$add('ngBox2DSystem', {
    gravity: {
        x:0,
        y:10.0
    }
});

world.$add('ngBox2DDebugDraw', {
    domID: 'canvas', width: width, height: height
});

world.$add('ngBox2DDraggable', { domId: 'gameView', width: width, height: height });
world.$add('ngBox2DRollingControl');
world.$add('ngBox2DFixRotation');


world.$add('ngStatsEnd');


for (var i = 0, l = 50; i < l; i++) {
    var fixed = Math.random() > 0.5;
    var boxType = Math.floor(1 + 3 * Math.random());
    var box = world.$add(world.$e('obstacle_' + i, {
//            'ngDOM': { color: fixed?'rgb(0, 255, 0)':'rgb(200, 200, 0)'},
        //Get From : http://www.iconfinder.com/search/?q=iconset%3Aie_ICandies
//            'ngSprite': { name: 'assets/box' + boxType + '.png', fitToSize: true },
//        'ngSpriteAtlas' : { name: 'box' + boxType + '.png', url: 'assets/spritesheet.json', fitToSize: true},
//            'ngMovieClip' : {url: 'assets/explosion.json', fitToSize: true, frames: ['Explosion_Sequence_A 1.png', 'Explosion_Sequence_A 2.png', 'Explosion_Sequence_A 3.png', 'Explosion_Sequence_A 4.png', 'Explosion_Sequence_A 5.png', 'Explosion_Sequence_A 6.png', 'Explosion_Sequence_A 7.png', 'Explosion_Sequence_A 8.png', 'Explosion_Sequence_A 9.png', 'Explosion_Sequence_A 10.png', 'Explosion_Sequence_A 11.png', 'Explosion_Sequence_A 12.png', 'Explosion_Sequence_A 13.png', 'Explosion_Sequence_A 14.png', 'Explosion_Sequence_A 15.png', 'Explosion_Sequence_A 16.png', 'Explosion_Sequence_A 17.png', 'Explosion_Sequence_A 18.png', 'Explosion_Sequence_A 19.png', 'Explosion_Sequence_A 20.png', 'Explosion_Sequence_A 21.png', 'Explosion_Sequence_A 22.png', 'Explosion_Sequence_A 23.png', 'Explosion_Sequence_A 24.png', 'Explosion_Sequence_A 25.png', 'Explosion_Sequence_A 26.png', 'Explosion_Sequence_A 27.png']},
        'ng2D': {x : 40 + (width - 40) * Math.random(), y: 40 + (height - 40) * Math.random()},
        'ng2DSize': {width:30, height:30},
        'ng2DRotation': {},
        'ngPhysic': {},
        'ngDraggable': {},
        'ngFixedRotation': {}
    }));
//    (function(box) {
//        setTimeout(function() {
//            world.$remove(box);
//        }, 10000 * Math.random());
//    }) (box);
}


world.$add(world.$e('player', [
    'ngDOM', { color: 'rgb(0,200,200)' },
    'ngSprite', { name: 'assets/bunny.png', anchor: {y: 0.8} },
    'ng2D', {x : 50, y: 50},
    'ng2DCircle', {radius: 10.0},
    //'ng2DRotation',
    'ngControlPlatformStyle', {
        runSpeed: 4.0,
        jumpSpeed: 5.0,
        flySpeed: 0.0, //0.05,
        doubleJump: 2,
        speed: 100.0
    },
//    'selectByKeyboard', {
//        keyCode: 49
//    },
    'ngSelected',
    'ngDraggable',
    'ngPhysic', {
        restitution: 0.0,
        friction: 200.0,
        density: 0.5
    }
]));

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

    /*
var embox2dTest_pyramid = function() {
}

embox2dTest_pyramid.prototype.setNiceViewCenter = function() {
    PTM = 20;
    setViewCenterWorld( new b2Vec2(0,7.5), true );
}

embox2dTest_pyramid.prototype.setup = function() {

    {
        var ground = world.CreateBody(new b2BodyDef());

        var shape = new b2EdgeShape();
        shape.Set(new b2Vec2(-40.0, 0.0), new b2Vec2(40.0, 0.0));
        ground.CreateFixture(shape, 0.0);
    }

    {
        var a = 0.5;
        var shape = new b2PolygonShape();
        shape.SetAsBox(a, a);

        var x = new b2Vec2(-7.5, 0.75);
        var y = new b2Vec2();
        var deltaX = new b2Vec2(0.5625, 1.25);
        var deltaY = new b2Vec2(1.125, 0.0);

        var bd = new b2BodyDef();
        bd.set_type( b2_dynamicBody );

        for (var i = 0; i < 15; ++i) {
            y = copyVec2(x);

            for (var j = i; j < 15; ++j)
            {
                bd.set_position(y);
                world.CreateBody(bd).CreateFixture(shape, 5.0);
                y.op_add(deltaY);
            }

            x.op_add(deltaX);
        }
    }
}
        */