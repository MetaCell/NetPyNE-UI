import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ContentAdd from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '../../general/Tooltip';

export default class NetPyNENewPlot extends React.Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = { anchorEl: null };
  }

  handleButtonClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClick (plotName) {
    this.props.handleClick(plotName);
    this.setState({ anchorEl: null });
  }

  render () {
    return (
      <div>
        <Tooltip title="Add new plot" placement="top">
          <Fab size="small" color="primary" onClick={this.handleButtonClick}>
            <ContentAdd style={{ color: 'white' }} />
          </Fab>
        </Tooltip>

        <Menu
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
        >
          <MenuItem
            key="iplotTraces"
            value="iplotTraces"
            onClick={() => this.handleClick('iplotTraces')}
          >
            Traces Plot
          </MenuItem>
          <MenuItem
            key="iplotRaster"
            value="iplotRaster"
            onClick={() => this.handleClick('iplotRaster')}
          >
            Raster Plot
          </MenuItem>
          <MenuItem
            key="iplotSpikeHist"
            value="iplotSpikeHist"
            onClick={() => this.handleClick('iplotSpikeHist')}
          >
            Spike Histogram Plot
          </MenuItem>
          <MenuItem
            key="iplotSpikeStats"
            value="iplotSpikeStats"
            onClick={() => this.handleClick('iplotSpikeStats')}
          >
            Spike Stats Plot
          </MenuItem>
          <MenuItem
            key="iplotRatePSD"
            value="iplotRatePSD"
            onClick={() => this.handleClick('iplotRatePSD')}
          >
            PSD Rate Plot
          </MenuItem>
          <MenuItem
            key="iplotLFP"
            value="iplotLFP"
            onClick={() => this.handleClick('iplotLFP')}
          >
            LFP Plot
          </MenuItem>
          <MenuItem
            key="iplot2Dnet"
            value="iplot2Dnet"
            onClick={() => this.handleClick('iplot2Dnet')}
          >
            2D Network Plot
          </MenuItem>
          <MenuItem
            key="iplotConn"
            value="iplotConn"
            onClick={() => this.handleClick('iplotConn')}
          >
            Network Connectivity Plot
          </MenuItem>
          <MenuItem
            key="granger"
            value="granger"
            onClick={() => this.handleClick('granger')}
          >
            Granger Causality Plot
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
