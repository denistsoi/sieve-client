Sieve.Router = Backbone.Router.extend({

  initialize: function(opts){
    this.$el = opts.el;
    this.app = opts.app;
  },

  routes: {
    '': 'index',
    'company/:ticker': 'company'
  },

  index: function(){
    console.log('Router: LandingView');
    this.$el.empty();
    this.$el.append(new Sieve.LandingView().render().el);
    $container = $('<div class="container centered"></div>');
    this.$el.append($container.append(new Sieve.QueryView().render().el));
    $('body').addClass('bg-weave');
  },

  company: function(ticker){
    console.log('Router: CompanyView', ticker);
    this.$el.empty();
    this.$el.append(new Sieve.HeaderView().render().el);
    this.$el.append(new Sieve.CompanyView({
      ticker: ticker,
      company: new Sieve.Company(),
      collection: new Sieve.Documents()
    }).render().el);
    $('body').removeClass('bg-weave');
  }

});
