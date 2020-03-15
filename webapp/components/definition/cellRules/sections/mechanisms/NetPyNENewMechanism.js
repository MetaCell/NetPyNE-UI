import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NavigationMoreHoriz from '@material-ui/icons/MoreHoriz';
import { withStyles } from '@material-ui/core/styles'
import Utils from '../../../../../Utils';
import ContentAdd from '@material-ui/icons/Add'

const styles = ({ spacing, palette }) => ({ 
  icon : { color: palette.primary.main },
  disabledIcon : { color: '#d1d1d1', cursor: 'auto' },
  iconContent: { position: 'absolute', color: 'white', top: '17px', left: '17px' },
})

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

  createLabel (classes){
    const { disabled, blockButton } = this.props;
    if (disabled) {
      return ""
    } else {
      if (blockButton) {
        return <NavigationMoreHoriz className={classes.iconContent}/>
      } else {
        return <ContentAdd className={classes.iconContent}/>
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
            {this.createLabel(classes)}
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

export default withStyles(styles)(NetPyNENewMechanism)