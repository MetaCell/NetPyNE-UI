import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NavigationMoreHoriz from '@material-ui/icons/MoreHoriz';
import { withStyles } from '@material-ui/core/styles';
import ContentAdd from '@material-ui/icons/Add';
import Utils from '../../../../../Utils';
import { MechIcon } from '../../../../general/NetPyNEIcons';
import Tooltip from '../../../../general/Tooltip';

const fontSize = 40;
const styles = ({
  spacing,
  palette,
}) => ({
  icon: {
    color: palette.primary.main,
    cursor: 'pointer',
  },
  disabledIcon: {
    color: '#d1d1d1',
    cursor: 'auto',
  },
  iconContent: {
    position: 'absolute',
    color: 'white',
  },
  cogIconContent: {
    width: fontSize,
    height: fontSize,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'relative',
    width: fontSize - 2,
    height: fontSize - 2,
  },
  cogIcon: {
    width: fontSize,
    height: fontSize,
    position: 'absolute',
  },

});

class NetPyNENewMechanism extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      mechanisms: [],
    };
  }

  componentDidMount () {
    Utils.evalPythonMessage('netpyne_geppetto.getAvailableMechs', [])
      .then((response) => {
        this.setState({ mechanisms: response });
      });
  }

  handleClick = (event) => {
    this.setState({ open: false });
    this.props.handleClick(event.target.innerText);
  };

  handleButtonClick = (anchor) => {
    const {
      blockButton,
      handleHierarchyClick,
    } = this.props;
    if (!blockButton) {
      this.setState({
        open: true,
        anchorEl: anchor,
      });
    }
    handleHierarchyClick();
  };

  createTooltip () {
    const {
      disabled,
      blockButton,
    } = this.props;
    if (disabled) {
      return '';
    }
    if (blockButton) {
      return 'Explore mechanisms';
    }
    return 'Create new mechanism';
  }

  createLabel (classes) {
    const {
      disabled,
      blockButton,
    } = this.props;
    if (disabled) {
      return '';
    }
    if (blockButton) {
      return <NavigationMoreHoriz className={classes.iconContent} />;
    }
    return <ContentAdd className={classes.iconContent} />;
  }

  render () {
    const {
      disabled,
      classes,
      className,
    } = this.props;
    const {
      open,
      anchorEl,
      mechanisms,
    } = this.state;
    const tooltip = disabled ? '' : this.createTooltip();
    return (
      <div className={className}>
        <Tooltip title={tooltip} placement="top">
          <div
            id="newMechButton"
            className={disabled ? classes.disabledIcon : classes.icon}
            onClick={(e) => !disabled && this.handleButtonClick(e.currentTarget)}
          >
            <div>
              <div className={classes.container}>
                <MechIcon
                  color={disabled ? 'disabled' : 'primary'}
                  style={{
                    width: fontSize,
                    height: fontSize,
                    overflow: 'visible',
                  }}
                  className={classes.cogIcon}
                />
                <span className={classes.cogIconContent}>
                  {this.createLabel(classes)}
                </span>
              </div>
            </div>
          </div>
        </Tooltip>

        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={() => this.setState({ open: false })}
        >
          {mechanisms.map((mechLabel) => (
            <MenuItem
              id={mechLabel}
              key={mechLabel}
              value={mechLabel}
              onClick={(event, index) => this.handleClick(event)}
            >
              {mechLabel}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(NetPyNENewMechanism);
