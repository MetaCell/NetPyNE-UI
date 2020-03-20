import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

import NavigationExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

export default class NetPyNETabs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      simulateTabLabel: "Create network",
      transitionOptionsHovered: false,
      anchorEl: null
    };
    this.rightTabAction = this.props.createNetwork;
    this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(
      this
    );
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.label != prevProps.label) {
      this.setState({ label: this.props.label });
    }
  }
  handleChange = tab => {
    if (tab == "define") {
      this.props.editModel();
    } else {
      this.rightTabAction();
    }
  };

  handleTransitionOptionsChange = e => {
    const value = e.target.innerText;
    switch (value) {
    case "Create and Simulate Network":
      this.rightTabAction = this.props.createAndSimulateNetwork;
      break;
    case "Create Network":
      this.rightTabAction = this.props.createNetwork;
      break;
    default:
      this.rightTabAction = this.props.showNetwork;
    }
    
    this.setState({ simulateTabLabel: value, anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render () {
    return (
      <div style={{ width: "100%", alignItems: "center", display: "flex" }}>
        <ToggleButtonGroup
          value="chooseMode"
          exclusive
          color="primary"
          style={{background: 'none', border: 'none'}}
          onChange={e => this.handleChange(e.currentTarget.value)}
          aria-label="Choose mode"

          style={{flexGrow: 1}}
        >
          <ToggleButton
            id={"defineNetwork"}
            value="define"
            color="primary"
            style={{ flex: 1, borderRadius: 10, marginLeft: 5, background: 'transparent', border: 'none', color: 'white' }}
          >
            {"Define your Network"}
          </ToggleButton>

          <ToggleButton
            id={"simulateNetwork"}
            value="simulate"
            color="primary"
            style={{ flex: 1, borderRadius: 10, marginLeft: 5, background: 'transparent', border: 'none', color: 'white' }}
          >
            {this.state.simulateTabLabel}
          </ToggleButton>
        </ToggleButtonGroup>
        <IconButton
          onClick={this.handleClick}
          id="transit"
          onMouseEnter={() => this.setState({ transitionOptionsHovered: true })}
          onMouseLeave={() =>
            this.setState({ transitionOptionsHovered: false })
          }
          style={{ color: "white" }}
        >
          <NavigationExpandMoreIcon />
        </IconButton>

        <Menu
          id="transit"
          value={this.state.simulateTabLabel}
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          style={{ position: "absolute", top: "6px", right: "28px" }}
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
    );
  }
}
