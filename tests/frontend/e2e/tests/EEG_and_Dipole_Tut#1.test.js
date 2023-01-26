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
const USERNAME = 'EEG_and_Dipole_Test_User_2'
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

   


});