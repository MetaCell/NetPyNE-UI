import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';

const ParameterMenu = (props) => {
  const {
    parameter, index, removeFromGroup, addToGroup, removeParameter,
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-haspopup="true" aria-controls={`${parameter.name}-simple-menu-${index}`} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`${parameter.name}-simple-menu-${index}`}
        anchorEl={anchorEl}
        keepMounted
        classes={{ paper: 'MuiPopover-experiment' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClick={handleClose}
      >
        { parameter.inGroup
          ? <MenuItem onClick={() => removeFromGroup(index)}>Remove from group</MenuItem>
          : <MenuItem onClick={() => addToGroup(index)}>Add to Group</MenuItem>}
        <MenuItem onClick={() => removeParameter(index, parameter)}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default ParameterMenu;
