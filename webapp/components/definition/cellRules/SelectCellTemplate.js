import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Fab from '@material-ui/core/Fab';
import Tooltip from '../../general/Tooltip'
import Utils from '../../../Utils'

export default class NetPyNENewPlot extends React.Component {

  constructor (props) {
    super(props);
    this.handleClick = this.handleSelection.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = { anchorEl: null, };
  }
  
  handleButtonClick = event => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({ anchorEl: event.currentTarget, });
  };

  handleSelection (cellTemplateName) {
    var cellRuleId = Utils.getAvailableKey(this.props.model, "CellType");
    Utils.evalPythonMessage('netpyne_geppetto.create_celltype_from_template', [cellRuleId, {}, cellTemplateName])
      .then(response => {
        this.props.callback()
      })
  }
  
  render () {
    const { page, label, tooltip, handleButtonClick, anchorEl, clearAnchorEl } = this.props

    return (
      <div>
        <Tooltip title={tooltip} placement="top">
          <div >
            <Fab
              style={{ width: 40, height: 40 }}
              color={ page == 'main' ? 'primary' : 'secondary'}
              onClick={event => handleButtonClick(event)}
            >
              {label}
            </Fab>
            <div style={{ textAlign: 'center', fontFamily: 'Source Sans Pro' }}>Cell</div>
          </div>
        
        </Tooltip>
      
        <Menu 
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => clearAnchorEl()}
        >
          <MenuItem 
            key={"Empty"}
            value={"Empty"}
            onClick={() => this.handleSelection("Empty")} 
          >
            Empty
          </MenuItem>

          <MenuItem 
            key={"Simple_HH"} 
            value={"Simple_HH"}
            onClick={() => this.handleSelection("Simple_HH")} 
          >
            Simple HH
          </MenuItem>

          <MenuItem 
            key={"BallStick_HH"} 
            value={"BallStick_HH"}
            onClick={() => this.handleSelection("BallStick_HH")} 
          >
            Ball and stick HH
          </MenuItem>
        
        </Menu>
      </div>
    )
  }
}
