Sieve.Document = Backbone.Model.extend({
  url: window.server + 'document/',

  parse: function(response) {
    this.meta = response.meta || {};
    return response.objects || response;
  }
});