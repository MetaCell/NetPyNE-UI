import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNEStimulationSources from '../../components/definition/stimulationSources/NetPyNEStimulationSources';

const PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
const PythonControlledNetPyNEStimulationSources = PythonControlledCapability.createPythonControlledComponent(NetPyNEStimulationSources);

const mapStateToProps = (state, ownProps) => ({ ...ownProps });

const mapDispatchToProps = dispatch => ({ updateCards: () => dispatch(updateCards) });

export default connect(mapStateToProps, mapDispatchToProps)(PythonControlledNetPyNEStimulationSources);