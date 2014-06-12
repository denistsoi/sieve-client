Sieve.Yahoo = Backbone.Model.extend({
  initialize: function(opts){
    var self = this;
    self.ticker = opts.ticker;

    self.startDate = moment().subtract('months', 15).format('YYYY-MM-DD');
    self.endDate = moment().format('YYYY-MM-DD');

    console.log('Yahoo: Fetching data for', self.ticker);

    // get historical data
    self.query({
      stock: opts.ticker,
      startDate: self.startDate,
      endDate: self.endDate
    }, 'historicaldata', function(err, data) {
      console.log('Yahoo: Ticks returned...', data);
      if (data && data.hasOwnProperty('quote')){
        self.ticks = data.quote;
        self.trigger('ticks', this);
      } else {
        self.trigger('ticksFailed', this);
      }
    });

    // get current quotes
    self.query({
      stock: opts.ticker
    }, 'quotes', function(err, data) {
      console.log('Yahoo: Metrics returned...', data);
      if (data && data.hasOwnProperty('quote')){
        self.metrics = data.quote;
        self.trigger('metrics', this);
      } else {
        self.trigger('metricsFailed', this);
      }
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

});