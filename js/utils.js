function attachSound(scene, obj){
	let mesh = scene.getMeshByName(obj.name);

	if (obj.nom_seq_classic !== null) {
		mesh.metadata.seq_classic = getSeqByName(obj.name_seq_classic)
	}

	if (obj.nom_seq_focus !== null) {
		mesh.metadata.seq_focus = getSeqByName(obj.name_seq_focus)
	}

	if (obj.nom_seq_nimbus !== null) {
		mesh.metadata.seq_nimbus = getSeqByName(obj.name_seq_nimbus)
	}

	if (obj.nom_seq_click !== null) {
		mesh.metadata.seq_click = getSeqByName(obj.name_seq_click)
	}
}

function getSeqByName(name){
	return sequences[name];
}

function allSoundReady(){
	for (var i = 0; i < sounds.length; i++) {
		if (!sounds[i].isReady()){
			return false;
		}
	}
	return true;
}


function playSeq(mesh, type) {
	if(mesh.metadata !== null && mesh.metadata.hasOwnProperty(type) && mesh.metadata[type] !== undefined && !mesh.metadata[type].isPlaying()){
		mesh.metadata[type].play(type.split("_")[1] )
	}else if (mesh.parent !== null && mesh.parent.metadata !== null && mesh.parent.metadata.hasOwnProperty(type) && mesh.parent.metadata[type] !== undefined  && !mesh.parent.metadata[type].isPlaying()) {
		mesh.parent.metadata[type].play(type.split("_")[1] )
	}
}

function playclassicSound(){
	let meshs = scene.meshes
	for (var i in meshs) {
		playSeq(meshs[i], "seq_classic");
	}
}
