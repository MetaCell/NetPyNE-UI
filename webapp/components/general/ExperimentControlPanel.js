import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ControlPanelTreeItem from './ControlPanelTreeItem';
import { experimentLabelColor } from '../../theme';

import { MODEL_STATE } from '../../constants';

const useStyles = makeStyles(() => ({
  header: {
    '& .MuiTypography-root': {
      color: experimentLabelColor,
      fontWeight: 'bold',
    },
  },
}));

const ExperimentControlPanel = (props) => {
  const classes = useStyles();
  const [filter, setFilter] = React.useState('');
  const onNodeSelect = (event, nodeId) => {
    console.log(`Node with id ${nodeId} clicked`);
  };

  const onVisibilityClick = (event, nodeId) => {
    console.log(`Visibility of node with id of ${nodeId} clicked.`);
  };

  const getTreeItemsFromData = (treeItems) => treeItems.map((treeItemData) => {
    let children;
    if (treeItemData.getChildren() && treeItemData.getChildren().length > 0) {
      children = getTreeItemsFromData(treeItemData.getChildren());
    }

    return (
      <ControlPanelTreeItem
        key={treeItemData.id}
        nodeId={treeItemData.id}
        label={treeItemData.getPath()}
        type={treeItemData.id}
        onNodeSelect={onNodeSelect}
        onVisibilityClick={onVisibilityClick}
      >
        {children}
      </ControlPanelTreeItem>
    );
  });

  return (
    <>
      {
        window.Instances // temporary change to -> props.modelState === MODEL_STATE.INSTANTIATED
          ? (
            window.Instances
              ? (
                <Box display="flex" flexDirection="column" p={1}>
                  <TextField label="Filter results" variant="outlined" fullWidth onChange={(e) => setFilter(e.target.value)} />
                  <Box className={classes.header} display="flex" justifyContent="space-between" mt={1}>
                    <Typography>Name</Typography>
                    <Typography>Type(s)</Typography>
                    <Typography />
                  </Box>
                  <TreeView
                    aria-label="Network data navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    <TreeItem nodeId="network" label="network_netpyne">
                      {getTreeItemsFromData(window.Instances.network.getChildren())}
                    </TreeItem>
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
