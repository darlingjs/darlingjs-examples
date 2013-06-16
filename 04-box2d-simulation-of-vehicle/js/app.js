/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var version = '0.2';

var game = angular.module('RedCabrioletGame', ['LocalStorageModule']);
game.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/menu',           {templateUrl: 'partials/menu.html',     controller: 'MainMenuCtrl'}).
        when('/map',            {templateUrl: 'partials/map.html',      controller: 'MapCtrl'}).
        when('/about',          {templateUrl: 'partials/about.html',    controller: 'AboutCtrl'}).
        when('/game/:levelId',  {templateUrl: 'partials/game.html',     controller: 'GameCtrl'}).
        otherwise({redirectTo: '/menu'});
}]);

game.controller('HeaderCtrl', ['$scope', function($scope) {
    $scope.version = version;

    $scope.$on('$routeChangeSuccess', sendGoogleAnalyticsPageView);
    function sendGoogleAnalyticsPageView() {
        googleAnalytics('send', 'pageview');
    }
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

game.controller('MapCtrl', ['$scope', 'GameWorld', 'Player', function($scope, GameWorld, Player) {
    GameWorld.stop();

    $scope.levels = Player.getPlayedLevels();
}]);

game.controller('GameOverCtrl', ['$scope', function($scope) {
    $scope.levelId = 0;
    $scope.score = 999;
    $scope.shareResult = function() {

    };
}]);