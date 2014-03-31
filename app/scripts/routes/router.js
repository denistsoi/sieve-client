Sieve.Router = Backbone.Router.extend({

  initialize: function(opts){
    this.$el = opts.el;
    this.app = opts.app;
  },

  routes: {
    '': 'index',
    'list/company/:ticker': 'list',
    'chart/company/:ticker': 'chart'
  },

  index: function(){
    console.log('Router: LandingView');
    this.$el.empty();
    this.$el.append(new Sieve.LandingView().render().el);
    $container = $('<div class="container centered"></div>');
    this.$el.append($container.append(new Sieve.QueryView().render().el));
    $('body').addClass('bg-weave');
  },

  list: function(ticker){
    console.log('Router: CompanyView', ticker);
    this.$el.empty();
    this.$el.append(new Sieve.HeaderView({ ticker: ticker }).render().el);
    this.$el.append(new Sieve.CompanyView({
      ticker: ticker,
      company: new Sieve.Company(),
      collection: new Sieve.Documents()
    }).render().el);
    $('body').removeClass('bg-weave');
  },

  chart: function(ticker){
    console.log('Router: CompanyView', ticker);
    this.$el.empty();
    this.$el.append(new Sieve.HeaderView({ ticker: ticker }).render().el);
    this.$el.append(new Sieve.ChartView({
      ticker: ticker,
      company: new Sieve.Company({}),
      collection: new Sieve.Documents({}),
      yahoo: new Sieve.Yahoo({ticker: ticker})
    }).render().el);
    $('body').removeClass('bg-weave');
  }

});
