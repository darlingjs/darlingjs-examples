(function(darlingjs, darlingutil) {
    'use strict';
    /**
     * Project: GameEngine.
     * Proof of concept v 0.0.0-2
     *
     * Copyright (c) 2013, Eugene-Krevenets
     */

//Define Engine

    var m = darlingjs.module('myApp');

    m.$c('ngCollision', {
        fixed: false
    });

    m.$c('ngScan', {
        target: 'ngPlayer'
    });

    m.$c('ngRamble', {
        frame: {
            left: 0, right: 0,
            top: 0, bottom: 0
        }
    });

    m.$c('ngPlayer', {
    });

    m.$c('ngDOM', {
        color: 'rgb(255,0,0)'
    });

    m.$c('ngDraggable', {
    });

    m.$c('ngSpriteAtlas', {
        name: 0,
        url: ''
    });

    m.$c('ngSprite', {
        name: '',
        fitToSize: false,
        anchor: {
            x: 0.5,
            y: 0.5
        }
    });

    m.$c('ngMovieClip', {
        url: '',
        frames: null
    });

    m.$c('ngControl', {
        speed: 0.1,
        keys:{ UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180}
    });

    m.$c('ngControlPlatformStyle', {
        runSpeed: 4.0,
        jumpSpeed: 5.0,
        flySpeed: 0.0, //0.05,
        doubleJump: 1,
        slope: Math.SQRT1_2 - 0.05, //Math.PI / 4,
        keys:{ UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180}
    });

    m.$system('ng2DRamble', {
        $require: ['ngRamble', 'ng2D'],
        _updateTarget: function($node) {
            $node.ngRamble._target = {
                x: ($node.ngRamble.frame.right - $node.ngRamble.frame.left) * Math.random() + $node.ngRamble.frame.left,
                y: ($node.ngRamble.frame.bottom - $node.ngRamble.frame.top) * Math.random() + $node.ngRamble.frame.top
            };

            //$node.ngRamble._target = this._normalizePosition($node.ngRamble._target, $node.ngRamble.frame);
        },
        _normalizePosition: function(p, frame) {
            if (p.x < frame.left) {
                p.x = frame.left;
            }

            if (p.x > frame.right) {
                p.x = frame.right;
            }

            if (p.y < frame.top) {
                p.y = frame.top;
            }

            if (p.y > frame.bottom) {
                p.y = frame.bottom;
            }
        },
        _distanceSqr: function(p1, p2) {
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            return dx * dx + dy * dy;
        },
        $update: ['$node', function($node) {
            if (!$node.ngRamble._target) {
                this._updateTarget($node);
            } else if (this._distanceSqr($node.ng2D, $node.ngRamble._target) < 1) {
                this._updateTarget($node);
            } else {
                var dx = Math.abs($node.ngRamble._target.x - $node.ng2D.x);
                var dy = Math.abs($node.ngRamble._target.y - $node.ng2D.y);
                if (dx > dy) {
                    $node.ng2D.x+= $node.ngRamble._target.x > $node.ng2D.x?1:-1;
                } else {
                    $node.ng2D.y+= $node.ngRamble._target.y > $node.ng2D.y?1:-1;
                }
            }
        }]
    });

    m.$system('ng2DScan', {
        $require: ['ng2D', 'ngScan'],
        $update : ['$nodes', function($nodes) {
            //TODO brute-force. just push away after collision
            for (var j = 0, lj = $nodes.length; j < lj; j++) {
                for ( var i = 0, li = $nodes.length; i < li; i++) {

                }
            }
        }]
    })

    m.$system('ngControlSystem', {
        $require: ['ng2D', 'ngControl'],
        targetId: null,
        _target: null,
        _actions: {},
        _keyBinding: [],
        _keyBind: function(keyId, action) {
            this._keyBinding[keyId] = action;
            this._actions[action] = false;
        },
        $added: function() {
            this._keyBind(87, 'move-up');
            this._keyBind(65, 'move-left');
            this._keyBind(83, 'move-down');
            this._keyBind(68, 'move-right');

            this._keyBind(37, 'move-left');
            this._keyBind(38, 'move-up');
            this._keyBind(39, 'move-right');
            this._keyBind(40, 'move-down');

            this._target = document.getElementById(this.targetId) || document;
            var self = this;
            this._target.addEventListener('keydown', function(e) {
                var action = self._keyBinding[e.keyCode];
                if (action) {
                    self._actions[action] = true;
                }
            });
            this._target.addEventListener('keyup', function(e) {
                var action = self._keyBinding[e.keyCode];
                if (action) {
                    self._actions[action] = false;
                }
            });
        },
        _speed: {x:0.0, y:0.0},
        _normalize: function(speed) {
            if (speed.x === 0.0 || speed.y === 0.0 ) {
                return speed;
            }

            speed.x *= Math.SQRT1_2;
            speed.y *= Math.SQRT1_2;
        },
        $addNode: function($node) {
            console.log('add control');
        },
        $removeNode: function($node) {
            console.log('remove control');
        },
        $update: ['$node', '$time', '$world', function($node, $time, $world) {
            var speed = this._speed;

            if (this._actions['move-up']) {
                speed.y = -1.0;
            }
            if (this._actions['move-down']) {
                speed.y = +1.0;
            }
            if (this._actions['move-left']) {
                speed.x = -1.0;
            }
            if (this._actions['move-right']) {
                speed.x = +1.0;
            }

            this._normalize(speed);

            $node.ng2D.x += speed.x * $time * $node.ngControl.speed;
            $node.ng2D.y += speed.y * $time * $node.ngControl.speed;

            speed.x = 0.0;
            speed.y = 0.0;
        }]
    });

    m.$system('ngDOMSystem', {
        $require: ['ngDOM', 'ng2D'],
        _targetElementID: 'game',
        _target: null,
        _element: null,
        _style: null,
        $added: function() {

            this._target = this.target;
            if (darlingutil.isUndefined(this._target)) {
                this._target = document.getElementById(this.targetId);
            }
        },
        $addNode: function($entity) {
            var element = document.createElement("div");
            var style = element.style;
            style.position = 'relative';

            $entity._style = style;
            $entity._element = element;
            this._target.appendChild(element);
        },
        $removeNode: function($entity) {
            //TODO:
            this._target.removeChild($entity._element);
        },
        $update: ['$entity', function($entity) {
            var style = $entity._style;
            style.left = $entity.ng2D.x + 'px';
            style.top = $entity.ng2D.y + 'px';
            var ng2DSize = $entity.ng2DSize;
            if (ng2DSize) {
                style.width = ng2DSize.width + 'px';
                style.height = ng2DSize.height + 'px';
            }

            var ng2DRotation = $entity.ng2DRotation;
            if (ng2DRotation) {
                style['-ms-transform'] = style['-o-transform'] = style['-moz-transform'] = style['-webkit-transform'] = 'rotate(' + (ng2DRotation.rotation * 180/Math.PI) + 'deg)';
            }

            style.backgroundColor = $entity.ngDOM.color;
        }]
    });

    m.$c('ngLockOnViewPortOnShiftToIt');

    m.$s('ngLockOnViewPortOnShiftToIt', {
        width: 640,
        height: 480,

        $require: ['ngLockOnViewPortOnShiftToIt', 'ngShiftMove', 'ng2D'],

        $update: ['$entity', 'ng2DViewPort', '$world', function($entity, ng2DViewPort, $world) {
            var ng2D = $entity.ng2D;
            var xEdge = ng2DViewPort.lookAt.x;
            if (ng2D.x > xEdge && $entity.ngShiftMove.dx > 0 ) {
                this._lockX($entity, $world);
            } else if (ng2D.x < xEdge && $entity.ngShiftMove.dx < 0 ) {
                this._lockX($entity, $world);
            }
        }],

        _lockX: function($entity, $world) {
            if (!$entity.ngLockViewPort) {
                $entity.$add('ngLockViewPort');
                $entity.ngLockViewPort.lockY = false;
            }

            $entity.ngLockViewPort.lockX = true;
            $entity.ngShiftMove.dx = 0.0;
            $entity.ng2D.x = 0;//0.5 * this.width;

            var entitiesToRemove = $entity.ngLockOnViewPortOnShiftToIt.entitiesToRemove;
            for(var i = entitiesToRemove.length; i >= 0; i--) {
                var entity = $world.$getByName(entitiesToRemove[i]);
                if (entity) {
                    $world.$remove(entity);
                }
            }
            this._checkShiftMove($entity);
        },

        _checkShiftMove: function($entity) {
            if ($entity.ngShiftMove.dx === 0 && $entity.ngShiftMove.dy === 0) {
                $entity.$remove('ngShiftMove');
            }
        }
    });

    /**
     * Marker for drops
     */
    m.$c('drop');

    /**
     * Marker for clouds front
     */
    m.$c('cloudsFront');

}) (darlingjs, darlingutil);
