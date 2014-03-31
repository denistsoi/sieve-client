Sieve.CompanyView = Backbone.View.extend({

  className: 'document-view',

  template: Templates.companyView,

  initialize: function(opts){
    this.collection = opts.collection;
    this.company = opts.company;
    this.queryView = new Sieve.QueryView();
  },

  render: function(){
    this.$el.html( this.template({company: this.company}) );
    this.$el.find('.query-view').append(this.queryView.el);

    return this;
  },

  renderByTicker: function(ticker){
    console.log('CompanyView getTicker:', ticker);

    var companyParams = $.param({
      obj_only: 'true',
      format: 'json',
      ticker: ticker
    });
    this.company.fetch({ data: companyParams });

    console.log('yea', this.company, this.collection);

    var documentParams = $.param({
      obj_only: 'true',
      format: 'json',
      company__ticker: ticker
    });
    this.collection.fetch({ data: documentParams });

    console.log('yea', this.company, this.collection);
    this.render();
  }
});