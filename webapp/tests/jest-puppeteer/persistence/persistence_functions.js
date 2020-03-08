import * as ST from './../selectors'
import { click, wait4selector } from './../utils';
import { getCommandLineArg, getUrlFromProjectUrl , getUrlFromProjectId} from './../cmdline.js';

import { getPersistenceProjectJSON } from './../projects';
/**
 * Series of tests that get performed on project before it gets persisted. Widgets/components also get created so they can be saved
 * when project gets persisted, and then test their existence after persisted.
 */
export const testProject= (page, base_url, expect_popup, project_json) => {
	//retrieve project json using id 
	const test_name = project_json.test_name + " : "
	describe(project_json.test_name + " - "+ project_json.name, () => {
		beforeAll(async () => {		
			jest.setTimeout(60000);
			await page.goto(getUrlFromProjectUrl(project_json.url));
		});

		//Wait for landing page to finish loading with all expected components
		describe(test_name + 'Test Landing Page Components',  () => {
			it("Spinner goes away", async () => {
				await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
			})

			it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
				await wait4selector(page, selector, { visible: true, timeout: 60000 })
			})
		});

		//Test console widget exists and is able to autocomplete command
		describe(test_name + 'Test Console Widget',  () => {
			it('The console panel is correctly visible.', async () => {
				await page.waitFor(project_json.initial_timeout * 1000);
				await page.evaluate(async () => { $(".fa-terminal")[0].click();})
				await wait4selector(page, ST.DRAWER_SELECTOR, { visible: true , timeout : 40000});
			})

			it('The console input area autocomplete works with command: ' + project_json.console_test.expected, async () => {
				await page.waitFor(5000);
				await testConsoleInputArea(page,project_json.console_test.input, project_json.console_test.expected)
			})

			it('The console panel is correctly hidden.', async () => {
				await click(page, ST.DRAWER_MINIMIZE_ICON_SELECTOR);
				await wait4selector(page, ST.DRAWER_SELECTOR, { hidden: true, timeout : 20000 });
			})	
		});

		//Test experiment table, that it toggles and rows are there with expected initial components
		describe(test_name + 'Test Initial Contents in Experiment Table', () => {
			testExperimentTable(page);
			testExperimentTableRow(page)
			testExperimentTableRowIcons(page, false, false,  false)

			it('The experiment table is correctly hidden.', async () => {
				await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
				await wait4selector(page, ST.EXPERIMENT_TABLE, { hidden : true});
			})
		})

		//Tests setting recorded variables and parameters don't work through spotlight component before project is persisted
		describe(test_name + 'Test Spotlight Component Before Project is Persisted', () => {
			testSpotlight(page, false,  project_json.recorded_variable_test, ST.WATCH_BUTTON_SELECTOR);
			testSpotlight(page, false, project_json.parameter_test, ST.SPOTLIGHT_PARAMETER_INPUT);
		})

		//Add widgets to project, so they can be saved as part of project when it's persisted
		if(project_json.test_widgets){
			describe(test_name + 'Add widgets',  () => {
				it("Add canvas widget ", async () => {
					await addCanvasWidget(page,project_json.canvas_widget_object_test);
				})
				it("Add connectivity widget ", async () => {
					await addConnectivityWidget(page);
				})
				it("Add popup widget ", async () => {
					await addPopupWidget(page,project_json.custom_handler_event);
				})
			})
		}

		//Test persistence button works for persisting a project
		describe(test_name + 'Test Persistence Button Functionality',  () => {
			it("Persistence button is present and enabled", async () => {
				await wait4selector(page, ST.PERSIST_BUTTON, {visible : true, timeout : 100000})
				await page.evaluate(async () => { $("#Buttonbar1").hide()})
				await page.waitFor(1000)
			})
			it('Persist button is disabled, click went through', async () => {
				await click(page, ST.PERSIST_BUTTON);
				await wait4selector(page, 'i.fa-spin', {visible : true, timeout : 100000})
			})
			it('Project persisted, persist button stopped spinning', async () => {
				await wait4selector(page, 'i.fa-spin', {hidden : true, timeout : 100000})
			})
		});

		//Reload page using the ID of the new persisted project, and test the widgets we create/saved are there. 
		// Also tests spotlight and experiment table, testing components that are expected to appear when project is persisted
		describe(test_name + 'Test Persisted project',  () => {
			it("Open Persisted Project",  async () => {
				project_json.id = await page.evaluate(async () => Project.getId())
				await page.goto(getUrlFromProjectId(project_json.id));
			})

			it("Spinner goes away", async () => {
				await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
			})

			it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
				await wait4selector(page, selector, { visible: true, timeout: 60000 })
			})

			//Test the widgets we created prior to persisting project were created on reload
			if(project_json.test_widgets){
				it('Popup1 is correctly open on reload', async () => {
					await wait4selector(page, ST.POPUP_1_DIV_SELECTOR, {visible : true, timeout : 30000})
				})
				it('Popup1 custom handlers restored correctly', async () => {
					expect(
							await page.evaluate(async () => Popup1.customHandlers[0]['event'])
					).toBe(project_json.custom_handler_event)
				})

				it('Connectivity1 is correctly open on reload', async () => {
					await wait4selector(page, ST.CONNECTIVITY_1_DIV_SELECTOR, {visible : true, timeout : 30000})
				})

				it('Canvas2 is correctly open on reload', async () => {
					await wait4selector(page, ST.CANVAS_2_SELECTOR, {visible : true, timeout : 30000})
				})
				it('Canvas2 has mesh set correctly', async () => {
					expect(
							await page.evaluate(async () => $.isEmptyObject(Canvas2.engine.meshes))
					).toBe(false)
				})
			}
		})

		//Deletes persisted project using the dashboard and tests delete functionality
		describe(test_name + 'Test delete project using dashboard',  () => {
			it("Open Dashboard",  async () => {
				await page.goto(base_url);
			})
			it('Dashboard Loaded', async () => {
				await wait4selector(page, ST.DASHBOAD_PROJECT_PREVIEW_SELECTOR, {visible : true, timeout : 20000})
			})
			it('Waited for scrolldown projects to appear in dashboard', async () => {
				await page.evaluate(async () => { $("#projects").scrollTop($("#projects")[0].scrollHeight+1000);})
				await click(page, 'div[project-id=\"'+project_json.id+'\"]');
				await page.waitFor(1000);
			})
			it('Waited for delete icon to delete project', async () => {
				await wait4selector(page, ST.DASHBOARD_DELETE_ICON_SELECTOR, {visible : true})
			})
			it('Correctly deleted persisted project using the dashboard', async () => {
				await click(page, ST.DASHBOARD_DELETE_PROJECT_SELECTOR);
				await wait4selector(page, ST.DASHBOARD_OPEN_PROJECT, {hidden : true})
			})

		})
	})
};

export const testCreateExperiment = async (page, expected_experiments) => {
	it('New experiment created using persisted project', async () => {
		await page.evaluate(async () => { window.Project.newExperiment();})
		await page.waitFor(10000)

		expect(
				await page.evaluate(async () =>  window.Project.getExperiments().length)
		).toBe(expected_experiments)
	})
};

export const testCloneExperiment = async (page, expected_experiments) => {
	it('Experiment cloned using persisted project', async () => {
		await page.evaluate(async () =>  window.Project.getExperiments()[0].clone())
		await page.waitFor(10000)
		expect(
				await page.evaluate(async () =>  window.Project.getExperiments().length)
		).toBe(expected_experiments)
	})

	it('"Clone Experiment - Simulator Configuration duration checked', async () => {
		expect(
				await page.evaluate(async () =>  Project.getExperiments()[0].simulatorConfigurations["hhcell"].length ===
					Project.getExperiments()[Project.getExperiments().length-1].simulatorConfigurations["hhcell"].length)
		).toBe(true)
	})

	it('Clone Experiment - Simulator Configuration time step checked', async () => {
		expect(
				await page.evaluate(async () =>  Project.getExperiments()[0].simulatorConfigurations["hhcell"].timeStep===
					Project.getExperiments()[Project.getExperiments().length-1].simulatorConfigurations["hhcell"].timeStep)
		).toBe(true)
	})

	it('Clone Experiment - Simulator Configuration service id checked', async () => {
		expect(
				await page.evaluate(async () =>  Project.getExperiments()[0].simulatorConfigurations["hhcell"].simulatorId===
					Project.getExperiments()[Project.getExperiments().length-1].simulatorConfigurations["hhcell"].simulatorId)
		).toBe(true)
	})
};

export const testDeleteExperiment = async (page, expected_experiments) => {
	it('Experiment was deleted successfully, according to confirmation popup', async() =>{
		await page.waitFor(5000)
		await page.evaluate(async () => { 
			window.Project.getExperiments()[(window.Project.getExperiments().length-1)].deleteExperiment();
		})
		await page.waitFor(5000)
		await page.waitForFunction('document.querySelector(".modal-body").innerText.endsWith("was deleted successfully")');
	})

	it('Experiment was deleted, tested with command', async () => {
		expect(
				await page.evaluate(async () =>  window.Project.getExperiments().length)
		).toBe(expected_experiments)

		await page.evaluate(async () => document.getElementById('infomodal-btn').click())
	})
};

export const testSaveExperimentProperties = async (page,properties, expected_experiments) => {
	expect(
			await page.evaluate(async () =>  window.Project.getExperiments().length)
	).toBe(expected_experiments)

	expect(
			await page.evaluate(async () =>  window.Project.getExperiments()[(window.Project.getExperiments().length-1)].getName())
	).toBe(properties.name)
};

export const testSaveProjectProperties = async (page, properties, expected_experiments) => {
	expect(
			await page.evaluate(async () =>  window.Project.getExperiments().length)
	).toBe(expected_experiments)

	expect(
			await page.evaluate(async (expected_name) =>  window.Project.getName())
	).toBe(properties.name)
};

//Download experiment results, but how to test it works? No solution in jest
const testDownloadExperimentResults = async (page) => {
	await page.evaluate(async () => { 
		var login = GEPPETTO.UserController.isLoggedIn();
		var writePermission = GEPPETTO.UserController.hasPermission(GEPPETTO.Resources.WRITE_PROJECT);
		var projectPersisted = window.Project.persisted;
		if(writePermission && projectPersisted && login){
			window.Project.getActiveExperiment().downloadResults('hhcell', 'GEPPETTO_RECORDING');
		}
	})
	await page.waitFor(1000)
};

//Download experiment model, but how to test it works? No solution in jest
const testDownloadExperimentModel = async (page) => {
	await page.evaluate(async () => { 
		var login = GEPPETTO.UserController.isLoggedIn();
		var writePermission = GEPPETTO.UserController.hasPermission(GEPPETTO.Resources.WRITE_PROJECT);
		var projectPersisted = window.Project.persisted;
		if(writePermission && projectPersisted && login){
			window.Project.downloadModel('hhcell');
		}
	})
	await page.waitFor(1000)
};

const testUpload2DropBoxFeature = async (page) => {
	await page.evaluate(async () => { 
		var login = GEPPETTO.UserController.isLoggedIn();
		var writePermission = GEPPETTO.UserController.hasPermission(GEPPETTO.Resources.WRITE_PROJECT);
		var projectPersisted = window.Project.persisted;
		return writePermission && projectPersisted && login;
	})
	await page.waitFor(1000)
}

const testSpotlight = async (page,persisted,  variableName, checkComponent) => {
	it('Spotlight button present', async () => {
		await wait4selector(page, ST.SPOT_LIGHT_BUTTON_SELECTOR, { visible: true , timeout : 20000});
	})

	it('Opens and shows correct buttons.', async () => {
		await click(page, ST.SPOT_LIGHT_BUTTON_SELECTOR);
		await page.waitFor(1000);
		await wait4selector(page, ST.SPOT_LIGHT_SELECTOR, { visible: true , timeout : 20000});
	})

	it('Spotlight button exists', async () => {
		await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
		await page.keyboard.type(variableName);
		await page.keyboard.press(String.fromCharCode(13))
	})
	if(persisted){
		if(checkComponent == ST.WATCH_BUTTON_SELECTOR){
			it('Record variable icon correctly visible in spotlight', async () => {
				await wait4selector(page, ST.WATCH_BUTTON_SELECTOR, { visible: true });
			})
		}else if(checkComponent == ST.SPOTLIGHT_PARAMETER_INPUT){
			it('Parameter input field correctly visible in spotlight', async () => {
				await wait4selector(page, ST.SPOTLIGHT_PARAMETER_INPUT, { visible: true });
			})
		}
	}else{
		if(checkComponent == ST.WATCH_BUTTON_SELECTOR){
			it('Record variable icon correctly hidden in spotlight', async () => {
				await wait4selector(page, ST.WATCH_BUTTON_SELECTOR, { hidden: true });
			})
		}else if(checkComponent == ST.SPOTLIGHT_PARAMETER_INPUT){
			it('Parameter input field correctly hidden in spotlight', async () => {
				await wait4selector(page, ST.SPOTLIGHT_PARAMETER_INPUT, { hidden: true });
			})
		}
	}

	it('Spotlight goes away', async () => {
		await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
		await page.keyboard.press("Escape")
		await wait4selector(page, ST.SEARCH_ICON_SELECTOR, { hidden: true });;
	})
}

const testExperimentTable = async (page) => {
	it('The experiments table button is present.', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_SELECTOR, { visible : false, timeout : 20000});
	})

	it('The expriments table is correctly visible.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_CONTAINER, { visible : true, timeout : 20000});
	})

	it('The experiments table is correctly hidden.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_CONTAINER, { visible : false, timeout : 20000});
	})

};

const testExperimentTableRow = async (page) => {
	it('The experiment table is correctly visible.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_CONTAINER, { visible : true, timeout : 20000});
	})

	it('Experiment table column expanded and variables content exists', async () => {
		await click(page, ST.EXPERIMENT_TABLE_COLUMN_1_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_EXTENDED_ROW_VARS_SELECTOR, { visible : true, timeout : 20000});
	})

	it('Experiment table column expanded and parameters content exists', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_EXTENDED_ROW_PARAMS_SELECTOR, { visible : true, timeout : 20000});
	})
};

const testExperimentTableRowIcons = async (page, activeButtonVisibility, downloadResultsButtonVisibility, visible) => {	
	async () => {
		await click(page, ST.EXPERIMENT_TABLE_COLUMN_1_SELECTOR);	
	}

	it('Active button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_ACTIVE_ICON_SELECTOR, { visible : activeButtonVisibility, timeout : 20000});
	})

	it('Delete button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_DELETE_ICON_SELECTOR, { visible : visible, timeout : 20000});
	})

	it('Clone button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_CLONE_ICON_SELECTOR, { visible : visible, timeout : 20000});
	})

	it('Download results button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_DOWNLOAD_RESULTS_ICON_SELECTOR, { visible : downloadResultsButtonVisibility, timeout : 20000});
	})

	it('Download model button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_DOWNLOAD_MODELS_ICON_SELECTOR, { visible : true, timeout : 20000});
	})
}

const testConsoleInputArea = async (page, input, expectedAutoComplete) => {
	await page.evaluate(async (value, selector) => {
		$(selector).val(value);
		$(selector).trigger('keydown');
	}, input, ST.DRAWER_CMD_INPUT_SELECTOR)

	await page.waitFor(5000);
	expect(await page.evaluate(async (input_area) => $(input_area).val(), ST.DRAWER_CMD_INPUT_SELECTOR)).toBe(expectedAutoComplete);
}

/**Adds canvas widget to project*/
const addCanvasWidget = async (page, canvasObject) => {
	expect( 
			await page.evaluate(async (widgetCanvasObject) => {
				var canvasObject = null;
				if(widgetCanvasObject=="hhcell"){
					canvasObject = hhcell;
				}else if(widgetCanvasObject=="c302_A_Pharyngeal"){
					canvasObject = c302_A_Pharyngeal;
				}else if(widgetCanvasObject=="Balanced_240cells_36926conns"){
					canvasObject = Balanced_240cells_36926conns;
				}
				GEPPETTO.ComponentFactory.addWidget('CANVAS', {name: '3D Canvas', id: "Canvas2"}, function () {this.setName('Widget Canvas');this.setPosition();this.display([canvasObject])});
				return true;
			}, canvasObject)
	).toBe(true)
}

/**Adds connectivity widget to project */
const addConnectivityWidget = async (page) => {
	expect( 
			await page.evaluate(async () => { G.addWidget(6); return true;})
	).toBe(true)
}

/**Adds popup widget to project*/
const addPopupWidget = async (page, customHandler) => {
	expect(
			await page.evaluate(async (customHandlerEvent) => { 
				if(typeof Popup1 == "undefined"){
					G.addWidget(1).then(w=>{w.setMessage("Test popup").addCustomNodeHandler(function(){},customHandlerEvent);}); 
				}else{
					Popup1.addCustomNodeHandler(function(){},customHandlerEvent); 
				}

				return true;
			}, customHandler)
	).toBe(true)
}