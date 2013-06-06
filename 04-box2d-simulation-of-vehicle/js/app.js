/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var game = angular.module('RedCabrioletGame', []);
game.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/menu',   {templateUrl: 'partials/menu.html',     controller: 'MainMenuCtrl'}).
        when('/map',    {templateUrl: 'partials/map.html',      controller: 'MapCtrl'}).
        when('/about',  {templateUrl: 'partials/about.html',    controller: 'AboutCtrl'}).
        when('/game',   {templateUrl: 'partials/game.html',     controller: 'GameCtrl'}).
        otherwise({redirectTo: '/menu'});
}]);

game.controller('MainMenuCtrl', function($scope) {
});

game.controller('MapCtrl', function($scope) {
});

game.controller('AboutCtrl', function($scope) {
});

