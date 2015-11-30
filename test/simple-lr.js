'use strict';

var expect = require('chai').expect;
var simple_lr = require('../');
var node_path = require('path');
var send = require('send');


var app = require('express')();

var lr = simple_lr({
  patch: 'to-be-patched.js'
});

var root = node_path.join(__dirname, 'fixtures');
app.use(lr);
// app.use(function (req, res) {
//   send(req, '/to-be-patched.js', {
//     root: root
//   }).pipe(res);
// });

app.listen(8000)