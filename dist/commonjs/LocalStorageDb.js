'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;
var crypto = commonjsGlobal.crypto || commonjsGlobal.msCrypto; // for IE 11

if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  rng = function () {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

var rngBrowser = rng;

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
}

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }

  options = options || {};
  var rnds = options.random || (options.rng || rngBrowser)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

var Collection =
/*#__PURE__*/
function () {
  function Collection(name, data, onUpdate) {
    var _this = this;

    _classCallCheck(this, Collection);

    this.data = data;
    this.dataLookup = {};
    this.name = name;
    this.update = onUpdate;
    data.forEach(function (element) {
      _this.dataLookup[element.id] = element;
    });
    console.info("Collection \"".concat(this.name, "\" is ready."));
  }

  _createClass(Collection, [{
    key: "save",
    value: function save(item, callback) {
      var err = undefined;
      item = _objectSpread({
        id: v4_1()
      }, item);
      this.data.push(item);
      this.update();
      callback(err, item);
    }
  }, {
    key: "find",
    value: function find() {
      return this.data;
    }
  }, {
    key: "findOne",
    value: function findOne(id) {
      return this.dataLookup[id];
    }
  }, {
    key: "findOneAndDelete",
    value: function findOneAndDelete(id) {
      delete this.dataLookup[id];
    }
  }]);

  return Collection;
}();

var Database =
/*#__PURE__*/
function () {
  function Database(name) {
    var _this = this;

    _classCallCheck(this, Database);

    var data = JSON.parse(localStorage.getItem(name));

    if (data === null) {
      localStorage.setItem(name, JSON.stringify({
        collections: {},
        name: name
      }));
      data = JSON.parse(localStorage.getItem(name));
    }

    this.collections = {};
    this.collection = this.collection.bind(this);
    this.name = data.name;
    this.update = this.update.bind(this);
    Object.keys(data.collections).forEach(function (element) {
      _this.collections[element] = new Collection(element, data.collections[element], _this.update);
    });
    console.info("Database \"".concat(this.name, "\" is ready."));
  }

  _createClass(Database, [{
    key: "collection",
    value: function collection(name) {
      var collection = this.collections[name];

      if (!collection) {
        this.collections[name] = new Collection(name, []);
        this.update();
      }

      return collection;
    }
  }, {
    key: "clear",
    value: function clear() {
      localStorage.setItem(this.name, JSON.stringify({
        collections: {},
        name: this.name
      }));
      this.collections = {};
      return this.collections;
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      var collections = {};
      Object.keys(this.collections).forEach(function (element) {
        var collection = _this2.collections[element];
        collections[element] = collection.find();
      });
      localStorage.setItem(this.name, JSON.stringify({
        collections: collections,
        name: this.name
      }));
    }
  }]);

  return Database;
}();

var LocalStorageDb = {
  connect: function connect(db_name, callback) {
    var db = new Database(db_name);
    var err = undefined;
    callback(err, db);
  }
};

module.exports = LocalStorageDb;
