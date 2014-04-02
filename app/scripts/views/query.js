 Sieve.QueryView = Backbone.View.extend({

  className: 'query-view',

  template: Templates.queryView,

  initialize: function(params){
    this.render();
  },

  events: {
    'submit': 'submit'
  },

  submit: function(e) {
    e.preventDefault();
    var query = $('input.tt-input').val();
    window.router.navigate('list/company/' + query, {trigger: true});
    console.log('QueryView submit:', query);
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

    // function (query, process) {
    //   return $.get('http://jyek.cloudapp.net:3002/api/v1/company/', { query: query, format: 'json', obj_only: 'true' }, function (data) {
    //     console.log(data);
    //     return process(data);
    //   });
    // }

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