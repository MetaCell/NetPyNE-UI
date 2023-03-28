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

    it('Create and Simulate opened model', async () => {
        console.log('Instantiating and Simulating model...')

        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForSelector('button[aria-label="select merge strategy"]')
        await page.click('button[aria-label="select merge strategy"]')

        await page.waitForSelector('#split-button-menu > li')
        await page.evaluate(() => {
            [...document.querySelectorAll('#split-button-menu > li')].find(element => element.innerText === 'CREATE AND SIMULATE').click();
        });

        await page.waitForSelector('div[aria-label="split button"]')
        await page.click('div[aria-label="split button"]')

        await page.waitForSelector('canvas', { timeout: TIMEOUT * 2 });

        await page.waitForSelector('div[title="Raster plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT)
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'NetClamp Model'
            });
        console.log('Model Simulated')
    })

    it('Change the instantiated model', async () => {
        console.log('Editing model ...')

        await page.evaluate(() => {
            [...document.querySelectorAll('button[class = "MuiButtonBase-root MuiButton-root MuiButton-contained"]')].find(element => element.innerText === 'BACK TO EDIT').click();
        });
        await page.waitForSelector('div[title="Populations"]')
        await page.click('div[title="Populations"]')
        await page.waitForSelector('#E2')

        await page.click('#E2')
        await page.waitForSelector('#netParamspopParamsE2numCells')
        expect(page).toFill('#netParamspopParamsE2numCells', '5')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.click('#I2')
        await page.waitForSelector('#netParamspopParamsI2numCells')
        expect(page).toFill('#netParamspopParamsI2numCells', '5')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.click('#E4')
        await page.waitForSelector('#netParamspopParamsE4numCells')
        expect(page).toFill('#netParamspopParamsE4numCells', '5')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.click('#I4')
        await page.waitForSelector('#netParamspopParamsI4numCells')
        expect(page).toFill('#netParamspopParamsI4numCells', '5')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.click('#E5')
        await page.waitForSelector('#netParamspopParamsE5numCells')
        expect(page).toFill('#netParamspopParamsE5numCells', '5')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.click('#I5')
        await page.waitForSelector('#netParamspopParamsI5numCells')
        expect(page).toFill('#netParamspopParamsI5numCells', '5')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
        await page.click(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        await page.waitForSelector('canvas', { timeout: TIMEOUT * 2 });

        await page.waitForSelector('div[title="Raster plot"][aria-disabled="false"]', { timeout: TIMEOUT * 3 })

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT)
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Edited NetClamp Model'
            });

        console.log('Model updated')
    })

    it('Save model', async () => {
        console.log('Saving model ...')

        await page.click(selectors.FILE_TAB_SELECTOR)
        await page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.evaluate(async () => {
            document.getElementById("Save...").click();
        })
        await page.waitForSelector('h2[class="MuiTypography-root MuiTypography-h6"]')

        const inputValue = await page.$eval('input[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedStart MuiFilledInput-inputAdornedStart"]', el => el.value);
        await page.click('input[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedStart MuiFilledInput-inputAdornedStart"]', { clickCount: 3 });
        await page.waitForTimeout(PAGE_WAIT)

        expect(page).toFill('input[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedStart MuiFilledInput-inputAdornedStart"]', '/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test')
        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.click('#appBarPerformActionButton')
        await page.waitForTimeout(PAGE_WAIT)

        console.log('Model saved as default')
    })

    it('Save model - NetParams', async () => {
        console.log('Saving model with NetParams as Python ...')

        await page.click(selectors.FILE_TAB_SELECTOR)
        await page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.evaluate(async () => {
            document.getElementById("Save...").click();
        })
        await page.waitForSelector('h2[class="MuiTypography-root MuiTypography-h6"]')

        const inputValue = await page.$eval('input[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedStart MuiFilledInput-inputAdornedStart"]', el => el.value);
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        expect(page).toFill('input[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedStart MuiFilledInput-inputAdornedStart"]', '/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test_net_params')
        await page.waitForTimeout(PAGE_WAIT)

        await page.evaluate(() => {
            [...document.querySelectorAll('.MuiAccordionSummary-content')].find(element => element.innerText === "Advanced Options").click();
        });

        await page.waitForSelector('ul[class="MuiList-root MuiList-padding"]')
        await page.waitForSelector('input[type="checkbox"]')
        await page.waitForTimeout(PAGE_WAIT)

        const checkbox_buttons = await page.$$('input[type="checkbox"]')

        await checkbox_buttons[0].click()
        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForTimeout(PAGE_WAIT)
        await page.click('#appBarPerformActionButton')
        await page.waitForTimeout(PAGE_WAIT)

        console.log('Model saved with NetParams as Python')

    })

    it('Save model - SimConfig', async () => {
        console.log('Saving model with SimConfig as Python ...')

        await page.click(selectors.FILE_TAB_SELECTOR)
        await page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.evaluate(async () => {
            document.getElementById("Save...").click();
        })
        await page.waitForSelector('h2[class="MuiTypography-root MuiTypography-h6"]')

        const inputValue = await page.$eval('input[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedStart MuiFilledInput-inputAdornedStart"]', el => el.value);
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        expect(page).toFill('input[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedStart MuiFilledInput-inputAdornedStart"]', '/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test_sim_config')
        await page.waitForTimeout(PAGE_WAIT)

        await page.evaluate(() => {
            [...document.querySelectorAll('.MuiAccordionSummary-content')].find(element => element.innerText === "Advanced Options").click();
        });

        await page.waitForSelector('ul[class="MuiList-root MuiList-padding"]')
        await page.waitForSelector('input[type="checkbox"]')
        await page.waitForTimeout(PAGE_WAIT)

        const checkbox_buttons = await page.$$('input[type="checkbox"]')
        await checkbox_buttons[1].click()
        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForTimeout(PAGE_WAIT * 3)
        await page.click('#appBarPerformActionButton')
        await page.waitForTimeout(PAGE_WAIT)
        console.log('Model saved with SimConfig as Python')

    })

})