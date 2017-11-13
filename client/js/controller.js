/*****************************************
************* controoler.js **************
*****************************************/
/*
*  	Controllers de l'application public
*/

angular
	.module('myApp')
	.controller('navController', navController)
	.controller('headerController', headerController)
	.controller('bioController', bioController)
	.controller('skillController', skillController)
	.controller('timelineController', timelineController)
	.controller('projController', projController)
	.controller('loginController', loginController); 

	/*	navController
	*		Permet la gestion de l'onglet actif
	*/
	function navController($scope, $location){
    var nav = this;
    nav.isActive = function(viewLocation){
    	return viewLocation === $location.path();
    }
	}

/***********************************************************************************************
************************************************************************************************
********************* Controllers pour la partie Portfolio de l'application ********************
************************************************************************************************
***********************************************************************************************/

	/*	headerController
	*		Permet de gérer la partie du profil du portfolio (Nom prenom, etc..)
	*/
	function headerController(portfolioService){

		var header = this;
		header.loaded = false;
	
		header.getProfil = function(){
			portfolioService.get('profil', function(error, result){
				if(error){
					console.log(error);
				}else{
					header.profil = result[0];
					header.loaded = true;
				}
			});
		}

		if(!header.loaded) header.getProfil();

	}


	/*	bioController
	*		Permet de gérer la partie biographie du portfolio
	*/
	function bioController(portfolioService){

		var bio = this;
		bio.loaded = false;

		bio.getBiography = function(){
			portfolioService.get('bio', function(error, result){
				if(error){
					console.log(error);
				}else{
					bio.data = result[0];
					bio.loaded = true;
				}
			});
		}


		if(!bio.loaded) bio.getBiography();

	}


	/*	skillController
	*		Permet de gérer la partie compétence du portfolio
	*/
	function skillController(portfolioService){

		var sCtrl = this;
		sCtrl.loaded = false;

		sCtrl.getSkills = function(){
			portfolioService.get('skill', function(error, result){
				if(error){
					console.log(error);
				}else{
					sCtrl.skills = result;
					sCtrl.loaded = true;
				}
			});
		}

		if(!sCtrl.loaded) sCtrl.getSkills();

	}

	/*	timelineController
	*		Permet de gérer la partie Formations et Expériences du portfolio
	*/
	function timelineController(portfolioService){

		var timeCtrl = this;
		timeCtrl.loaded = false;
		timeCtrl.years = [];

		//Récupère toutes les années de la timeline
		timeCtrl.getYears = function(timeline){

			angular.forEach(timeline, function(value){

				var y = value.date_begin.substr(0, 4);

				if(timeCtrl.years.indexOf(y) == -1){
					timeCtrl.years.push(y);
				}

			});
		}

		timeCtrl.getTimeline = function(){
			portfolioService.get('timeline', function(error, result){
				if(error){
					console.log(error);
				}else{
					timeCtrl.timeline = result;
					timeCtrl.getYears(timeCtrl.timeline);
					timeCtrl.loaded = true;
				}
			});
		}

		if(!timeCtrl.loaded) timeCtrl.getTimeline();

	}

/***********************************************************************************************
************************************************************************************************
********************** Controllers pour la partie Projet de l'application **********************
************************************************************************************************
***********************************************************************************************/

	/*	projController
	*		Permet de gérer la partie projet du portfolio
	*/

	function projController(projectService, $scope){

		var projCtrl = this;
		projCtrl.loaded = false;
		projCtrl.state;

		projCtrl.getProjects = function(){
			projectService.get('', function(error, result){
				if(error){
					console.log(error);
				}else{
					projCtrl.projects = result;
					projCtrl.loaded = true;
				}
			});
		}

		projCtrl.likeClick = function(id){

			angular.forEach(projCtrl.projects, function(value){
				if(value.id == id){
					value.likes+=1;
				}
			});

			projectService.put(id+"/likes", {like: 1}, function(feedback){
				projCtrl.state = feedback;
			});
		
		}

		if(!projCtrl.loaded) projCtrl.getProjects();

	}

/***********************************************************************************************
************************************************************************************************
*********************** Controllers pour la partie Login de l'application **********************
************************************************************************************************
***********************************************************************************************/

	/*	loginController
	*		Permet de gérer la partie de la connexion à l'application administrateur
	*/

	function loginController($window, loginService, $cookies){

		var log = this;
		log.state;
	
		log.login = function(){
			loginService.login(log.email, log.password, function(success){
				if(success){
					log.state = "Validation confirmée";
					$cookies.put('origin', 'public');
					$window.location.replace('/admin');
				}else{
					log.state = "Pas authorisé";
				}
				log.email="";
				log.password="";
			});
		}

		log.autoconnect = function(){
			if($cookies.get('pass')){
				$window.location.replace('/admin');
			}
		}

		log.autoconnect();
	
	}

