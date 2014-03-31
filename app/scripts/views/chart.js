Sieve.ChartView = Backbone.View.extend({

  className: 'chart-view',

  template: Templates.chartView,
  spinner: Templates.spinnerView,
  notFound: Templates.notFoundView,

  /*--------------------------------------------------------*/
  /* View                                                   */
  /*--------------------------------------------------------*/

  initialize: function(opts){
    // initialize
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
      this.prepareChart();
      this.updateChart([
        {name: Date.now(), value: 1},
        {name: Date.now() - 20000, value: 2},
        {name: Date.now() - 50000, value: 3}
      ]);
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
  },

  /*--------------------------------------------------------*/
  /* D3                                                     */
  /*--------------------------------------------------------*/

  // Chart defaults
  defaults: {
    maxWidth: 960,
    maxHeight: 500,
    margin: {top: 20, right: 30, bottom: 30, left: 40}
  },

  prepareChart: function(){
    console.log('ChartView: Prepping charts...');

    this.defaults.width = this.defaults.maxWidth - this.defaults.margin.left - this.defaults.margin.right;
    this.defaults.height = this.defaults.maxHeight - this.defaults.margin.top - this.defaults.margin.bottom;

    // this.x = d3.scale.linear()
    //   .range([0, this.defaults.width]);

    this.x = d3.time.scale()
      .range([0, this.defaults.width]);

    this.y = d3.scale.linear()
      .range([this.defaults.height, 0]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom")
      .tickFormat(d3.time.format("%d %b %Y"));

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    this.chart = d3.select("svg.chart")
        .attr("width", this.defaults.width + this.defaults.margin.left + this.defaults.margin.right)
        .attr("height", this.defaults.height + this.defaults.margin.top + this.defaults.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.defaults.margin.left + "," + this.defaults.margin.top + ")");

    // date parsing
    this.parseDate = d3.time.format("%Y-%m-%d").parse;
  },

  updateChart: function(data){
    console.log('ChartView: Populating chart...', data);
    var self = this;
    this.x.domain([
      d3.min(data, function(d) { return d.name; }),
      d3.max(data, function(d) { return d.name; })
    ]);
    this.y.domain([0, d3.max(data, function(d) { return d.value; })]);

    this.chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.defaults.height + ")")
        .call(this.xAxis);

    this.chart.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);

    this.chart.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return self.x(d.name); })
        .attr("y", function(d) { return self.y(d.value); })
        .attr("height", function(d) { return self.defaults.height - self.y(d.value); })
        .attr("width", 10);
  }

});