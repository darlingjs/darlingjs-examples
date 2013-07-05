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
            next: [1],

            levelLength: 7*1000,
            tileProbabilities: {
                'hill': 1.0,
                'straightLine': 0,
                'bridge': 0.0
            },
            tileSettings: {
                'hill': {
                    maxHillHeight: 0,
                    minHillHeight: 50,
                    minHillWidth: 640,
                    maxHillWidth: 690
                }
            },
            doom: {
                start: 0.0,
                speed: 30.0 * 0.0 + 50.0
            }
        },
        {
            name: 1,
            imgUrl: "https://badges.webmaker.org/badge/image/editor.png",
            next: [2],

            levelLength: 10*1000,
            tileProbabilities: {
                'hill': 0.9,
                'straightLine': 0,
                'bridge': 0.1
            },
            tileSettings: {
                'hill': {
                    maxHillHeight: 0,
                    minHillHeight: 50,
                    minHillWidth: 640,
                    maxHillWidth: 690
                }
            },
            doom: {
                start: 0.0,
                speed: 30.0 * 1.0 + 50.0
            }
        },
        {
            name: 2,
            imgUrl: "https://badges.webmaker.org/badge/image/image-maker.png",
            next: [3],

            levelLength: 13*1000,
            tileProbabilities: {
                'hill': 0.5,
                'straightLine': 0,
                'bridge': 0.5
            },
            tileSettings: {
                'hill': {
                    maxHillHeight: 0,
                    minHillHeight: 50,
                    minHillWidth: 640,
                    maxHillWidth: 690
                }
            },
            doom: {
                start: 0.0,
                speed: 30.0 * 2.0 + 50.0
            }
        },
        {
            name: 3,
            imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png",
            next: [],

            levelLength: 17*1000,
            tileProbabilities: {
                'hill': 0.9,
                'straightLine': 0,
                'bridge': 0.1
            },
            tileSettings: {
                'hill': {
                    maxHillHeight: 0,
                    minHillHeight: 50,
                    minHillWidth: 640,
                    maxHillWidth: 690
                }
            },
            doom: {
                start: 0.0,
                speed: 290.0
            },
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