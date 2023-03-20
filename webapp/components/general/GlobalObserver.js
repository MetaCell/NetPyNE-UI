import React, { Component } from 'react';

class GlobalObserver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      targets: [],
    };

    this.observer = null;
  }

  componentDidMount() {
    // Create the IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the entry is intersecting, add it to the state
          if (entry.isIntersecting) {
            const targets = this.state.targets.slice();
            targets.push(entry.target);
            this.setState({ targets });
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    //Observe all nodes that match the specified class name or id
    const classNameNodes = this.getNodesByClassName(this.props.children, 'child-class');
    classNameNodes.forEach((node) => {
      this.observer.observe(node);
    });

    const idNodes = this.getNodesById(this.props.children, 'child-id');
    idNodes.forEach((node) => {
      this.observer.observe(node);
    });
  }

  componentWillUnmount() {
    // Disconnect the IntersectionObserver
    this.observer.disconnect();
  }

  getNodesByClassName = (node, className) => {
    const nodes = [];

    if (node.props && node.props.className && node.props.className.includes(className)) {
      nodes.push(node);
    }

    if (node.props && node.props.children) {
      React.Children.forEach(node.props.children, (child) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return;
        }

        nodes.push(...this.getNodesByClassName(child, className));
      });
    }

    return nodes;
  };

  getNodesById = (node, id) => {
    const nodes = [];

    if (node.props && node.props.id && node.props.id === id) {
      nodes.push(node);
    }

    if (node.props && node.props.children) {
      React.Children.forEach(node.props.children, (child) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return;
        }

        nodes.push(...this.getNodesById(child, id));
      });
    }

    return nodes;
  };

  render() {
    return (
      <>
        {/* Render all children */}
        {this.props.children}
      </>
    );
  }
}

export default GlobalObserver;