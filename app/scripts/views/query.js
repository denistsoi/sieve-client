/*global sieve, Backbone, JST*/

sieve.Views = sieve.Views || {};

(function () {
  'use strict';

  sieve.Views.QueryView = Backbone.View.extend({

      template: JST['app/scripts/templates/query.ejs']

  });
})();
