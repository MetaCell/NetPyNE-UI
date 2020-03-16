import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNEPopulation from '../../components/definition/populations/NetPyNEPopulation';

const mapStateToProps = (state, ownProps) => ({ ...ownProps });

const mapDispatchToProps = dispatch => ({ updateCards: () => dispatch(updateCards) });

export default connect(mapStateToProps, mapDispatchToProps)(NetPyNEPopulation);