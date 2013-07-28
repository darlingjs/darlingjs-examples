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
    var tiles = {
        'hill': {
            name: 'hill',
            type: 'hill'
        },
        'bridge': {
            name: 'bridge',
            type: 'tile',
            tileUrl: 'assets/maps/bridge-0.json'
        },
        'ramp': {
            name: 'ramp',
            type: 'tile',
            tileUrl: 'assets/maps/ramp-0.json'
        }
    };

    var levels = [
        {
            name: 0,
            imgUrl: "https://badges.webmaker.org/badge/image/code-whisperer.png",
            next: [1],

//            levelLength: 2*1000,
            levelLength: 4*1000,

            tileSettings: {
                'hill': {
                    probability: 1.0,

                    maxHillHeight: 0,
                    minHillHeight: 50,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.0
                },

                'ramp': {
                    probability: 0.0
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

            tileSettings: {
                'hill': {
                    probability: 0.9,

                    maxHillHeight: 0,
                    minHillHeight: 52,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.1
                },

                'ramp': {
                    probability: 0.0
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

            tileSettings: {
                'hill': {
                    probability: 1.0,

                    maxHillHeight: 0,
                    minHillHeight: 54,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.0
                },

                'ramp': {
                    probability: 0.0
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

            tileSettings: {
                'hill': {
                    probability: 0.7,

                    maxHillHeight: 0,
                    minHillHeight: 56,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.3
                },

                'ramp': {
                    probability: 0.0
                }
            },
            doom: {
                start: 0.0,
                speed: 290.0
            },
            final: true
        },
        {
            name: 4,
            imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png",
            next: [],

            levelLength: 17*1000,

            tileSettings: {
                'hill': {
                    probability: 1.0,

                    maxHillHeight: 0,
                    minHillHeight: 58,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.0
                },

                'ramp': {
                    probability: 0.0
                }
            },
            doom: {
                start: 0.0,
                speed: 290.0
            },
            final: true
        },
        {
            name: 5,
            imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png",
            next: [],

            levelLength: 17*1000,

            tileSettings: {
                'hill': {
                    probability: 0.8,

                    maxHillHeight: 0,
                    minHillHeight: 60,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.2
                },

                'ramp': {
                    probability: 0.0
                }
            },
            doom: {
                start: 0.0,
                speed: 290.0
            },
            final: true
        },
        {
            name: 6,
            imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png",
            next: [],

            levelLength: 17*1000,

            tileSettings: {
                'hill': {
                    probability: 1.0,

                    maxHillHeight: 0,
                    minHillHeight: 62,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.0
                },

                'ramp': {
                    probability: 0.0
                }
            },
            doom: {
                start: 0.0,
                speed: 290.0
            },
            final: true
        },
        {
            name: 7,
            imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png",
            next: [],

            levelLength: 17*1000,

            tileSettings: {
                'hill': {
                    probability: 1.0,

                    maxHillHeight: 0,
                    minHillHeight: 64,
                    minHillWidth: 640,
                    maxHillWidth: 690
                },

                'bridge': {
                    probability: 0.0
                },

                'ramp': {
                    probability: 0.0
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

    function getTileSettings(name) {
        return tiles[name];
    }

    return {
        numLevels: numLevels,

        getLevelAt: getLevelAt,

        getLevels: getLevels,

        getTileSettings: getTileSettings
    }
}]);