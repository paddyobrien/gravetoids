
export default Ember.Handlebars.makeBoundHelper(function(num) {
  return Math.round(num * 100) / 100;
});