import puppeteer, { Browser, Page } from 'puppeteer';
import config from './config';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Puppeteer {
  private browser: Browser | null;
  private static instance: Puppeteer;
  private constructor() {
    this.browser = null;
  }

  public static init(): Puppeteer {
    if (!Puppeteer.instance) Puppeteer.instance = new Puppeteer();

    return Puppeteer.instance;
  }

  public async openBrowser(): Promise<void> {
    this.browser = await puppeteer.launch(config.browser);
  }

  public async closeBrowser(): Promise<void> {
    await (<Browser>this.browser).close();
  }

  public async makeScreenshot(url: string): Promise<void> {
    if (!this.browser) throw new Error('Browser must be running!');
    try {
      const page = await (<Browser>this.browser).newPage();
      await page.goto(url);
      await page.screenshot({ path: 'example.png' });
      await page.close();
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getPageContent(url: string): Promise<string> {
    if (!this.browser) throw new Error('Browser must be running!');
    try {
      const page = await (<Browser>this.browser).newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
      const content = await page.content();
      await page.close();

      return content;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async createPage(): Promise<Page> {
    if (!this.browser) throw new Error('Browser must be running!');
    try {
      const page = await (<Browser>this.browser).newPage();

      return page;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default Puppeteer.init();
