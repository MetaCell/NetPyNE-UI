function clickOnTree (casper, file) {
  casper.then(function (){
    this.wait(500)
  })
  casper.then(function (){ 
    let text = casper.evaluate(function (item) {
      let leaves = document.getElementById("TreeContainerCutting_component").getElementsByTagName("span");
      let out = {}
      for (var i = 0 ; i < leaves.length ; i++) {
        out[i] = leaves[i].textContent
      }
      return JSON.stringify(out)
    }, file)
    this.echo(text)
  })
  return casper.evaluate(function (item) {
    let leaves = document.getElementById("TreeContainerCutting_component").getElementsByTagName("span");
    for (var i = 0 ; i < leaves.length ; i++) {
      if (leaves[i].textContent == item) {
        leaves[i].scrollIntoView();
        leaves[i].click();
        return true
      }
    }
    return false
  }, file)
}

// ----------------------------------------------------------------------------------- //
function treeSelection (casper, sequence, test) {
  casper.eachThen(sequence, function (response){
    test.assert(clickOnTree(this, response.data), "click " + response.data + "folder")
  })
}

// ----------------------------------------------------------------------------------- //
function importCellTemplate (casper, test, toolbox) {
  casper.then(function () {
    toolbox.create2rules(this, test, "Populations", "newPopulationButton", "Population")
  })
  
  casper.then(function () {
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellType\']", "PYR")
    toolbox.setInputValue(this, test, "netParams.popParams[\'Population\'][\'cellModel\']", "HH")
  })

  casper.then(function () {
    populatePopDimension(this, test, toolbox)
  })
  
  casper.then(function () {
    toolbox.create2rules(this, test, "CellRules", "newCellRuleButton", "CellRule")
  })
  
  casper.then(function () {
    toolbox.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellType\']", "PYRMenuItem")
    toolbox.setSelectFieldValue(this, test, "netParams.cellParams[\'CellRule\'][\'conds\'][\'cellModel\']", "HHMenuItem")
  })
  
  casper.then(function () {
    this.wait(1000)
  })
  
  casper.then(function () {
    this.waitUntilVisible('button[id="appBar"]', function (){
      this.click('button[id="appBar"]')
    })
  })
  
  casper.then(function () {
    this.waitUntilVisible('span[id="appBarImportCellTemplate"]', function (){
      this.wait(3000, function (){
        this.click('span[id="appBarImportCellTemplate"]')
      })
    })
  })

  casper.then(function (){
    toolbox.setInputValue(this, test, "importCellTemplateName", "CellRule")
  })

  casper.then(function (){
    toolbox.setInputValue(this, test, "importCellTemplateCellName", "PTcell")
  })

  casper.then(function () {
    this.waitUntilVisible('button[id="importCellTemplateFile"]', function (){
      this.click('button[id="importCellTemplateFile"]')
    })
  })

  casper.then(function (){
    this.wait(500)
  })

  casper.thenClick('button[id="file-browser-level-up"]')
  
  casper.then(function (){
    this.wait(500)
  })

  casper.then(function (){
    treeSelection(this, ["tests", "cells", "PTcell_simple.hoc"], test)
  })

  casper.then(function (){
    this.wait(1000, function () {
      this.waitUntilVisible('button[id="browserAccept"]', function (){
        this.click('button[id="browserAccept"]')
      })
    })
  })

  casper.then(function (){
    this.wait(1000)
  })

  casper.then(function (){
    toolbox.clickCheckBox(this, test, "importCellTemplateCompileMods");
  })

  casper.then(function (){
    this.wait(500)
  })

  casper.then(function () {
    this.waitUntilVisible('button[id="importCellTemplateModFile"]', function (){
      this.click('button[id="importCellTemplateModFile"]')
    })
  })

  casper.then(function (){
    this.wait(500)
  })

  casper.thenClick('button[id="file-browser-level-up"]')

  casper.then(function (){
    this.wait(500)
  })

  casper.then(function (){
    treeSelection(this, ["tests", "mod"], test)
  })

  casper.then(function (){
    this.wait(1000, function () {
      this.waitUntilVisible('button[id="browserAccept"]', function (){
        this.click('button[id="browserAccept"]')
      })
    })
  })

  casper.then(function (){
    this.wait(1000)
  })

  casper.then(function (){
    this.click("button[id='appBarPerformActionButton']", function (){
      this.echo('Importing PTcell.hoc this will take some time....')
    })
  })
  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      test.assert(true, "Completed PTcell_simple.hoc import")
    }, null, 40000)
  })

  casper.then(function () {
    this.waitUntilVisible('button[id="simulateNetwork"]', function () {
      this.click('button[id="simulateNetwork"]')
    })
  })
  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      test.assert(this.evaluate(function () {
        return CanvasContainer.engine.getRealMeshesForInstancePath("network.Population[0]")[0].visible
      }), "Cell Imported correctly")
    }, null, 120000)
  })

  casper.then(function (){
    clearModel(this, test, toolbox)
  })
}

// ----------------------------------------------------------------------------------- //
function importHLS (casper, test, toolbox, tut3 = true) {
  casper.then(function () {
    this.waitUntilVisible('button[id="appBar"]', function (){
      this.click('button[id="appBar"]')
    })
  })
  casper.then(function () {
    this.waitUntilVisible('span[id="appBarImportHLS"]', function (){
      this.wait(3000, function (){
        this.click('span[id="appBarImportHLS"]')
      })
      
    })
  })
  casper.then(function () {
    this.waitUntilVisible('button[id="appBarImportFileName"]', function (){
      this.click('button[id="appBarImportFileName"]')
    })
  })

  casper.then(function () {
    this.wait(500)
  })

  casper.then(function () {
    if (tut3) {
      this.click('button[id="file-browser-level-up"]')
    }
  })

  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function () {
    test.assert(clickOnTree(this, (tut3 ? 'tests' : 'output.py')), "click " + (tut3 ? "tests" : "output.py") + " folder")
  })
  
  casper.then(function (){
    if (!tut3) {
      this.bypass(2)
    }
  })

  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function () {
    test.assert(clickOnTree(this, 'tut3.py'), "click tut3.py file")
  })

  casper.then(function (){
    this.wait(1000, function () {
      this.waitUntilVisible('button[id="browserAccept"]', function (){
        this.click('button[id="browserAccept"]')
      })
    })
  })

  casper.then(function (){
    this.waitWhileVisible("div[id='TreeContainerCutting_component']", function (){
      this.echo(tut3 ? 'tut3.py selection OK' : 'output.py selection OK')
    })
  })
  
  casper.then(function (){
    this.wait(1000, function () {
      this.waitUntilVisible('button[id="appBarPerformActionButton"]', function (){
        this.click('button[id="appBarPerformActionButton"]')
      })
    })
  })
  casper.then(function () {
    this.wait(1000)
  })
  casper.then(function (){
    test.assertExist('button[id="appBarImportFileName"]', "specify if mod files required before importing HLS OK")
  })

  casper.then(function () {
    toolbox.click(this, 'appBarImportRequiresMod')
  })

  casper.then(function (){
    toolbox.click(this, 'appBarImportRequiresModNo', 'span')
  })

  casper.then(function (){
    this.wait(1000, function () {
      this.waitUntilVisible('button[id="appBarPerformActionButton"]', function (){
        this.click('button[id="appBarPerformActionButton"]')
      })
    })
  })

  casper.then(function () {
    this.waitWhileVisible('button[id="appBarImportFileName"]')
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      test.assert(true, "Completed HLS import")
    }, 40000)
  })
}

// ----------------------------------------------------------------------------------- //

function instantiateNetwork (casper, test, toolbox) {
  casper.then(function () {
    this.waitUntilVisible('button[id="simulateNetwork"]', function () {
      this.click('button[id="simulateNetwork"]')
    })
  })
  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      test.assert(this.evaluate(function () {
        return CanvasContainer.engine.getRealMeshesForInstancePath("network.S[10]")[0].visible
      }), "Instance created with 40 cells")
    }, 40000)
  })
}

// ----------------------------------------------------------------------------------- //

function simulateNetwork (casper, test, toolbox) {
  casper.thenClick('#PlotButton');

  casper.then(function () {
    this.waitUntilVisible('span[id="rasterPlot"]');
  })
  casper.thenEvaluate(function () {
    document.getElementById('rasterPlot').click();
  });
  casper.then(function () {
    this.wait(2000, function (){
      test.assertDoesntExist('div[id="rasterPlot"]', "Network has not been simulated")
    })
  })

  casper.then(function () {
    var info = this.getElementInfo('button[id="launchSimulationButton"]');
    this.mouse.click(info.x - 4, info.y - 4); // move a bit away from corner
  })
  
  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function () {
    this.waitWhileVisible('div[role="menu"]', function () { // wait for menu to close
      test.assertDoesntExist('div[role="menu"]', "Plot Menu is gone");
    });
  })
  
  casper.then(function (){
    this.waitUntilVisible('button[id="launchSimulationButton"]', function (){
      this.click('button[id="launchSimulationButton"]')
    })
  })
  casper.then(function (){
    this.waitUntilVisible('button[id="okRunSimulation"]', function (){
      this.click('button[id="okRunSimulation"]')
    })
  })
  casper.then(function (){
    this.waitWhileVisible('div[id="loading-spinner"', function (){
      this.click('#PlotButton')
    })
  })

  casper.then(function () {
    this.waitUntilVisible('span[id="rasterPlot"]');
  })
  casper.thenEvaluate(function () {
    document.getElementById('rasterPlot').click();
  });
  
  casper.then(function () {
    this.waitUntilVisible('div[id="Popup1"]', function () {
      this.waitUntilVisible('g[id="figure_1"]')
      this.waitUntilVisible('g[id="axes_1"]')
    })
  })
  
  casper.then(function () {
    toolbox.click(this, "launchSimulationButton", "button"); // move a bit away from corner
  })
  
  
  casper.then(function () {
    this.waitWhileVisible('div[role="menu"]', function () { // wait for menu to close
      test.assertDoesntExist('div[role="menu"]', "Plot Menu is gone");
    });
  })
}

// ----------------------------------------------------------------------------------- //

function saveNetwork (casper, test, toolbox) {
  casper.then(function () {
    this.waitUntilVisible('button[id="appBar"]', function (){
      this.click('button[id="appBar"]')
    })
  })
  casper.then(function (){
    this.wait(2000)
  })
  casper.then(function () {
    this.waitUntilVisible('span[id="appBarSave"]', function (){
      this.click('span[id="appBarSave"]')
    })
  })
  casper.then(function (){
    this.waitUntilVisible('button[id="appBarPerformActionButton"]', function (){
      this.click('button[id="appBarPerformActionButton"]')
    })
  })
  casper.then(function () {
    this.waitWhileVisible('button[id="appBarPerformActionButton"]', function (){
      this.echo("Saved model in json format")
    })
  })
  casper.then(function (){
    this.wait(1500)
  })
}

// ----------------------------------------------------------------------------------- //

function openNetwork (casper, test, toolbox) {
  casper.then(function () {
    this.waitUntilVisible('button[id="appBar"]', function () {
      this.click('button[id="appBar"]')
    })
  })
  casper.then(function () {
    this.waitUntilVisible('span[id="appBarOpen"]', function () {
      this.click('span[id="appBarOpen"]')
    })
  })
  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function () {
    this.waitUntilVisible('button[id="loadJsonFile"]', function () {
      this.click('button[id="loadJsonFile"]')
    })
  })
  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function () {
    test.assert(clickOnTree(this, 'output.json'), "click output.json file")
  })

  casper.then(function (){
    this.wait(1000, function () {
      this.click('button[id="browserAccept"]')
    })
  })
  
  casper.then(function (){
    this.wait(1000, function () {
      this.click('button[id="appBarPerformActionButton"]')
    })
  })
  casper.then(function () {
    this.waitWhileVisible('button[id="loadJsonFile"]', function () {
      test.assert(false, 'Trying to loaded a model without specifying if mod files are required')
    }, function (){
      this.echo("Check if mod files are required OK")
    }, 1000)
  })

  casper.then(function () {
    toolbox.click(this, 'appBarLoadRequiresMod')
  })
  casper.then(function (){
    toolbox.click(this, 'appBarLoadRequiresModNo', 'span')
  })

  casper.then(function (){
    this.waitUntilVisible('button[id="appBarPerformActionButton"]', function (){
      this.evaluate(function () {
        document.getElementById("appBarPerformActionButton").click()
      })
    })
  })

  casper.then(function (){
    this.waitWhileVisible('button[id="appBarPerformActionButton"]')
  })
  
  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]', function () {
      test.assert(true, "Completed Model load")
    }, 40000)
  })
}

// ----------------------------------------------------------------------------------- //

function exploreOpenedModel (casper, test, toolbox) {
  casper.then(function () {
    this.waitWhileVisible('div[id="loading-spinner"]')
  })
  casper.then( function (){
    test.assert(this.evaluate(function () {
      return document.getElementById("launchSimulationButton").textContent == "You have already simulated your network"
    }) , "Launch simulation button is lock ")
  })
  casper.then(function (){
    test.assert(this.evaluate(function () {
      return document.getElementById("refreshInstanciatedNetworkButton").textContent == "Your network is in sync"
    }) , "Sync instance button is lock ")
  })

  casper.thenClick('#PlotButton')
  casper.then(function () {
    toolbox.testPlotButton(casper, test, "rasterPlot")
  })
  
  casper.then(function () {
    toolbox.testPlotButton(casper, test, "connectionPlot")
  })

  casper.then(function () {
    toolbox.click(this, "launchSimulationButton", "button"); // move a bit away from corner
  })

  casper.then(function (){
    this.wait(2000)
  })
}

// ----------------------------------------------------------------------------------- //

function exportHLS (casper, test, toolbox) {
  casper.then(function () {
    this.waitUntilVisible('button[id="appBar"]', function (){
      this.click('button[id="appBar"]')
    })
  })
  casper.then(function () {
    this.waitUntilVisible('span[id="appBarExportHLS"]', function (){
      this.click('span[id="appBarExportHLS"]')
    })
  })
  casper.then(function (){
    this.waitUntilVisible('button[id="appBarPerformActionButton"]', function (){
      this.click('button[id="appBarPerformActionButton"]')
    })
  })
  casper.then(function (){
    this.waitWhileVisible('button[id="appBarPerformActionButton"]')
  })
  casper.then(function (){
    this.waitWhileVisible('div[id="loading-spinner', function (){
      this.echo("HLS were saved")
    })
  })
}

// ----------------------------------------------------------------------------------- //

function clearModel (casper, test, toolbox) {
  casper.then(function () {
    this.waitUntilVisible('button[id="appBar"]', function (){
      this.click('button[id="appBar"]')
    })
  })
  casper.then(function () {
    this.waitUntilVisible('span[id="appBarNew"]', function (){
      this.click('span[id="appBarNew"]')
    })
  })
  casper.then(function (){
    this.waitUntilVisible('button[id="appBarPerformActionButton"]', function (){
      this.evaluate(function () {
        document.getElementById("appBarPerformActionButton").click()
      })
    })
  })

  casper.then(function (){
    this.waitWhileVisible('button[id="appBarPerformActionButton"]')
  })

  casper.then(function (){
    this.wait(1500)
  })

  casper.then(function () {
    this.waitUntilVisible('div[id="Populations"]', function (){
      this.click('div[id="Populations"]')
    })
  })
  casper.then(function (){
    this.wait(1000)
  })
  casper.then(function (){
    test.assertDoesntExist('input[id="populationName"]', "Model deleted")
  })
}

// ---------------------------------------------------------------------- //

function populatePopDimension (casper, test, toolbox) {
  casper.then(function () {
    toolbox.click(this, "popParamsDimensionsSelect", "div");
  })
  casper.then(function () { // check all menuItems exist
    toolbox.assertExist(this, test, "popParamSnumCells", "span");
  });

  casper.thenClick("#popParamSnumCells", function () {
    toolbox.setInputValue(this, test, "popParamsDimensions", "1")
  })
  casper.then(function () {
    this.wait(1000)
  })
}

// ---------------------------------------------------------------------- //

module.exports = {  
  importHLS,
  exportHLS,
  clearModel,
  openNetwork,
  saveNetwork,
  simulateNetwork,
  importCellTemplate,
  instantiateNetwork,
  exploreOpenedModel
}