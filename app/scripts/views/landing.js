Sieve.LandingView = Backbone.View.extend({

  className: 'landingView',

  template: Templates.landingView,

  initialize: function(opts){
  },

  render: function() {
    var html = this.template({});
    this.$el.html(html);
    return this;
  }

});