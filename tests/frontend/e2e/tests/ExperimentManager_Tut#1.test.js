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



//USERS:
const USERNAME = 'Test_User_Experiment_Manager_'
const PASSWORD = 'testpassword'


//TESTS:

jest.setTimeout(300000);



describe('Experiment Manager test using Tut#1', () => {

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

    it('Open new page', async () => {

        console.log('Opening a new NetPyNE page')

        await page.on("dialog", dialog =>
            dialog.accept());

        await page.waitForSelector('#File', { timeout: PAGE_WAIT * 20 })
        await page.waitForTimeout(PAGE_WAIT * 6)
        await page.click('#File')
        await page.waitForSelector('#New', { timeout: PAGE_WAIT * 10 })
        await page.waitForTimeout(PAGE_WAIT)
        await page.click('#New')
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector('#appBarPerformActionButton')
        await page.click('#appBarPerformActionButton')
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT });

        

        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

    })

    it('Load Tutorial#1', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)
        await click(page, selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        console.log('Tutorial #1')
        await click(page, selectors.TUTORIAL_1_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.PYR_CELL_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)


    })


    it('Create network', async () => {

        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await click(page, selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await click(page, selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Create network')

        await page.waitForSelector(selectors.DISABLED_RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        await page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Tutorial#1 Network'
            });
    })

    it('Set an Experiment in the Experiment Manager ', async () => {

        console.log('Setting up experiment')

        await page.waitForSelector(selectors.EXPERIMENT_MANAGER_TAB_SELECTOR)
        await page.click(selectors.EXPERIMENT_MANAGER_TAB_SELECTOR)
        await page.waitForSelector(selectors.CREATE_NEW_EXPERIMENT_SELECTOR)
        await page.click(selectors.CREATE_NEW_EXPERIMENT_SELECTOR)

        await page.waitForSelector(selectors.CREATE_NEW_EXPERIMENT_POPUP_SELECTOR)
        await page.click(selectors.CONFIRM_SELECTOR)
        await page.waitForSelector(selectors.EXPERIMENT_NAME_SELECTOR)

        await expect(page).toFill(selectors.EXPERIMENT_NAME_SELECTOR, 'Test Experiment')
        await page.waitForTimeout(PAGE_WAIT);

        await page.click(selectors.PARAMETER_SELECTION_SELECTOR)


        await page.evaluate(() => {
            let parameter = document.querySelectorAll('li[class="MuiAutocomplete-option"]');
            for (var i = 0; i < parameter.length; i++) {
                parameter[i].innerHTML.includes("numCells") && parameter[i].click();
            }
        });

        await page.waitForTimeout(PAGE_WAIT);

        const inputFromValue = await page.$eval('#undefined-from', el => el.value);
        await page.click(selectors.FROM_VALUE_SELECTOR);
        for (let i = 0; i < inputFromValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        await page.type(selectors.FROM_VALUE_SELECTOR, '1')

        const inputToValue = await page.$eval('#undefined-to', el => el.value);
        await page.click(selectors.TO_VALUE_SELECTOR);
        for (let i = 0; i < inputToValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        await page.type(selectors.TO_VALUE_SELECTOR, '4')

        const inputStepValue = await page.$eval('#undefined-step', el => el.value);
        await page.click(selectors.STEP_VALUE_SELECTOR);
        for (let i = 0; i < inputStepValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        await page.type(selectors.STEP_VALUE_SELECTOR, '1')

        await page.waitForTimeout(PAGE_WAIT);

        await page.click(selectors.CREATE_EXPERIMENT_BUTTON_SELECTOR)

        await page.waitForSelector(selectors.EXPERIMENT_TABLE_HEADER_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT);

        const experiment_name = await page.evaluate(() => {
            document.querySelector('h6[class="MuiTypography-root experimentHead MuiTypography-h6"]').textContent
        });

        const experimentName = await page.$eval('th[class="MuiTableCell-root MuiTableCell-body"]', el => el.innerText.trim());
        await page.waitForTimeout(PAGE_WAIT);
        expect(experimentName).toBe('Test_Experiment')
        await page.waitForTimeout(PAGE_WAIT);

        console.log('Experiment created')

    })

    it('Simulate All conditions', async () => {

        await page.waitForSelector(selectors.SIMULATE_BUTTON_SELECTOR)
        await click(page, selectors.SIMULATE_BUTTON_SELECTOR, { timeout: TIMEOUT });

        console.log('Simulating all conditions')

        await page.waitForSelector(selectors.SIMULATE_POPUP_SELECTOR)
        await page.click(selectors.SIMULATE_POPUP_SELECTOR)
        await page.click(selectors.CONFIRM_SIMULATE_SELECTOR)

        await page.waitForTimeout(PAGE_WAIT);

        await page.waitForSelector(selectors.CONFIRM_EXPERIMENT_STARTED_SELECTOR)
        await page.click(selectors.CONFIRM_EXPERIMENT_STARTED_SELECTOR)

        await page.waitForSelector(selectors.SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });
        await page.waitForSelector(selectors.SIMULATION_LOADER_SELECTOR, { hidden: false, timeout: TIMEOUT * 2 })
        await page.waitForSelector(selectors.SIMULATION_LOADER_SELECTOR, { hidden: true, timeout: TIMEOUT * 5 })
        console.log('Experiment Simulation finished')

    });

    it('Check Experiment Condition #1', async () => {

        console.log('Checking experiment condition #1')

        await page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.waitForSelector(selectors.CELL_TYPES_TAB_SELECTOR)
        await page.click(selectors.CELL_TYPES_TAB_SELECTOR)

        await page.evaluate(() => {
            let sections = document.querySelectorAll('div[class="MuiButtonBase-root MuiListItem-root makeStyles-selected-23 MuiListItem-dense MuiListItem-button"]');
            for (var i = 0; i < sections.length; i++) {
                sections[i].textContent.includes("Experiment Manager") && sections[i].click();
            }
        });

        await page.waitForTimeout(PAGE_WAIT)


        await page.waitForSelector(selectors.EXPERIMENT_TABLE_SELECTOR)
        await page.click(selectors.CREATED_EXPERIMENT_SELECTOR)

        await page.waitForSelector(selectors.EXPERIMENT_CONDIIONS_ROW_SELECTOR)

        await page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[0].innerHTML.includes("label") && results[0].click();
            }
        });

        await page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await page.click(selectors.CONFIRM_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Experiment Condition #1'
            });


    })



    it('Check Experiment Condition #2', async () => {

        console.log('Checking experiment condition #2')

        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await page.waitForTimeout(PAGE_WAIT * 3)

        await page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[1].innerHTML.includes("label") && results[1].click();
            }
        });

        await page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await page.click(selectors.CONFIRM_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Experiment Condition #2'
            });


    })

    it('Check Experiment Condition #3', async () => {

        console.log('Checking experiment condition #3')

        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await page.waitForTimeout(PAGE_WAIT * 3)

        await page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[2].innerHTML.includes("label") && results[2].click();
            }
        });

        await page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await page.click(selectors.CONFIRM_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Experiment Condition #3'
            });


    })

    it('Delete Experiment', async () => {

        console.log('Deleting experiment')

        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.BACK_TO_EDIT_SELECTOR)

        await page.waitForTimeout(PAGE_WAIT)

        await page.click(selectors.EDIT_EXPERIMENT_BACK_SELECTOR)

        await page.waitForTimeout(PAGE_WAIT)

        await page.evaluate(() => {
            let results = document.querySelectorAll('button[class="MuiButtonBase-root MuiButton-root MuiButton-text experimentIcon"]');
            for (var i = 0; i < results.length; i++) {
                results[1].innerHTML.includes("label") && results[1].click();
            }
        });

        await page.waitForSelector(selectors.CONFIRM_SELECTOR)
        await page.click(selectors.CONFIRM_SELECTOR)

        await page.waitForFunction(() => !document.querySelector('tr[class="MuiTableRow-root"]'));

    })

});