Sieve.QueryView = Backbone.View.extend({

  className: 'queryView',

  template: Templates.queryView,

  initialize: function(params){
    this.render();
  },

  events: {
    'submit': 'submit'
  },

  submit: function(e) {
    e.preventDefault();
    var query = $('input.typeahead').val();
    this.trigger('query', query);
    console.log('QueryView submit:', this, query);
  },

  render: function() {
    var html = this.template({});
    this.$el.html(html);

    // add autocomplete features
    $('.typeahead').typeahead(null, {
      name: 'companies',
      displayKey: 'short_name',
      source: function (query, process) {
        return $.get('http://jyek.cloudapp.net:3002/api/v1/company/', { query: query, format: 'json', obj_only: 'true' }, function (data) {
          console.log(data);
          return process(data);
        });
      },
      templates: {
        empty: Templates.queryViewEmpty,
        suggestion: Templates.queryViewSuggestion
      }
    });

    return this;
  }

});