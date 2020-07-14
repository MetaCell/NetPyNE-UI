/**
 ******************************************************************************
 *                                 RangeComponent                              *
 ******************************************************************************
 */
function populateRangeComponent (casper, test, toolbox, model) {
  casper.then(function () {
    this.echo("explore range component")
    exploreRangeComponent(this, test, toolbox, model)
  })
  casper.then(function () { // populate fields with correct and wrong values
    this.echo("set values on range component")
    toolbox.setInputValue(this, test, "xRange" + model + "MinRange", "0.1")
    toolbox.setInputValue(this, test, "xRange" + model + "MaxRange", "0.9")
    toolbox.setInputValue(this, test, "yRange" + model + "MinRange", "100")
    toolbox.setInputValue(this, test, "yRange" + model + "MaxRange", "900")
    toolbox.setInputValue(this, test, "zRange" + model + "MinRange", "0.2")
    toolbox.setInputValue(this, test, "zRange" + model + "MaxRange", "A")
  })
  casper.then(function () { // let python receive data
    this.wait(2000)
  })
}

// ----------------------------------------------------------------------------//

function exploreRangeComponent (casper, test, toolbox, model) {
  casper.then(function () {
    exploreRangeAxis(this, test, toolbox, model, "x", "Normalized");
    exploreRangeAxis(this, test, toolbox, model, "y", "Absolute");
    exploreRangeAxis(this, test, toolbox, model, "z", "Normalized");
  })
}

// ----------------------------------------------------------------------------//

function exploreRangeAxis (casper, test, toolbox, model, axis, norm) {
  var elementID = axis + "Range" + model + "Select"
  var secondElementID = axis + "Range" + model + norm + "MenuItem"
  casper.then(function () {
    toolbox.click(this, elementID)
  })
  casper.then(function () {
    this.waitUntilVisible('span[id="' + secondElementID + '"]') // wait for dropDownMenu animation
  })
  casper.then(function () {
    toolbox.click(this, secondElementID, "span")
  })
  casper.then(function () {
    this.waitWhileVisible('span[id="' + secondElementID + '"]')
  })
  casper.then(function () {
    toolbox.assertExist(this, test, elementID.replace("Select", "") + "MinRange", "input", "min limit in range " + axis + " Exist")
    toolbox.assertExist(this, test, elementID.replace("Select", "") + "MaxRange", "input", "max limit in range " + axis + " Exist")
  })
}

// ----------------------------------------------------------------------------//

function testRangeComponent (casper, test, toolbox, model) {
  casper.then(function () {
    this.wait(1500, function () { // let pyhton populate fields
      toolbox.getInputValue(this, test, "xRange" + model + "MinRange", "0.1");
      toolbox.getInputValue(this, test, "xRange" + model + "MaxRange", "0.9");
      toolbox.getInputValue(this, test, "yRange" + model + "MinRange", "100");
      toolbox.getInputValue(this, test, "yRange" + model + "MaxRange", "900");
      toolbox.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
      toolbox.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
    })
  })
}

// ----------------------------------------------------------------------------//

function checkRangeComponentIsEmpty (casper, test, toolbox, model) {
  casper.wait(1000, function () { // wait for python to populate fields
    toolbox.assertDoesntExist(this, test, "xRange" + model + "MinRange");
    toolbox.assertDoesntExist(this, test, "xRange" + model + "MaxRange");
    toolbox.assertDoesntExist(this, test, "yRange" + model + "MinRange");
    toolbox.assertDoesntExist(this, test, "yRange" + model + "MaxRange");
    toolbox.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
    toolbox.assertDoesntExist(this, test, "zRange" + model + "MaxRange")
  })
}

// ----------------------------------------------------------------------------//
module.exports = {  
  exploreRangeAxis: exploreRangeAxis,
  testRangeComponent: testRangeComponent,
  exploreRangeComponent: exploreRangeComponent,
  populateRangeComponent: populateRangeComponent,
  checkRangeComponentIsEmpty: checkRangeComponentIsEmpty,
}
