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

  handleOpenTopbarDialog () {
    var cellRuleId = Utils.getAvailableKey(this.props.model, "CellType");
    this.props.openTopbarDialog(cellRuleId)
    this.props.callback()
  }
  
  render () {
    const { page, label, tooltip, handleButtonClick, anchorEl, clearAnchorEl } = this.props

    return (
      <div>
        <Tooltip title={tooltip} placement="top">
          <div id="selectCellButton">
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
          id="selectCellMenu"
          anchorEl={anchorEl}
          onClose={() => clearAnchorEl()}
        >
          <MenuItem 
            id="emptyCellTemplate"
            key={"Empty"}
            value={"Empty"}

            onClick={() => this.handleSelection("Empty")} 
          >
            Empty cell
          </MenuItem>

          <MenuItem 
            id="Simple_HHCellTemplate"
            key={"Simple_HH"} 
            value={"Simple_HH"}
            onClick={() => this.handleSelection("Simple_HH")} 
          >
            Basic HH cell
          </MenuItem>

          <MenuItem 
            id="BallStick_HHCellTemplate"
            key={"BallStick_HH"} 
            value={"BallStick_HH"}
            onClick={() => this.handleSelection("BallStick_HH")} 
          >
            Ball and stick HH cell
          </MenuItem>


          <MenuItem 
            id="fromTemplateCellTemplate"
            key={"fromTemplate"} 
            value={"fromTemplate"}
            onClick={() => this.handleOpenTopbarDialog()} 
          >
            Import cell template from file ...
          </MenuItem>
        
        </Menu>
      </div>
    )
  }
}
