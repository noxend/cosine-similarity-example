import MySQL from './MySQL';

export default class DatabaseFactory {
  static create(db: 'mysql') {
    switch (db) {
      case 'mysql':
        return MySQL.init();
      default:
        return MySQL.init();
    }
  }
}
