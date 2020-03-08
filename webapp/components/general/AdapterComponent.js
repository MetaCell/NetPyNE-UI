import React, { Component } from 'react';

/**
 * The adapter component provides a mechanism to group graphical components.
 * that act as a single component when communicating to python.
 * This creates a 1-to-n mapping between the python variable and the 
 * multiple js components.
 */

export default class AdapterComponent extends Component {

  constructor (props) {
    super(props);
    /** 
     * the state is constructed dynamically from the id props of each children
     * in this way we are declaring a controlled component that can handle his own
     * state when this is modified by a new input or action of the user
     *
     */
    this.stateBuilder = {};
    this.props.children.forEach( (child, index) => {
      this.stateBuilder[child.props.id] = '';
    });
    this.state = this.stateBuilder;

    this.handleChildChange = this.handleChildChange.bind(this);
  }
  componentDidUpdate (prevProps, prevState) {
    var newValue = this.props.convertFromPython(prevProps, prevState, this.props.value);
    if (newValue != undefined){
      this.setState(newValue);
    }
  }

  handleChildChange (event) {
    // Update State
    var newState = this.state;
    var value = event.target.value
    if (value === '') {
      value = 0
    } else if (isNaN(parseFloat(value))) {
      return ''
    }

    newState['lastUpdated'] = event.target.id;
    newState[event.target.id] = value;
    this.setState(newState)

    // Call to conversion function
    var newValue = this.props.convertToPython(this.state);
    if (newValue != undefined && this.state.value != newValue){
      this.props.onChange(null, null, newValue);
    }
  }

  render () {
    const childrenWithExtraProp = React.Children.map(this.props.children, child => React.cloneElement(child, {
      onChange: this.handleChildChange,
      value: this.state[child.props.id]
    }));

    return (
      <div>
        {childrenWithExtraProp}
      </div>
    )
  }
}