function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import Collection from './Collection';

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

export default Database;