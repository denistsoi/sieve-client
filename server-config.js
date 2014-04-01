var express = require('express');

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/app'));
});

app.get('/', function(req, res){
  res.render('index');
});

module.exports = app;