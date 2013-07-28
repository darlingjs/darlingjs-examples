/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function() {
    'use strict';

    var m = darlingjs.module('gamePlayModule', []);

    m.$c('ball', {});

    m.$s('gamePlay', {
        width: 400,
        height: 300,

        player1Score: 0,
        player2Score: 0,

        player1TargetElement: null,
        player2TargetElement: null,

        player1Text: null,
        player2Text: null,

        $require: ['ball', 'ng2D'],

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

        $update: ['$entity', function($entity) {
            if ($entity.ng2D.x < 0) {
                this.player1Score++;
                this.setBallToDefaultPosition($entity);
                this.validatePlayersState();
            } else if ($entity.ng2D.x > this.width) {
                this.player2Score++;
                this.setBallToDefaultPosition($entity);
                this.validatePlayersState();
            }
        }],

        setBallToDefaultPosition: function(ball) {
            ball.ng2D.x = this.width / 2;
        },

        validatePlayersState: function() {
            this.player1Text.data = this.player1Score + '';
            this.player2Text.data = this.player2Score + '';
        }
    });

})();