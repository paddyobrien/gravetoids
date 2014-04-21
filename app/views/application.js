var ApplicationView = Ember.View.extend({
  classNames: ['application'],
  didInsertElement: function() {
    this._super();
    var canvas = this.$('canvas');
    canvas.attr('width', window.innerWidth);
    canvas.attr('height', window.innerHeight);
    var ctx = this.$('canvas')[0].getContext('2d');
    this.get('controller').send('setupCanvas', ctx);
    this.set('keymap', {'up': false, 'right': false, 'down': false, 'left': false});
    this.send('keyChange', this.get('keymap'));
    var self = this;
    $(document).on('keydown', function(e) {
      self.onKeyDown(e);
    });
    $(document).on('keyup', function(e) {
      self.onKeyUp(e);
    });
  },

  keyDidChange: function() {
    this.get('controller').send('keyChange', this.get('keymap'));
  }.observes('keymap.up', 'keymap.down', 'keymap.left', 'keymap.right'),

  onKeyDown: function(e) {
    if (e.keyCode === 38) this.set('keymap.up', true);
    if (e.keyCode === 39) this.set('keymap.right', true);
    if (e.keyCode === 40) this.set('keymap.down', true);
    if (e.keyCode === 37) this.set('keymap.left', true); 
  },
  // registers keys as not down, actual interaction happens during the frame
  onKeyUp: function(e) {
    if (e.keyCode === 38) this.set('keymap.up', false);
    if (e.keyCode === 39) this.set('keymap.right', false);
    if (e.keyCode === 40) this.set('keymap.down', false);
    if (e.keyCode === 37) this.set('keymap.left', false);
  }
});

export default ApplicationView;
