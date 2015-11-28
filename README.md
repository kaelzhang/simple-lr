[![Build Status](https://travis-ci.org/kaelzhang/simple-lr.svg?branch=master)](https://travis-ci.org/kaelzhang/simple-lr)
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/simple-lr.svg)](http://badge.fury.io/js/simple-lr)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/simple-lr.svg)](https://www.npmjs.org/package/simple-lr)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/simple-lr.svg)](https://david-dm.org/kaelzhang/simple-lr)
-->

# simple-lr

A simple and tiny livereload server and browser client, which powered by socket.io

## Install

```sh
$ npm install simple-lr --save
```

## Usage

```js
var lr = require('simple-lr')({
  // Will patch the reload seed to neuron.js
  patch: 'neuron.js'
});

var app = require('express')();
app.use(lr);

var server = require('http').createServer(app);
lr.attach(server);

server.listen(8000);
```

The middleware will serve:

- A restful api: `'/_reload?pathname=<pathname>'` notices the reload server, and the server will broadcast to all connected clients with a reload directive.
- Patches reload seed to static file response if its pathname matches.
- Hosts reload seed as `'/_reload.js'`. The seed will automatically connect the socket server.

## License

MIT
