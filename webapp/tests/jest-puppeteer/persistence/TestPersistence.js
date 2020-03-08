import { getCommandLineArg, getUrlFromProjectUrl, getUrlFromProjectId} from './../cmdline.js';
import { wait4selector, click } from './../utils';

import { testProject, testCreateExperiment, testCloneExperiment, testDeleteExperiment, testSaveProjectProperties, testSaveExperimentProperties } from './persistence_functions';
import * as ST from './../selectors';

const baseURL = getCommandLineArg('--url', 'http://localhost:8080/org.geppetto.frontend/');

const PERSISTENCE_PROJECT_1 = {
		name : "Hodgkin-Huxley Neuron",
		id : 1,
		test_name : "TEST 1",
		url : 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/SingleComponentHH/project.json',
		console_test : {input: 'hhcell.isS', expected: 'hhcell.isSelected()'},
		canvas_widget_object_test : "hhcell",
		parameter_test : 'Model.neuroml.pulseGen1.delay',
		recorded_variable_test : 'hhcell.hhpop[0].v',
		custom_handler_event : 'click',
		test_widgets: true,
		initial_timeout : 10 //seconds
}

const PERSISTENCE_PROJECT_2 = {
		name : "c302_A_Pharyngeal",
		id : 2,
		test_name : "TEST 2",
		url : 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/pharyngeal/project.json',
		console_test : {input: 'c302_A_Pharyngeal.isS', expected: 'c302_A_Pharyngeal.isSelected()'},
		canvas_widget_object_test : "c302_A_Pharyngeal",
		parameter_test : 'Model.neuroml.generic_neuron_iaf_cell.C',
		recorded_variable_test : 'c302_A_Pharyngeal.M1[0].v',
		test_widgets: false,
		initial_timeout : 15 //seconds
}
const PERSISTENCE_PROJECT_3 =  {
		name : "Balanced_240cells_36926conns.net - net",
		id : 3,
		test_name : "TEST 3",
		url : 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/balanced/project.json',
		console_test: {input: 'Balanced_240cells_36926conns.isS', expected: 'Balanced_240cells_36926conns.isSelected()'},
		canvas_widget_object_test : "Balanced_240cells_36926conns",
		parameter_test : 'Model.neuroml.Balanced_240cells_36926conns.temperature',
		recorded_variable_test : 'Balanced_240cells_36926conns.popExc[0].biophys.membraneProperties.Na_all.Na.g',
		custom_handler_event : 'click',
		test_widgets: true,
		initial_timeout : 25 //seconds
}

describe('Test Persistence', () => {
	beforeAll(async () => {
		page.on("dialog", (dialog) => {
			dialog.accept();
		});

	});

	/**Tests Dashboard is present with all default projects**/
	describe('Test Dashboard and Login-In', () => {
		it("Load Dashboard", async () => {
			await page.goto(baseURL);
		})

		it("Waiting for Geppetto Logo to appear on Landing Page", async () => {
			await wait4selector(page, ST.GEPPETTO_LOGO, { hidden: true , timeout: 60000})
		})

		it("Loging out", async () => {
			await page.goto(baseURL + "/logout");
		})

		it("Login in as 'guest1' user", async () => {
			await page.goto(baseURL + "/login?username=guest1&password=guest");
		})
	})

	describe('Test Dashboard', () => {
		const PROJECT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		//Tests all default projecsta are on the dashboard
		it.each(PROJECT_IDS)('Project width id %i from persistence are present', async id => {
			wait4selector(page, `div[project-id="${id}"]`, { timeout: 60000})
		})
	})
})

/**
 * Test loading first project, and then persisting it. 
 */
describe('Test First Project', () => {
	testProject(page,baseURL, true, PERSISTENCE_PROJECT_1);
})

/**
 * Test loading second project, and then persisting it. 
 */
describe('Test Second Project', () => {
	testProject(page,baseURL, false, PERSISTENCE_PROJECT_2);
})

/**
 * Test loading third project, and then persisting it. 
 */
describe('Test Third Project', () => {
	testProject(page,baseURL, false, PERSISTENCE_PROJECT_3);
})

/**
 * Test persistence features: creating, cloning and deleting experiments, saving project and experiment.
 */
describe('Test Persistence Features', () => {
	beforeAll(async () => {		
		jest.setTimeout(100000);
		//Load persisted project with ID 1
		await page.goto(getUrlFromProjectId(1));
	});

	describe('Test Persistence Features on  Persisted Project with ID 1',  () => {
		describe('Test Landing Page Components',  () => {
			it("Spinner goes away", async () => {
				await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
			})

			it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
				await wait4selector(page, selector, { visible: true, timeout: 60000 })
			})
		});

		describe('Test Set Experiment Active',  () => {
			it('Set Experiment active', async () => {
				await page.waitFor(20000);
				await page.evaluate(async () => window.Project.getExperiments()[1].setActive())
				await page.waitFor(1000);
			})

			it("Spinner goes away", async () => {
				await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
			})

			it('New Active experiment id of loaded project checked', async () => {
				expect(
						await page.evaluate(async () => window.Project.getActiveExperiment().getId())
				).toBe(2)
			})

			it('2 top Variables as expected for hhcell', async () => {
				expect(
						await page.evaluate(async () => window.Model.getVariables() != undefined && window.Model.getVariables().length == 2 &&
								window.Model.getVariables()[0].getId() == 'hhcell' && window.Model.getVariables()[1].getId() == 'time')
				).toBe(true)
			})
		});

		//Series of calls to test creation, cloning and deleting experiments
		describe('Test Create ,Clone and Delete Experiments',  () => {
			testCreateExperiment(page, 4);
			testDeleteExperiment(page, 3);

			testCreateExperiment(page, 4);
			testDeleteExperiment(page, 3);

			testCloneExperiment(page, 4);
			testDeleteExperiment(page, 3);

			testCloneExperiment(page, 4);
			testDeleteExperiment(page, 3);

			testCreateExperiment(page, 4);
			testDeleteExperiment(page, 3);

			testCreateExperiment(page, 4);
			testDeleteExperiment(page, 3);

			testCloneExperiment(page, 4);
			testDeleteExperiment(page, 3);
		});

		//Save project and experiment properties
		describe('Test Saving Project and Experiment Properties',  () => {			
			const experiment_properties = {"name": "Experiment Test",
					"conversionServiceId" : "testService",
					"simulatorId" : "testSimulator",
					"length" : "2",
					"timeStep" : "3",
					"aspectInstancePath" : "hhcell(net1)"};

			const project_properties = {"name": "New Project Name"};
			it('Save Project and Experiment', async () => {
				await page.evaluate(async (project_properties, experiment_properties) => { 
					window.Project.getExperiments()[(window.Project.getExperiments().length-1)].saveExperimentProperties(experiment_properties);
					window.Project.saveProjectProperties(project_properties);
				}, project_properties, experiment_properties)
				await page.waitFor(1000)
			})

			it("Open Persisted Project",  async () => {
				await page.goto(getUrlFromProjectId(1));
			})

			it("Spinner goes away", async () => {
				await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
			})

			it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
				await wait4selector(page, selector, { visible: true, timeout: 60000 })
			})

			it('Initial amount of experiments for hhcell checked', async () => {
				await page.waitFor(20000);
				expect(
						await page.evaluate(async () => window.Project.getExperiments().length)
				).toBe(3)
			})

			it('Set Experiment active', async () => {
				await page.waitFor(20000);
				await page.evaluate(async () => window.Project.getExperiments()[1].setActive())
				await page.waitFor(1000);
			})

			//Test project properties were saved
			it('Test Save Project Properties', async () => {
				testSaveProjectProperties(page, project_properties, 3)
			})

			//Test experiment got saved
			it('Test Save Experiment Properties', async () => {
				testSaveExperimentProperties(page, experiment_properties, 3)
			})
		});
	})
})