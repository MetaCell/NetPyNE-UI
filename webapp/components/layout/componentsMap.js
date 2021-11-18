/* eslint-disable quote-props */
import * as React from 'react';
import {
  HTMLViewer,
  NetPyNEInstantiated,
  NetPyNESynapses,
  NetPyNEConnectivityRules,
  NetPyNECellRules,
  NetPyNEStimulationSources,
  NetPyNEStimulationTargets,
  NetPyNESimConfig,
  NetPyNEPopulations,
  NetPyNEPlots,
  NetPyNEPythonConsole,
  ExperimentManager,
} from '..';

/**
 * Key of the component is the `component` attribute of the widgetConfiguration.
 * This map is used inside the LayoutManager to know which component to display for a given widget.
 */

const componentMap = {
  'PythonConsole': NetPyNEPythonConsole,
  'D3Canvas': NetPyNEInstantiated,
  'Plot': HTMLViewer,
  'popParams': NetPyNEPopulations,
  'cellParams': NetPyNECellRules,
  'synMechParams': NetPyNESynapses,
  'connParams': NetPyNEConnectivityRules,
  'stimSourceParams': NetPyNEStimulationSources,
  'stimTargetParams': NetPyNEStimulationTargets,
  'simConfig': NetPyNESimConfig,
  'analysis': NetPyNEPlots,
  'experimentManager': ExperimentManager,
};

export default componentMap;
