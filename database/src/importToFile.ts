import fs from 'fs';
import Database from './db/Database';
import query from './db/query';

const db = Database.init();

(async function main(): Promise<void> {
  const jobs = await db.query(query.selectJob());
  fs.writeFileSync('jobs.json', JSON.stringify(jobs));
  await db.close();
})();