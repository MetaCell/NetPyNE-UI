var require = patchRequire(require);
var rangeComponentTest = require('./rangeComponentTest')
/**
 ******************************************************************************
 * --------------------------- STIM-TARGET-PARAMS ----------------------------- *
 *******************************************************************************
 */
function populateStimTargetRule (casper, test, toolbox) {
  casper.then(function () {
    toolbox.active = {
      cardID: "StimulationTargets",
      buttonID: "newStimulationTargetButton",
      tabID: false
    }
  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.then(function () {
    toolbox.getInputValue(this, test, "targetName", "stim_target")
    toolbox.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'source\']", "newStimSourceMenuItem")
    toolbox.setInputValue(this, test, "netParams.stimTargetParams['stim_target']['sec']", "soma")
    toolbox.setInputValue(this, test, "netParams.stimTargetParams['stim_target']['loc']", "0.5")
  })
  casper.then(function () {
    this.wait(2500) // for python to receive data
  })

  casper.then(function () {
    toolbox.moveToTab(this, test, "stimTargetCondsTab", "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "input")
  })

  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'pop\']", "PopulationMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellModel\']", "IFMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellType\']", "GCMenuItem")
  })
  casper.then(function () { // test range component
    rangeComponentTest.populateRangeComponent(this, test, toolbox, "StimTarget");
  });
  casper.then(function () {
    toolbox.addListItem(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "0")
    toolbox.addListItem(this, test, "netParams.stimTargetParams[\'stim_target\'][\'conds\'][\'cellList\']", "3")
  })
  casper.then(function () {
    this.wait(2500) // for python to receibe data
  })
}

// ----------------------------------------------------------------------------//
function checkStimTargetValues (casper, test, toolbox, name, empty = false) {
  casper.then(function () {
    toolbox.active.tabID = false
  })
  casper.then(function () { //
    toolbox.getInputValue(this, test, "targetName", name)
    toolbox.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'source\']", !empty ? "newStimSource" : "")
    toolbox.getInputValue(this, test, "netParams.stimTargetParams['" + name + "']['sec']", !empty ? "soma" : "")
    toolbox.getInputValue(this, test, "netParams.stimTargetParams['" + name + "']['loc']", !empty ? "0.5" : "")
  })

  casper.then(function () {
    toolbox.moveToTab(this, test, "stimTargetCondsTab", "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']", "input")
  })

  casper.then(function () {
    toolbox.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'pop\']", !empty ? "Population" : "")
    toolbox.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellModel\']", !empty ? "IF" : "")
    toolbox.getSelectFieldValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellType\']", !empty ? "GC" : "")
  })
  casper.then(function () {
    if (empty) {
      rangeComponentTest.checkRangeComponentIsEmpty(this, test, toolbox, "StimTarget")
    } else {
      rangeComponentTest.testRangeComponent(this, test, toolbox, "StimTarget") // check data remained the same
    }
  })
  casper.then(function () {
    if (empty) {
      toolbox.assertDoesntExist(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']0")
    } else {
      toolbox.getListItemValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']0", "0")
      toolbox.getListItemValue(this, test, "netParams.stimTargetParams[\'" + name + "\'][\'conds\'][\'cellList\']1", "3")
    }
  })
}

// ----------------------------------------------------------------------------//
module.exports = {
  checkStimTargetValues: checkStimTargetValues,
  populateStimTargetRule: populateStimTargetRule
}
