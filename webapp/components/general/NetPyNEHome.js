import React from 'react';
import FontIcon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import pink from '@material-ui/core/colors/pink';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';

const pink400 = pink[400];

export default ({ handleClick, selection }) => (
  <span>
    <IconButton
      style={styles.home.container}
      data-tooltip={selection ? "Unselect" : undefined}
      color='secondary'
      onClick={ () => handleClick()}
    >
      <FontIcon className="fa fa-home customHome"/>
    </IconButton>
    <NavigationChevronRight style={styles.rightArrow}/>
  </span>
)

const styles = {
  rightArrow : {
    float: 'left',
    color: 'grey',
    fontSize: "20px",
    marginLeft: '15px',
    marginTop: '7px',
  },
  home: {
    container : {
      float: 'left',
      height: '36px',
      width: '36px',
      padding: '0px'
    },
    icon: {
      width: '36px',
      height: '36px'
    }
  }
}
