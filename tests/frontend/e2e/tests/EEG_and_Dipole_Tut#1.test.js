//IMPORTS:
import 'expect-puppeteer';
import puppeteer from 'puppeteer';
import { click } from './utils';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const path = require('path');
var scriptName = path.basename(__filename, '.js');
import * as selectors from './selectors'


//PAGE INFO:
const baseURL = process.env.url || 'https://test.netpyne.metacell.us/'
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
let browser_EEG_Dipole;
let EEG_Dipole_page;

beforeAll(async () => {

    browser_EEG_Dipole = await puppeteer.launch(
        {
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          defaultViewport: {
            width: 1300,
            height: 1024
          },
        }
      );
      EEG_Dipole_page = await browser_EEG_Dipole.newPage(); 
    await EEG_Dipole_page.goto(baseURL);
    if (baseURL.includes('test.netpyne.metacell.us')) {
        console.log('Logging in as test user ...')
        await EEG_Dipole_page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR);
        await EEG_Dipole_page.waitForSelector(selectors.USERNAME_SELECTOR)
        await expect(EEG_Dipole_page)
          .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });
  
        await EEG_Dipole_page.waitForSelector(selectors.PASSWORD_SELECTOR)
        await expect(EEG_Dipole_page)
          .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });
  
        await EEG_Dipole_page.click(selectors.LOGIN_BUTTON_SELECTOR)
        // Wait for initial loading spinner to disappear
        await EEG_Dipole_page.waitForFunction(() => {
          let el = document.querySelector('#loading-spinner');
          return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT });
        console.log('Logged in successfully')
      }
});

afterAll(async () => {
    // Close the browser instance after all tests have run
    await browser_EEG_Dipole.close();
  });

describe('EEG and Dipole Plot Test using Tutorial#1', () => {

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page')

        await EEG_Dipole_page.on("dialog", dialog =>
            dialog.accept());

        await EEG_Dipole_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 6, visible: true })
        await EEG_Dipole_page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)
        await EEG_Dipole_page.click(selectors.FILE_TAB_SELECTOR)
        await EEG_Dipole_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)
        await EEG_Dipole_page.click(selectors.NEW_FILE_SELECTOR)
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)
        await EEG_Dipole_page.waitForSelector(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await EEG_Dipole_page.click(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 2)

        await EEG_Dipole_page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT });

        await EEG_Dipole_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

        console.log('Page opened successfully')

    })


    it('Load Tutorial#1', async () => {

        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 3)
        await EEG_Dipole_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 2 })
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 2)
        await EEG_Dipole_page.click(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        await console.log('Loading Tutorial #1')
        await EEG_Dipole_page.click(selectors.TUTORIAL_1_SELECTOR, { timeout: TIMEOUT })
        await EEG_Dipole_page.waitForSelector(selectors.PYR_CELL_SELECTOR)
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)


    })

    it('Configure recording ', async () => {

        await console.log('Setting Recording configuration')

        await EEG_Dipole_page.waitForSelector(selectors.CONFIGURATION_TAB_SELECTOR)
        await EEG_Dipole_page.click(selectors.CONFIGURATION_TAB_SELECTOR)

        await EEG_Dipole_page.waitForSelector(selectors.RECORDING_CONFIGURATION_TAB_SELECTOR)
        await EEG_Dipole_page.click(selectors.RECORDING_CONFIGURATION_TAB_SELECTOR)
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)

        await EEG_Dipole_page.waitForSelector(selectors.TRACES_TO_RECORD_SELECTOR)
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)
        await EEG_Dipole_page.waitForSelector(selectors.DIPOLE_LFPYKIT_SELECTOR)
        // await expect(page).toClick(selectors.DIPOLE_LFPYKIT_SELECTOR)
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)
        await EEG_Dipole_page.click(selectors.DIPOLE_LFPYKIT_SELECTOR)
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)

    })

    it('Create network', async () => {

        await EEG_Dipole_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await EEG_Dipole_page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await EEG_Dipole_page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await EEG_Dipole_page.click(selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        await console.log('Create network')

        await EEG_Dipole_page.waitForSelector(selectors.DISABLED_EEG_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })
        await EEG_Dipole_page.waitForSelector(selectors.DISABLED_DIPOLE_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT)

        await console.log('... taking snapshot ...');
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT);
        expect(await EEG_Dipole_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Tutorial#1 Network'
            });
    })

    it('Simulate network', async () => {

        await EEG_Dipole_page.waitForSelector(selectors.SIMULATE_BUTTON_SELECTOR)
        await EEG_Dipole_page.click(selectors.SIMULATE_BUTTON_SELECTOR, { timeout: TIMEOUT });

        await console.log('Simulate network')

        await EEG_Dipole_page.waitForSelector(selectors.SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });

        await EEG_Dipole_page.waitForSelector(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 5 })
        await EEG_Dipole_page.waitForSelector(selectors.EEG_PLOT_SELECTOR, { timeout: TIMEOUT * 5 })
        await EEG_Dipole_page.waitForSelector(selectors.DIPOLE_PLOT_SELECTOR, { timeout: TIMEOUT * 5 })
    });

    it('Dipole Plot', async () => {

        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 2);
        await EEG_Dipole_page.click(selectors.DIPOLE_PLOT_SELECTOR)
        await EEG_Dipole_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

        await console.log('View Dipole Plot ...')

        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 20);
        await EEG_Dipole_page.click(selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT);
        await EEG_Dipole_page.click(selectors.DIPOLE_PLOT_SELECTOR)
        await EEG_Dipole_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 3);

        await console.log('... taking snapshot ...');
        expect(await EEG_Dipole_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Dipole Plot'
            });
    });


    it('EEG Plot', async () => {

        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 2);
        await EEG_Dipole_page.click(selectors.EEG_PLOT_SELECTOR)
        await EEG_Dipole_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

        await console.log('View EEG Plot ...')

        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 25);
        await EEG_Dipole_page.click(selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 2);
        await EEG_Dipole_page.click(selectors.EEG_PLOT_SELECTOR)
        await EEG_Dipole_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
        await EEG_Dipole_page.waitForTimeout(PAGE_WAIT * 3);

        await console.log('... taking snapshot ...');
        expect(await EEG_Dipole_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'EEG Plot'
            });

    });




});