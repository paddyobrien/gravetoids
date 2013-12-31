
var Game = (function() {
	var Game = {};
	var canvas;
	var ctx;
	var level;
	var keysdown = {
		left: false,
		right: false,
		up: false,
		down: false
	};

	var gravityMap;

	var counters = {
		thrust: 0,
		speed: 0
	};

	var waypoints;
	var ship;
	var planets = [];
	var i = 1;

	var logicLoop;
	var drawLoop;

	Game.init = function init(map) {
		level = map.levels.shift();
		ship = new Ship(map.ship);
		ship.loadImage();
		
		// attach key listeners
		document.addEventListener('keydown', keydownhandler);
		document.addEventListener('keyup', keyuphandler);
		// get the canvas
		canvas = document.getElementById('game');
		// set up the context
		ctx = canvas.getContext('2d');
		// scale to full window
		scaleCanvas();
		loadLevel(level);
		// set the frame handler to fire at 60fps
		logicLoop = setInterval(updateWorld, 1000/60);
		drawLoop = setInterval(draw, 1000/30);
	};
	Game.getWidth = function() {
		return canvas.width;
	};
	Game.getHeight = function() {
		return canvas.height;
	};
	var restart = function() {
		clearInterval(logicLoop);
		clearInterval(drawLoop);
		ship = new Ship(level.ship);
		ship.loadImage();
		waypoints = level.waypoints.slice(0);
		logicLoop = setInterval(updateWorld, 1000/60);
		drawLoop = setInterval(draw, 1000/30);
	};

	var loadLevel = function(level) {
		waypoints = level.waypoints.slice(0);
		// create the planets
		level.planets.forEach(createPlanet);
		// draw gravity overlay and store in
		drawGrav(ctx);
		// clear the screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	var stop = function(msg) {
			ctx.font = "bold 40px sans-serif";
			ctx.fillText(msg , (canvas.width/2) - 40, canvas.height/2);
			clearInterval(logicLoop);
			clearInterval(drawLoop);
	};

	var createPlanet = function(e, i, a) {
		planets.push(
			new Planet(e.location.x, e.location.y, e.radius, e.mass, e.image)
		);
	};

	var updateWorld = function() {
		var gravity = {m: 0, d: 0};
		for (var i = 0; i < planets.length; i++) {
			gravity = addVectors(
				gravity,
				planets[i].calculateGravity(ship.location, ship.mass)
			);
		}
		// calculate the ships own thrust thrust
		ship.doThrust(keysdown);
		// apply the force of gravity
		if (ship.launched === true) {
			ship.applyForce(gravity);
		}
		// figure out what position the ship should be in for this frame
		ship.move();
		calculateCounters(ship, gravity);
		calculateWaypoint(ship);
		if (ship.fuel <= 0) {
			stop("Out of fuel! Press r to try again.");
		}
		if (gravity.m > 10) {
			stop("Stuck! Press r to try again.");
		}
	};

	// draw a frame
	var draw = function() {
		var offset = calculateViewOffset(ship);
		// clear the screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//ctx.putImageData(gravityMap, offset.x * -1, offset.y * - 1);
		// draw the planet
		planets.forEach(function(planet) {
			planet.drawimage(ctx, offset);
		});
		// draw the ship
		ship.drawimage(ctx, offset);
		var future = peek();
		while (future.length > 0)
		{
			var point = future.shift();
			ctx.fillStyle = "red";
			ctx.fillRect(point.x - offset.x, point.y - offset.y, 1, 1);
		}
		drawCounters(ship);
		drawWaypoint(offset);
	};

	var peek = function() {
		if (!ship.launched) return [];
		var oldVel = {}, oldLoc = {};
		oldVel.m = ship.velocity.m;
		oldVel.d = ship.velocity.d;
		oldLoc.x = ship.location.x;
		oldLoc.y = ship.location.y;
		var futureCoords = [];
			console.log(oldVel);
		for (var j = 0; j < 1000; j++)
		{
			var gravity = {m: 0, d: 0};
			for (var i = 0; i < planets.length; i++) {
				gravity = addVectors(
					gravity,
					planets[i].calculateGravity(ship.location, ship.mass)
				);
			}
			ship.applyForce(gravity);
			ship.move();
			futureCoords.push({x: ship.location.x, y: ship.location.y});
		}
		ship.location.x = oldLoc.x;
		ship.location.y = oldLoc.y;
		ship.velocity.m = oldVel.m;
		ship.velocity.d = oldVel.d;
		return futureCoords;
	};

	var calculateViewOffset = function(ship) {
		return {x: ship.location.x - Game.getWidth() / 2, y: ship.location.y - Game.getHeight() / 2};
	};

	var drawGrav = function(ctx) {
		var i, j, k, alpha = 70, gravity, hex, block = 4,
			x = canvas.width/block,
			y = canvas.height/block;
		// for each row in the canvas
		for (i = 0; i < x ; i++ ) {
			// for each column
			for (j = 0; j < y; j++) {
				// initialise gravity for this pixel
				gravity = {m: 0, d: 0};
				// calculate the gravity exerted by each planet
				for (k = 0; k < planets.length; k++) {
					gravity = addVectors(
						gravity,
						planets[k].calculateGravity({x: i * block, y: j * block}, ship.mass)
					);
				}
				hex = gravity.m * 10000;
				hex = Math.abs(Math.round(hex));
				hex = 255 - hex;
				ctx.fillStyle = "rgba("+hex+","+hex+","+hex+","+alpha/255+")";
				ctx.fillRect( i * block, j * block, block, block );
			}
		}
		gravityMap = ctx.getImageData(0, 0, canvas.width, canvas.height);
	};


	var calculateCounters = function(ship) {
		counters.thrust = Math.round(Math.abs(ship.thrust.m) * 1000);
		counters.speed = Math.round(Math.abs(ship.velocity.m) * 100);
		counters.fuel = Math.round(Math.abs(ship.fuel) * 100);
		counters.bearing = Math.round(ship.bearing);
		counters.bearingrad = ship.bearing * (180/Math.PI);
		if(counters.fuel < 10) {
			counters.fuel = 0;
		}
	};

	var drawCounters = function() {
		ctx.fillStyle = "white";
		ctx.fillRect(canvas.width - 80, 0, 80, 127 );
		ctx.fillStyle = "green";
		ctx.font = "bold 18px sans-serif";
		ctx.textAlign = 'center';
		ctx.fillText("Fuel" , canvas.width - 40, 20);
		ctx.fillText("Thrust", canvas.width - 40, 60);
		ctx.fillText("Speed", canvas.width - 40, 100);
		ctx.fillText(counters.speed, canvas.width - 35, 117);
		ctx.fillText(counters.thrust, canvas.width - 35, 77);
		if(counters.fuel < 100) {
			ctx.fillStyle = "red";
		} else if (counters.fuel < 200) {
			ctx.fillStyle = "orange";
		}
		ctx.fillText(counters.fuel , canvas.width - 35, 37);
		ctx.textAlign = 'left';
	};

	var drawWaypoint = function(offset) {
		var xpos = waypoints[0].x - offset.x;
		var ypos = waypoints[0].y - offset.y;
		xpos = (xpos >= 0) ? xpos : 10;
		xpos = (xpos <= Game.getWidth()) ? xpos : Game.getWidth() - 10;
		ypos = (ypos >= 0) ? ypos : 10;
		ypos = (ypos <= Game.getHeight()) ? ypos : Game.getHeight() - 10;
		ctx.fillStyle = "white";
		ctx.fillRect( xpos - 4, ypos - 15, 19, 20 );
		ctx.font = "bold 16px sans-serif";
		ctx.fillStyle = 'green';
		var number = waypoints.length;
		if (number === 0) {
			number = 1;
		}
		ctx.fillText(number.toString(), xpos, ypos);
	};

	var calculateWaypoint = function(ship) {
		var waypoint = waypoints[0];
		if ((Math.abs(waypoint.x - ship.location.x) < 20) && (Math.abs(waypoint.y - ship.location.y) < 20)){
			ship.fuel += waypoint.fuel;
			waypoints.shift();
			if(waypoints.length === 0) {
				document.addEventListener('keyup', keyuphandler);
				stop("You Win. Press n for next level");
			}
		}
	};

	// registers keys as down, actual interaction happens during the frame
	var keydownhandler = function(e) {
		if (e.keyCode === 39) keysdown.right = true;
		if (e.keyCode === 37) keysdown.left = true;
		if (e.keyCode === 38) keysdown.up = true;
		if (e.keyCode === 40) keysdown.down = true;
		if (e.keyCode === 82) restart();
	};
	// registers keys as not down, actual interaction happens during the frame
	var keyuphandler = function(e) {
		console.log(e.keyCode);
		if (e.keyCode == 39) keysdown.right = false;
		if (e.keyCode == 37) keysdown.left = false;
		if (e.keyCode == 38) keysdown.up = false;
		if (e.keyCode == 40) keysdown.down = false;
	};

	var scaleCanvas = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
	return Game;
}());