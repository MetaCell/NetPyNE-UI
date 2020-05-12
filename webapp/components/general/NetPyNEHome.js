import React from 'react';
import Icon from '@material-ui/core/Icon';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ spacing, palette }) => ({
  rightArrow : { marginLeft: spacing(1) },
  home: { },
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: { color: palette.common.white, fontSize: 40 }
}))


export default ({ handleClick, selection }) => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <div
        data-tooltip={selection ? "Unselect" : undefined}
        onClick={ event => {
          event.stopPropagation()
          handleClick()
        }}
      >
        <Icon
          classes={{ root: classes.icon }}
          className="fa fa-home"
        />
      </div>
      
      <NavigationChevronRight className={classes.rightArrow} color="disabled"/>
    </div>
  )
  
}

const styles = {}
