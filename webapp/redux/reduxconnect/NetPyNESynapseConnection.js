import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNESynapse from '../../components/definition/synapses/NetPyNESynapse';

const mapStateToProps = (state, ownProps) => ({ ...ownProps });

const mapDispatchToProps = dispatch => ({ updateCards: () => dispatch(updateCards) });

export default connect(mapStateToProps, mapDispatchToProps)(NetPyNESynapse);