'use strict';

module.exports = livereload;

var socket = require('socket.io');
var fs = require('fs');
var node_path = require('path');
var escape = require('escape-regexp');
var util = require('util');

// @param {Object} options
// - 
function livereload (options) {
  options = options || {};
  var matcher = create_patch_regex(options.patch);

  function lr (req, res, next) {
    var path = req.url;
    // if (!matcher || !matcher.test(path)) {
    //   next();
    // }
    if (path.indexOf('/_reload.js') !== 0) {
      return next();
    }

    
  }


  function attach() {
    
  }

  lr.attach = attach;

  return lr;
}


function create_patch_regex (patch) {
  if (!patch) {
    return;
  }

  if (util.isRegExp(patch)) {
    return patch;
  }

  if (typeof patch !== 'string') {
    return;
  }

  return new RegExp(escape(patch));
}


var reload_seed_file = node_path.join(__dirname, 'browser', 'lr.js');
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
