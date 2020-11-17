import 'expect-puppeteer'

const baseURL = process.env.url || 'http://localhost:8888';
const PAGE_WAIT = 2000
const TIMEOUT = 5000
const SNAPSHOT_OPTIONS = {
  customSnapshotsDir: "./tests/snapshots",
  comparisonMethod: 'ssim',
  failureThresholdType: 'percent',
  failureThreshold: 0.1
};

jest.setTimeout(300000);

beforeAll(async () => {
  await page.goto(baseURL)
});

describe('Tutorial #1', () => {

  it("Cell types", async () => {
    page.waitForSelector('.NetPyNE-root-1')
    await page.setViewport({ width: 1300, height: 1024 })

    // Add Pyramidal Cell Type
    await page.waitFor(PAGE_WAIT);
    await expect(page).toClick('#selectCellButton button', { timeout: TIMEOUT });

    // Select Cell Type
    await page.waitForSelector('.modal-open > #selectCellMenu #BallStick_HHCellTemplate')
    await page.waitFor(PAGE_WAIT);
    await expect(page).toClick('.modal-open > #selectCellMenu #BallStick_HHCellTemplate')
    await page.waitFor(PAGE_WAIT);

    // Rename Cell to 'pyr'
    await expect(page).toClick('#CellType0', { timeout: TIMEOUT })
    await page.waitForSelector('#cellRuleName')
    await expect(page).toFill('#cellRuleName', 'pyr')

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/CellType"
    });
  });

  it("Adding Excitatory Population", async () => {
    page.waitForSelector('.NetPyNE-root-1')
    await page.setViewport({ width: 1300, height: 1024 })

    // Add E population
    await page.waitForSelector('.MuiListItem-dense\[title="Populations"\]');
    await page.click('.MuiListItem-dense\[title="Populations"\]');
    await page.waitFor(PAGE_WAIT);
    await expect(page).toClick('#newPopulationButton', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);

    // Rename Population to E
    // TODO: Create bug report, crashes application
    //  1. Create population without cellType,
    //  2. Rename population
    // await expect(page).toFill("input[value=Population0]", "E", { timeout: TIMEOUT })
    // await page.waitFor(PAGE_WAIT);

    // Set number of cells to 40
    await expect(page).toClick("#netParamspopParamsPopulation0numCells", { timeout: TIMEOUT })
    await page.$eval("input[id='netParamspopParamsPopulation0numCells']", el => el.value = 40);
    await page.waitFor(PAGE_WAIT);

    // Population - Set CellType to pyr
    await expect(page).toClick('#netParamspopParamsPopulation0cellType', { timeout: TIMEOUT })
    await expect(page).toClick('#pyrMenuItem', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/Population"
    });
  });

  it("Configure Synapses", async () => {
    page.waitForSelector('.NetPyNE-root-1')
    await page.setViewport({ width: 1300, height: 1024 })

    // Synapse
    await expect(page).toClick('.MuiListItem-dense\[title="Synaptic Mechanisms"\]', { timeout: TIMEOUT });
    await expect(page).toClick('#newSynapseButton', { timeout: PAGE_WAIT })
    await page.waitFor(PAGE_WAIT)
    await expect(page).toFill("input[value='Synapse0']", "exc", { timeout: TIMEOUT })

    await page.waitFor(3000)

    await expect(page).toClick('#synapseModSelect', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)
    await expect(page).toClick('#Exp2Syn', { timeout: TIMEOUT })
    await page.waitFor(3000)
    await expect(page).toFill("#netParamssynMechParamsexctau1", "0.1", { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)
    await expect(page).toFill("#netParamssynMechParamsexctau2", "1", { timeout: TIMEOUT })
    await expect(page).toFill("#netParamssynMechParamsexce", "0", { timeout: TIMEOUT })
    await page.waitFor(3000)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/Synapses"
    });
  })

  it("Connectivity", async () => {
      page.waitForSelector('.NetPyNE-root-1')
      await page.setViewport({ width: 1300, height: 1024 })

      await expect(page).toClick('.MuiListItem-dense\[title="Connectivity Rules"\]', { timeout: TIMEOUT });
      await page.waitFor(PAGE_WAIT)
      await expect(page).toClick('#newConnectivityRuleButton', { timeout: TIMEOUT })
      await expect(page).toFill("#ConnectivityName", "E->E", { timeout: TIMEOUT })
      await expect(page).toFill("input[id*='Esec']", "dend", { timeout: TIMEOUT })
      await expect(page).toClick("button[id*='Esec-button']", { timeout: TIMEOUT })
      await expect(page).toClick("div[id*='EsynMech']", { timeout: TIMEOUT })
      await expect(page).toClick("#excMenuItem", { timeout: TIMEOUT })
      await expect(page).toFill("input[id*='probability']", "0.1", { timeout: TIMEOUT })
      await expect(page).toFill("input[id*='synsPerConn']", "1", { timeout: TIMEOUT })
      await expect(page).toFill("input[id*='weight']", "0.005", { timeout: TIMEOUT })
      await expect(page).toFill("input[id*='delay']", "5", { timeout: TIMEOUT })
      await page.waitFor(PAGE_WAIT)

      expect(await page.screenshot()).toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotsDir: "./tests/snapshots/tutorial_1/Connectivity"
      });
    }
  )

  it("Stim. Sources", async () => {
    page.waitForSelector('.NetPyNE-root-1')
    await page.setViewport({ width: 1300, height: 1024 })

    // await expect(page).toClick('.MuiListItem-dense\[title="Stim. Sources"\]', { timeout: TIMEOUT });
    // TODO: define stimulation sources
  })

  it("Stim. Targets", async () => {
    page.waitForSelector('.NetPyNE-root-1')
    await page.setViewport({ width: 1300, height: 1024 })

    // TODO: define stimulation targets
    // await expect(page).toClick('.MuiListItem-dense\[title="Stim. Targets"\]', { timeout: TIMEOUT });

    // TODO: define configuration
    // await expect(page).toClick('.MuiListItem-dense\[title="Configuration"\]', { timeout: TIMEOUT });

    // TODO: define plot settings
    // await expect(page).toClick('.MuiListItem-dense\[title="Plot Settings"\]', { timeout: TIMEOUT });
  })
});
