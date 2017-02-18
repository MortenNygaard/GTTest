/**
*@namespace 
*/


/**
* Hoved klassen, ja måske den eneste klasse
* 
* @author Marten ?gaard
* @created 8/1/2017
* @copyright Marten ?gaard
* @todo 
* @class Main
* @static
*/
var Main = Main || (function () {
"use strict"

	var _r = new Object();
	/**
	* Counter der holder styr på hvor mange personerns detaljer der er loaded.
	* @property {int} detailsLoadCount
	*/
	_r.detailsLoadCount = 0;
	/**
	* 
	* @property {String} personTemplate
	*/
	_r.personTemplate = null;
	/**
	* Tid for hvornår loaderen er blevet vist. Bruges så det sikres at den vises i mindst 6 sekunder.
	* @property {DateTime} loaderStartTime
	*/
	_r.loaderStartTime = null;
		
	/**
	* Starter hele skidtet op og henter templaten fra htmlen
	* @method init
	*/
	_r.init = function(){
		
		//Stub code - to be removed
		alert("the function 'init' has been called  ")
		
	}
	/**
	* Starter loaderen og sætter tid
	* @method showLoader
	*/
	_r.showLoader = function(){
		
		//Stub code - to be removed
		alert("the function 'showLoader' has been called  ")
		
	}
	/**
	* Tjekker om tiden er gået og hvis ikke forlænges loaderen.
	* @method hideLoader
	*/
	_r.hideLoader = function(){
		
		//Stub code - to be removed
		alert("the function 'hideLoader' has been called  ")
		
	}
	/**
	* Loader person json
	* @method loadPersons
	*/
	_r.loadPersons = function(){
		
		//Stub code - to be removed
		alert("the function 'loadPersons' has been called  ")
		
	}
	/**
	* Når alt er loaded - kunne også bare være som anonym function
	* @method personsLoaded
	*/
	_r.personsLoaded = function(){
		
		//Stub code - to be removed
		alert("the function 'personsLoaded' has been called  ")
		
	}
	/**
	* Loader detaljer om hver enkelt person.
	* @method loadDetails
	*/
	_r.loadDetails = function(){
		
		//Stub code - to be removed
		alert("the function 'loadDetails' has been called  ")
		
	}
	/**
	* Kaldes når detaljerne er loadet og holder øje med om alle er loadet via detailsLoadCount
	* @method detailsLoaded
	*/
	_r.detailsLoaded = function(){
		
		//Stub code - to be removed
		alert("the function 'detailsLoaded' has been called  ")
		
	}
	/**
	* Opdaterer ui
	* @method render
	*/
	_r.render = function(){
		
		//Stub code - to be removed
		alert("the function 'render' has been called  ")
		
	}
	/**
	* Viser personens børn.
	* @method showChildren
	*/
	_r.showChildren = function(){
		
		//Stub code - to be removed
		alert("the function 'showChildren' has been called  ")
		
	}
		
	return _r;
})();

