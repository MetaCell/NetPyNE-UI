import { connect } from 'react-redux';
import NetPyNEInclude from '../../components/definition/plots/NetPyNEInclude';

const mapStateToProps = (state, ownProps) => ({ 
  ...ownProps,
  updates: state.general.updates
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NetPyNEInclude);