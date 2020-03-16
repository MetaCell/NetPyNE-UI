import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNEPopulations from '../../components/definition/populations/NetPyNEPopulations';

const PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
const PythonControlledNetPyNEPopulations = PythonControlledCapability.createPythonControlledComponent(NetPyNEPopulations);

const mapStateToProps = (state, ownProps) => ({ ...ownProps });

const mapDispatchToProps = dispatch => ({ updateCards: () => dispatch(updateCards), });

export default connect(mapStateToProps, mapDispatchToProps)(PythonControlledNetPyNEPopulations);