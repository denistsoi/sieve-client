Sieve.MetricsView = Backbone.View.extend({

  className: 'metrics-view',

  template: Templates.metricsView,

  initialize: function(opts){
    this.model = opts.model;
  },

  render: function(){
    this.$el.html(this.template(this.model));
  }

});