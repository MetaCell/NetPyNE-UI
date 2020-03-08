import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';

/**
 * The slider bar can have a set minimum and maximum, and the value can be
 * obtained through the value parameter fired on an onChange event.
 */
export default class NetPyNESlider extends Component {

  constructor (props) {
    super(props);
    this.state = { value: 0.5 };
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.value != undefined && prevProps.value != this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

    handleSlider = (event, value) => {
      this.setState({ value: value });

      this.props.onChange(event, null, value);
    };

    render () {
      return (
        <div>
          <p>
            <span>{this.props.label}</span>
          </p>
          <Slider
            {...this.props}
            style={{ float: 'left', width: '220px' }}
            value={this.state.value}
            onChange={this.handleSlider}
          />

          <TextField
            style={{ float: 'left', width: '40px', margin: '0 5px' }}
            value={this.state.value}
            onChange={event => this.handleSlider(event, event.target.value)}
          />

        </div>
      );
    }
}