var require = patchRequire(require);
var rangeComponentTest = require('./rangeComponentTest')
/**
 ******************************************************************************
 * ------------------------------- CELL-PARAMS -------------------------------- *
 *******************************************************************************
 */
function populateCellRule (casper, test, toolbox) {
  casper.then(function () {
    toolbox.active = {
      cardID: "CellRules",
      buttonID: "newCellRuleButton",
      tabID: false
    }
  })
  casper.then(function () { // populate cellRule
    toolbox.assertExist(this, test, "cellRuleName")
    toolbox.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellType\']", "PYRMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellModel\']", "HHMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'pop\']", "newPopMenuItem")
  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.then(function () {
    rangeComponentTest.populateRangeComponent(this, test, toolbox, "CellParams") // populate RangeComponent
  })
}

// ----------------------------------------------------------------------------//
function checkCellParamsValues (casper, test, toolbox, name, cellType, cellModel, pop, rangeEmpty = false) {
  casper.then(function () {
    toolbox.getInputValue(this, test, "cellRuleName", name)
    toolbox.getSelectFieldValue(this, test, "netParams.cellParams[\'" + name + "\'][\'conds\'][\'cellType\']", cellType)
    toolbox.getSelectFieldValue(this, test, "netParams.cellParams[\'" + name + "\'][\'conds\'][\'cellModel\']", cellModel)
    toolbox.getSelectFieldValue(this, test, "netParams.cellParams[\'" + name + "\'][\'conds\'][\'pop\']", pop)
  })
  casper.then(function () {
    if (rangeEmpty) {
      rangeComponentTest.checkRangeComponentIsEmpty(this, test, toolbox, "CellParams")
    } else {
      rangeComponentTest.testRangeComponent(this, test, toolbox, "CellParams")
    }
  })
}

// ----------- going to section page ----------
function testSectionAndMechanisms (casper, test, toolbox) {
  toolbox.message(casper, "going to section page")
  casper.thenClick('button[id="newSectionButton"]', function () { // go to "section" page
    this.waitUntilVisible('button[id="Section"]', function () {
      test.assertExist('button[id="Section"]', "landed in section page")
    })
  })

  casper.thenClick('#newSectionButton', function () { // create section 2
    toolbox.getInputValue(this, test, "cellParamsSectionName", "Section2")
  });
  casper.thenClick('button[id="Section"]') // focus on section 1

  // ----------- going to "Geometry" tab in "section" page ----------
  casper.then(function () {
    toolbox.active.buttonID = "newSectionButton"
    toolbox.active.tabID = "sectionGeomTab"
  })

  casper.thenClick("#sectionGeomTab", function () { // go to "geometry" tab in "section" page
    this.echo("going to Geometry tab")
  })
  casper.then(function () { // polulate geometry
    populateSectionGeomTab(this, test, toolbox)
  })

  casper.then(function () { // go to general tab and come back to geometry tab
    toolbox.leaveReEnterTab(this, test, "sectionGeomTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "sectionGeneralTab", "cellParamsSectionName")
  })

  casper.then(function () { // check values remain the same
    checkSectionGeomTabValues(this, test, toolbox, "CellRule", "Section")
  })
  casper.then(function () { // try to delete an item from pt3d component
    toolbox.deleteListItem(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']1")
  })

  casper.thenClick('button[id="Section2"]', function () { // change to rule 2
    this.echo("go to section 2 -> values must be empty")
    this.wait(2500) // let python populate fields  
  })

  casper.then(function () { // check values must be empty
    checkSectionGeomTabValues(this, test, toolbox, "CellRule", "Section2", "", "", "", "", "", "")
  })

  casper.thenClick('button[id="Section"]', function () { // back to section 1
    this.echo("go to section 1 -> values must be populated")
    this.wait(2500) // let pyhton populate fields
  })
  casper.then(function () { // check values must be populated (except 1 listItem that was deleted)
    checkSectionGeomTabValues(this, test, toolbox, "CellRule", "Section", "")
  })

  // ----------- going to "Topology" tab in "section" page ----------
  casper.thenClick("#sectionTopoTab", function () { // go to "Topology" tab in "section" page
    this.wait(2500) // let python populate fields
    toolbox.active.tabID = "sectionTopoTab"
  })
  casper.then(function () { // populate "topology" tab in "section" page
    populateSectionTopoTab(this, test, toolbox)
  })

  casper.then(function () { // move to another tab and comeback
    toolbox.leaveReEnterTab(this, test, "sectionTopoTab", "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "sectionGeneralTab", "cellParamsSectionName", "div")
  })

  casper.then(function () { // check fields remain the same
    checkSectionTopoTabValues(this, test, toolbox, "CellRule", "Section", "Section", "1", "0")
  })

  casper.thenClick('button[id="Section2"]', function () { // change to rule 2
    this.echo("go to section 2 -> values must be empty")
    this.wait(2500) // let python populate fields  
  })

  casper.then(function () { // check values must be empty
    checkSectionTopoTabValues(this, test, toolbox, "CellRule", "Section2", "", "", "")
  })

  casper.thenClick('button[id="Section"]', function () { // back to section 1
    this.echo("go to section 1 -> values must be populated")
    this.wait(2500) // let pyhton populate fields
  })
  casper.then(function () { // check values must be populated (except 1 listItem that was deleted)
    checkSectionTopoTabValues(this, test, toolbox, "CellRule", "Section", "Section", "1", "0")
  })

  // ----------- going to "Mechanism" page ----------
  casper.thenClick("#sectionGeneralTab", function () { // Go to Mechs page
    this.waitUntilVisible('button[id="newMechButton"]', function () {
      toolbox.message(this, "going to mechanisms page...")
    })
  })
  casper.thenClick("#newMechButton", function () { // check landing in Mech page
    test.assertDoesntExist('button[id="Section"]', "landed in Mechanisms page");
  })

  casper.then(function () {
    toolbox.active.buttonID = "newMechButton"
    toolbox.active.tabID = false
  })

  casper.then(function () { // fill mech values
    populateMechs(this, test, toolbox)
  })

  casper.then(function () { // check values are correct while moving between mechs
    checkMechs(this, test, toolbox)
  })

  casper.thenClick('#newSectionButton', function () { // leave Mech page and go to Section page
    this.click("#newMechButton")
  })
  casper.then(function () { // go back to Mechs page
    this.waitUntilVisible('button[id="mechThumbhh"]', function () {
      test.assertExist('button[id="mechThumbhh"]', "landed back to Mech page")
    })
  })

  casper.then(function () { // check mechs fields remain the same
    checkMechs(this, test, toolbox)
  })

  casper.then(function () {
    this.echo("delete mechanisms:")
  })
  casper.then(function () { // del pas mech
    toolbox.delThumbnail(this, test, "mechThumbpas")
  })
  casper.then(function () { // del fastpas mech
    toolbox.delThumbnail(this, test, "mechThumbfastpas")
  })

  casper.thenClick('button[id="newSectionButton"]', function () { // go back to --sections--
  });

  casper.then(function () { // delete section 2
    this.echo("delete section 2:")
    toolbox.delThumbnail(this, test, "Section2")
  })

  casper.thenClick('button[id="Section"]', function () {
    toolbox.renameRule(this, test, "cellParamsSectionName", "newSec") // rename section 
  })

  casper.thenClick('button[id="newCellRuleButton"]', function () { // go back to cellRule
    this.echo("went back to cellParams page...")
  })
}

/**
 ******************************************************************************
 * ---------------------------- CELL-PARAMS -- SECTION ------------------------ *
 *******************************************************************************
 */
function populateSectionGeomTab (casper, test, toolbox) {
  casper.then(function () {
    toolbox.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'diam\']", "20")
    toolbox.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'L\']", "30")
    toolbox.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'Ra\']", "100")
    toolbox.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'cm\']", "1")
    toolbox.addListItem(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']", "10,0,0")
    toolbox.addListItem(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'geom\'][\'pt3d\']", "20,0,0")
  })
  casper.then(function () {
    casper.wait(2500) // let python receive values
  })
}

// ----------------------------------------------------------------------------//

function checkSectionGeomTabValues (casper, test, toolbox, ruleName, sectionName, p2 = "[20,0,0]", p1 = "[10,0,0]", d = "20", l = "30", r = "100", c = "1") {
  casper.then(function () {
    toolbox.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'diam\']", d)
    toolbox.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'L\']", l)
    toolbox.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'Ra\']", r)
    toolbox.getInputValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'cm\']", c)
  })
  casper.then(function () {
    if (p2) {
      toolbox.getListItemValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'pt3d\']1", p2)
    }
  })
  casper.then(function () {
    if (p1) {
      toolbox.getListItemValue(this, test, "netParams.cellParams[\'" + ruleName + "\'][\'secs\'][\'" + sectionName + "\'][\'geom\'][\'pt3d\']0", p1)
    }
  })
}

// ----------------------------------------------------------------------------//

function populateSectionTopoTab (casper, test, toolbox) {
  casper.then(function () { // populate "topology" tab in "section" page
    toolbox.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentSec\']", "SectionMenuItem")
    toolbox.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'parentX\']", "1")
    toolbox.setInputValue(this, test, "netParams.cellParams[\'CellRule\'][\'secs\'][\'Section\'][\'topol\'][\'childX\']", "0")
  })
  casper.then(function () {
    casper.wait(2500) // let python receive values
  })
}

// ----------------------------------------------------------------------------//

function checkSectionTopoTabValues (casper, test, toolbox, cellRuleName, sectionName, parentSec, pX, cX) {
  casper.then(function () {
    toolbox.getSelectFieldValue(this, test, "netParams.cellParams[\'" + cellRuleName + "\'][\'secs\'][\'" + sectionName + "\'][\'topol\'][\'parentSec\']", parentSec)
    toolbox.getInputValue(this, test, "netParams.cellParams[\'" + cellRuleName + "\'][\'secs\'][\'" + sectionName + "\'][\'topol\'][\'parentX\']", pX)
    toolbox.getInputValue(this, test, "netParams.cellParams[\'" + cellRuleName + "\'][\'secs\'][\'" + sectionName + "\'][\'topol\'][\'childX\']", cX)
  })
}

/**
 *******************************************************************************
 * ---------------------------- CELL-PARAMS -- MECHS -------------------------- *
 *******************************************************************************
 */

function populateMechs (casper, test, toolbox) {
  casper.then(function () { // add HH mechanism and populate fields
    this.echo("add HH mech")
    populateMech(this, test, toolbox, "hh", { n: "mechNamegnabar", v: "0.1" }, { n: "mechNamegkbar", v: "0.2" }, { n: "mechNamegl", v: "0.3" }, { n: "mechNameel", v: "0.4" },
      true
    )
  })

  casper.then(function () { // add PAS mechanism and populate fields
    this.echo("add PAS mech")
    populateMech(this, test, toolbox, "pas", { n: "mechNameg", v: "0.5" }, { n: "mechNamee", v: "0.6" }, { n: "", v: "" }, { n: "", v: "" }
    )
  })

  casper.then(function () { // add FASTPAS mechanism and populate fields
    this.echo("add FASTPAS mech")
    populateMech(this, test, toolbox, "fastpas", { n: "mechNameg", v: "0.7" }, { n: "mechNamee", v: "0.8" }, { n: "", v: "" }, { n: "", v: "" }
    )
  })
}

// ----------------------------------------------------------------------------//

function checkMechs (casper, test, toolbox) {
  casper.then(function () { // check values after coming back to HH mech
    this.echo("check HH fields")
    checkMechValues(this, test, toolbox, "mechThumbhh", "hh", { n: "mechNamegnabar", v: "0.1" }, { n: "mechNamegkbar", v: "0.2" }, { n: "mechNamegl", v: "0.3" }, { n: "mechNameel", v: "0.4" }
    )
  })
  casper.then(function () { // check values after coming back to PAS mech
    this.echo("check PAS fields")
    checkMechValues(this, test, toolbox, "mechThumbpas", "pas", { n: "mechNameg", v: "0.5" }, { n: "mechNamee", v: "0.6" }, { n: "", v: "" }, { n: "", v: "" }
    )
  })
  casper.then(function () { // check values after coming back to HH mech
    this.echo("check FASTPAS fields")
    checkMechValues(this, test, toolbox, "mechThumbfastpas", "fastpas", { n: "mechNameg", v: "0.7" }, { n: "mechNamee", v: "0.8" }, { n: "", v: "" }, { n: "", v: "" }
    )
  })
}

// ----------------------------------------------------------------------------//

function populateMech (casper, test, toolbox, mechName, v1, v2, v3, v4, doNotOpenSelectField = false) {
  {doNotOpenSelectField ? null : casper.thenClick('#newMechButton', function () { // click SelectField and check MenuItem exist
    this.waitUntilVisible('span[id="' + mechName + '"]')
  })}
  casper.thenClick("#" + mechName, function () { // click add mech and populate fields
    toolbox.getInputValue(this, test, "singleMechName", mechName)
    toolbox.setInputValue(this, test, v1.n, v1.v);
    toolbox.setInputValue(this, test, v2.n, v2.v);
    v3.v ? toolbox.setInputValue(this, test, v3.n, v3.v) : {};
    v4.v ? toolbox.setInputValue(this, test, v4.n, v4.v) : {};
  })
  casper.then(function () {
    casper.wait(2500) // for python to receive data
  })
}

// ----------------------------------------------------------------------------//

function checkMechValues (casper, test, toolbox, mechThumb, mech, v1, v2, v3, v4) {
  casper.thenClick('button[id="' + mechThumb + '"]')
  casper.then(function () {
    casper.wait(2500) // for python to populate fields
  })
  casper.then(function () { // check Fields
    toolbox.getInputValue(this, test, "singleMechName", mech)
    toolbox.getInputValue(this, test, v1.n, v1.v);
    toolbox.getInputValue(this, test, v2.n, v2.v);
    v3.v ? toolbox.getInputValue(this, test, v3.n, v3.v) : {};
    v4.v ? toolbox.getInputValue(this, test, v4.n, v4.v) : {};
  });
}

/**
 ******************************************************************************
 * ----------------------- CELL-PARAMS -- Full check -------------------------- *
 *******************************************************************************
 */
function exploreCellRuleAfterRenaming (casper, test, toolbox) {
  casper.then(function () {
    toolbox.active.buttonID = "newCellRuleButton"
    toolbox.active.tabID = false
  })
  casper.then(function () {
    checkCellParamsValues(this, test, toolbox, "newCellRule", "PYR", "HH", "newPop")
  })

  casper.thenClick('button[id="newSectionButton"]', function () { // go to "sections"
    test.assertExist('button[id="newSectionButton"]', "landed in section")
  })
  casper.then(function () {
    this.wait(2500)
  })
  casper.then(function () {
    this.waitUntilVisible('button[id="newSec"]', function () {
      this.click('button[id="newSec"]')
    })
  })
  casper.then(function () {
    this.wait(2500) // wait  for python to populate fields
    toolbox.active.buttonID = "newSectionButton"
  })

  casper.then(function () { // check section name
    toolbox.getInputValue(this, test, "cellParamsSectionName", "newSec")
  })

  casper.thenClick("#sectionGeomTab", function () { // go to Geometry tab 
    this.wait(2500) // wait  for python to populate fields
    toolbox.active.tabID = "sectionGeomTab"
  })
  casper.then(function () {
    checkSectionGeomTabValues(this, test, toolbox, "newCellRule", "newSec", "")
  })

  casper.thenClick("#sectionTopoTab", function () { // go to Topology tab
    casper.wait(2500) // wait  for python to populate fields
    toolbox.active.tabID = "sectionTopoTab"
  })

  casper.then(function () {
    checkSectionTopoTabValues(this, test, toolbox, "newCellRule", "newSec", "", "1", "0")
  })

  casper.thenClick("#sectionGeneralTab", function () { // go to "general tab" in "section" page
    this.waitUntilVisible('button[id="newMechButton"]')
  })
  casper.then(function () { // go to mechs page 
    toolbox.click(this, "newMechButton", "button")
  })
  casper.then(function () { // wait for button to appear
    this.waitUntilVisible('button[id="mechThumbhh"]')
  })
  casper.then(function () { // select HH thumbnail
    this.click('button[id="mechThumbhh"]')
    toolbox.active.buttonID = "newMechButton"
    toolbox.active.tabID = false
  })
  casper.then(function () { // check values
    checkMechValues(this, test, toolbox, "mechThumbhh", "hh", { n: "mechNamegnabar", v: "0.1" }, { n: "mechNamegkbar", v: "0.2" }, { n: "mechNamegl", v: "0.3" }, { n: "mechNameel", v: "0.4" }
    )
  })

  casper.then(function () { // check pas and fastpas Thumbnails don't exist
    toolbox.assertDoesntExist(this, test, "mechThumbpas", "button")
    toolbox.assertDoesntExist(this, test, "mechThumbpasfast", "button")
  })
}

// ----------------------------------------------------------------------------//
module.exports = {
  populateCellRule: populateCellRule,
  checkCellParamsValues: checkCellParamsValues,
  testSectionAndMechanisms: testSectionAndMechanisms,
  exploreCellRuleAfterRenaming: exploreCellRuleAfterRenaming,
}
