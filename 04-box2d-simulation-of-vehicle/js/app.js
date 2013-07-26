/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var version = '0.2';

var game = angular.module('RedCabrioletGame', ['LocalStorageModule', 'GameFBModule']);
game.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/menu',           {templateUrl: 'partials/menu.html',         controller: 'MainMenuCtrl',     bgColor: '#2B82B0'}).
        when('/map',            {templateUrl: 'partials/map.html',          controller: 'MapCtrl',          bgColor: '#8D395F'}).
        when('/status',         {templateUrl: 'partials/status.html',       controller: 'StatusCtrl',       bgColor: '#2B82B0'}).
        when('/scoreboard',     {templateUrl: 'partials/scoreboard.html',   controller: 'ScoreboardCtrl',   bgColor: '#2B82B0'}).
        when('/about',          {templateUrl: 'partials/about.html',        controller: 'AboutCtrl',        bgColor: 'rgb(0, 0, 0)'}).
        when('/game/:levelId',  {templateUrl: 'partials/game.html',         controller: 'GameCtrl',         bgColor: 'rgb(0, 0, 0)'}).
        otherwise({redirectTo: '/menu'});
}]).run(['FacebookService', 'DeviceService', function(FacebookService, DeviceService) {
    FacebookService.init('474902895931168', '/channel.html');
    DeviceService.hideUrlBar();
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

game.controller('MainMenuCtrl', ['$scope', '$timeout', 'GameWorld', 'FacebookService', function($scope, $timeout, GameWorld, FacebookService) {
    GameWorld.stop();
    FacebookService.refreshDOM();

    $scope.isLogin = false;
    $scope.isNeedToLogin = false;
    $scope.userName = "stranger";
    $scope.myScore = "unknown";

    function validate() {
        FacebookService.isLogin().then(function(result) {
            $scope.isLogin = result;

            if (result) {
                $scope.userName = FacebookService.getUserName();
                $scope.myScore = FacebookService.getMyScore();
                $scope.isNeedToLogin = false;
            } else {
                $scope.isNeedToLogin = true;
            }
        });
    }

    $scope.onLoginHandler = function() {
        validate();
    }

    validate();
}]);

game.controller('MapCtrl', ['$scope', 'GameWorld', function($scope, GameWorld) {
    GameWorld.stop();
}]);

game.controller('AboutCtrl', ['$scope', 'GameWorld', function($scope, GameWorld) {
    GameWorld.stop();
}]);

game.controller('ScoreboardCtrl', ['$scope', 'GameWorld', 'FacebookService', function($scope, GameWorld, FacebookService) {
    GameWorld.stop();
    $scope.clearMyScore = function() {
        FacebookService.setMyScore(0);
    };
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