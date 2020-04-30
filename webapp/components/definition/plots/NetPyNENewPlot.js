import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ContentAdd from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

export default class NetPyNENewPlot extends React.Component {

  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = { anchorEl: null, };
  }
  
  handleButtonClick = event => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({ anchorEl: event.currentTarget, });
  };

 
  handleClick (plotName) {
    this.props.handleClick(plotName);
    this.setState({ anchorEl: null })
  }
  
  render () {
    return <div>
      <Fab size='small' color='primary' style={{ margin: 10, float: 'left' }} onClick={this.handleButtonClick}>
        <ContentAdd style={{ color: 'white' }}/>
      </Fab>
      <Menu 
        open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}
        onClose={() => this.setState({ anchorEl: null })}
      >
        <MenuItem 
          key={"plotTraces"} 
          value={"plotTraces"}
          onClick={() => this.handleClick("plotTraces")} 
        >
            Traces Plot
        </MenuItem>
        <MenuItem 
          key={"plotRaster"} 
          value={"plotRaster"}
          onClick={() => this.handleClick("plotRaster")} 
        >
            Raster Plot
        </MenuItem>
        <MenuItem 
          key={"plotSpikeHist"}
          value={"plotSpikeHist"}
          onClick={() => this.handleClick("plotSpikeHist")} 
        >
            Spike Histogram Plot
        </MenuItem>
        <MenuItem 
          key={"plotSpikeStats"} 
          value={"plotSpikeStats"}
          onClick={() => this.handleClick("plotSpikeStats")} 
        >
            Spike Stats Plot
        </MenuItem>
        <MenuItem 
          key={"plotRatePSD"} 
          value={"plotRatePSD"}
          onClick={() => this.handleClick("plotRatePSD")} 
        >
            PSD Rate Plot
        </MenuItem>
        <MenuItem 
          key={"plotLFP"} 
          value={"plotLFP"}
          onClick={() => this.handleClick("plotLFP")} 
        >
            LFP Plot
        </MenuItem>
        <MenuItem 
          key={"plotShape"} 
          value={"plotShape"}
          onClick={() => this.handleClick("plotShape")} 
        >
            3D Cell Shape Plot
        </MenuItem>
        <MenuItem 
          key={"plot2Dnet"} 
          value={"plot2Dnet"}
          onClick={() => this.handleClick("plot2Dnet")} 
        >
            2D Network Plot
        </MenuItem>
        <MenuItem 
          key={"plotConn"} 
          value={"plotConn"}
          onClick={() => this.handleClick("plotConn")} 
        >
            Network Connectivity Plot
        </MenuItem>
        <MenuItem 
          key={"granger"} 
          value={"granger"}
          onClick={() => this.handleClick("granger")} 
        >
            Granger Causality Plot
        </MenuItem>
      </Menu>
    </div>
  }
}
