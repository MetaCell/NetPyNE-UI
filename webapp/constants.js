import { WidgetStatus } from '@metacell/geppetto-meta-client/common/layout/model';

export const MINIMIZED_PANEL = 'border_bottom';
export { WidgetStatus };
export const TOP_PANEL = 'hlsPanel';
export const TOOLS_LIST = 'tools';

export const DEFAULT_CONFIRMATION_DIALOG_MESSAGE = 'A NetPyNE model has already been instantiated or simulated.'
+ ' Continuing with this action will use the old value of netParams and simConfig for the new model. Do you want to continue?';

export const THEMES = {
  DARK: 'gui',
  BLACK: 'guiBlack',
  LIGHT: 'guiWhite',
};

export const MODEL_STATE = {
  NOT_INSTANTIATED: 'NOT_INSTANTIATED',
  INSTANTIATED: 'INSTANTIATED',
  SIMULATED: 'SIMULATED',
};

export const DEFAULT_COLOR = {
  g: 0.50, b: 0.60, r: 1, a: 0.80,
};

export const NETPYNE_COMMANDS = {
  instantiateModel: 'netpyne_geppetto.instantiateNetPyNEModelInGeppetto',
  simulateModel: 'netpyne_geppetto.simulateNetPyNEModelInGeppetto',
  importModel: 'netpyne_geppetto.importModel',
  exportModel: 'netpyne_geppetto.exportModel',
  exportHLS: 'netpyne_geppetto.exportHLS',
  plotFigure: 'netpyne_geppetto.getPlot',
  deleteParam: 'netpyne_geppetto.deleteParam',
  checkAvailablePlots: 'netpyne_geppetto.checkAvailablePlots',
  getExperiments: 'netpyne_geppetto.experiments.get_experiments',
  cloneExperiment: 'netpyne_geppetto.cloneExperiment',
  viewExperimentResults: 'netpyne_geppetto.viewExperimentResult',
};

export const REAL_TYPE = {
  INT: 'int',
  FLOAT: 'float',
  BOOL: 'bool',
  STR: 'str',
  FUNC: 'func',
  DICT: 'dict',
  DICT_DICT: 'dict(dict)',
};

export const PYTHON_CONSOLE_WIDGET = {
  id: 'python',
  name: 'Python',
  status: WidgetStatus.MINIMIZED,
  component: 'PythonConsole',
  panelName: MINIMIZED_PANEL,
  defaultWeight: 30,
  defaultPosition: 'BOTTOM',
  defaultPanel: 'consolePanel',
  enableClose: true,
  enableDrag: true,
  enableRename: false,
  hideOnClose: true,
  pos: 1000,
  specification: TOOLS_LIST,
};
/*
 * ------------------------------------------------------------------------------ //
 * ------------------------------------------------------------------------------ //
 */
export const TOPBAR_CONSTANTS = {
  LOAD: 'LOAD',
  SAVE: 'SAVE',
  IMPORT_HLS: 'IMPORT_HLS',
  EXPORT_HLS: 'EXPORT_HLS',
  IMPORT_CELL_TEMPLATE: 'IMPORT_CELL_TEMPLATE',
  NEW_MODEL: 'NEW_MODEL',
  UPLOAD_FILES: 'UPLOAD_FILES',
  DOWNLOAD_FILES: 'DOWNLOAD_FILES',
  CREATE_NETWORK: 'Create network',
  CREATE_AND_SIMULATE_NETWORK: 'Create and simulate network',
  SIMULATE: 'Simulate network',
  EXPLORE_EXISTING_NETWORK: 'Explore model',
  BACK_TO_EDITION: 'BACK TO EDIT',
  NEW_PAGE: 'NEW_PAGE',
  NETWORK_MODEL: 'NETWORK_MODEL',
};

/*
 * ------------------------------------------------------------------------------ //
 * ------------------------------------------------------------------------------ //
 */
export const NETWORK_PLOT_WIDGETS = {
  connectionPlot: {
    id: 'connectionPlot',
    name: 'Connections Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    pos: 1,
    config: {
      id: 'connectionPlot',
      name: 'Connections Plot',
      method: {
        plotKey: 'plotConn',
        plotMethod: 'iplotConn',
        plotType: false,
      },
    },
  },
  d2NetPlot: {
    id: 'd2NetPlot',
    name: '2D Net Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    pos: 2,
    config: {
      id: 'd2NetPlot',
      name: '2D Net Plot',
      method: {
        plotKey: 'plot2Dnet',
        plotMethod: 'iplot2Dnet',
        plotType: false,
      },
    },
  },
};

export const PLOT_WIDGETS = {
  ...NETWORK_PLOT_WIDGETS,
  tracesPlot: {
    id: 'tracesPlot',
    name: 'Cell traces',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    disabled: true,
    pos: 3,
    config: {
      id: 'tracesPlot',
      name: 'Cell traces',
      method: {
        plotKey: 'plotTraces',
        plotMethod: 'iplotTraces',
        plotType: false,
      },
    },
  },
  rasterPlot: {
    id: 'rasterPlot',
    name: 'Raster plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    disabled: true,
    pos: 4,
    config: {
      id: 'rasterPlot',
      name: 'Raster plot',
      method: {
        plotKey: 'plotRaster',
        plotMethod: 'iplotRaster',
        plotType: false,
      },
    },
  },
  spikePlot: {
    id: 'spikePlot',
    name: 'Spike Hist Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    disabled: true,
    pos: 5,
    config: {
      id: 'spikePlot',
      name: 'Spike Hist Plot',
      method: {
        plotKey: 'plotSpikeHist',
        plotMethod: 'iplotSpikeHist',
        plotType: false,
      },
      pos: 5,
    },
  },
  spikeStatsPlot: {
    id: 'spikeStatsPlot',
    name: 'Spike Stats Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    disabled: true,
    pos: 6,
    config: {
      id: 'spikeStatsPlot',
      name: 'Spike Stats Plot',
      method: {
        key: 'plotSpikeStats',
        plotMethod: 'iplotSpikeStats',
        plotType: false,
      },
    },
  },
  ratePSDPlot: {
    id: 'ratePSDPlot',
    name: 'Rate PSD Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    disabled: true,
    method: {
      key: 'plotRatePSD',
      plotMethod: 'iplotRatePSD',
      plotType: false,
    },
    pos: 7,
    config: {
      id: 'ratePSDPlot',
      name: 'Rate PSD Plot',
      method: {
        key: 'plotRatePSD',
        plotMethod: 'iplotRatePSD',
        plotType: false,
      },
    },
  },
  LFPTimeSeriesPlot: {
    id: 'LFPTimeSeriesPlot',
    name: 'LFP Time Series Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    disabled: true,
    method: {
      plotKey: 'plotLFP',
      plotMethod: 'iplotLFP',
      plotType: 'timeSeries',
    },
    pos: 8,
    config: {
      id: 'LFPTimeSeriesPlot',
      name: 'LFP Time Series Plot',
      method: {
        plotKey: 'plotLFP',
        plotMethod: 'iplotLFP',
        plotType: 'timeSeries',
      },
    },
  },
  LFPPSDPlot: {
    id: 'LFPPSDPlot',
    name: 'LFP PSD Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    disabled: true,
    method: {
      plotKey: 'plotLFP',
      plotMethod: 'iplotLFP',
      plotType: 'PSD',
    },
    pos: 9,
    config: {
      id: 'LFPPSDPlot',
      name: 'LFP PSD Plot',
      method: {
        plotKey: 'plotLFP',
        plotMethod: 'iplotLFP',
        plotType: 'PSD',
      },
    },
  },
  LFPSpectrogramPlot: {
    id: 'LFPSpectrogramPlot',
    name: 'LFP Spectrogram Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    hideOnClose: true,
    initialized: false,
    disabled: true,
    method: {
      plotKey: 'plotLFP',
      plotMethod: 'iplotLFP',
      plotType: 'spectrogram',
    },
    pos: 10,
    config: {
      id: 'LFPSpectrogramPlot',
      name: 'LFP Spectrogram Plot',
      method: {
        plotKey: 'plotLFP',
        plotMethod: 'iplotLFP',
        plotType: 'spectrogram',
      },
    },
  },
  grangerPlot: {
    id: 'grangerPlot',
    name: 'Granger Plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    hideOnClose: true,
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    initialized: false,
    disabled: true,
    method: {
      plotKey: 'granger',
      plotMethod: 'iplotGranger',
      plotType: false,
    },
    pos: 11,
    config: {
      id: 'grangerPlot',
      name: 'Granger Plot',
      method: {
        plotKey: 'granger',
        plotMethod: 'iplotGranger',
        plotType: false,
      },
    },
  },
  rxdConcentrationPlot: {
    id: 'rxdConcentrationPlot',
    name: 'RxD concentration plot',
    status: WidgetStatus.MINIMIZED,
    component: 'Plot',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    hideOnClose: true,
    enableRename: false,
    initialized: false,
    disabled: true,
    method: {
      plotKey: 'plotRxDConcentration',
      plotMethod: 'iplotRxDConcentration',
      plotType: false,
    },
    pos: 12,
    config: {
      id: 'rxdConcentrationPlot',
      name: 'RxD concentration plot',
      method: {
        plotKey: 'plotRxDConcentration',
        plotMethod: 'iplotRxDConcentration',
        plotType: false,
      },
    },
  },
};

export const DEFAULT_NETWORK_WIDGETS = {
  D3Canvas: {
    id: 'D3Canvas',
    name: '3D Representation',
    status: WidgetStatus.ACTIVE,
    component: 'D3Canvas',
    panelName: 'morphoPanel',
    enableRename: false,
    hideOnClose: true,
    pos: 0,
  },
  experimentManager: {
    id: 'experimentManager',
    name: 'Experiment Manager',
    status: WidgetStatus.MINIMIZED,
    hideOnClose: true,
    component: 'experimentManager',
    panelName: MINIMIZED_PANEL,
    defaultPanel: TOP_PANEL,
    enableRename: false,
    pos: 14,
    specification: TOOLS_LIST,
  },
  experimentControlPanel: {
    id: 'experimentControlPanel',
    name: 'Control Panel',
    status: WidgetStatus.MINIMIZED,
    hideOnClose: true,
    component: 'experimentControlPanel',
    panelName: MINIMIZED_PANEL,
    defaultPanel: 'plotPanel',
    enableRename: false,
    pos: 13,
    specification: TOOLS_LIST,
  },
  rxd: {
    id: 'rxd',
    name: 'Rxd',
    status: WidgetStatus.MINIMIZED,
    hideOnClose: true,
    component: 'rxd',
    panelName: MINIMIZED_PANEL,
    defaultPanel: TOP_PANEL,
    enableRename: false,
    pos: 15,
    specification: TOOLS_LIST,
  },
  ...PLOT_WIDGETS,
  [PYTHON_CONSOLE_WIDGET.id]: PYTHON_CONSOLE_WIDGET,
};

export const EDIT_WIDGETS = {
  [PYTHON_CONSOLE_WIDGET.id]: PYTHON_CONSOLE_WIDGET,
  cellParams: {
    id: 'cellParams',
    name: 'Cell Types',
    model: 'netParams.cellParams',
    status: WidgetStatus.ACTIVE,
    component: 'cellParams',
    panelName: TOP_PANEL,
    enableRename: false,
    hideOnClose: true,
    pos: 0,
    props: {
      model: 'netParams.cellParams',
    },
  },
  popParams: {
    id: 'popParams',
    name: 'Populations',
    model: 'netParams.popParams',
    status: WidgetStatus.HIDDEN,
    component: 'popParams',
    panelName: TOP_PANEL,
    enableRename: false,
    hideOnClose: true,
    pos: 1,
    props: {
      model: 'netParams.popParams',
    },
  },
  synMechParams: {
    id: 'synMechParams',
    name: 'Synaptic Mechanisms',
    model: 'netParams.synMechParams',
    status: WidgetStatus.HIDDEN,
    component: 'synMechParams',
    panelName: TOP_PANEL,
    enableRename: false,
    hideOnClose: true,
    pos: 2,
    props: {
      model: 'netParams.synMechParams',
    },
  },
  connParams: {
    id: 'connParams',
    name: 'Connectivity Rules',
    model: 'netParams.connParams',
    status: WidgetStatus.HIDDEN,
    component: 'connParams',
    panelName: TOP_PANEL,
    hideOnClose: true,
    enableRename: false,
    pos: 3,
    props: {
      model: 'netParams.connParams',
    },
  },
  stimSourceParams: {
    id: 'stimSourceParams',
    name: 'Stim. sources',
    model: 'netParams.stimSourceParams',
    status: WidgetStatus.HIDDEN,
    component: 'stimSourceParams',
    hideOnClose: true,
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 4,
    props: {
      model: 'netParams.stimSourceParams',
    },
  },
  stimTargetParams: {
    id: 'stimTargetParams',
    name: 'Stim. targets',
    model: 'netParams.stimTargetParams',
    status: WidgetStatus.HIDDEN,
    component: 'stimTargetParams',
    hideOnClose: true,
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 5,
    props: {
      model: 'netParams.stimTargetParams',
    },
  },
  analysis: {
    id: 'analysis',
    name: 'Plot Settings',
    model: 'simConfig.analysis',
    status: WidgetStatus.HIDDEN,
    hideOnClose: true,
    component: 'analysis',
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 6,
    props: {
      model: 'simConfig.analysis',
    },
  },
  simConfig: {
    id: 'simConfig',
    name: 'Configuration',
    status: WidgetStatus.HIDDEN,
    component: 'simConfig',
    hideOnClose: true,
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 7,
  },
  experimentManager: {
    id: 'experimentManager',
    name: 'Experiment Manager',
    status: WidgetStatus.HIDDEN,
    hideOnClose: true,
    component: 'experimentManager',
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 8,
    specification: TOOLS_LIST,
  },
  rxd: {
    id: 'rxd',
    name: 'Rxd',
    status: WidgetStatus.HIDDEN,
    hideOnClose: true,
    component: 'rxd',
    panelName: TOP_PANEL,
    enableRename: false,
    pos: 9,
    specification: TOOLS_LIST,
  },
};

export const EXPERIMENT_STATE = {
  DESIGN: 'DESIGN',
  PENDING: 'PENDING',
  SIMULATING: 'SIMULATING',
  SIMULATED: 'SIMULATED',
  INSTANTIATING: 'INSTANTIATING',
  INSTANTIATED: 'INSTANTIATED',
  ERROR: 'ERROR',
};

export const SIDEBAR_HEADINGS = {
  MODEL: 'Model Specification',
  TOOLS: 'Tools',
  PLOTS: 'Plots',
};

export const EXPERIMENT_TEXTS = {
  WARNING: 'Warning: You need at least two parameters for the grouping to work.',
  RANGE: 'range',
  LIST: 'list',
  CREATE_EXPERIMENT: 'Create New Experiment',
  DIALOG_MESSAGE: 'The new experiment will replace the current experiment in design, are you sure you want to proceed?',
  INPUT_ERR_MESSAGE: 'Please check the input',
  DELETE_EXPERIMENT: 'Delete Experiment',
  DELETE_DIALOG_MESSAGE: 'Are you sure you want to delete this experiment?',
  CLONE_EXPERIMENT: 'Clone Experiment',
  CLONE_EXPERIMENT_MESSAGE: 'Replaces the Experiment in design with the stored Experiment.',
  VIEW_EXPERIMENTS_RESULTS: 'View simulation results',
  VIEW_EXPERIMENTS_RESULTS_MESSAGE: 'This will replace the currently loaded results in Explore, '
    + 'are you sure you want to proceed?',
  LOAD_TRIAL_MODEL_SPEC: 'Load Model Specification',
  LOAD_TRIAL_MODEL_SPEC_MESSAGE: 'This will replace the currently loaded model specification, '
    + 'are you sure you want to proceed?',
  ERROR_EXPERIMENT_WITH_NAME_EXISTS: 'This name is already taken',
  ERROR_EXPERIMENT_EMPTY: 'Please enter experiment name',
};

export const TUTORIALS_LIST = {
  tut1: 'Tut 1: Simple cell network',
  tut2: 'Tut 2: Detailed cell network',
  tut3: 'Tut 3a: Multiscale network (low IP3)',
  tut3_ip3high: 'Tut 3b: Multiscale network (high IP3)',
  tut3_norxd: 'Tut 3c: Multiscale network (no RxD)',
  tut_osc: 'Tut 4: Simple oscillatory network',
};

export const EXPERIMENT_VIEWS = {
  list: 'list',
  viewExperiment: 'viewExperiment',
  jsonViewer: 'jsonViewer',
  edit: 'edit',
};

export const LAUNCH_MODAL = {
  title: 'What do you want to simulate ?',
  modelState: 'model',
  experimentState: 'experiment',
  actionSimulate: 'Simulate',
  defaultResource: 'Local Machine',
  errorText: 'Please check the input',
};
