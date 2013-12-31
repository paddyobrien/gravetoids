


var Ship = function Ship(opts) {
	return {
		sprite: opts.sprite,
		boostersprite: opts.booster,
		image: false,
		flames: false,
		boostersound: new Audio(opts.engine),
		launched: false,
		// the current locaiton of ship
		location: {x: 0, y: 0},
		// the current velocity vector
		velocity: {m: 0, d: 0},
		// the current thrust vector
		thrust:   {m: 0, d: 0},
		//drag: 0.00000001,
		drag: 0,
		fuel: opts.fuel,
		// the ships bearing
		bearing: 0,
		// the position of the helm
		helm:    0,
		// the ships mass
		mass:    0.1,
		// control and display options
		opt: {
			topspeed: 3,
			minspeed: 0.01,
			maxhelm: 10,
			helmstep: 0.6,
			maxThrust: opts.maxThrust,
			thrustStepUp: 0.0004,
			thrustStepDown: 0.004,
			colour: 'dddddd',
			thruster: 'red'
		},

		loadImage: function() {
			if (!this.image) {
				this.image = new Image();
				this.image.src = this.sprite;
				this.flames = new Image();
				this.flames.src = this.boostersprite;
			}
		},

		// Draw the ship in it's current location in the provided context
		drawimage: function(ctx, offset) {
			var x = this.location.x, y = this.location.y;
			ctx.save();
			x = x - offset.x;
			y = y - offset.y;
			ctx.translate(x, y);

			ctx.rotate((Math.PI / 180) * this.bearing);
			ctx.fillStyle = this.opt.colour;
			
			if (this.thrust.m > 0) {
				// skake the ship if the thrusters are on
				var randx = Math.floor(Math.random() * 2) + 1;
				var randy = Math.floor(Math.random() * 2) + 1;
				//this.boostersound.play();
				ctx.drawImage(this.image, -23 + randx, -16 + randy);
				ctx.drawImage(this.flames, -52 + randx, -15 + randy);
			} else {
				this.boostersound.pause();
				if(this.boostersound.currentTime) {
					this.boostersound.currentTime = 0;
				}
				ctx.drawImage(this.image, -22, -15);
			}
			ctx.restore();
		},
		// calculate a new velocity based on internal params, i.e. thrust
		doThrust: function(keysdown) {
			// figure out where the helm is pointed
			this.setHelm(keysdown);
			// figure out a new bearing for this move
			this.setBearing();
			// figure out a new new thrust vector
			this.setThrust(keysdown);
			// calculate the new velocity
			this.applyForce(this.thrust);
			if (this.velocity.m > 0) {
				this.velocity.m -= this.drag;
			} else if (this.velocity.m < 0) {
				this.velocity.m += this.drag;
			}
		},
		// move the ship to a new location based on it's current velocity
		move: function() {
			var loc = this.location;
			// calculate the ships new location
			loc.x = loc.x + (this.velocity.m * Math.cos(this.velocity.d));
			loc.y = loc.y + (this.velocity.m * Math.sin(this.velocity.d));
			this.location = loc;
		},

		applyForce: function(f) {
			var newvel = addVectors(this.velocity, f);
			if (Math.abs(newvel.m) > this.opt.topspeed) {
				if (newvel.m < 0) {
					newvel.m = this.opt.topspeed * -1;
				} else {
					newvel.m = this.opt.topspeed;
				}
			}
			this.velocity = newvel;
		},
		// set the helm based on current user input
		setHelm: function(keysdown) {
			var helm = this.helm;
			if (keysdown.left && helm >= this.opt.maxhelm * -1) {
				helm -= this.opt.helmstep;
			}
			if (keysdown.right && helm <= this.opt.maxhelm) {
				helm += this.opt.helmstep;
			}
			if (!keysdown.left && !keysdown.right) {
				if (helm > 0) {
					helm -= this.opt.helmstep;
				}
				if (helm < 0) {
					helm += this.opt.helmstep;
				}
			}
			if (Math.abs(helm) < this.opt.helmstep) {
				helm = 0;
			}
			this.helm = helm;
		},
		// set the new bearing based on the helm position
		setBearing: function() {
			var newbearing = this.bearing + this.helm;
			if (newbearing > 360) {
				newbearing = newbearing - 360;
			}
			if (newbearing < 0) {
				newbearing = newbearing + 360;
			}
			this.bearing = newbearing;
		},
		// calculate the current thrust vector based on the helm and any thrust being applied
		setThrust: function(keysdown) {
			if (this.fuel > 0){
				this.thrust.d = (this.bearing * Math.PI) / 180;
				var mag = this.thrust.m;
				if (keysdown.up && mag < this.opt.maxThrust) {
					mag += this.opt.thrustStepUp;
				}
				if (keysdown.down && mag > 0) {
					mag -= this.opt.thrustStepDown;
				}
				if(mag < 0) {
					mag = 0;
				}
				this.thrust.m = mag;
				this.fuel = this.fuel - this.thrust.m;
			} else {
				this.thrust.m = 0;
			}
			if (!this.launched && this.thrust.m > 0) {
				this.launched = true;
			}
		},
		peek: function(keysDown) {
			if (!this.launched) return;
			var oldVel = {}, oldLoc = {};
			oldVel.x = this.velocity.x;
			oldVel.y = this.velocity.y;
			oldLoc.x = this.location.x;
			oldLoc.y = this.location.y;
			var futureCoords = [];
			for(var i = 0; i < 1000; i++) {
				
				this.move();
				futureCoords.push({x: this.location.x, y: this.location.y});
			}
			this.location.x = oldLoc.x;
			this.location.y = oldLoc.y;
			this.velocity.x = oldVel.x;
			this.velocity.y = oldVel.y;
			return futureCoords;
		}
	};
};