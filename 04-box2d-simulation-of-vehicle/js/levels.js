/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

/**
 * Game Levels Service
 *
 * * store information about level state
 */
game.factory('Levels', ['localStorageService', function(localStorageService) {
    'use strict';

    //get badges from Mozilla : https://badges.webmaker.org/
    var levels = [
        {
            name: 0,
            imgUrl: "https://badges.webmaker.org/badge/image/code-whisperer.png",
            next: [1]
        },
        {
            name: 1,
            imgUrl: "https://badges.webmaker.org/badge/image/editor.png",
            next: [2]
        },
        {
            name: 2,
            imgUrl: "https://badges.webmaker.org/badge/image/image-maker.png",
            next: [3]
        },
        {
            name: 3,
            imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png",
            next: [],
            final: true
        }
    ];

    function numLevels() {
        return levels.length;
    }

    function getLevelAt(index) {
        if (isNaN(index) || index < 0 || levels.length <= index) {
            return null;
        }
        return levels[index]
    }

    function getLevels() {
        return levels;
    }

    return {
        numLevels: numLevels,

        getLevelAt: getLevelAt,

        getLevels: getLevels
    }
}]);