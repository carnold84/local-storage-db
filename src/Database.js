import Collection from './Collection';

class Database {
  constructor(name) {
    let data = JSON.parse(localStorage.getItem(name));
    
    if (data === null) {
      localStorage.setItem(name, JSON.stringify({
        collections: {},
        name,
      }));
      data = JSON.parse(localStorage.getItem(name));
    }

    this.collections = {};
    this.collection = this.collection.bind(this);
    this.name = data.name;
    this.update = this.update.bind(this);

    Object.keys(data.collections).forEach(element => {
      this.collections[element] = new Collection(element, data.collections[element], this.update);
    });

    console.info(`Database "${this.name}" is ready.`);
  }

  collection(name) {
    let collection = this.collections[name];

    if (!collection) {
      this.collections[name] = new Collection(name, []);
      this.update();
    }

    return collection;
  }

  clear() {
    localStorage.setItem(this.name, JSON.stringify({
      collections: {},
      name: this.name,
    }));
    this.collections = {};
    return this.collections;
  }

  update() {
    let collections = {};

    Object.keys(this.collections).forEach(element => {
      const collection = this.collections[element];
      collections[element] = collection.find();
    });

    localStorage.setItem(this.name, JSON.stringify({
      collections,
      name: this.name,
    }));
  }
}

export default Database;