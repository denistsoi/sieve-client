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
    this.$el.find('.query-wrap').append(new Sieve.QueryView().el);
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

  // parseTicker: function(ticker){
  //   if (ticker.match(/.*?.HK/)){
  //     var prefix = ticker.match(/(.*?).[hH?][kK?]/);
  //     if ( parseInt(prefix) ){
  //       if (prefix.length >= 4) {
  //         return ticker;
  //       } else {
  //         var len = prefix.length;
  //         for (var i = 0; i < 4 - len; i++){

  //         }
  //       }

  //     }

  //   }
  // },

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
