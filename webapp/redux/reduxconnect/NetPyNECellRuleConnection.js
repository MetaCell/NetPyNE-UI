import { connect } from 'react-redux';
import { updateCards } from '../actions/general';
import NetPyNECellRule from '../../components/definition/cellRules/NetPyNECellRule';

const mapStateToProps = (state, ownProps) => ({ 
  ...ownProps,
  updates: state.general.updates
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NetPyNECellRule);