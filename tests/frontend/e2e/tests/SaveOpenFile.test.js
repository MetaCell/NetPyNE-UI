//IMPORTS:
import 'expect-puppeteer';
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

const EDITED_MODEL = `\"popParams\": {
    \"E2\": {
        \"cellType\": \"E\",
        \"numCells\": 5,
        \"yRange\": [
            100,
            300
        ]
    },
    \"E4\": {
        \"cellType\": \"E\",
        \"numCells\": 5,
        \"yRange\": [
            300,
            600
        ]
    },
    \"E5\": {
        \"cellType\": \"E\",
        \"numCells\": 5,
        \"ynormRange\": [
            0.6,
            1.0
        ]
    },
    \"I2\": {
        \"cellType\": \"I\",
        \"numCells\": 5,
        \"yRange\": [
            100,
            300
        ]
    },
    \"I4\": {
        \"cellType\": \"I\",
        \"numCells\": 5,
        \"yRange\": [
            300,
            600
        ]
    },
    \"I5\": {
        \"cellType\": \"I\",
        \"numCells\": 5,
        \"ynormRange\": [
            0.6,
            1.0
        ]
    }
},`

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

    it('Check default Saved Model', async () => {
        console.log('Checking default saved model ...')
        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector('div[title="Python"]')

        await page.click('div[title="Python"]')
        await page.waitForSelector('#pythonConsoleOutput')

        const elementHandle = await page.waitForSelector(
            '#pythonConsoleFrame'
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector('#ipython-main-app')

        await python_frame.waitForSelector('div.inner_cell')
        const line = await python_frame.$('div.inner_cell')
        await line.click()
        await line.type('pwd')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await python_frame.waitForSelector('div[class="output_subarea output_text output_result"]')

        await page.waitForTimeout(PAGE_WAIT * 3)

        const first_code_output = await python_frame.$$eval('div[class="output_subarea output_text output_result"]', pwd_code_outputs => {
            return pwd_code_outputs.map(pwd_code_output => pwd_code_output.innerText)
        })

        expect(first_code_output[0]).toBe("'/home/jovyan/work/NetPyNE-UI/workspace'")

        const code_lines = await python_frame.$$('div.inner_cell')

        await code_lines[1].type('cd uploads/aut_test/src')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const second_code_output = await python_frame.$$eval('div[class="output_subarea output_text output_stream output_stdout"]', cd_code_outputs => {
            return cd_code_outputs.map(cd_code_output => cd_code_output.innerText)
        })

        expect(second_code_output[0]).toBe("/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test/src\n")

        const ls_code_lines = await python_frame.$$('div.inner_cell')

        await ls_code_lines[1].type('ls -l')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const third_code_output = await python_frame.$$eval('div[class="output_subarea output_text output_stream output_stdout"]', ls_code_outputs => {
            return ls_code_outputs.map(ls_code_output => ls_code_output.innerText)
        })

        expect(third_code_output[1]).toContain("cfg.json")
        expect(third_code_output[1]).toContain("netParams.json")

        console.log('Model saved correctly')

    })

    it('Check netParams.py Saved Model', async () => {
        console.log('Checking netParams.py saved model ...')

        await page.waitForSelector('#pythonConsoleOutput')

        const elementHandle = await page.waitForSelector(
            '#pythonConsoleFrame'
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector('#ipython-main-app')

        const cd_code_lines = await python_frame.$$('div.inner_cell')

        await cd_code_lines[2].type('cd ../../')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const net_code_lines = await python_frame.$$('div.inner_cell')

        await net_code_lines[3].type('cd aut_test_net_params/src')
        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const ls_code_lines = await python_frame.$$('div.inner_cell')

        await ls_code_lines[3].type('ls -l')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const netParam_code_output = await python_frame.$$eval('div[class="output_subarea output_text output_stream output_stdout"]', np_code_outputs => {
            return np_code_outputs.map(np_code_output => np_code_output.innerText)
        })

        expect(netParam_code_output[4]).toContain("cfg.json")
        expect(netParam_code_output[4]).toContain("netParams.py")

        console.log('Model saved correctly')
    })

    it('Check cfg.py Saved Model', async () => {
        console.log('Checking cfg.py saved model ...')

        await page.waitForSelector('#pythonConsoleOutput')

        const elementHandle = await page.waitForSelector(
            '#pythonConsoleFrame'
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector('#ipython-main-app')

        const cd_code_lines = await python_frame.$$('div.inner_cell')

        await cd_code_lines[4].type('cd ../../')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const net_code_lines = await python_frame.$$('div.inner_cell')

        await net_code_lines[5].type('cd aut_test_sim_config/src')
        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const ls_code_lines = await python_frame.$$('div.inner_cell')

        await ls_code_lines[6].type('ls -l')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const simConfig_code_output = await python_frame.$$eval('div[class="output_subarea output_text output_stream output_stdout"]', sc_code_outputs => {
            return sc_code_outputs.map(sc_code_output => sc_code_output.innerText)
        })

        expect(simConfig_code_output[7]).toContain("cfg.py")
        expect(simConfig_code_output[7]).toContain("netParams.json")
        console.log('Model saved correctly')

    })

    it('Check the edited Populations of the Saved Model', async () => {

        console.log('Checking cfg.py saved model ...')

        await page.waitForSelector('#pythonConsoleOutput')

        const elementHandle = await page.waitForSelector(
            '#pythonConsoleFrame'
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector('#ipython-main-app')

        const code_lines = await python_frame.$$('div.inner_cell')

        await code_lines[7].type('cat netParams.json ')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const cat_code_output = await python_frame.$$eval('div[class="output_subarea output_text output_stream output_stdout"]', cat_code_outputs => {
            return cat_code_outputs.map(cat_code_output => cat_code_output.innerText)
        })

        expect(cat_code_output[8]).toContain(EDITED_MODEL)

    })



})