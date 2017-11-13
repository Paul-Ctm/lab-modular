const jwt = require('./token.js');
const pool = require('../database/pg_connect.js');
const http_error = require('../util/http_error.js');

/*************************************
********** Authenticate.js ***********
*************************************/

/*
*		Module permettant de vérifier si les cookies sont authentiques
*/

/* 	isAdmin
*		Vérifie si la requête contient bien la clé administrateur pour accéder à l'application d'administration
*		Renvoie sur la page de login sinon
*/

var isAdmin = function(req, res, next) {
	if(req.cookies.pass){
		var pass = req.cookies.pass;

		try{
			var adminPass = jwt.decodeToken(pass);
			if(jwt.validAdmin(adminPass.iss)){
				return next();
			}
			res.redirect('/login');
		}catch(error){
			console.log('Token error authenticated', error);
			res.redirect('/login');	
		}
	}else{
		res.redirect('/login');
	}
}

/*	verifTokenApi
* 	Vérifie si le token correspond à un utilisateur dans la base avant d'accéder à la ressource
*		Renvoie l'erreur 401 - Unauthorized sinon ce n'est pas le cas
*/
var verifTokenApi = function(req, res, next){
	var token = req.headers['x-access-token'];
	if(token){
		var apiPass = jwt.decodeToken(token);
		pool.query('SELECT * FROM profil WHERE id_user=$1::int', [apiPass.iss],
			function(error, result){
				if(error){
					http_error.internalError(request, response, 'Database connection failed', error); 
				}else if(result.rows.length == 0){
					http_error.unauthoriedError(req, res);
				}else{
					req.user = apiPass.iss;
					next();
				}
			});
	}else{
		http_error.unauthoriedError(req, res);
	}
}

exports.isAdmin = isAdmin;
exports.verifTokenApi = verifTokenApi;