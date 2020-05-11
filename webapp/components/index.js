import React from 'react'
import { connect } from "react-redux";
import PythonControlledCapability from "@geppettoengine/geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability";

import {
  activateWidget,
  setWidgets,
  updateWidget,
  newWidget
} from "../redux/actions/layout";
import { openBackendErrorDialog, closeBackendErrorDialog } from '../redux/actions/errors';
import {
  updateCards, editModel, simulateNetwork, createNetwork, 
  createAndSimulateNetwork, showNetwork, pythonCall, modelLoaded, deleteNetParamsObj
} from "../redux/actions/general";
import { closeDrawerDialogBox, openDrawerDialogBox } from '../redux/actions/drawer';

import { openTopbarDialog, closeTopbarDialog, changePageTransitionMode } from '../redux/actions/topbar'

const updateCardsDispatch = dispatch => ({ updateCards: () => dispatch(updateCards) });
const pythonCallErrorDispatch = dispatch => ({ pythonCallErrorDialogBox: payload => dispatch(openBackendErrorDialog(payload)) });

/** **** COMPONENT PROXIES ******/

// Python controlled

import TextField from "@material-ui/core/TextField";
export const NetPyNETextField = PythonControlledCapability.createPythonControlledControl(
  TextField
);

import _NetPyNECellRules from "./definition/cellRules/NetPyNECellRules";
export const NetPyNECellRules = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNECellRules
);

import _NetPyNEConnectivityRules from "./definition/connectivity/NetPyNEConnectivityRules";
export const NetPyNEConnectivityRules = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEConnectivityRules
);

import _NetPyNEPlots from "./definition/plots/NetPyNEPlots";
export const NetPyNEPlots = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEPlots
);

import _ListComponent from "./general/List";
export const ListComponent = PythonControlledCapability.createPythonControlledControl(
  _ListComponent
);

import _AdapterComponent from "./general/AdapterComponent";
export const AdapterComponent = PythonControlledCapability.createPythonControlledControl(
  _AdapterComponent
);

import Checkbox from "./general/Checkbox";
export const NetPyNECheckbox = PythonControlledCapability.createPythonControlledControl(
  Checkbox
);

import _NetPyNEStimulationTargets from "./definition/stimulationTargets/NetPyNEStimulationTargets";
export const NetPyNEStimulationTargets = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEStimulationTargets
);

export const SelectField = PythonControlledCapability.createPythonControlledControl(
  _SelectField
);

// ---------------------------------------------------------------------------------------- //

// CONNECT

import _Dimensions from "./definition/populations/Dimensions";
export const Dimensions = connect(
  (state, ownProps) => ({ ...ownProps }),
  updateCardsDispatch
)(_Dimensions);


import _NetPyNE from "./NetPyNE";
export const NetPyNE = connect(
  null,
  dispatch => ({ 
    pythonCallErrorDialogBox: payload => dispatch(openBackendErrorDialog(payload)),
    setWidgets: payload => dispatch(setWidgets(payload)),
    modelLoaded: () => dispatch(modelLoaded), 
    newWidget: widget => dispatch(newWidget(widget)),
    activateWidget: widgetId => dispatch(activateWidget(widgetId))
  })
)(_NetPyNE);

import _NetPyNECellRule from "./definition/cellRules/NetPyNECellRule";
export const NetPyNECellRule = connect((state, ownProps) => ({
  ...ownProps,
  updates: state.general.updates
}))(_NetPyNECellRule);


import { getInstance as getLayoutManagerInstance } from "./layout/LayoutManager";
export const LayoutManager = () => connect(state => ({ layout: state.layout, }))(getLayoutManagerInstance().getComponent());


import _NetPyNEPopulation from "./definition/populations/NetPyNEPopulation";
export const NetPyNEPopulation = connect(
  null,
  updateCardsDispatch
)(_NetPyNEPopulation);

import _NetPyNEPopulations from "./definition/populations/NetPyNEPopulations";
export const NetPyNEPopulations = connect(
  null,
  updateCardsDispatch
)(
  PythonControlledCapability.createPythonControlledComponent(
    _NetPyNEPopulations
  )
);

import _NetPyNEStimulationSource from "./definition/stimulationSources/NetPyNEStimulationSource";
export const NetPyNEStimulationSource = connect(
  null,
  updateCardsDispatch
)(_NetPyNEStimulationSource);

import _NetPyNEStimulationSources from "./definition/stimulationSources/NetPyNEStimulationSources";
export const NetPyNEStimulationSources = connect(
  null,
  updateCardsDispatch
)(
  PythonControlledCapability.createPythonControlledComponent(
    _NetPyNEStimulationSources
  )
);

import _NetPyNEStimulationTarget from "./definition/stimulationTargets/NetPyNEStimulationTarget";
export const NetPyNEStimulationTarget = connect(
  (state, ownProps) => ({
    ...ownProps,
    updates: state.general.updates
  }),
  updateCardsDispatch
)(_NetPyNEStimulationTarget);


import _NetPyNESynapse from "./definition/synapses/NetPyNESynapse";
export const NetPyNESynapse = connect(
  null,
  updateCardsDispatch
)(_NetPyNESynapse);

import _NetPyNESynapses from "./definition/synapses/NetPyNESynapses";
export const NetPyNESynapses = connect(
  null,
  updateCardsDispatch
)(PythonControlledCapability.createPythonControlledComponent(_NetPyNESynapses));

import _SelectField from "./general/Select";
export const NetPyNESelectField = connect((state, ownProps) => ({
  ...ownProps,
  updates: String(state.general.updates)
}))(PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(
  _SelectField
));


import _NetPyNEInclude from './definition/plots/NetPyNEInclude';
export const NetPyNEInclude = connect(
  (state, ownProps) => ({ ...ownProps, updates: state.general.updates }),
  null
)(_NetPyNEInclude);

import _NetPyNEInstantiated from "./instantiation/NetPyNEInstantiated"
export const NetPyNEInstantiated = connect(
  state => ({ modelState: state.general.modelState }),
  null
)(_NetPyNEInstantiated)

import _NetWorkControlButtons from './instantiation/NetWorkControlButtons'
export const NetWorkControlButtons = connect(
  state => ({ modelState: state.general.modelState }),
  dispatch => ({ 
    createAndSimulateNetwork: () => dispatch(createAndSimulateNetwork),
    simulateNetwork: () => dispatch(simulateNetwork),
  })
)(_NetWorkControlButtons)

import _ActionDialog from './topbar/dialogs/ActionDialog'
export const ActionDialog = connect(
  state => ({ ...state.errors, openErrorDialogBox: state.errors.openDialog }),
  dispatch => ({ 
    pythonCall: (cmd, args) => dispatch(pythonCall(cmd, args)),
    closeBackendErrorDialog: () => dispatch(closeBackendErrorDialog)
  })
)(_ActionDialog)

export { NetPyNEPythonConsole } from './general/NetPyNEPythonConsole';

import _Drawer from './settings/Drawer'
export const Drawer = connect(
  state => ({ editMode: state.general.editMode, layout: state.layout }),
  dispatch => ({ 
    updateWidget: newConf => dispatch(updateWidget(newConf)),
    newWidget: widget => dispatch(newWidget(widget)),
    activateWidget: widgetId => dispatch(activateWidget(widgetId))
  })
)(_Drawer)


import _Topbar from "./topbar/Topbar";
export const Topbar = connect(
  state => ({ 
    dialogOpen: state.topbar.dialogOpen,
    editMode: state.general.editMode,
    topbarDialogName: state.topbar.dialogName,
    pageTransitionMode: state.topbar.pageTransitionMode
  }),
  dispatch => ({ 
    dispatchAction: action => dispatch(action),
    closeDialog: () => dispatch(closeTopbarDialog),
    changePageTransitionMode: mode => dispatch(changePageTransitionMode(mode))
  })
)(_Topbar)

import _SwitchPageButton from "./topbar/SwitchPageButton";
export const SwitchPageButton = connect(
  state => ({ 
    editModelPage: state.general.editMode,
    pageTransitionMode: state.topbar.pageTransitionMode,
  }),
  dispatch => ({ 
    switchToEditModelPage: () => dispatch(editModel),
    changePageTransitionMode: mode => dispatch(changePageTransitionMode(mode)),
    createNetwork: () => dispatch(createNetwork),
    createAndSimulateNetwork: () => dispatch(createAndSimulateNetwork),
    showNetwork: () => dispatch(showNetwork)
  })
)(_SwitchPageButton)

import _NetPyNEThumbnail from "./general/NetPyNEThumbnail";
export const NetPyNEThumbnail = connect(
  state => ({}),
  dispatch => ({ deleteNetParamsObj: payload => dispatch(deleteNetParamsObj(payload)), })
)(_NetPyNEThumbnail)

// ---------------------------------------------------------------------------------------- //

// DEFAULTS
export { default as NetPyNEHome } from "./general/NetPyNEHome";
export { default as NetPyNEField } from "./general/NetPyNEField";
export { default as NetPyNEAddNew } from "./general/NetPyNEAddNew";
export { default as NetPyNECoordsRange } from "./general/NetPyNECoordsRange";
export { default as NetPyNESimConfig } from "./definition/configuration/NetPyNESimConfig";
export { default as HTMLViewer } from './general/HTMLViewer'
export { default as Tooltip } from './general/Tooltip'
export { default as GridLayout } from './general/GridLayout'
export { default as Filter } from './general/Filter'