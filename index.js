'use strict';

module.exports = livereload;

var socket = require('socket.io');
var fs = require('fs');
var node_path = require('path');
var escape = require('escape-regexp');
var util = require('util');
var mime = require('mime');

var node_url = require('url');

// @param {Object} options
// - 
function livereload (options) {
  options = options || {};

  // var matcher = create_patch_regex(options.patch);
  var io;

  function lr (req, res, next) {
    var parsed = node_url.parse(req.url, true);
    var path = parsed.pathname;

    if (path === '/_reload.js') {
      return router_reload_seed(req, res, next);
    }

    if (path === '/_reload') {
      return router_reload(req, parsed.query, res, next);
    }
    
    next();
  }


  function router_reload_seed (req, res, next) {
    var path = req.url;

    get_seed(function (err, content) {
      if (err) {
        res.status(500).send(err.stack || err.message || err);
        return res.end();
      }

      var type = mime.lookup(path);
      var charset = mime.charsets.lookup(type);

      content = content.replace('{{__pathname}}', path);
      res.set('Content-Type', type + (charset ? '; charset=' + charset : ''));
      res.send(content.replace());
      res.end();
    });
  }


  function router_reload (req, query, res, next) {
    var file = query.file;

    if (!io) {
      return res.status(200).send({
        code: 500,
        message: 'reload socket not attached.'
      }).end();
    }

    if (!file) {
      return res.status(200).send({
        code: 404,
        message: 'query "file" not specified.'
      });
    }

    io.emit('reload', query.file);

    res.status(200).send({
      code: 200,
      file: file
    }).end();
  }


  function attach (server) {
    if (io) {
      throw new Error('.attach() should not be called more than once.');
    }

    io = socket(server);
    // io.on('connection', function (socket) {
    // });
  }

  lr.attach = attach;

  return lr;
}


// function create_patch_regex (patch) {
//   if (!patch) {
//     return;
//   }

//   if (util.isRegExp(patch)) {
//     return patch;
//   }

//   if (typeof patch !== 'string') {
//     return;
//   }

//   return new RegExp(escape(patch));
// }


var reload_seed_file = node_path.join(__dirname, 'browser', 'lr-output.js');
var reload_seed;

// Method to get the livereload seed
function get_seed (callback) {
  if (reload_seed) {
    return callback(null, reload_seed);
  }

  fs.readFile(reload_seed_file, function (err, content) {
    if (err) {
      return callback(err);
    }

    reload_seed = content.toString();
    callback(null, reload_seed);
  });
}
