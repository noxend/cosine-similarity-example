import express, { Request, Response, NextFunction, Express } from 'express';
import { MysqlError } from 'mysql';
import bodyParser from 'body-parser';
import { DatabaseFactory, query } from './db';

const app: Express = express();
const db = DatabaseFactory.create('mysql');

(function main() {
  db.connect()
    .then(() => {
      process.stdout.write('\nMySQL Connected...');
    })
    .catch(err => {
      throw err;
    });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/api/keywords', (req: Request, res: Response, next: NextFunction) => {
    db.query(`SELECT * FROM keywords WHERE (keyword LIKE '%${req.query.keyword}%') LIMIT 10;`).then(
      result => {
        res.send(result);
      }
    );
  });

  app.get('/api/jobs', (req: Request, res: Response, next: NextFunction) => {
    const keywords = req.query;

    Object.keys(keywords).forEach(key => {
      keywords[key] = `${keywords[key]}`.replace(/\'/g, "''");
    });
    
    db.query(query.getJobsByKeys(Object.values(keywords))).then(result => {
      res.send(result);
    });
  });

  app.listen(5500, () => {
    process.stdout.write('Server is running on 5500');
  });
})();
