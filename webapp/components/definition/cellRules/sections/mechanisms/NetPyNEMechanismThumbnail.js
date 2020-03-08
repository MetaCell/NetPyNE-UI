import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from '@material-ui/core/Icon';
import DeleteDialogBox from '../../../../general/DeleteDialogBox';

const hoverColor = '#66d2e2';
const changeColor = 'rgb(0, 188, 212)';

const styles = {
  main: { float: 'left' },
  trash: {
    zIndex:10,
    marginTop:37,
    marginLeft:40,
    position:"absolute",
    backgroundColor:"#f23d7a"
  }
}
export default class NetPyNEMechanismThumbnail extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isHovered: false,
      dialogOpen: false
    };
  }

  handleClick () {
    const { isHovered } = this.state;
    const { name, selected, handleClick } = this.props;
    if (handleClick) {
      if (selected && isHovered) {
        this.setState({ dialogOpen: true });
      } else {
        handleClick(name, true);
      }
    }
  }

  handleDialogBox (response) {
    if (this.props.handleClick && response) {
      this.props.deleteMethod(this.props.name);
    }
    this.setState({ dialogOpen: false });
  }

  render () {
    const { name, selected } = this.props;
    const { dialogOpen, isHovered } = this.state;
    let label;
    if (isHovered && selected) {
      label = <FontIcon className="fa fa-trash-o" style={styles.trash}/> 
    } else {
      label = (
        <span className={"gearThumbLabel"}>
          {name.length > 14 ? `${name.slice(0,10)}...` : name}
        </span>
      )
    }
    return (
      <div style={styles.main}>
        <IconButton
          id={`mechThumb${name}`}
          onMouseEnter={ () => this.setState({ isHovered: true }) }
          onMouseLeave={ () => this.setState({ isHovered: false }) }
          data-tooltip={isHovered && name.length > 10 ? name : undefined}
          className={"gearThumbButton " + (selected ? "selectedGearButton" : "")}
          onClick={ (e, v) => this.handleClick(v) }
        >
          <div>
            { label }
            <FontIcon color="primary" className="gpt-fullgear"/>
          </div>
        </IconButton>
        <DeleteDialogBox
          open={dialogOpen}
          textForDialog={name}
          onDialogResponse={r => this.handleDialogBox(r) }
        />
      </div>
    );
  }
}
