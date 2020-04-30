import React, { Component } from 'react';
import ContentAdd from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';

const styles = ({ spacing, palette }) => ({
  root : { 
    marginLeft: spacing(1),
    minWidth: 56
  },
  plus:{ color: palette.common.white }
})

class NetPyNEAddNew extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    if (this.props.handleClick) {
      this.props.handleClick();
    }
  }

  render () {
    const { classes } = this.props
    return (
      <Fab 
        id={this.props.id}
        onClick={this.handleClick}
        data-tooltip="Create rule"
        color='primary'
        className={classes.root}
      >
        <ContentAdd className={classes.plus}/>
      </Fab>
    );
  }
}

export default withStyles(styles)(NetPyNEAddNew)