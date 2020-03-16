import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import Dimensions from '../../components/definition/populations/Dimensions';

const mapStateToProps = (state, ownProps) => ({ ...ownProps });

const mapDispatchToProps = dispatch => ({ updateCards: () => dispatch(updateCards) });

export default connect(mapStateToProps, mapDispatchToProps)(Dimensions);