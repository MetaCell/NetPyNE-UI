//IMPORTS:
import 'expect-puppeteer';
import { click } from './utils';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const path = require('path');
var scriptName = path.basename(__filename, '.js');
import * as selectors from './selectors'


//PAGE INFO:
const baseURL = process.env.url || 'https://stage.netpyne.metacell.us/'
const PAGE_WAIT = 3000;
const TIMEOUT = 60000;

//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: `./tests/snapshots/${scriptName}`,
    comparisonMethod: 'ssim',
    customDiffConfig: {
        ssim: 'fast',
    },
    failureThresholdType: 'percent',
    failureThreshold: 0.2
};


let r = (Math.random() + 1).toString(36).substring(2);

//USERS:
const USERNAME = `TestUser${r}`
const PASSWORD = 'testpassword'


//TESTS:

jest.setTimeout(300000);

describe('Save / Open File testing', () => {

    beforeAll(async () => {
        await page.goto(baseURL);
        await page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR);
        await page.waitForSelector(selectors.USERNAME_SELECTOR)
        await expect(page)
            .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });

        await page.waitForSelector(selectors.PASSWORD_SELECTOR)
        await expect(page)
            .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });

        await page.click(selectors.LOGIN_BUTTON_SELECTOR)

        await page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT });
    });

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page')

        await page.on("dialog", dialog =>
            dialog.accept());

        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 6, visible: true })
        await page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.FILE_TAB_SELECTOR)
        await page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.NEW_FILE_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await page.click(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT * 3)

        await page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT * 3 });

        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

        console.log('Page opened successfully')

    })

    it('Open model from File > Open', async () => {
        console.log('Opening model from File')

        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector(selectors.FILE_TAB_SELECTOR)
        await page.click(selectors.FILE_TAB_SELECTOR)
        await page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await page.waitForTimeout(PAGE_WAIT)

        await page.evaluate(async () => {
            document.getElementById("Open...").click();
        })

        await page.waitForSelector('.ReactVirtualized__Grid__innerScrollContainer')
        await page.click('.fa-level-up')
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')

        const folder_num = await page.$$('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')

        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'src').click();
        });

        await page.waitForTimeout(PAGE_WAIT)

        const folder_num_src = await page.$$('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')

        expect(folder_num_src.length).toBeGreaterThan(folder_num.length)

        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'netpyne').click();
        });
        await page.waitForTimeout(PAGE_WAIT)

        const folder_num_netpyne = await page.$$('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')
        expect(folder_num_netpyne.length).toBeGreaterThan(folder_num_src.length)

        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'examples').scrollIntoView();
        });

        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'examples').click();
        });
        await page.waitForTimeout(PAGE_WAIT * 2)


        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'HybridTut').scrollIntoView();
        });
        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'netClamp').click();
        });
        await page.waitForTimeout(PAGE_WAIT * 2)

        const folder_num_netClamp = await page.$$('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')
        expect(folder_num_netClamp.length).toBeGreaterThan(folder_num_netpyne.length)

        await page.click('#browserAccept')

        await page.waitForSelector('#Erule')

        console.log('Model Loaded')

    })

})