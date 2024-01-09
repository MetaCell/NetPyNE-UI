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
let browser_experiment_manager;
let experiment_manager_page;


describe('Experiment Manager test using Tut#1', () => {

    beforeAll(async () => {
        browser_experiment_manager = await puppeteer.launch(
            {
              headless: 'new',
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
              defaultViewport: {
                width: 1300,
                height: 1024
              },
            }
          );
          experiment_manager_page = await browser_experiment_manager.newPage(); 
        await experiment_manager_page.goto(baseURL);
        if (baseURL.includes('test.netpyne.metacell.us')) {
            console.log('Logging in as test user ...')
            await experiment_manager_page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR);
            await experiment_manager_page.waitForSelector(selectors.USERNAME_SELECTOR)
            await expect(experiment_manager_page)
              .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });
      
            await experiment_manager_page.waitForSelector(selectors.PASSWORD_SELECTOR)
            await expect(experiment_manager_page)
              .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });
      
            await experiment_manager_page.click(selectors.LOGIN_BUTTON_SELECTOR)
            // Wait for initial loading spinner to disappear
            await experiment_manager_page.waitForFunction(() => {
              let el = document.querySelector('#loading-spinner');
              return el == null || el.clientHeight === 0;
            }, { timeout: TIMEOUT });
            console.log('Logged in successfully')
          }
    });

    afterAll(async () => {
        // Close the browser instance after all tests have run
        await browser_experiment_manager.close();
      });

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page')

        await experiment_manager_page.on("dialog", dialog =>
            dialog.accept());

        await experiment_manager_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 6, visible: true })
        await experiment_manager_page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await experiment_manager_page.click(selectors.FILE_TAB_SELECTOR)
        await experiment_manager_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await experiment_manager_page.click(selectors.NEW_FILE_SELECTOR)
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await experiment_manager_page.waitForSelector(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_NEW_PAGE_SELECTOR)
        await experiment_manager_page.waitForTimeout(PAGE_WAIT * 2)

        await experiment_manager_page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT });

        await experiment_manager_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

        console.log('Page opened successfully')

    })

    it('Load Tutorial#1', async () => {

        await experiment_manager_page.waitForTimeout(PAGE_WAIT * 2)
        await experiment_manager_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await click(experiment_manager_page, selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        console.log('Tutorial #1')
        await click(experiment_manager_page, selectors.TUTORIAL_1_SELECTOR, { timeout: TIMEOUT })
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await experiment_manager_page.waitForSelector(selectors.PYR_CELL_SELECTOR)
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)


    })


    it('Create network', async () => {

        await experiment_manager_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await click(experiment_manager_page, selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await experiment_manager_page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await click(experiment_manager_page, selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Create network')

        await experiment_manager_page.waitForSelector(selectors.DISABLED_RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        await experiment_manager_page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);
        expect(await experiment_manager_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Tutorial#1 Network'
            });
    })

    it('Set an Experiment in the Experiment Manager ', async () => {

        console.log('Setting up experiment')

        await experiment_manager_page.waitForSelector(selectors.EXPERIMENT_MANAGER_TAB_SELECTOR)
        await experiment_manager_page.click(selectors.EXPERIMENT_MANAGER_TAB_SELECTOR)
        await experiment_manager_page.waitForSelector(selectors.CREATE_NEW_EXPERIMENT_SELECTOR)
        await experiment_manager_page.click(selectors.CREATE_NEW_EXPERIMENT_SELECTOR)

        await experiment_manager_page.waitForSelector(selectors.CREATE_NEW_EXPERIMENT_POPUP_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.waitForSelector(selectors.EXPERIMENT_NAME_SELECTOR)

        await expect(experiment_manager_page).toFill(selectors.EXPERIMENT_NAME_SELECTOR, 'Test Experiment')
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);

        await experiment_manager_page.click(selectors.PARAMETER_SELECTION_SELECTOR)


        await experiment_manager_page.evaluate(() => {
            let parameter = document.querySelectorAll('li[class="MuiAutocomplete-option"]');
            for (var i = 0; i < parameter.length; i++) {
                parameter[i].innerHTML.includes("numCells") && parameter[i].click();
            }
        });

        await experiment_manager_page.waitForTimeout(PAGE_WAIT);

        const inputFromValue = await experiment_manager_page.$eval('#undefined-from', el => el.value);
        await experiment_manager_page.click(selectors.FROM_VALUE_SELECTOR);
        for (let i = 0; i < inputFromValue.length; i++) {
            await experiment_manager_page.keyboard.press('Backspace');
        }

        await experiment_manager_page.type(selectors.FROM_VALUE_SELECTOR, '1')

        const inputToValue = await experiment_manager_page.$eval('#undefined-to', el => el.value);
        await experiment_manager_page.click(selectors.TO_VALUE_SELECTOR);
        for (let i = 0; i < inputToValue.length; i++) {
            await experiment_manager_page.keyboard.press('Backspace');
        }

        await experiment_manager_page.type(selectors.TO_VALUE_SELECTOR, '4')

        const inputStepValue = await experiment_manager_page.$eval('#undefined-step', el => el.value);
        await experiment_manager_page.click(selectors.STEP_VALUE_SELECTOR);
        for (let i = 0; i < inputStepValue.length; i++) {
            await experiment_manager_page.keyboard.press('Backspace');
        }

        await experiment_manager_page.type(selectors.STEP_VALUE_SELECTOR, '1')

        await experiment_manager_page.waitForTimeout(PAGE_WAIT);

        await experiment_manager_page.click(selectors.CREATE_EXPERIMENT_BUTTON_SELECTOR)

        await experiment_manager_page.waitForSelector(selectors.EXPERIMENT_TABLE_HEADER_SELECTOR)
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);

        const experiment_name = await experiment_manager_page.evaluate(() => {
            document.querySelector('h6[class="MuiTypography-root experimentHead MuiTypography-h6"]').textContent
        });

        const experimentName = await experiment_manager_page.$eval('th[class="MuiTableCell-root MuiTableCell-body"]', el => el.innerText.trim());
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);
        expect(experimentName).toBe('Test_Experiment')
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);

        console.log('Experiment created')

    })

    it('Simulate All conditions', async () => {

        await experiment_manager_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await click(experiment_manager_page, selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await experiment_manager_page.waitForSelector(selectors.SIMULATE_NETWORK_SELECTOR)
        await click(experiment_manager_page, selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Simulating all conditions')
        await experiment_manager_page.waitForSelector(selectors.SIMULATE_POPUP_SELECTOR)
        await experiment_manager_page.click(selectors.SIMULATE_POPUP_SELECTOR)
        await experiment_manager_page.waitForSelector(selectors.CONFIRM_SIMULATE_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_SIMULATE_SELECTOR)

        await experiment_manager_page.waitForTimeout(PAGE_WAIT);

        await experiment_manager_page.waitForSelector(selectors.CONFIRM_EXPERIMENT_STARTED_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_EXPERIMENT_STARTED_SELECTOR)

        await experiment_manager_page.waitForSelector(selectors.SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });
        await experiment_manager_page.waitForSelector(selectors.SIMULATION_LOADER_SELECTOR, { hidden: false, timeout: TIMEOUT * 5 })
        await experiment_manager_page.waitForSelector(selectors.SIMULATION_LOADER_SELECTOR, { hidden: true, timeout: TIMEOUT * 10 })
        console.log('Experiment Simulation finished')

    });

    it('Check Experiment Condition #1', async () => {

        console.log('Checking experiment condition #1')

        await experiment_manager_page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await experiment_manager_page.waitForTimeout(PAGE_WAIT * 2)

        await experiment_manager_page.waitForSelector(selectors.CELL_TYPES_TAB_SELECTOR)
        await experiment_manager_page.click(selectors.CELL_TYPES_TAB_SELECTOR)

        await experiment_manager_page.evaluate(() => {
            let sections = document.querySelectorAll('div[class="MuiButtonBase-root MuiListItem-root makeStyles-selected-23 MuiListItem-dense MuiListItem-button"]');
            for (var i = 0; i < sections.length; i++) {
                sections[i].textContent.includes("Experiment Manager") && sections[i].click();
            }
        });

        await experiment_manager_page.waitForTimeout(PAGE_WAIT)


        await experiment_manager_page.waitForSelector(selectors.EXPERIMENT_TABLE_SELECTOR)
        await experiment_manager_page.click(selectors.CREATED_EXPERIMENT_SELECTOR)

        await experiment_manager_page.waitForSelector(selectors.EXPERIMENT_CONDIIONS_ROW_SELECTOR)

        await experiment_manager_page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[0].innerHTML.includes("label") && results[0].click();
            }
        });

        await experiment_manager_page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);
        expect(await experiment_manager_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Experiment Condition #1'
            });


    })



    it('Check Experiment Condition #2', async () => {

        console.log('Checking experiment condition #2')

        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await experiment_manager_page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await experiment_manager_page.waitForTimeout(PAGE_WAIT * 3)

        await experiment_manager_page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[1].innerHTML.includes("label") && results[1].click();
            }
        });

        await experiment_manager_page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);
        expect(await experiment_manager_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Experiment Condition #2'
            });


    })

    it('Check Experiment Condition #3', async () => {

        console.log('Checking experiment condition #3')

        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await experiment_manager_page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await experiment_manager_page.waitForTimeout(PAGE_WAIT * 3)

        await experiment_manager_page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[2].innerHTML.includes("label") && results[2].click();
            }
        });

        await experiment_manager_page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await experiment_manager_page.waitForTimeout(PAGE_WAIT);
        expect(await experiment_manager_page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Experiment Condition #3'
            });


    })

    it('Delete Experiment', async () => {

        console.log('Deleting experiment')

        await experiment_manager_page.waitForTimeout(PAGE_WAIT)
        await experiment_manager_page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await experiment_manager_page.waitForTimeout(PAGE_WAIT)

        await experiment_manager_page.click(selectors.EDIT_EXPERIMENT_BACK_SELECTOR)

        await experiment_manager_page.waitForTimeout(PAGE_WAIT)

        await experiment_manager_page.evaluate(() => {
            let results = document.querySelectorAll('button[class="MuiButtonBase-root MuiButton-root MuiButton-text experimentIcon"]');
            for (var i = 0; i < results.length; i++) {
                results[1].innerHTML.includes("label") && results[1].click();
            }
        });

        await experiment_manager_page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await experiment_manager_page.click(selectors.CONFIRM_SELECTOR)

        await experiment_manager_page.waitForFunction(() => !document.querySelector('tr[class="MuiTableRow-root"]'));

    })

});