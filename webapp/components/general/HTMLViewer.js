import React, { Component, createRef } from 'react'

import HTMLViewer from '@geppettoengine/geppetto-client/js/components/interface/htmlViewer/HTMLViewer'

import { withStyles } from '@material-ui/core/styles'

const style = ({ palette }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.common.white
  }
})


class CustomHTMLViewer extends Component {
  containerRef = createRef()
  
  dimensions = { width: 200, height: 200 }
  
  componentDidMount () {
    window.addEventListener('resize', this.delayedResize.bind(this))
    this.resizeIfNeeded()
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.delayedResize)
  }

  componentDidUpdate (){
    this.resizeIfNeeded()
  }

  wasParentResized (dimensions) {
    return dimensions.width !== this.dimensions.width || dimensions.height !== this.dimensions.height
  }

  getParentSize () {
    if (this.containerRef.current === null) {
      return false
    }
    return this.containerRef.current.parentNode.getBoundingClientRect()
  }

  getSvgComponent () {
    // svg element
    return this.containerRef.current.children[0].children[0].children[0]
  }

  adjustSVGSize () {
    const svg = this.getSvgComponent()
    if (svg) {
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.setAttribute('width', `${this.dimensions.width - 20}px`);
      svg.setAttribute('height', `${this.dimensions.height - 20}px`);
    }
    
  }

  resizeIfNeeded (){
    const dimensions = this.getParentSize()
    
    if (dimensions !== false && this.wasParentResized(dimensions)) {
      this.dimensions = dimensions
      this.adjustSVGSize()
    }
  }

  delayedResize () {
    this.timer = setTimeout(() => this.resizeIfNeeded(), 100)
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.container} ref={this.containerRef}>
        <HTMLViewer {...this.props} style={{ backgroundColor: 'white' }} />
      </div>
    )
  }
}


export default withStyles(style)(CustomHTMLViewer)