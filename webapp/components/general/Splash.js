import React from 'react';
import Box from '@material-ui/core/Box';

const Splash = () => (
  <Box position="fixed" top={0} bgcolor="white" height="100%" width="100%" textAlign="center">
    <img style={{ width: '50%' }} src="geppetto/build/static/splash.png" />
  </Box>
);
export default Splash;
