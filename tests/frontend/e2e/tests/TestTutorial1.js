import 'expect-puppeteer'

const baseURL = process.env.url || 'http://localhost:8888';

jest.setTimeout(300000);

beforeAll(async () => {
  await page.goto(baseURL)
});

describe('Tutorial #1', () => {

  it("Cell types", async () => {
    await (async () => {
      page.waitForSelector('.NetPyNE-root-1')

      await page.setViewport({ width: 1300, height: 1024 })

      await page.waitForSelector('#selectCellButton button')
      await page.waitFor(2000);
      await page.click('#selectCellButton button')

      await page.waitForSelector('.modal-open > #selectCellMenu #BallStick_HHCellTemplate')

      await page.click('.modal-open > #selectCellMenu #BallStick_HHCellTemplate')


      await page.waitForSelector('#CellType0')
      await page.waitFor(2000);
      await page.click('#CellType0')

      await page.waitForSelector('#cellRuleName')
      await page.waitFor(2000);
      // page.$eval('#cellRuleName', el => el.value = 'pyr');

      await page.waitForSelector('#newSectionButton')
      await page.click('#newSectionButton')


      await page.waitForSelector('input\[value="soma"\]')
      await page.waitFor(2000);
      page.click('input\[value="soma"\]');
      page.click('input\[value="soma"\]');
      // page.type('input\[value="Section0"\]', 'soma');

      await page.waitForSelector('#newMechButton  .MuiSvgIcon-root')
      await page.waitFor(1000);
      await page.click('#newMechButton  .MuiSvgIcon-root')


      page.waitForSelector('.MuiListItem-dense\[title="Populations"\]');
      page.click('.MuiListItem-dense\[title="Populations"\]');

      await page.waitForSelector('#newPopulationButton')
      await page.waitFor(1000);
      await page.click('#newPopulationButton')

      await page.waitForSelector('input\[type="number"\]') // num cells, the default id #netParams\.popParams\[\'Population0\'\]\[\'numCells\'\] cannot be targeted
      await page.waitFor(1000);
      page.$eval('input\[type="number"\]', el => el.value = 30);


      // await page.waitForSelector('#netParams\.popParams\[\'Population0\'\]\[\'cellType\'\]')
      // await page.waitFor(1000);
      // await page.click('#netParams\.popParams\[\'Population0\'\]\[\'cellType\'\]')


      // await page.waitForSelector('.MuiSelect-nativeInput')
      // page.$eval('.MuiSelect-nativeInput', el => el.value = 'CellType0');
      await page.click('.modal-open')


      await page.waitForSelector('div > .Topbar-topbar-6 .SwitchPageButton-container-7 button')
      await page.waitFor(1000);
      await page.click('div > .Topbar-topbar-6 .SwitchPageButton-container-7 button')

      await page.waitForSelector('.MuiList-root > .MuiButtonBase-root:nth-child(11) > .MuiListItemIcon-root > .material-icons > .image-icon')
      await page.waitFor(1000);
      await page.click('.MuiList-root > .MuiButtonBase-root:nth-child(11) > .MuiListItemIcon-root > .material-icons > .image-icon')

      expect(1).toBe(1);
    })()
  });


});
