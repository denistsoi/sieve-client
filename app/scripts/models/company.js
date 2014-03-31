Sieve.Company = Backbone.Model.extend({
  url: window.server + 'company/',

  parse: function(response) {
    this.meta = response.meta || {};
    return response.objects || response;
  }
});