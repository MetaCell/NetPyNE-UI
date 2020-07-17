var require = patchRequire(require);
var rangeComponentTest = require('./rangeComponentTest')
/**
 ******************************************************************************
 * ------------------------------- CONN-PARAMS -------------------------------- *
 *******************************************************************************
 */
function populateConnRule (casper, test, toolbox) {
  casper.then(function () {
    toolbox.active = {
      cardID: "Connections",
      buttonID: "newConnectivityRuleButton",
      tabID: false
    }
    toolbox.assertExist(this, test, "ConnectivityName", "input", "conn name exist")
  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.then(function () { // check all fields exist
    toolbox.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']", "soma")
    toolbox.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']", "0.5")
    toolbox.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'sec\']", "dend")
    toolbox.addListItem(this, test, "netParams.connParams[\'ConnectivityRule\'][\'loc\']", "1")
    toolbox.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'delay\']", "5")
    toolbox.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'weight\']", "0.03")
    toolbox.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'plasticity\']", "0.0001")
    toolbox.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'convergence\']", "1")
    toolbox.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'divergence\']", "2")
    toolbox.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'probability\']", "3")
    toolbox.setInputValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'synsPerConn\']", "4")
    toolbox.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'synMech\']", "SynapseMenuItem")

  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.then(function () {
    toolbox.moveToTab(this, test, "preCondsConnTab", "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'pop\']", "div")
  })

  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'pop\']", "PopulationMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellModel\']", "IFMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'preConds\'][\'cellType\']", "GCMenuItem")
    rangeComponentTest.populateRangeComponent(this, test, toolbox, "PreConn")
  })
  casper.then(function () {
    toolbox.moveToTab(this, test, "postCondsConnTab", "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'pop\']", "div")
  })

  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'pop\']", "Population2MenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellModel\']", "IziMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.connParams[\'ConnectivityRule\'][\'postConds\'][\'cellType\']", "BCMenuItem")
  })
  casper.then(function () {
    this.wait(2500) // let python receive values
  })
  casper.then(function () {
    toolbox.moveToTab(this, test, "generalConnTab", "ConnectivityName", "input")
  })
}
// ----------------------------------------------------------------------------//
function checkConnRuleValues (casper, test, toolbox, name = "ConnectivityRule", empty = false) {
  toolbox.active = {
    cardID: "Connections",
    buttonID: "newConnectivityRuleButton",
    tabID: false
  }
  casper.then(function () { // check all fields exist
    if (empty) {
      test.assertDoesntExist('input[id="netParams.connParams[\'"' + name + '"\'][\'sec\']0"]', "sec list is empty")
      test.assertDoesntExist('input[id="netParams.connParams[\'"' + name + '"\'][\'loc\']0"]', "loc list is empty")
    } else {
      toolbox.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'sec\']0", "soma")
      toolbox.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'sec\']1", "dend")
      toolbox.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'loc\']0", "0.5")
      toolbox.getListItemValue(this, test, "netParams.connParams[\'" + name + "\'][\'loc\']1", "1")
    }
    toolbox.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'delay\']", !empty ? "5" : "")
    toolbox.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'weight\']", !empty ? "0.03" : "")
    toolbox.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'plasticity\']", !empty ? "0.0001" : "")
    toolbox.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'convergence\']", !empty ? "1" : "")
    toolbox.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'divergence\']", !empty ? "2" : "")
    toolbox.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'probability\']", !empty ? "3" : "")
    toolbox.getInputValue(this, test, "netParams.connParams[\'" + name + "\'][\'synsPerConn\']", !empty ? "4" : "")
    toolbox.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'synMech\']", !empty ? "Synapse" : "")
  })
  casper.then(function () {
    toolbox.moveToTab(this, test, "preCondsConnTab", "netParams.connParams[\'" + name + "\'][\'preConds\'][\'pop\']", "div")
  })

  casper.then(function () {
    toolbox.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'preConds\'][\'pop\']", !empty ? "Population" : "")
    toolbox.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'preConds\'][\'cellModel\']", !empty ? "IF" : "")
    toolbox.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'preConds\'][\'cellType\']", !empty ? "GC" : "")
    if (empty) {
      rangeComponentTest.checkRangeComponentIsEmpty(this, test, toolbox, "PreConn")
    } else {
      rangeComponentTest.testRangeComponent(this, test, toolbox, "PreConn")
    }
  })
  casper.then(function () {
    toolbox.moveToTab(this, test, "postCondsConnTab", "netParams.connParams[\'" + name + "\'][\'postConds\'][\'pop\']", "div")
  })

  casper.then(function () {
    toolbox.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'postConds\'][\'pop\']", !empty ? "Population2" : "")
    toolbox.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'postConds\'][\'cellModel\']", !empty ? "Izi" : "")
    toolbox.getSelectFieldValue(this, test, "netParams.connParams[\'" + name + "\'][\'postConds\'][\'cellType\']", !empty ? "BC" : "")
    rangeComponentTest.checkRangeComponentIsEmpty(this, test, toolbox, "PostConn")
  })
  casper.then(function () {
    toolbox.moveToTab(this, test, "generalConnTab", "ConnectivityName", "input")
  })
}

// ----------------------------------------------------------------------------//
module.exports = {
  populateConnRule: populateConnRule,
  checkConnRuleValues: checkConnRuleValues
}
