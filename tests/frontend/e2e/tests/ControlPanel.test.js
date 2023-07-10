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
    customSnapshotsDir: `./tests/snapshots/Tut#2_smoke.test/`,
    comparisonMethod: 'ssim',
    failureThresholdType: 'percent',
    failureThreshold: 0.25
};

let r = (Math.random() + 1).toString(36).substring(2);

//USERS:
const USERNAME = `TestUser${r}`
const PASSWORD = 'testpassword'

//TESTS:

jest.setTimeout(300000);



describe('Test for the Control Panel - color picker', () => {

    beforeAll(async () => {
        await page.goto(baseURL), { timeout: PAGE_WAIT * 2 };
        await page.waitForTimeout(PAGE_WAIT)
        await console.log(baseURL);

        await page.on('response', response => {
            expect(response.status).not.toEqual(404)

        })

        await console.log(page.url())
        const pageTitle = await page.title();
        console.log(pageTitle);
        console.log(page)
        // Notebook Login
        // await page.waitForSelector('.navbar-default')
        // await page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR, {timeout: TIMEOUT * 3});
        // await page.waitForSelector(selectors.USERNAME_SELECTOR)
        //await expect(page)
        //  .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });

        // await page.waitForSelector(selectors.PASSWORD_SELECTOR)
        // await expect(page)
        //   .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });

        //   await page.click(selectors.LOGIN_BUTTON_SELECTOR)
        // Wait for initial loading spinner to disappear
        // await page.waitForFunction(() => {
        //   let el = document.querySelector('#loading-spinner');
        //   return el == null || el.clientHeight === 0;
        //  }, { timeout: TIMEOUT });
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
        await page.waitForTimeout(PAGE_WAIT * 2)

        await page.waitForFunction(() => {
            let el = document.querySelector('#loading-spinner');
            return el == null || el.clientHeight === 0;
        }, { timeout: TIMEOUT });

        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

        console.log('Page opened successfully')

    })

    it('Load Tutorial#2', async () => {

        await page.waitForTimeout(PAGE_WAIT * 2)
        await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)
        await page.click(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

        console.log('Loading Tutorial #2')

        await page.click(selectors.TUTORIAL_2_SELECTOR, { timeout: TIMEOUT })
        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.PYR_2_CELL_SELECTOR)
        await page.waitForSelector(selectors.INT_CELL_SELECTOR)
        await page.waitForTimeout(PAGE_WAIT)

        console.log('Tutorial #2 loaded successfully')

    })


    it('Create network', async () => {

        await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
        await page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
        await page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
        await page.click(selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

        console.log('Create network')

        await page.waitForSelector(selectors.DISABLED_RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })

        console.log('Network created successfully')

        await page.waitForTimeout(PAGE_WAIT)

        console.log('... taking snapshot ...');
        await page.waitForTimeout(PAGE_WAIT);
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Tutorial#2 Network'
            });
    })

    it('Open Color Picker Menu', async () => {

        console.log('Opening Control Panel')

        await page.waitForSelector(selectors.CONTROL_PANEL_TAB_SELECTOR)
        await page.click(selectors.CONTROL_PANEL_TAB_SELECTOR)
        await page.waitForSelector(selectors.NETWORKS_IN_CONTROL_PANEL_SELECTOR)

        const network_items = (await page.$$(selectors.NETWORK_ITEMS_CONTROL_PANEL_SELECTOR)).length;
        await expect(network_items).toEqual(3)

        console.log('Control Panel displayed successfully')

    })

    it('Randomize Main Level network color', async () => {

        console.log('Randomize Main Level network color')

        await page.waitForTimeout(PAGE_WAIT * 3)
        await page.waitForSelector(selectors.CONTROL_PANEL_TABLE_SELECTOR)

        const primary_level_colors = await page.$$eval(selectors.COLOR_RECT_SELECTOR, primary_level_colors => {
            return primary_level_colors.map(primary_level_color => primary_level_color.outerHTML);
        });

        expect(primary_level_colors[0]).toContain('fill="#FF7F99"')
        expect(primary_level_colors[0]).toEqual(primary_level_colors[1])
        expect(primary_level_colors[1]).toEqual(primary_level_colors[2])

        await page.waitForTimeout(PAGE_WAIT)

        const rows = await page.$$(selectors.CONTROL_PANEL_NETWORK_ROWS_SELECTOR)
        for (var i = 0; i < rows.length; i++) {
            await rows[0].hover()
        }

        const buttons = await page.$$(selectors.COLOR_CONTROL_BUTTONS_SELECTOR)

        for (var i = 0; i < buttons.length; i++) {
            await buttons[1].click()
        }

        await page.waitForTimeout(PAGE_WAIT)

        const rndm_primary_level_colors = await page.$$eval(selectors.COLOR_RECT_SELECTOR, rndm_primary_level_colors => {
            return rndm_primary_level_colors.map(rndm_primary_level_color => rndm_primary_level_color.outerHTML);
        });

        expect(rndm_primary_level_colors[0]).toContain('fill="#989898"')
        expect(rndm_primary_level_colors[2]).not.toEqual(rndm_primary_level_colors[1])

        console.log('Main Network color randomized successfully')

        await page.waitForTimeout(PAGE_WAIT)

    })

    it('Randomize Sub level E network color', async () => {

        console.log('Randomize Sub Level E network color')

        const rows = await page.$$(selectors.CONTROL_PANEL_NETWORK_ROWS_SELECTOR)
        for (var i = 0; i < rows.length; i++) {
            await rows[1].click()
            await rows[1].hover()
        }
        await page.waitForTimeout(PAGE_WAIT)

        const second_level_colors = await page.$$eval(selectors.COLOR_RECT_SELECTOR, second_level_colors => {
            return second_level_colors.map(second_level_color => second_level_color.outerHTML);
        });


        expect(second_level_colors[1]).toEqual(second_level_colors[2])
        expect(second_level_colors[2]).toEqual(second_level_colors[3])


        const buttons = await page.$$(selectors.COLOR_CONTROL_BUTTONS_SELECTOR)

        for (var i = 0; i < buttons.length; i++) {
            await buttons[2].click()
        }

        await page.waitForTimeout(PAGE_WAIT * 2)

        const second_level_colors_after_rndm = await page.$$eval(selectors.COLOR_RECT_SELECTOR, second_level_colors_after_rndm => {
            return second_level_colors_after_rndm.map(second_level_color_after_rndm => second_level_color_after_rndm.outerHTML);
        });

        expect(second_level_colors_after_rndm[1]).toContain('fill="#989898"')
        expect(second_level_colors_after_rndm[2]).not.toEqual(second_level_colors_after_rndm[3])
        expect(second_level_colors_after_rndm[2]).not.toEqual(second_level_colors_after_rndm[1])

        console.log('E Network color randomized successfully')

        await page.waitForTimeout(PAGE_WAIT * 3)

    })


    it('Pick a color for the sublevel I netowrk', async () => {

        console.log('Selecting a color for the I network')

        const rows = await page.$$(selectors.CONTROL_PANEL_NETWORK_ROWS_SELECTOR)
        for (var i = 0; i < rows.length; i++) {
            await rows[1].click()
        }

        await page.waitForTimeout(PAGE_WAIT)

        const rows_ = await page.$$(selectors.CONTROL_PANEL_NETWORK_ROWS_SELECTOR)

        for (var i = 0; i < rows_.length; i++) {
            await rows_[2].click()
        }

        await page.waitForTimeout(PAGE_WAIT)

        const network_colors = await page.$$eval(selectors.COLOR_RECT_SELECTOR, network_colors => {
            return network_colors.map(network_color => network_color.outerHTML);
        });

        expect(network_colors[3]).toEqual(network_colors[4])
        expect(network_colors[3]).toEqual(network_colors[2])

        await page.waitForTimeout(PAGE_WAIT * 3)

        const buttons = await page.$$(selectors.COLOR_CONTROL_BUTTONS_SELECTOR)

        for (var i = 0; i < buttons.length; i++) {
            await buttons[4].click()
        }

        await page.waitForTimeout(PAGE_WAIT)

        const list_bounds = await page.$(selectors.NETWORKS_IN_CONTROL_PANEL_SELECTOR);
        const rect = await page.evaluate((list_bounds) => {
            const { top, left, bottom, right } = list_bounds.getBoundingClientRect();
            return { top, left, bottom, right };
        }, list_bounds);

        await page.waitForTimeout(PAGE_WAIT)
        await page.mouse.click(Math.round(rect.right) - 40, Math.round(rect.bottom) + 40)
        await page.waitForTimeout(PAGE_WAIT * 2)

        const rows_after_colouring_I = await page.$$(selectors.CONTROL_PANEL_NETWORK_ROWS_SELECTOR)
        for (var i = 0; i < rows_after_colouring_I.length; i++) {
            await rows_after_colouring_I[2].click()
        }

        const network_colors_after_colouring_I = await page.$$eval(selectors.COLOR_RECT_SELECTOR, network_colors_after_colouring_I => {
            return network_colors_after_colouring_I.map(network_color_after_colouring_I => network_color_after_colouring_I.outerHTML);
        });
        await page.waitForTimeout(PAGE_WAIT)

        expect(network_colors_after_colouring_I[2]).toEqual(network_colors_after_colouring_I[3])
        expect(network_colors_after_colouring_I[2]).toEqual(network_colors_after_colouring_I[4])

        console.log('I network color selected successfully')

    })

    it('Filter results from the Control panel', async () => {

        await page.waitForTimeout(PAGE_WAIT)
        console.log('Filtering results')

        await expect(page).toFill(selectors.CONTROL_PANEL_FILTER_SELECTOR, 'E')

        await page.waitForTimeout(PAGE_WAIT)
        await page.waitForSelector(selectors.NETWORKS_IN_CONTROL_PANEL_SELECTOR)

        const network_items = (await page.$$(selectors.NETWORK_ITEMS_CONTROL_PANEL_SELECTOR)).length;
        await expect(network_items).toEqual(3)

        console.log('Results filtered successfully')

    })


});