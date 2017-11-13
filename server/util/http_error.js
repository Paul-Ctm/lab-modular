
/*************************************
********** http_error.js *************
*************************************/

/*
*		Module permettant de générer les erreurs à renvoyer au client
*/


var internalError = function (request, response, error, message){
	console.error(message, error);
  var error = new Error('Internal Server Error');
  error.http_code=500;
  response.status(error.http_code).send(error.message);
}

var unauthorizedError = function(request, response){
	console.log('Unauthorized access detected : ', request);
	var error = new Error('Unauthorized user');
  error.http_code=401;
  response.status(error.http_code).send(error.message);  
}

var accessDeniedError = function(request, response){
	console.log('Access Denied : ', request);
	var error = new Error('Access Denied');
  error.http_code=403;
  response.status(error.http_code).send(error.message);  
}

exports.internalError = internalError;
exports.unauthorizedError = unauthorizedError;
exports.accessDeniedError = accessDeniedError;