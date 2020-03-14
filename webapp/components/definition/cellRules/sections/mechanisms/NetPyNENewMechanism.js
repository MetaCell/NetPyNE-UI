import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NavigationMoreHoriz from '@material-ui/icons/MoreHoriz';
import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Utils from '../../../../../Utils';
import ContentAdd from '@material-ui/icons/Add'

const styless = ({ spacing, palette }) => ({ 
  icon : { color: palette.primary.main },
  disabledIcon : { color: '#d1d1d1', cursor: 'auto' }, 
})


const hoverColor = '#66d2e2';
// const changeColor = 'rgb(0, 188, 212)';

const styles = {
  anchorOrigin: {
    horizontal: 'left', 
    vertical: 'bottom'
  },
  anchorTarget: {
    horizontal: 'left',
    vertical: 'top'
  },
  color: 'white'
};

class NetPyNENewMechanism extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      open: false,
      mechanisms: []
    };
  }
  
  componentDidMount () {
    Utils.evalPythonMessage("netpyne_geppetto.getAvailableMechs", [])
      .then(response => {
        this.setState({ mechanisms: response })
      })
  }
  
  handleClick = event => {
    this.setState({ open: false });
    this.props.handleClick(event.target.innerText);
  };

  handleButtonClick = anchor => {
    const { blockButton, handleHierarchyClick } = this.props;
    if (!blockButton) {
      this.setState({ open: true, anchorEl: anchor })
    }
    handleHierarchyClick();
  };

  createTooltip (){
    const { disabled, blockButton } = this.props;
    if (disabled) {
      return ""
    } else {
      if (blockButton) {
        return "Explore mechanisms" 
      } else {
        return "Add new mechanism"
      }
    }
  }

  createLabel (){
    const { disabled, blockButton } = this.props;
    if (disabled) {
      return ""
    } else {
      if (blockButton) {
        return <NavigationMoreHoriz style={{ position: 'absolute', color: 'white', top: '15px', left: '15px' }}/>
      } else {
        return <ContentAdd style={{ position: 'absolute', color: 'white', top: '15px', left: '15px' }}/>
      }
    }
  }
  render () {
    const { disabled, classes } = this.props;
    const { open, anchorEl, mechanisms } = this.state;
    const tooltip = disabled ? {} : { 'data-tooltip': this.createTooltip() }
    return (
      <div>
        <div
          id="newMechButton"
          className={disabled ? classes.disabledIcon : classes.icon}
          onClick={ e => !disabled && this.handleButtonClick(e.currentTarget) }
          {...tooltip}
        >
          <div>
            <i 
              style={{ fontSize: '56px' }}
              className="gpt-fullgear"
            />
            {this.createLabel()}
          </div>
          
        </div>
      

        <Menu 
          open={open} 
          anchorEl={anchorEl}
          onClose={ () => this.setState({ open: false }) }
        >
          {mechanisms.map( mechLabel => 
            <MenuItem 
              id={mechLabel}
              key={mechLabel}
              value={mechLabel}
              onClick={ (event, index) => this.handleClick(event) }
            >
              {mechLabel}
            </MenuItem>
          )}
        </Menu>
      </div>
    )
  }
}

export default withStyles(styless)(NetPyNENewMechanism)