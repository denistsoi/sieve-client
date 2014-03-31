Sieve.CompanyView = Backbone.View.extend({

  className: 'company-view',

  template: Templates.companyView,
  spinner: Templates.spinnerView,
  notFound: Templates.notFoundView,

  initialize: function(opts){
    this.ticker = opts.ticker;
    this.collection = opts.collection;
    this.company = opts.company;
    this.offset = 0;
    this.limit = 50;

    // fetch data
    this.fetchAll();
    this.done = {
      profile: false,
      docs: false
    };

    // events
    this.collection.on('sync', this.docsReturn, this);
    this.company.on('sync', this.profileReturn, this);
  },

  events: {
    'click .prev': 'getPrevious',
    'click .next': 'getNext'
  },

  getPrevious: function(){
    console.log('CompanyView getPrevious');
    if (this.offset - this.limit > 0) this.offset -= this.limit;
    this.done.docs = false;
    this.render();
    this.fetchDocs();
  },

  getNext: function(){
    console.log('CompanyView getNext');
    if (this.offset + this.limit < this.collection.meta.total_count) this.offset += this.limit;
    this.done.docs = false;
    this.render();
    this.fetchDocs();
  },

  render: function(){
    if (this.done.profile && this.company.meta.total_count === 0){
      // if ticker does not exist, show not found
      this.$el.html( this.notFound({ ticker: this.ticker }) );
    } else if (this.done.profile && this.done.docs){
      // render template when data received
      var scope = {
        company: this.company.attributes[0],
        docs: this.collection.models,
        meta: this.collection.meta
      };
      // console.log('CompanyView: Render with scope', scope);
      this.$el.html( this.template(scope) );
    } else {
      // show spinner if retrieving data
      this.$el.html( this.spinner() );
    }

    return this;
  },

  profileReturn: function(){
    this.done.profile = true;
    this.render();
  },

  docsReturn: function(){
    this.done.docs = true;
    this.render();
  },

  fetchAll: function(){
    this.fetchCompany();
    this.fetchDocs();
  },

  fetchCompany: function(){
    var companyParams = $.param({
      format: 'json',
      ticker: this.ticker
    });
    this.company.fetch({ data: companyParams });
  },

  fetchDocs: function(){
    var documentParams = $.param({
      format: 'json',
      company__ticker: this.ticker,
      offset: this.offset,
      limit: this.limit
    });
    this.collection.fetch({ data: documentParams });
  }
});