function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import uuid from 'uuid/v4';

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
        id: uuid()
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

export default Collection;