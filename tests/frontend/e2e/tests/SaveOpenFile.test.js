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

const EDITED_MODEL =
    '{"E2": {"cellType": "E", "numCells": 5, "yRange": [100, 300]}, "E4": {"cellType": "E", "numCells": 5, "yRange": [300, 600]}, "E5": {"cellType": "E", "numCells": 5, "ynormRange": [0.6, 1]}, "I2": {"cellType": "I", "numCells": 5, "yRange": [100, 300]}, "I4": {"cellType": "I", "numCells": 5, "yRange": [300, 600]}, "I5": {"cellType": "I", "numCells": 5, "ynormRange": [0.6, 1]}}'


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

        await page.waitForSelector(selectors.FILE_SYSTEM_SELECTOR)
        await page.click(selectors.LEVEL_UP_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.FOLDERS_SELECTOR)

        const folder_num = await page.$$(selectors.FOLDERS_SELECTOR)

        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'src').click();
        });

        await page.waitForTimeout(PAGE_WAIT)

        const folder_num_src = await page.$$(selectors.FOLDERS_SELECTOR)

        expect(folder_num_src.length).toBeGreaterThan(folder_num.length)

        await page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'netpyne').click();
        });
        await page.waitForTimeout(PAGE_WAIT)

        const folder_num_netpyne = await page.$$(selectors.FOLDERS_SELECTOR)
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

        const folder_num_netClamp = await page.$$(selectors.FOLDERS_SELECTOR)
        expect(folder_num_netClamp.length).toBeGreaterThan(folder_num_netpyne.length)

        await page.click(selectors.SELECT_BUTTON_SELECTOR)

        await page.waitForSelector(selectors.E_RULE_SELECTOR)

        console.log('Model Loaded')

    })

    it('Create and Simulate opened model', async () => {
        console.log('Instantiating and Simulating model...')

        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForSelector(selectors.NETWORK_CREATION_MENU_BUTTON_SELECTOR)
        await page.click(selectors.NETWORK_CREATION_MENU_BUTTON_SELECTOR)

        await page.waitForSelector(selectors.NETWORK_CREATION_MENU_ITEMS_SELECTOR)
        await page.evaluate(() => {
            [...document.querySelectorAll('#split-button-menu > li')].find(element => element.innerText === 'CREATE AND SIMULATE').click();
        });

        await page.waitForSelector(selectors.NETWORK_CREATION_BUTTON_SELECTOR)
        await page.click(selectors.NETWORK_CREATION_BUTTON_SELECTOR)

        await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT * 2 });

        await page.waitForSelector(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

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
        await page.waitForSelector(selectors.POPULATIONS_TAB_SELECTOR)
        await page.click(selectors.POPULATIONS_TAB_SELECTOR)
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

        await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT * 2 });

        await page.waitForSelector(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

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
        await page.waitForSelector(selectors.SAVE_MENU_SELECTOR)

        const inputValue = await page.$eval(selectors.PATH_INPUT_SELECTOR, el => el.value);
        await page.click(selectors.PATH_INPUT_SELECTOR, { clickCount: 3 });
        await page.waitForTimeout(PAGE_WAIT)

        expect(page).toFill(selectors.PATH_INPUT_SELECTOR, '/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test')
        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.click(selectors.SAVE_BUTTON_SELECTOR)
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
        await page.waitForSelector(selectors.SAVE_MENU_SELECTOR)

        const inputValue = await page.$eval(selectors.PATH_INPUT_SELECTOR, el => el.value);
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        expect(page).toFill(selectors.PATH_INPUT_SELECTOR, '/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test_net_params')
        await page.waitForTimeout(PAGE_WAIT)

        await page.evaluate(() => {
            [...document.querySelectorAll('.MuiAccordionSummary-content')].find(element => element.innerText === "Advanced Options").click();
        });

        await page.waitForSelector(selectors.EXPORT_OPTIONS_SELECTOR)
        await page.waitForSelector(selectors.CHECKBOX_OPTION_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        const checkbox_buttons = await page.$$(selectors.CHECKBOX_OPTION_SELECTOR)

        await checkbox_buttons[0].click()
        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.SAVE_BUTTON_SELECTOR)
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
        await page.waitForSelector(selectors.SAVE_MENU_SELECTOR)

        const inputValue = await page.$eval(selectors.PATH_INPUT_SELECTOR, el => el.value);
        for (let i = 0; i < inputValue.length; i++) {
            await page.keyboard.press('Backspace');
        }
        await page.waitForTimeout(PAGE_WAIT)

        expect(page).toFill(selectors.PATH_INPUT_SELECTOR, '/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test_sim_config')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.evaluate(() => {
            [...document.querySelectorAll('.MuiAccordionSummary-content')].find(element => element.innerText === "Advanced Options").click();
        });

        await page.waitForSelector(selectors.EXPORT_OPTIONS_SELECTOR)
        await page.waitForSelector(selectors.CHECKBOX_OPTION_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        const checkbox_buttons = await page.$$(selectors.CHECKBOX_OPTION_SELECTOR)
        await checkbox_buttons[1].click()
        await page.waitForTimeout(PAGE_WAIT)

        await page.waitForTimeout(PAGE_WAIT * 3)
        await page.click(selectors.SAVE_BUTTON_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)
        console.log('Model saved with SimConfig as Python')

    })

    it('Check default Saved Model', async () => {
        console.log('Checking default saved model ...')
        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector(selectors.PYTHON_CONSOLE_TAB_SELECTOR)

        await page.click(selectors.PYTHON_CONSOLE_TAB_SELECTOR)
        await page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        await python_frame.waitForSelector(selectors.PYTHON_CELL_SELECTOR)
        const line = await python_frame.$(selectors.PYTHON_CELL_SELECTOR)
        await line.click()
        await line.type('pwd')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await python_frame.waitForSelector(selectors.PYTHON_FIRST_OUTPUT_SELECTOR)

        await page.waitForTimeout(PAGE_WAIT * 3)

        const first_code_output = await python_frame.$$eval(selectors.PYTHON_FIRST_OUTPUT_SELECTOR, pwd_code_outputs => {
            return pwd_code_outputs.map(pwd_code_output => pwd_code_output.innerText)
        })

        expect(first_code_output[0]).toBe("'/home/jovyan/work/NetPyNE-UI/workspace'")

        const code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await code_lines[1].type('cd uploads/aut_test/src')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const second_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, cd_code_outputs => {
            return cd_code_outputs.map(cd_code_output => cd_code_output.innerText)
        })

        expect(second_code_output[0]).toBe("/home/jovyan/work/NetPyNE-UI/workspace/uploads/aut_test/src\n")

        const ls_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await ls_code_lines[2].type('ls -l')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const third_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, ls_code_outputs => {
            return ls_code_outputs.map(ls_code_output => ls_code_output.innerText)
        })

        expect(third_code_output[1]).toContain("cfg.json")
        expect(third_code_output[1]).toContain("netParams.json")

        console.log('Model saved correctly')

    })

    it('Check netParams.py Saved Model', async () => {
        console.log('Checking netParams.py saved model ...')

        await page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        const cd_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await cd_code_lines[2].type('cd ../../')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const net_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await net_code_lines[3].type('cd aut_test_net_params/src')
        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const ls_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await ls_code_lines[4].type('ls -l')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const netParam_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, np_code_outputs => {
            return np_code_outputs.map(np_code_output => np_code_output.innerText)
        })

        expect(netParam_code_output[4]).toContain("cfg.json")
        expect(netParam_code_output[4]).toContain("netParams.py")

        console.log('Model saved correctly')
    })

    it('Check cfg.py Saved Model', async () => {
        console.log('Checking cfg.py saved model ...')

        await page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        const cd_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await cd_code_lines[5].type('cd ../../')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const net_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await net_code_lines[6].type('cd aut_test_sim_config/src')
        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const ls_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await ls_code_lines[7].type('ls -l')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const simConfig_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, sc_code_outputs => {
            return sc_code_outputs.map(sc_code_output => sc_code_output.innerText)
        })

        expect(simConfig_code_output[7]).toContain("cfg.py")
        expect(simConfig_code_output[7]).toContain("netParams.json")
        console.log('Model saved correctly')

    })

    it('Check the edited Populations of the Saved Model', async () => {

        console.log('Checking the edited Populations of the saved model ...')

        await page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        const code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await code_lines[8].type('cat netParams.json ')

        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        await page.waitForTimeout(PAGE_WAIT * 3)

        const cat_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, cat_code_outputs => {
            return cat_code_outputs.map(cat_code_output => cat_code_output.innerText)
        })

        var obj = JSON.parse(cat_code_output[8])

        expect(obj.net.params.popParams).toEqual(JSON.parse(EDITED_MODEL))

    })
})