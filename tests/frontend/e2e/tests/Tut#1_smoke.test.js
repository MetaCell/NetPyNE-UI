//IMPORTS:
import 'expect-puppeteer';
import puppeteer from 'puppeteer';
import { click } from './utils';
// import { expect } from 'expect-puppeteer';
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
  failureThresholdType: 'percent',
  failureThreshold: 0.5
};


let r = (Math.random() + 1).toString(36).substring(2);

//USERS:
const USERNAME = `TestUser${r}`
const PASSWORD = 'testpassword'

//TESTS:

jest.setTimeout(3000000);
let browser;
let tutorial_1_page;

describe('Tutorial #1 for Smoke Testing', () => {

  beforeAll(async () => {
    browser = await puppeteer.launch(
      {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: {
          width: 1300,
          height: 1024
        },
      }
    );
    tutorial_1_page = await browser.newPage();
    await tutorial_1_page.goto(baseURL);

    await tutorial_1_page.goto(baseURL);
    if (baseURL.includes('test.netpyne.metacell.us')) {
      console.log('Logging in as test user ...')
      await tutorial_1_page.waitForSelector(selectors.LOGIN_PAGE_SELECTOR);
      await tutorial_1_page.waitForSelector(selectors.USERNAME_SELECTOR)
      await expect(tutorial_1_page)
        .toFill(selectors.USERNAME_SELECTOR, USERNAME, { timeout: TIMEOUT });

      await tutorial_1_page.waitForSelector(selectors.PASSWORD_SELECTOR)
      await expect(tutorial_1_page)
        .toFill(selectors.PASSWORD_SELECTOR, PASSWORD, { timeout: TIMEOUT });

      await tutorial_1_page.waitForSelector(selectors.LOGIN_BUTTON_SELECTOR)
      await tutorial_1_page.click(selectors.LOGIN_BUTTON_SELECTOR)
      // Wait for initial loading spinner to disappear
      await tutorial_1_page.waitForFunction(() => {
        let el = document.querySelector('#loading-spinner');
        return el == null || el.clientHeight === 0;
      }, { timeout: TIMEOUT });
      console.log('Logged in successfully')
    }
  });

  afterAll(async () => {
    // Close the browser instance after all tests have run
    await browser.close();
  });

  it('Open new page', async () => {

    console.log('Opening a new NetPyNE page')

    await tutorial_1_page.on("dialog", dialog =>
      dialog.accept());

    await tutorial_1_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 6, visible: true })
    await tutorial_1_page.waitForSelector(selectors.FILE_TAB_SELECTOR, { timeout: PAGE_WAIT * 3 })
    await tutorial_1_page.waitForTimeout(PAGE_WAIT)
    await tutorial_1_page.click(selectors.FILE_TAB_SELECTOR)
    await tutorial_1_page.waitForSelector(selectors.NEW_FILE_SELECTOR, { timeout: PAGE_WAIT * 3 })
    await tutorial_1_page.waitForTimeout(PAGE_WAIT)
    await tutorial_1_page.click(selectors.NEW_FILE_SELECTOR)
    await tutorial_1_page.waitForTimeout(PAGE_WAIT)
    await tutorial_1_page.waitForSelector(selectors.CONFIRM_NEW_PAGE_SELECTOR)
    await tutorial_1_page.click(selectors.CONFIRM_NEW_PAGE_SELECTOR)
    await tutorial_1_page.waitForTimeout(PAGE_WAIT * 2)

    await tutorial_1_page.waitForFunction(() => {
      let el = document.querySelector('#loading-spinner');
      return el == null || el.clientHeight === 0;
    }, { timeout: TIMEOUT });

    await tutorial_1_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT * 10 })

    console.log('Page opened successfully')

  })


  it('Create and Simulate network', async () => {

    await tutorial_1_page.waitForTimeout(PAGE_WAIT * 2)
    await tutorial_1_page.waitForSelector(selectors.SELECT_CELL_BUTTON_SELECTOR, { timeout: TIMEOUT })

    console.log('Tutorial #1')

    await tutorial_1_page.waitForTimeout(PAGE_WAIT)
    await tutorial_1_page.waitForSelector(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.TUTORIAL_1_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.TUTORIAL_1_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.PYR_CELL_SELECTOR)
    await tutorial_1_page.waitForTimeout(PAGE_WAIT)

    await tutorial_1_page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
    await tutorial_1_page.click( selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
    await tutorial_1_page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
    await tutorial_1_page.click( selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

    console.log('Create network')

    await tutorial_1_page.waitForTimeout(PAGE_WAIT)

    console.log('... taking snapshot ...');
    await tutorial_1_page.waitForTimeout(PAGE_WAIT);
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Tutorial#1 Network'
      });

    await tutorial_1_page.waitForSelector( selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
    await tutorial_1_page.click( selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
    await tutorial_1_page.waitForSelector( selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
    await tutorial_1_page.click( selectors.SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
    console.log('Simulate network')

    await tutorial_1_page.waitForSelector(selectors.SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });

    await tutorial_1_page.waitForTimeout(PAGE_WAIT)

  });


  it('Connections Plot', async () => {

    await tutorial_1_page.waitForTimeout(PAGE_WAIT * 2);
    await tutorial_1_page.waitForSelector( selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Connections Plot ...')
    await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Connections Plot'
      });

  });

  it('2D Net Plot', async () => {
    await tutorial_1_page.waitForSelector( selectors.TWO_D_NET_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.TWO_D_NET_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View 2D Net Plot ...')
    await tutorial_1_page.waitForTimeout(PAGE_WAIT * 2);

    console.log('... taking snapshot ...');
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: '2D Net Plot'
      });
  });

  it('Cell Traces Plot', async () => {
    await tutorial_1_page.waitForSelector( selectors.CELL_TRACES_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.CELL_TRACES_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Cell Traces Plot ...')
    await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Cell Traces Plot'
      });
  });

  it('Raster Plot', async () => {
    await tutorial_1_page.waitForSelector( selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Raster Plot ...')
    await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Raster Plot'
      });
  });

  it('Spike Hist Plot', async () => {
    await tutorial_1_page.waitForSelector( selectors.SPIKE_HIST_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.SPIKE_HIST_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Spike Hist Plot ...')
    await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Spike Hist Plot'
      });
  });

  it('Granger Plot', async () => {
    await tutorial_1_page.waitForSelector( selectors.GRANGER_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.GRANGER_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View Granger Plot ...')
    await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Granger Plot'
      });
  });

  it('Rate Spectogram Plot', async () => {
    await tutorial_1_page.waitForSelector( selectors.RATE_SPECTROGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.click( selectors.RATE_SPECTROGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
    await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    // await tutorial_1_page.click( selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
    // await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    // await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    // await tutorial_1_page.click( selectors.RATE_SPECTROGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
    // await tutorial_1_page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    console.log('View Rate Spectogram Plot ...')
    await tutorial_1_page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await tutorial_1_page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Rate Spectogram Plot'
      });

    await tutorial_1_page.waitForTimeout(PAGE_WAIT);
  });

});