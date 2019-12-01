import fs from 'fs';
import { DatabaseFactory } from './db';
import query from './db/query';
import IJobs from './IJobs';

const db = DatabaseFactory.create('mysql');

// TODO: fix import to mysql. don't run it. it is't work

(async function main(): Promise<void> {
  const jobs: Array<IJobs> = JSON.parse(fs.readFileSync('jobs.json', { encoding: 'utf8' }));
  for (let job of jobs) {
    try {
      await db.query(
        `INSERT IGNORE INTO company (company_name, site, url) VALUES ('${job.company}', '${job.site}', '${job.companyUrl}');`
      );
      const [{ id: idCompany }] = await db.query(`SELECT id FROM company WHERE url = '${job.companyUrl}';`);
      await db.query(
        `INSERT IGNORE INTO job (job_name, description, url, company_id) VALUES ('${job.jobName}', '${job.keywords}', '${job.url}', ${idCompany});`
      );
      const [{ id: idJob }] = await db.query(`SELECT id FROM job WHERE url = '${job.url}';`);
      await db.query(`INSERT INTO c_to_j (company_id, job_id) VALUES (${idCompany}, ${idJob});`);
      const keywords = (job.keywords as string).split(':|:');
      for (let keyword of keywords) {
        await db.query(query.insertKeyword(keyword));
        const [{ id: idKeyword }] = await db.query(`SELECT id FROM keywords WHERE keyword = '${keyword}'`);
        await db.query(`INSERT INTO k_to_j (keyword_id, job_id) VALUES (${idKeyword}, ${idJob})`);
      }
    } catch (err) {}
  }
  await db.close();
})();
