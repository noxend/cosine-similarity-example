import fs from 'fs';
import { DatabaseFactory } from './db';
import query from './db/query';

const db = DatabaseFactory.create('mysql');

// TODO: fix import to file

(async function main(): Promise<void> {
  const jobs = await db.query(query.selectJob());
  fs.writeFileSync('jobs.json', JSON.stringify(jobs));
  await db.close();
})();
