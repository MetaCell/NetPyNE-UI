import React from 'react';
import {
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import {
  fontColor,
  primaryColor,
} from '../../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    marginBottom: theme.spacing(1),
  },
  bottom: {
    color: fontColor,
  },
  top: {
    color: primaryColor,
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

const CircularLoader = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={40}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
      />
    </div>
  );
};

export default CircularLoader;
