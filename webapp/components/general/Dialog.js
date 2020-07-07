import React from 'react';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import { secondaryColor, bgDarkest } from '../../theme'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Icon from '@material-ui/core/Icon'

const AboutContent = () => (
  <Paper style={{ backgroundColor: "white", textAlign: 'center' }}>
    <img style={{ width: 250 }} src="geppetto/build/static/splash.png"></img>
    <Box m={1}>
      <Typography variant="h5" style={{ color: secondaryColor }}>NetPyNE-UI v0.5.2</Typography>
    </Box>
    
    <Box m={1} >
      <Typography variant="body2" style={{ color: secondaryColor }}>
          NetPyNE is a Python package to facilitate the development, simulation, parallelization, and analysis of biological neuronal networks using the NEURON simulator.
          Checkout our <Link href="https://elifesciences.org/articles/44494" target="_blank">eLife paper.</Link>
      </Typography>
    </Box>

    <Box m={1} pb={2}>
      <Typography variant="body2" style={{ color: secondaryColor }}>
        Want to know more? Go to our <Link href="http://netpyne.org/about.html#what-is-netpyne" target="_blank">website</Link>.
      </Typography>
    </Box>

    <Box m={1}>
      <Typography variant="body2" style={{ color: secondaryColor }}>
        NetPyNE-UI is being developed in collaboration with:
      </Typography>
      <Link href="http://www.metacell.us" target="_blank">
        <img style={{ width: 150, padding: "10px" }} src="https://raw.githubusercontent.com/ddelpiano/bucket/master/MetaCellLogoHorizontal300ppi.png"></img>
      </Link>
    </Box>


  </Paper>
    
)

const ContributeContent = () => (
  <Paper style={{ backgroundColor: "white", textAlign: 'center' }}>
    <Box m={1} pt={1}>
      <Typography variant="h5" style={{ color: secondaryColor }}>Want to contribute?</Typography>
    </Box>

    <Box m={1} display="flex" alignItems="center" justifyContent="center">
      <Typography variant="body2" style={{ color: secondaryColor }}>GitHub repository </Typography>
      <div><Link href="https://github.com/MetaCell/NetPyNE-UI" target="_blank"><Icon className="fa fa-github" /></Link>.</div>
    </Box>

    <Box m={1} pb={2}>
      <Typography variant="caption" style={{ color: secondaryColor }}>
        Read our <Link href="https://github.com/Neurosim-lab/netpyne/blob/development/CONTRIBUTING.md" target="_blank">contributing guide</Link> to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to NetPyNE-UI.
      </Typography>
    </Box>
    
    <Box m={1} pb={2}>
      <Typography variant="body2" style={{ color: secondaryColor }}>
        Join our <Link href="https://groups.google.com/forum/#!forum/netpyne-mailing" target="_blank">mailing list</Link>.
      </Typography>
    </Box>
    
  </Paper>
    
)
export default function Dialog ({ open, title, message, handleClose }) {

  return (
    <div>
      <MuiDialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {title === "Contribute" ? <ContributeContent/> : <AboutContent/>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </MuiDialog>
    </div>
  );
}
