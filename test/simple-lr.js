'use strict';

var expect = require('chai').expect;
var simple_lr = require('../');
var node_path = require('path');
var send = require('send');
var http = require('http');
var fs = require('fs');


var app = require('express')();

var lr = simple_lr({
  patch: '/to-be-patched.js'
});

var root = node_path.join(__dirname, 'fixtures');
var file = node_path.join(root, '/to-be-patched.js');
app.use(lr);
app.use(function (req, res) {
  send(req, '/to-be-patched.js', {
    root: root
  }).pipe(res);
  // fs.createReadStream(file).pipe(res);
});

var server = http.createServer(app);
lr.attach(server);

server.listen(8000);
