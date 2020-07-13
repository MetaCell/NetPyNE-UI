import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteDialogBox from './DeleteDialogBox';
import Icon from '@material-ui/core/Icon';
import Tooltip from './Tooltip'
const styles = { 
  btn: { borderRadius: '25px', margin: '8px' },
  cog: {
    zIndex:10,
    marginTop:37,
    marginLeft:38,
    position:"absolute",
    color: 'white'
  }
};

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

  handleDialogBox (actionConfirmed) {
    if (this.props.handleClick && actionConfirmed) {
      // this.props.deleteMethod(this.props.name);
      this.props.deleteNetParamsObj({ paramPath: this.props.paramPath, paramName: this.props.name })
      this.props.onDelete && this.props.onDelete()
    }
    this.setState({ dialogOpen: false });
  }

  getCommonProps () {
    return {
      id: this.props.name,
      color: this.props.selected ? 'primary' : 'secondary',
      onClick: () => this.handleClick(),
      onMouseEnter: () => this.setState({ isHovered: true }),
      onMouseLeave: () => this.setState({ isHovered: false }),
    }
  }
  render () {
    const { name, selected, isButton = false, isCog = false } = this.props;
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

    const props = this.getCommonProps()
    return (
      <div>
        {getButton(isCog, isButton, label, selected, isHovered, name, props)}
        <DeleteDialogBox
          open={dialogOpen}
          onDialogResponse={this.handleDialogBox}
          textForDialog={name} />
      </div>
    );
  }
}

const getButton = (isCogButton, isRegularButton, label, selected, isHovered, tooltip, props) => {
  if (isCogButton) {
    return getCogButton(label, selected, isHovered, tooltip, props)
  }
  if (isRegularButton) {
    return getRegularButton(label, selected, isHovered, tooltip, props)
  }
  return getFabButton(label, selected, isHovered, tooltip, props)
}

const getCogButton = (label, selected, isHovered, tooltip, others) => (
  <Tooltip title={tooltip} placement="top">
    <IconButton
      className={"gearThumbButton " + (selected ? "selectedGearButton" : "")}
      {...others}
    >
      <div>
        {(isHovered && selected) 
          ? <Icon className="fa fa-trash-o" style={styles.cog}/> 
          : <span className="gearThumbLabel">
            {label}
          </span>
        
        }
        <Icon color="primary" className="gpt-fullgear"/>
      </div>
    </IconButton> 
  </Tooltip>
  
)

const getRegularButton = (label, selected, isHovered, tooltip, others) => (
  <Tooltip title={tooltip} placement="top">
    <Button
      variant="contained"
      style={ styles.btn }
      className={"rectangularActionButton " + (selected ? "selectedRectangularActionButton " : "")} 
      {...others}
    >
      {(isHovered && selected) ? <Icon className="fa fa-trash-o"/> : label}
    </Button>
  </Tooltip>
  
)

const getFabButton = (label, selected, isHovered, tooltip, others) => (
  <Tooltip title={tooltip} placement="top">
    <Fab 
      className={"actionButton " + (selected ? "selectedActionButton" : "")} 
      {...others}
    >
      {(isHovered && selected) ? <Icon className="fa fa-trash-o"/> : label}
    </Fab>
  </Tooltip>
  
)