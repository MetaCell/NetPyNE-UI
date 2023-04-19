//IMPORTS:
import 'expect-puppeteer';
import { click } from './utils';
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const path = require('path');
var scriptName = path.basename(__filename, '.js');
import * as selectors from './selectors'



//PAGE INFO:
const baseURL = process.env.TEST_URL || 'https://stage.netpyne.metacell.us/'
const PAGE_WAIT = 3000;
const TIMEOUT = 60000;

//SNAPSHOT:
const SNAPSHOT_OPTIONS = {
  customSnapshotsDir: `./tests/snapshots/${scriptName}`,
  comparisonMethod: 'ssim',
  failureThresholdType: 'percent',
  failureThreshold: 0.5
};


let r = (Math.random() + 1).toString(36).substring(2);

//USERS:
const USERNAME = `TestUser${r}`
const PASSWORD = 'testpassword'

//TESTS:

jest.setTimeout(300000);



describe('Tutorial #1 for Smoke Testing', () => {

  beforeAll(async () => {
    await page.goto(baseURL);
    await page.waitForTimeout(PAGE_WAIT)
    await console.log(baseURL);
    await console.log(page.url())
    const pageTitle = await page.title();
    console.log(pageTitle);
    await page.waitForSelector('#error-dialog')
    await page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR, {timeout: TIMEOUT * 3});
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


  it('Create and Simulate network', async () => {

    await page.waitForTimeout(PAGE_WAIT * 2)
    await page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT })

    console.log('Tutorial #1')

    await page.waitForTimeout(PAGE_WAIT)

    await click(page, selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

    await click(page, selectors.TUTORIAL_1_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.PYR_CELL_SELECTOR)
    await page.waitForTimeout(PAGE_WAIT)

    await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
    await click(page, selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
    await page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
    await click(page, selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

    console.log('Create network')

    await page.waitForTimeout(PAGE_WAIT)

    console.log('... taking snapshot ...');
    await page.waitForTimeout(PAGE_WAIT);
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Tutorial#1 Network'
      });

    await click(page, selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
    await click(page, selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
    console.log('Simulate network')

    await page.waitForSelector(selectors.SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });

    await page.waitForTimeout(PAGE_WAIT)

  });


  it('Connections Plot', async () => {

    await page.waitForTimeout(PAGE_WAIT * 2);
    await click(page, selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Connections Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Connections Plot'
      });

  });

  it('2D Net Plot', async () => {

    await click(page, selectors.TWO_D_NET_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View 2D Net Plot ...')
    await page.waitForTimeout(PAGE_WAIT * 2);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: '2D Net Plot'
      });
  });

  it('Cell Traces Plot', async () => {

    await click(page, selectors.CELL_TRACES_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Cell Traces Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Cell Traces Plot'
      });
  });

  it('Raster Plot', async () => {

    await click(page, selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Raster Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Raster Plot'
      });
  });

  it('Spike Hist Plot', async () => {

    await click(page, selectors.SPIKE_HIST_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Spike Hist Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Spike Hist Plot'
      });
  });

  it('Granger Plot', async () => {

    await click(page, selectors.GRANGER_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Granger Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Granger Plot'
      });
  });

  it('Rate Spectogram Plot', async () => {

    await click(page, selectors.RATE_SPECTROGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    await page.waitForTimeout(PAGE_WAIT);

    await click(page, selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    await page.waitForTimeout(PAGE_WAIT);

    await click(page, selectors.RATE_SPECTROGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    console.log('View Rate Spectogram Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Rate Spectogram Plot'
      });
  });

});