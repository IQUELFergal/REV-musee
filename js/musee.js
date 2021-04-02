
var canvas, engine ;
var scene, camera ;
var temps=0;
var vitesseRotation=1;
var advancedTexture;
var nom;
var nomTableau = "Nom";
var descriptionTableau = "Decription";

var distance = 0;

function init(){
	canvas = document.getElementById("renderCanvas") ; 
	engine = new BABYLON.Engine(canvas,true) ; 
	scene  = creerScene() ; 

	camera = creerCamera("camera",{}, scene) ; 
	
	// GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Panel
    var panel = new BABYLON.GUI.StackPanel();
    panel.isVertical = true; 
    advancedTexture.addControl(panel);   

    nom = new BABYLON.GUI.TextBlock();
	nom.text = distance.toString();
    nom.color = "white";
    nom.height = "30px";
    nom.fontSize = 24;
    nom.fontStyle = "bold";
    panel.addControl(nom);

	/*var descr = new BABYLON.GUI.TextBlock();
    descr.text = descriptionTableau;
    descr.color = "white";
    descr.height = "70px";
    descr.fontSize = 24;
    descr.fontStyle = "bold";
    panel.addControl(descr);*/

	
	//panel.notRenderable = true;




	createLights() ;
	peuplerScene() ;  

	set_FPS_mode(scene, canvas,camera) ; 
	
	window.addEventListener("resize", function(){engine.resize();}) ; 

	window.addEventListener('click',function(event){
		var pickResult=scene.pick(event.clientX, event.clientY);
		distance+=1;
		//distance = BABYLON.Vector3.Distance(camera.position, pickResult.pickedMesh.position);
		interact(pickResult);
	});

	window.addEventListener('mousemove',function(event){
		distance+=1;
		//nom.text = distance;
		//var pickResult=scene.pick(event.clientX, event.clientY)
		//distance = BABYLON.Vector3.distance(camera.position, pickResult.pickedMesh.position);
	});

	var maBox= new BABYLON.Mesh.CreateBox("box_1",5,scene);
	scene.registerBeforeRender(function(){
			temps=temps+(1/engine.getFps())
			maBox.rotation.y=vitesseRotation*temps;
			}); 
	engine.runRenderLoop( function(){scene.render();} ) ; 
}


function interact(pickResult)
{
	
	if (pickResult.hit)
	{
		if(pickResult.pickedMesh.metadata.type == 'teleporter')
		{
			//camera.position = pickResult.pickedPoint;
			var animation = new BABYLON.Animation("camera","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3);
			var keys = [];
			keys.push({
			 frame: 0,
			 value: camera.position
			});
			keys.push({
			 frame: 100,
			 value: pickResult.pickedPoint
			});
			animation.setKeys(keys);
			camera.animations.push(animation);
			scene.beginAnimation(camera, 0, 100, false);
		}
		else 
		{
			sphere = creerTeleporteur("sphere", {diameter:1.0}, scene) ;
			sphere.position = pickResult.pickedPoint ;
		}
	}
}


function createLights(){
	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(5,5,5), scene) ; 
}


function peuplerScene(){

	// Dimensions musée
	var hauteurMusee = 10.0;
	var hauteurSalle = hauteurMusee/2;

	var largeurMusee = 30.0;
	var largeurSalle = largeurMusee/2;

	// Création des materiaux
	var materiauRouge = creerMateriauSimple("rouge",{couleur:new BABYLON.Color3(0.8,0.1,0.1)},scene) ;
	var materiauCloison = creerMateriauSimple("mat-cloison",{texture:"assets/textures/murs.jpg"}, scene) ; 
	var materiauSol = creerMateriauSimple("mat-sol",{texture:"assets/textures/solCarrelage.jpg"}, scene) ; 

	sphere = creerTeleporteur("sphere", {diameter:1.0}, scene) ;
	sphere.position =  new BABYLON.Vector3(0,2,5) ;

	// Création du sol
	var sol = creerSol("sol",{},scene) ; 

	// Création du musée
	var origine = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1.0}, scene) ;
	origine.position = new BABYLON.Vector3(0,0,0) ;



	/*//EXEMPLE : CREATION D'UN MUR AVEC UN TABLEAU DESSUS =============================

	//Creation d un mur
	var cloison1 = creerCloison("cloison1",{hauteur:3.0, largeur:5.0,materiau:materiauCloison},scene) ;
	cloison1.position = new BABYLON.Vector3(5,0,-5) ; 
	cloison1.rotation.y = Math.PI/3 ;

	// Création d un tableau
	var tableau = creerPoster("tableau1",{tableau:"assets/tableaux/Berthe.jpg"},scene) ;
	tableau.parent = cloison1 ; // on accroche le tableau à la cloison 
	tableau.position.z = -0.1  ;  
	tableau.position.y = 1.7 ; 
	//================================================================================*/

	
	var mur = creerCloison("cloison",{hauteur:1.0,largeur:2.0,materiau:materiauRouge},scene) ; 
	mur.parent = origine;
	mur.position = new BABYLON.Vector3(0,0,0) ; 

	var tapis = creerCloison("tapis",{hauteur:15.0,largeur:4.0,materiau:materiauRouge},scene) ; 
	tapis.parent = origine; 
	tapis.position = new BABYLON.Vector3(0,0.01,0) ; 
	tapis.rotation.x = Math.PI/2 ;

	var tapis1 = creerCloison("tapis",{hauteur:3.0,largeur:6,materiau:materiauRouge},scene) ; 
	tapis1.parent = origine;
	tapis1.position = new BABYLON.Vector3(-3,0.005,7.5) ; 
	tapis1.rotation.x = Math.PI/2 ;

	var porte = creerPorte("entree",{hauteur:3.0,largeur:4,materiau:materiauRouge},scene) ;
	porte.parent = origine;
	porte.position = new BABYLON.Vector3(-3,0,7.5) ; 

	//Création du sol RDC en 10*10 murs 
	var nbFloorTile = 10;
	for(var i=0; i< nbFloorTile; i++)
	{
		for(var j=0; j< nbFloorTile; j++)
		{
			var sol = creerCloison("sol",{hauteur:largeurMusee/nbFloorTile,largeur:largeurMusee/nbFloorTile,materiau:materiauSol},scene) ;
			sol.parent = origine;
			sol.position = new BABYLON.Vector3(-largeurSalle + largeurMusee/(2*nbFloorTile) + i*largeurMusee/(nbFloorTile), 0, j*largeurMusee/(nbFloorTile)) ; 
			sol.rotation.x = Math.PI/2 ;
		}
	}

	//Création du sol étage en 10*5 murs 
	for(var i=0; i< nbFloorTile; i++)
	{
		for(var j=0; j< nbFloorTile/2; j++)
		{
			var sol = creerCloison("sol",{hauteur:largeurMusee/nbFloorTile,largeur:largeurMusee/nbFloorTile,materiau:materiauSol},scene) ;
			sol.parent = origine;
			sol.position = new BABYLON.Vector3(-largeurSalle + largeurMusee/(2*nbFloorTile) + i*largeurMusee/(nbFloorTile), hauteurSalle, largeurSalle+j*largeurMusee/(nbFloorTile)) ; 
			sol.rotation.x = Math.PI/2 ;
		}
	}

	// var solEtage = creerCloison("solEtage", {hauteur:largeurMusee, largeur:largeurSalle, materiau:materiauSolInterieur}, scene) 
	// solEtage.position = new BABYLON.Vector3(-largeurSalle/2,hauteurSalle,-largeurSalle);
	// solEtage.rotation.x = Math.PI/2;

	/*//murs
	var nbWall = 30;
	for	(var n=0; n< 3; n++)
	{
		for(var i=0; i< nbWall; i++){
			var cl = creerCloison("cloison-"+i, {hauteur:n==1?5:10,largeur:30/nbWall,materiau:materiauBeton}, scene) ;
			cl.parent = origine;
			cl.position = new BABYLON.Vector3(-15+30/(2*nbWall) + i*30/(nbWall),0,15*n) ;
		} 
	}
	for	(var n=0; n< 2; n++)
	{
		for(var i=0; i< nbWall; i++){
			var cl = creerCloison("cloison-"+i, {hauteur:10,largeur:30/nbWall,materiau:materiauBeton}, scene) ;
			cl.parent = origine;
			cl.position = new BABYLON.Vector3(-15+30*n,0, i*30/(nbWall) + 30/(2*nbWall)) ;
			cl.rotation.y = Math.PI/2 ;
		} 
	}*/

	dimensionsMursExterieurs = new BABYLON.Vector2(hauteurMusee,largeurMusee);
	// dimensionsMurInterieur = new BABYLON.Vector2(hauteurSalle,largeurMusee);

	var materiauBetonMursExterieurs = creerMateriauSimple("matBeton0",{texture:"assets/textures/concrete.jpg"}, scene) ; 
	materiauBetonMursExterieurs.diffuseTexture.uScale = 3 * Math.max(dimensionsMursExterieurs.x,dimensionsMursExterieurs.y) / dimensionsMursExterieurs.x;
	materiauBetonMursExterieurs.diffuseTexture.vScale = 3 * Math.max(dimensionsMursExterieurs.x,dimensionsMursExterieurs.y) / dimensionsMursExterieurs.y;

	var materiauBetonMurInterieur = creerMateriauSimple("matBeton1",{texture:"assets/textures/concrete.jpg"}, scene) ; 
	// materiauBetonMurInterieur.diffuseTexture.uScale = 3 * Math.max(dimensionsMursExterieurs.x,dimensionsMursExterieurs.y) / dimensionsMurInterieur.x;
	// materiauBetonMurInterieur.diffuseTexture.vScale = 3 * Math.max(dimensionsMursExterieurs.x,dimensionsMursExterieurs.y) / dimensionsMurInterieur.y;

	// Création des cloisons du musée
	var cloisonEst = creerCloison("cloisonEst",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauBetonMursExterieurs}, scene);
	cloisonEst.parent = origine;
	cloisonEst.position = new BABYLON.Vector3(0,0,0);

	var cloisonOuest = creerCloison("cloisonOuest",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauBetonMursExterieurs}, scene);
	cloisonOuest.parent = origine;
	cloisonOuest.position = new BABYLON.Vector3(0,0,largeurMusee);

	var cloisonNord = creerCloison("cloisonNord",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauBetonMursExterieurs}, scene);
	cloisonNord.parent = origine;
	cloisonNord.position = new BABYLON.Vector3(-largeurSalle,0,largeurSalle); 
	cloisonNord.rotation.y = Math.PI/2;

	var cloisonSud = creerCloison("cloisonSud",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauBetonMursExterieurs}, scene);
	cloisonSud.parent = origine;
	cloisonSud.position = new BABYLON.Vector3(largeurSalle,0,largeurSalle);
	cloisonSud.rotation.y = Math.PI/2;

	// Création cloisons salles rez-de-chaussée
	for(var i = 0; i < 2; i++)
	{
		var cloison = creerCloison("cloisonSalles"+i, {hauteur:hauteurSalle, largeur:largeurSalle, materiau:materiauBetonMurInterieur}, scene) ; 
		cloison.parent = origine;
		cloison.position = new BABYLON.Vector3(-largeurMusee/6+largeurMusee/3*i,0,largeurMusee-largeurSalle/2) ; 
		cloison.rotation.y = Math.PI/2;
	}

	var largeurCloison = largeurMusee/10;

	var cloison = creerCloison("cloisonSalleHall0", {hauteur: hauteurSalle, largeur: largeurCloison, materiau: materiauBetonMurInterieur}, scene) ; 
	cloison.parent = origine;
	cloison.position = new BABYLON.Vector3(-largeurSalle+largeurCloison/2,0,largeurSalle);

	var cloison = creerCloison("cloisonSalleHall3", {hauteur: hauteurSalle, largeur: largeurCloison, materiau: materiauBetonMurInterieur}, scene) ; 
	cloison.parent = origine;
	cloison.position = new BABYLON.Vector3(largeurSalle-largeurCloison/2,0,largeurSalle);

	for(var i = 1; i < 3; i++)
	{
		var cloison = creerCloison("cloisonSalleHall"+i, {hauteur: hauteurSalle, largeur: 2*largeurCloison, materiau: materiauBetonMurInterieur}, scene) ; 
		cloison.parent = origine;
		cloison.position = new BABYLON.Vector3(-largeurMusee/6+largeurMusee/3*(i-1),0,largeurSalle);
	}

	// // Création de la cloison de la mezzanine
	var cloisonMezzanine = creerCloison("cloisonMezzanine",{hauteur:hauteurSalle, largeur:largeurMusee-largeurCloison, materiau:materiauBetonMurInterieur}, scene);
	cloisonMezzanine.parent = origine;
	cloisonMezzanine.position = new BABYLON.Vector3(largeurCloison/2,hauteurSalle,largeurSalle);

	/*
	var frontWall = creerCloison("cloison", {hauteur:10,largeur:30,materiau:materiauBetonMursExterieurs}, scene) ;
	frontWall.parent = origine;
	frontWall.position = new BABYLON.Vector3(0,0,0) ;

	var cl = creerCloison("cloison", {hauteur:10,largeur:30,materiau:materiauBetonMursExterieurs}, scene) ;
	cl.parent = origine;
	cl.rotation.y = Math.PI/2 ;
	cl.position = new BABYLON.Vector3(15,0,15) ;

	var cl = creerCloison("cloison", {hauteur:10,largeur:30,materiau:materiauBetonMursExterieurs}, scene) ;
	cl.parent = origine;
	cl.position = new BABYLON.Vector3(0,0,30) ;

	var cl = creerCloison("cloison", {hauteur:10,largeur:30,materiau:materiauBetonMursExterieurs}, scene) ;
	cl.parent = origine;
	cl.rotation.y = Math.PI/2 ;
	cl.position = new BABYLON.Vector3(-15,0,15) ;

	var cl = creerCloison("cloison", {hauteur:5,largeur:30,materiau:materiauBetonMurInterieur}, scene) ;
	cl.parent = origine;
	cl.position = new BABYLON.Vector3(0,0,15);
	*/

	//https://www.babylonjs-playground.com/#T6NP3F#0 EXEMPLE D'UTILISATION DE LA SOUSTRACTION DE MESH

	
	//Escalier
	var stairsPosition = new BABYLON.Vector3(-7.8, 0, largeurSalle-0.5);
	var angle = Math.PI ;
	var rayon = 4;
	var steps = 16;
	for(var i=-0; i< steps; i++){
		angle += Math.PI/(2*steps);
		var step = creerCloison("step",{hauteur:3.0,largeur:1.0,materiau:materiauRouge},scene) ;
		step.parent = origine;
		step.rotation.y = angle;
		step.position = new BABYLON.Vector3(stairsPosition.x+rayon*Math.sin(angle),stairsPosition.y + 5*i/steps+0.01, stairsPosition.z+rayon*Math.cos(angle)) ; 
		step.rotation.x = Math.PI/2 ;

		var stepJoiner = creerCloison("stepJoiner",{hauteur:3.0,largeur:5/steps,materiau:materiauSol},scene) ;
		stepJoiner.parent = origine;
		stepJoiner.position = new BABYLON.Vector3(stairsPosition.x+(rayon+3)*Math.sin(angle-Math.PI/50),stairsPosition.y+5*i/steps-0.2, stairsPosition.z+(rayon+3)*Math.cos(angle-Math.PI/50)) ;
		stepJoiner.rotation.z = -Math.PI/2 ;
		stepJoiner.rotation.y = Math.PI/2 + angle;

		var x = creerCloison("x",{hauteur:1.5,largeur:5/steps,materiau:materiauSol},scene) ;
		x.parent = origine;
		x.position = new BABYLON.Vector3(stairsPosition.x+(rayon+3)*Math.sin(angle),stairsPosition.y+ 5*i/steps+0.01, stairsPosition.z+(rayon+3)*Math.cos(angle)) ; 
		x.rotation.y = angle;

		var y = creerCloison("y",{hauteur:1.5,largeur:5/steps,materiau:materiauSol},scene) ;
		y.parent = origine;
		y.position = new BABYLON.Vector3(stairsPosition.x+(rayon)*Math.sin(angle),stairsPosition.y+5*i/steps+0.01, stairsPosition.z+(rayon)*Math.cos(angle)) ; 
		y.rotation.y = angle;
	}
	


	// Création d une sphere
	var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1.0}, scene) ; 

	sphere.material = new BABYLON.StandardMaterial("materiau1", scene) ; 
	sphere.position = new BABYLON.Vector3(-15,0,0) ;
	

}

var isLocked = false ; 

function set_FPS_mode(scene, canvas, camera){

	// On click event, request pointer lock
	scene.onPointerDown = function (evt) {

		//true/false check if we're locked, faster than checking pointerlock on each single click.
		if (!isLocked) {
			canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock || false;
			if (canvas.requestPointerLock) {
				canvas.requestPointerLock();
			}
		}

		//continue with shooting requests or whatever :P
		//evt === 0 (left mouse click)
		//evt === 1 (mouse wheel click (not scrolling))
		//evt === 2 (right mouse click)
	};

	// Event listener when the pointerlock is updated (or removed by pressing ESC for example).
	var pointerlockchange = function () {
		var controlEnabled = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || false;

		// If the user is already locked
		if (!controlEnabled) {
			camera.detachControl(canvas);
			isLocked = false;
		} else {
			camera.attachControl(canvas);
			setTimeout(() => {
				isLocked = true;
			}, 100);

		}
	};

	// Attach events to the document
	document.addEventListener("pointerlockchange", pointerlockchange, false);
	document.addEventListener("mspointerlockchange", pointerlockchange, false);
	document.addEventListener("mozpointerlockchange", pointerlockchange, false);
	document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

}

init() ;
