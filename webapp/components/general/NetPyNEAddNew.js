import React, { Component } from 'react';
import ContentAdd from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from './Tooltip'

const styles = ({ spacing, palette }) => ({
  root : { marginLeft: spacing(1), },
  plus:{ color: palette.common.white }
})

class NetPyNEAddNew extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (event) {
    if (this.props.handleClick) {
      event.stopPropagation()
      this.props.handleClick();
    }
  }

  render () {
    const { classes } = this.props
    return (
      <Tooltip title="Create rule" placement="top">
        <Fab 
          size="small"
          color='primary'
          id={this.props.id}
          className={classes.root}
          onClick={this.handleClick}
        >
          <ContentAdd className={classes.plus}/>
        </Fab>
      </Tooltip>
      
    );
  }
}

export default withStyles(styles)(NetPyNEAddNew)