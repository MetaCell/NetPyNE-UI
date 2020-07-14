
jest.setTimeout(300000);
beforeAll(async () => {

});
  
describe('Smoke test', () => {
  it("Tutorial #1 edit and simulate", async () => {
    const puppeteer = require('puppeteer');
    await (async () => {

      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage() 

      await page.goto('http://localhost:8888')

      page.waitForSelector('.NetPyNE-root-1')

      await page.setViewport({ width: 1300, height: 1024 })
  
      await page.waitForSelector('.flexlayout__tab:nth-child(3) > div > .MuiGrid-root > .MuiGrid-root > .MuiPaper-root')
      await page.click('.flexlayout__tab:nth-child(3) > div > .MuiGrid-root > .MuiGrid-root > .MuiPaper-root')
      
      await page.waitForSelector('.Topbar-topbar-6 > span > span > #Tutorials > .MuiButton-label')
      await page.click('.Topbar-topbar-6 > span > span > #Tutorials > .MuiButton-label')
     
      
      await page.waitForSelector('div > .Topbar-topbar-6 > .SwitchPageButton-container-7 > .MuiButtonBase-root > .MuiButton-label')
      await page.click('div > .Topbar-topbar-6 > .SwitchPageButton-container-7 > .MuiButtonBase-root > .MuiButton-label')
      
      await browser.close()
      expect(1).toBe(1);
    })()
  });
  
      
});
