import React, { Component, createRef } from 'react';

import HTMLViewer
  from '@geppettoengine/geppetto-client/js/components/interface/htmlViewer/HTMLViewer';

import { withStyles } from '@material-ui/core/styles';

const style = ({ palette }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'inherit',
  },
});

class CustomHTMLViewer extends Component {
  containerRef = createRef();

  dimensions = {
    width: 200,
    height: 200,
  };

  componentDidMount () {
    window.addEventListener('resize', this.delayedResize.bind(this));
    this.resizeIfNeeded();
  }

  componentDidUpdate () {
    this.resizeIfNeeded();
  }

  componentWillUnmount () {
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.delayedResize);
  }

  getParentSize () {
    if (this.containerRef.current === null) {
      return false;
    }
    return this.containerRef.current.parentNode.getBoundingClientRect();
  }

  getSvgComponent () {
    // svg element
    return this.containerRef.current.children[0].children[0].children[0];
  }

  wasParentResized (dimensions) {
    return dimensions.width !== this.dimensions.width || dimensions.height !== this.dimensions.height;
  }

  adjustSVGSize () {
    const svg = this.getSvgComponent();
    if (svg) {
      const width = (this.dimensions.width - 20) > 0 ? `${this.dimensions.width - 20}px` : '0px';
      const height = (this.dimensions.height - 20) > 0 ? `${this.dimensions.height - 20}px` : '0px';
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
    }
  }

  resizeIfNeeded () {
    const dimensions = this.getParentSize();

    if (dimensions !== false && this.wasParentResized(dimensions)) {
      this.dimensions = dimensions;
      this.adjustSVGSize();
    }
  }

  delayedResize () {
    this.timer = setTimeout(() => this.resizeIfNeeded(), 100);
  }

  render () {
    const { classes } = this.props;
    return (
      <div id="plot" className={classes.container} ref={this.containerRef}>
        <HTMLViewer {...this.props} style={{ backgroundColor: 'inherit' }} />
      </div>
    );
  }
}

export default withStyles(style)(CustomHTMLViewer);
