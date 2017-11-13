'use strict';

angular
  .module('myApp')
  .service('loginService',  loginService)
  .service('portfolioService',  portfolioService)
  .service('projectService', projectService);

  /*  loginService
  *   Service pour la gestion de la connexion à l'application administrateur
  */
  function loginService($http) {

    var service = {};

    service.login = login;

    return service;

    function login(email, password, callback){
      $http.post('/api/account/login', {email: email, password: password}).then(success, error);

      function success(response){
        callback(true);
      }
      function error(error){
        callback(false);
      }
    }
  }

  /*  portfolioService
  *   Service pour la gestion des données liées à la page Portfolio
  */

  function portfolioService($http){

    var service = {};
    service.get = get;

    return service;

    function get(uri, callback){
      $http.get('/api/portfolio/'+uri).then(success, error);
      function success(response){
        callback(null, response.data);
      }
      function error(error){
        console.log(error);
        callback('Erreur', null);
      }
    }
  }

  /*  projectService
  *   Service pour la gestion des données liées à la page Projet
  */
  function projectService($http){

    var service = {};
    service.get = get;

    return service;

    function get(uri, callback){
      $http.get('/api/project/'+uri).then(success, error);
      function success(response){
        callback(null, response.data);
      }
      function error(error){
        console.log(error);
        callback('Erreur', null);
      }
    }

    function update(uri, data, callback){
      $http.put('/api/project/'+uri, {data: data}).then(success, error);

      function success(response){
        callback('Element mis à jour avec succès');
      }
      function error(error){
        console.log(error);
        callback('Erreur de mise à jour');
      }
    }

  }