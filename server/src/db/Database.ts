import mysql, { Connection, queryCallback } from 'mysql';

export default class Datebase {
  private db: Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '128500',
    database: 'jobsercher'
  });

  constructor() {}

  public connect(cb: Function) {
    this.db.connect(cb);
  }

  public query(query: string, cb: queryCallback) {
    this.db.query(query, cb);
  }
}
