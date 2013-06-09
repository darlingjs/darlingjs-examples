/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var game = angular.module('RedCabrioletGame', ['LocalStorageModule']);
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

game.controller('MapCtrl', ['$scope', 'GameWorld', 'Levels', function($scope, GameWorld, Levels) {
    GameWorld.stop();

    $scope.levels = Levels.getLevels();
}]);