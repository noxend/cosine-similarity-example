import { readFileSync, createReadStream, ReadStream } from 'fs';
import { stdout } from 'process';
import chalk from 'chalk';
import mysql, { MysqlError } from 'mysql';
import utils from '../utils';
import IJobData from '../IJobData';

const start: number = Date.now();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '128500',
  database: 'jobsercher'
});

db.connect((err: MysqlError) => {
  if (err) throw err;
});


(function main() {
  const content = <Array<IJobData>>JSON.parse(readFileSync('jobs.json', 'utf8'));

  content.map(
    ({ jobName, company, city, number, contactPerson, url, skils, address, phone, site, salary }) => {
      db.query(
        `INSERT IGNORE INTO jobs (jobName, company, city, number, contactPerson, url, skils, address, phone, site, salary) VALUES ("${jobName}", "${company}", "${city}", "${number}", "${contactPerson}", "${url}", "${skils}", "${address}", "${phone}", "${site}", "${salary}");`
      );
    }
  );
  db.end(() => {
    stdout.write(chalk.blue.bold(`\nTime Elaapsed: ${utils.getDiffTimeByTimestamp(start, Date.now())}`));
  });
})();
