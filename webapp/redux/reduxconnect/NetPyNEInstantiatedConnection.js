import { connect } from 'react-redux';
import { modelLoaded } from '../actions/general';
import NetPyNEInstantiated from '../../components/instantiation/NetPyNEInstantiated';

const mapStateToProps = (state, ownProps) => ({ 
  ...ownProps,
  updates: state.general.updates
});

const mapDispatchToProps = dispatch => ({ modelLoaded: dispatch(modelLoaded) });

export default connect(mapStateToProps, mapDispatchToProps)(NetPyNEInstantiated);