import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { getLayoutManagerInstance } from '@metacell/geppetto-meta-client/common/layout/LayoutManager';
import {
  addWidget,
  activateWidget,
  setWidgets,
  updateWidget,
  newWidget,
  maximiseWidget,
} from '@metacell/geppetto-meta-client/common/actions';
import { TOPBAR_CONSTANTS } from '../constants';
import PythonControlledCapability from './general/PythonControlledCapability';
import { openBackendErrorDialog, closeBackendErrorDialog } from '../redux/actions/errors';
import {
  updateCards, editModel, simulateNetwork, createNetwork, closeDialog,
  createAndSimulateNetwork, showNetwork, pythonCall, deleteNetParamsObj, resetModel,
  setDefaultWidgets, changeInstanceColor, openConfirmationDialog, closeConfirmationDialog, selectInstances,
} from '../redux/actions/general';

import {
  cloneExperiment,

  openLaunchDialog,
  removeExperiment,
  addExperiment,
  editExperiment
} from '../redux/actions/experiments';

import {
  openTopbarDialog,
  closeTopbarDialog,
} from '../redux/actions/topbar';

import _NetPyNECellRules from './definition/cellRules/NetPyNECellRules';
import _NetPyNEConnectivityRules from './definition/connectivity/NetPyNEConnectivityRules';
import _NetPyNEPlots from './definition/plots/NetPyNEPlots';
import _ListComponent from './general/List';
import _AdapterComponent from './general/AdapterComponent';
import Checkbox from './general/Checkbox';
import _NetPyNEStimulationTargets from './definition/stimulationTargets/NetPyNEStimulationTargets';
import _Dimensions from './definition/populations/Dimensions';
import _NetPyNE from './NetPyNE';
import _NetPyNESection from './definition/cellRules/sections/NetPyNESection';
import _NetPyNECellRule from './definition/cellRules/NetPyNECellRule';
import _NetPyNEPopulation from './definition/populations/NetPyNEPopulation';
import _NetPyNEPopulations from './definition/populations/NetPyNEPopulations';
import _NetPyNEStimulationSource from './definition/stimulationSources/NetPyNEStimulationSource';
import _NetPyNEStimulationSources from './definition/stimulationSources/NetPyNEStimulationSources';
import _NetPyNEStimulationTarget from './definition/stimulationTargets/NetPyNEStimulationTarget';
import _NetPyNESynapse from './definition/synapses/NetPyNESynapse';
import _NetPyNESynapses from './definition/synapses/NetPyNESynapses';
import _SelectField from './general/Select';
import _NetPyNEInclude from './definition/plots/NetPyNEInclude';
import _NetPyNEInstantiated from './instantiation/NetPyNEInstantiated';
import _NetWorkControlButtons from './instantiation/NetWorkControlButtons';
import _ActionDialog from './topbar/dialogs/ActionDialog';
import _Drawer from './drawer/Drawer';
import _Topbar from './topbar/Topbar';
import _SwitchPageButton from './topbar/SwitchPageButton';
import _NetPyNEThumbnail from './general/NetPyNEThumbnail';
import _Dialog from './general/Dialog';
import _ConfirmationDialog from './general/ConfirmationDialog';
import _SelectCellTemplate from './definition/cellRules/SelectCellTemplate';
import _Experiments from './experiments/Experiments';
import _ExperimentEdit from './experiments/ExperimentEdit';
// eslint-disable-next-line import/no-cycle
import _ExperimentManager from './experiments/ExperimentManager';
import _LaunchDialog from './topbar/dialogs/LaunchDialog';
import _NetPyNEPythonConsole from './general/NetPyNEPythonConsole';
import _PlotViewer from './general/PlotViewer';
import _ExperimentControlPanel from './general/ExperimentControlPanel';
import _Rxd from './rxd/Wrapper';

const updateCardsDispatch = (dispatch) => ({ updateCards: () => dispatch(updateCards) });

// Python controlled

export const NetPyNETextField = PythonControlledCapability.createPythonControlledControl(
  TextField,
);

export const NetPyNECellRules = connect(
  null,
  updateCardsDispatch,
)(
  PythonControlledCapability.createPythonControlledComponent(
    _NetPyNECellRules,
  ),
);

export const NetPyNEConnectivityRules = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEConnectivityRules,
);

export const NetPyNEPlots = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEPlots,
);

export const ListComponent = PythonControlledCapability.createPythonControlledControl(
  _ListComponent,
);

export const AdapterComponent = PythonControlledCapability.createPythonControlledControl(
  _AdapterComponent,
);

export const NetPyNECheckbox = PythonControlledCapability.createPythonControlledControl(
  Checkbox,
);

export const NetPyNEStimulationTargets = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEStimulationTargets,
);

export const SelectField = PythonControlledCapability.createPythonControlledControl(
  _SelectField,
);

export const Experiments = connect(
  (state, ownProps) => ({
    ...ownProps,
    experiments: state.experiments.experiments,
  }),
  (dispatch) => ({
    cloneExperiment: (name) => dispatch(cloneExperiment(name)),
    removeExperiment: (name) => dispatch(removeExperiment(name)),
  }),
)(_Experiments);

export const LaunchDialog = connect(
  (state, ownProps) => {
    const { inDesign, openLaunchDialog } = state.experiments;
    return ({
      ...ownProps,
      open: openLaunchDialog,
      experimentName: inDesign == null ? '' : inDesign.name,
      numberOfTrials: inDesign == null ? '' : inDesign.trials.length,
    });
  },
)(_LaunchDialog);

export const ExperimentControlPanel = connect(
  (state) => ({
    modelState: state.general.modelState,
  }),
  null,
)(_ExperimentControlPanel);

export const ExperimentEdit = connect(
  (state, ownProps) => ({
    ...ownProps,
    updates: state.general.updates,
  }),
  (dispatch) => ({
    editExperiment: (name, details) => dispatch(editExperiment(name, details)),
    addExperiment: (name, details) => dispatch(addExperiment(name, details)),
  }),
)(_ExperimentEdit);

export const ExperimentManager = _ExperimentManager;
// ---------------------------------------------------------------------------------------- //

// CONNECT

export const Dimensions = connect(
  (state, ownProps) => ({ ...ownProps }),
  updateCardsDispatch,
)(_Dimensions);

export const NetPyNE = connect(
  null,
  (dispatch) => ({
    pythonCallErrorDialogBox: (payload) => dispatch(openBackendErrorDialog(payload)),
    setWidgets: (payload) => dispatch(setWidgets(payload)),
    setDefaultWidgets: () => dispatch(setDefaultWidgets),    
  }),
)(_NetPyNE);

export const NetPyNECellRule = connect(
  (state, ownProps) => ({
    ...ownProps,
    updates: state.general.updates,
  }),
  (dispatch) => ({
    openTopbarDialog: (cellTemplateName) => dispatch(
      openTopbarDialog(TOPBAR_CONSTANTS.IMPORT_CELL_TEMPLATE, { cellRuleName: cellTemplateName }),
    ),
    updateCards: () => dispatch(updateCards),
  }),
)(_NetPyNECellRule);

export const NetPyNESection = connect(
  null,
  (dispatch) => ({ openTopbarDialog: () => dispatch(openTopbarDialog(TOPBAR_CONSTANTS.IMPORT_CELL_TEMPLATE)) }),
)(_NetPyNESection);

export const LayoutManager = () => connect((state) => ({ ...state }))(getLayoutManagerInstance()
  .getComponent());

export const NetPyNEPopulation = connect(
  (state) => ({ updates: state.general.updates }),
  updateCardsDispatch,
)(_NetPyNEPopulation);

export const NetPyNEPopulations = connect(
  null,
  updateCardsDispatch,
)(
  PythonControlledCapability.createPythonControlledComponent(
    _NetPyNEPopulations,
  ),
);

export const NetPyNEStimulationSource = connect(
  null,
  updateCardsDispatch,
)(_NetPyNEStimulationSource);

export const NetPyNEStimulationSources = connect(
  null,
  updateCardsDispatch,
)(
  PythonControlledCapability.createPythonControlledComponent(
    _NetPyNEStimulationSources,
  ),
);

export const NetPyNEStimulationTarget = connect(
  (state, ownProps) => ({
    ...ownProps,
    updates: state.general.updates,
  }),
  updateCardsDispatch,
)(_NetPyNEStimulationTarget);

export const NetPyNESynapse = connect(
  null,
  updateCardsDispatch,
)(_NetPyNESynapse);

export const NetPyNESynapses = connect(
  null,
  updateCardsDispatch,
)(PythonControlledCapability.createPythonControlledComponent(_NetPyNESynapses));

export const NetPyNESelectField = connect((state, ownProps) => ({
  ...ownProps,
  updates: String(state.general.updates),
}))(PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(
  _SelectField,
));

export const NetPyNEInclude = connect(
  (state, ownProps) => ({
    ...ownProps,
    updates: state.general.updates,
  }),
  null,
)(_NetPyNEInclude);

export const NetPyNEInstantiated = connect(
  (state) => ({
    modelState: state.general.modelState,
    theme: state.general.theme,
    data: state.general.instances,
  }),
  (dispatch) => ({
    selectInstances: (instances, selectedInstances) => dispatch(selectInstances(instances, selectedInstances)),
  }),
)(_NetPyNEInstantiated);

export const NetWorkControlButtons = connect(
  (state) => ({ modelState: state.general.modelState }),
  (dispatch) => ({
    createAndSimulateNetwork: () => dispatch(createAndSimulateNetwork),
    simulateNetwork: () => dispatch(simulateNetwork()),
  }),
)(_NetWorkControlButtons);

export const ActionDialog = connect(
  (state) => ({
    ...state.errors,
    openDialog: true,
  }),
  (dispatch) => ({
    pythonCall: (cmd, args) => dispatch(pythonCall(cmd, args)),
    closeBackendErrorDialog: () => dispatch(closeBackendErrorDialog),
  }),
)(_ActionDialog);

export const ErrorDialog = connect(
  (state) => ({
    ...state.errors,
    openErrorDialogBox: state.errors.openDialog,
  }),
  (dispatch) => ({
    pythonCall: (cmd, args) => dispatch(pythonCall(cmd, args)),
    closeBackendErrorDialog: () => dispatch(closeBackendErrorDialog),
  }),
)(_ActionDialog);

export const NetPyNEPythonConsole = connect(
  (state) => ({
    extensionLoaded: state.client.jupyter_geppetto_extension.loaded,
  }),
  null,
)(_NetPyNEPythonConsole);

export const Drawer = connect(
  (state) => ({
    editMode: state.general.editMode,
    widgets: state.widgets,
  }),
  (dispatch) => ({
    updateWidget: (newConf) => dispatch(updateWidget(newConf)),
    newWidget: (widget) => dispatch(newWidget(widget)),
    activateWidget: (widgetId) => dispatch(activateWidget(widgetId)),
    maximiseWidget: (widgetId) => dispatch(maximiseWidget(widgetId)),
    addWidget: (widgetConf) => dispatch(addWidget(widgetConf)),
  }),
)(_Drawer);

export const Topbar = connect(
  (state) => ({
    dialogOpen: state.topbar.dialogOpen,
    editMode: state.general.editMode,
    modelState: state.general.modelState,
    topbarDialogName: state.topbar.dialogName,
    topbarDialogMetadata: state.topbar.dialogMetadata,
    pageTransitionMode: state.topbar.pageTransitionMode,
    modelLoaded: state.client.model && state.client.model.status,
    automaticInstantiation: state.general.automaticInstantiation,
    automaticSimulation: state.general.automaticSimulation,
    theme: state.general.theme,
    experimentInDesign: state.experiments.inDesign != null,
  }),
  (dispatch) => ({
    dispatchAction: (action) => dispatch(action),
    closeDialog: () => dispatch(closeTopbarDialog),
    resetModel: () => dispatch(resetModel),
    openConfirmationDialog: (payload) => dispatch(openConfirmationDialog(payload)),
  }),
)(_Topbar);

export const SwitchPageButton = connect(
  (state) => ({
    editModelPage: state.general.editMode,
    modelState: state.general.modelState,
    automaticInstantiation: state.general.automaticInstantiation,
    automaticSimulation: state.general.automaticSimulation,
    experimentInDesign: state.experiments.inDesign != null,
  }),
  (dispatch) => ({
    switchToEditModelPage: () => dispatch(editModel),
    createNetwork: () => dispatch(createNetwork),
    createAndSimulateNetwork: () => dispatch(createAndSimulateNetwork),
    showNetwork: () => dispatch(showNetwork),
    simulateNetwork: () => dispatch(simulateNetwork()),
    openLaunchDialog: () => dispatch(openLaunchDialog()),
  }),
)(_SwitchPageButton);

export const NetPyNEThumbnail = connect(
  (state) => ({}),
  (dispatch) => ({ deleteNetParamsObj: (payload) => dispatch(deleteNetParamsObj(payload)) }),
)(_NetPyNEThumbnail);

export const Dialog = connect(
  (state) => ({
    open: state.general.dialogOpen,
    title: state.general.dialogTitle,
    message: state.general.dialogMessage,
  }),
  (dispatch) => ({ handleClose: () => dispatch(closeDialog) }),
)(_Dialog);

export const ConfirmationDialog = connect(
  (state) => ({
    confirmationDialogOpen: state.general.confirmationDialogOpen,
    confirmationDialogTitle: state.general.confirmationDialogTitle,
    confirmationDialogMessage: state.general.confirmationDialogMessage,
    confirmationDialogOnConfirm: state.general.confirmationDialogOnConfirm,
  }),
  (dispatch) => ({
    dispatchAction: (action) => dispatch(action),
    closeConfirmationDialog: () => dispatch(closeConfirmationDialog),
    pythonCall: (cmd, args) => dispatch(pythonCall(cmd, args)),
  }),
)(_ConfirmationDialog);

export const SelectCellTemplate = connect(
  null,
  (dispatch) => ({
    openTopbarDialog: (cellTemplateName) => dispatch(
      openTopbarDialog(TOPBAR_CONSTANTS.IMPORT_CELL_TEMPLATE, { cellRuleName: cellTemplateName }),
    ),
  }),
)(_SelectCellTemplate);

export const Rxd = connect(
  null,
  updateCardsDispatch,
)(
  PythonControlledCapability.createPythonControlledComponent(
    _Rxd,
  ),
);

// ---------------------------------------------------------------------------------------- //

// DEFAULTS
export { default as NetPyNEHome } from './general/NetPyNEHome';
export { default as NetPyNEField } from './general/NetPyNEField';
export { default as NetPyNEAddNew } from './general/NetPyNEAddNew';
export { default as NetPyNECoordsRange } from './general/NetPyNECoordsRange';
export { default as NetPyNESimConfig } from './definition/configuration/NetPyNESimConfig';
export { default as HTMLViewer } from './general/HTMLViewer';
export { default as Tooltip } from './general/Tooltip';
export { default as GridLayout } from './general/GridLayout';
export { default as Filter } from './general/Filter';
