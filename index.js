'use strict'

module.exports = livereload

var socket = require('socket.io')
var fs = require('fs')
var node_path = require('path')
var escape = require('escape-regexp')
var util = require('util')
var mime = require('mime')

var node_url = require('url')

// @param {Object} options
// -
function livereload (options) {
  options = options || {}

  var matcher = create_patch_regex(options.patch)
  var io

  function lr (req, res, next) {
    var parsed = node_url.parse(req.url, true)
    var path = parsed.pathname

    if (matcher && matcher.test(path)) {
      return router_patch_reload_seed(req, path, res, next)
    }

    if (path === '/_reload.js') {
      return router_reload_seed(req, res, next)
    }

    if (path === '/_reload') {
      return router_reload(req, parsed.query, res, next)
    }

    next()
  }


  function router_patch_reload_seed (req, path, res, next) {
    var end = res.end
    var setHeader = res.setHeader

    var seed = '\n\n' +  reload_seed.replace('{{__pathname}}', path)

    res.end = function (chunk, encoding, callback) {
      res.write(seed)
      return end.apply(res, arguments)
    }

    res.setHeader = function (type, length) {
      if (type.toLowerCase() === 'content-length') {
        // adds the seed length to the default length,
        // if the `content-length` header is going to be set.
        arguments[1] = length + seed.length
      }

      return setHeader.apply(res, arguments)
    }

    next()
  }


  function router_reload_seed (req, res, next) {
    var path = req.url
    var type = mime.lookup(path)
    var charset = mime.charsets.lookup(type)

    var content = reload_seed.replace('{{__pathname}}', path)
    res.set('Content-Type', type + (charset ? ' charset=' + charset : ''))
    res.send(content.replace())
    res.end()
  }


  function router_reload (req, query, res, next) {
    var file = query.file

    if (!io) {
      return res.status(200).send({
        code: 500,
        message: 'reload socket not attached.'
      }).end()
    }

    if (!file) {
      return res.status(200).send({
        code: 404,
        message: 'query "file" not specified.'
      })
    }

    reload(file)

    res.status(200).send({
      code: 200,
      file: file
    }).end()
  }


  function attach (server) {
    if (io) {
      throw new Error('.attach() should not be called more than once.')
    }

    io = socket(server)
  }


  function reload (file) {
    if (io && file) {
      io.emit('reload', file)
    }
  }


  lr.attach = attach
  lr.reload = reload

  return lr
}


function create_patch_regex (patch) {
  if (!patch) {
    return
  }

  if (util.isRegExp(patch)) {
    return patch
  }

  if (typeof patch !== 'string') {
    return
  }

  return new RegExp(escape(patch))
}


var reload_seed_file = node_path.join(__dirname, 'browser', 'lr-output.js')

// It will throw if fails to read lr-output.js.
// But when it happens, it is the booting stage of the server,
// that we could make it right.
var reload_seed = fs.readFileSync(reload_seed_file).toString()
