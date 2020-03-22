import React from 'react'
import { connect } from "react-redux";
import PythonControlledCapability from "geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability";

import {
  activateWidget,
  destroyWidget,
  minimizeWidget,
  maximizeWidget
} from "../redux/actions/flexlayout";

import { updateCards, editModel, createNetwork, createAndSimulateNetwork, showNetwork } from "../redux/actions/general";


const updateCardsDispatch = dispatch => ({ updateCards: () => dispatch(updateCards) });
const editModelDispatch = dispatch => ({ editModel: () => dispatch(editModel) });


/** **** COMPONENT PROXIES ******/

import _AdapterComponent from "./general/AdapterComponent";
export const AdapterComponent = PythonControlledCapability.createPythonControlledControl(
  _AdapterComponent
);

import Checkbox from "./general/Checkbox";
export const NetPyNECheckbox = PythonControlledCapability.createPythonControlledControl(
  Checkbox
);

import _Dimensions from "./definition/populations/Dimensions";
export const Dimensions = connect(
  (state, ownProps) => ({ ...ownProps }),
  updateCardsDispatch
)(_Dimensions);


import _ListComponent from "./general/List";
export const ListComponent = PythonControlledCapability.createPythonControlledControl(
  _ListComponent
);

import _NetPyNE from "./NetPyNE";
export const NetPyNE = connect(
  state => ({ editMode: state.general.editMode, }),
  editModelDispatch
)(_NetPyNE);

import NetPyNEAddNew from "./general/NetPyNEAddNew";
export { NetPyNEAddNew };

import NetPyNEHome from "./general/NetPyNEHome";
export { NetPyNEHome };

import _NetPyNECellRule from "./definition/cellRules/NetPyNECellRule";
export const NetPyNECellRule = connect((state, ownProps) => ({
  ...ownProps,
  updates: state.general.updates
}))(_NetPyNECellRule);

import _NetPyNECellRules from "./definition/cellRules/NetPyNECellRules";
export const NetPyNECellRules = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNECellRules
);

import _NetPyNEConnectivityRules from "./definition/connectivity/NetPyNEConnectivityRules";
export const NetPyNEConnectivityRules = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEConnectivityRules
);

import NetPyNECoordsRange from "./general/NetPyNECoordsRange";
export { NetPyNECoordsRange };

import NetPyNEField from "./general/NetPyNEField";
export { NetPyNEField };

import NetPyNEInstantiated from "./instantiation/NetPyNEInstantiated";
export { NetPyNEInstantiated };

import _LayoutManager from "./layout/LayoutManager";
export const LayoutManager = connect(
  state => state.flexlayout,
  dispatch => ({
    minimizeWidget: id => dispatch(minimizeWidget(id)),
    destroyWidget: id => dispatch(destroyWidget(id)),
    maximizeWidget: id => dispatch(maximizeWidget(id)),
    activateWidget: id => dispatch(activateWidget(id))
  })
)(_LayoutManager);

import _NetPyNEPlots from "./definition/plots/NetPyNEPlots";
export const NetPyNEPlots = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEPlots
);

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

import NetPyNESimConfig from "./definition/configuration/NetPyNESimConfig";
export { NetPyNESimConfig };


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

import _NetPyNEStimulationTargets from "./definition/stimulationTargets/NetPyNEStimulationTargets";
export const NetPyNEStimulationTargets = PythonControlledCapability.createPythonControlledComponent(
  _NetPyNEStimulationTargets
);

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

import _NetPyNETabs from "./settings/NetPyNETabs";
export const NetPyNETabs = connect(
  state => state.general,
  dispatch => ({
    editModel: () => dispatch(editModel),
    createNetwork: () => dispatch(createNetwork),
    createAndSimulateNetwork: () => dispatch(createAndSimulateNetwork),
    showNetwork: () => dispatch(showNetwork)
  })
)(_NetPyNETabs);


import NetPyNEThumbnail from "./general/NetPyNEThumbnail";
export { NetPyNEThumbnail };

import _NetPyNEToolbar from "./settings/NetPyNEToolBar";
export const NetPyNEToolBar = connect(
  state => state.general
)(_NetPyNEToolbar);

import SelectField from "./general/Select";
export const NetPyNESelectField = connect((state, ownProps) => ({
  ...ownProps,
  updates: String(state.general.updates)
}))(PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(
  SelectField
));

import TextField from "@material-ui/core/TextField";
export const NetPyNETextField = PythonControlledCapability.createPythonControlledControl(
  TextField
);

import _NetPyNEInclude from './definition/plots/NetPyNEInclude';
export const NetPyNEInclude = connect(
  (state, ownProps) => ({ ...ownProps, updates: state.general.updates }),
  null
)(_NetPyNEInclude);