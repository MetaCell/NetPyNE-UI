export const SIM_TOOLBAR_SELECTOR = 'div[id="sim-toolbar"]';
export const SIM_TOOLBAR_MESSAGE = "Geppetto loads the initial simulation controls";

export const CONTROLS_SELECTOR = 'div[id="controls"]';
export const CONTROLS_MESSAGE = 'Geppetto loads the initial camera controls';

export const FOREGROUND_TOOLBAR_SELECTOR = 'div[id="foreground-toolbar"]';
export const FOREGROUND_MESSAGE = "Geppetto loads the initial foreground controls";

export const SPOT_LIGHT_SELECTOR = 'div[id="spotlight"]';
export const SPOT_LIGHT_MESSAGE = "Spotlight is visible.";

export const PLOT_BUTTON_SELECTOR = 'button#plot';
export const PLOT_BUTTON_VISIBLE_MESSAGE = 'Plot variables button became visible correctly';
export const PLOT_BUTTON_INVISIBLE_MESSAGE = 'Plot button correctly hidden';

export const ZOOM_BUTTON_SELECTOR = 'button#zoomInBtn';
export const PAN_RIGHT_BUTTON_SELECTOR = 'button#panRightBtn';
export const ROTATE_RIGHT_BUTTON_SELECTOR = 'button#rotateRightBtn';

export const CANVAS_2_SELECTOR = '#Canvas2_component';
export const ZOOM_BUTTON_CANVAS_2_SELECTOR = '#Canvas2 ' + ZOOM_BUTTON_SELECTOR;
export const PAN_RIGHT_BUTTON_CANVAS_2_SELECTOR = '#Canvas2 ' + PAN_RIGHT_BUTTON_SELECTOR;
export const ROTATE_RIGHT_BUTTON_CANVAS_2_SELECTOR = '#Canvas2 ' + ROTATE_RIGHT_BUTTON_SELECTOR;

export const WATCH_BUTTON_SELECTOR = 'button#watch';
export const WATCH_BUTTON_VISIBLE_MESSAGE = 'Watch button correctly hidden';

export const PAN_HOME_BUTTON_SELECTOR = '#panHomeBtn';
export const SPOT_LIGHT_BUTTON_SELECTOR = '#spotlightBtn';
export const SPOT_LIGHT_SEARCH_INPUT_SELECTOR = 'input#typeahead';
export const SPOT_LIGHT_DIV = 'div#spotlight';

export const CONTROL_PANEL_SELECTOR = 'div#controlpanel';
export const CONTROL_PANEL_MESSAGE = "The control panel is correctly open.";
export const CONTROL_PANEL_BUTTON = '#controlPanelBtn';
export const CONTROL_PANEL_CONTAINER_SELECTOR = '#controlpanel';

export const SEARCH_ICON_SELECTOR = 'i.fa.search';
export const SEARCH_ICON_MESSAGE = 'Attempting to open spotlight';


export const CONSOLE_SELECTOR = 'div.fa.fa-terminal';
export const CONSOLE_OUTPUT_SELECTOR = '#undefined_console';

export const DRAWER_SELECTOR = 'div[class*="consoleContainer"]';
export const DRAWER_MINIMIZE_ICON_SELECTOR = '.minIcons';
export const DRAWER_MAXIMIZE_ICON_SELECTOR = '.maxIcons';
export const DRAWER_CLOSE_ICON_SELECTOR = '.closeIcons';
export const DRAWER_CONTAINER_SELECTOR = '.drawer,.react-draggable';
export const DRAWER_CMD_INPUT_SELECTOR = '#commandInputArea';
export const TABBER_ANCHOR = 'span[class*="tabber"]'
export const SELECTED_TAB = ".selectedTab"

export const HELP_BUTTON_SELECTOR = '#genericHelpBtn';
export const HELP_MODAL_SELECTOR = '#help-modal';

export const MINIMIZE_WIDGETS_CONTAINER_SELECTOR = '#dialog-extend-fixed-container';

export const STANDARD_ROW_SELECTOR = '.standard-row';

export const PLOTLY_SELECTOR = 'div.js-plotly-plot';
export const DIALOG_SELECTOR = 'div.dialog';

export const BUTTON_ONE_SELECTOR = 'button#buttonOne';

export const POPUP = ['Popups' , 1, 'Popup1', { width: 490, height: 394 }];
export const PLOT = ['Plots' , 0, 'Plot1', { width: 350, height: 300 }];
export const TREE = ['Trees' , 3, "TreeVisualiserDAT1", { width: 350, height: 260 }];
export const VAR_LIST = ['Variables', 5, "VarVis1", { width: 350, height: 120 }];

export const WIDGET_LIST = [ POPUP, PLOT, TREE, VAR_LIST ];

export const HHCELL_SELECTOR = 'hhcell.hhpop[0]';
export const HHCELL_V_SELECTOR = 'hhcell.hhpop[0].v';
export const HHCELL_CONTROL_PANEL_BUTTON_SELECTOR = '#hhcell_hhpop_0__visibility_ctrlPanel_btn';
export const HHCELL_V_CONTROL_PANEL_BUTTON_SELECTOR = 'button[id="hhcell_hhpop_0__v_plot_ctrlPanel_btn"]';

export const ACNET2_SELECTOR = 'acnet2.pyramidals_48[0]';
export const ACNET2_BASKET_SELECTOR0 = 'acnet2.baskets_12[0]';
export const ACNET2_BASKET_SELECTOR1 = 'acnet2.baskets_12[1]';
export const ACNET2_BASKET_SELECTOR4 = 'acnet2.baskets_12[4]';
export const ACNET2_BASKET_SELECTOR5 = 'acnet2.baskets_12[5]';
export const ACNET2_V1_SELECTOR = 'acnet2.pyramidals_48[1].soma_0.v';
export const ACNET2_gDensity_SELECTOR = 'acnet2.pyramidals_48[0].biophys.membraneProperties.Ca_pyr_soma_group.gDensity';
export const ACNET2_CONTROL_PANEL_BUTTON_SELECTOR = "acnet2_pyramidals_48_0__visibility_ctrlPanel_btn";
export const ACNET2_V_CONTROL_PANEL_BUTTON_SELECTOR = 'acnet2_pyramidals_48_0__soma_0_v_plot_ctrlPanel_btn';
export const ACNET2_V_CONTROL_PANEL_BUTTON = `button[id="${ACNET2_V_CONTROL_PANEL_BUTTON_SELECTOR}"]`;

export const C302_SELECTOR = 'c302.ADAL[0]';
export const C302_V_CONTROL_PANEL_BUTTON_SELECTOR = 'button[id="c302_ADAL_0__v_plot_ctrlPanel_btn"]';
export const C302_V_SELECTOR = 'c302.ADAL[0].v';

export const CA1_V_SELECTOR = 'ca1.CA1_CG[0].Seg0_apical_dendrite_22_1158.v';


export const STATE_VARIABLE_FILTER_BUTTON_SELECTOR = '#stateVariablesFilterBtn';

export const PROJECT_FILTER_BUTTON_SELECTOR = '#anyProjectFilterBtn';

export const PLOT1_SELECTOR = 'div[id="Plot1"]';
export const PLOT2_SELECTOR = 'div[id="Plot2"]';

export const TUTORIAL_BUTTON_SELECTOR = 'button#tutorialBtn';

export const CANVAS_2_DIV_SELECTOR = 'div#Canvas2';
export const PLOT_1_DIV_SELECTOR = 'div#Plot1';
export const POPUP_1_DIV_SELECTOR = 'div#Popup1';
export const POPUP_2_DIV_SELECTOR = 'div#Popup2';
export const POPUP_1_SELECTOR = '#Popup1';
export const LOGO = 'div#logo';

export const TUTORIAL_1_DIV_SELECTOR = 'div#Tutorial1';

export const LOADING_SPINNER = 'div[id="loading-spinner"]';

export const ELEMENTS_IN_LANDING_PAGE = [
  [ SIM_TOOLBAR_MESSAGE, SIM_TOOLBAR_SELECTOR ],
  [ CONTROLS_MESSAGE, CONTROLS_SELECTOR],
  [ FOREGROUND_MESSAGE, FOREGROUND_TOOLBAR_SELECTOR]
];

export const GEPPETTO_LOGO = 'div#logo';
	
export const EXPERIMENT_TABLE_CONTAINER = 'div#experimentsOutput';
export const EXPERIMENT_TABLE_SELECTOR = 'div.fa.fa-flask';
export const EXPERIMENT_TABLE_COLUMN_1_SELECTOR = 'tr.experimentsTableColumn:nth-child(1)';
export const EXPERIMENT_TABLE_EXTENDED_ROW_VARS_SELECTOR = 'td[name=variables]'
export const EXPERIMENT_TABLE_EXTENDED_ROW_PARAMS_SELECTOR = 'td[name=parameters]'
export const EXPERIMENT_TABLE_ACTIVE_ICON_SELECTOR = 'a.activeIcon'
export const EXPERIMENT_TABLE_DOWNLOAD_RESULTS_ICON_SELECTOR = 'a.downloadResultsIcon'
export const EXPERIMENT_TABLE_DOWNLOAD_MODELS_ICON_SELECTOR = 'a.downloadModelsIcon'
export const EXPERIMENT_TABLE_CLONE_ICON_SELECTOR = 'a.cloneIcon'
export const EXPERIMENT_TABLE_DELETE_ICON_SELECTOR = 'a.deleteIcon'

	
export const PERSIST_BUTTON = 'button.btn.SaveButton';
export const PERSIST_BUTTON_DISABLED = 'button.btn.SaveButton[disabled]';
export const PERSIST_BUTTON_ACTIVE = 'button.btn.SaveButton > i.fa-spin'
	
export const SPOTLIGHT_PARAMETER_INPUT = 'input.spotlight-input'

export const CONNECTIVITY_1_DIV_SELECTOR = 'div[id="Connectivity1"]'
	
export const DASHBOAD_PROJECT_PREVIEW_SELECTOR = 'div.project-preview'
export const DASHBOARD_DELETE_PROJECT_SELECTOR = 'i.fa.fa-trash-o'
export const DASHBOARD_DELETE_ICON_SELECTOR = 'i.fa-trash-o'
export const DASHBOARD_OPEN_PROJECT = 'i.fa-folder-open'
	
export const DIALOG_MODAL_SELECTOR = '#infomodal'
export const DIALOG_MODAL_BUTTON_SELECTOR = '#infomodal-btn'
export const DIALOG_MODAL_HEADER = 'div#infomodal-header'
