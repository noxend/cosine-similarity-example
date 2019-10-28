export = {
  service: {
    workua: {
      jobs: 100,
      displayStatus: true,
      way: 'axios' //Enum: puppeteer, axios. Default: axios
    },
    robotaua: {
      startWith: 200,
      jobs: 10000,
      displayStatus: true,
      way: 'axios' //Enum: puppeteer, axios. Default: axios
    }
  },
  browser: {
    headless: true, // Only for puppeteer
    defaultViewport: { width: 1920, height: 1080 }
  }
};
