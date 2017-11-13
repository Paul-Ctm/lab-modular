/*****************************************
************* controoler.js **************
*****************************************/
/*
*  	Controllers de l'application d'administration
*/

angular
	.module('myApp')
	.controller('navController', navController)
	.controller('profilController', profilController)
	.controller('bioController', bioController)
	.controller('skillController', skillController)
	.controller('timeController', timeController)
	.controller('accountController', accountController);




/*	navController
*		Permet de gérer les actions liées à la navigation
*		- Active le bon onglet en fonction de l'URI, déconnecte l'utilisateur
*/
	function navController($scope, $location, $cookies, $window, $http, accountService){

	  var nav = this;

	  nav.isActive = function(viewLocation){
	  	return viewLocation === $location.path();
	  }

	  nav.logout = function(){
	  	accountService.logout(function(feedback){
	  		if(feedback){
	  			$window.location.replace('/');
				}
	  	});
	  }
	}

/***********************************************************************************************
************************************************************************************************
********************* Controllers pour la partie Portfolio de l'application ********************
************************************************************************************************
***********************************************************************************************/


/*	profilController
*		Récupère et gère sur l'application les données liées au profil de l'utilisateur
*/

	function profilController($http, portfolioService){

		var profil = this;

		profil.loaded;
		profil.data;

		profil.getProfil = function(){
			portfolioService.get('profil', function(error, result){
				if(error){
					profil.state = erreur;
				}else{
					profil.data = result[0];
					profil.loaded = true;
				}
			});
		}

		profil.updateProfil = function(){
			portfolioService.update('profil', profil.data, function(feedback){
					profil.state = feedback;
			});
		}

		//Si le profil n'est pas chargé
		if(!profil.loaded) profil.getProfil();
	}

/* bioController
*		Gère les données liées à la biographie de l'utilisateur
*/
	function bioController($http, portfolioService){

		var bio = this;

		bio.loaded;
		bio.data;

		bio.getBiography = function(){
			portfolioService.get('bio', function(error, result){
				if(error){
					bio.state = erreur;
				}else{
					bio.data = result[0];
					bio.loaded = true;
				}
			});
		}

		bio.updateBiography = function(){
			portfolioService.update('bio', bio.data, function(feedback){
					bio.state = feedback;
			});
		}

		//Si la biographie n'est pas chargée
		if(!bio.loaded) bio.getBiography();
	}

/* skillController
*		Gère les données liées aux compétences de l'utilisateur
*/
	function skillController(portfolioService){

		var skill = this;

		skill.loaded;
		skill.data;
		skill.enabledEdit = [];
		skill.new ={title: "", level: ""};

		skill.createSkill = function(){
			portfolioService.post('skill', skill.new, function(error, result){
				if(error){
					skill.state = error;
				}else{
					skill.data.push(result);
					skill.new.title = "";
					skill.new.level = "";
				}
			})
		}

		skill.getSkills = function(){
			portfolioService.get('skill', function(error, result){
				if(error){
					skill.state = error;
				}else{
					skill.data = result;
					skill.loaded = true;
					skill.new.title = "";
					skill.new.level = "";
				}
			});
		}

		skill.updateSkill = function(index){
			portfolioService.update('skill/'+skill.data[index].id, skill.data[index], function(feedback){
					skill.state = feedback;
					skill.enabledEdit[index] = false;
			});
		}

		skill.deleteSkill = function(index){
			portfolioService.del('skill/'+skill.data[index].id, function(feedback){
					skill.state = feedback;
					skill.data.splice(index,1);
			});
		}

		skill.editSkill = function(index){
			skill.enabledEdit[index] = true;
		}

		//Si les compétences ne sont pas chargées
		if(!skill.loaded) skill.getSkills();
	}

/*	timeController
*		Gère les données liées aux évènements de l'utilisateur (Formations et Expériences)
*/
	function timeController(portfolioService, $timeout){

		var time = this;
		time.loaded;
		time.data;
		time.displayInfo;
		time.message;

		time.isNew = function(){
			return time.index == -1;
		}

		time.getEvents = function(){
			portfolioService.get('timeline', function(error, result){
				if(error){
					time.alertInfo(error);
				}else{
					time.data = result;
					time.createNewEvent();
					time.loaded = true;
				}
			});
		}

		time.editEvent = function(index){
			time.oneEvent = angular.copy(time.data[index]);
			time.index = index;
		}

		time.cancelEvent = function(){
			time.oneEvent = angular.copy(time.data[time.index]);
			time.alertInfo('Modifications annulées');
		}

		time.updateEvent = function(){
			portfolioService.update('timeline/'+time.oneEvent.id, time.oneEvent, function(feedback){
				time.alertInfo(feedback);
				time.data[time.index] = time.oneEvent;
			});
		}

		time.delEvent = function(){
			portfolioService.del('timeline/'+time.oneEvent.id, function(feedback){
				time.alertInfo(feedback);
				time.data.splice(time.index,1);
				time.createNewEvent();
			});
		}

		time.createNewEvent = function(){
			d = new Date();
			time.oneEvent.title = "";
			time.oneEvent.description = "";
			time.oneEvent.date_begin =  d.toISOString();
			time.oneEvent.date_end = d.toISOString();
			time.oneEvent.organization = "";
			time.oneEvent.place = "";
			time.index = -1;
		}

		time.addNewEvent = function(){
			portfolioService.post('timeline', time.oneEvent, function(error, result){
				if(error){
					time.alertInfo(error)
				}else{
					time.state = 'Ajout avec succès';
					time.data.push(result);
					time.createNewEvent();
				}
			});
		}

		time.alertInfo = function(info){
			time.message = info;
			time.displayInfo = true;
			$timeout(function () { time.displayInfo = false; }, 3000);
		}

		//Si la timeline n'est pas chargé
		if(!time.loaded) time.getEvents();
	}

/***********************************************************************************************
************************************************************************************************
*************** Controllers pour la partie compte utilisateur de l'application *****************
************************************************************************************************
***********************************************************************************************/

	

	/*	accountController
	*		Permet de gérer la partie comtpe
	*/
	function accountController(accountService){

		var account = this;
		account.state;
		account.data;
	
		account.changePassword = function(){
			accountService.changePassword(account.data, function(success){
				if(success){
					account.state = "Validation confirmée";
				}else{
					account.state = "Erreur de changement";
				}
				account.data.password="";
				account.data.newpass="";
				account.data.passconfirm="";
			});
		}
	
	}