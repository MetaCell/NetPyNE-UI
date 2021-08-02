import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Tooltip } from 'netpyne/components';
import Icon from '../general/NetPyNEIcons';
import { TOPBAR_CONSTANTS, MODEL_STATE } from '../../constants';
import SplitButton from '../general/SplitButton';

const styles = ({
  palette,
  shape,
  spacing,
  typography,
}) => ({
  container: {
    display: 'flex',
    '& .MuiButton-root': {
      borderRadius: 0,
    },
  },
  button: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: '1rem',
    borderRadius: 0,
  },
  rocket: { marginRight: spacing(1) },
  icon: { color: palette.common.white },
});

const CREATE_NETWORK = 'CREATE NETWORK';
const CREATE_AND_SIMULATE = 'CREATE AND SIMULATE';
const SIMULATE = 'SIMULATE';
const BACK_TO_EDIT = 'BACK TO EDIT';

const editOptions = [CREATE_NETWORK, CREATE_AND_SIMULATE, SIMULATE];
const exploreOptions = [SIMULATE, CREATE_AND_SIMULATE];

class SwitchPageButton extends Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (selectedOption) => {
    const instantiate = this.props.modelState === MODEL_STATE.NOT_INSTANTIATED;
    if (selectedOption === CREATE_NETWORK) {
      if (instantiate) {
        this.props.createNetwork();
      } else {
        this.props.showNetwork();
      }
    } else if (selectedOption === SIMULATE) {
      this.props.simulateNetwork();
    } else if (selectedOption === CREATE_AND_SIMULATE) {
      this.props.createAndSimulateNetwork();
    } else if (selectedOption === BACK_TO_EDIT) {
      this.props.switchToEditModelPage();
    } else {
      this.props.showNetwork();
    }
  };

  getExploreLabel () {
    const {
      automaticInstantiation,
      automaticSimulation,
    } = this.props;
    const instantiate = automaticInstantiation || this.props.modelState === MODEL_STATE.NOT_INSTANTIATED;
    if (instantiate && automaticSimulation) {
      return TOPBAR_CONSTANTS.CREATE_AND_SIMULATE_NETWORK;
    }
    if (instantiate) {
      return TOPBAR_CONSTANTS.CREATE_NETWORK;
    }
    if (automaticSimulation) {
      console.debug('Bad option combination: can\'t auto simulate without auto instantiate');
    }
    return TOPBAR_CONSTANTS.EXPLORE_EXISTING_NETWORK;
  }

  render () {
    const {
      classes,
      modelState,
      editModelPage,
      simulateNetwork,
    } = this.props;
    const disableSimulate = modelState === MODEL_STATE.SIMULATED;
    return (
      <div className={classes.container}>
        {editModelPage
          ? <SplitButton options={editOptions} handleClick={(selectedOption) => this.handleClick(selectedOption)} />
          : (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={() => this.handleClick(BACK_TO_EDIT)}
                startIcon={<Icon name="pencil" selected={false} />}
              >
                {TOPBAR_CONSTANTS.BACK_TO_EDITION}
              </Button>
              <SplitButton
                options={exploreOptions}
                handleClick={(selectedOption) => this.handleClick(selectedOption)}
                icon={(
                  <span style={{ marginRight: '5px' }}>
                    <Icon name="rocket" />
                  </span>
                )}
              />
            </>
          )}
      </div>
    );
  }
}

export default withStyles(styles)(SwitchPageButton);
