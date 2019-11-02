import mysql, { Connection, queryCallback } from 'mysql';

export default class Datebase {
  private static instance: Datebase;
  private db: Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '128500',
    database: 'jobsercher'
  });

  private constructor() {}

  public static init() {
    if (!Datebase.instance) Datebase.instance = new Datebase();
    return Datebase.instance;
  }

  public connect(cb?: Function) {
    this.db.connect(cb);
  }

  public close(): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.db.end(err => {
        if (err) rejects(err);
        else resolve();
      });
    });
  }

  public query(query: string): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.db.query(query, (err, results) => {
        if (err) rejects(err);
        else resolve(results);
      });
    });
  }
}
