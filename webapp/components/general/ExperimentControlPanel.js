import * as React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const ExperimentControlPanel = (props) => {
  const [state, setState] = React.useState(true);
  const [filter, setFilter] = React.useState('');
  console.log('Instances from control panel', window.Instances);

  return (
    <>
      {
        window.Instances
          ? (
            <Box>
              <TextField variant="outlined" fullWidth placeholder="Filter results" onChange={(e) => setFilter(e.target.value)} />
              <Box display="flex" flexDirection="column">
                <Box>
                  Headers
                </Box>
                <Box>
                  <TreeView
                    aria-label="Network instances data navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpansionsIcon={<ChevronRightIcon />}
                  >
                    <TreeItem nodeId="network" label="Network label" />
                    {/* {
                      window.Instances.map((instance, index) => (
                        // <TreeItem nodeId={index} label={instance.getPath()} />
                        <p>{instance.getPath()}</p>
                      ))
                    } */}
                  </TreeView>
                </Box>
              </Box>
            </Box>
          )
          : <Box>There are no instances.</Box>
      }
    </>
  );
};

export default ExperimentControlPanel;
