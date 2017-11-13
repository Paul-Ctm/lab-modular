const express = require('express');
const router = express.Router();
const pool = require('../database/pg_connect.js');
const http_error = require('../util/http_error.js');

/********************************************
*********************************************
********** Routes pour Projects *************
*********************************************
********************************************/

/*
*	Routeur pour l'accès aux ressources lié aux porjects de l'utilisateur
*/


/*	URI : /project/
*		GET all projects
*/
router.get('/', function (request, response) {

  pool.query('SELECT id_project AS id, title, summary, date, likes FROM project ORDER BY likes DESC', [],
	    function(error, result){
		    if(error){
		    	http_error.internalError(request, response, 'Database connection failed', error);      
		    }
		    else{
		    	response.status(200).json(result.rows);
		    }
	});

});

/*	URI : /project/:id/likes
*		UPDATE likes for the project number ':id'
*/
router.put('/:id/likes', function (request, response) {

	pool.query('UPDATE PROJECT SET likes=likes+$1::int WHERE id_project=$2', [request.body.like,request.params.id],
    function(error, result){
	    if(error){
	    	http_error.internalError(request, response, 'Database connection failed', error);      
	    }
	    else{
	    	response.status(200).json({status: 'success'});
	    }
	});

});

module.exports = router;
