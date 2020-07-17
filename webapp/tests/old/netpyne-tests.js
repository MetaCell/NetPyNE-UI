var toolbox = require('./toolbox');
var appbarTest = require('./appbarTest');
var simConfigTest = require('./simConfigTest');
var popParamsTest = require('./popParamsTest');
var cellParamsTest = require('./cellParamsTest');
var connParamsTest = require('./connParamsTest');
var synMechParamsTest = require('./synMechParamsTest');
var stimSourceParamsTest = require('./stimSourceParamsTest');
var stimTargetParamsTest = require('./stimTargetParamsTest');
var simulationTest = require('./simulationTest');

var urlBase = casper.cli.get('host');

if (urlBase == null || urlBase == undefined) {
  urlBase = "http://localhost:8888/";
}

casper.test.begin('NetPyNE projects tests', function suite (test) {
  casper.options.viewportSize = {
    width: 1340,
    height: 768
  };
  casper.options.waitTimeout = 10000
  casper.on("page.error", function (msg, trace) {
    this.echo("Error: " + msg, "ERROR");
  });
  
  /*
   * UNCOMMENT OUT to get the javascript logs (console.log). Particularly useful for debugginf purpose
   * casper.on('remote.message', function (message) { 
   *   this.echo('remote message caught: ' + message);
   * });
   */

  // show page level errors
  casper.on('resource.received', function (resource) {
    var status = resource.status;
    if (status >= 400) {
      this.echo('URL: ' + resource.url + ' Status: ' + resource.status);
    }
  });

  // load netpyne main landing page
  casper.start(urlBase + "geppetto", function () {
    this.echo("Load : " + urlBase);
    // wait for the loading spinner to go away, meaning netpyne has loaded
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      this.wait(5000, function () { // test some expected HTML elements in landing page
        this.echo("I've waited for netpyne to load.");
        test.assertTitle("NetPyNE", "NetPyNE title is ok");
        test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
        test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
      });
    }, null, 40000);
  });

  casper.then(function () { // test HTML elements in landing page
    this.echo("######## Testing landping page contents and layout ######## ", "INFO");
    testLandingPage(test);
  });
  
  casper.then(function () {
    toolbox.header(this, "load network")
    testLoadNetwork(test)
  })
  
  casper.then(function () { // test explore network tab functionality
    toolbox.header(this, "Explore Network Functionality")
    testExploreNetwork(test);
  });
  
  casper.then(function () { // test simulate network tab functionality
    toolbox.header(this, "Simulate Network Functionality")
    testSimulateNetwork(test);
  });

  toolbox.message(casper, "delete model")
  casper.then(function (){
    appbarTest.clearModel(this, test, toolbox)
  })

  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      this.wait(5000, function () { // test some expected HTML elements in landing page
        this.echo("I've waited for netpyne to load.");
        test.assertTitle("NetPyNE", "NetPyNE title is ok");
        test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
        test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
      });
    }, null, 40000)
  })

  // close Poplulation card after deleting model
  casper.then(function () {
    this.waitUntilVisible('div[id="Populations"]', function (){
      this.click('div[id="Populations"]')
    })
  })
  
  casper.then(function () { // test adding a population using UI  
    toolbox.header(this, "test appbar")
    testAppbar(test);
  });

  casper.then(function () { // test adding a population using UI
    toolbox.header(this, "test popParams fields")
    testPopParamsFields(test);
  });
  
  casper.then(function () { // test adding a cell rule using UI
    toolbox.header(this, "test cellparams fields")
    testCellParamsFields(test);
  });
  
  casper.then(function () { // test adding a synapse rule using UI
    toolbox.header(this, "test synMechParams fields")
    testSynMechParamsFields(test);
  });
  
  casper.then(function () { // test adding a connection using UI
    toolbox.header(this, "test connParams fields")
    testConnParamsFields(test);
  });
  
  casper.then(function () { // test adding a stimulus  source using UI
    toolbox.header(this, "test stimSourceParams fields")
    testStimSourceFields(test);
  });
  
  casper.then(function () { // test adding a stimulus target using UI
    toolbox.header(this, "test stimTargetParams fields")
    testStimTargetFields(test);
  });
  
  casper.then(function () { // test config 
    toolbox.header(this, "test simConfig fields")
    testSimConfigFields(test);
  });

  casper.run(function () {
    test.done();
  });
});

/**
 * Test existence of HTML elements expected when main landing page is reached
 */
function testLandingPage (test) {
  casper.then(function () {
    toolbox.assertExist(this, test, "Populations", "div")
    toolbox.assertExist(this, test, "CellRules", "div")
    toolbox.assertExist(this, test, "Synapses", "div")
    toolbox.assertExist(this, test, "Connections", "div")
    toolbox.assertExist(this, test, "StimulationSources", "div")
    toolbox.assertExist(this, test, "Configuration", "div")
    toolbox.assertExist(this, test, "defineNetwork", "button")
    toolbox.assertExist(this, test, "simulateNetwork", "button")
  });
}

/**
 * Load consoles and test they toggle
 */
function testConsoles (test) {
  casper.then(function () { // test existence and toggling of console
    loadConsole(test, 'pythonConsoleButton', "pythonConsole");
  });
  casper.then(function () { // test existence and toggling of console
    loadConsole(test, 'consoleButton', "console");
  });
}

/**
 * Load console, and test it hides/shows fine
 */
function loadConsole (test, consoleButton, consoleContainer) {
  casper.thenClick('li[id="' + consoleButton + '"]', function (){
    this.waitUntilVisible('div[id="' + consoleContainer + '"]', function () {
      this.echo(consoleContainer + ' loaded.');
      test.assertExists('div[id="' + consoleContainer + '"]', consoleContainer + " exists");
    })
  });
  casper.thenClick('li[id="' + consoleButton + '"]', function () {
    this.waitWhileVisible('div[id="' + consoleContainer + '"]', function () {
      this.echo(consoleContainer + ' hidden.');
      test.assertNotVisible('div[id="' + consoleContainer + '"]', consoleContainer + " no longer visible");
    });
  })
  casper.then(function (){
    this.wait(1000)
  })
}
/**
 *****************************************************************************
 *                                  appbar                                    *
 *****************************************************************************
 */
function testAppbar (test) {
  toolbox.message(casper, "import cell template and compile mod files")
  casper.then(function () { 
    appbarTest.importCellTemplate(this, test, toolbox)
  })

  toolbox.message(casper, "import HLS")
  casper.then(function () { 
    appbarTest.importHLS(this, test, toolbox)
  })

  toolbox.message(casper, "run model")
  casper.then(function () {
    appbarTest.instantiateNetwork(this, test, toolbox)
  })

  casper.then(function (){
    appbarTest.simulateNetwork(this, test, toolbox)
  })

  toolbox.message(casper, "save model")
  casper.then(function (){
    appbarTest.saveNetwork(this, test, toolbox)
  })

  toolbox.message(casper, "delete model")
  casper.then(function (){
    appbarTest.clearModel(this, test, toolbox)
  })

  toolbox.message(casper, "open model")
  casper.then(function (){
    appbarTest.openNetwork(this, test, toolbox)
  })

  casper.then(function (){
    appbarTest.exploreOpenedModel(this, test, toolbox)
  })

  toolbox.message(casper, "export HLS")
  casper.then(function (){
    appbarTest.exportHLS(this, test, toolbox)
  })

  toolbox.message(casper, "delete model")
  casper.then(function (){
    appbarTest.clearModel(this, test, toolbox)
  })

  toolbox.message(casper, "import HLS")
  casper.then(function () { 
    appbarTest.importHLS(this, test, toolbox, false)
  })

  toolbox.message(casper, "run model")
  casper.then(function () {
    appbarTest.instantiateNetwork(this, test, toolbox)
  })

  toolbox.message(casper, "delete model")
  casper.then(function (){
    appbarTest.clearModel(this, test, toolbox)
  })

  casper.then(function () {
    this.wait(1000, function (){
      this.click("#Populations")
    })
  })
}
/**
 *****************************************************************************
 *                                 popParams                                  *
 *****************************************************************************
 */
function testPopParamsFields (test) {
  toolbox.message(casper, "create")
  casper.then(function () { // create 2 rules
    toolbox.create2rules(this, test, "Populations", "newPopulationButton", "Population")
  })
  toolbox.message(casper, "populate")
  casper.then(function () { // populate rule 1
    popParamsTest.populatePopParams(this, test, toolbox)
  })
  toolbox.message(casper, "check")
  casper.then(function () { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    toolbox.selectThumbRule(this, test, "Population2", "populationName")
  })
  casper.then(function () { // check rule 2 is empty
    popParamsTest.checkPopParamsValues(this, test, toolbox, "Population2", true)
  })
  casper.then(function () { // focus on rule 1
    this.echo("moved to first rule -> should be populated")
    toolbox.selectThumbRule(this, test, "Population", "populationName")
  })
  casper.then(function () { // check rule 1 is populated
    popParamsTest.checkPopParamsValues(this, test, toolbox, "Population")
  })
  toolbox.message(casper, "rename")
  casper.then(function () { // delete rule 2
    toolbox.delThumbnail(this, test, "Population2")
  })
  casper.then(function () { // focus on rule 1
    toolbox.selectThumbRule(this, test, "Population", "populationName")
  })
  casper.then(function () { // rename rule 1
    toolbox.renameRule(this, test, "populationName", "newPop")
  })
  casper.then(function () { // check rule 1 is populated
    popParamsTest.checkPopParamsValues(this, test, toolbox, "newPop")
  })
  casper.then(function () { // add rules to test other cards
    popParamsTest.addTestPops(this, test, toolbox)
  })
  toolbox.message(casper, "leave")
  casper.thenClick('#Populations', function () {
    toolbox.assertDoesntExist(this, test, "newPopulationButton", "button", "collapse card")
  });
}
/**
 * *****************************************************************************
 *                                 cellParams                                  *
 *****************************************************************************
 */
function testCellParamsFields (test) {
  toolbox.message(casper, "create")
  casper.then(function () { // create 2 rules
    toolbox.create2rules(this, test, "CellRules", "newCellRuleButton", "CellRule")
  })
  toolbox.message(casper, "populate")
  casper.then(function () { // populate rule 1
    cellParamsTest.populateCellRule(this, test, toolbox)
  })
  toolbox.message(casper, "check")
  casper.then(function () { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    toolbox.selectThumbRule(this, test, "CellRule2", "cellRuleName")
  })
  casper.then(function () { // check fields are not copy to rule 2
    cellParamsTest.checkCellParamsValues(this, test, toolbox, "CellRule2", "", "", "", true)
  })
  casper.then(function () { // focus on rule 1
    this.echo("moved to first rule -> should be populated")
    toolbox.selectThumbRule(this, test, "CellRule", "cellRuleName")
  })
  casper.then(function () { // check fields remain the same
    cellParamsTest.checkCellParamsValues(this, test, toolbox, "CellRule", "PYR", "HH", "newPop")
  })
  casper.then(function () { // test Sections and Mechanisms
    cellParamsTest.testSectionAndMechanisms(this, test, toolbox)
  })
  toolbox.message(casper, "rename")
  casper.then(function () { // delete rule 2
    toolbox.delThumbnail(this, test, "CellRule2")
  })
  casper.then(function () { // focus on rule 1
    toolbox.selectThumbRule(this, test, "CellRule", "cellRuleName")
  })
  casper.then(function () { // rename rule 1
    toolbox.renameRule(this, test, "cellRuleName", "newCellRule")
  })
  casper.then(function () {
    cellParamsTest.exploreCellRuleAfterRenaming(this, test, toolbox) // re-explore whole rule
  })
  toolbox.message(casper, "leave")
  casper.thenClick('#CellRules', function () {
    toolbox.assertDoesntExist(this, test, "newCellRuleButton", "collapse card")
  });
}
/**
 ******************************************************************************
 *                               synMechParams                                 *
 *****************************************************************************
 */
function testSynMechParamsFields (test) {
  toolbox.message(casper, "create")
  casper.then(function () { // create 2 rules
    toolbox.create2rules(this, test, "Synapses", "newSynapseButton", "Synapse")
  })
  toolbox.message(casper, "populate")
  casper.then(function () { // populate rule 1
    synMechParamsTest.populateSynMech(this, test, toolbox)
  })
  toolbox.message(casper, "check")
  casper.then(function () { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    toolbox.selectThumbRule(this, test, "Synapse2", "synapseName")
  })
  casper.then(function () { // check rule 2 is empty
    synMechParamsTest.checkSynMechEmpty(this, test, toolbox, "Synapse2")
  })
  casper.then(function () { // focus on rule 1
    this.echo("moved to first rule -> should be populated")
    toolbox.selectThumbRule(this, test, "Synapse", "synapseName")
  })
  casper.then(function () { // check rule 1 is populated
    synMechParamsTest.checkSynMechValues(this, test, toolbox, "Synapse")
  })
  toolbox.message(casper, "rename")
  casper.then(function () { // delete rule 2
    toolbox.delThumbnail(this, test, "Synapse2")
  })
  casper.then(function () { // focus on rule 1
    toolbox.selectThumbRule(this, test, "Synapse", "synapseName")
  })
  casper.then(function () { // rename rule 1
    toolbox.renameRule(this, test, "synapseName", "newSyn")
  })
  casper.then(function () { // check rule 1 is populated
    synMechParamsTest.checkSynMechValues(this, test, toolbox, "newSyn")
  })
  casper.then(function () { // add rules to test other cards
    synMechParamsTest.addTestSynMech(this, test, toolbox)
  })
  toolbox.message(casper, "leave")
  casper.thenClick('#Synapses', function () {
    toolbox.assertDoesntExist(this, test, "newSynapseButton", "collapse card")
  });
}
/**
 ******************************************************************************
 *                                 connParams                                  *
 *****************************************************************************
 */
function testConnParamsFields (test) {
  toolbox.message(casper, "create")
  casper.then(function () { // create 2 rules
    toolbox.create2rules(this, test, "Connections", "newConnectivityRuleButton", "ConnectivityRule")
  })
  toolbox.message(casper, "populate")
  casper.then(function () { // populate rule 1
    connParamsTest.populateConnRule(this, test, toolbox)
  })
  toolbox.message(casper, "check")
  casper.then(function () { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    toolbox.selectThumbRule(this, test, "ConnectivityRule2", "ConnectivityName")
  })
  casper.then(function () { // check rule 2 is empty
    connParamsTest.checkConnRuleValues(this, test, toolbox, "ConnectivityRule2", true)
  })
  casper.then(function () { // focus on rule 1
    this.echo("moved to first rule -> should be populated")
    toolbox.selectThumbRule(this, test, "ConnectivityRule", "ConnectivityName")
  })
  casper.then(function () { // check rule 1 is populated
    connParamsTest.checkConnRuleValues(this, test, toolbox, "ConnectivityRule")
  })
  toolbox.message(casper, "rename")
  casper.then(function () { // delete rule 2
    toolbox.delThumbnail(this, test, "ConnectivityRule2")
  })
  casper.then(function () { // focus on rule 1
    toolbox.selectThumbRule(this, test, "ConnectivityRule", "ConnectivityName")
  })
  casper.then(function () { // rename rule 1
    toolbox.renameRule(this, test, "ConnectivityName", "newRule")
  })
  casper.then(function () { // check rule 1 is populated
    connParamsTest.checkConnRuleValues(this, test, toolbox, "newRule")
  })
  toolbox.message(casper, "leave")
  casper.thenClick('#Connections', function () {
    toolbox.assertDoesntExist(this, test, "newConnectivityRuleButton", "colapse card")
  });
}
/**
 ******************************************************************************
 *                              stimSourceParams                               *
 *****************************************************************************
 */
function testStimSourceFields (test) {
  toolbox.message(casper, "create")
  casper.then(function () { // create 2 rules
    toolbox.create2rules(this, test, "StimulationSources", "newStimulationSourceButton", "stim_source")
  })
  toolbox.message(casper, "populate")
  casper.then(function () { // populate rule 1
    stimSourceParamsTest.populateStimSourceRule(this, test, toolbox)
  })
  toolbox.message(casper, "check")
  casper.then(function () { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    toolbox.selectThumbRule(this, test, "stim_source2", "sourceName")
  })
  casper.then(function () { // check rule 2 is empty
    stimSourceParamsTest.checkStimSourceEmpty(this, test, toolbox, "stim_source2")
  })
  casper.then(function () { // focus on rule 1
    this.echo("moved to first rule -> should be populated")
    toolbox.selectThumbRule(this, test, "stim_source", "sourceName")
  })
  casper.then(function () { // check rule 1 is populated
    stimSourceParamsTest.checkStimSourceValues(this, test, toolbox, "stim_source")
  })
  toolbox.message(casper, "rename")
  casper.then(function () { // delete rule 2
    toolbox.delThumbnail(this, test, "stim_source2")
  })
  casper.then(function () { // focus on rule 1
    toolbox.selectThumbRule(this, test, "stim_source", "sourceName")
  })
  casper.then(function () { // rename rule 1
    toolbox.renameRule(this, test, "sourceName", "newStimSource")
  })
  casper.then(function () { // delete delete delete delete 
    this.wait(2000)
  })
  casper.then(function () { // check rule 1 is populated
    stimSourceParamsTest.checkStimSourceValues(this, test, toolbox, "newStimSource")
  })
  toolbox.message(casper, "leave")
  casper.thenClick('#StimulationSources', function () {
    toolbox.assertDoesntExist(this, test, "newStimulationSourceButton", "collapse card")
  });
}
/**
 * *****************************************************************************
 *                              stimTargetParams                               *
 *****************************************************************************
 */
function testStimTargetFields (test) {
  toolbox.message(casper, "create")
  casper.then(function () { // create 2 rules
    toolbox.create2rules(this, test, "StimulationTargets", "newStimulationTargetButton", "stim_target")
  })
  toolbox.message(casper, "populate")
  casper.then(function () { // populate rule 1
    stimTargetParamsTest.populateStimTargetRule(this, test, toolbox)
  })
  toolbox.message(casper, "check")
  casper.then(function () { // focus on rule 2
    this.echo("moved to second rule -> should be empty")
    toolbox.selectThumbRule(this, test, "stim_target2", "targetName")
  })
  casper.then(function () { // check rule 2 is empty
    stimTargetParamsTest.checkStimTargetValues(this, test, toolbox, "stim_target2", true)
  })
  casper.then(function () { // focus on rule 1
    this.echo("moved to first rule -> should be populated")
    toolbox.selectThumbRule(this, test, "stim_target", "targetName")
  })
  casper.then(function () { // check rule 1 is populated
    stimTargetParamsTest.checkStimTargetValues(this, test, toolbox, "stim_target")
  })
  toolbox.message(casper, "rename")
  casper.then(function () { // delete rule 2
    toolbox.delThumbnail(this, test, "stim_target2")
  })
  casper.then(function () { // focus on rule 1
    toolbox.selectThumbRule(this, test, "stim_target", "targetName")
  })
  casper.then(function () { // rename rule 1
    toolbox.renameRule(this, test, "targetName", "newStimTarget")
  })
  casper.then(function () { // check rule 1 is populated
    stimTargetParamsTest.checkStimTargetValues(this, test, toolbox, "newStimTarget")
  })
  toolbox.message(casper, "leave")
  casper.thenClick('#StimulationTargets', function () {
    toolbox.assertDoesntExist(this, test, "newStimulationTargetButton", "collapse card")
  });
}
/**
 * *****************************************************************************
 *                                  simConfig                                  *
 *****************************************************************************
 */
function testSimConfigFields (test) {
  casper.then(function () {
    simConfigTest.setSimConfigParams(this, test, toolbox)
  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.then(function () {
    simConfigTest.getSimConfigParams(this, test, toolbox)
  })
}
/**
 * *****************************************************************************
 *                               load network                                  *
 *****************************************************************************
 */
function testLoadNetwork (test) {
  /*
   * casper.then(function () {
   *   this.reload(function () {
   *     this.echo("reloading webpage", "INFO")
   *   })
   * })
   */

  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      this.wait(5000, function () { // test some expected HTML elements in landing page
        this.echo("I've waited for netpyne to load.");
        test.assertTitle("NetPyNE", "NetPyNE title is ok");
        test.assertExists('div[id="widgetContainer"]', "NetPyNE loads the initial widgetsContainer");
        test.assertExists('div[id="mainContainer"]', "NetPyNE loads the initial mainContainer");
      });
    }, null, 40000);
  })
  casper.then(function () { // test full netpyne loop using a demo project
    var demo = "from netpyne_ui.tests.tut3 import netParams, simConfig \n"
      + "netpyne_geppetto.netParams=netParams \n"
      + "netpyne_geppetto.simConfig=simConfig";
    simulationTest.loadModelUsingPython(this, test, toolbox, demo);
  });
}
/**
 * *****************************************************************************
 *                            explore network                                  *
 *****************************************************************************
 */
function testExploreNetwork (test) {
  casper.then(function () {
    this.echo("------Testing explore network");
    test.assertExists('button[id="simulateNetwork"]', "Explore network button exists");
  })
  casper.thenClick('#simulateNetwork', function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      simulationTest.canvasComponentsTests(this, test);
    }, 40000)
  })
  casper.then(function () {
    this.echo("Testing meshes for network exist and are visible");
    simulationTest.testMeshVisibility(this, test, true, "network.S[0]");
    simulationTest.testMeshVisibility(this, test, true, "network.S[1]");
    simulationTest.testMeshVisibility(this, test, true, "network.S[2]");
    simulationTest.testMeshVisibility(this, test, true, "network.S[18]");
    simulationTest.testMeshVisibility(this, test, true, "network.S[19]");
  })
  casper.thenClick('#PlotButton');
  casper.then(function () { // wait for plot menu to become visible
    this.waitUntilVisible('div[role="menu"]', function () {
      test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");
    })
  })
  casper.then(function () { // test connection plot comes up
    simulationTest.testPlotButton(this, test, "connectionPlot", "Popup1");
  });
  casper.then(function () {
    simulationTest.testPlotButton(this, test, "2dNetPlot", "Popup1");
  })
  casper.then(function (){ // test shape plot comes up
    simulationTest.testPlotButton(this, test, "shapePlot", "Popup1");
  });
  casper.then(function () {
    var info = this.getElementInfo('button[id="PlotButton"]');
    this.mouse.click(info.x - 4, info.y - 4); // move a bit away from corner
  })
  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function () {
    this.waitWhileVisible('div[role="menu"]', function () { // wait for menu to close
      test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");
    });
  })
  casper.thenClick('#ControlPanelButton');
  casper.then(function () { // test initial load values in control panel
    simulationTest.testControlPanelValues(this, test, 43);
  });

  casper.thenClick('#ControlPanelButton');
}
/**
 * *****************************************************************************
 *                           simulate network                                  *
 *****************************************************************************
 */
function testSimulateNetwork (test) {
  casper.thenClick('#launchSimulationButton', function (){
    this.waitUntilVisible('button[id="okRunSimulation"]')
  });
  casper.thenClick('#okRunSimulation', function () {
    this.waitWhileVisible('button[id="okRunSimulation"]', function () {
      this.echo("Dialog disappeared");
    })
  });
  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      this.echo("Loading spinner disappeared");
      this.echo("Testing meshes for network exist and are visible");
      simulationTest.testMeshVisibility(this, test, true, "network.S[0]");
      simulationTest.testMeshVisibility(this, test, true, "network.S[1]");
      simulationTest.testMeshVisibility(this, test, true, "network.S[2]");
      simulationTest.testMeshVisibility(this, test, true, "network.S[18]");
      simulationTest.testMeshVisibility(this, test, true, "network.S[19]");
    }, 150000);
  })
  casper.thenClick('#PlotButton');
  casper.then(function () {
    this.waitUntilVisible('div[role="menu"]', function () {
      test.assertExists('div[role="menu"]', "Drop down Plot Menu Exists");
    })
  })
  casper.then(function () {
    simulationTest.testPlotButton(this, test, "rasterPlot", "Popup1");
  });
  casper.then(function () {
    simulationTest.testPlotButton(this, test, "spikePlot", "Popup1");
  });
  casper.then(function (){
    simulationTest.testPlotButton(this, test, "spikeStatsPlot", "Popup1");
  });
  casper.then(function () {
    simulationTest.testPlotButton(this, test, "ratePSDPlot", "Popup1");
  });
  casper.then(function () {
    simulationTest.testPlotButton(this, test, "tracesPlot", "Popup1");
  });
  casper.then(function () {
    simulationTest.testPlotButton(this, test, "grangerPlot", "Popup1");
  });
  casper.then(function () {
    var info = this.getElementInfo('button[id="PlotButton"]');
    this.mouse.click(info.x - 4, info.y - 4); // move a bit away from corner
  })
  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function () {
    this.waitWhileVisible('div[role="menu"]', function () {
      test.assertDoesntExist('div[role="menu"]', "Drop down Plot Menu is gone");
    })
  })
}
