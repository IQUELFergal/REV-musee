

function creerScene(){
	var scn = new BABYLON.Scene(engine) ; 
	scn.enablePhysics();
	scn.gravity = new BABYLON.Vector3(0, -0.1, 0);
	scn.collisionsEnabled = true;
	return scn ;
}


function creerCamera(name,options,scn){
	// console.log("creation camera");
	// Création de la caméra
	// =====================

	camera = new BABYLON.UniversalCamera(name,new BABYLON.Vector3(10,1.7,5),scn) ;
	camera.setTarget(new BABYLON.Vector3(0.0,0.7,0.0)) ; 

	camera.keysUp = [90,38];
	camera.keysDown = [40,83];
	camera.keysLeft = [81,37];
	camera.keysRight = [68,39];
	camera.attachControl(canvas) ;
	camera.inertia = 0.01;
	camera.angularSensibility  = 1000;
	camera.applyGravity = true;
	camera.checkCollisions = true;
	camera.ellipsoid = new BABYLON.Vector3(1, 0.7, 1);

	camera.attachControl(canvas, false) ; 

	return camera
}

function creerSol(name,options,scn){
	let larg     = options.largeur || 300 ;   
	let prof     = options.profondeur || larg ;   
	let materiau = options.materiau || new BABYLON.StandardMaterial("blanc",scene) ;

	let sol = BABYLON.Mesh.CreateGround(name,larg,prof,2.0,scn) ;

	sol.material = materiau ;
	// sol.material.diffuseColor  = new BABYLON.Color3(1.0,0,0) ;
	sol.material.diffuseTexture = new BABYLON.Texture('./assets/textures/grass.png',scene);
	sol.material.specularTexture = new BABYLON.Texture('./assets/textures/grass.png',scene);
	sol.material.emissiveTexture = new BABYLON.Texture('./assets/textures/grass.png',scene);
	sol.material.ambientTexture = new BABYLON.Texture('./assets/textures/grass.png',scene);
	sol.material.diffuseTexture.uScale = 10.0;
	sol.material.diffuseTexture.vScale = 10.0;
	sol.material.specularTexture.uScale = 10.0;
	sol.material.specularTexture.vScale = 10.0;
	sol.material.emissiveTexture.uScale = 10.0;
	sol.material.emissiveTexture.vScale = 10.0;
	sol.material.ambientTexture.uScale = 10.0;
	sol.material.ambientTexture.vScale = 10.0;
	sol.receiveShadows = true;
	sol.metadata = {"type": 'ground'}
	return sol
}

function creerMateriauSimple(nom,options,scn){
	let couleur = options.couleur || null ; 
	let texture = options.texture || null ; 
	let uScale  = options.uScale  || 1.0 ; 
	let vScale  = options.vScale  || 1.0 ; 

	let materiau = new BABYLON.StandardMaterial(nom,scn) ; 
	if(couleur != null) materiau.diffuseColor = couleur ; 
	if(texture!= null){
		materiau.diffuseTexture = new BABYLON.Texture(texture,scn) ; 
		materiau.diffuseTexture.uScale = uScale ; 
		materiau.diffuseTexture.vScale = vScale ; 
	}
	return materiau ; 
}

function creerPorte(nom,opts,scn){

	let options  = opts || {} ;
	let hauteur = options.hauteur || 1.0 ; 
	let largeur = options.largeur || 1.0 ;
	let epaisseur = options.epaisseur || 0.1 ;

	var group = new BABYLON.TransformNode("group-"+nom);
	let materiau   = options.materiau || new BABYLON.StandardMaterial("materiau-pos"+nom,scn);

	var materiauInvisible = new BABYLON.StandardMaterial("invisible",scene) ;
	materiauInvisible.alpha = 0.5 ;

	var encadrure = new BABYLON.TransformNode("encadrure-"+nom);
	encadrure.parent = group;
	let encadrureG = BABYLON.MeshBuilder.CreateBox(nom+"encadrureG",{width:epaisseur*2,height:hauteur,depth:epaisseur*2},scn) ;
	encadrureG.material = materiau ;
	encadrureG.parent = encadrure;
	encadrureG.checkCollisions = true ;
	encadrureG.position.y = hauteur / 2.0 ;
	encadrureG.position.x = -largeur / 2 ;
	let encadrureH = BABYLON.MeshBuilder.CreateBox(nom+"encadrureH",{width:largeur+epaisseur*2,height:0.2,depth:epaisseur*2},scn) ;
	encadrureH.material = materiau ;
	encadrureH.parent = encadrure;
	encadrureH.checkCollisions = true ;
	encadrureH.position.y = hauteur + epaisseur ;
	let encadrureD = BABYLON.MeshBuilder.CreateBox(nom+"encadrureD",{width:epaisseur*2,height:hauteur,depth:epaisseur*2},scn) ;
	encadrureD.material = materiau ;
	encadrureD.parent = encadrure;
	encadrureD.checkCollisions = true ;
	encadrureD.position.y = hauteur / 2.0 ;
	encadrureD.position.x = largeur / 2 ;
	

	let porteG = BABYLON.MeshBuilder.CreateBox(nom+"porteD",{width:largeur/2,height:hauteur,depth:epaisseur},scn) ;
	porteG.material = materiau ;
	porteG.parent = group;
	porteG.checkCollisions = true ;
	porteG.position.x = -largeur / 4.0 ;
	porteG.position.y = hauteur / 2.0 ;

	let porteD = BABYLON.MeshBuilder.CreateBox(nom+"porteG",{width:largeur/2,height:hauteur,depth:epaisseur},scn) ;
	porteD.material = materiau ;
	porteD.parent = group;
	porteD.checkCollisions = true ;
	porteD.position.x = largeur / 4.0 ;
	porteD.position.y = hauteur / 2.0 ;

	const capteurPorte = BABYLON.MeshBuilder.CreateBox("capteur-porte",{width:largeur,height:hauteur,depth:largeur},scene) ;
	capteurPorte.parent = group;
	capteurPorte.position.y = hauteur / 2.0 ;
	capteurPorte.material = materiauInvisible ;


	return group;
}


function creerTeleporteur(nom,opts,scn){

	let options  = opts || {} ; 
	let diametre = options.diametre || 1.0 ; 

	let sph = BABYLON.MeshBuilder.CreateSphere(nom, {diameter:diametre},scn) ;
	sph.material              = new BABYLON.StandardMaterial("blanc",scene) ;
	sph.material.diffuseColor  = new BABYLON.Color3(1.0,1.0,1.0) ;


	sph.metadata = {"type": 'teleporter'}
	return sph;

}


function creerSphere(nom,opts,scn){

	let options  = opts || {} ; 
	let diametre = options.diametre || 1.0 ; 

	let sph = BABYLON.Mesh.CreateSphere(nom,diametre,1,scn) ;
	sph.material              = new BABYLON.StandardMaterial("blanc",scene) ;
	sph.material.diffuseColor  = new BABYLON.Color3(1.0,1.0,1.0) ;


	sph.metadata = {"type": 'sphere'}
	return sph;

}

function creerPoster(nom,opts,scn){

	let options = opts || {} ; 
	let hauteur = options["hauteur"] || 1.0 ; 
	let largeur = options["largeur"] || 1.0 ; 	
	let textureName = options["tableau"] || ""; 

	var group = new BABYLON.TransformNode("group-"+nom)
	var tableau1 = BABYLON.MeshBuilder.CreatePlane("tableau-" + nom, {width:largeur,height:hauteur}, scn);
	tableau1.parent = group ; 
	tableau1.position.y = hauteur/2.0 ; 

	var mat = new BABYLON.StandardMaterial("tex-tableau-" + nom, scn);
	mat.diffuseTexture = new BABYLON.Texture(textureName, scn);
	tableau1.material = mat;



	return group ; 

}

function creerCloison(nom,opts,scn){
	
	let options   = opts || {} ; 
	let hauteur   = options.hauteur || 3.0 ; 
	let largeur   = options.largeur || 5.0 ; 
	let epaisseur = options.epaisseur || 0.1 ;

	let materiau   = options.materiau || new BABYLON.StandardMaterial("materiau-pos"+nom,scn); 

    	let groupe = new BABYLON.TransformNode("groupe-"+nom) ; 

	let cloison = BABYLON.MeshBuilder.CreateBox(nom,{width:largeur,height:hauteur,depth:epaisseur},scn) ;
	cloison.material = materiau ; 
	cloison.parent = groupe ; 
	cloison.position.y = hauteur / 2.0 ; 

	cloison.checkCollisions = true;


    return groupe ;  
}

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

// function attachSound(scene, obj){
// 	let mesh = scene.getMeshByName(obj.name);

// 	if (obj.nom_seq_classic !== null) {
// 		mesh.metadata.seq_classic = getSeqByName(obj.name_seq_classic)
// 	}

// 	if (obj.nom_seq_focus !== null) {
// 		mesh.metadata.seq_focus = getSeqByName(obj.name_seq_focus)
// 	}

// 	if (obj.nom_seq_nimbus !== null) {
// 		mesh.metadata.seq_nimbus = getSeqByName(obj.name_seq_nimbus)
// 	}

// 	if (obj.nom_seq_click !== null) {
// 		mesh.metadata.seq_click = getSeqByName(obj.name_seq_click)
// 	}
// }

// function getSeqByName(name){
// 	return sequences[name];
// }

// function allSoundsReady(){
// 	for (var i = 0; i < sounds.length; i++) {
// 		if (!sounds[i].isReady()){
// 			return false;
// 		}
// 	}
// 	return true;
// }


// function playSeq(mesh, type) {
// 	if(mesh.metadata !== null && mesh.metadata.hasOwnProperty(type) && mesh.metadata[type] !== undefined && !mesh.metadata[type].isPlaying()){
// 		mesh.metadata[type].play(type.split("_")[1] )
// 	}else if (mesh.parent !== null && mesh.parent.metadata !== null && mesh.parent.metadata.hasOwnProperty(type) && mesh.parent.metadata[type] !== undefined  && !mesh.parent.metadata[type].isPlaying()) {
// 		mesh.parent.metadata[type].play(type.split("_")[1] )
// 	}
// }

// function playClassicSound(){
// 	let meshs = scene.meshes
// 	for (var i in meshs) {
// 		playSeq(meshs[i], "seq_classic");
// 	}
// }