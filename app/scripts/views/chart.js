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
    this.yahoo = opts.yahoo;
    this.offset = 0;
    this.limit = 100;

    // fetch data
    this.fetchAll();
    this.done = {
      profile: false,
      docs: false,
      ticks: false,
      metrics: false
    };

    // events
    this.collection.on('sync', this.docsReturn, this);
    this.company.on('sync', this.profileReturn, this);
    this.yahoo.on('ticks', this.ticksReturn, this);
    this.yahoo.on('ticksFailed', this.ticksReturn, this);
    this.yahoo.on('metrics', this.metricsReturn, this);
    this.yahoo.on('metricsFailed', this.metricsReturn, this);
  },

  render: function(){
    if (this.done.profile && this.company.meta.total_count === 0){
      // if ticker does not exist, show not found
      this.$el.html( this.notFound({ ticker: this.ticker }) );
    } else if (this.done.profile && this.done.docs && this.done.ticks && this.done.metrics){
      // render template when data received
      var scope = {
        company: this.company.attributes[0],
        docs: this.collection.models,
        meta: this.collection.meta
      };
      console.log('ChartView: Rendering', scope);
      this.$el.html( this.template(scope) );
      this.prepareChart();
      this.updateChartAnnotations(this.collection.models);
      this.updateStockPrice(this.yahoo.ticks);
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

  ticksReturn: function(){
    console.log('ChartView: Received Yahoo ticks', this.yahoo.ticks);
    this.done.ticks = true;
    this.render();
  },

  metricsReturn: function(){
    console.log('ChartView: Received Yahoo metrics', this.yahoo.metrics);
    this.done.metrics = true;
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
    margin: {top: 20, right: 50, bottom: 30, left: 50}
  },

  color: function(str){
    str = str.toLowerCase();
    re = {
      warning: /profit warning/,
      report: /annual report|interim report|announcement of results/,
      dividend: /dividend/,
      majorTrans: /takeover|acquisition|substantial|major transaction|major/,
      minorTrans: /discloseable transaction|discloseable/,
      buyback: /buyback/,
      listing: /listing|wpip|web proof information pack|prospectus|stabilizing|global offering/
    };

    if (str.match(re.warning) !== null){
      return 'red';
    } else if (str.match(re.report) !== null){
      return 'darkgray';
    } else if ( str.match(re.dividend) !== null){
      return 'yellow';
    } else if ( str.match(re.majorTrans) !== null){
      return 'green';
    } else if ( str.match(re.minorTrans) !== null){
      return 'lightgreen';
    } else if ( str.match(re.buyback) !== null){
      return 'orange';
    } else if ( str.match(re.listing) !== null){
      return 'blue';
    } else {
      return 'gray';
    }
  },

  prepareChart: function(){
    console.log('ChartView: Prepping charts...');
    var self = this;

    this.defaults.width = this.defaults.maxWidth - this.defaults.margin.left - this.defaults.margin.right;
    this.defaults.height = this.defaults.maxHeight - this.defaults.margin.top - this.defaults.margin.bottom;

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

    // line
    this.line = d3.svg.line()
      .x(function(d) { return self.x(d.date); })
      .y(function(d) { return self.y(d.close); });

  },

  updateChartAnnotations: function(data){
    console.log('ChartView: Annotating chart...', data);
    var self = this;
    this.x.domain([
      // d3.min(data, function(d) { return Date.parse(d.attributes.date); }),
      // TODO: implement longer search history
      Date.parse('2013-01-01'),
      d3.max(data, function(d) { return Date.parse(d.attributes.date); })
    ]);
    this.y.domain([0, d3.max(data, function(d) { return d.attributes.size; })]);

    this.chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.defaults.height + ")")
        .call(this.xAxis);

    this.chart.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Price (HK$)");

    this.chart.append("g")
        .attr("class", "bars");

    this.chart.select("g.bars").selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("class", function(d) { return self.color(d.attributes.description); })
        .attr("x", function(d) { return self.x(Date.parse(d.attributes.date)); })
        .attr("y", 1)
        .attr("height", function(d) { return self.defaults.height - 1; })
        .attr("width", 3);
  },

  updateStockPrice: function(data){
    console.log('ChartView: Updating share prices...', data);
    var self = this;
    // process date and closing price
    data.forEach(function(d) {
      d.date = Date.parse(d.Date);
      d.close = +d.Close;
    });

    // update y axis domain
    this.y.domain(d3.extent(data, function(d) { return d.close; }));

    // update x and y axis
    this.chart.selectAll("g.x.axis")
      .call(this.xAxis);

    this.chart.selectAll("g.y.axis")
      .call(this.yAxis);

    // chart - init line
    this.chart.append("path")
      .attr("class", "line");

    // update line
    this.chart.selectAll("path.line")
      .datum(data)
      .attr("d", self.line);
  }

});