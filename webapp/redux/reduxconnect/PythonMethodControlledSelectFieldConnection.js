import { connect } from 'react-redux';
import SelectField from '../../components/general/Select';

const PythonControlledCapability = require('geppetto-client/js/communication/geppettoJupyter/PythonControlledCapability');
const PythonMethodControlledSelectField = PythonControlledCapability.createPythonControlledControlWithPythonDataFetch(SelectField);

const mapStateToProps = (state, ownProps) => ({ 
  ...ownProps,
  updates: String(state.general.updates)
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PythonMethodControlledSelectField);