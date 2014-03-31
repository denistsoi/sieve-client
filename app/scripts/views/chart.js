Sieve.ChartView = Backbone.View.extend({

  className: 'chart-view',

  template: Templates.chartView,
  spinner: Templates.spinnerView,
  notFound: Templates.notFoundView,

  initialize: function(opts){
    // initialize
    this.ticker = opts.ticker;
    this.collection = opts.collection;
    this.company = opts.company;
    this.offset = 0;
    this.limit = 50;

    // prepare chart
    this.prepareChart();

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

  prepareChart: function(){
    console.log('ChartView: Prepping charts...');
    var width = 960,
      height = 500;

    var y = d3.scale.linear()
      .range([height, 0]);

    var chart = d3.select(".chart")
      .attr("width", width)
      .attr("height", height);

    // date parsing
    this.parseDate = d3.time.format("%Y-%m-%d").parse;
  },

  updateChart: function(){
    console.log('ChartView: Populating charts...');

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
      console.log('ChartView: Rendering', scope);
      this.$el.html( this.template(scope) );
      this.updateChart();
    } else {
      // show spinner if retrieving data
      this.$el.html( this.spinner() );
    }

    return this;
  },

  profileReturn: function(){
    console.log('ChartView: Profile data received...');
    this.done.profile = true;
    this.render();
  },

  docsReturn: function(){
    console.log('ChartView: Document data received...');
    this.done.docs = true;
    this.render();
  },

  fetchAll: function(){
    console.log('ChartView: Fetching data...');
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