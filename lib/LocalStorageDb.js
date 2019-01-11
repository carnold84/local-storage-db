import Database from './Database';
export default {
  connect: function connect(db_name, callback) {
    var db = new Database(db_name);
    var err = undefined;
    callback(err, db);
  }
};