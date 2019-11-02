import express, { Request, Response, NextFunction, Express } from 'express';
import { MysqlError } from 'mysql';
import bodyParser from 'body-parser';
import Database from './db/Database';

(function main() {
  const app: Express = express();
  const db = new Database();

  db.connect((err: MysqlError) => {
    if (err) throw err;
    process.stdout.write('\nMySQL Connected...');
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/api/keywords', (req: Request, res: Response, next: NextFunction) => {
    db.query(
      `SELECT * FROM keywords WHERE (keyword LIKE '%${req.query.keyword}%') LIMIT 10;`,
      (err, result: Array<object>) => {
        res.json(result);
      }
    );
  });

  app.get('/jobs', (req: Request, res: Response, next: NextFunction) => {
    const keywords = ['java', 'sql', 'студ'];

    switch (keywords.length) {
      case 1:
        db.query(`SELECT * FROM jobs WHERE (skils LIKE '%${keywords[0]}%')`, (err, result: Array<object>) => {
          res.json(result);
        });
        break;
      case 2:
        db.query(
          `SELECT * FROM jobs WHERE (skils LIKE '%${keywords[0]}%') AND (skils LIKE '%${keywords[1]}%')`,
          (err, result: Array<object>) => {
            res.json(result);
          }
        );
        break;
      case 3:
        db.query(
          `SELECT * FROM jobs WHERE (skils LIKE '%${keywords[0]}%') AND (skils LIKE '%${keywords[1]}%') AND (skils LIKE '%${keywords[2]}%')`,
          (err, result: Array<object>) => {
            res.json(result);
          }
        );
        break;
      case 4:
        db.query(
          `SELECT * FROM jobs WHERE (skils LIKE '%${keywords[0]}%') AND (skils LIKE '%${keywords[1]}%') AND (skils LIKE '%${keywords[2]}%') AND (skils LIKE '%${keywords[3]}%')`,
          (err, result: Array<object>) => {
            res.json(result);
          }
        );
        break;
      case 5:
        db.query(
          `SELECT * FROM jobs WHERE (skils LIKE '%${keywords[0]}%') AND (skils LIKE '%${keywords[1]}%') AND (skils LIKE '%${keywords[2]}%') AND (skils LIKE '%${keywords[3]}%') AND (skils LIKE '%${keywords[4]}%')`,
          (err, result: Array<object>) => {
            res.json(result);
          }
        );
        break;

      default:
        break;
    }
  });

  app.listen(5500, () => {
    process.stdout.write('Server is running on 5500');
  });
})();
