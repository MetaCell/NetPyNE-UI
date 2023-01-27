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
    failureThreshold: 0.05
};



//SELECTORS:
const BASE_PAGE_SELECTOR = '.NetPyNE-root-1'
const TUTORIALS_BUTTON_SELECTOR = 'button[id = "Tutorials"]'
const TUTORIAL_3A_SELECTOR = 'li[id= "Tut 3a: Multiscale network (low IP3)"]'
const MODEL_BUTTON_SELECTOR = 'button[id="Model"]'
const CREATE_NETWORK_SELECTOR = 'li[id="Create network"]'
const SIMULATE_NETWORK_SELECTOR = 'li[id="Simulate network"]'
const SIMULATION_PAGE_SELECTOR = 'canvas'



//USERS:
const USERNAME = 'TestUser_ExperimentManager_124'
const PASSWORD = 'testpassword'


//TESTS:

jest.setTimeout(300000);



describe('Experiment Manager test using Tut#1', () => {

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

    it('Load Tutorial#1', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector('#selectCellButton', { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)
        await click(page, TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        console.log('Tutorial #1')
        await click(page, "li[id='Tut 1: Simple cell network']", { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector('#pyr')
        await page.waitForTimeout(PAGE_WAIT)


    })


    it('Create network', async () => {

        await page.waitForSelector(MODEL_BUTTON_SELECTOR)
        await click(page, MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(CREATE_NETWORK_SELECTOR)
        await click(page, CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Create network')

        await page.waitForSelector('div[title="Raster plot"][aria-disabled="true"]', { timeout: TIMEOUT * 3 })

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

        await page.waitForSelector('div[title="Experiment Manager"]')
        await page.click('div[title="Experiment Manager"]')
        await page.waitForSelector('button[class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary"]')
        await page.click('button[class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary"]')

        await page.waitForSelector('h2[class="MuiTypography-root MuiTypography-h6"]')
        await page.click('#confirmDeletion')
        await page.waitForSelector('#experiment-name')

        await expect(page).toFill('#experiment-name', 'Test Experiment')
        await page.waitForTimeout(PAGE_WAIT);

        await page.click('#undefined-combo-box-demo')


        await page.evaluate(() => {
            let parameter = document.querySelectorAll('li[class="MuiAutocomplete-option"]');
            for (var i = 0; i < parameter.length; i++) {
                parameter[i].innerHTML.includes("numCells") && parameter[i].click();
            }
        });

        await page.waitForTimeout(PAGE_WAIT);

        const inputFromValue = await page.$eval('#undefined-from', el => el.value);
        await page.click('#undefined-to');
        for (let i = 0; i < inputFromValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        await page.type('#undefined-from', '1')

        const inputToValue = await page.$eval('#undefined-to', el => el.value);
        await page.click('#undefined-to');
        for (let i = 0; i < inputToValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        await page.type('#undefined-to', '4')

        const inputStepValue = await page.$eval('#undefined-step', el => el.value);
        await page.click('#undefined-step');
        for (let i = 0; i < inputStepValue.length; i++) {
            await page.keyboard.press('Backspace');
        }

        await page.type('#undefined-step', '1')

        await page.waitForTimeout(PAGE_WAIT);

        await page.click('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"]')

        await page.waitForSelector('th[class="MuiTableCell-root MuiTableCell-body"]')
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

        await page.waitForSelector('div[class="MuiButtonGroup-root MuiButtonGroup-contained"]')
        await click(page, 'div[class="MuiButtonGroup-root MuiButtonGroup-contained"]', { timeout: TIMEOUT });

        console.log('Simulating all conditions')

        await page.waitForSelector('div[class="MuiBox-root MuiBox-root-185 wrap"]')
        await page.click('div[class="MuiBox-root MuiBox-root-185 wrap"]')
        await page.click('#appBarPerformActionButton')

        await page.waitForTimeout(PAGE_WAIT);

        await page.waitForSelector('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"]')
        await page.click('button[class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"]')

        await page.waitForSelector(SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });
        await page.waitForSelector('div[class = "MuiBox-root MuiBox-root-186 MuiChip-icon MuiChipLoader"]', { hidden: false, timeout: TIMEOUT * 2 })
        await page.waitForSelector('div[class = "MuiBox-root MuiBox-root-186 MuiChip-icon MuiChipLoader"]', { hidden: true, timeout: TIMEOUT * 5 })
        console.log('Experiment Simulation finished')

    });

    it('Check Experiment Condition #1', async () => {

        console.log('Checking experiment condition #1')

        await page.click('span[class="MuiButton-startIcon MuiButton-iconSizeMedium"]')

        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.waitForSelector('div[title="Cell Types"]')
        await page.click('div[title="Cell Types"]')

        await page.evaluate(() => {
            let sections = document.querySelectorAll('div[class="MuiButtonBase-root MuiListItem-root makeStyles-selected-23 MuiListItem-dense MuiListItem-button"]');
            for (var i = 0; i < sections.length; i++) {
                sections[i].textContent.includes("Experiment Manager") && sections[i].click();
            }
        });

        await page.waitForTimeout(PAGE_WAIT)


        await page.waitForSelector('table[class="MuiTable-root"]')
        await page.click('button[class="MuiButtonBase-root MuiButton-root MuiButton-text"]')

        await page.waitForSelector('tr[class = "MuiTableRow-root MuiTableRow-head"]')

        await page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[0].innerHTML.includes("label") && results[0].click();
            }
        });

        await page.waitForSelector('#confirmDeletion')
        await page.click('#confirmDeletion')
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
        await page.click('span[class="MuiButton-startIcon MuiButton-iconSizeMedium"]')

        await page.waitForTimeout(PAGE_WAIT * 3)

        await page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[1].innerHTML.includes("label") && results[1].click();
            }
        });

        await page.waitForSelector('#confirmDeletion')
        await page.click('#confirmDeletion')
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
        await page.click('span[class="MuiButton-startIcon MuiButton-iconSizeMedium"]')

        await page.waitForTimeout(PAGE_WAIT * 3)

        await page.evaluate(() => {
            let results = document.querySelectorAll('button[title="Explore results"]');
            for (var i = 0; i < results.length; i++) {
                results[2].innerHTML.includes("label") && results[2].click();
            }
        });

        await page.waitForSelector('#confirmDeletion')
        await page.click('#confirmDeletion')
        await page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Experiment Condition #3'
            });


    })








});