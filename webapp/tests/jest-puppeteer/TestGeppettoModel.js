const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg, getUrlFromProjectId } from './cmdline.js';
import { wait4selector, click } from './utils';

import * as ST from './selectors';

describe('Test Geppetto Model', () => {
    beforeAll(async () => {
        jest.setTimeout(60000);

        await page.goto(getUrlFromProjectId(5));
    });

    afterAll(async () => {
    })

    /*The Primary Auditory Cortext Network Project is used to test the Geppetto Model Factory*/
    describe('Open Primary Auditory Cortex Network Project with ID 5', () => {
        //Tests the landing page of the project is all good, with UI components present
        describe('Landing page', () => {
            it("Spinner goes away", async () => {
                await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
            })

            it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
                await wait4selector(page, selector, { visible: true, timeout: 60000 })
            })

            it('Initial Plot1 Created', async () => {
                await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true, timeout: 30000 });
            })

        })

        /*Starts testing Model Factory*/
        describe('Tests Model Factory using the  Primary Auditory Cortex Network Project.', () => {
            it('Initial amount of experiments for hhcell checked.', async () => {
                expect(
                    await page.evaluate(async () => window.Project.getExperiments().length)
                ).toBe(2)
            })

            it('Top level instance present.', async () => {
                expect(
                    await page.evaluate(async () => eval('acnet2') != null)
                ).toBeTruthy()
            })

            it('Model is not undefined', async () => {
                expect(
                    await page.evaluate(async () => window.Model != undefined)
                ).toBeTruthy()
            })

            it('2 Variables as expected', async () => {
                expect(
                    await page.evaluate(async () => window.Model.getVariables().length == 2)
                ).toBeTruthy()
            })

            it('2 Libraries as expected', async () => {
                expect(
                    await page.evaluate(async () => window.Model.getLibraries().length == 2)
                ).toBeTruthy()
            })

            it('Instances are not undefined', async () => {
                expect(
                    await page.evaluate(async () => window.Instances != undefined)
                ).toBeTruthy()
            })

            it('2 top level instance as expected', async () => {
                expect(
                    await page.evaluate(async () => window.Instances.length == 2)
                ).toBeTruthy()
            })

            it('Shortcuts created as expected. Tested with acnet and acnet.baskets_12', async () => {
                expect(
                    await page.evaluate(async () => window.acnet2 != undefined && window.acnet2.baskets_12 != undefined)
                ).toBeTruthy()
            })

            it('Visual types exploded into instances as expected. Tested with acnet2.pyramidals_48 and acnet2.baskets_12', async () => {
                expect(
                    await page.evaluate(async () =>  window.acnet2.pyramidals_48.getChildren().length === 48 &&
                        window.acnet2.baskets_12.getChildren().length === 12)
                ).toBeTruthy()
            })

            it('Ref string resolved to Type as expected. Tested with referencef : //@libraries.1/@types.5', async () => {
                expect(
                    await page.evaluate(async () =>
                        GEPPETTO.ModelFactory.resolve('//@libraries.1/@types.5').getId() == window.Model.getLibraries()[1].getTypes()[5].getId() &&
                        GEPPETTO.ModelFactory.resolve('//@libraries.1/@types.5').getMetaType() == window.Model.getLibraries()[1].getTypes()[5].getMetaType()
                    )
                ).toBeTruthy()
            })

            it('Type in the model resolved as expected. Tested with acnet2.baskets_12[0]', async () => {
                expect(
                    await page.evaluate(async () =>  acnet2.baskets_12[0].getTypes().length == 1 &&
                        acnet2.baskets_12[0].getTypes()[0].getId() ==  'bask' &&
                        acnet2.baskets_12[0].getTypes()[0].getMetaType() == 'CompositeType')
                ).toBeTruthy()
            })

            it('Visual groups created as expected. Tested with acnet2.baskets_12[0]', async () => {
                expect(
                    await page.evaluate(async () =>  acnet2.baskets_12[0].getTypes()[0].getVisualType().getVisualGroups().length == 3 &&
                        acnet2.baskets_12[0].getTypes()[0].getVisualType().getVisualGroups()[0].getId() == 'Cell_Regions' &&
                        (acnet2.baskets_12[0].getTypes()[0].getVisualType().getVisualGroups()[1].getId() == 'Kdr_bask' ||
                            acnet2.baskets_12[0].getTypes()[0].getVisualType().getVisualGroups()[1].getId() == 'Kdr_bask') &&
                        (acnet2.baskets_12[0].getTypes()[0].getVisualType().getVisualGroups()[2].getId() == 'Na_bask' ||
                            acnet2.baskets_12[0].getTypes()[0].getVisualType().getVisualGroups()[2].getId() == 'Na_bask'))
                ).toBeTruthy()
            })

            it('getAllInstanceOf returning instances as expected for Type and Type path. Tested with acnet2.baskets_12[0]', async () => {
                expect(
                    await page.evaluate(async () => GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getType()).length == 12 &&
                        GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getType().getPath()).length == 12 &&
                        GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getType())[0].getId() == "baskets_12[0]" &&
                        GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getType())[0].getMetaType() == "ArrayElementInstance")
                ).toBeTruthy()
            })

            it('getAllInstanceOf returning instances as expected for Variable and Variable path. Tested with acnet2.baskets_12[0]', async () => {
                expect(
                    await page.evaluate(async () =>  GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getVariable()).length == 1 &&
                        GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getVariable().getPath()).length == 1 &&
                        GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getVariable())[0].getId() == "baskets_12" &&
                        GEPPETTO.ModelFactory.getAllInstancesOf(acnet2.baskets_12[0].getVariable())[0].getMetaType() == "ArrayInstance")
                ).toBeTruthy()
            })

            it('All potential instance paths exploded as expected', async () => {
                expect(
                    await page.evaluate(async () =>  GEPPETTO.ModelFactory.allPathsIndexing.length == 9741 &&
                        GEPPETTO.ModelFactory.allPathsIndexing[0].path == 'acnet2' &&
                        GEPPETTO.ModelFactory.allPathsIndexing[0].metaType == 'CompositeType' &&
                        GEPPETTO.ModelFactory.allPathsIndexing[9741 - 1].path == "acnet2.SmallNet_bask_bask.GABA_syn_inh.GABA_syn_inh" &&
                        GEPPETTO.ModelFactory.allPathsIndexing[9741 - 1].metaType == 'StateVariableType')
                ).toBeTruthy()
            })

            it('getAllPotentialInstancesEndingWith .v returning expected paths', async () => {
                expect(
                    await page.evaluate(async () =>  GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v').length == 456 &&
                        GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v')[0] == 'acnet2.pyramidals_48[0].soma_0.v' &&
                        GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v')[333] == 'acnet2.pyramidals_48[45].basal0_6.v' &&
                        GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v')[456 - 1] == 'acnet2.baskets_12[11].dend_1.v')
                ).toBeTruthy()
            })

            it('Instances.getInstance creates and fetches instance as expected. Tested with acnet2.baskets_12[3]', async () => {
                expect(
                    await page.evaluate(async () =>  window.Instances.getInstance('acnet2.baskets_12[3]').getInstancePath() == 'acnet2.baskets_12[3]')
                ).toBeTruthy()
            })

            it('Instances.getInstance creates and fetches instance as expected. Tested with acnet2.baskets_12[3].soma_0.v', async () => {
                expect(
                    await page.evaluate(async () =>
                        window.Instances.getInstance('acnet2.baskets_12[3].soma_0.v').getInstancePath() == 'acnet2.baskets_12[3].soma_0.v'
                    )
                ).toBeTruthy()
            })

            it('Trying to fetch something that does not exist in the model throws exception', async () => {
                expect(
                    await page.evaluate(async () =>  window.Instances.getInstance('acnet2.baskets_12[3].sticaxxi')==undefined)
                ).toBeTruthy()
            })
        })

        describe('Tests Injected Capabilities using the  Primary Auditory Cortex Network Project.', () => {
            it('Visual capability injected to instances of visual types. Tested with acnet2.baskets_12[0]', async () => {
                expect(
                    await page.evaluate(async () =>  window.acnet2.baskets_12[0].hasCapability(GEPPETTO.Resources.VISUAL_CAPABILITY))
                ).toBeTruthy()
            })

            it('Visual capability injected to types with visual types. Tested with acnet2.baskets_12[0]', async () => {
                expect(
                    await page.evaluate(async () =>  window.acnet2.baskets_12[0].getType().hasCapability(GEPPETTO.Resources.VISUAL_CAPABILITY))
                ).toBeTruthy()
            })

            it('Parameter capability injected to parameter instances. Tested with Model.neuroml.network_ACnet2.temperature', async () => {
                expect(
                    await page.evaluate(async () =>  window.Model.neuroml.network_ACnet2.temperature.hasCapability(GEPPETTO.Resources.PARAMETER_CAPABILITY))
                ).toBeTruthy()
            })

            it('Visual group capability injected to instances of visual types with visual groups. Tested with acnet2.pyramidals_48[0]', async () => {
                expect(
                    await page.evaluate(async () =>  window.acnet2.pyramidals_48[0].hasCapability(GEPPETTO.Resources.VISUAL_GROUP_CAPABILITY))
                ).toBeTruthy()
            })

            it('Connection capability injected to variables of ConnectionType.', async () => {
                expect(
                    await page.evaluate(async () =>
                        GEPPETTO.ModelFactory.getAllVariablesOfMetaType(GEPPETTO.ModelFactory.getAllTypesOfMetaType(GEPPETTO.Resources.COMPOSITE_TYPE_NODE),
                            'ConnectionType')[0].hasCapability(GEPPETTO.Resources.CONNECTION_CAPABILITY)
                    )
                ).toBeTruthy()
            })

            it('Connection capability injected to instances of connection types. Tested with acnet2.pyramidals_48[0]', async () => {
                expect(
                    await page.evaluate(async () =>  window.acnet2.pyramidals_48[0].getConnections()[0].hasCapability(GEPPETTO.Resources.CONNECTION_CAPABILITY))
                ).toBeTruthy()
            })
        })
    })
})