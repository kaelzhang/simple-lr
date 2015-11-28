;(function (window, document) {
'use strict';

var REGEX_EXT = /\.([a-z0-9])$/i;

function reload (src) {
  TYPE[get_type(src)](src);
}

function get_type (src) {
  var match = src.match(REGEX_EXT);
  return match && match[1].toLowerCase() || 'img';
}

function iterate (tag, callback) {
  var els = document.querySelectorAll(tag);
  var i = 0;
  var len = els.length
  for (; i < len; i ++) {
    callback(els[i]);
  }
}


var REGEX_QUESTION_MARK = /\?/;
var REGEX_ENDS_WITH_AMPERSAND = /&$/

// @param {String} value to make it simple, only deal with String type of value
function append_query (href, key, value) {
  // The following search query is allowed
  // - ?
  // - ?a
  // - ?a&b=1
  // - ?&b=1
  var pair = key + '=' + value;

  if (!REGEX_QUESTION_MARK.test(href)) {
    return href + '?' + pair;
  }

  if (REGEX_ENDS_WITH_AMPERSAND.test(href)) {
    return href + pair;
  }

  return href + '&' + pair;
}


function refresh_attribute (node, test, attr) {
  var value = node.getAttribute(attr);
  if (~value.indexOf(test)) {
    node.setAttribute(attr, append_query(value, '_lr', + new Date));
  }
}


var TYPE = {
  css: function (href) {
    iterate('link', function (link) {
      refresh_attribute(link, href, 'href');
    });
  },

  js: function (src) {
    // TODO, use browser extension system to reload javascript
    window.reload();
  },

  img: function (src) {
    iterate('img', function (img) {
      refresh_attribute(img, src, 'src');
    });
  }
};


if (!window.WebSocket) {
  console.error('websocket is not supported.');
  return;
}

var ws_server = '{{ws_server}}';
var ws = new WebSocket(ws_server);

ws.onopen = function (event) {
  socket.send('init');

  socket.onmessage = function (event) {
    console.log('message', event);
  };

  socket.onclose = function (event) {
    console.log('close', event);
  };
};


})(window, document);

