'use strict';

var expect = require('chai').expect;
var simple_lr = require('../');
var node_path = require('path');
var send = require('send');
var http = require('http');


var app = require('express')();

var lr = simple_lr();

var root = node_path.join(__dirname, 'fixtures');
app.use(lr);
// app.use(function (req, res) {
//   send(req, '/to-be-patched.js', {
//     root: root
//   }).pipe(res);
// });

var server = http.createServer(app);
lr.attach(server);

server.listen(8000);
