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
    this.pages = Math.ceil(config.jobs / 20);
    this.processed = this.config.startWith === 1 ? 0 : this.config.startWith * 20;
    this.processedUrls = this.config.startWith === 1 ? 0 : this.config.startWith * 20;
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

    const pagesProcessed: string = `Pages processed: ${Math.floor(this.processed / 20)}/${this.pages}`;
    const jobsLeft: string = `Jobs processed: ${this.processed}/${this.config.jobs}`;
    process.stdout.write(
      `${out} ${chalk.bold(jobsLeft)} ${chalk.cyan.bold(pagesProcessed)} ${chalk.bold.yellow(timeLeft)}`
    );
  }

  async getJobsUrl(): Promise<Array<IJobData>> {
    const urls: Array<object> = [];
    for (let i = this.config.startWith; i <= this.pages; i++) {
      const url: string = `https://rabota.ua/ua/jobsearch/vacancy_list?pg=${i}`;
      process.stdout.write(chalk.green.bold(`Getting jobs url ${this.processedUrls}/${this.config.jobs}`));

      const { data: content } = await axios.get(url);
      process.stdout.write('\r\x1b[K');
      const $ = cheerio.load(content);
      $('h3.fd-beefy-gunso.f-vacancylist-vacancytitle').each((index, element) => {
        urls.push({
          companyUrl: `https://rabota.ua${$(element)
            .next()
            .children()
            .attr('href')}`,
          company: $(element)
            .next()
            .children()
            .text()
            .trim(),
          url: `https://rabota.ua${$(element)
            .children('a.f-visited-enable')
            .attr('href')}`
        });
        this.processedUrls++;
      });
    }
    return urls.slice(0, this.config.jobs);
  }

  async getDetails(data: IJobData): Promise<IJobData> {
    if (this.config.displayStatus) this.displayStatus();
    this.timeStart = Date.now();
    let content: string = '';
    switch (this.config.way) {
      case 'axios':
        content = await this.getContentByAxios(<string>data.url);
        break;
      case 'puppeteer':
        content = await this.getContentByPuppeteer(<string>data.url);
        break;
      default:
        content = await this.getContentByAxios(<string>data.url);
        break;
    }
    this.timeEnd = Date.now();
    if (this.processed !== this.config.jobs && this.config.displayStatus) process.stdout.write('\r\x1b[K');
    return Object.assign(await this.parseData(content), {
      ...data,
      company: (data.company as string).replace(/\'/g, "''")
    });
  }

  async getKeywords(data: IJobData): Promise<Array<string>> {
    if (this.config.displayStatus) this.displayStatus();
    this.timeStart = Date.now();
    let content: string = '';
    switch (this.config.way) {
      case 'axios':
        content = await this.getContentByAxios(<string>data.url);
        break;
      default:
        content = await this.getContentByAxios(<string>data.url);
        break;
    }
    this.timeEnd = Date.now();
    if (this.processed !== this.config.jobs) process.stdout.write('\r\x1b[K');
    return this.parseKeywords(content);
  }

  private async getContentByAxios(url: string): Promise<string> {
    const response: AxiosResponse = await axios.get(url);
    return response.data;
  }

  private async getContentByPuppeteer(url: string): Promise<string> {
    const content: string = await puppeteer.getPageContent(url);
    return content;
  }

  private parseKeywords(content: string): Array<string> {
    const $ = cheerio.load(content);
    const skils: Array<string> = [];

    $('li.fd-craftsmen').each((index, element) => {
      skils.push(
        $(element)
          .text()
          .trim()
      );
    });

    return skils;
  }

  private parseData(content: string) {
    const $ = cheerio.load(content);
    const skils: string[] = [];
    const obj: IJobData = {
      company: '',
      city: '',
      contactPerson: '',
      jobName: '',
      url: '',
      keywords: '',
      phone: '',
      site: '',
      salary: ''
    };

    $('div.f-clusters-item').each((index, element) => {
      const title = $(element)
        .children()
        .first()
        .text()
        .trim();

      if (
        !(
          <boolean>title.toLowerCase().includes('масив') ||
          <boolean>title.toLowerCase().includes('метро') ||
          <boolean>title.toLowerCase().includes('місце роботи') ||
          <boolean>title.toLowerCase().includes('трц') ||
          <boolean>title.toLowerCase().includes('вид зайнятості') ||
          <boolean>title.toLowerCase().includes('рівень') 
        )
      ) {
        $(element)
          .find('li.fd-craftsmen')
          .each((index, element) => {
            skils.push(
              $(element)
                .text()
                .trim()
            );
          });
      }
    });

    obj.company = $('div.f-vacancy-title > a > span > span')
      .text()
      .trim();

    obj.jobName = $('div.f-vacancy-header-wrapper > h1')
      .text()
      .trim()
      .replace(/\'/g, "''");

    obj.jobName = obj.jobName
      ? obj.jobName
      : $('#ctl00_content_vcVwPopup_VacancyViewInner1_pnlBody > span > div > h1')
          .text()
          .trim()
          .replace(/\'/g, "''");

    obj.jobName = obj.jobName
      ? obj.jobName
      : $('div > h1')
          .text()
          .trim()
          .replace(/\'/g, "''");

    obj.contactPerson = $('i.fi-contact')
      .parent()
      .next()
      .text()
      .replace(/\'/g, "''");

    obj.contactPerson = obj.contactPerson
      ? obj.contactPerson
      : $('li#d-person > span.d-ph-value')
          .text()
          .trim()
          .replace(/\'/g, "''");

    obj.phone = $('span.opencontact')
      .text()
      .trim();

    obj.salary = $('div.fd-f-left.f-text-black > p > span')
      .text()
      .trim();

    obj.salary = obj.salary
      ? obj.salary
      : $('li#d-salary > span.d-ph-value')
          .text()
          .trim();

    obj.site = $('i.fi-links')
      .parent()
      .next()
      .text()
      .replace(/\'/g, "''");

    obj.city = $('i.fi-location')
      .parent()
      .next()
      .text()
      .split(',')[0]
      .trim()
      .replace(/\'/g, "''");

    obj.city = obj.city
      ? obj.city
      : $('li.d-ph-itemAddress#d-city > span.d-ph-value')
          .text()
          .trim()
          .replace(/\'/g, "''");

    obj.keywords = skils.join(':|:').replace(/\'/g, "''");

    return obj;
  }
}
