'use strict';

var app = angular.module('myApp', ['ngRoute', 'ngclipboard', 'ngCookies']);

app.config(function($httpProvider, $routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $httpProvider.defaults.cache = true;

    $routeProvider
    .when("/", {
        templateUrl : "client/partials/protfolio.html"
    })
    .when("/projects", {
        templateUrl : "client/partials/projects.html"
    })
    .when("/contact", {
        templateUrl : "client/partials/contact.html"
    })
    .when("/login", {
        templateUrl : "client/partials/login.html"
    })
    .otherwise({redirectTo: "/"});
});