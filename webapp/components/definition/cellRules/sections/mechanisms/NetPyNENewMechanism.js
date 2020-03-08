import React from 'react';
import Menu from '@material-ui/core/Menu';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ContentAdd from '@material-ui/icons/Add';
import NavigationMoreHoriz from '@material-ui/icons/MoreHoriz';

import Utils from '../../../../../Utils';

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

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

export default class NetPyNENewMechanism extends React.Component {

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
      return "No section selected"
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
        return <NavigationMoreHoriz />
      } else {
        return <ContentAdd/>
      }
    }
  }
  render () {
    const { disabled } = this.props;
    const { open, anchorEl, mechanisms } = this.state;
    
    return <div>
      <IconButton
        data-tooltip={this.createTooltip()}
        id="newMechButton"
        className="gearAddButton"
        color='primary'
        disabled={disabled}
        onClick={ e => this.handleButtonClick(e.currentTarget) }
      >
        <i 
          style={{ position: 'absolute', color: changeColor }}
          className="gpt-fullgear"
        />
        { this.createLabel() }
      </IconButton>

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
  }
}
