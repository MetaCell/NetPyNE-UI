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
    failureThresholdType: 'percent',
    failureThreshold: 0.5
};


//USERS:
const USERNAME = 'color_picker_TestUser'
const PASSWORD = 'testpassword'

//TESTS:

jest.setTimeout(300000);



describe('Test for the Control Panel - color picker', () => {

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

        await page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 30 })
        await page.waitForTimeout(PAGE_WAIT * 7)
        await page.click(selectors.FILE_TAB_SELECTOR)
        await page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 10 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.NEW_FILE_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await page.click(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT });


        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

        console.log('Page opened successfully')

    })

    it('Load Tutorial#2', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        console.log('Loading Tutorial #2')
        await page.click(selectors.TUTORIAL_2_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForSelector(selectors.PYR_2_CELL_SELECTOR)
        await page.waitForSelector(selectors.INT_CELL_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        console.log('Tutorial #2 loaded successfully')


    })


    it('Create network', async () => {

        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await page.click(selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Create network')

        await page.waitForSelector(selectors.DISABLED_RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        console.log('Network created successfully')

        await page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Tutorial#2 Network'
            });
    })

    it('Open Color Picker Menu', async () => {

        console.log('Opening Control Panel')

        await page.waitForSelector('div[title="Control Panel"]')

        await page.click('div[title="Control Panel"]')

        await page.waitForSelector('ul[role="tree"]')

        const network_items = (await page.$$('li[role="treeitem"]')).length;
        await expect(network_items).toEqual(3)

        console.log('Control Panel displayed successfully')

    })

    
});