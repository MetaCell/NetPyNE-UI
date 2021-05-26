import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DeleteDialogBox from './DeleteDialogBox';
import Tooltip from './Tooltip';

const styles = {
  btn: { borderRadius: '25px', margin: '8px' },
  cog: {
    zIndex: 10,
    marginTop: 37,
    marginLeft: 38,
    position: 'absolute',
    color: 'white',
  },
  toolbar: {

    fontSize: '0.7em',
    zIndex: 1000,

  },
};

export default class NetPyNEThumbnail extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dialogOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDialogBox = this.handleDialogBox.bind(this);
  }

  handleClick () {
    if (this.props.handleClick) {
      this.props.handleClick(this.props.name, true);
    }
  }

  handleDialogBox (actionConfirmed) {
    const {
      handleClick, paramPath, name, onDelete, deleteNetParamsObj,
    } = this.props;
    if (handleClick && actionConfirmed) {
      // this.props.deleteMethod(this.props.name);
      deleteNetParamsObj({
        paramPath,
        paramName: name,
      });
      if (onDelete) {
        onDelete();
      }
    }
    this.setState({ dialogOpen: false });
  }

  getCommonProps () {
    return {
      id: this.props.name,
      color: this.props.selected ? 'primary' : 'secondary',
      onClick: () => this.handleClick(),
    };
  }

  render () {
    const {
      name, selected, isButton = false, isCog = false,
    } = this.props;
    const { dialogOpen } = this.state;

    let label;
    if (name.length > 14) {
      label = `${name.slice(0, 11)}...`;
    } else {
      label = name;
    }

    const props = this.getCommonProps();
    return (
      <Box position="relative">
        <Tooltip position="bottom" title={<HoverActions deleteAction={() => this.setState({ dialogOpen: true })} />} interactive>
          {getButton(isCog, isButton, label, selected, props)}
        </Tooltip>
        <DeleteDialogBox
          open={dialogOpen}
          onDialogResponse={this.handleDialogBox}
          textForDialog={name}
        />
      </Box>
    );
  }
}

const getButton = (isCogButton, isRegularButton, label, selected, tooltip, props) => {
  if (isCogButton) {
    return getCogButton(label, selected, tooltip, props);
  }
  if (isRegularButton) {
    return getRegularButton(label, selected, tooltip, props);
  }
  return getFabButton(label, selected, tooltip, props);
};

const HoverActions = ({ deleteAction }) => (
  <Box style={styles.toolbar}>
    <Tooltip title="Delete item" placement="top">
      <IconButton size="small" onClick={deleteAction}>
        <Icon fontSize="inherit" className="fa fa-trash-o" />
      </IconButton>
    </Tooltip>
  </Box>

);

const getCogButton = (label, selected, others) => (

  <IconButton
    className={`gearThumbButton ${selected ? 'selectedGearButton' : ''}`}
    {...others}
  >
    <div>

      <span className="gearThumbLabel">
        {label}
      </span>
      <Icon color="primary" className="gpt-fullgear" />
    </div>
  </IconButton>

);

const getRegularButton = (label, selected, others) => (

  <Button
    variant="contained"
    style={styles.btn}
    className={`rectangularActionButton ${selected ? 'selectedRectangularActionButton ' : ''}`}
    {...others}
  >

    {label}
  </Button>

);

const getFabButton = (label, selected, others) => (

  <Fab
    className={`actionButton ${selected ? 'selectedActionButton' : ''}`}
    {...others}
  >
    {label}
  </Fab>

);
