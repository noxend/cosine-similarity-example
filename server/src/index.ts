import express, { Request, Response, NextFunction, Express } from 'express';
import bodyParser from 'body-parser';
import { DatabaseFactory, query } from './db';

const app: Express = express();
const db = DatabaseFactory.create('mysql');

(function main() {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/api/keywords', (req: Request, res: Response, next: NextFunction) => {
    db.query(`SELECT * FROM keywords WHERE (keyword LIKE '%${req.query.keyword}%') LIMIT 10;`).then(
      result => {
        res.send(result);
      }
    );
  });

  app.get('/api/jobs', async (req: Request, res: Response, next: NextFunction) => {
    const keywords = req.query;
    const usersKeys: Array<number> = [];

    for (let i = 0; i < 15; i++) {
      if (keywords[i]) {
        const [{ id }] = await db.query(`SELECT id FROM keywords WHERE keyword = '${keywords[i]}'`);
        usersKeys.push(id);
      } else {
        usersKeys.push(0);
      }
    }

    const jobs = await db.query(`
      SELECT
        job_id,
        GROUP_CONCAT(DISTINCT keyword_id
          SEPARATOR ':|:') AS keywords
      FROM
        k_to_j
      GROUP BY job_id;
    `);

    const tableName: String = `result_${Date.now()}`;

    await db.query(`CREATE TABLE ${tableName} SELECT job_id, k FROM results;`);

    for (let job of jobs) {
      const jobkeys: Array<number> = [];
      const k: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (let i = 0; i < 15; i++) {
        const arrids: Array<string> = (job.keywords as string).split(':|:');
        jobkeys.push(parseInt(arrids[i] ? arrids[i] : '0', 10));
      }

      for (let i = 0; i < usersKeys.length; i++) {
        if (jobkeys.indexOf(usersKeys[i]) !== -1) {
          k[jobkeys.indexOf(usersKeys[i])] = usersKeys[i];
        }
      }

      let muls: number = 0,
        sqrsu: number = 0,
        res: number = 0,
        sqrsj: number = 0;

      for (let i = 0; i < 15; i++) {
        muls += k[i] * jobkeys[i];
        sqrsj += jobkeys[i] * jobkeys[i];
        sqrsu += k[i] * k[i];
      }

      res = muls / Math.sqrt(sqrsu) / Math.sqrt(sqrsj);

      if (!isNaN(res)) {
        await db.query(`INSERT INTO ${tableName} (job_id, k) VALUES ('${job.job_id}', '${res}');`);
      }
    }

    const result = await db.query(`
      SELECT j.job_name AS jobName, j.id, j.description, j.url, c.company_name AS company, c.url AS companyUrl, k
      FROM ${tableName}
        JOIN job j ON j.id = ${tableName}.job_id
        JOIN company c on j.company_id = c.id
      ORDER BY k DESC;
    `);

    res.json(result);

    await db.query(`DROP TABLE ${tableName}`);
  });

  app.listen(5500, () => {
    process.stdout.write('Server is running on 5500');
  });
})();
