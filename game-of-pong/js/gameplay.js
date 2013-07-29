/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function() {
    'use strict';

    //create gameplay module
    var m = darlingjs.module('gamePlayModule', []);

    /**
     * Component marker for the ball entity
     */
    m.$c('ball', {});

    /**
     * System for game simulation:
     * * track when the ball slipped from the game field
     * * calc scores for player1, player2;
     * * show scores
     */
    m.$s('gamePlay', {
        //deal with entity that hold:
        $require: ['ball', 'ng2D', 'ng2DSize'],

        width: 400,
        height: 300,

        //start scores
        player1Score: 0,
        player2Score: 0,

        player1TargetElement: null,
        player2TargetElement: null,

        //@private
        player1Text: null,
        //@private
        player2Text: null,

        /**
         * System added to the World
         */
        $added: function() {
            var element;
            element = document.querySelector(this.player1TargetElement);
            this.player1Text = document.createTextNode('');
            element.appendChild(this.player1Text);

            element = document.querySelector(this.player2TargetElement);
            this.player2Text = document.createTextNode('');
            element.appendChild(this.player2Text);

            this.validatePlayersState();
        },

        /**
         * On each tick of the World, we check position of the ball
         * And if it slipped away. Set scores for the player.
         * And set ball back.
         */
        $update: ['$entity', function($entity) {
            if ($entity.ng2D.x < 0.5 * $entity.ng2DSize.width) {
                this.player1Score++;
                this.setBallToDefaultPosition($entity);
                this.validatePlayersState();
            } else if ($entity.ng2D.x > this.width - 0.5 * $entity.ng2DSize.width) {
                this.player2Score++;
                this.setBallToDefaultPosition($entity);
                this.validatePlayersState();
            }
        }],

        /**
         * Put ball back
         *
         * @private
         * @param ball
         */
        setBallToDefaultPosition: function(ball) {
            ball.ng2D.x = this.width / 2;
        },

        /**
         * Validate player score state
         */
        validatePlayersState: function() {
            this.player1Text.data = this.player1Score + '';
            this.player2Text.data = this.player2Score + '';
        }
    });

})();