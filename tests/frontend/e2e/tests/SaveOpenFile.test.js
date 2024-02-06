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
let SaveOpen_File_browser;
let SaveOpen_File_page;


describe.skip('Save / Open File testing', () => {

    beforeAll(async () => {
        SaveOpen_File_browser = await puppeteer.launch(
            {
              headless: 'new',
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
              defaultViewport: {
                width: 1300,
                height: 1024
              },
            }
          );
          SaveOpen_File_page = await SaveOpen_File_browser.newPage(); 
        await SaveOpen_File_page.goto(baseURL);
        if (baseURL.includes('test.netpyne.metacell.us')) {
            console.log('Logging in as test user ...')
            await SaveOpen_File_page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR);
            await SaveOpen_File_page.waitForSelector(selectors.USERNAME_SELECTOR)
            await expect(SaveOpen_File_page)
              .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });
      
            await SaveOpen_File_page.waitForSelector(selectors.PASSWORD_SELECTOR)
            await expect(SaveOpen_File_page)
              .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });
      
            await SaveOpen_File_page.click(selectors.LOGIN_BUTTON_SELECTOR)
            // Wait for initial loading spinner to disappear
            await SaveOpen_File_page.waitForFunction(() => {
              let el = document.querySelector('#loading-spinner');
              return el == null || el.clientHeight === 0;
            }, { timeout: TIMEOUT });
            console.log('Logged in successfully')
          }
    });

    afterAll(async () => {
        // Close the browser instance after all tests have run
        await SaveOpen_File_browser.close();
      });

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page')

        await SaveOpen_File_page.on("dialog", dialog =>
            dialog.accept());

        await SaveOpen_File_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 6, visible: true })
        await SaveOpen_File_page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.click(selectors.FILE_TAB_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.click(selectors.NEW_FILE_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.waitForSelector(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await SaveOpen_File_page.click(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        await SaveOpen_File_page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT * 3 });

        await SaveOpen_File_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

        console.log('Page opened successfully')

    })

    it('Open model from File > Open', async () => {
        console.log('Opening model from File')

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)
        await SaveOpen_File_page.waitForSelector(selectors.FILE_TAB_SELECTOR)
        await SaveOpen_File_page.click(selectors.FILE_TAB_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        await SaveOpen_File_page.evaluate(async () => {
            document.getElementById("Open...").click();
        })

        await SaveOpen_File_page.waitForSelector(selectors.FILE_SYSTEM_SELECTOR)
        await SaveOpen_File_page.click(selectors.LEVEL_UP_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.waitForSelector(selectors.FOLDERS_SELECTOR)

        const folder_num = await SaveOpen_File_page.$$(selectors.FOLDERS_SELECTOR)

        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'src').click();
        });

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        const folder_num_src = await SaveOpen_File_page.$$(selectors.FOLDERS_SELECTOR)

        expect(folder_num_src.length).toBeGreaterThan(folder_num.length)

        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'netpyne').click();
        });
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        const folder_num_netpyne = await SaveOpen_File_page.$$(selectors.FOLDERS_SELECTOR)
        expect(folder_num_netpyne.length).toBeGreaterThan(folder_num_src.length)

        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'examples').scrollIntoView();
        });

        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'examples').click();
        });
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)


        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'HybridTut').scrollIntoView();
        });
        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('div[class = "rst__rowContents rst__rowContentsDragDisabled"]')].find(element => element.textContent === 'netClamp').click();
        });
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        const folder_num_netClamp = await SaveOpen_File_page.$$(selectors.FOLDERS_SELECTOR)
        expect(folder_num_netClamp.length).toBeGreaterThan(folder_num_netpyne.length)

        await SaveOpen_File_page.click(selectors.SELECT_BUTTON_SELECTOR)

        await SaveOpen_File_page.waitForSelector(selectors.E_RULE_SELECTOR)

        console.log('Model Loaded')

    })

    it('Create and Simulate opened model', async () => {
        console.log('Instantiating and Simulating model...')

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        await SaveOpen_File_page.waitForSelector(selectors.NETWORK_CREATION_MENU_BUTTON_SELECTOR)
        await SaveOpen_File_page.click(selectors.NETWORK_CREATION_MENU_BUTTON_SELECTOR)

        await SaveOpen_File_page.waitForSelector(selectors.NETWORK_CREATION_MENU_ITEMS_SELECTOR)
        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('#split-button-menu > li')].find(element => element.innerText === 'CREATE AND SIMULATE').click();
        });

        await SaveOpen_File_page.waitForSelector(selectors.NETWORK_CREATION_BUTTON_SELECTOR)
        await SaveOpen_File_page.click(selectors.NETWORK_CREATION_BUTTON_SELECTOR)

        await SaveOpen_File_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT * 2 });

        await SaveOpen_File_page.waitForSelector(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        console.log('... taking snapshot ...');
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        expect(await SaveOpen_File_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'NetClamp Model'
            });
        console.log('Model Simulated')
    })

    it('Change the instantiated model', async () => {
        console.log('Editing model ...')

        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('button[class = "MuiButtonBase-root MuiButton-root MuiButton-contained"]')].find(element => element.innerText === 'BACK TO EDIT').click();
        });
        await SaveOpen_File_page.waitForSelector(selectors.POPULATIONS_TAB_SELECTOR)
        await SaveOpen_File_page.click(selectors.POPULATIONS_TAB_SELECTOR)
        await SaveOpen_File_page.waitForSelector('#E2')

        await SaveOpen_File_page.click('#E2')
        await SaveOpen_File_page.waitForSelector('#netParamspopParamsE2numCells')
        expect(SaveOpen_File_page).toFill('#netParamspopParamsE2numCells', '5')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        await SaveOpen_File_page.click('#I2')
        await SaveOpen_File_page.waitForSelector('#netParamspopParamsI2numCells')
        expect(SaveOpen_File_page).toFill('#netParamspopParamsI2numCells', '5')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        await SaveOpen_File_page.click('#E4')
        await SaveOpen_File_page.waitForSelector('#netParamspopParamsE4numCells')
        expect(SaveOpen_File_page).toFill('#netParamspopParamsE4numCells', '5')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        await SaveOpen_File_page.click('#I4')
        await SaveOpen_File_page.waitForSelector('#netParamspopParamsI4numCells')
        expect(SaveOpen_File_page).toFill('#netParamspopParamsI4numCells', '5')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        await SaveOpen_File_page.click('#E5')
        await SaveOpen_File_page.waitForSelector('#netParamspopParamsE5numCells')
        expect(SaveOpen_File_page).toFill('#netParamspopParamsE5numCells', '5')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        await SaveOpen_File_page.click('#I5')
        await SaveOpen_File_page.waitForSelector('#netParamspopParamsI5numCells')
        expect(SaveOpen_File_page).toFill('#netParamspopParamsI5numCells', '5')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        await SaveOpen_File_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await SaveOpen_File_page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await SaveOpen_File_page.waitForSelector(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
        await SaveOpen_File_page.click(selectors.CREATE_AND_SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        await SaveOpen_File_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT * 2 });

        await SaveOpen_File_page.waitForSelector(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        console.log('... taking snapshot ...');
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        expect(await SaveOpen_File_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Edited NetClamp Model'
            });

        console.log('Model updated')
    })

    it('Save model', async () => {
        console.log('Saving model ...')
        await SaveOpen_File_page.waitForSelector(selectors.FILE_TAB_SELECTOR)
        await SaveOpen_File_page.click(selectors.FILE_TAB_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.evaluate(async () => {
            document.getElementById("Save...").click();
        })
        await SaveOpen_File_page.waitForSelector(selectors.SAVE_MENU_SELECTOR)

        // const inputValue = await page.$eval(selectors.PATH_INPUT_SELECTOR, el => el.value);
        await SaveOpen_File_page.click(selectors.PATH_INPUT_SELECTOR, { clickCount: 3 });
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        expect(SaveOpen_File_page).toFill(selectors.PATH_INPUT_SELECTOR, 'aut_test')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)
        await SaveOpen_File_page.click(selectors.SAVE_BUTTON_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        console.log('Model saved as default')
    })

    it('Save model - NetParams', async () => {
        console.log('Saving model with NetParams as Python ...')

        await SaveOpen_File_page.click(selectors.FILE_TAB_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.evaluate(async () => {
            document.getElementById("Save...").click();
        })
        await SaveOpen_File_page.waitForSelector(selectors.SAVE_MENU_SELECTOR)

        // const inputValue = await page.$eval(selectors.PATH_INPUT_SELECTOR, el => el.value);
        // for (let i = 0; i < inputValue.length; i++) {
        //     await page.keyboard.press('Backspace');
        // }
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        expect(SaveOpen_File_page).toFill(selectors.PATH_INPUT_SELECTOR, 'aut_test_net_params')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('.MuiAccordionSummary-content')].find(element => element.innerText === "Advanced Options").click();
        });

        await SaveOpen_File_page.waitForSelector(selectors.EXPORT_OPTIONS_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.CHECKBOX_OPTION_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        const checkbox_buttons = await SaveOpen_File_page.$$(selectors.CHECKBOX_OPTION_SELECTOR)

        await checkbox_buttons[0].click()
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.click(selectors.SAVE_BUTTON_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        console.log('Model saved with NetParams as Python')

    })

    it('Save model - SimConfig', async () => {
        console.log('Saving model with SimConfig as Python ...')

        await SaveOpen_File_page.click(selectors.FILE_TAB_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        await SaveOpen_File_page.evaluate(async () => {
            document.getElementById("Save...").click();
        })
        await SaveOpen_File_page.waitForSelector(selectors.SAVE_MENU_SELECTOR)

        const inputValue = await SaveOpen_File_page.$eval(selectors.PATH_INPUT_SELECTOR, el => el.value);
        for (let i = 0; i < inputValue.length; i++) {
            await SaveOpen_File_page.keyboard.press('Backspace');
        }
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        expect(SaveOpen_File_page).toFill(selectors.PATH_INPUT_SELECTOR, 'aut_test_sim_config')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)

        await SaveOpen_File_page.evaluate(() => {
            [...document.querySelectorAll('.MuiAccordionSummary-content')].find(element => element.innerText === "Advanced Options").click();
        });

        await SaveOpen_File_page.waitForSelector(selectors.EXPORT_OPTIONS_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.CHECKBOX_OPTION_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        const checkbox_buttons = await SaveOpen_File_page.$$(selectors.CHECKBOX_OPTION_SELECTOR)
        await checkbox_buttons[1].click()
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)
        await SaveOpen_File_page.click(selectors.SAVE_BUTTON_SELECTOR)
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT)
        console.log('Model saved with SimConfig as Python')

    })

    it('Check default Saved Model', async () => {
        console.log('Checking default saved model ...')
        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 2)
        await SaveOpen_File_page.waitForSelector(selectors.PYTHON_CONSOLE_TAB_SELECTOR)

        await SaveOpen_File_page.click(selectors.PYTHON_CONSOLE_TAB_SELECTOR)
        await SaveOpen_File_page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await SaveOpen_File_page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        await python_frame.waitForSelector(selectors.PYTHON_CELL_SELECTOR)
        const line = await python_frame.$(selectors.PYTHON_CELL_SELECTOR)
        await line.click()
        await line.type('pwd')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await python_frame.waitForSelector(selectors.PYTHON_FIRST_OUTPUT_SELECTOR)

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const first_code_output = await python_frame.$$eval(selectors.PYTHON_FIRST_OUTPUT_SELECTOR, pwd_code_outputs => {
            return pwd_code_outputs.map(pwd_code_output => pwd_code_output.innerText)
        })

        expect(first_code_output[0]).toBe("'/opt/workspace/workspace'")

        const code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await code_lines[1].type('cd uploads/aut_test/src')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const second_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, cd_code_outputs => {
            return cd_code_outputs.map(cd_code_output => cd_code_output.innerText)
        })

        expect(second_code_output[0]).toBe("/opt/workspace/workspace/saved_models/aut_test/src\n")

        const ls_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await ls_code_lines[2].type('ls -l')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const third_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, ls_code_outputs => {
            return ls_code_outputs.map(ls_code_output => ls_code_output.innerText)
        })

        expect(third_code_output[1]).toContain("cfg.json")
        expect(third_code_output[1]).toContain("netParams.json")

        console.log('Model saved correctly')

    })

    it('Check netParams.py Saved Model', async () => {
        console.log('Checking netParams.py saved model ...')

        await SaveOpen_File_page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await SaveOpen_File_page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        const cd_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await cd_code_lines[2].type('cd ../../')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const net_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await net_code_lines[3].type('cd aut_test_net_params/src')
        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const ls_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await ls_code_lines[4].type('ls -l')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const netParam_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, np_code_outputs => {
            return np_code_outputs.map(np_code_output => np_code_output.innerText)
        })

        expect(netParam_code_output[4]).toContain("cfg.json")
        expect(netParam_code_output[4]).toContain("netParams.py")

        console.log('Model saved correctly')
    })

    it('Check cfg.py Saved Model', async () => {
        console.log('Checking cfg.py saved model ...')

        await SaveOpen_File_page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await SaveOpen_File_page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        const cd_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await cd_code_lines[5].type('cd ../../')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const net_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await net_code_lines[6].type('cd aut_test_sim_config/src')
        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const ls_code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await ls_code_lines[7].type('ls -l')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const simConfig_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, sc_code_outputs => {
            return sc_code_outputs.map(sc_code_output => sc_code_output.innerText)
        })

        expect(simConfig_code_output[7]).toContain("cfg.py")
        expect(simConfig_code_output[7]).toContain("netParams.json")
        console.log('Model saved correctly')

    })

    it('Check the edited Populations of the Saved Model', async () => {

        console.log('Checking the edited Populations of the saved model ...')

        await SaveOpen_File_page.waitForSelector(selectors.PYTHON_CONSLE_SELECTOR)

        const elementHandle = await SaveOpen_File_page.waitForSelector(
            selectors.PYTHON_CONSOLE_FRAME_SELECTOR
        );

        const python_frame = await elementHandle.contentFrame();

        await python_frame.waitForSelector(selectors.MAIN_PYTHON_APP_SELECTOR)

        const code_lines = await python_frame.$$(selectors.PYTHON_CELL_SELECTOR)

        await code_lines[8].type('cat netParams.json ')

        await SaveOpen_File_page.keyboard.down('Shift');
        await SaveOpen_File_page.keyboard.press('Enter');
        await SaveOpen_File_page.keyboard.up('Shift');

        await SaveOpen_File_page.waitForTimeout(PAGE_WAIT * 3)

        const cat_code_output = await python_frame.$$eval(selectors.PYTHON_OUTPUT_SELECTOR, cat_code_outputs => {
            return cat_code_outputs.map(cat_code_output => cat_code_output.innerText)
        })

        var obj = JSON.parse(cat_code_output[8])

        expect(obj.net.params.popParams).toEqual(JSON.parse(EDITED_MODEL))

    })
})