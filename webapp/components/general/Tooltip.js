import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles';

const tooltipStyle = makeStyles(({ palette, typography }) => ({
  arrow: { color: palette.common.black, },
  tooltip: { backgroundColor: palette.common.black, fontSize: typography.subtitle1.fontSize },
}));

export default function CustomTooltip (props) {
  const classes = tooltipStyle();

  return <Tooltip arrow classes={classes} {...props} />;
}