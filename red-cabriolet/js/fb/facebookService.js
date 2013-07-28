/**
 * Project: darlingjs (GameEngine).
 * Copyright (c) 2013, Eugene-Krevenets
 */

var gameFBModule = window.gameFBModule || angular.module('GameFBModule', []);

gameFBModule
    .factory('FacebookService', [
    '$rootScope', '$window', '$timeout', '$q',
    function($rootScope, $window, $timeout, $q) {

    'use strict';
    $rootScope.user = {};

    var requestQ = [],
        uid,
        accessToken,
        appId,
        channelUrl,
        isInit = false;


    /**
     * init FB connection
     *
     * @param _appId
     * @param _channelUrl
     */
    function init(_appId, _channelUrl) {
        // Load the SDK asynchronously
        appId = _appId;
        channelUrl = _channelUrl;
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            //js.src = "//connect.facebook.net/en_US/all.js";
            js.src = "http://connect.facebook.net/en_US/all/debug.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    /**
     * Is user login to app thought FB account
     * @returns {Promise} Boolean
     */
    function isLogin() {
        return asyncRequest(function(requestDeferred) {
            FB.getLoginStatus(function(response) {
                // this will be called when the roundtrip to Facebook has completed
                if (response.status === 'connected' && !!response.authResponse) {
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token
                    // and signed request each expire
                    uid = response.authResponse.userID;
                    accessToken = response.authResponse.accessToken;
                    $rootScope.$apply(function() {
                        requestDeferred.resolve(true);
                    });
                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook,
                    // but has not authenticated your app
                    $rootScope.$apply(function() {
                        requestDeferred.resolve(false);
                    });
                } else {
                    // the user isn't logged in to Facebook.
                    $rootScope.$apply(function() {
                        requestDeferred.resolve(false);
                    });
                }
            });
        });

        /*var deferred = $q.defer();

        executeIsFBDefined(
            (function(requestDeferred) {
                return function() {
                    FB.getLoginStatus(function(response) {
                        // this will be called when the roundtrip to Facebook has completed
                        console.log('isLogin result');
                        if (response.status === 'connected' && !!response.authResponse) {
                            // the user is logged in and has authenticated your
                            // app, and response.authResponse supplies
                            // the user's ID, a valid access token, a signed
                            // request, and the time the access token
                            // and signed request each expire
                            uid = response.authResponse.userID;
                            accessToken = response.authResponse.accessToken;
                            console.log('isLogin result', true);
                            requestDeferred.resolve(true);
                        } else if (response.status === 'not_authorized') {
                            // the user is logged in to Facebook,
                            // but has not authenticated your app
                            console.log('isLogin result', false);
                            requestDeferred.resolve(false);
                        } else {
                            // the user isn't logged in to Facebook.
                            console.log('isLogin result', false);
                            requestDeferred.resolve(false);
                        }
                    }, true);
                }
            })(deferred),
        true);

        return deferred.promise;*/
    }

    /**
     * Login FB user to application
     *
     * @returns {Promise}
     */
    function login() {
        var deferred = Q.defer();

        executeIsFBDefined(
            (function(requestDeferred) {
                return function() {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            console.log('Welcome!  Fetching your information.... ');
                            FB.api('/me', function(response) {
                                console.log('Good to see you, ' + response.name + '.');
                                requestDeferred.resolve(response);
                            });
                        } else {
                            console.log('User cancelled login or did not fully authorize.');
                            requestDeferred.reject();
                        }
                    });
                }
            })(deferred), true
        );

        return deferred.promise;
    }

    function logout() {
        var deferred = Q.defer();
        executeIsFBDefined(
            (function(requestDeferred) {
                return function() {
                    FB.logout(function(response) {
                        if (response.authResponse) {
                            console.log('Welcome!  Fetching your information.... ');
                            FB.api('/me', function(response) {
                                console.log('Good to see you, ' + response.name + '.');
                                requestDeferred.resolve(response);
                            });
                        } else {
                            console.log('User cancelled login or did not fully authorize.');
                            requestDeferred.reject();
                        }
                    }, true);
                }
            })(deferred), true
        );
        return deferred.promise;
    }

    /**
     * Get FB user name
     *
     * @returns {Promise}
     */
    function getUserName() {
        console.log('getUserName');
        return asyncRequest(function(requestDeferred) {
            FB.api('/me', function(response) {
                $rootScope.$apply(function() {
                    if (!!response.name) {
                        requestDeferred.resolve(response.name)
                    } else {
                        requestDeferred.resolve(null);
                    }
                });
            });
        });
    }

    function refreshElement(element) {
        executeIsFBDefined(function() {
            FB.XFBML.parse(element);
        });
    }

    /**
     *
     */
    function refreshDOM() {
        executeIsFBDefined(function() {
            FB.XFBML.parse();
        });
    }

    /**
     * get current user score
     */
    function getMyScore() {
        return asyncRequest(function(deferred) {
            FB.api('/me/scores', function(response) {
                if (!!response) {
                    getAppId().then(function(id) {
                        for (var i = 0, count = response.data.length; i < count; i++) {
                            var data = response.data[i];
                            if (data.application.id === id) {
                                deferred.resolve(data.score);
                                return;
                            }
                        }
                    });
                } else {
                    $rootScope.$apply(function() {
                        deferred.resolve(null);
                    });
                }
            });
        });;
    }

    /**
     * update scores of current user
     * @param value
     * @returns {*|Function|defer.promise|promise|Function|Function|Function|Function|promise|promise|promise|Q.promise|Function|Function}
     */
    function setMyScore(value) {
        console.log('setMyScore', value);
        var deferred = Q.defer();
        executeIsFBDefined((function(requestValue, requestDeferred) {
            return function() {
                FB.api('/me/scores', 'post', {score: requestValue}, function(response) {
                    console.log('setMyScore.response', response);
                    if (!response.error) {
                        requestDeferred.resolve(true);
                        $rootScope.$broadcast('fb/setMyScore', value);
                    } else {
                        requestDeferred.reject(response.error);
                    }
                });
            };
        })(value, deferred), true);
        return deferred.promise;
    }

    /**
     * get score board of my friends, and mine
     */
    function getFriendsScores() {
        /*getFriends().then(function(friends) {
            for(var i = 0, count = friends.length; i < count; i++) {
            }

            (function requestNextScore(i) {
                var friend = friends[i];

            })(0);
        });*/


        return asyncRequest(function(deferred) {

//            FB.api('/me/friends?fields=picture.width(128).height(128),scores.fields(score,application),name', function(response) {
            FB.api('/app/scores?limit=10', function(response) {
                console.log('asyncRequest', response);
                if (!!response && response.data) {
                    var scores = response.data;
                    /*for (var i = 0, count = scores.length; i < count; i++) {
                        scores[i].score = scores.;
                    }*/
                    $rootScope.$apply(function() {
                        deferred.resolve(scores);
                    })
                } else if (response.error){
                    $rootScope.$apply(function() {
                        deferred.reject(response.error);
                    });
                }
            });
        });
    }

    function getFriends() {
        return asyncRequest(function(deferred) {
            FB.api('/me/friends?fields=picture.type(small).width(128).height(128)', function(response) {
                if (!!response && response.data) {
                    deferred.resolve(response.data);
                } else {
                    deferred.resolve(null);
                }
            });
        });
    }

    /**
     * get array of app permitions
     * @returns {Promise}
     */
    function getPermitions() {
        var deferred = Q.defer();
        executeIsFBDefined((function(requestDeferred) {
            return function() {
                FB.api('/me/permissions', function(response) {
                    if (!!response) {
                        requestDeferred.resolve(response.data)
                    } else {
                        requestDeferred.resolve(null);
                    }
                });
            }
        })(deferred), true);
        return deferred.promise;
    }

    /**
     * Get current application id
     * @returns {Promise}
     */
    function getAppId() {
        return asyncRequest(function(deferred) {
            FB.api('/app/', function(response) {
                $rootScope.$apply(function() {
                    if (!!response) {
                        deferred.resolve(response.id)
                    } else {
                        deferred.resolve(null);
                    }
                });
            });
        });
    }

    /**
     * @private
     * @param request
     * @returns {Promise}
     */
    function asyncRequest(request) {
        var deferred = $q.defer();
        executeIsFBDefined((function(requestDeferred) {
            return function() {
                request(requestDeferred);
            };
        })(deferred), true);
        return deferred.promise;
    }

    /**
     * execute fn if FB defined, else store it in a queue
     * @private
     * @param fn
     * @param useTimeout
     */
    function executeIsFBDefined(fn, useTimeout) {
        if (!!$window['FB'] && isInit) {
            if (useTimeout) {
                $timeout(fn, 0);
            } else {
                fn();
            }
        } else {
            requestQ.push(fn);
        }
    }

    $window.fbAsyncInit = function() {
        // Executed when the SDK is loaded

        FB.init({
            appId      : appId,      // App ID from the app dashboard
            channelUrl : channelUrl, // Channel file for x-domain comms
            status     : true,       // Check Facebook Login status
            xfbml      : true        // Look for social plugins on the page
        });

        isInit = true;

        //get all requests from Q and execute one-by-one
        for(var i = 0, count = requestQ.length; i < count; i++) {
            requestQ[i]();
        }
    };

    return {
        init: init,
        isLogin: isLogin,
        getUserName: getUserName,
        login: login,
        logout: logout,
        refreshDOM: refreshDOM,
        refreshElement: refreshElement,
        getMyScore: getMyScore,
        setMyScore: setMyScore,
        getFriendsScores: getFriendsScores
    }
}]);