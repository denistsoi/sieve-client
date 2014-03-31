Sieve.HeaderView = Backbone.View.extend({

  className: 'header-view',

  template: Templates.headerView,

  initialize: function(opts){
    this.ticker = opts.ticker;
    this.queryView = new Sieve.QueryView();
  },

  events: {
    'click .chart-mode': 'chart',
    'click .list-mode': 'list'
  },

  render: function(){
    this.$el.html( this.template({}) );
    this.$el.find('.query-view').append(this.queryView.el);
    return this;
  },

  chart: function(){
    console.log('HeaderView: Route chart mode');
    window.router.navigate('chart/company/' + this.ticker);
  },

  list: function(){
    console.log('HeaderView: Route list mode');
    window.router.navigate('list/company' + this.ticker);
  }

});