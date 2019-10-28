import axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';
import cheerio from 'cheerio';
import IJobData from './IJobData';
import ScraperAbstract from './ScraperAbstract';
import puppeteer from './Puppeteer';
import utils from './utils';

export default class WorkUA extends ScraperAbstract {
  private pages: number;
  private processed: number;
  private processedUrls: number;
  private timeStart: number;
  private timeEnd: number;

  constructor(private config: any) {
    super();
    this.pages = Math.ceil(config.jobs / 14);
    this.processed = 0;
    this.processedUrls = 0;
    this.timeStart = 0;
    this.timeEnd = 0;
  }

  private displayStatus(): void {
    this.processed++;
    const pr: number = (100 * this.processed) / this.config.jobs;
    let out: string = '';

    if (pr <= 20) out = chalk.bold.red(`${((100 * this.processed) / this.config.jobs).toFixed(2)}%`);
    else if (pr >= 20 && 40 >= pr)
      out = chalk.bold.yellow(`${((100 * this.processed) / this.config.jobs).toFixed(2)}%`);
    else if (pr >= 40 && 60 >= pr)
      out = chalk.bold.blue(`${((100 * this.processed) / this.config.jobs).toFixed(2)}%`);
    else if (pr >= 60 && 80 >= pr)
      out = chalk.bold.cyan(`${((100 * this.processed) / this.config.jobs).toFixed(2)}%`);
    else if (pr >= 80) out = chalk.bold.green(`${((100 * this.processed) / this.config.jobs).toFixed(2)}%`);

    const timeLeft: string = `Time Left: ${utils.getDiffTimeByTimestamp(
      this.timeStart,
      this.timeEnd,
      this.config.jobs - this.processed
    )}`;
    const jobsLeft: string = `${this.processed}/${this.config.jobs}`;
    process.stdout.write(`${out} ${chalk.bold(jobsLeft)} ${chalk.bold.yellow(timeLeft)}`);
  }

  async getJobsUrl(): Promise<Array<IJobData>> {
    const urls: Array<IJobData> = [];
    for (let i = 1; i <= this.pages; i++) {
      const url: string = `https://www.work.ua/jobs/?ss=1&page=${i}`;
      process.stdout.write(`Getting jobs url ${`${this.processedUrls}/${this.config.jobs}`}`);
      const { data: content } = await axios.get(url);
      process.stdout.write('\r\x1b[K');
      const $ = cheerio.load(content);
      $('h2.add-bottom-sm > a').each((index, element) => {
        urls.push({
          url: `https://www.work.ua${$(element).attr('href')}`
        });
        this.processedUrls++;
      });
    }
    return urls.slice(0, this.config.jobs);
  }

  async getDetails(data: IJobData): Promise<IJobData> {
    if (this.config.displayStatus) this.displayStatus();
    this.timeStart = Date.now();
    let details: IJobData = {};
    switch (this.config.way) {
      case 'axios':
        details = await this.getDetailsByAxios(<string>data.url);
        break;
      case 'puppeteer':
        details = await this.getDetailsByPuppeteer(<string>data.url);
        break;
      default:
        details = await this.getDetailsByAxios(<string>data.url);
        break;
    }
    this.timeEnd = Date.now();
    if (this.processed !== 0) process.stdout.write('\r\x1b[K');
    return Object.assign(details, data);
  }

  private async getDetailsByAxios(url: string) {
    const response: AxiosResponse = await axios.get(url);
    return this.parseData(response.data);
  }

  private async getDetailsByPuppeteer(url: string) {
    const content: string = await puppeteer.getPageContent(url);
    return this.parseData(content);
  }

  private parseData(content: string) {
    const $ = cheerio.load(content);

    const obj: IJobData = {
      company: 'none',
      city: 'none',
      contactPerson: 'none',
      jobName: 'none',
      url: 'none',
      keywords: 'none'
    };

    obj.jobName = $('h1.add-top-sm').text();

    $('dl.dl-horizontal')
      .children()
      .each((index, element) => {
        switch ($(element).text()) {
          case 'Компанія:':
            obj.company = $(element)
              .next()
              .children('dd > a')
              .text();
            break;
          case 'Місто:':
            obj.city = $(element)
              .next()
              .text();
            break;
          case 'Контактна особа:':
            obj.contactPerson = $(element)
              .next()
              .text();
            break;
          case 'Місце роботи:':
            obj.address = $(element)
              .next()
              .text()
              .trim();
            break;

          default:
            break;
        }
      });

    return obj;
  }
}
