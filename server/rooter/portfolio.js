const express = require('express');
const router = express.Router();
const pool = require('../database/pg_connect.js');
const authenticate = require('../security/authenticate.js')
const http_error = require('../util/http_error.js');

/********************************************
*********************************************
********** Routes pour Portfolio ************
*********************************************
********************************************/

/*
*	Routeur pour l'accès aux ressources lié au portfolio de l'utilisateur
*/

/*	URI /portfolio/profil
*		GET user details
*/
router.get('/profil', function (request, response) {

  	pool.query('SELECT last_name, first_name, email, phone_number, short_desc, img_profil FROM profil', [],
	    function(error, result){
		    if(error){
		    	http_error.internalError(request, response, 'Database connection failed', error);      		
		    }
		    else{
		    	response.status(200).json(result.rows);
		    }
	});

});

/*	URI /api/portfolio/profil
*		PUT : Met à jour des informations du profil de l'utilisateur
*/
router.put('/profil', authenticate.verifTokenApi, function(request, response, user){

	pool.query('UPDATE PROFIL SET email=$1, last_name=$2, first_name=$3,  phone_number=$4, short_desc=$5 WHERE id_user=$6', 
		[
			request.body.data.email,
			request.body.data.last_name,
			request.body.data.first_name,
			request.body.data.phone_number,
			request.body.data.short_desc,
			request.user
		],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);
	    }
	    else{
	    	response.status(200).send({status: 'success'});
	    }
	});

});

/*	URI /api/portfolio/bio
*		GET : Récupère la biographie de l'utilisateur
*/
router.get('/bio', function (request, response) {

	pool.query('SELECT title, description FROM biography', [],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);
	    }
	    else{
	    	response.status(200).json(result.rows);
	    }
	});

});

/* 	URI /api/portfolio/bio
*		PUT : Met à jour la biographie de l'utilisateur
*/
router.put('/bio', authenticate.verifTokenApi, function(request, response, user){

	pool.query('UPDATE biography SET description=$1 WHERE id_user=$2', 
		[
			request.body.data.description,
			request.user
		],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);
	    }
	    else{
	    	response.status(200).send({status: 'success'});
	    }
	});

});

/* 	URI /api/portfolio/skill
*		GET : Renvoie toutes les compétences
*/
router.get('/skill', function (request, response) {

  	pool.query('SELECT id_skill AS id, title, level FROM skill ORDER BY id_skill', [],
	    function(error, result){
		    if(error){
		    	http_error.internalError(request, response, 'Database connection failed', error);
		    }
		    else{
		    	response.status(200).json(result.rows);
		    }
	});

});

/*	URI /api/portfolio/skill/:id
*		UPDATE : Met à jour la compétence de numero :id de l'utilisateur
*/
router.put('/skill/:id', authenticate.verifTokenApi, function(request, response, user){

	pool.query('UPDATE skill SET title=$1, level=$2 WHERE id_skill=$3 AND id_user=$4', 
		[
			request.body.data.title,
			request.body.data.level,
			request.params.id,
			request.user
		],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);
	    }
	    else{
	    	response.status(200).send({status: 'success'});
	    }
	});

});

/*	URI /api/portfolio/skill
*		DELETE : Supprime une compétence de l'utilisateur
*/
router.delete('/skill/:id', authenticate.verifTokenApi, function(request, response, user){

	pool.query('DELETE FROM skill WHERE id_skill=$1 AND id_user=$2', 
		[
			request.params.id,
			request.user
		],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);
	    }
	    else{
	    	response.status(200).send({status: 'success'});
	    }
	});

});

/*	URI /api/portfolio/skill
*		CREATE : Crée une nouvelle compétence pour l'utilisateur 
*/
router.post('/skill', authenticate.verifTokenApi, function(request, response, user){

	pool.connect(function(error, client, done){
		if(error){
			http_error.internalError(request, response, 'Database connection failed', error);
		}

		querystr = 'INSERT INTO skill(id_user, title, level) VALUES($1, $2, $3)';
		querystr+= ' RETURNING id_skill as id, title, level';

		client.query(querystr, 
			[
				request.user,
				request.body.data.title,
				request.body.data.level
			],
	    function(error, result){
		    if(error){
		    	http_error.internalError(request, response, 'Database connection failed', error);
		    }
		    else{
		    	done();
		    	response.status(200).json(result.rows[0]);
		    }
		  }
		);
	});
});

/*	URI /api/portfolio/timeline
*		GET : Récupère les évènements de l'utilisateur
*/
router.get('/timeline', function (request, response) {

  	pool.query('SELECT id_time AS id, title, description, organization, TO_CHAR(date_begin, \'YYYY-MM-DD\') AS date_begin, TO_CHAR(date_end, \'YYYY-MM-DD\') as date_end, place FROM timeline ORDER BY date_begin DESC', [],
	    function(error, result){
		    if(error){
		    	http_error.internalError(request, response, 'Database connection failed', error);
		    }
		    else{
		    	response.status(200).json(result.rows);
		    }
	});

});

/*	URI /api/portfolio/time/:id
*		UPDATE : Met à jour un évènement de l'utilisateur
*/
router.put('/timeline/:id', authenticate.verifTokenApi, function(request, response, user){

	pool.query('UPDATE timeline SET title=$1, description=$2, organization=$3, date_begin=$4, date_end=$5, place=$6 WHERE id_time=$7 AND id_user=$8', 
		[
			request.body.data.title,
			request.body.data.description,
			request.body.data.organization,
			request.body.data.date_begin,
			request.body.data.date_end,
			request.body.data.place,
			request.params.id,
			request.user
		],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);
	    }
	    else{
	    	response.status(200).send({status: 'success'});
	    }
	});

});

/*	URI /api/portfolio/timeline
*		DELETE : Supprime un évènement de l'utilisateur
*/
router.delete('/timeline/:id', authenticate.verifTokenApi, function(request, response, user){

	pool.query('DELETE FROM timeline WHERE id_time=$1 AND id_user=$2', 
		[
			request.params.id,
			request.user
		],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);
	    }
	    else{
	    	response.status(200).send({status: 'success'});
	    }
	});

});

/*	URI /api/portfolio/timeline
*		CREATE : Création d'un nouvel évènement pour l'utilisateur
*/
router.post('/timeline', authenticate.verifTokenApi, function(request, response, user){

	pool.connect(function(error, client, done){

		if(error){
			http_error.internalError(request, response, 'Database connection failed', error);
		}

		querystr = 'INSERT INTO timeline(title, description, organization, date_begin, date_end, place, id_user) VALUES($1, $2, $3, $4, $5, $6, $7)';
		querystr+= ' RETURNING id_time as id, title, description, organization, date_begin, date_end, place';

		client.query(querystr, 
			[
				request.body.data.title,
				request.body.data.description,
				request.body.data.organization,
				request.body.data.date_begin,
				request.body.data.date_end,
				request.body.data.place,
				request.user
			],
	    function(error, result){
		    if(error){
		    	http_error.internalError(request, response, 'Database connection failed', error);
		    }
		    else{
		    	done();
		    	response.status(200).json(result.rows[0]);
		    }
		  }
		);
	});
});

module.exports = router;