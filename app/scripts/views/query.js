 Sieve.QueryView = Backbone.View.extend({

  className: 'query-view',

  template: Templates.queryView,

  initialize: function(params){
    this.render();
  },

  events: {
    'submit': 'submit'
  },

  // converts 1 --> 0001.HK
  // converts 1.HK --> 0001.HK
  parseQuery: function(query){
    var addZeros = function(num){
      var str = num.toString();
      var len = str.length;
      if (len >= 4) return num;
      for (var i = 0; i < 4 - len; i++){
        str = '0' + str;
      }
      return str;
    };

    var num = parseInt(query);
    if (num){
      return addZeros(num) + '.HK';
    } else {
      return false;
    }
  },

  submit: function(e) {
    e.preventDefault();
    var query = $('input.tt-input').val();
    ticker = this.parseQuery(query);
    if (ticker){
      window.router.navigate('list/company/' + ticker, {trigger: true});
      console.log('QueryView submit:', ticker);
    } else {
      this.$el.find('.query-msg').text("Invalid ticker");
    }
  },

  render: function() {
    var html = this.template({});
    this.$el.html(html);

    var companies = new Bloodhound({
      datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.short_name); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: 'data/autocomplete.json',
      remote: 'http://jyek.cloudapp.net:3002/api/v1/company/?query=%QUERY&format=json&obj_only=true',
    });

    companies.initialize();

    // add autocomplete features
    this.$el.find('.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
      name: 'companies',
      displayKey: 'ticker',
      source: companies.ttAdapter(),
      templates: {
        empty: Templates.queryViewEmpty,
        suggestion: Templates.queryViewSuggestion
      }
    });

    return this;
  }

});