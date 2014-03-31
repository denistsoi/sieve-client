Sieve.Yahoo = Backbone.Model.extend({
  initialize: function(opts){
    var self = this;
    self.ticker = opts.ticker;

    self.startDate = moment('2013-01-01').format('YYYY-MM-DD');
    self.endDate = moment().format('YYYY-MM-DD');

    console.log('Yahoo: Fetching data for', self.ticker);

    // get historical data
    self.query({
      stock: opts.ticker,
      startDate: self.startDate,
      endDate: self.endDate
    }, 'historicaldata', function(err, data) {
      console.log('Yahoo: Data returned...', data);
      self.ticks = data.quote;
      self.displayTicks();
    });

    // get current quotes
    self.query({
      stock: opts.ticker
    }, 'quotes', function(err, data) {
      console.log('Yahoo: Metrics returned...', data);
      self.metrics = data.quote;
      self.displayMetrics();
    });
  },

  // Yahoo query
  query: function(opts, type, complete){
    var defs = {
      desc: false,
      baseURL: 'http://query.yahooapis.com/v1/public/yql?q=',
      query: {
        quotes: 'select * from yahoo.finance.quotes where symbol = "{stock}" | sort(field="{sortBy}", descending="{desc}")',
        historicaldata: 'select * from yahoo.finance.historicaldata where symbol = "{stock}" and startDate = "{startDate}" and endDate = "{endDate}"'
      },
      suffixURL: {
        quotes: '&env=store://datatables.org/alltableswithkeys&format=json&callback=?',
        historicaldata: '&env=store://datatables.org/alltableswithkeys&format=json&callback=?'
      }
    };

    opts = opts || {};

    if (!opts.stock) {
      complete('No stock defined');
      return;
    }

    var query = defs.query[type]
      .replace('{stock}', opts.stock)
      .replace('{sortBy}', defs.sortBy)
      .replace('{desc}', defs.desc)
      .replace('{startDate}', opts.startDate)
      .replace('{endDate}', opts.endDate);

    var url = defs.baseURL + query + (defs.suffixURL[type] || '');

    $.getJSON(url, function(data) {
      var err = null;
      if (!data || !data.query) {
        err = true;
      }
      complete(err, !err && data.query.results);
    });
  },

  // ready to display chart
  displayTicks: function(){
    this.trigger('ticksReady', this);
  },

  // ready to display metrics
  displayMetrics: function(){
    this.trigger('metricsReady', this);
  },

});