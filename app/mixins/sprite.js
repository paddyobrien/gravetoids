var Sprite = Ember.Mixin.create({
  g: 0.06,
  name: '',
  location: function() {
    return {
      x: this.get('xpos'),
      y: this.get('ypos')
    }
  }.property('xpos', 'ypos'),
  setupSpriteMixin: function() {
    this.setupImage('image', this.get('sprite'))
  }.on('didInsertElement'),
  setupImage: function(name, src) {
    var img = new Image(),
        self = this;
    this.set(name, img);
    img.src = src;
    $(img).on('load', function(){
      self.draw();
    });
  },
  addVectors: function(v1, v2) {
    //the restult of adding v1 and v2
    var v3 = {};
    var hv1 = v1.m * Math.cos(v1.d);
    var vv1 = v1.m * Math.sin(v1.d);
    var hv2 = v2.m * Math.cos(v2.d);
    var vv2 = v2.m * Math.sin(v2.d);
    var hv3 = hv1 + hv2;
    var vv3 = vv1 + vv2;
    // magnitude is calculated by c^2 = a^2 + b^2
    v3.m = Math.sqrt(Math.abs(Math.pow(vv3, 2) + Math.pow(hv3,2)));
    // now allow for direction lost by squaring
    if (hv3 < 0) {
      v3.m = v3.m * -1;
    }
    if (hv3 !== 0 && vv3 !== 0) {
      v3.d = Math.atan(vv3/hv3);
    } else {
      v3.d = v1.d;
    }
    return v3;
  }
});

export default Sprite;
