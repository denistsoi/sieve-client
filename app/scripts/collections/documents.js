Sieve.Documents = Backbone.Collection.extend({

  url: window.server + 'document/?',

  model: Sieve.Document,

  parse: function(response) {
    this.meta = response.meta || {};
    return response.objects || response;
  }
});