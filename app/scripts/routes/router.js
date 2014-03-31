Sieve.Router = Backbone.Router.extend({

  initialize: function(options){
    this.$el = options.el;
    this.app = options.app;
  },

  routes: {
    '': 'index',
    'company/:ticker': 'company'
  },

  swapView: function(view){
    console.log(this);
    this.$el.html(view.render().el);
  },

  index: function(){
    console.log('Router: LandingView');
    this.$el.html('');
    this.$el.append(this.app.landingView.el);
    $container = $('<div class="container centered"></div>');
    this.$el.append($container.append(this.app.queryView.el));
    $('body').addClass('bg-weave');
  },

  company: function(ticker){
    console.log('Router: CompanyView', ticker);
    this.swapView(new Sieve.CompanyView());
    $('body').removeClass('bg-weave');
  }

});
