import 'expect-puppeteer'

const baseURL = process.env.url || 'http://localhost:8888';
const PAGE_WAIT = 2000
const TIMEOUT = 100000
const SNAPSHOT_OPTIONS = {
  customSnapshotsDir: "./tests/snapshots",
  comparisonMethod: 'ssim',
  failureThresholdType: 'percent',
  failureThreshold: 0.1
};

jest.setTimeout(300000);

beforeAll(async () => {
  await page.goto(baseURL)
  // Setting user agent helps to speed up an otherwise extremely slow Chromium
  //    - https://github.com/puppeteer/puppeteer/issues/1718#issuecomment-425618798
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')
});

afterAll(async () => {
  // Clean workspace
  await expect(page).toClick('#File', { timeout: TIMEOUT });
  await page.hover('#New', { timeout: TIMEOUT });
  await expect(page).toClick('#Blank', { timeout: TIMEOUT });
  await expect(page).toClick("button[id='appBarPerformActionButton']", { timeout: TIMEOUT });
  // await page.waitForFunction(() => {
  //   let el = document.querySelector('#loading-spinner')
  //   return el == null || el.clientHeight === 0
  // }, { timeout: 120000 });
})

describe('Tutorial #1', () => {

  beforeAll(async () => {
    page.waitForSelector('.NetPyNE-root-1')
  })

  it("Cell types", async () => {
    console.log("Run first test")

    // Add Pyramidal Cell Type
    await page.waitFor(PAGE_WAIT);
    await expect(page).toClick('#selectCellButton', { timeout: TIMEOUT });
    await page.waitFor(PAGE_WAIT);

    // Select Cell Type
    await expect(page).toClick('#BallStick_HHCellTemplate', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);

    // Rename Cell to 'pyr'
    await expect(page).toClick('#CellType0', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);
    await expect(page).toFill('#cellRuleName', 'pyr', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  });

  it("Adding Excitatory Population", async () => {
    console.log("Add excitatory population ...")

    // Add E population
    await page.waitForSelector('.MuiListItem-dense\[title="Populations"\]');
    await page.click('.MuiListItem-dense\[title="Populations"\]');
    await page.waitFor(PAGE_WAIT);
    await expect(page).toClick('#newPopulationButton', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);

    // Rename Population to E
    await expect(page).toFill("input[value=Population0]", "E", { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);

    // Set number of cells to 40
    await expect(page).toClick("#netParamspopParamsEnumCells", { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);
    await expect(page).toFill("input[id='netParamspopParamsEnumCells']", "5", { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);

    // Population - Set CellType to pyr
    await expect(page).toClick('#netParamspopParamsEcellType', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT);
    await expect(page).toClick('#pyrMenuItem', { timeout: TIMEOUT })
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  });

  it("Configure Synapses", async () => {
    console.log("Configure synapses ...")

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
      console.log("Configure connectivity ...")

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
    console.log("Configure Simulation Sources ...")

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
    console.log("Configure Simulation Targets ...")

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
    console.log("Update simulation configuration ...")
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
    console.log("Plot settings ...")

    await expect(page).toClick('.MuiListItem-dense[title="Plot Settings"]', { timeout: TIMEOUT });
    await page.waitFor(1000)
    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Create Network", async () => {
    console.log("Create network ...")

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
    console.log("Simulate network ...")

    await expect(page).toClick("button[id='Model'", { timeout: TIMEOUT })
    await expect(page).toClick("li[id='Simulate network']", { timeout: TIMEOUT })
    await page.waitFor(3000)
    await page.waitForFunction(() => {
      let el = document.querySelector('#loading-spinner')
      return el.clientHeight === 0
    }, { timeout: 60000 });
  })

  it("View Connections Plot", async () => {
    console.log("View Connections plot ...")

    await expect(page).toClick('div[title=\"Connections Plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("View 2D Net Plot", async () => {
    console.log("View 2D Net Plot ...")

    await expect(page).toClick('div[title=\"2D Net Plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Cell traces", async () => {
    console.log("View cell traces ...")

    await expect(page).toClick('div[title=\"Cell traces\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Raster Plot", async () => {
    console.log("View raster plot ...")

    await expect(page).toClick('div[title=\"Raster plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })

  it("Spike Hist Plot", async () => {
    console.log("View spike hist plot ...")

    await expect(page).toClick('div[title=\"Spike Hist Plot\"][role=button]', { timeout: TIMEOUT });
    await page.waitFor(PAGE_WAIT)

    expect(await page.screenshot()).toMatchImageSnapshot({
      ...SNAPSHOT_OPTIONS,
      customSnapshotsDir: "./tests/snapshots/tutorial_1/"
    });
  })
});
