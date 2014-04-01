Sieve.Prices = Backbone.Model.extend({

  /*
   *  http://www.gummy-stuff.org/Yahoo-data.htm
   */

  /*
   *  http://ichart.yahoo.com/table.csv?s=0001.HK&a=0&b=1&c=2007&d=2&e=31&f=2014&g=w&ignore=.csv
   *  Retrieves quotes for yahoo ticker from m/d/y to m/d/y. Returns csv.
   *  @s: yahoo ticker (e.g. 0001.HK)
   *  @a: from month-1 (eg. 0 for Jan, 1 for Feb ...)
   *  @b: from day (eg. 0 to 31)
   *  @c: from year (eg. 2000)
   *  @d: to month-1 (eg. 0 for Jan, 1 for Feb ...)
   *  @e: to day (eg. 0 to 31)
   *  @f: to year (eg. 2000)
   *  @g: frequency d-day, w-weekly, m-monthly
   *  Ref: https://code.google.com/p/yahoo-finance-managed/wiki/csvHistQuotesDownload
   */
  // url: 'http://ichart.yahoo.com/table.csv',

  parse: function(response) {
    console.log('PricesCollection:', response);
  }

});