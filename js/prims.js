function createReticle()
{
	reticle = new BABYLON.GUI.Ellipse();
	reticle.width = "10px";
	reticle.height = "10px";
	reticle.color = "red";
	reticle.thickness = 1;
	reticle.background = "red";

	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	advancedTexture.addControl(reticle);

	return reticle;
}

function updateReticle(reticle) {
	var pickResult = scene.pick(window.innerWidth/2, window.innerHeight/2);
	if (pickResult.hit && pickResult.distance < 4) {
		let mesh = pickResult.pickedMesh;
		if (mesh.nom === "poster"){
			reticle.color = "Green";
			reticle.background = "Green";
		} else {
			reticle.color = "red"
			reticle.background = "red";
		}
	} else {
		reticle.color = "red";
		reticle.background = "red";
	}
	return reticle;
}

function creerScene(){
	var scn = new BABYLON.Scene(engine);
	scn.enablePhysics();
	// scn.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scn.gravity = new BABYLON.Vector3(0, -0.1, 0);
	scn.collisionsEnabled = true;
	return scn ;
}


function creerCamera(name,options,scn)
{
	// console.log("creation camera");
	// Création de la caméra
	// =====================

	camera = new BABYLON.UniversalCamera(name,new BABYLON.Vector3(10,1.7,5),scn) ;
	camera.setTarget(new BABYLON.Vector3(0.0,0.7,0.0));

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

function creerSol(name,options,scn)
{
	let larg = options.largeur || 300;   
	let prof = options.profondeur || larg;   
	let materiau = options.materiau || new BABYLON.StandardMaterial("blanc",scene) ;

	let sol = BABYLON.Mesh.CreateGround(name,larg,prof,2.0,scn);

	sol.material = materiau;
	sol.metadata = {"type": 'ground'}

	// Mettre de l'herbe si le materiau n'a pas été défini
	if (options.materiau == null)
	{
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
	}

	return sol
}

function creerMateriauSimple(nom,options,scn){
	let couleur = options.couleur || null ; 
	let texture = options.texture || null ; 
	let uScale  = options.uScale  || 1.0 ; 
	let vScale  = options.vScale  || 1.0 ; 

	let materiau = new BABYLON.StandardMaterial(nom,scn);

	if(couleur != null) materiau.diffuseColor = couleur ; 
	if(texture!= null){
		materiau.diffuseTexture = new BABYLON.Texture(texture,scn) ; 
		materiau.diffuseTexture.uScale = uScale ; 
		materiau.diffuseTexture.vScale = vScale ; 
	}
	return materiau ; 
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
	var poster = BABYLON.MeshBuilder.CreatePlane("poster-" + nom, {width:largeur,height:hauteur}, scn);
	poster.parent = group ; 
	poster.position.y = hauteur/2.0 ;
	poster.nom = "poster";

	var mat = new BABYLON.StandardMaterial("tex-tableau-" + nom, scn);
	mat.diffuseTexture = new BABYLON.Texture(textureName, scn);
	poster.material = mat;

	return group ; 

}

function creerCloison(nom,opts,scn)
{
	let options = opts || {}; 
	let hauteur = options.hauteur || 3.0; 
	let largeur = options.largeur || 5.0; 
	let epaisseur = options.epaisseur || 0.1;
	let materiau = options.materiau || new BABYLON.StandardMaterial("materiau-pos" + nom, scn); 
	let groupe = new BABYLON.TransformNode("groupe-" + nom); 

	let cloison = BABYLON.MeshBuilder.CreateBox(nom,{width:largeur,height:hauteur,depth:epaisseur},scn);
	cloison.material = materiau;
	cloison.parent = groupe;
	cloison.position.y = hauteur / 2.0;
	cloison.checkCollisions = true;
	// cloison.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 5, restitution: 0 });

    return groupe;  
}

function set_FPS_mode(scene, canvas, camera)
{
	// On click event, request pointer lock
	scene.onPointerDown = function (evt)
	{
		//true/false check if we're locked, faster than checking pointerlock on each single click.
		if (!isLocked)
		{
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
