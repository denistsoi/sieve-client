Sieve.CompanyView = Backbone.View.extend({

  className: 'company-view',

  template: Templates.companyView,

  initialize: function(){
    this.queryView = new Sieve.QueryView();
  },

  render: function(){
    this.$el.html( this.template({}) );
    this.$el.find('.query-view').append(this.queryView.el);

    return this;
  }
});