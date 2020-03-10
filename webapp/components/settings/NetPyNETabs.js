import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import NavigationExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default class NetPyNETabs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      simulateTabLabel: 'Create network',
      label: 'define',
      transitionOptionsHovered: false,
      anchorEl: null
    }

    this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.label != prevProps.label) {
      this.setState({ label:this.props.label });
    }
  }

  handleTransitionOptionsChange (e, v) {
    this.props.handleTransitionOptionsChange(e.target.innerText)
    this.setState({ simulateTabLabel: e.target.innerText, anchorEl: null });
  }

  getLabelStyle (label) {
    var style = { color: 'white', fontWeight: 400 }
    if (label == this.state.label) {
      style['fontWeight'] = 600;
    }
    return style;
  }

  getBackgroundStyle (label) {
    var color = 'primary';
    if (label == this.state.label || (label == 'simulate' && this.state.transitionOptionsHovered)) {
      color = 'secondary';
    }
    return color;
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render () {

    return <div style={{ width: '100%', alignItems: 'center', display: 'flex' }}>
      <Button 
        id={"defineNetwork"} 
        onClick={() => this.props.handleChange('define')} 
        style={{ flex: 1, borderRadius: 10, marginLeft: 5, ...this.getLabelStyle('define') }} 
        color={this.getBackgroundStyle('define')} 
      >
        {'Define your Network'}
      </Button>

      <Button 
        id={"simulateNetwork"} 
        onClick={() => this.props.handleChange('simulate')} 
        style={{ flex: 1, borderRadius: 10, marginLeft: 5, ...this.getLabelStyle('simulate') }} 
        color={this.getBackgroundStyle('simulate')} 
      >
        {this.state.simulateTabLabel}
      </Button>
      <IconButton 
        onClick={this.handleClick} 
        id="transit"
        onMouseEnter={() => this.setState({ transitionOptionsHovered: true })} 
        onMouseLeave={() => this.setState({ transitionOptionsHovered: false })}
        style={{ color: '#ffffff' }}
      >
        <NavigationExpandMoreIcon />
      </IconButton>
      
      <Menu
        id="transit"
        value={this.state.simulateTabLabel}
        open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}
        style={{ position: 'absolute', top: '6px', right: '28px' }}
        onClose={this.handleClose}
      >
        <MenuItem 
          id="transitCreate"
          value="Create Network"
          onClick={this.handleTransitionOptionsChange}
        >
          Create Network
        </MenuItem>
        <MenuItem 
          id="transitSimulate" 
          value="Create and Simulate Network"
          onClick={this.handleTransitionOptionsChange}
        >
          Create and Simulate Network
        </MenuItem>
        <MenuItem 
          id="transitExplore" 
          value="Explore Existing Network"
          onClick={this.handleTransitionOptionsChange}
        >
          Explore Existing Network
        </MenuItem>
      </Menu>
    </div>
  }
}
