window.Sieve = Backbone.View.extend({

  el: 'body',

  template: Templates.appView,

  initialize: function(){
    console.log('Welcome to Sieve 2014 Beta');
    this.render();

    // init router and make globally accessible
    this.router = new Sieve.Router( { el: this.$el.find('.content-view'), app: this } );
    window.router = this.router;
    Backbone.history.start({ pushState: false });
  },

  // events: {
  //   'keypress :input': 'logKey'
  // },

  render: function(){
    this.$el.prepend( this.template() );
    return this;
  },

  renderCompanyView: function(query){
    console.log('AppView renderCompanyView:', query);

  },

  logKey: function(e) {
    console.log(e.type, e.keyCode);
  }

});