import mysql, { Connection } from 'mysql';
import IDatabase from './IDatabase';

export default class Datebase implements IDatabase  {
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

  public connect(): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.db.connect((err) => {
        if(err) rejects(err);
        else resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.db.end(err => {
        if (err) rejects(err);
        else resolve();
      });
    });
  }

  public query(query: string): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.db.query(query, (err, results) => {
        if (err) rejects(err);
        else resolve(results);
      });
    });
  }
}
