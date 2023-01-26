//IMPORTS:
import 'expect-puppeteer';
import { click } from './utils';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const path = require('path');
var scriptName = path.basename(__filename, '.js');


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
    failureThreshold: 0.1
};

//SELECTORS:
const BASE_PAGE_SELECTOR = '.NetPyNE-root-1'
const TUTORIALS_BUTTON_SELECTOR = 'button[id = "Tutorials"]'
const TUTORIAL_3A_SELECTOR = 'li[id= "Tut 3a: Multiscale network (low IP3)"]'
const MODEL_BUTTON_SELECTOR = 'button[id="Model"]'
const CREATE_NETWORK_SELECTOR = 'li[id="Create network"]'
const SIMULATE_NETWORK_SELECTOR = 'li[id="Simulate network"]'
const SIMULATION_PAGE_SELECTOR = 'canvas'
const CONNECTIONS_PLOT_SELECTOR = 'div[title=\"Connections Plot\"][role=button]'


//USERS:
const USERNAME = 'EEG_and_Dipole_Userr_'
const PASSWORD = 'password'


//TESTS:

jest.setTimeout(300000);

beforeAll(async () => {
    await page.goto(baseURL);
    await page.waitForSelector('#login-main');
    await page.waitForSelector('#username_input')
    await expect(page)
        .toFill('#username_input', USERNAME, { timeout: TIMEOUT });

    await page.waitForSelector('#password_input')
    await expect(page)
        .toFill('#password_input', PASSWORD, { timeout: TIMEOUT });

    await page.click('#login_submit')
    // Wait for initial loading spinner to disappear
    await page.waitForFunction(() => {
        let el = document.querySelector('#loading-spinner');
        return el == null || el.clientHeight === 0;
    }, { timeout: TIMEOUT });
});



describe('EEG and Dipole Plot Test using Tutorial#1', () => {



    it('Load Tutorial#1', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector('#selectCellButton', { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT * 2)
        await click(page, TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        await console.log('Loading Tutorial #1')
        await click(page, "li[id='Tut 1: Simple cell network']", { timeout: TIMEOUT })
        await page.waitForSelector('#pyr')
        await page.waitForTimeout(PAGE_WAIT)


    })

    it('Configure recording ', async () => {

        await page.waitForSelector('div[title="Configuration"]')
        await page.click('div[title="Configuration"]')
    
        await page.waitForSelector('#configRecord')
        await page.click('#configRecord')
        await page.waitForTimeout(PAGE_WAIT)
    
        await page.waitForSelector(`div[title="Dict of traces to record (default: {} ; example: {'V_soma': {'sec':'soma','loc':0.5,'var':'v'} })."]`)
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(`#simConfigrecordDipole`)
        await expect(page).toClick(`#simConfigrecordDipole`)
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(`#simConfigrecordDipole`)
        await page.waitForTimeout(PAGE_WAIT)
    
      })

      it('Create network', async () => {

        await page.waitForSelector(MODEL_BUTTON_SELECTOR)
        await click(page, MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(CREATE_NETWORK_SELECTOR)
        await click(page, CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
    
        await console.log('Create network')
    
        await page.waitForSelector('div[title="EEG plot"][aria-disabled="true"]', { timeout: TIMEOUT * 3 })
        await page.waitForSelector('div[title="Dipole plot"][aria-disabled="true"]', { timeout: TIMEOUT * 3 })
    
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

        await page.waitForSelector('div[class="MuiButtonGroup-root MuiButtonGroup-contained"]')
        await click(page, 'div[class="MuiButtonGroup-root MuiButtonGroup-contained"]', { timeout: TIMEOUT });
    
        await console.log('Simulate network')
    
        await page.waitForSelector(SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });
    
        await page.waitForSelector('div[title="Raster plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.waitForSelector('div[title="EEG plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
        await page.waitForSelector('div[title="Dipole plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })
      });

      it('Dipole Plot', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2);
        await click(page, 'div[title="Dipole plot"][aria-disabled="false"]')
        await page.waitForSelector('canvas', { timeout: TIMEOUT })

        await console.log('View Dipole Plot ...')

        await page.waitForTimeout(PAGE_WAIT * 10);
        await click(page, CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT);
        await click(page, 'div[title="Dipole plot"][aria-disabled="false"]')
        await page.waitForSelector('canvas', { timeout: TIMEOUT })
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
        await click(page, 'div[title="EEG plot"][aria-disabled="false"]')
        await page.waitForSelector('canvas', { timeout: TIMEOUT })

        await console.log('View EEG Plot ...')

        await page.waitForTimeout(PAGE_WAIT * 12);
        await click(page, CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT*2);
        await click(page, 'div[title="EEG plot"][aria-disabled="false"]')
        await page.waitForSelector('canvas', { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT * 3);
    
        await console.log('... taking snapshot ...');
        expect(await page.screenshot())
          .toMatchImageSnapshot({
            ...SNAPSHOT_OPTIONS,
            customSnapshotIdentifier: 'EEG Plot'
          });
    
      });

   


});