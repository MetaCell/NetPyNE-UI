//IMPORTS:
import 'expect-puppeteer';
import puppeteer from 'puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const path = require('path');
var scriptName = path.basename(__filename, '.js');
import * as selectors from './selectors'




//PAGE INFO:
const baseURL = process.env.url || 'https://test.netpyne.metacell.us/'
const PAGE_WAIT = 5000;
const TIMEOUT = 600000;

//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: `./tests/snapshots/${scriptName}`,
    comparisonMethod: 'ssim',
    customDiffConfig: {
        ssim: 'fast',
    },
    failureThresholdType: 'percent',
    failureThreshold: 0.5
};


let r = (Math.random() + 1).toString(36).substring(2);


//USERS:
const USERNAME = `TestUser${r}`
const PASSWORD = 'testpassword'



//TESTS:

jest.setTimeout(600000);
let browser_RxD;
let RxD_page;

describe('RxD testing', () => {

    beforeAll(async () => {
        browser_RxD = await puppeteer.launch(
            {
              headless: 'new',
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
              defaultViewport: {
                width: 1300,
                height: 1024
              },
            }
          );
          RxD_page = await browser_RxD.newPage(); 
        await RxD_page.goto(baseURL);
        if (baseURL.includes('test.netpyne.metacell.us')) {
            console.log('Logging in as test user ...')
            await RxD_page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR);
            await RxD_page.waitForSelector(selectors.USERNAME_SELECTOR)
            await expect(RxD_page)
              .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });
      
            await RxD_page.waitForSelector(selectors.PASSWORD_SELECTOR)
            await expect(RxD_page)
              .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });
      
            await RxD_page.click(selectors.LOGIN_BUTTON_SELECTOR)
            // Wait for initial loading spinner to disappear
            await RxD_page.waitForFunction(() => {
              let el = document.querySelector('#loading-spinner');
              return el == null || el.clientHeight === 0;
            }, { timeout: TIMEOUT });
            console.log('Logged in successfully')
          }
    });

    afterAll(async () => {
        // Close the browser instance after all tests have run
        await browser_RxD.close();
      });

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page ...')

        await RxD_page.on("dialog", dialog =>
            dialog.accept());

        await RxD_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 6, visible: true })
        await RxD_page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.click(selectors.FILE_TAB_SELECTOR)
        await RxD_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.click(selectors.NEW_FILE_SELECTOR)
        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.waitForSelector(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await RxD_page.click(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await RxD_page.waitForTimeout(PAGE_WAIT * 3)

        await RxD_page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT * 3 });

        await RxD_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

        console.log('Page opened successfully')

    })

    it('Load Tutorial 3b', async () => {

        await RxD_page.waitForTimeout(PAGE_WAIT * 2)
        await RxD_page.waitForSelector('#selectCellButton', { timeout: TIMEOUT })

        console.log('Loading Tutorial #3b ...')

        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.waitForSelector(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await RxD_page.click(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await RxD_page.waitForSelector(selectors.TUTORIAL_3B_SELECTOR, { timeout: TIMEOUT })
        await RxD_page.click(selectors.TUTORIAL_3B_SELECTOR, { timeout: TIMEOUT })
        await RxD_page.waitForSelector('#E')
        await RxD_page.waitForSelector('#I')
        await RxD_page.waitForTimeout(PAGE_WAIT)

        console.log('Tutorial loaded')

    })

    it('Create and Simulate Network', async () => {


        await RxD_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await RxD_page.click(selectors.MODEL_BUTTON_SELECTOR);
        await RxD_page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await RxD_page.click(selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Creating network ...')

        await RxD_page.waitForTimeout(PAGE_WAIT * 3)

        await RxD_page.waitForSelector('div[title="3D Representation"][aria-disabled="false"]')
        await RxD_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await RxD_page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await RxD_page.waitForSelector(selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
        await RxD_page.click(selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
        console.log('Simulating network ...')

        await RxD_page.waitForSelector('div[title="Raster plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })

        await RxD_page.waitForTimeout(PAGE_WAIT)

        console.log('Network created and simulated')

    })

    it('Check RxD Plot', async () => {
        console.log('Opening the RxD plot ...')

        await RxD_page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.click('div[title="RxD concentration plot"][aria-disabled="false"]')
        await RxD_page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await RxD_page.waitForTimeout(PAGE_WAIT);
        expect(await RxD_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'RxD Plot'
            });
        await RxD_page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP Time Series Plot', async () => {
        console.log('Opening the LFP TS plot ...')

        await RxD_page.waitForSelector('div[title="LFP Time Series Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.click('div[title="LFP Time Series Plot"][aria-disabled="false"]')
        await RxD_page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await RxD_page.waitForTimeout(PAGE_WAIT);
        expect(await RxD_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP Time Series Plot Before change'
            });
        await RxD_page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP PSD Plot', async () => {
        console.log('Opening the LFP PSD plot ...')

        await RxD_page.waitForSelector('div[title="LFP PSD Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.click('div[title="LFP PSD Plot"][aria-disabled="false"]')
        await RxD_page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await RxD_page.waitForTimeout(PAGE_WAIT);
        expect(await RxD_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP PSD Plot Before change'
            });
        await RxD_page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')

    })

    it('Go back to Edit', async () => {

        console.log('Going back to Edit ...')
        await RxD_page.waitForSelector('.MuiButtonBase-root.MuiButton-root.MuiButton-contained')
        await RxD_page.evaluate(() => {
            [...document.querySelectorAll('.MuiButtonBase-root.MuiButton-root.MuiButton-contained')].find(element => element.innerText === "BACK TO EDIT").click();
        });
        await RxD_page.waitForSelector('#E')
        await RxD_page.waitForSelector('#I')
        console.log('Edit mode displayed')

    })

    it('Open RxD Tab ', async () => {
        
        console.log('Opening RxD tab ...')
        await RxD_page.waitForSelector('div[title="Reaction-Diffusion"]')
        await RxD_page.click('div[title="Reaction-Diffusion"]')

        await RxD_page.waitForSelector('#simple-tabpanel-0')

        console.log('RxD Tab Opened')

    })

    it('Change RxD Configuration', async () => {
        console.log('Opening RxD config ...')

        await RxD_page.waitForSelector('#simple-tabpanel-1')
        await RxD_page.click('#simple-tab-1')

        await RxD_page.waitForSelector('button[aria-selected="true"][id = "simple-tab-1"]')

        await RxD_page.waitForSelector('#ip3')
        console.log('Species tab opened')
        await RxD_page.waitForTimeout(PAGE_WAIT)
        
    })

    it('Increase IP3 species concentration', async () => {

        console.log('Increasing IP3 concentration ...')

        await RxD_page.waitForSelector('#ip3')
        await RxD_page.click('#ip3')
        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.waitForSelector('#netParamsrxdParamsspeciesip3regions')
        await RxD_page.waitForSelector('#netParamsrxdParamsspeciesip3d')
        await RxD_page.waitForSelector('#netParamsrxdParamsspeciesip3charge')
        await RxD_page.waitForSelector('#netParamsrxdParamsspeciesip3initial')
        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.click('#netParamsrxdParamsspeciesip3initial')
        await RxD_page.keyboard.press('Backspace');
        await RxD_page.keyboard.press('Backspace');
        await RxD_page.keyboard.press('Backspace');
        await RxD_page.type('#netParamsrxdParamsspeciesip3initial', '2')
        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.click('#netParamsrxdParamsspeciesip3charge')
        await RxD_page.waitForTimeout(PAGE_WAIT)
        await RxD_page.waitForSelector('#netParamsrxdParamsspeciesip3initial[value = "2"]')

        console.log('IP3 increased')

    })

    
    it('Create and Simulate Network', async () => {

        await RxD_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await RxD_page.click(selectors.MODEL_BUTTON_SELECTOR);
        await RxD_page.waitForSelector(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR)
        await RxD_page.click(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Creating and simulating network ...')

        await RxD_page.waitForTimeout(PAGE_WAIT * 3)

        await RxD_page.waitForSelector('div[title="Raster plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })

        await RxD_page.waitForTimeout(PAGE_WAIT)

        console.log('Network created and simulated')
    })

    it('Check RxD Plot', async () => {

        console.log('Opening the RxD plot ...')

        await RxD_page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.click('div[title="RxD concentration plot"][aria-disabled="false"]')
        await RxD_page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await RxD_page.waitForTimeout(PAGE_WAIT);
        expect(await RxD_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'RxD Plot'
            });
        await RxD_page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP Time Series Plot', async () => {

        console.log('Opening the LFP TS plot ...')

        await RxD_page.waitForSelector('div[title="LFP Time Series Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.click('div[title="LFP Time Series Plot"][aria-disabled="false"]')
        await RxD_page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await RxD_page.waitForTimeout(PAGE_WAIT);
        expect(await RxD_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP Time Series Plot After change'
            });
        await RxD_page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP PSD Plot', async () => {

        console.log('Opening the LFP PSD plot ...')

        await RxD_page.waitForSelector('div[title="LFP PSD Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await RxD_page.click('div[title="LFP PSD Plot"][aria-disabled="false"]')
        await RxD_page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await RxD_page.waitForTimeout(PAGE_WAIT);
        expect(await RxD_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP PSD Plot After change'
            });
        await RxD_page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')

    })


})