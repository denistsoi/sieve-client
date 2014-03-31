/**
 * Handlebars Helpers
 */
helpers = {
  formatSize: function(size) {
    return size.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' kb';
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

  /**
   * {{addCommas}}
   *
   * Add commas to numbers
   * @param {[type]} number [description]
   */
  addCommas: function (number) {
    return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
};

for (var helper in helpers) {
  if (helpers.hasOwnProperty(helper)) {
    Handlebars.registerHelper(helper, helpers[helper]);
  }
}
