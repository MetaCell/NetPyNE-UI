//IMPORTS:
import 'expect-puppeteer';
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
  failureThresholdType: 'percent',
  failureThreshold: 0.3
};


let r = (Math.random() + 1).toString(36).substring(2);

//USERS:
const USERNAME = `TestUser${r}`
const PASSWORD = 'testpassword'


//TESTS:

jest.setTimeout(300000);



describe('Tutorial #3c for Smoke Testing', () => {

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

    console.log('Tutorial #3c')

    await page.waitForTimeout(PAGE_WAIT)

    await page.click(selectors.TUTORIALS_BUTTON_SELECTOR, { timeout: TIMEOUT })

    await page.click(selectors.TUTORIAL_3C_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.E_CELL_TYPE_SELECTOR)
    await page.waitForSelector(selectors.I_CELL_TYPE_SELECTOR)
    await page.waitForTimeout(PAGE_WAIT)

    await page.waitForSelector(selectors.MODEL_BUTTON_SELECTOR)
    await page.click(selectors.MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
    await page.waitForSelector(selectors.CREATE_NETWORK_SELECTOR)
    await page.click(selectors.CREATE_NETWORK_SELECTOR, { timeout: TIMEOUT });

    console.log('Create network')

    await page.waitForTimeout(PAGE_WAIT * 3)

    await page.waitForSelector(selectors.THREE_D_REP_SELECTOR)

    console.log('... taking snapshot ...');
    await page.waitForTimeout(PAGE_WAIT);
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'Tutorial#3c Network'
      });

    //there is a bug related to 'Model' > 'Simulate Network'  
    // await page.click( MODEL_BUTTON_SELECTOR, { timeout: TIMEOUT });
    await page.waitForTimeout(PAGE_WAIT);
    //reason why the tests are using the simulate button on the top right
    await page.click(selectors.SIMULATE_TOP_RIGHT_BUTTON_SELECTOR, { timeout: TIMEOUT });
    // await page.click( SIMULATE_NETWORK_SELECTOR, { timeout: TIMEOUT });
    console.log('Simulate network')

    await page.waitForSelector(selectors.SIMULATION_PAGE_SELECTOR, { timeout: TIMEOUT * 2 });

    await page.waitForSelector(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT * 3 })


  });


  it('Connections Plot', async () => {

    await page.waitForTimeout(PAGE_WAIT * 2);
    await page.click(selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
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

    await page.click(selectors.TWO_D_NET_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View 2D Net Plot ...')
    await page.waitForTimeout(PAGE_WAIT * 3);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: '2D Net Plot'
      });
  });

  it('Cell Traces Plot', async () => {

    await page.click(selectors.CELL_TRACES_PLOT_SELECTOR, { timeout: TIMEOUT })
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

    await page.click(selectors.RASTER_PLOT_SELECTOR, { timeout: TIMEOUT })
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

    await page.click(selectors.SPIKE_HIST_PLOT_SELECTOR, { timeout: TIMEOUT })
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

  it('LFP Time Series Plot', async () => {

    await page.click(selectors.LFP_TS_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View LFP Time Series Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'LFP Time Series Plot'
      });
  });

  it('LFP PSD Plot', async () => {

    await page.click(selectors.LFP_PSD_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View LFP PSD Plot ...')
    await page.waitForTimeout(PAGE_WAIT);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'LFP PSD Plot'
      });
  });

  it('LFP Spectrogram Plot', async () => {

    await page.click(selectors.LFP_SPECTOGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })
    console.log('View LFP Spectrogram Plot ...')
    await page.waitForTimeout(PAGE_WAIT * 3);

    console.log('... taking snapshot ...');
    expect(await page.screenshot())
      .toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotIdentifier: 'LFP Spectrogram Plot'
      });
  });

  it('Granger Plot', async () => {

    await page.click(selectors.GRANGER_PLOT_SELECTOR, { timeout: TIMEOUT })
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

    await page.click(selectors.RATE_SPECTROGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    await page.waitForTimeout(PAGE_WAIT);

    await page.click(selectors.CONNECTIONS_PLOT_SELECTOR, { timeout: TIMEOUT })
    await page.waitForSelector(selectors.CANVAS_SELECTOR, { timeout: TIMEOUT })

    await page.waitForTimeout(PAGE_WAIT);

    await page.click(selectors.RATE_SPECTROGRAM_PLOT_SELECTOR, { timeout: TIMEOUT })
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