import { readFileSync, writeFileSync } from 'fs';
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
  const skilsarr: Array<string> = [];
  content.map(({ skils }) => {
    (skils as string).split(':|:').map(skil => {
      skilsarr.push(skil);
    });
  });
  utils.uniqueArray(skilsarr).map(skil => {
    db.query(`INSERT IGNORE INTO skills (skill) VALUES ("${skil}");`);
  });
  db.end(() => {
    stdout.write(chalk.blue.bold(`\nTime Elaapsed: ${utils.getDiffTimeByTimestamp(start, Date.now())}`));
  });
})();
