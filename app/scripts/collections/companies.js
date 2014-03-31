Sieve.Companies = Backbone.Collection.extend({
  model: Sieve.Company,

  url: window.server + 'company/',

  parse: function(response) {
    this.meta = response.meta || {};
    return response.objects || response;
  }
});