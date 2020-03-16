var require = patchRequire(require);
var rangeComponentTest = require('./rangeComponentTest')
/**
 ******************************************************************************
 *                                PopParams                                    *
 ******************************************************************************
 */
function populatePopParams (casper, test, toolbox) {
  casper.then(function () {
    toolbox.active = {
      cardID: "Populations",
      buttonID: "newPopulationButton",
      tabID: false
    }
  })
  casper.then(function () { // populate fields
    test.assertExists("#populationName", "Pop name Exists");
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellType\']", "PYR")
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellModel\']", "HH")
  })
  casper.then(function () { // populate dimension component
    populatePopDimension(this, test, toolbox)
  })
  casper.then(function () {
    this.wait(2500) // let python receive data
    toolbox.active.tabID = "spatialDistPopTab"
  })
  casper.thenClick('#spatialDistPopTab', function () { // go to second tab (spatial distribution)
    this.echo("changed tab")
    rangeComponentTest.populateRangeComponent(casper, test, toolbox, "PopParams") // populate RangeComponent
  })
}
// ----------------------------------------------------------------------------//
function checkPopParamsValues (casper, test, toolbox, ruleName, empty = false) {
  casper.then(function () {
    toolbox.active.tabID = false
  })

  casper.then(function () { // check fields remained the same after renaiming and closing card
    toolbox.getInputValue(this, test, "populationName", ruleName);
    toolbox.getInputValue(this, test, "netParams.popParams[\'" + ruleName + "\'][\'cellType\']", !empty ? "PYR" : "");
    toolbox.getInputValue(this, test, "netParams.popParams[\'" + ruleName + "\'][\'cellModel\']", !empty ? "HH" : "");
  })

  casper.then(function () { // check dimension
    if (empty) {
      toolbox.assertDoesntExist(this, test, "popParamsDimensions");
    } else {
      toolbox.getInputValue(this, test, "popParamsDimensions", "20");
    }
  })

  casper.thenClick('#spatialDistPopTab', function () { // go to second tab (spatial distribution)
    this.wait(2500) // wait for python to populate fields
    toolbox.active.tabID = "spatialDistPopTab"
  })

  casper.then(function () {
    if (empty) {
      rangeComponentTest.checkRangeComponentIsEmpty(this, test, toolbox, "PopParams")
    } else {
      rangeComponentTest.testRangeComponent(this, test, toolbox, "PopParams") // check data remained the same
    }
  })
}
// ----------------------------------------------------------------------------//
function populatePopDimension (casper, test, toolbox) {
  casper.then(function () {
    toolbox.click(this, "popParamsDimensionsSelect", "input"); // click dimension SelectList
  })
  casper.then(function () { // check all menuItems exist
    toolbox.assertExist(this, test, "popParamSnumCells", "span");
    toolbox.assertExist(this, test, "popParamSdensity", "span");
    toolbox.assertExist(this, test, "popParamSgridSpacing", "span");
  });

  casper.thenClick("#popParamSnumCells", function () { // check 1st menuItem displays input field
    toolbox.setInputValue(this, test, "popParamsDimensions", "20")
  })
  casper.then(function () { // let python receive changes
    this.wait(2500)
  })
}
// ----------------------------------------------------------------------------//
function addTestPops (casper, test, toolbox) {
  casper.then(function () {
    toolbox.active.tabID = false
  })

  toolbox.message(casper, "extra pops to test other cards")
  casper.thenClick('button[id="newPopulationButton"]', function () { // add new population
    this.waitUntilVisible('input[id="populationName"]', function () {
      test.assertExists('input[id="populationName"]', "rule added");
    })
  })
  casper.then(function () { // populate fields
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellType\']", "GC")
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellModel\']", "IF")
  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.thenClick('button[id="newPopulationButton"]', function () { // add new population
    this.waitUntilVisible('button[id="Population2"]', function () {
      test.assertExists('button[id="Population2"]', "rule added");
    })
  })
  casper.then(function () { // populate fields
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population2\'][\'cellType\']", "BC")
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population2\'][\'cellModel\']", "Izi")
  })
  casper.then(function () {
    this.wait(2500)
  })
}

// ----------------------------------------------------------------------------//
module.exports = {  
  addTestPops: addTestPops,
  populatePopParams: populatePopParams,
  checkPopParamsValues: checkPopParamsValues,
  populatePopDimension: populatePopDimension
}
