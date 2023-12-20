//IMPORTS:
import 'expect-puppeteer';
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
    failureThreshold: 0.05
};


let r = (Math.random() + 1).toString(36).substring(2);


//USERS:
const USERNAME = `TestUser${r}`
const PASSWORD = 'testpassword'



//TESTS:

jest.setTimeout(600000);

describe('RxD testing', () => {

    beforeAll(async () => {
        await page.goto(baseURL);
        if (baseURL.includes('test.netpyne.metacell.us')) {
            console.log('Logging in as test user ...')
            await page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR);
            await page.waitForSelector(selectors.USERNAME_SELECTOR)
            await expect(page)
              .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });
      
            await page.waitForSelector(selectors.PASSWORD_SELECTOR)
            await expect(page)
              .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });
      
            await page.click(selectors.LOGIN_BUTTON_SELECTOR)
            // Wait for initial loading spinner to disappear
            await page.waitForFunction(() => {
              let el = document.querySelector('#loading-spinner');
              return el == null || el.clientHeight === 0;
            }, { timeout: TIMEOUT });
            console.log('Logged in successfully')
          }
    });

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page ...')

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

    it('Load Tutorial 3b', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector('#selectCellButton', { timeout: TIMEOUT })

        console.log('Loading Tutorial #3b ...')

        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await page.click(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await page.waitForSelector(selectors.TUTORIAL_3B_SELECTOR, { timeout: TIMEOUT })
        await page.click(selectors.TUTORIAL_3B_SELECTOR, { timeout: TIMEOUT })
        await page.waitForSelector('#E')
        await page.waitForSelector('#I')
        await page.waitForTimeout(PAGE_WAIT)

        console.log('Tutorial loaded')

    })

    it('Create and Simulate Network', async () => {


        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await page.click(selectors.MODEL_BUTTON_SELECTOR);
        await page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await page.click(selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Creating network ...')

        await page.waitForTimeout(PAGE_WAIT * 3)

        await page.waitForSelector('div[title="3D Representation"][aria-disabled="false"]')
        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
        await page.click(selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
        console.log('Simulating network ...')

        await page.waitForSelector('div[title="Raster plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })

        await page.waitForTimeout(PAGE_WAIT)

        console.log('Network created and simulated')

    })

    it('Check RxD Plot', async () => {
        console.log('Opening the RxD plot ...')

        await page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.click('div[title="RxD concentration plot"][aria-disabled="false"]')
        await page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'RxD Plot'
            });
        await page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP Time Series Plot', async () => {
        console.log('Opening the LFP TS plot ...')

        await page.waitForSelector('div[title="LFP Time Series Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.click('div[title="LFP Time Series Plot"][aria-disabled="false"]')
        await page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP Time Series Plot Before change'
            });
        await page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP PSD Plot', async () => {
        console.log('Opening the LFP PSD plot ...')

        await page.waitForSelector('div[title="LFP PSD Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.click('div[title="LFP PSD Plot"][aria-disabled="false"]')
        await page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP PSD Plot Before change'
            });
        await page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')

    })

    it('Go back to Edit', async () => {

        console.log('Going back to Edit ...')
        await page.waitForSelector('.MuiButtonBase-root.MuiButton-root.MuiButton-contained')
        await page.evaluate(() => {
            [...document.querySelectorAll('.MuiButtonBase-root.MuiButton-root.MuiButton-contained')].find(element => element.innerText === "BACK TO EDIT").click();
        });
        await page.waitForSelector('#E')
        await page.waitForSelector('#I')
        console.log('Edit mode displayed')

    })

    it('Open RxD Tab ', async () => {
        
        console.log('Opening RxD tab ...')
        await page.waitForSelector('div[title="Reaction-Diffusion"]')
        await page.click('div[title="Reaction-Diffusion"]')

        await page.waitForSelector('#simple-tabpanel-0')

        //TO CHANGE
        const regions_text = await page.$$eval('#simple-tabpanel-0', regions_text => {
            return regions_text.map(regions_text => regions_text.innerText)
        })

        expect(regions_text[0]).toContain('Regions')

        console.log('RxD Tab Opened')

    })

    it('Change RxD Configuration', async () => {
        console.log('Opening RxD config ...')

        await page.waitForSelector('#simple-tabpanel-1')
        await page.click('#simple-tab-1')

        await page.waitForSelector('button[aria-selected="true"][id = "simple-tab-1"]')

        await page.waitForSelector('#ip3')
        console.log('Species tab opened')
        await page.waitForTimeout(PAGE_WAIT)
        
    })

    it('Increase IP3 species concentration', async () => {

        console.log('Increasing IP3 concentration ...')

        await page.waitForSelector('#ip3')
        await page.click('#ip3')
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector('#netParamsrxdParamsspeciesip3regions')
        await page.waitForSelector('#netParamsrxdParamsspeciesip3d')
        await page.waitForSelector('#netParamsrxdParamsspeciesip3charge')
        await page.waitForSelector('#netParamsrxdParamsspeciesip3initial')
        await page.waitForTimeout(PAGE_WAIT)
        await page.click('#netParamsrxdParamsspeciesip3initial')
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.type('#netParamsrxdParamsspeciesip3initial', '2')
        await page.waitForTimeout(PAGE_WAIT)
        await page.click('#netParamsrxdParamsspeciesip3charge')
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector('#netParamsrxdParamsspeciesip3initial[value = "2"]')

        console.log('IP3 increased')

    })

    
    it('Create and Simulate Network', async () => {

        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await page.click(selectors.MODEL_BUTTON_SELECTOR);
        await page.waitForSelector(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR)
        await page.click(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Creating and simulating network ...')

        await page.waitForTimeout(PAGE_WAIT * 3)

        await page.waitForSelector('div[title="Raster plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })

        await page.waitForTimeout(PAGE_WAIT)

        console.log('Network created and simulated')
    })

    it('Check RxD Plot', async () => {

        console.log('Opening the RxD plot ...')

        await page.waitForSelector('div[title="RxD concentration plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.click('div[title="RxD concentration plot"][aria-disabled="false"]')
        await page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'RxD Plot'
            });
        await page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP Time Series Plot', async () => {

        console.log('Opening the LFP TS plot ...')

        await page.waitForSelector('div[title="LFP Time Series Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.click('div[title="LFP Time Series Plot"][aria-disabled="false"]')
        await page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP Time Series Plot After change'
            });
        await page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')
    })
    it('Check LFP PSD Plot', async () => {

        console.log('Opening the LFP PSD plot ...')

        await page.waitForSelector('div[title="LFP PSD Plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.click('div[title="LFP PSD Plot"][aria-disabled="false"]')
        await page.waitForSelector('div.flexlayout__tabset')

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'LFP PSD Plot After change'
            });
        await page.waitForTimeout(PAGE_WAIT);
        console.log('Plot displayed')

    })


})