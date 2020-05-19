import React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '../general/Tooltip'
const useStyles = makeStyles(({ spacing, palette }) => ({
  home: { },
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: { fontSize: 40, fontWeight: 'bold', textAlign: 'center' }
}))


export default ({ handleClick, selection }) => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Tooltip title={selection ? "Unselect" : ''} placement="top">
        <div
          onClick={ event => {
            event.stopPropagation()
            handleClick()
          }}
        >
          <Icon
            color="primary"
            classes={{ root: classes.icon }}
            className="fa fa-angle-right"
          />
        </div>
      </Tooltip>
      <Icon
        color="disabled"
        className="fa fa-angle-right breadcrumb-spacer"
      />
     
    </div>
  )
  
}

const styles = {}
