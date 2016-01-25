'use strict';

var app = require('express')();
var node_url = require('url');
var request = require('request');


app.use(function (req, res) {
  var path = node_url.parse(req.url).pathname;
  var url = node_url.resolve('http://d4.xiaohongshu.com', path);
  console.log(path, url)
  request(url, function (err, response, body) {
    body = body.replace(/<body>/, '<body><script src="hahaha"></script>');
    res.send(body);
    res.end();
  });
});

app.listen(8001)