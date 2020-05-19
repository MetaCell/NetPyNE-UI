import React, { Component } from 'react'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";


import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import { TOPBAR_CONSTANTS } from '../../constants'


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
    if (!this.props.editModelPage) {
      this.props.switchToEditModelPage();
    } else {
      switch (this.props.pageTransitionMode) {
      case TOPBAR_CONSTANTS.CREATE_AND_SIMULATE_NETWORK:{
        this.props.createAndSimulateNetwork();
        break;
      }
      case TOPBAR_CONSTANTS.CREATE_NETWORK:{
        this.props.createNetwork();
        break;
      }
      case TOPBAR_CONSTANTS.EXPLORE_EXISTING_NETWORK:{
        this.props.showNetwork();
        break
      }
      default:
        break
      }
    }
  };

  render () {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={this.handleClick.bind(this)}
          endIcon={<Icon className={this.props.editModelPage ? "fa fa-rocket" : "fa fa-pencil"}/>}
        >
          {this.props.editModelPage ? this.props.pageTransitionMode : TOPBAR_CONSTANTS.BACK_TO_EDITION}
        </Button>
      
      </div>
    )
  }
}
export default withStyles(styles)(SwitchPageButton)