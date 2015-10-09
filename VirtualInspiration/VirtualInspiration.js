// VirtualInspiration - for THack
// Copyright (c) 2015 Amber Roy

VirtualInspiration =	function ( params ) {

	console.log("Creating VirtualInspiration");

	this.currentScene;
	this.sceneWidth;
	this.sceneHeight;
	this.sceneDepth;

	this.clock = new THREE.Clock();
	this.flyControls;
	this.firstPersonControls2;

	this.playerHeight = 1.83; // meters, 6 feet
};

VirtualInspiration.prototype.init = function() { 

	console.log("Initializing VirtualInspiration");

	//this.firstPersonControls2 = new THREE.FirstPersonControls2( GameManager.player, document.body, GameManager.renderer.domElement ); // YYY

	// Set initial position.
	GameManager.player.position.set( -86,  8, 105 );
	GameManager.player.rotation.set( 0,  -0.7, 0 );
    GameManager.player.updateMatrix();

	// new controls: [WASD] move, [arrows] look, [R|F] up | down, [Q|E] rotate
	// was: Fly controls: [WASD] move, [R|F] up | down, [Q|E] roll, [up|down] pitch, [left|right] yaw
	this.flyControls = new THREE.FlyControls( GameManager.player, document.body ); // YYY
	this.flyControls.movementSpeed = 10;
	this.flyControls.rollSpeed = Math.PI / 24;
	this.flyControls.autoForward = false;

	var loader = new THREE.ColladaLoader();
	loader.load('models/Tour-Eiffel.dae', this.initTourEiffel.bind( this ) );

    GameManager.scene.add( new THREE.AmbientLight( 0xcccccc ) );

	// Need light source with phong material, otherwise spheres look black.
	//var pointerOne = new THREE.PointLight(0xffffff);
	//pointerOne.position.set(-100,-90,130);
	//GameManager.scene.add(pointerOne);

	//GameManager.head.position.y = this.playerHeight; // not sure this is working
	//this._addSkybox(); // this is definitely not working
};


VirtualInspiration.prototype.initTourEiffel = function( collada ) { 

	var towerHeight = 324;  // https://en.wikipedia.org/wiki/Eiffel_Tower

	console.log("Loaded model", collada );
		
	var dae = collada.scene;

	// Make tower vertical
	dae.rotation.x = - Math.PI / 2;
    dae.updateMatrix();

    var boudingBox = new THREE.Box3().setFromObject( dae );
	var loadedHeight = Math.abs( boudingBox.max.y - boudingBox.min.y );
	console.log("loadedHeight:", loadedHeight);

	// Scaling is not working for some reason, just use loaded height of 358 meters.
	//dae.scale.x = dae.scale.y = dae.scale.z = towerHeight / loadedHeight; 
    //dae.updateMatrix();

    this.currentScene = dae;
    boudingBox = new THREE.Box3().setFromObject( dae );
	this.sceneWidth = Math.abs( boudingBox.max.x - boudingBox.min.x );
	this.sceneHeight = Math.abs( boudingBox.max.y - boudingBox.min.y );
	this.sceneDepth = Math.abs( boudingBox.max.z - boudingBox.min.z );

	console.log("scene " + 
		this.sceneWidth + " w X " +
		this.sceneHeight + " h X " +
		this.sceneDepth + " d");

    GameManager.scene.add( dae );

    // Screws up the FirstPersonControls, makes player look left.
    // TODO: Figure out how to fix.
    //GameManager.player.position.z = 100;
	//GameManager.player.updateMatrixWorld();

};


VirtualInspiration.prototype._addSkybox = function() { 

	// Also add a repeating grid as a skybox.
	var boxWidth = 10;
	var texture = THREE.ImageUtils.loadTexture(
	  'img/box.png'
	);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(boxWidth, boxWidth);

	var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
	var material = new THREE.MeshBasicMaterial({
	  map: texture,
	  color: 0x333333,
	  side: THREE.BackSide
	});

	var skybox = new THREE.Mesh(geometry, material);
	GameManager.scene.add(skybox);

};

VirtualInspiration.prototype.update = function() { 

	var delta = this.clock.getDelta();

	this.flyControls.update( delta ); // YYY

	//this.firstPersonControls2.update( delta ); // YYY
	//GameManager.player.updateMatrixWorld(); // YYY

};
