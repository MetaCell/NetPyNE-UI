import React from 'react';
import FontIcon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import DeleteDialogBox from '../../../general/DeleteDialogBox';

const styles = { btn: { borderRadius: '25px', marginRight: '8px' } };

export default class NetPyNESectionThumbnail extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isHovered: false,
      dialogOpen: false
    };
  }

  handleClick () {
    const { isHovered } = this.state;
    const { name, handleClick, selected } = this.props;
    if (handleClick) {
      selected && isHovered ? this.setState({ dialogOpen: true }) : handleClick(name, true);
    }
  }

  handleDialogBox (response) {
    const { name, handleClick, deleteMethod } = this.props;
    if (handleClick && response) {
      deleteMethod(name);
    }
    this.setState({ dialogOpen: false });
  }

  render () {
    const { name, selected } = this.props;
    const { isHovered, dialogOpen } = this.state;

    let label;
    if (isHovered && selected) {
      label = <FontIcon className="fa fa-trash-o" style={{ color: "white" }}/> 
    } else {
      label = name.length > 14 ? `${name.slice(0,10)}...` : name
    }
    return (
      <div>
        <Button
          variant="contained"
          id={name}
          color={selected ? 'secondary' : 'primary'}
          style={ styles.btn }
          onMouseEnter={ () => this.setState({ isHovered: true }) }
          onMouseLeave={ () => this.setState({ isHovered: false }) }
          data-tooltip={isHovered && name.length > 14 ? name : undefined}
          className={"rectangularActionButton " + (selected ? "selectedRectangularActionButton " : "")} 
          onClick={() => this.handleClick()}
        >
          { label }
        </Button>
        <DeleteDialogBox
          open={dialogOpen}
          onDialogResponse={ r => this.handleDialogBox(r) }
          textForDialog={name} />
      </div>
    );
  }
}
