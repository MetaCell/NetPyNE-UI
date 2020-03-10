/**
 ******************************************************************************
 *                                  load network                               *
 *****************************************************************************
 */
function loadModelUsingPython (casper, test, toolbox, demo) {
  casper.then(function () {
    this.echo("Loading demo for further testing ", "INFO");
    this.evaluate(function (demo) {
      var kernel = IPython.notebook.kernel;
      kernel.execute(demo);
    }, demo);
  });

  casper.then(function () {
    this.waitUntilVisible('div[id="Populations"]')
  })

  casper.thenClick('div[id="Populations"]', function () {
    this.waitUntilVisible('button[id="newPopulationButton"]', function () {
      this.echo("Population view loaded");
    });
  });

  casper.then(function () { // test first population exists after demo is loaded
    testPopulation(this, test, toolbox, "button#S", "S", "HH", "PYR", "20");
  });

  casper.then(function () { // test second population exists after demo is loaded
    testPopulation(this, test, toolbox, "button#M", "M", "HH", "PYR", "20");
  });

  casper.thenClick('#CellRules', function () {
    this.waitUntilVisible('button[id="newCellRuleButton"]', function () {
      this.echo("Cell Rule view loaded");
    });
  })

  casper.then(function () { // test a cell rule exists after demo is loaded
    testCellRule(this, test, toolbox, "button#PYRrule", "PYRrule", 'div[id="netParams.cellParams[\'PYRrule\'][\'conds\'][\'cellType\']"]', 'div[id="netParams.cellParams[\'PYRrule\'][\'conds\'][\'cellModel\']"]');
  });
}
// ------------------------------------------------------------------------------
function testPopulation (casper, test, toolbox, buttonSelector, expectedName, expectedCellModel, expectedCellType, expectedDimensions) {
  casper.then(function () {
    toolbox.active = {
      cardID: "Populations",
      buttonID: "newPopulationButton",
      tabID: false
    }
    this.echo("------Testing population button " + buttonSelector);
    this.waitUntilVisible(buttonSelector, function () {
      test.assertExists(buttonSelector, "Population " + expectedName + " correctly created");
    })
  })
  casper.thenClick('#' + expectedName); // click pop thumbnail
  casper.then(function () { // let python populate fields
    this.wait(2000, function () {
      this.echo("I've waited a second for metadata to be populated")
    });
  });
  casper.then(function () { // test metadata contents
    toolbox.getInputValue(this, test, "populationName", expectedName);
    toolbox.getInputValue(this, test, "netParams.popParams[\'" + expectedName + "\'][\'cellModel\']", expectedCellModel);
    toolbox.getInputValue(this, test, "netParams.popParams[\'" + expectedName + "\'][\'cellType\']", expectedCellType);
    toolbox.getInputValue(this, test, "popParamsDimensions", expectedDimensions);
  });
}
// ------------------------------------------------------------------------------
function testCellRule (casper, test, toolbox, buttonSelector, expectedName, expectedCellModelId, expectedCellTypeId) {
  casper.then(function () {
    toolbox.active = {
      cardID: "CellRules",
      buttonID: "newCellRuleButton",
      tabID: false
    }
    this.echo("------Testing cell rules button " + buttonSelector);
    this.waitUntilVisible(buttonSelector, function () {
      this.echo('Cell Rule button exists.');
      this.click('#' + expectedName);
    })
  })
  casper.then(function () { // give it some time to allow metadata to load
    this.wait(1000, function () {
      this.echo("I've waited a second for metadata to be populated")
    });
  });
  casper.then(function () { // test contents of metadata
    toolbox.getInputValue(this, test, "cellRuleName", expectedName);
    test.assertExists(expectedCellModelId, "cellRullCellModel exists");
    test.assertExists(expectedCellTypeId, "cellRullCellType exists");
  });
}
/**
 ******************************************************************************
 *                    ExploreNetwork & SimulateNetwork                         *
 ******************************************************************************
 */
function canvasComponentsTests (casper, test) {
  casper.then(function () {
    this.echo("Testing existence of few simulation controls")
    test.assertExists('button[id="panLeftBtn"]', "Pan left button present");
    test.assertExists('button[id="panUpBtn"]', "Pan up button present");
    test.assertExists('button[id="panRightBtn"]', "Pan right button present");
    test.assertExists('button[id="panHomeBtn"]', "Pan home button present");
    test.assertExists('button[id="zoomOutBtn"]', "Zoom out button present");
    test.assertExists('button[id="zoomInBtn"]', "Zoom in button present");
    test.assertExists('button[id="PlotButton"]', "Plot button present");
    test.assertExists('button[id="ControlPanelButton"]', "Control panel ");
  });
}
// ------------------------------------------------------------------------------
function testMeshVisibility (casper, test, visible, variableName) {
  casper.then(function () {
    var visibility = this.evaluate(function (variableName) {
      var visibility = CanvasContainer.engine.getRealMeshesForInstancePath(variableName)[0].visible;
      return visibility;
    }, variableName);
    test.assertEquals(visibility, visible, variableName + " visibility correct");
  });
}
// ------------------------------------------------------------------------------
function testPlotButton (casper, test, plotButton, expectedPlot) {
  casper.then(function () {
    test.assertExists('span[id="' + plotButton + '"]', "Menu option " + plotButton + "Exists");
  })
  casper.thenEvaluate(function (plotButton, expectedPlot) {
    document.getElementById(plotButton).click(); // Click on plot option
  }, plotButton, expectedPlot);
  
  casper.then(function () {
    this.waitUntilVisible('div[id="' + expectedPlot + '"]', function () {
      test.assertExists('div[id="' + expectedPlot + '"]', expectedPlot + " (" + plotButton + ") exists");
    })
  })
  casper.then(function () { // test plot has certain elements that are render if plot succeeded
    waitForPlotGraphElement(this, test, "figure_1");
    waitForPlotGraphElement(this, test, "axes_1");
  });
  casper.thenEvaluate(function (expectedPlot) {
    window[expectedPlot].destroy();
  }, expectedPlot);
  
  casper.then(function (){
    this.waitWhileVisible('div[id="' + expectedPlot + '"]', function () {
      test.assertDoesntExist('div[id="' + expectedPlot + '"]', expectedPlot + " (" + plotButton + ") no longer exists");
    });
  })  
  
  casper.then(function () {
    var plotError = test.assertEvalEquals(function () {
      var error = document.getElementById("netPyneDialog") == undefined;
      if (!error) {
        document.getElementById("netPyneDialog").click();
      }
      return error;
    }, true, "Open plot for action: " + plotButton);
  });
}
// ------------------------------------------------------------------------------
function waitForPlotGraphElement (casper, test, elementID) {
  casper.then(function () {
    this.waitUntilVisible('g[id="' + elementID + '"]', function () {
      test.assertExists('g[id="' + elementID + '"]', "Element " + elementID + " exists");
    });
  })
}
// ------------------------------------------------------------------------------
function testControlPanelValues (casper, test, values) {
  casper.then(function () {
    this.waitUntilVisible('div#controlpanel', function () {
      test.assertVisible('div#controlpanel', "The control panel is correctly open.");
      var rows = casper.evaluate(function () {
        return $(".standard-row").length;
      });
      test.assertEquals(rows, values, "The control panel opened with right amount of rows");
    });
  });
  casper.thenEvaluate(function () {
    $("#controlpanel").remove();
  });
  casper.then(function (){
    this.waitWhileVisible('div#controlpanel', function () {
      test.assertDoesntExist('div#controlpanel', "Control Panel went away");
    });
  })
}
// ------------------------------------------------------------------------------
module.exports = {
  testPlotButton: testPlotButton,
  testMeshVisibility: testMeshVisibility,
  loadModelUsingPython: loadModelUsingPython,
  canvasComponentsTests: canvasComponentsTests,
  testControlPanelValues: testControlPanelValues
}
