/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function() {
    'use strict';

    //create control module
    var m = darlingjs.module('controlModule', []);

    /**
     * Describe up/down keyCode, and min/max value for Y
     */
    m.$c('control', {
        up: null,
        down: null,
        minY: 0,
        maxY: 0
    });

    /**
     * Component-marker for paddler moved down
     */
    m.$c('moveDown', {
        speed: 1,
        //limit value of Y
        limit: 0
    });

    /**
     * Component-marker for paddler moved up
     */
    m.$c('moveUp', {
        speed: 1,
        //limit value of Y
        limit: 0
    });

    /**
     * System handler keyDown/keyUp and add/remove moveDown/moveUp component from entity
     */
    m.$s('controlSystem', {
        //for with entity that holds:
        $require: ['control'],

        //map to reflect keyCode to entities
        keyToEntities: [],

        // @private
        keyDownHandler: null,
        // @private
        keyUpHandler: null,

        /**
         * System added to the World
         */
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

        /**
         * System removed from the World
         *
         */
        $removed: function() {
            document.removeEventListener('keydown', this.keyDownHandler);
            document.removeEventListener('keyup', this.keyUpHandler);
        },

        /**
         * Entity added to the System
         *
         * @param $entity
         */
        $addEntity: function($entity) {
            this.watchKey($entity.control.up, $entity);
            this.watchKey($entity.control.down, $entity);
        },

        /**
         * Entity removed from the System
         *
         * @param $entity
         */
        $removeEntity: function($entity) {
            this.stopWatchingKey($entity.control.up, $entity);
            this.stopWatchingKey($entity.control.down, $entity);
        },

        /**
         * System start watching the key for the entity
         *
         * @private
         * @param keyCode
         * @param $entity
         */
        watchKey: function(keyCode, $entity) {
            if (!this.keyToEntities[keyCode]) {
                this.keyToEntities[keyCode] = [];
            }

            this.keyToEntities[keyCode].push($entity);
        },

        /**
         * System stop watching the key for the entity
         *
         * @private
         * @param keyCode
         * @param $entity
         */
        stopWatchingKey: function(keyCode, $entity) {
            var entities = this.keyToEntities[keyCode];
            var index = entities.indexOf($entity);
            entities.splice(index, 1);
        },

        /**
         * Handle KeyDown event
         *
         * @private
         * @param e
         * @returns {boolean}
         */
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
                e.preventDefault();
                return false;
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

    /**
     * System move up entity if it holds moveUp and ng2D components
     */
    m.$s('controlMoveUp', {
        //for with entity that holds:
        $require: ['moveUp', 'ng2D'],

        /**
         * Update each entity from the System on the World tick
         */
        $update: ['$entity',function($entity) {
            if ($entity.ng2D.y <= $entity.moveUp.limit) {
                $entity.$remove('moveUp');
                return;
            }
            $entity.ng2D.y -= $entity.moveUp.speed;
        }]
    });

    /**
     * System move down entity if it holds moveUp and ng2D components
     */
    m.$s('controlMoveDown', {
        //for with entity that holds:
        $require: ['moveDown', 'ng2D'],

        /**
         * Update each entity from the System on the World tick
         */
        $update: ['$entity',function($entity) {
            if ($entity.ng2D.y >= $entity.moveDown.limit) {
                $entity.$remove('moveDown');
                return;
            }
            $entity.ng2D.y += $entity.moveDown.speed;
        }]
    });
})();