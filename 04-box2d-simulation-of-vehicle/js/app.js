/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var version = '0.2';

var game = angular.module('RedCabrioletGame', ['LocalStorageModule']);
game.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/menu',           {templateUrl: 'partials/menu.html',     controller: 'MainMenuCtrl', bgColor: 'rgb(0, 0, 128)'}).
        when('/map',            {templateUrl: 'partials/map.html',      controller: 'MapCtrl', bgColor: 'rgb(128, 128, 0)'}).
        when('/status',         {templateUrl: 'partials/status.html',   controller: 'StatusCtrl', bgColor: 'rgb(0, 0, 128)'}).
        when('/about',          {templateUrl: 'partials/about.html',    controller: 'AboutCtrl', bgColor: 'rgb(0, 0, 0)'}).
        when('/game/:levelId',  {templateUrl: 'partials/game.html',     controller: 'GameCtrl', bgColor: 'rgb(0, 0, 0)'}).
        otherwise({redirectTo: '/menu'});
}]);

game.controller('BodyCtrl', ['$scope', function($scope) {
    $scope.$on('$routeChangeSuccess', routeChangeSuccessHandler);
    function routeChangeSuccessHandler(scope, next, current) {
        googleAnalytics('send', 'pageview');
        if (next && next.$$route && next.$$route.bgColor) {
            $scope.bodyStyle = {
                'background-color': next.$$route.bgColor
            };
        }
    }
}]);

game.controller('HeaderCtrl', ['$scope', function($scope) {
    $scope.version = version;
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