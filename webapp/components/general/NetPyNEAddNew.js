import React, { Component } from 'react';
import ContentAdd from '@material-ui/icons/Add';
import FloatingActionButton from '@material-ui/core/Fab';

export default class NetPyNEAddNew extends React.Component {

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
    return (
      <FloatingActionButton 
        id={this.props.id}
        style={styles.add}
        onClick={this.handleClick}
        data-tooltip="Create rule"
        className={"actionButton smallActionButton"}
      >
        <ContentAdd />
      </FloatingActionButton>
    );
  }
}


const styles = {
  add: {
    marginTop: "15px",
    float: "left",
    textAlign: 'center'
  }
}