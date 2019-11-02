import fs from 'fs';
import Database from './db/Database';
import query from './db/query';
import IJobs from './IJobs';

const db = Database.init();

(async function main(): Promise<void> {
  const jobs: Array<IJobs> = JSON.parse(fs.readFileSync('jobs.json', { encoding: 'utf8' }));
  for (let job of jobs) {
    for (let key in job) {
      job[key] = `${job[key]}`.replace(/\'/g, "''");
    }
    await db.query(query.insertJob({ ...job }));
    for (let keyword of (job.keywords as string).split(':|:')) {
      await db.query(query.insertKeyword(keyword));
    }
  }
  await db.close();
})();
