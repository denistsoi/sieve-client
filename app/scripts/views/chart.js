Sieve.ChartView = Backbone.View.extend({

  className: 'chart-view',

  template: Templates.chartView,
  spinner: Templates.spinnerView,
  notFound: Templates.notFoundView,
  metrics: Templates.metricsView,

  /*--------------------------------------------------------*/
  /* View
  /*--------------------------------------------------------*/

  initialize: function(opts){
    // initialize
    this.ticker = opts.ticker;
    this.collection = opts.collection;
    this.company = opts.company;
    this.yahoo = opts.yahoo;
    this.offset = 0;
    this.limit = 250;

    // fetch data
    this.fetchAll();
    this.loading = false;
    this.done = {
      profile: 0,
      docs: 0,
      ticks: 0,
      metrics: 0
    };

    // events
    this.collection.on('sync', this.docsReturn, this);
    this.company.on('sync', this.profileReturn, this);
    this.yahoo.on('ticks', this.ticksReturn, this);
    this.yahoo.on('ticksFailed', this.ticksReturn, this);
    this.yahoo.on('metrics', this.metricsReturn, this);
    this.yahoo.on('metricsFailed', this.metricsReturn, this);
  },

  renderMetricsView: function(){
    console.log('ChartView: Render metrics view');
    $('.metrics-wrap').append( this.metrics(this.yahoo.metrics) );
  },

  render: function(msg){
    if (this.done.profile && this.company.meta.total_count === 0){
      // if ticker does not exist, show not found
      this.$el.html( this.notFound({ ticker: this.ticker }));
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
      this.updateAnnotations(this.collection.models);
      if (this.done.ticks === 200) this.updateStockPrice(this.yahoo.ticks);
      if (this.done.metrics === 200) this.renderMetricsView();
    } else {
      // show spinner if retrieving data
      if (!this.loading) this.$el.html( this.spinner() );
      this.loading = true;
    }

    return this;
  },

  /*--------------------------------------------------------*/
  /* Receive data
  /*--------------------------------------------------------*/

  profileReturn: function(){
    console.log('ChartView: Profile data received...');
    this.done.profile = 200;
  },

  docsReturn: function(){
    console.log('ChartView: Document data received...');
    this.done.docs = 200;
    this.render();
  },

  ticksReturn: function(){
    console.log('ChartView: Received Yahoo ticks', this.yahoo.ticks);
    this.done.ticks = 200;
    this.render();
  },

  metricsReturn: function(){
    console.log('ChartView: Received Yahoo metrics', this.yahoo.metrics);
    this.done.metrics = 200;
    this.render();
  },

  ticksReturnFailed: function(){
    console.log('ChartView: Received Yahoo ticks', this.yahoo.ticks);
    this.done.ticks = 404;
    this.render();
  },

  metricsReturnFailed: function(){
    console.log('ChartView: Received Yahoo metrics', this.yahoo.metrics);
    this.done.metrics = 404;
    this.render();
  },

  /*--------------------------------------------------------*/
  /* Fetch data
  /*--------------------------------------------------------*/

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
      limit: this.limit,
      order_by: '-date'
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
    margin: {top: 30, right: 50, bottom: 30, left: 50}
  },

  color: function(str){
    str = str.toLowerCase();

    this.filters = {
      positiveProfit: {re: /positive profit alert|positive profit warning/, color: 'pink', label:'Positive Profit'},
      warning: {re: /profit warning|profit alert/, color: 'red', label: 'Profit Warning'},
      report: {re: /annual report|audited results|interim report|final results|announcement of results|annual results|half yearly results/, color: 'darkgray', label: 'Financial Reports'},
      dividend: {re: /dividend/, color: 'yellow', label: 'Dividends'},
      majorTrans: {re: /takeover|acquisition|substantial|major transaction|major/, color: 'green', label: 'Major Acquisitions'},
      minorTrans: {re: /discloseable transaction|discloseable/, color: 'lightgreen', label: 'Minor Acquisitions'},
      buyback: {re: /buyback/, color: 'orange', label: 'Share Buybacks'},
      listing: {re: /listing|wpip|web proof information pack|prospectus|stabilizing|global offering/, color: 'blue', label: 'Capital Raising'},
      halt: {re: /trading halt/, color: 'purple', label: 'Trading Halt'},
      resumption: {re: /resumption of trading/, color: 'lightblue', label: 'Trading Resumption'},
      others: {re: '', color: 'gray'}
    };

    for (var filter in this.filters){
      if(str.match(this.filters[filter].re) !== null){
        return this.filters[filter].color;
      }
    }

    return 'gray';
  },

  prepareChart: function(){
    console.log('ChartView: Prepping charts...');
    var self = this;

    this.defaults.width = this.defaults.maxWidth - this.defaults.margin.left - this.defaults.margin.right;
    this.defaults.height = this.defaults.maxHeight - this.defaults.margin.top - this.defaults.margin.bottom;

    this.x = d3.time.scale()
      .range([0, this.defaults.width])
      .domain([Date.parse(moment().subtract('months', 15).format('YYYY-MM-DD')), Date.now()]);

    this.y = d3.scale.linear()
      .range([this.defaults.height, 0]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom")
      .tickFormat(d3.time.format("%b %y"));

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

  updateAnnotations: function(data){
    console.log('ChartView: Annotating chart...', data);
    var self = this;

    var displayAnno = function(data){
      data = data.attributes;
      var raw = '{{ formatDate date }}: <a href="{{ url }}" target="_blank">{{ description }}</a> ({{ formatSize size}})';
      var template = Handlebars.compile(raw);
      // var html = date + ': ' + '<a href="' + data.attributes.url +'" target="_blank">' + data.attributes.description + '</a>';
      d3.select("div.annotation")
        .html( template(data))
        .attr("style","display:block");
    };

    this.chart.append("g")
        .attr("class", "bars");

    this.chart.select("g.bars").selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("class", function(d) { return self.color(d.attributes.description); })
        .attr("x", function(d) { return self.x(Date.parse(d.attributes.date)); })
        .attr("y", 0)
        .attr("height", function(d) { return self.defaults.height; })
        .attr("width", 4)
        .on("mouseover", displayAnno);

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