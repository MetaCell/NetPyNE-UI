import 'expect-puppeteer'

const baseURL = process.env.url || 'http://localhost:8888';
const PAGE_WAIT = 4000
const TIMEOUT = 20000
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

afterAll(async () => {
  // Clean workspace
  await expect(page).toClick('#File', { timeout: TIMEOUT });
  await page.hover('#New', { timeout: TIMEOUT });
  await expect(page).toClick('#Blank', { timeout: TIMEOUT });
  await expect(page).toClick("button[id='appBarPerformActionButton']", { timeout: TIMEOUT });
  await page.waitForFunction(() => {
    let el = document.querySelector('#loading-spinner')
    return el == null || el.clientHeight === 0
  }, { timeout: 120000 });
})

describe('Tutorial #1', () => {

  beforeAll(async () => {
    page.waitForSelector('.NetPyNE-root-1')
    await page.setViewport({ width: 1300, height: 1024 })
  })

  it("Cell types", async () => {
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
    await page.waitFor(PAGE_WAIT);
    await expect(page).toFill('#cellRuleName', 'pyr', { timeout: TIMEOUT })

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  });

  it("Adding Excitatory Population", async () => {
    // Add E population
    await page.waitForSelector('.MuiListItem-dense\[title="Populations"\]');
    await page.click('.MuiListItem-dense\[title="Populations"\]');
    await page.waitFor(PAGE_WAIT);
    await expect(page).toClick('#newPopulationButton', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);

    // Rename Population to E
    await expect(page).toFill("input[value=Population0]", "E", { timeout: TIMEOUT })

    // Set number of cells to 40
    await expect(page).toClick("#netParamspopParamsEnumCells", { timeout: TIMEOUT })
    await expect(page).toFill("input[id='netParamspopParamsEnumCells']", "5", { timeout: TIMEOUT })

    // Population - Set CellType to pyr
    await expect(page).toClick('#netParamspopParamsEcellType', { timeout: TIMEOUT })
    await expect(page).toClick('#pyrMenuItem', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  });

  it("Configure Synapses", async () => {
    // Synapse
    await expect(page).toClick('.MuiListItem-dense\[title="Synaptic Mechanisms"\]', { timeout: TIMEOUT });
    await expect(page).toClick('#newSynapseButton', { timeout: PAGE_WAIT })
    await page.waitFor(PAGE_WAIT)
    await expect(page).toFill("input[value='Synapse0']", "exc", { timeout: TIMEOUT })

    await expect(page).toClick('#synapseModSelect', { timeout: TIMEOUT })
    await expect(page).toClick('#Exp2Syn', { timeout: TIMEOUT })

    await expect(page).toFill("#netParamssynMechParamsexctau1", "0.1", { timeout: TIMEOUT })
    await expect(page).toFill("#netParamssynMechParamsexctau2", "1", { timeout: TIMEOUT })
    await expect(page).toFill("#netParamssynMechParamsexce", "0", { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Connectivity", async () => {
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

      // TODO: this is blocked by a bug, have to investigate it first
      // await expect(page).toClick("#preCondsConnTab", { timeout: TIMEOUT })
      // await page.waitFor(PAGE_WAIT)
      // await expect(page).toClick("#preCondsConnTab", { timeout: TIMEOUT })
      // await expect(page).toClick("div[id*='preCondspop']", { timeout: TIMEOUT })
      // await expect(page).toClick("#EMenuItem", { timeout: TIMEOUT })
      // await expect(page).toClick("#postCondsConnTab", { timeout: TIMEOUT })
      // await expect(page).toClick("div[id*='postCondspop']", { timeout: TIMEOUT })
      // await expect(page).toClick("#EMenuItem", { timeout: TIMEOUT })
      // await expect(page).toClick("#generalConnTab", { timeout: TIMEOUT })
      // await page.waitFor(1000)

      expect(await page.screenshot()).toMatchImageSnapshot({
        ...SNAPSHOT_OPTIONS,
        customSnapshotsDir: "./tests/snapshots/tutorial_1/"
      });
    }
  )

  it("Stim. Sources", async () => {
    await expect(page).toClick('img[src*="stimSourceParams.svg"]', { timeout: TIMEOUT });
    await expect(page).toClick('#newStimulationSourceButton', { timeout: PAGE_WAIT })
    await expect(page).toFill("input[value='stim_source0']", "IClamp1", { timeout: TIMEOUT })
    await expect(page).toClick("div[id='stimSourceSelect']", { timeout: TIMEOUT })
    await expect(page).toClick("li[id='IClampMenuItem']", { timeout: TIMEOUT })
    await expect(page).toFill("input[id='netParamsstimSourceParamsIClamp1del']", "20", { timeout: TIMEOUT })
    await expect(page).toFill("input[id='netParamsstimSourceParamsIClamp1dur']", "10", { timeout: TIMEOUT })
    await expect(page).toFill("input[id='netParamsstimSourceParamsIClamp1amp']", "0.6", { timeout: TIMEOUT })
    await page.waitFor(5000)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Stim. Targets", async () => {
    let stimTarget = "IClamp1->cell0"

    await expect(page).toClick('img[src*="stimTargetParams.svg"]', { timeout: TIMEOUT });
    await page.waitFor(PAGE_WAIT)
    await expect(page).toClick('#newStimulationTargetButton', { timeout: PAGE_WAIT })
    await expect(page).toFill("input[value='stim_target0']", stimTarget, { timeout: TIMEOUT })
    await expect(page).toClick(`div[id='netParamsstimTargetParams${stimTarget}source']`, { timeout: PAGE_WAIT })
    await expect(page).toClick('#IClamp1MenuItem', { timeout: PAGE_WAIT })
    await expect(page).toFill(`input[id='netParamsstimTargetParams${stimTarget}sec']`, "dend", { timeout: TIMEOUT })
    await expect(page).toFill(`input[id='netParamsstimTargetParams${stimTarget}loc']`, "1", { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)

    await expect(page).toClick('#stimTargetCondsTab', { timeout: PAGE_WAIT })
    await page.waitFor(PAGE_WAIT)
    await expect(page).toFill(`input[id*='condscellList']`, "0", { timeout: TIMEOUT })
    await expect(page).toClick(`button[id*='condscellList-button']`, { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)

    await expect(page).toClick('#stimTargetGeneralTab', { timeout: PAGE_WAIT })
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Configuration", async () => {
    // General section
    await expect(page).toClick('.MuiListItem-dense\[title="Configuration"\]', { timeout: TIMEOUT });
    await expect(page).toFill("#simConfigduration", "200", { timeout: TIMEOUT })

    // Record section
    await expect(page).toClick('#configRecord', { timeout: TIMEOUT });
    await expect(page).toFill("#simConfigrecordCells", "0", { timeout: TIMEOUT })
    await expect(page).toClick("#simConfigrecordCells-button", { timeout: TIMEOUT })
    await expect(page).toFill("#simConfigrecordTraces", "V_soma: {sec: soma, loc: 0.5, var: v}", { timeout: TIMEOUT })
    await expect(page).toClick('#simConfigrecordTraces-button', { timeout: TIMEOUT });
    await page.waitFor(1000)
    await expect(page).toFill("#simConfigrecordTraces", "V_dend: {sec: dend, loc: 1, var: v}", { timeout: TIMEOUT })
    await expect(page).toClick('#simConfigrecordTraces-button', { timeout: TIMEOUT });
    await page.waitFor(1000)
    await expect(page).toFill("#simConfigrecordStep", "1.0", { timeout: TIMEOUT })

    await page.waitFor(500)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Plot Settings", async () => {
    await expect(page).toClick('.MuiListItem-dense[title="Plot Settings"]', { timeout: TIMEOUT });
    await page.waitFor(1000)
    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Create Network", async () => {
    await expect(page).toClick("button[id='Model'", { timeout: TIMEOUT })
    await expect(page).toClick("li[id='Create network']", { timeout: TIMEOUT })
    await page.waitForSelector("canvas")
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Simulate Network", async () => {
    await expect(page).toClick("button[id='Model'", { timeout: TIMEOUT })
    await expect(page).toClick("li[id='Simulate network']", { timeout: TIMEOUT })
    await page.waitFor(3000)
    await page.waitForFunction(() => {
      let el = document.querySelector('#loading-spinner')
      return el.clientHeight === 0
    }, { timeout: 60000 });
  })

  it("View Connections Plot", async () => {
    await expect(page).toClick('div[title=\"Connections Plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(TIMEOUT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("View 2D Net Plot", async () => {
    await expect(page).toClick('div[title=\"2D Net Plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(TIMEOUT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Cell traces", async () => {
    await expect(page).toClick('div[title=\"Cell traces\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(TIMEOUT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Raster Plot", async () => {
    await expect(page).toClick('div[title=\"Raster plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(TIMEOUT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Spike Hist Plot", async () => {
    await expect(page).toClick('div[title=\"Spike Hist Plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(TIMEOUT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })
});
