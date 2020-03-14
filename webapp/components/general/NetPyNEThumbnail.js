import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import DeleteDialogBox from './DeleteDialogBox';
import Icon from '@material-ui/core/Icon';

export default class NetPyNEThumbnail extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isHovered: false,
      dialogOpen: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleDialogBox = this.handleDialogBox.bind(this);
  }

  handleClick () {
    if (this.props.handleClick) {
      if (this.props.selected && this.state.isHovered) {
        this.setState({ dialogOpen: true });
      } else {
        this.props.handleClick(this.props.name, true);
      }
    }
  }

  handleDialogBox (response) {
    if (this.props.handleClick && response) {
      this.props.deleteMethod(this.props.name);
    }
    this.setState({ dialogOpen: false });
  }

  render () {
    const { name, selected } = this.props;
    const { dialogOpen, isHovered } = this.state;

    let label;
    if (isHovered && selected) {
      label = ""
    } else {
      if (name.length > 14) {
        label = name.slice(0,11) + "..."
      } else {
        label = name
      }
    }
    return (
      <div>
        <Fab 
          id={name}
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
          data-tooltip={isHovered && name.length > 14 ? name : undefined}
          className={"actionButton " + (selected ? "selectedActionButton" : "")} 
          onClick={() => this.handleClick()}
          color={selected ? "secondary" : "primary"}
        >
          {(this.state.isHovered && selected) ? <Icon className="fa fa-trash-o"/> : label}
        </Fab>
        <DeleteDialogBox
          open={dialogOpen}
          onDialogResponse={this.handleDialogBox}
          textForDialog={name} />
      </div>
    );
  }
}
