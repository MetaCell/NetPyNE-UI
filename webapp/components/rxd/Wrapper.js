import React from 'react';
import Rxd from './Rxd';

class RxdWrapper extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <>
        <Rxd controlledState={this.state} model={this.props.model} updateCards={this.props.updateCards} />
      </>
    );
  }
}

export default RxdWrapper;
