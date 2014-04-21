var ApplicationController = Ember.ArrayController.extend({
  setup: function() {
    this.set('clock', {});
    this.set('clock.tick', 0);
    this.set('keymap', {});
    Em.run.later(this, this.gameLoop, 20)
  }.on('init'),
  gameLoop: function() {
    this.get('ctx').clearRect(0, 0, window.innerWidth, window.innerHeight);
    if(this.get('clock.tick') > 10000) {
      this.set('clock.tick', 0);
    }
    this.incrementProperty('clock.tick');
    Em.run.later(this, this.gameLoop, 20);
  },
  ship: function() {
    return this.content.ship;
  }.property('content'),
  planets: function () {
    return this.content.levels[0].planets;
  }.property('content'),
  actions: {
    setupCanvas: function(ctx) {
      this.set('ctx', ctx);
    },
    keyChange: function(keymap) {
      console.log(keymap);
      this.set('keymap', keymap)
    }
  }
});

export default ApplicationController;
