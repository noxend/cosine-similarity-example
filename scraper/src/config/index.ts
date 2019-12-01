export = {
  service: {
    workua: {
      jobs: 100,
      displayStatus: true,
      way: 'axios' //Enum: puppeteer, axios. Default: axios
    },
    robotaua: {
      startWith: 1,
      jobs: 100,
      displayStatus: true,
      way: 'axios' //Enum: puppeteer, axios. Default: axios
    }
  },
  browser: {
    headless: false, // Only for puppeteer
    defaultViewport: { width: 1920, height: 1080 }
  }
};
