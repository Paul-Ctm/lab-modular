const express = require('express');
const router = express.Router();
const pool = require('../database/pg_connect.js');
const crypt = require('../security/crypt.js');
const jwt = require('../security/token.js');
const http_error = require('../util/http_error.js');
const authenticate = require('../security/authenticate.js')

/*************************************
************* account.js *************
*************************************/

/*
* Router pour les requêtes des utilisateurs (login, logout)
*/

/* URI : /api/account/login
*  POST : Vérification de l'adresse email et du mot de passe.
*         Si l'utilisateur existe, alors :
*         - un cookie contenant le token de son identification lui est envoyé
*         - un cookie contenant la clé d'authentification à l'applciation admin lui est envoyé
*         Sinon, renvoie de l'erreur 401 - Unauthorized 
*/
router.post('/login', function (request, response) {

  if(crypt.isSet(request)){
    email = request.body.email;
    password = request.body.password;
    pool.query('SELECT id_user, hash, salt FROM profil WHERE email=$1', [email],
      function(error, result){
        if(error){
          http_error.internalError(request, response, 'Database connection failed', error); 
        }
        else if(result.rowCount != 1){
          http_error.unauthoriedError(request, response);
        }
        else{
          hash = result.rows[0].hash;
          salt = result.rows[0].salt;
          id = result.rows[0].id_user;

          if(crypt.check(password, salt, hash)){
            response.cookie('token', jwt.getApiPass(id), {expire: new Date(Date.now() + 60000)});
            response.cookie('pass', jwt.getAdminPass(), {expire: new Date(Date.now() + 60000)});
            response.status(200).json('Successful authentification');
          }
          else{
            http_error.unauthorziedError(request, response); 
          }
        }
      }
    );
  }else{
    http_error.unauthorziedError(request, response); 
  }
});


/* URI : /api/account/logout
*  GET : Supprime les cookies qui identifie l'utilisateur sur le site
*/
router.get('/logout', function (request, response) {
    response.cookie('pass', '',  {expires: new Date(0)});
    response.cookie('token', '',  {expires: new Date(0)});
    response.status(200).send('success');
})

/* URI : /api/account/logout
*  POST : Modifie le mot de passe de l'utilisateur
*/
router.put('/passwordChange',  authenticate.verifTokenApi, function (request, response) {
  if(crypt.isSetPwd(request)){
    password = request.body.data.password;
    newpass = request.body.data.newpass;
    passconfirm = request.body.data.passconfirm;
    console.log(request.body);
    if(newpass == passconfirm && newpass != ""){
      var newpassword = crypt.passwordToHash(newpass);
      pool.query('UPDATE profil SET hash=$1, salt=$2 WHERE id_user=$3',
        [
          newpassword.hash,
          newpassword.salt,
          request.user
        ],
        function(error, result){
          if(error){
            http_error.internalError(request, response, 'Database connection failed', error); 
          }
          else{
            response.status(200).send('success');
          }
        }
      );
    }else{
      http_error.accessDeniedError(request, response);
    }
  }else{
    http_error.unauthorizedError(request, response); 
  }
})


module.exports = router;