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
    // Wait for initial loading spinner to disappear
    await page.waitForFunction(() => {
        let el = document.querySelector('#loading-spinner');
        return el == null || el.clientHeight === 0;
    }, { timeout: TIMEOUT });
});



describe('EEG and Dipole Plot Test using Tutorial#1', () => {

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page')

        await page.on("dialog", dialog =>
            dialog.accept());

        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 4, visible: true })
        await page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.FILE_TAB_SELECTOR)
        await page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
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


    it('Load Tutorial#1', async () => {

        await page.waitForTimeout(PAGE_WAIT * 3)
        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 2 })
        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.click(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        await console.log('Loading Tutorial #1')
        await page.click(selectors.TUTORIAL_1_SELECTOR, { timeout: TIMEOUT })
        await page.waitForSelector(selectors.PYR_CELL_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)


    })

    it('Configure recording ', async () => {

        await console.log('Setting Recording configuration')

        await page.waitForSelector(selectors.CONFIGURATION_TAB_SELECTOR)
        await page.click(selectors.CONFIGURATION_TAB_SELECTOR)

        await page.waitForSelector(selectors.RECORDING_CONFIGURATION_TAB_SELECTOR)
        await page.click(selectors.RECORDING_CONFIGURATION_TAB_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForSelector(selectors.TRACES_TO_RECORD_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.DIPOLE_LFPYKIT_SELECTOR)
        await expect(page).toClick(selectors.DIPOLE_LFPYKIT_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.DIPOLE_LFPYKIT_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

    })

    it('Create network', async () => {

        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await page.click(selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        await console.log('Create network')

        await page.waitForSelector(selectors.DISABLED_EEG_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })
        await page.waitForSelector(selectors.DISABLED_DIPOLE_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        await page.waitForTimeout(PAGE_WAIT)

        await console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Tutorial#1 Network'
            });
    })

    it('Simulate network', async () => {

        await page.waitForSelector(selectors.SIMULATE_BUTTON_SELECTOR)
        await page.click(selectors.SIMULATE_BUTTON_SELECTOR, { timeout: TIMEOUT });

        await console.log('Simulate network')

        await page.waitForSelector(selectors.SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });

        await page.waitForSelector(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 5 })
        await page.waitForSelector(selectors.EEG_PLOT_SELECTOR, { timeout: TIMEOUT * 5 })
        await page.waitForSelector(selectors.DIPOLE_PLOT_SELECTOR, { timeout: TIMEOUT * 5 })
    });

    it('Dipole Plot', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2);
        await page.click(selectors.DIPOLE_PLOT_SELECTOR)
        await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

        await console.log('View Dipole Plot ...')

        await page.waitForTimeout(PAGE_WAIT * 20);
        await page.click(selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT);
        await page.click(selectors.DIPOLE_PLOT_SELECTOR)
        await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT * 3);

        await console.log('... taking snapshot ...');
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Dipole Plot'
            });
    });


    it('EEG Plot', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2);
        await page.click(selectors.EEG_PLOT_SELECTOR)
        await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

        await console.log('View EEG Plot ...')

        await page.waitForTimeout(PAGE_WAIT * 25);
        await page.click(selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT * 2);
        await page.click(selectors.EEG_PLOT_SELECTOR)
        await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT * 3);

        await console.log('... taking snapshot ...');
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'EEG Plot'
            });

    });




});