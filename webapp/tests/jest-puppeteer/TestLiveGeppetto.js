const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg } from './cmdline.js';
import { wait4selector, click } from './utils';
import {
    testPlotWidgets
} from './functions';

import * as ST from './selectors';

const baseURL = getCommandLineArg('--url', 'http://live.geppetto.org');

describe('Test live.geppetto.org', () => {
    beforeAll(async () => {
        jest.setTimeout(100000);

        await page.goto(baseURL);
    });

    afterAll(async () => {
    })


    /**Tests Dashboard is present with all default projects**/
    describe('Test Dashboard', () => {
        const PROJECT_IDS = [1, 3, 4, 5, 6, 8, 9, 16, 18, 58];
        it.each(PROJECT_IDS)('Project width id %i from core bundle are present', async id => {
            wait4selector(page, `div[project-id="${id}"]`, { timeout: 60000})
        })

        it("Open Single Component HH Project", async () => {
            await page.goto(baseURL + "/geppetto?load_project_from_id=1");
        })
    })

    /**Opens Single Component HH Project using the Dashboard**/
    describe('Open Single Component HH Project with ID 1', () => {

        /*Tests the landing page of Single Component HH Project*/
        describe('Single Component HH Project Landing Page', () => {
            it("Spinner goes away", async () => {
                await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
            })

            it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
                await wait4selector(page, selector, { visible: true, timeout: 10000})
            })
        })

        /*Some tests making sure some of the expected UI compoments and DOM objects are present*/
        describe('Widgets', () => {
            it('Right amount of graph elements for Plot1', async () => {
                await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true,timeout: 60000});
                // watch out here (the labels in the plot appear a little after the plot)
                await page.waitFor(5000);
                await testPlotWidgets(page, "Plot1", 1);
            })

            it('Right amount of graph elements for Plot2', async () => {
                await testPlotWidgets(page, "Plot2", 3);
            })

            it('Initial amount of experiments for hhcell checked.', async () => {
                expect(
                    await page.evaluate(async () => window.Project.getExperiments().length)
                ).toBe(1)
            })

            it('Top level instance present.', async () => {
                expect(
                    await page.evaluate(async () => eval('hhcell') != null)
                ).toBeTruthy()
            })

            it('2 top Variables as expected for hhcell', async () => {
                expect(
                    await page.evaluate(async () => window.Model.getVariables().map(v => v.getId()))
                ).toEqual(expect.arrayContaining(['hhcell', 'time']))
            })

            it('2 Libraries as expected for hhcell', async () => {
                expect(
                    await page.evaluate(async () => window.Model.getLibraries() != undefined && window.Model.getLibraries().length == 2)
                ).toBeTruthy()
            })

            it('1 top level instance as expected for hhcell', async () => {
                expect(
                    await page.evaluate(async () => window.Instances != undefined && window.Instances.length == 2 && window.Instances[0].getId() == 'hhcell')
                ).toBeTruthy()
            })

            it('Checking that time series length is 6001 in variable for hhcell project', async () => {
                expect(
                    await page.evaluate(async () => eval('hhcell').hhpop[0].bioPhys1.membraneProperties.naChans.na.h.q.getTimeSeries().length == 6001)
                ).toBeTruthy()
            })

            it('REPEATED!! Right amount of graph elements for Plot1', async () => {
                await page.evaluate(async () => Plot1.plotData(eval('hhcell').hhpop[0].v))
                await testPlotWidgets(page, "Plot1", 1)
            })

        })
    })
})