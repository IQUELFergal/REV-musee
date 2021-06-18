
var canvas, engine ;
var scene, camera ;
var timeSpendOnFocusObject = 0;
var focusObject;
const focusTime = 3000;
var reticle;

function init()
{
	canvas = document.getElementById("renderCanvas");
	engine = new BABYLON.Engine(canvas,true);
	scene  = creerScene();
	camera = creerCamera("camera",{}, scene);

	// Musique fond
	var son = new BABYLON.Sound("son", "assets/musiques/piano.mp3", scene, null, {loop: true, autoPlay: true});
	son.setVolume(1);

	createLights();
	peuplerScene();

	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

	reticle = new BABYLON.GUI.Ellipse();
	reticle.width = "10px";
	reticle.height = "10px";
	reticle.color = "red";
	reticle.thickness = 1;
	reticle.background = "red";
	advancedTexture.addControl(reticle);

	set_FPS_mode(scene, canvas,camera);

	window.addEventListener("resize", function()
	{
		let dt = engine.getDeltaTime();
		engine.resize();
	});

	engine.runRenderLoop(function(){scene.render();});
}

function createLights()
{
	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(5,5,5), scene);
}

function peuplerScene()
{
	// Dimensions musée
	var hauteurMusee = 10.0;
	var hauteurSalle = hauteurMusee/2;

	var largeurMusee = 30.0;
	var largeurSalle = largeurMusee/2;

	var materiauSolInterieur = creerMateriauSimple("materiauSolInterieur",{texture:"assets/textures/solCarrelage.jpg"}, scene);
	var materiauCloisonInterieur = new BABYLON.StandardMaterial("blanc",scene);
	var materiauCloisonExterieur = creerMateriauSimple("materiauCloisonExterieur",{texture:"assets/textures/murs.jpg"}, scene);
	var materiauMarche = creerMateriauSimple("materiauMarche",{texture:"assets/textures/parquet.jpg"}, scene);

	// Création des sols 
	var solExterieur = creerSol("solExterieur",{},scene);

	var solRDC = creerCloison("solRDC", {hauteur:largeurMusee, largeur:largeurMusee, materiau:materiauSolInterieur}, scene) 
	solRDC.position = new BABYLON.Vector3(0,0.001,-largeurSalle);
	solRDC.rotation.x = Math.PI/2;

	var solEtage = creerCloison("solEtage", {hauteur:largeurMusee, largeur:largeurSalle, materiau:materiauSolInterieur}, scene) 
	solEtage.position = new BABYLON.Vector3(-largeurSalle/2,hauteurSalle,-largeurSalle);
	solEtage.rotation.x = Math.PI/2;

	//var solInterieur = creerSol("solInterieur", {largeur:30, profondeur:30, materiau:materiauSolInterieur}, scene) 
	//solInterieur.position = = new BABYLON.Vector3(0,0.01,0); 

	// Création des cloisons du musée

	var cloisonEst = creerCloison("cloisonEst",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauCloisonExterieur}, scene);
	cloisonEst.position = new BABYLON.Vector3(0,0,largeurSalle);

	var cloisonOuest = creerCloison("cloisonOuest",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauCloisonExterieur}, scene);
	cloisonOuest.position = new BABYLON.Vector3(0,0,-largeurSalle);

	var cloisonNord = creerCloison("cloisonNord",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauCloisonExterieur}, scene);
	cloisonNord.position = new BABYLON.Vector3(-largeurSalle,0,0); 
	cloisonNord.rotation.y = Math.PI/2;

	var cloisonSud = creerCloison("cloisonSud",{hauteur:hauteurMusee, largeur:largeurMusee, materiau:materiauCloisonExterieur}, scene);
	cloisonSud.position = new BABYLON.Vector3(largeurSalle,0,0);
	cloisonSud.rotation.y = Math.PI/2;

	// Création cloisons salles rez-de-chaussée
	var cloisonsSalles = [];
	for(var i = 0; i < 2; i++)
	{
		var cloison = creerCloison("cloisonSalles"+i, {hauteur:hauteurSalle, largeur:largeurSalle, materiau:materiauCloisonInterieur}, scene) ; 
		cloison.position = new BABYLON.Vector3(-largeurSalle/2,0,-largeurMusee/6+largeurMusee/3*i) ; 
		cloisonsSalles.push(cloison);
	}

	var largeurCloison = largeurMusee/10;
	var cloisonsSallesHall = [];

	var cloison = creerCloison("cloisonSallesHall0", {hauteur: hauteurSalle, largeur: largeurCloison, materiau: materiauCloisonInterieur}, scene) ; 
	cloison.position = new BABYLON.Vector3(0,0,-largeurSalle+largeurCloison/2);
	cloison.rotation.y = Math.PI/2;
	cloisonsSallesHall.push(cloison);

	for(var i = 1; i < 3; i++)
	{
		var cloison = creerCloison("cloisonSallesHall"+i, {hauteur: hauteurSalle, largeur: 2*largeurCloison, materiau: materiauCloisonInterieur}, scene) ; 
		cloison.position = new BABYLON.Vector3(0,0,-largeurMusee/6+largeurMusee/3*(i-1));
		cloison.rotation.y = Math.PI/2;
		cloisonsSallesHall.push(cloison);
	}

	var cloison = creerCloison("cloisonSallesHall3", {hauteur: hauteurSalle, largeur: largeurCloison, materiau: materiauCloisonInterieur}, scene) ; 
	cloison.position = new BABYLON.Vector3(0,0,largeurSalle-largeurCloison/2);
	cloison.rotation.y = Math.PI/2;
	cloisonsSallesHall.push(cloison);

	//Création des escaliers
	var largeurMarche = 1;
	var longueurMarche = largeurCloison;
	for(var i = 0; i < 11; i++)
	{
		var marche = creerCloison("marche"+i, {hauteur: longueurMarche, largeur: largeurMarche, materiau: materiauMarche}, scene);
		marche.position = new BABYLON.Vector3(largeurMarche/2+2*largeurMarche/3*i,hauteurSalle-hauteurSalle/10*i,-largeurMusee/2);
		marche.rotation.x = Math.PI/2;
	}

	// Création de la cloison de la mezzanine
	var cloisonMezzanine = creerCloison("cloisonMezzanine",{hauteur:hauteurSalle, largeur:largeurMusee-largeurCloison, materiau:materiauCloisonInterieur}, scene);
	cloisonMezzanine.position = new BABYLON.Vector3(0,hauteurSalle,largeurCloison/2);
	cloisonMezzanine.rotation.y = Math.PI/2;

	// Création des tableaux
	var tableaux = [];

	var berthe = creerPoster("tableauBerthe",{tableau:"assets/tableaux/Berthe.jpg"},scene);
	berthe.parent = cloisonSud; // On accroche le tableau à la cloison
	berthe.position.z = -0.1;
	berthe.position.y = 1.7;

	var joconde = creerPoster("tableauJoconde",{tableau:"assets/tableaux/joconde.png"},scene);
	joconde.parent = cloisonsSalles[0]; // On accroche le tableau à la cloison
	joconde.position.z = -0.1;
	joconde.position.y = 1.7;
	joconde.position.x = largeurSalle/4;

	var cri = creerPoster("tableauCri",{tableau:"assets/tableaux/cri.jpg"},scene);
	cri.parent = cloisonsSalles[0]; // On accroche le tableau à la cloison
	cri.position.z = -0.1;
	cri.position.y = 1.7;
	cri.position.x = -largeurSalle/4;

	tableaux.push(berthe, joconde, cri);

	// Création des photos
	var photos = [];

	var monroe = creerPoster("photoMonroe",{tableau:"assets/photos/monroe.jpg"},scene);
	monroe.parent = cloisonNord; // On accroche le tableau à la cloison
	monroe.rotation.y = Math.PI;
	monroe.position.z = 0.1;
	monroe.position.y = hauteurSalle + 1.7;
	monroe.position.x = 2*largeurMusee/5;

	var ali = creerPoster("photoAli",{tableau:"assets/photos/ali.jpg"},scene);
	ali.parent = cloisonNord; // On accroche le tableau à la cloison
	ali.rotation.y = Math.PI;
	ali.position.z = 0.1;
	ali.position.y = hauteurSalle + 1.7;
	ali.position.x = largeurMusee/5;

	var beattles = creerPoster("photoBeattles",{tableau:"assets/photos/beattles.jpg"},scene);
	beattles.parent = cloisonNord; // On accroche le tableau à la cloison
	beattles.rotation.y = Math.PI;
	beattles.position.z = 0.1;
	beattles.position.y = hauteurSalle + 1.7;

	var jordan = creerPoster("photoJordan",{tableau:"assets/photos/jordan.jpg"},scene);
	jordan.parent = cloisonNord; // On accroche le tableau à la cloison
	jordan.rotation.y = Math.PI;
	jordan.position.z = 0.1;
	jordan.position.y = hauteurSalle + 1.7;
	jordan.position.x = -largeurMusee/5;

	var dali = creerPoster("photoDali",{tableau:"assets/photos/dali.jpg"},scene);
	dali.parent = cloisonNord; // On accroche le tableau à la cloison
	dali.rotation.y = Math.PI;
	dali.position.z = 0.1;
	dali.position.y = hauteurSalle + 1.7;
	dali.position.x = -2*largeurMusee/5;

	var girl = creerPoster("photoAfghanGirl",{tableau:"assets/photos/girl.jpg"},scene);
	girl.parent = cloisonMezzanine; // On accroche le tableau à la cloison
	girl.position.z = -0.1;
	girl.position.y = 1.7;
	girl.position.x = -largeurMusee/4;

	var marathon = creerPoster("photoMarathon",{tableau:"assets/photos/marathon.jpg"},scene);
	marathon.parent = cloisonMezzanine; // On accroche le tableau à la cloison
	marathon.position.z = -0.1;
	marathon.position.y = 1.7;

	var kiss = creerPoster("photoKiss",{tableau:"assets/photos/kiss.jpg"},scene);
	kiss.parent = cloisonMezzanine; // On accroche le tableau à la cloison
	kiss.position.z = -0.1;
	kiss.position.y = 1.7;
	kiss.position.x = largeurMusee/4;

	var workers = creerPoster("photoWorkers",{tableau:"assets/photos/workers.jpg"},scene);
	workers.parent = cloisonOuest; // On accroche le tableau à la cloison
	workers.rotation.y = Math.PI;
	workers.position.z = 0.1;
	workers.position.y = hauteurSalle + 1.7;
	workers.position.x = -largeurSalle/3;

	var earth = creerPoster("photoTerre",{tableau:"assets/photos/earth.jpg"},scene);
	earth.parent = cloisonOuest; // On accroche le tableau à la cloison
	earth.rotation.y = Math.PI;
	earth.position.z = 0.1;
	earth.position.y = hauteurSalle + 1.7;
	earth.position.x = -2*largeurSalle/3;

	var power = creerPoster("photoPower",{tableau:"assets/photos/power.jpg"},scene);
	power.parent = cloisonEst; // On accroche le tableau à la cloison
	power.position.z = -0.1;
	power.position.y = hauteurSalle + 1.7;
	power.position.x = -2*largeurSalle/3;

	var marin = creerPoster("photoMarin",{tableau:"assets/photos/marin.jpg"},scene);
	marin.parent = cloisonEst; // On accroche le tableau à la cloison
	marin.position.z = -0.1;
	marin.position.y = hauteurSalle + 1.7;
	marin.position.x = -largeurSalle/3;

	photos.push(monroe, ali, jordan, beattles, dali, girl, marathon, kiss, workers, earth, power, marin);
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
