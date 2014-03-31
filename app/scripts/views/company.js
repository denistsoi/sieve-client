Sieve.CompanyView = Backbone.View.extend({

  className: 'company-view',

  template: Templates.companyView,

  initialize: function(opts){
    this.collection = opts.collection;
    this.company = opts.company;
    this.collection.on('sync', this.render, this);
    this.company.on('sync', this.render, this);
    this.queryView = new Sieve.QueryView();
  },

  render: function(){
    var scope = {
      company: this.company.attributes[0],
      docs: this.collection.models
    };
    console.log('CompanyView: Render with scope', scope);
    this.$el.html( this.template(scope) );
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

    var documentParams = $.param({
      obj_only: 'true',
      format: 'json',
      company__ticker: ticker
    });
    this.collection.fetch({ data: documentParams });

    // console.log(this.collection, this.company);
  }
});