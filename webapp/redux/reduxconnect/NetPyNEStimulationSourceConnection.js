import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNEStimulationSource from '../../components/definition/stimulationSources/NetPyNEStimulationSource';

const mapStateToProps = (state, ownProps) => ({ ...ownProps });

const mapDispatchToProps = dispatch => ({ updateCards: () => dispatch(updateCards) });

export default connect(mapStateToProps, mapDispatchToProps)(NetPyNEStimulationSource);