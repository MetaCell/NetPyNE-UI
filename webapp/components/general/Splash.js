import React, { Component } from 'react'
import Box from '@material-ui/core/Box'

export default class Splash extends Component {
  render () {
    return (
      <Box position='fixed' top={0} bgcolor="white" height="100%" width="100%">
        <img style={{ width: '100%' }} src="geppetto/build/static/splash.png"/>
      </Box>
    )
  }
}
