import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Visibility from '@material-ui/icons/Visibility';
import ColorLens from '@material-ui/icons/ColorLens';

import { MODEL_STATE } from '../../constants';

const useStyles = makeStyles(() => ({
  networkItem: {
    '&:hover': {
      '& .MuiSvgIcon-root': {
        display: 'block',
      },
    },
  },
}));

const ExperimentControlPanel = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState(true);
  const [filter, setFilter] = React.useState('');
  console.log('Instances from control panel', window.Instances);

  const NetworkItem = (props) => (
    <Box className={classes.networkItem} display="flex" flexDirection="row" justifyContent="space-between">
      <Box>{props.name}</Box>
      <Box>{props.type}</Box>
      <Box display="none">
        <span><Visibility /></span>
        <span><ColorLens /></span>
      </Box>
    </Box>
  );

  return (
    <>
      {
        window.Instances // temporary, change to props.modelState === MODEL_STATE.INSTANTIATED
          ? (
            window.Instances
              ? (
                <Box display="flex" flexDirection="column">
                  <TextField label="Filter results" variant="outlined" fullWidth onChange={(e) => setFilter(e.target.value)} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Name</Typography>
                    <Typography>Type(s)</Typography>
                  </Box>
                  <TreeView
                    aria-label="Network data navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    {/* <NetworkItem name="network_name" type="network_type" /> */}
                    <TreeItem label="test tree item" />
                  </TreeView>
                </Box>
              )
              : (
                <Box>
                  <p>Error: Should not happen. ModelState === INSTANTIATED but global Instances object is not defined.</p>
                </Box>
              )
          )
          : (
            <Box>
              <p>Model is not instantiated. Please instantiate a model to access the control panel.</p>
            </Box>
          )
      }
    </>
  );
};

export default ExperimentControlPanel;
