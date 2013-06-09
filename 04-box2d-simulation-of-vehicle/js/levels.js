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
    var version = '0.0.2';

    //TODO: restore game state

    //get badges from Mozilla : https://badges.webmaker.org/
    var levels = JSON.parse(localStorageService.get('levels-' + version));
    if (!levels) {
        toDefault();
    }

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
        return levels
    }

    function winLevel(index, score) {
        var level = getLevelAt(index);
        level.passed = true;
        if (level.maxScore < score) {
            level.maxScore = score;
        }

        localStorageService.set('levels-' + version, JSON.stringify(levels));

        for(var i = 0, count = level.next.length; i < count; i++) {
            var nextLevel = getLevelAt(level.next[i]);
            if (nextLevel) {
                nextLevel.available = true;
            }
        }
    }

    function toDefault() {
        //TODO:
        levels = [
            {
                name: 0,
                imgUrl: "https://badges.webmaker.org/badge/image/code-whisperer.png",
                maxScore: 0,
                available: true,
                passed: false,
                next: [1]
            },
            {
                name: 1,
                imgUrl: "https://badges.webmaker.org/badge/image/editor.png",
                maxScore: 0,
                available: false,
                passed: false,
                next: [2]
            },
            {
                name: 2,
                imgUrl: "https://badges.webmaker.org/badge/image/image-maker.png",
                maxScore: 0,
                available: false,
                passed: false,
                next: [3]
            },
            {
                name: 3,
                imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png",
                maxScore: 0,
                available: false,
                passed: false,
                next: [],
                final: true
            }
        ];
    }

    return {
        numLevels: numLevels,

        getLevelAt: getLevelAt,

        getLevels: getLevels,

        winLevel: winLevel,

        toDefault: toDefault
    }
}]);