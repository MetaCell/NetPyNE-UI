import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FontIcon from '@material-ui/core/Icon';

export default class NetPyNEPlotThumbnail extends React.Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.props.handleClick(this.props.name);
  }

  render () {
    return (
      <IconButton
        className={`gearThumbButton ${this.props.selected ? 'selectedGearButton' : ''}`}
        onClick={this.handleClick}
      >
        <FontIcon color="primary" className="gpt-fullgear" />
        <span className="gearThumbLabel">{this.props.name}</span>
      </IconButton>
    );
  }
}
