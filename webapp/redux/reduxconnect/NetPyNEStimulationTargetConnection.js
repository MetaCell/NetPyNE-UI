import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNEStimulationTarget from '../../components/definition/stimulationTargets/NetPyNEStimulationTarget';

const mapStateToProps = (state, ownProps) => ({ 
  ...ownProps,
  updates: state.general.updates
});

const mapDispatchToProps = dispatch => ({ updateCards: () => dispatch(updateCards) });

export default connect(mapStateToProps, mapDispatchToProps)(NetPyNEStimulationTarget);