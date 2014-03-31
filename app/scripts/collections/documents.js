Sieve.Documents = Backbone.Collection.extend({

  // initialize: function(options){

  //   this.ticker = options.ticker;

  //   this._paramObj = {
  //     obj_only: 'true',
  //     format: 'json',
  //   };

  //   if(this.ticker){
  //     this._paramObj['company__ticker'] = this.ticker;
  //   }

  // },

  url: window.server + 'document/?',
  model: Sieve.Document
});