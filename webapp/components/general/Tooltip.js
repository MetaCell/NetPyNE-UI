import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles';
import { bgDark } from '../../theme'
const tooltipStyle = makeStyles(({ palette, typography }) => ({
  arrow: { color: bgDark, },
  tooltip: { backgroundColor: bgDark, fontSize: typography.subtitle1.fontSize },
}));

export default function CustomTooltip (props) {
  const classes = tooltipStyle();

  return <Tooltip arrow classes={classes} enterDelay={200} enterTouchDelay={200} {...props} />;
}