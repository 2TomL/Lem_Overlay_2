// Phaser explosie animatie uit overlay.html
var width = document.body.clientWidth * 0.5;
var height = window.innerHeight;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'explosion-canvas', { preload: preload, create: create }, true);
var sprites = [];
function preload() {
	game.load.crossOrigin = 'Anonymous';
	game.load.spritesheet('ms', 'https://jjwallace.github.io/assets/examples/images/boom.png', 256, 256, 64);
}
function create() {
	var columns = 2; // maximaal 2 kolommen, geen rechtse explosies
	var colWidth = Math.floor(width / columns);
	var marginLeft = 10; // minder naar rechts
	var marginRight = width * 0.35; // veel meer ruimte rechts
	for (var c = 0; c < columns; c++) {
		for (var i = 0; i < 2; i++) { // 2 explosies per kolom
			var minX = marginLeft;
			var maxX = width * 0.5;
			var x = random(minX, maxX);
			var minY = height * 0.4;
			var y = random(minY, height-500);
			// Verspreid in tijd: random delay tussen 0 en 1200ms
			setTimeout(function() {
				createSprite(x, y, randomRotation(), Math.floor(Math.random() * 30));
			}, random(0, 1200));
		}
	}
}
function createSprite(x, y, r, f) {
	var sprite = game.add.sprite(x, y, 'ms');
	sprite.width = 256;
	sprite.height = 256;
	sprite.angle = r;
	var anim = sprite.animations.add('boom');
	anim.frame = f;
	anim.play('boom', 60, false);
	anim.onComplete.add(function() {
		sprite.destroy();
		// Sporadisch: random delay tussen 400 en 1800ms
		setTimeout(function(){
			var minY = height * 0.4;
			createSprite(random(0, width*0.5), random(minY, height-500), randomRotation(), Math.floor(Math.random() * 30));
		}, random(400, 1800));
	}, sprite);
}
function random(min, max){
	return Math.floor((Math.random() * (max-min)) + min);
}
function randomRotation(){
	return Math.floor((Math.random() * 180) - 180);
}
// --- Verbeterde rookwolk met Three.js ---
let cam, scene, renderer,
	clock, smokeMaterial,
	h, w,
	smokeParticles = [];

function animateSmoke() {
	let delta = clock.getDelta();
	requestAnimationFrame(animateSmoke);
	for (let sp = 0; sp < smokeParticles.length; sp++) {
		smokeParticles[sp].rotation.z += delta * 0.2;
		// rook stijgt op en verspreidt zich
		smokeParticles[sp].position.y += delta * 8;
		smokeParticles[sp].position.x += (Math.random() - 0.5) * delta * 1.5;
		smokeParticles[sp].position.z += (Math.random() - 0.5) * delta * 1.5;
		// optioneel: langzaam transparanter maken
		if (smokeParticles[sp].material.opacity > 0.15) {
			smokeParticles[sp].material.opacity -= delta * 0.008;
		}
	}
	renderer.render(scene, cam);
}

function initSmoke() {
	h = window.innerHeight;
	w = window.innerWidth;
	clock = new THREE.Clock();
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor(0x000000, 0); // transparant
	renderer.setSize(w, h);
	scene = new THREE.Scene();
	const light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(-1, 0, 1);
	scene.add(light);
	cam = new THREE.PerspectiveCamera(75, w / h, 1, 10000);
	cam.position.z = 1000;
	scene.add(cam);
	// Gebruik Smoke-Element.png zoals het voorbeeld
	const loader = new THREE.TextureLoader();
	loader.crossOrigin = '';
	loader.load(
		'https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png',
		function onLoad(texture) {
			const smokeGeo = new THREE.PlaneGeometry(300, 300);
			smokeMaterial = new THREE.MeshLambertMaterial({
				color: 0x888888,
				map: texture,
				transparent: true,
				opacity: 0.8,
				blending: THREE.NormalBlending
			});
			// Positioneer rook links van de auto
			const smokeOrigin = { x: -400, y: -200, z: 0 };
			for (let p = 0; p < 150; p++) {
				// De onderste rook krijgt een beetje oranje
				let isBottom = p < 20; // eerste 20 deeltjes zijn onderaan
				let mat = isBottom
					? new THREE.MeshLambertMaterial({
						color: 0xcc6600, // oranje tint
						map: texture,
						transparent: true,
						opacity: 0.8,
						blending: THREE.NormalBlending
					})
					: smokeMaterial;
				var particle = new THREE.Mesh(smokeGeo, mat);
				particle.position.set(
					Math.random() * (window.innerWidth / 2) - window.innerWidth / 2 - 200, // nog verder naar links
					Math.random() * 500 + 320 - 250, // nog hoger
					Math.random() * 600 + 200 // z: dichterbij camera
				);
				particle.rotation.z = Math.random() * 360;
				scene.add(particle);
				smokeParticles.push(particle);
			}
			animateSmoke();
		}
	);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.left = '0';
	renderer.domElement.style.top = '0';
	renderer.domElement.style.zIndex = '100';
	renderer.domElement.style.pointerEvents = 'none';
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

initSmoke();
