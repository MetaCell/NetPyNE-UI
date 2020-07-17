/**
 ******************************************************************************
 * --------------------------- STIM-SOURCE-PARAMS ----------------------------- *
 *******************************************************************************
 */
function populateStimSourceRule (casper, test, toolbox) {
  casper.then(function () {
    toolbox.active = {
      cardID: "StimulationSources",
      buttonID: "newStimulationSourceButton",
      tabID: false
    }
  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.then(function () { // check name and source type
    toolbox.getInputValue(this, test, "sourceName", "stim_source")
    toolbox.getSelectFieldValue(this, test, "stimSourceSelect", "")
  })

  casper.then(function () {
    this.echo("VClamp")
    this.wait(500)
  })

  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "stimSourceSelect", "VClampMenuItem")
  })

  casper.then(function () { // select VClamp source
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'tau1\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'tau2\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'gain\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'rstim\']", "")
    toolbox.assertDoesntExist(this, test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']0")
    toolbox.assertDoesntExist(this, test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']0")
  })

  casper.then(function () {
    this.echo("NetStim")
    this.wait(500)
  })
  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "stimSourceSelect", "NetStimMenuItem")
  })

  casper.then(function () { // select NetStim source and check correct params
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'rate\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'interval\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'number\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'start\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'noise\']", "")
  })

  casper.then(function () {
    this.echo("Alpha Synapse")
    casper.wait(500)
  })
  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "stimSourceSelect", "AlphaSynapseMenuItem")
  })

  casper.then(function () { // select AlphaSynapseMenuItem source and check correct params
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'onset\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'tau\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'gmax\']", "")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'e\']", "")
  })

  casper.then(function () {
    this.echo("IClamp")
    casper.wait(500)
  })

  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "stimSourceSelect", "IClampMenuItem")
  })

  casper.then(function () { // select ICLamp source and check correct params
    toolbox.setInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'del\']", "1")
    toolbox.setInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'dur\']", "2")
    toolbox.setInputValue(this, test, "netParams.stimSourceParams[\'stim_source\'][\'amp\']", "3")
  })

  casper.then(function () {
    this.wait(2000)
  })
}

// ----------------------------------------------------------------------------//
function checkStimSourceEmpty (casper, test, toolbox, name) {
  casper.then(function () { // check name and source type
    toolbox.getInputValue(this, test, "sourceName", name)
    toolbox.getSelectFieldValue(this, test, "stimSourceSelect", "")
  })
}

// ----------------------------------------------------------------------------//
function checkStimSourceValues (casper, test, toolbox, name) {
  casper.then(function () {
    toolbox.getInputValue(this, test, "sourceName", name)
    toolbox.getSelectFieldValue(this, test, "stimSourceSelect", "IClamp")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'" + name + "\'][\'del\']", "1")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'" + name + "\'][\'dur\']", "2")
    toolbox.getInputValue(this, test, "netParams.stimSourceParams[\'" + name + "\'][\'amp\']", "3")
  })
}

// ----------------------------------------------------------------------------//
module.exports = {
  checkStimSourceEmpty: checkStimSourceEmpty,
  checkStimSourceValues: checkStimSourceValues,
  populateStimSourceRule: populateStimSourceRule
}
