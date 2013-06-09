/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var game = angular.module('RedCabrioletGame', []);
game.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/menu',           {templateUrl: 'partials/menu.html',     controller: 'MainMenuCtrl'}).
        when('/map',            {templateUrl: 'partials/map.html',      controller: 'MapCtrl'}).
        when('/about',          {templateUrl: 'partials/about.html',    controller: 'AboutCtrl'}).
        when('/game/:levelId',  {templateUrl: 'partials/game.html',     controller: 'GameCtrl'}).
        otherwise({redirectTo: '/menu'});
}]);

game.controller('MainMenuCtrl', ['$scope', 'GameWorld', function($scope, GameWorld) {
    GameWorld.stop();
}]);

game.controller('MapCtrl', ['$scope', 'GameWorld', function($scope, GameWorld) {
    GameWorld.stop();
}]);

game.controller('AboutCtrl', ['$scope', 'GameWorld', function($scope, GameWorld) {
    GameWorld.stop();
}]);

game.controller('MapCtrl', ['$scope', 'GameWorld', function($scope, GameWorld) {
    GameWorld.stop();

    //get badges from Mozilla : https://badges.webmaker.org/

    $scope.levels = [
        {
            name: 1,
            imgUrl: "https://badges.webmaker.org/badge/image/code-whisperer.png"
        },
        {
            name: 2,
            imgUrl: "https://badges.webmaker.org/badge/image/editor.png"
        },
        {
            name: 3,
            imgUrl: "https://badges.webmaker.org/badge/image/image-maker.png"
        },
        {
            name: 4,
            imgUrl: "https://badges.webmaker.org/badge/image/i-am-a-webmaker.png"
        }
    ];
}]);