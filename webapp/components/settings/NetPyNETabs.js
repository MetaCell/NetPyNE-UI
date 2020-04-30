import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

import NavigationExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { withStyles } from '@material-ui/core/styles'

const style = ({ palette, shape, spacing, typography }) => ({ 
  container: { 
    backgroundColor: palette.primary.main, 
    flexGrow: 1 
  },
  toggleButton: { 
    flex: 1, 
    borderRadius: shape.borderRadius, 
    marginLeft: spacing(1), 
    background: 'transparent', 
    border: 'none', 
    color: palette.common.white + '!important'
  },
  toggleButtonSelected: { 
    fontWeight: typography.fontWeightBold,
    color: palette.common.white
  },
  menu: { position: "absolute", top: "6px", right: "28px" }
})

class NetPyNETabs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      simulateTabLabel: "Create network",
      transitionOptionsHovered: false,
      anchorEl: null,
      editTab: true
    };
    this.rightTabAction = this.props.createNetwork;
    this.handleTransitionOptionsChange = this.handleTransitionOptionsChange.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.label != prevProps.label) {
      this.setState({ label: this.props.label });
    }
  }
  handleChange = tab => {
    if (tab == "define") {
      if (!this.props.editMode) {
        this.props.editModel();
        this.setState({ editTab: true })
      }
      
    } else {
      if (this.props.editMode) {
        this.rightTabAction();
        this.setState({ editTab: false })
      }
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
    const { classes } = this.props
    const { editTab } = this.state
    return (
      <div style={{ width: "100%", alignItems: "center", display: "flex" }}>
        <ToggleButtonGroup
          value="chooseMode"
          exclusive
          className={classes.container}
          onChange={e => this.handleChange(e.currentTarget.value)}
          aria-label="Choose mode"
        >
          <ToggleButton
            id={"defineNetwork"}
            value="define"
            color="primary"
            selected={editTab}
            classes={{ root: classes.toggleButton, selected: classes.toggleButtonSelected }}
          >
            {"Define your Network"}
          </ToggleButton>

          <ToggleButton
            id={"simulateNetwork"}
            value="simulate"
            color="primary"
            selected={!editTab}
            classes={{ root: classes.toggleButton, selected: classes.toggleButtonSelected }}
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
          className={classes.menu}
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


export default withStyles(style)(NetPyNETabs)