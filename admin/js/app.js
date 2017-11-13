/**********************************
************* app.js **************
**********************************/
/*
*   Application principale myApp, définition et configuration
*/


'use strict';

//Définition
var app = angular.module('myApp', ['ngRoute', 'ngclipboard', 'ngCookies', 'datepicker']);

//configuration
app.config(function($httpProvider, $routeProvider, $locationProvider) {   

    $httpProvider.defaults.cache = true;

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $routeProvider
    .when("/admin/presentation", {
        templateUrl : "admin/partials/portfolio.html"
    })
    .when("/admin/projects", {
        templateUrl : "admin/partials/projects.html"
    })
    .when("/admin/contact", {
        templateUrl : "admin/partials/contact.html"
    })
    .when("/admin/account", {
        templateUrl : "admin/partials/account.html"
    })
    .otherwise({redirectTo: "/admin/presentation"});
});

// Ajout du token d'accès à l'API
app.run(function($http, $cookies){
    $http.defaults.headers.common['x-access-token'] = $cookies.get('token');
});
