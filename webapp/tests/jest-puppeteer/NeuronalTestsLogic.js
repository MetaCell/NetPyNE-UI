import { click, wait4selector } from "./utils";
import { Projects } from "./projects";
import * as ST from "./selectors";
import {
  assertExists,
  defaultColor,
  removeAllPlots,
  testCameraControls, testCameraControlsWithCanvasWidget, resetCameraTest,
  testInitialControlPanelValues,
  testMeshVisibility, test3DMeshColor, test3DMeshColorNotEquals, test3DMeshOpacity,
  testPlotWidgets,
  testVisibility,
  testSpotlight, closeSpotlight,
  testingConnectionLines,
  testVisualGroup, getMeshColor, isVisible

} from "./functions";
import { getUrlFromProjectId } from "./cmdline";
import { launchTest } from "./functions";

export function testSingleComponentHHProject () {

  beforeAll(async () => {
    await page.goto(getUrlFromProjectId(Projects.HH_CELL));
  });

  describe('Landing page', () => {
    it("Spinner goes away", async () => {
      await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true })
    });

    it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
      await wait4selector(page, selector, { visible: true, timeout: 10000 })
    })
  });


  describe('Widgets', () => {
    it('Right amount of graph elements for Plot1', async () => {
      await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true, timeout: 30000 });
      // watch out here (the labels in the plot appear a little after the plot)
      await page.waitFor(1500);
      await testPlotWidgets(page, "Plot1", 1);
    });

    it('Right amount of graph elements for Plot2', async () => {
      await testPlotWidgets(page, "Plot2", 3);
    });

    it('Initial amount of experiments for hhcell checked.', async () => {
      expect(
        await page.evaluate(async () => window.Project.getExperiments().length)
      ).toBe(1)
    });

    it('Top level instance present.', async () => {
      expect(
        await page.evaluate(async () => eval('hhcell') != null)
      ).toBeTruthy()
    });

    it('2 top Variables as expected for hhcell', async () => {
      expect(
        await page.evaluate(async () => window.Model.getVariables().map(v => v.getId()))
      ).toEqual(expect.arrayContaining(['hhcell', 'time']))
    });

    it('2 Libraries as expected for hhcell', async () => {
      expect(
        await page.evaluate(async () => window.Model.getLibraries() !== undefined && window.Model.getLibraries().length === 2)
      ).toBeTruthy()
    });

    it('1 top level instance as expected for hhcell', async () => {
      expect(
        await page.evaluate(async () => window.Instances !== undefined && window.Instances.length === 2 && window.Instances[0].getId() === 'hhcell')
      ).toBeTruthy()
    });

    it('Checking that time series length is 6001 in variable for hhcell project', async () => {
      expect(
        await page.evaluate(async () => eval('hhcell').hhpop[0].bioPhys1.membraneProperties.naChans.na.h.q.getTimeSeries().length === 6001)
      ).toBeTruthy()
    });

    it('REPEATED!! Right amount of graph elements for Plot1', async () => {
      await page.evaluate(async () => Plot1.plotData(eval('hhcell').hhpop[0].v));
      await testPlotWidgets(page, "Plot1", 1)
    });

    it('Remove data', async () => {
      await removeAllPlots(page,);
    });

    it('Camera controls', async () => {
      await testCameraControls(page, [0, 0, 30.90193733102435]);
    })

  });

  describe('Control Panel', () => {
    it('The control panel opened with right amount of rows.', async () => {
      await click(page, ST.CONTROL_PANEL_BUTTON);
      await testInitialControlPanelValues(page, 3);
    })
  });

  describe('Mesh', () => {
    it('Initial visibility correct', async () => {
      await testMeshVisibility(page, true, ST.HHCELL_SELECTOR);
    });

    it('Hide correct', async () => {
      await click(page, ST.HHCELL_CONTROL_PANEL_BUTTON_SELECTOR);
      await testMeshVisibility(page, false, ST.HHCELL_SELECTOR);
    });

    it('Visible again correct', async () => {
      await click(page, ST.HHCELL_CONTROL_PANEL_BUTTON_SELECTOR);
      await testMeshVisibility(page, true, ST.HHCELL_SELECTOR);
    })
  });

  describe('Plot from control panel', () => {
    it('Plot V', async () => {
      await click(page, ST.STATE_VARIABLE_FILTER_BUTTON_SELECTOR);
      await click(page, ST.HHCELL_V_CONTROL_PANEL_BUTTON_SELECTOR);
      await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true })
    });

    it('Remove all plots.', async () => {
      await click(page, ST.PROJECT_FILTER_BUTTON_SELECTOR);
      await removeAllPlots(page,);
    });

    it('Correct amount of rows for Global filter.', async () => {
      expect(
        await page.evaluate(async () => $(".standard-row").length)
      ).toBe(10);

      await page.evaluate(async selector => {
        $(selector).hide()
      }, ST.CONTROL_PANEL_CONTAINER_SELECTOR)
    })
  });


  describe('Spotlight', () => {
    it('Opens and shows correct butttons.', async () => {
      await click(page, ST.SPOT_LIGHT_BUTTON_SELECTOR);
      await wait4selector(page, ST.SPOT_LIGHT_SELECTOR, { visible: true });
    });

    it('Spotlight button exists', async () => {
      await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
      await page.keyboard.type(ST.HHCELL_V_SELECTOR);
      await page.keyboard.press(String.fromCharCode(13))
    });

    it('Spotlight button exists4', async () => {
      await page.waitForSelector(ST.SPOT_LIGHT_SELECTOR, { visible: true });
    });

    it('Plot visible', async () => {
      await click(page, ST.PLOT_BUTTON_SELECTOR);
      await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true });
    });

    it('Close', async () => {
      await page.evaluate(async selector => $(selector).hide(), ST.SPOT_LIGHT_SELECTOR);
      await page.evaluate(async () => {
        const instance = eval('hhcell');
        GEPPETTO.ComponentFactory.addWidget('CANVAS', { name: '3D Canvas', id: "Canvas2" }, function () {
          this.setName('Widget Canvas');
          this.setPosition();
          this.display([instance])
        });
        Plot1.setPosition(0, 300);
        G.addWidget(1).then(w => {
          w.setMessage("Hhcell popup");
        });
        G.addWidget(1).then(w => {
          w.setMessage("Hhcell popup 2").addCustomNodeHandler(function () {
          }, 'click');
        });
      })
    })

  });

  describe('Tutorials', () => {
    it('Click tut button', async () => {
      if (await page.$(ST.TUTORIAL_BUTTON_SELECTOR) !== null) {
        await click(page, ST.TUTORIAL_BUTTON_SELECTOR);
        await page.evaluate(async () => {
          const nextBtnSelector = $(".nextBtn");
          nextBtnSelector.click();
          nextBtnSelector.click();
        })
      }
    })
  });


  describe('Widget canvas mesh', () => {
    it('Canvas widget has hhcell', async () => {
      expect(
        await page.evaluate(async selector => window.Canvas2.engine.getRealMeshesForInstancePath(selector).length, ST.HHCELL_SELECTOR)
      ).toBe(1)
    })
  });

  describe('Camera Controls on main Canvas and Canvas widget', () => {
    it('Canvas widget has hhcell', async () => {
      await testCameraControlsWithCanvasWidget(page, [0, 0, 30.90193733102435])
    })
  });

  describe('Color Function', () => {
    it('More than one color function instance found.', async () => {
      const initialColorFunctions = await page.evaluate(async () => GEPPETTO.SceneController.getColorFunctionInstances().length);
      await page.evaluate(async () => {
        GEPPETTO.SceneController.addColorFunction(GEPPETTO.ModelFactory.instances.getInstance(GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v'), false), window.voltage_color);
        Project.getActiveExperiment().play({ step: 10 });
      });
      expect(
        await page.evaluate(async () => GEPPETTO.SceneController.getColorFunctionInstances().length)
      ).not.toBe(initialColorFunctions)
    })
  });

  describe('Widgets stored in View', () => {
    it('Reload page', async () => {
      /*
       * TODO? / FIXME? / OK?: I thought casper test was reloading the page at this point, but it is not.
       * await page.reload();
       */
      await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true })
    });

    it('Widgets stored in View state come up', async () => {
      await wait4selector(page, ST.CANVAS_2_DIV_SELECTOR, { visible: true });
      await wait4selector(page, ST.PLOT_1_DIV_SELECTOR, { visible: true });
      await wait4selector(page, ST.POPUP_1_DIV_SELECTOR, { visible: true });
      await wait4selector(page, ST.POPUP_2_DIV_SELECTOR, { visible: true })
    });

    describe('Tutorials', () => {
      it('Tutorial1 step restored correctly', async () => {
        if (await page.$(ST.TUTORIAL_BUTTON_SELECTOR) !== null) {
          await page.wait4selector(page, ST.TUTORIAL_1_DIV_SELECTOR, { visible: true });
          expect(
            await page.evaluate(async () => window.Tutorial1.state.currentStep)
          ).toBe(2)
        }
      })
    });

    it('Popup1 message restored correctly.', async () => {
      expect(
        await page.evaluate(async selector => $(selector).html(), ST.POPUP_1_SELECTOR)
      ).toBe("Hhcell popup")
    });

    it('Popup2 custom handlers event restored correctly.', async () => {
      const popUpCustomHandler = await page.evaluate(async () => window.Popup2.customHandlers);
      expect(popUpCustomHandler.length).toBe(1);
      expect(popUpCustomHandler[0].event).toBe("click")
    });

    it('Canvas2 hhcell set correctly', async () => {
      expect(
        await page.evaluate(async selector => !!Canvas1.engine.meshes["hhcell.hhpop[0]"], ST.HHCELL_SELECTOR)
      ).toBeTruthy()
    })
  })
}

export function testACNET2Project () {

  beforeAll(async () => {
    await launchTest(Projects.ACNET);
  });

  describe('Primary Auditory Cortary', () => {

    it("Load Project Spinner", async () => {
      await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true });
    });

    it("Initial amount of experiments for ACNE2", async () => {
      expect(
        await page.evaluate(async () => window.Project.getExperiments().length)
      ).toBe(2)
    });

    it('Top level instance', async () => {
      expect(
        await page.evaluate(async () => eval('acnet2') != null)
      ).toBeTruthy()
    });

    it("Instances exploded", async () => {
      expect(
        await page.evaluate(async () => acnet2.baskets_12[3] !== undefined
                    && acnet2.pyramidals_48[12] !== undefined)
      ).toBeTruthy();
    });

    it("Bask and pyramidal connections after resolveAllImportTypes() call", async () => {
      await page.evaluate(async () => Model.neuroml.resolveAllImportTypes(window.callPhantom));
      expect(
        await page.evaluate(async () => acnet2.baskets_12[9].getConnections().length === 60
                    && acnet2.pyramidals_48[23].getConnections().length === 22)
      ).toBeTruthy();
    });

    it("5 Visual Groups on pyramidals", async () => {
      expect(
        await page.evaluate(async () => acnet2.pyramidals_48[23].getVisualGroups().length)
      ).toBe(5);
    });

    it("2 top Variables for ACNET2", async () => {
      expect(
        await page.evaluate(async () => window.Model.getVariables() !== undefined
                    && window.Model.getVariables().length === 2
                    && window.Model.getVariables()[0].getId() === 'acnet2'
                    && window.Model.getVariables()[1].getId() === 'time')
      ).toBeTruthy();
    });

    it("2 Libraries for ACNET2", async () => {
      expect(
        await page.evaluate(async () => window.Model.getLibraries() !== undefined
                    && window.Model.getLibraries().length === 2)
      ).toBeTruthy();
    });

    it("1 top level instance for ACNET2", async () => {
      expect(
        await page.evaluate(async () => window.Instances !== undefined
                    && window.Instances.length === 2
                    && window.Instances[0].getId() === 'acnet2')
      ).toBeTruthy();
    });

    it("Remove Plots", async () => {
      await removeAllPlots(page);
    });


  });

  describe('Camera Controls', () => {
    it('Camera controls', async () => {
      await testCameraControls(page, [231.95608349343888, 508.36555704435455, 1849.839]);
    })
  });

  describe('Original Colors', () => {
    it('Original Colors', async () => {
      await test3DMeshColor(page, [0.796078431372549, 0, 0], "acnet2.pyramidals_48[0]", 0);
      await test3DMeshColor(page, [0.796078431372549, 0, 0], "acnet2.pyramidals_48[47]", 0);
      await test3DMeshColor(page, [0, 0.2, 0.596078431372549], "acnet2.baskets_12[0]", 0);
      await test3DMeshColor(page, [0, 0.2, 0.596078431372549], "acnet2.baskets_12[11]", 0);
    })
  });

  describe('Control Panel ACNET2', () => {
    it('The control panel opened with right amount of rows', async () => {
      await click(page, ST.CONTROL_PANEL_BUTTON);
      await testInitialControlPanelValues(page, 10);
    })
  });

  describe('Mesh ACNET2', () => {
    it('Mesh Visibility', async () => {
      await testVisibility(page, ST.ACNET2_SELECTOR, '#' + ST.ACNET2_CONTROL_PANEL_BUTTON_SELECTOR);
    });
  });

  describe('Plot from Control Panel', () => {
    it('Plot V', async () => {
      await click(page, ST.STATE_VARIABLE_FILTER_BUTTON_SELECTOR);
      await wait4selector(page, ST.ACNET2_V_CONTROL_PANEL_BUTTON, { visible: true });
      await click(page, '#' + ST.ACNET2_V_CONTROL_PANEL_BUTTON_SELECTOR)
    });

    it('Hide Plot 1', async () => {
      await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true });
      await assertExists(page, ST.PLOT1_SELECTOR);
      await page.evaluate(async selector => {
        $(selector).hide()
      }, ST.CONTROL_PANEL_CONTAINER_SELECTOR)
    });

    it('Remove all plots.', async () => {
      await removeAllPlots(page);
    });

  });

  describe('Spotlight Soma V', () => {
    it('Spotlight', async () => {
      await testSpotlight(page, ST.ACNET2_V1_SELECTOR, ST.PLOT1_SELECTOR, true, true, ST.ACNET2_SELECTOR, ST.ACNET2_SELECTOR);
    });

    it('Close', async () => {
      await closeSpotlight(page)
    })
  });

  describe('Connected cells to Instance', () => {

    it('Connection Lines.', async () => {
      await testingConnectionLines(page, 23);
    });

    it('3D Mesh Colors Not Default', async () => {
      await test3DMeshColorNotEquals(page, defaultColor, ST.ACNET2_BASKET_SELECTOR4);
    });

    it('3D Mesh Colors Baskets 4', async () => {
      await test3DMeshColor(page, [0.39215686274509803, 0.5882352941176471, 0.08235294117647059], ST.ACNET2_BASKET_SELECTOR4);
    });

    it('3D Mesh Colors Not Default Baskets 1', async () => {
      await test3DMeshColorNotEquals(page, defaultColor, ST.ACNET2_BASKET_SELECTOR1);
    });

    it('3D Mesh Colors Baskets 4 ACNET2', async () => {
      await test3DMeshColor(page, [1, 0.35294117647058826, 0.00784313725490196], ST.ACNET2_BASKET_SELECTOR1);
    });

    it('3D Mesh Opacity Baskets 4', async () => {
      await test3DMeshOpacity(page, 0.3, ST.ACNET2_BASKET_SELECTOR1);
    });

    it('3D Mesh Opacity Baskets 1', async () => {
      await test3DMeshOpacity(page, 0.3, ST.ACNET2_BASKET_SELECTOR1);
    });
  });

  describe('Spotlight Biophys', () => {
    it('Spotlight', async () => {
      await testSpotlight(page, ST.ACNET2_gDensity_SELECTOR, ST.PLOT1_SELECTOR, false, false, ST.ACNET2_SELECTOR);
    });

  });

  describe('Opacity', () => {

    it('Deselect', async () => {
      await page.evaluate(() => acnet2.pyramidals_48[0].deselect());
    });

    it('3D Mesh Opacity 1', async () => {
      await test3DMeshOpacity(page, 1, ST.ACNET2_BASKET_SELECTOR1);
    });

    it('3D Mesh Opacity 4', async () => {
      await test3DMeshOpacity(page, 1, ST.ACNET2_BASKET_SELECTOR4);
    });

    it('Close Spotlight', async () => {
      await closeSpotlight(page)
    })

  });

  describe('Widgets and Camera', () => {

    it('Add Widget', async () => {
      await page.evaluate(() => {
        GEPPETTO.ComponentFactory.addWidget('CANVAS', { name: '3D Canvas', }, function () {
          this.setName('Widget Canvas');
          this.setPosition();
          this.display([acnet2])
        });
        Plot1.setPosition(0, 300); // get out of the way
        acnet2.baskets_12[4].getVisualGroups()[0].show(true);
      });
    });

    // it('Camera', async () => {
    //   await testCameraControlsWithCanvasWidget(page, [231.95608349343888, 508.36555704435455, 1849.839]);
    // });
  });

  describe('Visual Group', () => {

    it('Visual Group Baskets 0', async () => {
      await testVisualGroup(page, ST.ACNET2_BASKET_SELECTOR0, 2, [[], [0, 0.4, 1], [0.6, 0.8, 0]]);
    });

    it('Visual Group Baskets 5', async () => {
      await testVisualGroup(page, ST.ACNET2_BASKET_SELECTOR5, 2, [[], [0, 0.4, 1], [0.6, 0.8, 0]]);

    });
  });

  describe('Geometry', () => {

    it('Set Geometry Cylinders ACNET2', async () => {
      await page.evaluate(() => acnet2.pyramidals_48[0].setGeometryType("cylinders"));
    });

    it('Mesh Geometry', async () => {
      const meshType = await page.evaluate(variableName => Canvas1.engine.getRealMeshesForInstancePath(variableName)[0].type, ST.ACNET2_SELECTOR);
      expect(meshType).toEqual("Mesh");
    });

    it('Mesh Total', async () => {
      const meshTotal = await page.evaluate(() => Object.keys(Canvas1.engine.meshes).length);
      expect(meshTotal).toEqual(60);

    });

    it('Set Geometry Lines / 3D Mesh Color', async () => {
      const color = await getMeshColor(page, ST.ACNET2_SELECTOR);
      await page.evaluate(() => acnet2.pyramidals_48[0].setGeometryType("lines"));
      await test3DMeshColor(page, color, ST.ACNET2_SELECTOR);

    });

    it('LineSegments Geometry', async () => {
      const meshType = await page.evaluate(variableName => Canvas1.engine.getRealMeshesForInstancePath(variableName)[0].type, ST.ACNET2_SELECTOR);
      expect(meshType).toEqual("LineSegments");

    });

    it('Mesh Total ACNET2', async () => {
      const meshTotal = await page.evaluate(() => Object.keys(Canvas1.engine.meshes).length);
      expect(meshTotal).toEqual(60);

    });

    it('Set Geometry Cylinders ACNET2', async () => {
      await page.evaluate(() => acnet2.pyramidals_48[0].setGeometryType("cylinders"));
    });

    it('Mesh Geometry ACNET2', async () => {
      const meshType = await page.evaluate(variableName => Canvas1.engine.getRealMeshesForInstancePath(variableName)[0].type, ST.ACNET2_SELECTOR);
      expect(meshType).toEqual("Mesh");
    });

    it('3D Mesh Color', async () => {
      const color = await getMeshColor(page, ST.ACNET2_SELECTOR);
      await test3DMeshColor(page, color, ST.ACNET2_SELECTOR);
    });

    it('Mesh Total ACNET2 pos', async () => {
      const meshTotal = await page.evaluate(() => Object.keys(Canvas1.engine.meshes).length);
      expect(meshTotal).toEqual(60);
    });

  });

  describe('Colors', () => {

    it('Add Color Function', async () => {
      const initialColorFunctions = await page.evaluate(() => GEPPETTO.SceneController.getColorFunctionInstances().length);
      await page.evaluate(() => {
        GEPPETTO.SceneController.addColorFunction(GEPPETTO.ModelFactory.instances.getInstance(GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v'), false), window.voltage_color);
        Project.getActiveExperiment().play({ step: 10 });
      });
      const colorFunctionInstances = await page.evaluate(() => GEPPETTO.SceneController.getColorFunctionInstances().length);
      expect(initialColorFunctions).not.toEqual(colorFunctionInstances);

    });
  });

}

export function testC302NetworkProject () {

  beforeAll(async () => {
    await launchTest(Projects.C302);
  });


  describe('Initial Values', () => {

    it('Loading Spinner', async () => {
      await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true});
      await page.waitFor(30000);
      if (await isVisible(page, ST.LOADING_SPINNER)){
        await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true });
      }
    });

    it('Plot 1', async () => {
      await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true });
      await assertExists(page, ST.PLOT1_SELECTOR)
    });

    it('Amount of Experiments', async () => {
      const experiments = await page.evaluate(() => window.Project.getExperiments().length);
      expect(experiments).toEqual(2);
    });

    it('Amount of Children', async () => {
      const experiments = await page.evaluate(() => c302.getChildren().length);
      expect(experiments).toEqual(299);
    });

    it('Top Level Instance', async () => {
      const experiments = await page.evaluate(() => c302 != null);
      expect(experiments).toEqual(true);
    });

  });

  describe('Resolved Connections', () => {
    it('ADAL Connections', async () => {
      const connections = await page.evaluate(() => c302.ADAL[0].getConnections().length);
      expect(connections).toEqual(31);
    });

    it('AVAL Connections', async () => {
      const connections = await page.evaluate(() => c302.AVAL[0].getConnections().length);
      expect(connections).toEqual(170);
    });

    it('PVDRD Connections', async () => {
      const connections = await page.evaluate(() => c302.PVDR[0].getConnections().length);
      expect(connections).toEqual(7);
    });
  });

  describe('Resolve All Imports', () => {
    it('Resolve All Imports', async () => {
      await page.evaluate(() => Model.neuroml.resolveAllImportTypes(window.callPhantom));
      await page.waitForSelector(ST.LOADING_SPINNER, { visible: true });
      await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true });
    });

    it('Top Variables', async () => {
      const op = await page.evaluate(() => window.Model.getVariables() !== undefined && window.Model.getVariables().length === 2
                      && window.Model.getVariables()[0].getId() === 'c302' && window.Model.getVariables()[1].getId() === 'time');
      expect(op).toBeTruthy();
    });

    it('Libraries', async () => {
      const op = await page.evaluate(() => window.Model.getLibraries() !== undefined && window.Model.getLibraries().length === 2);
      expect(op).toBeTruthy();
    });

    it('Top Level Instances', async () => {
      const op = await page.evaluate(() => window.Instances !== undefined && window.Instances.length === 2 && window.Instances[0].getId() === 'c302');
      expect(op).toBeTruthy();
    });

  });

  describe('Camera Controls c302', () => {
    it('Reset Camera', async () => {
      await resetCameraTest(page, [49.25, -0.8000001907348633, 733.3303486467378]);
    });

    it("Remove Plots", async () => {
      await removeAllPlots(page);
    });

    it('Camera Controls', async () => {
      await testCameraControls(page, [49.25, -0.8000001907348633, 733.3303486467378]);
    })
  });

  describe('Mesh c302', () => {
    it('3D Mesh Colors', async () => {
      await test3DMeshColor(page, defaultColor, ST.C302_SELECTOR);
    });
  });

  describe('Control Panel c302', () => {
    it('Initial Amount of Rows', async () => {
      await click(page, ST.CONTROL_PANEL_BUTTON);
      await testInitialControlPanelValues(page, 10);
    });

    it('Plot V', async () => {
      await click(page, ST.STATE_VARIABLE_FILTER_BUTTON_SELECTOR);
      await page.waitForSelector(ST.C302_V_CONTROL_PANEL_BUTTON_SELECTOR, { visible: true });
      await click(page, ST.C302_V_CONTROL_PANEL_BUTTON_SELECTOR);
    });

    it('Standard Rows', async () => {
      await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true });
      await click(page, ST.PROJECT_FILTER_BUTTON_SELECTOR);
      await page.waitFor(1000);
      const rows = await page.evaluate(() => $(".standard-row").length);
      expect(rows).toEqual(10);
      await page.evaluate(async selector => {
        $(selector).hide()
      }, ST.CONTROL_PANEL_CONTAINER_SELECTOR)
    });

    it('Spotlight', async () => {
      await testSpotlight(page, ST.C302_V_SELECTOR, ST.PLOT2_SELECTOR, true, false);
    });
  });

  describe('Spotlight c302', () => {
    it('Spotlight', async () => {
      await testSpotlight(page, ST.C302_V_SELECTOR, ST.PLOT2_SELECTOR, true, false);
    });

    it('Close', async () => {
      await closeSpotlight(page)
    })
  });

  describe('Widgets and Camera c302', () => {

    it('Add Widget', async () => {
      await page.evaluate(() => {
        GEPPETTO.ComponentFactory.addWidget('CANVAS', { name: '3D Canvas', }, function () {
          this.setName('Widget Canvas');
          this.setPosition();
          this.display([c302])
        });
        Plot1.setPosition(0, 300);
      });
    });

    it('Camera', async () => {
      await testCameraControlsWithCanvasWidget(page, [49.25, -0.8000001907348633, 733.3303486467378]);
    });
  });

  describe('Colors c302', () => {

    it('Add Color Function', async () => {
      const initialColorFunctions = await page.evaluate(() => GEPPETTO.SceneController.getColorFunctionInstances().length);
      await page.evaluate(() => {
        GEPPETTO.SceneController.addColorFunction(GEPPETTO.ModelFactory.instances.getInstance(GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v'), false), window.voltage_color);
        Project.getActiveExperiment().play({ step: 10 });
      });
      const colorFunctionInstances = await page.evaluate(() => GEPPETTO.SceneController.getColorFunctionInstances().length);
      expect(initialColorFunctions).not.toEqual(colorFunctionInstances);
    });
  });
}

export function testCa1Project () {

  beforeAll(async () => {
    await launchTest(Projects.CA1);
  });


  describe('Control Panel CA1', () => {
    it('Initial Amount of Rows', async () => {
      await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true, timeout: 45000});
      await page.waitFor(30000);
      if (await isVisible(page, ST.LOADING_SPINNER)){
        await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true, timeout: 45000 });
      }
      await click(page, ST.CONTROL_PANEL_BUTTON);
      await testInitialControlPanelValues(page, 3);
    });

    it('Hide Control Panel', async () => {
      await click(page, ST.STATE_VARIABLE_FILTER_BUTTON_SELECTOR);
      await click(page, ST.PROJECT_FILTER_BUTTON_SELECTOR);
      await page.evaluate(async selector => {
        $(selector).hide()
      }, ST.CONTROL_PANEL_CONTAINER_SELECTOR)
    });

    it('Spotlight', async () => {
      await testSpotlight(page, ST.CA1_V_SELECTOR, '', false, false);
    });

    it('Close', async () => {
      await closeSpotlight(page)
    })
  });

}

export function testPVDRNeuronProject () {

  beforeAll(async () => {
    await launchTest(Projects.PVDR);
  });


  describe('Initial Values PVDR', () => {

    it('Amount of Experiments', async () => {
      await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true });
      const experiments = await page.evaluate(() => window.Project.getExperiments().length);
      expect(experiments).toEqual(1);
    });

    it('Active Experiment', async () => {
      const experiment = await page.evaluate(() => window.Project.getActiveExperiment().getId());
      expect(experiment).toEqual(1);
    });

    it('Top Level Instance', async () => {
      const variable = await page.evaluate(() => pvdr != null);
      expect(variable).toBeTruthy();
    });

    it('Connections', async () => {
      const connections = await page.evaluate(() => pvdr.getConnections().length);
      expect(connections).toEqual(0);
    });

    it('Visual Groups', async () => {
      const visualGroups = await page.evaluate(() => pvdr.getVisualGroups().length);
      expect(visualGroups).toEqual(1);
    });

    it('Top Level Variables', async () => {
      const variables = await page.evaluate(() => window.Model.getVariables() !== undefined && window.Model.getVariables().length === 2
                && window.Model.getVariables()[0].getId() === 'pvdr' && window.Model.getVariables()[1].getId() === 'time');
      expect(variables).toBeTruthy()
    });

    it('Libraries', async () => {
      const libraries = await page.evaluate(() => window.Model.getLibraries() !== undefined && window.Model.getLibraries().length === 2);
      expect(libraries).toBeTruthy()
    });

    it('Top Level Instances', async () => {
      const instances = await page.evaluate(() => window.Instances !== undefined && window.Instances.length === 2 && window.Instances[0].getId() === 'pvdr');
      expect(instances).toBeTruthy()
    });

  });
}

export function testC302Connectome () {
  beforeAll(async () => {
    await launchTest(Projects.CONNECTOME);
  });

  describe('C302 Connectome', () => {
    it('POPUP 1', async () => {
      await wait4selector(page, ST.POPUP_1_DIV_SELECTOR, { visible: true, timeout: 200000 });
    });
  });
}

export function testPMuscleCellProject () {
  beforeAll(async () => {
    await launchTest(Projects.PMUSCLE);
  });

  describe('Initial Values PMUSCLE', () => {
    it('POPUP 1', async () => {
      await wait4selector(page, ST.POPUP_1_DIV_SELECTOR, { visible: true, timeout: 200000 });
    });

    it('Amount of Experiments', async () => {
      const experiments = await page.evaluate(() => window.Project.getExperiments().length);
      expect(experiments).toEqual(1);
    });

    it('Active Experiment', async () => {
      const experiment = await page.evaluate(() => window.Project.getActiveExperiment().getId());
      expect(experiment).toEqual(1);
    });

    it('Top Level Instance', async () => {
      const variable = await page.evaluate(() => net1 != null);
      expect(variable).toBeTruthy();
    });

    it('Children', async () => {
      const children = await page.evaluate(() => net1.getChildren().length);
      expect(children).toEqual(2);
    });

    it('Connections', async () => {
      const connections = await page.evaluate(() => net1.getConnections().length);
      expect(connections).toEqual(0);
    });

    it('Visual Group Capability ', async () => {
      const visualGroups = await page.evaluate(() => !net1.neuron[0].getVisualType().hasCapability('VisualGroupCapability'));
      expect(visualGroups).toBeTruthy()
    });

    it('Visual Capability Neuron ', async () => {
      const visualGroups = await page.evaluate(() => net1.neuron[0].getVisualType().hasCapability('VisualCapability'));
      expect(visualGroups).toBeTruthy()
    });

    it('Visual Capability Muscle ', async () => {
      const visualGroups = await page.evaluate(() => net1.muscle[0].getVisualType().hasCapability('VisualCapability'));
      expect(visualGroups).toBeTruthy()
    });

    it('Top Level Variables', async () => {
      const variables = await page.evaluate(() => window.Model.getVariables() !== undefined && window.Model.getVariables().length === 2
                && window.Model.getVariables()[0].getId() === 'net1' && window.Model.getVariables()[1].getId() === 'time');
      expect(variables).toBeTruthy()
    });

    it('Libraries', async () => {
      const libraries = await page.evaluate(() => window.Model.getLibraries() !== undefined && window.Model.getLibraries().length === 2);
      expect(libraries).toBeTruthy()
    });

    it('Top Level Instances', async () => {
      const instances = await page.evaluate(() => window.Instances !== undefined && window.Instances.length === 2 && window.Instances[0].getId() === 'net1');
      expect(instances).toBeTruthy()
    });
  });
}


export function testCylindersProject () {
  beforeAll(async () => {
    await launchTest(null, Projects.CYLINDER);
  });

  describe('Cylinder', () => {
    it('Rotations', async () => {
      await wait4selector(page, ST.LOADING_SPINNER, {hidden: true, timeout: 200000});

      const evaluation = await page.evaluate(() =>
      {
        const reference =
            {"Example2.Pop_OneSeg[0]":[0, Math.PI/2, 0, "XYZ"],
              "Example2.Pop_OneSeg[1]":[0, Math.PI/2, 0, "XYZ"],
              "Example2.Pop_TwoSeg[0]":[0, 0, 0, "XYZ"]};
        let results = [];

        for (let path in reference) {
          let rotation = Canvas1.engine.meshes[path].rotation.toArray();
          let expected = reference[path];
          for (let i=0; i<rotation.length; ++i)
            results.push(rotation[i] === expected[i]);
        }

        return results.every(function(x){return x;});
      });

      expect(evaluation).toBeTruthy();
    });
  });
}

export function testPharyngealProject () {
  beforeAll(async () => {
    await launchTest(Projects.PHARYNGEAL);
  });

  describe('Control Panel PHARYNGEAL', () => {
    it('The control panel opened with right amount of rows.', async () => {
      await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true, timeout: 45000});
      await page.waitFor(30000);
      if (await isVisible(page, ST.LOADING_SPINNER)){
        await page.waitForSelector(ST.LOADING_SPINNER, { hidden: true, timeout: 45000 });
      }
      await click(page, ST.CONTROL_PANEL_BUTTON);
      await testInitialControlPanelValues(page, 10);
    })
  });
}

export function testEyeWireProject () {
  beforeAll(async () => {
    await launchTest(Projects.EYEWIRE);
  });

  describe('EyeWire', () => {
    it('Load.', async () => {
      await wait4selector(page, ST.LOADING_SPINNER, { hidden: true, timeout: 45000 });
    })
  });
}

