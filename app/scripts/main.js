/*global sieve, $*/

window.sieve = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function () {
    'use strict';
    console.log('Welcome to Sieve 2014');
  }
};

$(document).ready(function () {
  'use strict';
  sieve.init();
});