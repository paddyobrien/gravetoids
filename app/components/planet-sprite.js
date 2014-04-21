import Sprite from 'gravetoids/mixins/sprite';

var PlanetSpriteComponent = Ember.Component.extend(Sprite, {
  didInsertElement: function() {

  },

  offset: function() {
    return {x: 400, y: 400};
  }.property('ctx'),

  // calculate the force this planet exerts on a mass at a point
  calculateGravity: function(location, mass){
    var distance, theta, opp, adj, hyp, mod, dir, mag;
    // TODO, tidy this up
    if (location.x <= this.get('location.x') && location.y <= this.get('location.y')) {
      mod = 0;
      adj = this.get('location.x') - location.x;
      opp = this.get('location.y') - location.y;
    } else if (location.x >= this.get('location.x') && location.y <= this.get('location.y')) {
      mod = (Math.PI * 3)/2;
      opp = location.x - this.get('location.x');
      adj = this.get('location.y') - location.y;
    } else if (location.x <= this.get('location.x') && location.y >= this.get('location.y')) {
      mod = ((Math.PI * 3)/2) * -1;
      opp = this.get('location.x') - location.x;
      adj = location.y - this.get('location.y') ;
    } else {
      mod = Math.PI;
      adj = location.x - this.get('location.x');
      opp = location.y - this.get('location.y') ;
    }

    hyp = Math.sqrt(Math.pow(adj, 2) + Math.pow(opp, 2));
    theta = Math.atan(opp/adj);
    if (isNaN(theta)) {
      theta = 0;
    }
    dir = theta - mod;
    // calculate gravity
    mag = Math.abs((this.get('g') * ((this.get('mass'))/Math.pow(hyp, 2))));
    return {
      m: mag,
      d: dir
    };
  },

  draw: function() {
    this.get('canvas').drawImage(
      this.get('image'),
      this.get('location.x') - this.get('radius') - this.get('offset.x'),
      this.get('location.y') - this.get('radius') - this.get('offset.y')
    );
  }.observes('tick')
});

export default PlanetSpriteComponent;
