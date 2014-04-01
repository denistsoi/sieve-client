/*--------------------------------------------------------*/
/* Global Helpers                                         */
/*--------------------------------------------------------*/

window.helpers = {};

// returns date in yyyy-mm-dd
window.helpers.formatDate = function(date){
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
};

/*--------------------------------------------------------*/
/* Handlebar Helpers                                      */
/*--------------------------------------------------------*/
var helpers = {
  formatSize: function(size) {
    return size.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' kb';
  },

  formatMultiple: function(mult){
    return Math.round(mult*10)/10 + 'x';
  },

  // UNUSED
  formatPrice: function(country, price){
    var prefix = {
      HK: 'HK$',
      US: 'US$'
    };
    return prefix.country + price;
  },

  formatDate: function(date) {
    var now = moment();
    var d = moment(date);

    // if today, show time
    if ( d.year() === now.year() && d.month() === now.month() && d.date() === now.date() ){
      return d.format('h:mm a');
    }
    // if this year, show month and day
    else if ( d.year() === now.year() ){
      return moment(date).format('MMM D');
    }
    // otherwise, show full date
    else {
      return moment(date).format('DD/MM/YY');
    }
  },

  // Add commas to numbers
  addCommas: function (number) {
    return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  add: function (value, addition) {
    return value + addition;
  },

  subtract: function (value, substraction) {
    return value - substraction;
  },

  divide: function (value, divisor) {
    return value / divisor;
  },

  multiply: function (value, multiplier) {
    return value * multiplier;
  },

  floor: function (value) {
    return Math.floor(value);
  },

  ceil: function (value) {
    return Math.ceil(value);
  },

  round: function (value) {
    return Math.round(value);
  },

  sum: function () {
    var args = _.flatten(arguments);
    var sum = 0;
    var i = args.length - 1;
    while (i--) {
      if ("number" === typeof args[i]) {
        sum += args[i];
      }
    }
    return Number(sum);
  }
};

for (var helper in helpers) {
  if (helpers.hasOwnProperty(helper)) {
    Handlebars.registerHelper(helper, helpers[helper]);
  }
}
