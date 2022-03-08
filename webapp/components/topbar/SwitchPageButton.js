import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '../general/NetPyNEIcons';
import { TOPBAR_CONSTANTS, MODEL_STATE } from '../../constants';
import SplitButton from '../general/SplitButton';

const styles = ({
  palette,
  spacing,
}) => ({
  container: {
    display: 'flex',
    height: '100%',
    '& .MuiButton-root': {
      borderRadius: 0,
      marginBottom: 0,
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
const BACK_TO_EXPLORER = 'BACK TO EXPLORER';
const UPDATE_NETWORK = 'UPDATE NETWORK';

const editOptions = [CREATE_NETWORK, CREATE_AND_SIMULATE, SIMULATE];
const instantiatedEditOptions = [UPDATE_NETWORK, CREATE_AND_SIMULATE, SIMULATE];
const exploreOptions = [SIMULATE, CREATE_AND_SIMULATE];

class SwitchPageButton extends Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (selectedOption) => {
    if (selectedOption === CREATE_NETWORK || selectedOption === UPDATE_NETWORK) {
      this.props.createNetwork();
    } else if (selectedOption === SIMULATE) {
      if (this.props.experimentInDesign) {
        this.props.openLaunchDialog();
      } else {
        this.props.simulateNetwork();
      }
    } else if (selectedOption === CREATE_AND_SIMULATE) {
      if (this.props.experimentInDesign) {
        this.props.openLaunchDialog();
      } else {
        this.props.createAndSimulateNetwork();
      }
    } else if (selectedOption === BACK_TO_EDIT) {
      this.props.switchToEditModelPage();
    } else {
      this.props.showNetwork();
    }
  };

  render () {
    const {
      classes,
      editModelPage,
      modelState
    } = this.props;
    const instantiated = modelState == MODEL_STATE.INSTANTIATED ;
    return (
      <div className={classes.container}>
        {editModelPage
          ? (
            <>
              <Button
                  variant="contained"
                  onClick={() => this.handleClick(BACK_TO_EXPLORER)}
                  startIcon={<Icon name="pencil" selected={false} />}
                  disabled={!instantiated}
                >
                { TOPBAR_CONSTANTS.BACK_TO_EXPLORER }
              </Button>
              <SplitButton
                options={instantiated ? instantiatedEditOptions : editOptions }
                handleClick={(selectedOption) => this.handleClick(selectedOption)}
                icon={(
                  <span style={{ marginRight: '5px' }}>
                    <Icon name="rocket" />
                  </span>
                )}
                skipIconFor={ CREATE_NETWORK }
              />
            </>
          )
          : (
            <>
              <Button
                variant="contained"
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
