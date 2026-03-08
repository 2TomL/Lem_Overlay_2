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
	sprite.width = 500;
	sprite.height = 500;
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
