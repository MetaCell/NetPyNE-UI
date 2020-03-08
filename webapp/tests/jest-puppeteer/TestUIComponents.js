const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg, getUrlFromProjectId } from './cmdline.js';
import { wait4selector, click } from './utils';

import * as ST from './selectors';

const COLLAPSE_WIDGET_HEIGHT = 35;
const baseURL = getCommandLineArg('--url', 'http://localhost:8080/org.geppetto.frontend');

describe('Test UI Components', () => {
  beforeAll(async () => {
    jest.setTimeout(200000);
    await jestPuppeteer.resetBrowser();
    await page.goto(baseURL);
  });

  
  describe('Test Dashboard', () => {
    const PROJECT_IDS = [1, 3, 4, 5, 6, 8, 9, 16, 18, 58];
    it.each(PROJECT_IDS)('Project width id %i from core bundle are present', async id => {
      await page.waitForSelector(`div[project-id="${id}"]`);
    })
  })


  describe('Test Geppetto without scope', () => {
    it('Open the page', async () => {
      await page.goto(getUrlFromProjectId());
    })


    describe('Landing page', () => {
      it("Spinner goes away", async () => {
        await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true })
      })
      
      it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
        await wait4selector(page, selector, { visible: true })
      })
       
    }) 


    describe('Console', () => {
      it('The console panel is correctly visible.', async () => {
        await click(page, ST.CONSOLE_SELECTOR)
        await wait4selector(page, ST.DRAWER_SELECTOR, { visible: true });
      })
      
      it('The console panel is correctly hidden.', async () => {
        await click(page, ST.DRAWER_MINIMIZE_ICON_SELECTOR);
        await wait4selector(page, ST.DRAWER_SELECTOR, { hidden: true });
      })
      
      it('Console is maximized correctly.', async () => {
        await click(page, ST.CONSOLE_SELECTOR)
        await wait4selector(page, ST.DRAWER_SELECTOR, { visible: true });
        await click(page, ST.DRAWER_MAXIMIZE_ICON_SELECTOR)
        expect(
          await page.evaluate( async selector => $(selector).height() > 250, ST.DRAWER_CONTAINER_SELECTOR)
        ).toBeTruthy()
      })
      
      it('Console output empty.', async () => {
        await click(page, ST.DRAWER_CLOSE_ICON_SELECTOR)
        await wait4selector(page, ST.DRAWER_SELECTOR, { hidden: true });
        await click(page, ST.CONSOLE_SELECTOR)
        await wait4selector(page, ST.DRAWER_CMD_INPUT_SELECTOR, { visible: true });
        expect(
          await page.evaluate( async selector => $(selector).find("span").length, ST.CONSOLE_OUTPUT_SELECTOR)
        ).toBe(1)
      })

      it('Console output not empty.', async () => {
        await page.evaluate(async () => G.debug(true))
        await click(page, ST.PAN_HOME_BUTTON_SELECTOR)
        await page.waitFor(50)
        expect(
          await page.evaluate( async selector => $(selector).find("span").length, ST.CONSOLE_OUTPUT_SELECTOR)
        ).toBe(4)
      })

      it('G.clear command not null.', async () => {
        expect(
          await page.evaluate(async () => G.clear())
        ).toBe("Console history cleared")
      })

      it('Console output not empty after G.clear.', async () => {
        expect(
          await page.evaluate(async selector => $(selector).find("span").length, ST.CONSOLE_OUTPUT_SELECTOR)
        ).toBe(0)
      })

      it('Leave debug mode and hide console.', async () => {
        await page.evaluate( async () => G.debug(false))
        await click(page, ST.CONSOLE_SELECTOR)
        await wait4selector(page, ST.DRAWER_SELECTOR, { hidden: true });
      })
    })

    
    describe('Debug mode functionality', () => {
      it('Debug mode disabled.', async () => {
        expect(
          await page.evaluate( async () => G.isDebugOn())
        ).toBeFalsy()
      })

      it('Debug mode correctly enabled.', async () => {
        expect(
          await page.evaluate( async () => {
            G.debug(true);
            return G.isDebugOn();
          })
        ).toBeTruthy()
      })

      it('Debug mode correctly disabled.', async () => {
        expect(
          await page.evaluate( async () => {
            G.debug(false);
            return G.isDebugOn();
          })
        ).toBeFalsy()
      })
    })


    describe('Help window', () => {
      it('Right amount of title headers for tutorial window', async () => {
        await click(page, ST.HELP_BUTTON_SELECTOR);
        await wait4selector(page, ST.HELP_MODAL_SELECTOR, { visible: true });
        expect(
          await page.evaluate( async selector => $(selector).find("h4").length, ST.HELP_MODAL_SELECTOR)
        ).toBe(7)
      })

      it('Right amount of status circles for tutorial window', async () => {
        await click(page, ST.HELP_BUTTON_SELECTOR);
        await wait4selector(page, ST.HELP_MODAL_SELECTOR, { visible: true });
        expect(
          await page.evaluate( async selector => $(selector).find("div").find(".circle").length, ST.HELP_MODAL_SELECTOR)
        ).toBe(10)
      })

      it('G.help command not null.', async () => {
        expect(
          await page.evaluate(async () => G.help())
        ).not.toBeNull()
      })
        
      it("I've waited for help window to go away.", async () => {
        await page.evaluate(async selector => $(selector).find("button")[0].click(), ST.HELP_MODAL_SELECTOR)
        await wait4selector(page, ST.HELP_MODAL_SELECTOR, { hidden: true });
      })
    })

    // Test WIDGETS
    describe.each(ST.WIDGET_LIST)('%s', (title, widgetType, widgetName, originalDimensions) => {
      beforeAll(async () => {
        await page.evaluate( async widgetType => G.addWidget(widgetType), widgetType)
        await wait4selector(page, `#${widgetName}`, { visible: true });
      });

      it('Initial dimensions correct.', async () => {
        expect(
          await page.evaluate( async widgetName => eval(widgetName).getSize(), widgetName)
        ).toEqual(originalDimensions)
      })
      

      describe('Maximize', () => {
        beforeAll(async () => {
          await page.evaluate( async selector => $(selector).parent().find("a")[2].click(), `#${widgetName}`)
        });
          
        it('Maximized dimensions are correct.', async () => {
          const widgetDimensions = await page.evaluate( async widgetName => {
            const parent = eval(widgetName).$el.parent()
            return { width: Math.round(parent.width()), height: Math.round(parent.height()) }
          }, widgetName)

          const widgetExpectedDimensions = await page.evaluate( async () => ({ 
            width: Math.round($(window).width()-.2),
            height: Math.round($(window).height() - 5.2)
          }))

          expect(widgetDimensions).toEqual(widgetExpectedDimensions);
        })
        
        it('Restored dimensions are correct.', async () => {
          await page.evaluate( async selector => $(selector).parent().find("a")[2].click(), `#${widgetName}`);
          expect(
            await page.evaluate( async widgetName => eval(widgetName).getSize(), widgetName)
          ).toEqual(originalDimensions)
        })
      })


      describe('Minimize', () => {
        it('Initialy not minimized.', async () => {
          expect(
            await page.evaluate( async selector => $(selector).find(".ui-dialog").length, ST.MINIMIZE_WIDGETS_CONTAINER_SELECTOR)
          ).toBe(0)
        })

        it('Minimized correctly.', async () => {
          await page.evaluate( async selector => $(selector).parent().find("a")[3].click(), `#${widgetName}`);
          expect(
            await page.evaluate( async selector => $(selector).find(".ui-dialog").length, ST.MINIMIZE_WIDGETS_CONTAINER_SELECTOR)
          ).toBe(1)
        })
        
        it('Restored correctly.', async () => {
          await page.evaluate( async selector => $(selector).parent().find("a")[3].click(), `#${widgetName}`);
          expect(
            await page.evaluate( async selector => $(selector).find(".ui-dialog").length, ST.MINIMIZE_WIDGETS_CONTAINER_SELECTOR)
          ).toBe(0)
        })
      })


      describe('Collapse', () => {
        it('Initialy not Collapse.', async () => {
          expect(
            await page.evaluate(async (widgetID, height) => $(widgetID).height() < height, `#${widgetName}`, COLLAPSE_WIDGET_HEIGHT)
          ).toBeFalsy()
        })

        it('Collapse correctly.', async () => {
          await page.evaluate( async selector => $(selector).parent().find("a")[0].click(), `#${widgetName}`);  
          expect(
            await page.evaluate(async (widgetID, height) => $(widgetID).height() < height, `#${widgetName}`, COLLAPSE_WIDGET_HEIGHT)
          ).toBeTruthy()
        })

        it('Resotored correctly.', async () => {
          await page.evaluate( async selector => $(selector).parent().find("a")[1].click(), `#${widgetName}`);  
          expect(
            await page.evaluate(async (widgetID, height) => $(widgetID).height() < height, `#${widgetName}`, COLLAPSE_WIDGET_HEIGHT)
          ).toBeFalsy()
        })
      })


      describe('Destroy', () => {
        it("Doesn't exist anymore.", async () => {
          await page.evaluate( async widgetName => eval(widgetName).destroy(), widgetName);
          await wait4selector(page, `#${widgetName}`, { hidden: true });
        })
      })
    })


    describe('Units control.', () => {
      beforeAll(async () => {
        await page.evaluate( async () => G.addWidget(0))
        await wait4selector(page, '#Plot1', { visible: true });
      });
      
      it("'S / m2' unit.", async () => {
        expect(
          await page.evaluate( async () => Plot1.getUnitLabel("S / m2"))
        ).toBe("Electric conductance over surface (S / m<sup>2</sup>)")
      })

      it("External 'S / m2' unit.", async () => {
        expect(
          await page.evaluate( async () => {
            GEPPETTO.UnitsController.addUnit("S/m2","Electric conductance OVER density");
            return Plot1.getUnitLabel("S / m2")
          })
        ).toBe("Electric conductance over density (S / m<sup>2</sup>)")
      })

      it("'S / m2' unit", async () => {
        expect(
          await page.evaluate( async () => Plot1.getUnitLabel("S/m2"))
        ).toBe("Electric conductance over density (S/m<sup>2</sup>)")
      })
    })
  })
})
