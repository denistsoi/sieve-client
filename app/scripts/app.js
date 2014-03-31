window.Sieve = Backbone.View.extend({

  className: 'app-view',

  // template: Templates.layout,
  template: Templates.appView,

  initialize: function(){
    console.log('Welcome to Sieve 2014 Beta');
    $('body').prepend( this.render().el );

    // views
    this.landingView = new Sieve.LandingView();
    this.queryView = new Sieve.QueryView();
    this.companyView = new Sieve.CompanyView();

    // router
    this.router = new Sieve.Router( { el: this.$el.find('.content-view'), app: this } );
    Backbone.history.start({ pushState: false });

    // events
    this.queryView.on('query', this.renderCompanyView, this);
  },

  events: {
    // 'on ': 'renderCompanyView'
    // 'keypress :input': 'logKey'
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
  },

  renderCompanyView: function(query){
    console.log('AppView renderCompanyView:', query);
    this.router.navigate('/company/' + query, {trigger: true});
  },

  logKey: function(e) {
    console.log(e.type, e.keyCode);
  }

});