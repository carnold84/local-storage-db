import uuid from 'uuid/v4';

class Collection {
  constructor(name, data, onUpdate) {
    this.data = data;
    this.dataLookup = {};
    this.name = name;
    this.update = onUpdate;

    data.forEach(element => {
      this.dataLookup[element.id] = element;
    });

    console.info(`Collection "${this.name}" is ready.`);
  }

  save(item, callback) {
    let err = undefined;

    item = {
      id: uuid(),
      ...item,
    };

    this.data.push(item);

    this.update();

    callback(err, item);
  }

  find() {
    return this.data;
  }

  findOne(id) {
    return this.dataLookup[id];
  }

  findOneAndDelete(id) {
    delete this.dataLookup[id];
  }
}

export default Collection;