/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function() {
    'use strict';
    var m = darlingjs.module('controlModule', []);
    m.$c('control', {
        up: null,
        down: null,
        minY: 0,
        maxY: 0
    });

    m.$c('moveDown', {
        speed: 1,
        limit: 0
    });

    m.$c('moveUp', {
        speed: 1,
        limit: 0
    });

    m.$s('controlSystem', {
        $require: ['control'],

        keyToEntities: [],

        keyDownHandler: null,
        keyUpHandler: null,

        $added: function() {
            this.keyToEntities.length = 256;
            var self = this;

            this.keyDownHandler = function(e) {
                self.onKeyDown(e)
            };

            this.keyUpHandler = function(e) {
                self.onKeyUp(e)
            };

            document.addEventListener('keydown', this.keyDownHandler);
            document.addEventListener('keyup', this.keyUpHandler);
        },

        $removed: function() {
            document.removeEventListener('keydown', this.keyDownHandler);
            document.removeEventListener('keyup', this.keyUpHandler);
        },

        $addEntity: function($entity) {
            this.watchKey($entity.control.up, $entity);
            this.watchKey($entity.control.down, $entity);
        },

        $removeEntity: function($entity) {
            this.stopWatchingKey($entity.control.up, $entity);
            this.stopWatchingKey($entity.control.down, $entity);
        },

        watchKey: function(keyCode, $entity) {
            if (!this.keyToEntities[keyCode]) {
                this.keyToEntities[keyCode] = [];
            }

            this.keyToEntities[keyCode].push($entity);
        },

        stopWatchingKey: function(keyCode, $entity) {
            var entities = this.keyToEntities[keyCode];
            var index = entities.indexOf($entity);
            entities.splice(index, 1);
        },

        onKeyDown: function(e) {
            var entities = this.keyToEntities[e.keyCode];
            if (entities && entities.length > 0) {
                for(var i = 0, count = entities.length; i < count; i++) {
                    var entity = entities[i],
                        control = entity.control;
                    if (control.down === e.keyCode) {
                        entity.$add('moveDown', {
                            limit: control.maxY,
                            speed: control.speed
                        });
                    }
                    if (entity.control.up === e.keyCode) {
                        entity.$add('moveUp', {
                            limit: control.minY,
                            speed: control.speed
                        });
                    }
                }
            }
        },

        onKeyUp: function(e) {
            var entities = this.keyToEntities[e.keyCode];
            if (entities && entities.length > 0) {
                for(var i = 0, count = entities.length; i < count; i++) {
                    var entity = entities[i];
                    if (entity.control.down === e.keyCode) {
                        entity.$remove('moveDown');
                    }
                    if (entity.control.up === e.keyCode) {
                        entity.$remove('moveUp');
                    }
                }
            }
        }
    });

    var specialKeys = {
        8: "backspace", 9: "tab", 10: "return", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
        20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
        37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
        96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
        104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
        112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
        120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 186: ";", 191: "/",
        220: "\\", 222: "'", 224: "meta"
    };

    function charCodeFromKey(key) {
        switch(key) {
            case 'LEFT_ARROW':
                return ;
            case 'RIGHT_ARROW':
                break;
            case 'UP_ARROW':
                break;
            case 'DONW_ARROW':
                break;
        }
    }

    m.$s('controlMoveUp', {
        $require: ['moveUp', 'ng2D'],

        $update: ['$entity',function($entity) {
            if ($entity.ng2D.y <= $entity.moveUp.limit) {
                $entity.$remove('moveUp');
                return;
            }
            $entity.ng2D.y -= $entity.moveUp.speed;
        }]
    });

    m.$s('controlMoveDown', {
        $require: ['moveDown', 'ng2D'],

        $update: ['$entity',function($entity) {
            if ($entity.ng2D.y >= $entity.moveDown.limit) {
                $entity.$remove('moveDown');
                return;
            }
            $entity.ng2D.y += $entity.moveDown.speed;
        }]
    });
})();