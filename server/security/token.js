const jwt = require('jwt-simple');
const moment = require('moment');
const hashcode = '24svh89r5n6';
const adminKey = '65sv4s1fvbqfdb';

/*************************************
************* token.js ***************
*************************************/

/*
*		Module permettant de générer et vérifierles tokens pour l'API et l'application Admin		
*/

/*	getApiPass
*		Retourne un token qui stock l'identifiant de l'utilisateur
*/
var getApiPass = function(userid){
	var expires = moment().add('days', 7).valueOf();
	var token = jwt.encode({
		iss: userid,
		exp: expires
	}, hashcode);

	return token;
}

/*	getApiPass
*		Retourne un token qui stock la clé de l'applciation administrateur
*/
var getAdminPass = function(){
	var expires = moment().add('days', 7).valueOf();
	var token = jwt.encode({
		iss: adminKey,
		exp: expires
	}, hashcode);

	return token;
}

/*	decodeToke,
*		Retourne le contenu du token décodé
*/
var decodeToken = function(token){
	try{
		var decode = jwt.decode(token, hashcode);
		return decode;
	}catch(err){
		return undefined;
	}
}

/*	validAdmin
*		Retourne vrai si la clé correspond à la clé d'administrateur
*/
var validAdmin = function(key){
	return key == adminKey;
}

exports.getApiPass = getApiPass;
exports.getAdminPass = getAdminPass;
exports.decodeToken = decodeToken;
exports.validAdmin = validAdmin;