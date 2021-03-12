import React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from './Tooltip';

import { ArrowRightIcon } from './NetPyNEIcons';

const useStyles = makeStyles(({ spacing, palette }) => ({
  home: { },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default ({ handleClick, selection }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tooltip title={selection ? 'Unselect' : ''} placement="top">
        <div
          onClick={(event) => {
            event.stopPropagation();
            handleClick();
          }}
        >
          <ArrowRightIcon color="primary" />
        </div>
      </Tooltip>
      <ArrowRightIcon fontSize="inherit" className="breadcrumb-spacer" color="inherit" />

    </div>
  );
};

const styles = {};
