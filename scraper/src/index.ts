import chalk from 'chalk';
import fs, { WriteStream } from 'fs';
import ScraperFactory from './ScraperFactory';
import IJobData from './IJobData';
import RobotaUA from './RobotaUA';
import utils from './utils';
import Datebase from './db/Database';
import query from './db/query';

const start: number = Date.now();
const db: Datebase = Datebase.init();

(async function main() {
  const scraper = <RobotaUA>ScraperFactory.crate('robotaua');
  const data: Array<IJobData> = await scraper.getJobsUrl();
  for (const el of data) {
    const result = await scraper.getDetails(el);
    try {
      await db.query(query.insertJob(result));
      (result.skils as string).split(':|:').map(keyword => {
        db.query(query.insertKeyword(keyword));
      });
    } catch (err) {}
  }
  await db.close();
  console.log(chalk.blue.bold(`\nTime Elapsed: ${utils.getDiffTimeByTimestamp(start, Date.now())}`));
})();
