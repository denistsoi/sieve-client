Sieve.HeaderView = Backbone.View.extend({

  className: 'header-view',

  template: Templates.headerView,

  initialize: function(){
    this.queryView = new Sieve.QueryView();
  },

  render: function(){
    this.$el.html( this.template({}) );
    this.$el.find('.query-view').append(this.queryView.el);
    return this;
  }

});