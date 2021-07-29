import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
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
  container: {},
  button: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: '1rem',
    borderRadius: 0,
  },
  rocket: { marginRight: spacing(1) },
  icon: { color: palette.common.white },
});

const editOptions = ["Create network", "Create and simulate", "Simulate"];
const exploreOptions = ["Simulate", "Back to edit"];

class SwitchPageButton extends Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (selectedOption) => {
    const instantiate = this.props.automaticInstantiation || this.props.modelState === MODEL_STATE.NOT_INSTANTIATED;
    if(selectedOption === editOptions[2]){
      this.props.simulateNetwork();
    }
    else if (!this.props.editModelPage) {
      this.props.switchToEditModelPage();
    } else if (instantiate && this.props.automaticSimulation) {
      this.props.createAndSimulateNetwork();
    } else if (instantiate) {
      this.props.createNetwork();
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
        {editModelPage ? 
          <SplitButton options={editOptions} handleClick={(selectedOption) => this.handleClick(selectedOption)}/> :
          <SplitButton options={exploreOptions} handleClick={(selectedOption) => this.handleClick(selectedOption)} icon={<>
              <Tooltip
                title={disableSimulate ? 'You have already simulated the network' : 'Simulate the network'}
                placement="left"
              >
                <span style={{ marginLeft: '5px', opacity: (disableSimulate ? 0.5 : 1) }}>
                  <Icon name="rocket"/>
                </span>
              </Tooltip>
            </>}
          />
        }
      </div>
    );
  }
}

export default withStyles(styles)(SwitchPageButton);
