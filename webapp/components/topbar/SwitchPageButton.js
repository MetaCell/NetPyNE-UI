import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Icon from '../general/NetPyNEIcons'
import { TOPBAR_CONSTANTS, MODEL_STATE } from '../../constants'


const styles = ({ palette, shape, spacing, typography }) => ({ 
  container: {},
  button: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: '1rem',
    borderRadius: 0
  },
  icon: { color: palette.common.white },
})


class SwitchPageButton extends Component {

  handleClick = event => {
    const instantiate = this.props.automaticInstantiation && this.props.modelState != MODEL_STATE.INSTANTIATED;
    if (!this.props.editModelPage) {
      this.props.switchToEditModelPage();
    } else {
      if (instantiate && this.props.automaticSimulation) {
        this.props.createAndSimulateNetwork();
      } else if (instantiate) {
        this.props.createNetwork();
      } else {
        this.props.showNetwork();
      }
    }
  };

  render () {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <Button
          variant="contained"
          size="small"
          className={classes.button}
          onClick={this.handleClick.bind(this)}
          endIcon={<Icon name={this.props.editModelPage ? "rocket" : "pencil"} selected={false}/>}
        >
          {this.props.editModelPage ? this.getExploreLabel() : TOPBAR_CONSTANTS.BACK_TO_EDITION}
        </Button>
      
      </div>
    )
  }

  getExploreLabel () {
   
    const { automaticInstantiation, automaticSimulation } = this.props;
    const instantiate = automaticInstantiation || this.props.modelState == MODEL_STATE.NOT_INSTANTIATED;
    if (instantiate && automaticSimulation) {
      return TOPBAR_CONSTANTS.CREATE_AND_SIMULATE_NETWORK
    } 
    if (instantiate) {
      return TOPBAR_CONSTANTS.CREATE_NETWORK;
    } 
    if (automaticSimulation) {
      console.debug("Bad option combination: can't auto simulate without auto instantiate")
    }
    return TOPBAR_CONSTANTS.EXPLORE_EXISTING_NETWORK;
  }
}
export default withStyles(styles)(SwitchPageButton)