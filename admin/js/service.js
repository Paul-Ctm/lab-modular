'use strict';

/*****************************************
************* service.js **************
*****************************************/

angular
  .module('myApp')
  .service('portfolioService', portfolioService)
  .service('accountService', accountService);

/* portfolioService
*   Gère les requêtes liées à la partie portfolio de l'utilisateur
*/

  function portfolioService($http){

    var service = {};

    service.post = post
    service.del = del;
    service.update = update;
    service.get = get;

    return service;

    function post(uri, data, callback){
      $http.post('/api/portfolio/'+uri, {data: data}).then(success, error);

      function success(response){
        callback(null, response.data);
      }
      function error(error){
        console.log(error);
        callback('Erreur de création', null);
      }
    }

    function del(uri, callback){
      $http.delete('/api/portfolio/'+uri).then(success, error);

      function success(response){
        callback('Element supprimé');
      }
      function error(error){
        console.log(error);
        callback('Erreur de suppression');
      }
    }

    function update(uri, data, callback){
      $http.put('/api/portfolio/'+uri, {data: data}).then(success, error);

      function success(response){
        callback('Element mis à jour avec succès');
      }
      function error(error){
        console.log(error);
        callback('Erreur de mise à jour');
      }
    }

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
  };


/* accountService
*   Gère les requêtes liées à la partie portfolio de l'utilisateur
*/

  function accountService($http) {

    var service = {};

    service.logout = logout;
    service.changePassword = changePassword;

    return service;

    function logout(callback){
      $http.get('/api/account/logout').then(success, error);

      function success(response){
        callback(true);
      }
      function error(error){
        console.log(error);
        callback(false);
      }
    }

    function changePassword(data, callback){
      $http.put('/api/account/passwordChange', {data: data}).then(success, error);

      function success(response){
        callback('Element mis à jour avec succès');
      }
      function error(error){
        console.log(error);
        callback('Erreur de mise à jour');
      }
    }

  }
