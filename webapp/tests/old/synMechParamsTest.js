/**
 ******************************************************************************
 * ----------------------------- SYNMECH-PARAMS ------------------------------- *
 *******************************************************************************
 */
function populateSynMech (casper, test, toolbox) {
  casper.then(function () { // check rule name exist
    toolbox.active = {
      cardID: "Synapses",
      buttonID: "newSynapseButton",
      tabID: false
    }
    this.waitUntilVisible('input[id="synapseName"]', function () {
      test.assertExist('input[id="synapseName"]', "synapse Name exist");
    })
  })

  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "synapseModSelect", "Exp2Syn")
  })

  casper.then(function () {
    toolbox.setInputValue(this, test, "netParams.synMechParams[\'Synapse\'][\'tau1\']", "0.1");
    toolbox.setInputValue(this, test, "netParams.synMechParams[\'Synapse\'][\'tau2\']", "10");
    toolbox.setInputValue(this, test, "netParams.synMechParams[\'Synapse\'][\'e\']", "-70");
  })
  casper.then(function () {
    this.wait(2500) // for python to receive data
  })
}

// ----------------------------------------------------------------------------//

function checkSynMechValues (casper, test, toolbox, name = "Synapse", mod = "Exp2Syn", tau2 = "10", tau1 = "0.1", e = "-70") {
  casper.then(function () {
    toolbox.getInputValue(this, test, "synapseName", name)
    toolbox.getSelectFieldValue(this, test, "synapseModSelect", mod)
    toolbox.getInputValue(this, test, "netParams.synMechParams[\'" + name + "\'][\'e\']", e)
    toolbox.getInputValue(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau1\']", tau1)
    toolbox.getInputValue(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau2\']", tau2)
  })
}

// ----------------------------------------------------------------------------//

function checkSynMechEmpty (casper, test, toolbox, name) {
  casper.then(function () { // assert new Synapse rule does not displays params before selectiong a "mod"
    this.waitUntilVisible("#synapseName", function () {
      toolbox.getSelectFieldValue(this, test, "synapseModSelect", "")
      toolbox.assertDoesntExist(this, test, "netParams.synMechParams[\'" + name + "\'][\'e\']");
      toolbox.assertDoesntExist(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau1\']");
      toolbox.assertDoesntExist(this, test, "netParams.synMechParams[\'" + name + "\'][\'tau2\']");
    })
  })
}

// ----------------------------------------------------------------------------//
function addTestSynMech (casper, test, toolbox) {
  toolbox.message(casper, "extra synMech to test other cards")
  casper.thenClick('button[id="newSynapseButton"]', function () { // add new population
    this.waitUntilVisible('input[id="synapseName"]', function () {
      test.assertExists('input[id="synapseName"]', "rule added");
    })
  })
  casper.thenClick('button[id="newSynapseButton"]', function () { // add new population
    this.waitUntilVisible('input[id="synapseName"]', function () {
      test.assertExists('input[id="synapseName"]', "rule added");
    })
  })
}

// ----------------------------------------------------------------------------//
module.exports = {
  addTestSynMech: addTestSynMech,
  populateSynMech: populateSynMech,
  checkSynMechEmpty: checkSynMechEmpty,
  checkSynMechValues: checkSynMechValues,
}
