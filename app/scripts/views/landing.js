Sieve.LandingView = Backbone.View.extend({

  className: 'landingView',

  template: Templates.landingView,

  initialize: function(params){
    this.render();
  },

  render: function() {
    var html = this.template({});
    this.$el.html(html);
    return this;
  }

});