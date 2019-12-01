import chalk from 'chalk';
import ScraperFactory from './ScraperFactory';
import IJobData from './IJobData';
import RobotaUA from './RobotaUA';
import utils from './utils';

import { DatabaseFactory, query, IDatabase } from './db';

const start: number = Date.now();
const db: IDatabase = DatabaseFactory.create('mysql');

(async function main() {
  const scraper = <RobotaUA>ScraperFactory.crate('robotaua');
  const data: Array<IJobData> = await scraper.getJobsUrl();
  await db.connect();
  for (const el of data) {
    const result = await scraper.getDetails(el);
    try {
      await db.query(
        `INSERT IGNORE INTO company (company_name, site, url) VALUES ('${result.company}', '${result.site}', '${result.companyUrl}');`
      );
      const [{ id: idCompany }] = await db.query(
        `SELECT id FROM company WHERE url = '${result.companyUrl}';`
      );
      await db.query(
        `INSERT IGNORE INTO job (job_name, description, url, company_id) VALUES ('${result.jobName}', '${result.keywords}', '${result.url}', ${idCompany});`
      );
      const [{ id: idJob }] = await db.query(`SELECT id FROM job WHERE url = '${result.url}';`);
      await db.query(`INSERT INTO c_to_j (company_id, job_id) VALUES (${idCompany}, ${idJob});`);
      const keywords = (result.keywords as string).split(':|:');
      for (let keyword of keywords) {
        await db.query(query.insertKeyword(keyword));
        const [{ id: idKeyword }] = await db.query(`SELECT id FROM keywords WHERE keyword = '${keyword}'`);
        await db.query(`INSERT INTO k_to_j (keyword_id, job_id) VALUES (${idKeyword}, ${idJob})`)
      }
    } catch (err) {}
  }
  await db.close();
  console.log(chalk.blue.bold(`\nTime Elapsed: ${utils.getDiffTimeByTimestamp(start, Date.now())}`));
})();
