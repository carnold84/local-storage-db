import Database from './Database';

export default {
  connect(db_name, callback) {
    const db = new Database(db_name);
    const err = undefined;

    callback(err, db);
  }
};