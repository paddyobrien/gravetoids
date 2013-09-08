

var Planet = function(xpos, ypos, radius, mass, sprite) {
	return {
		// where the planet is
		location: {x: xpos, y: ypos},
		// the graviational constant
		g: 0.06,
		// the planets mass
		mass: mass,
		// the planets radius
		radius: radius,
		// the image object
		image: false,
		// the url of the sprite
		sprite: sprite,

		// calculate the force this planet exerts on a mass at a point
		calculateGravity: function(location, mass){
			
			var distance, theta, opp, adj, hyp, mod, dir, mag;

			// TODO, tidy this up
			if (location.x <= this.location.x && location.y <= this.location.y) {
				mod = 0;
				adj = this.location.x - location.x;
				opp = this.location.y - location.y;
			} else if (location.x >= this.location.x && location.y <= this.location.y) {
				mod = (Math.PI * 3)/2;
				opp = location.x - this.location.x;
				adj = this.location.y - location.y;
			} else if (location.x <= this.location.x && location.y >= this.location.y) {
				mod = ((Math.PI * 3)/2) * -1;
				opp = this.location.x - location.x;
				adj = location.y - this.location.y ;
			} else {
				mod = Math.PI;
				adj = location.x - this.location.x;
				opp = location.y - this.location.y ;
			}
			
			hyp = Math.sqrt(Math.pow(adj, 2) + Math.pow(opp, 2));
			theta = Math.atan(opp/adj);
			if (isNaN(theta)) {
				theta = 0;
			}
			dir = theta - mod;
			// calculate gravity
			mag = Math.abs((this.g * ((this.mass)/Math.pow(hyp, 2))));
			return {
				m: mag,
				d: dir
			};
		},
		// Draw the planet at it's current location
		drawimage: function(ctx) {
			if (!this.image) {
				this.image = new Image();
				this.image.src = this.sprite;
			}
			ctx.drawImage(this.image, this.location.x - (this.radius), this.location.y - this.radius);
		}
	};
};
