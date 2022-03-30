/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ControlPanelTreeItem from './ControlPanelTreeItem';
import { experimentLabelColor } from '../../theme';
import { selectInstances } from '../../redux/actions/general';

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
  const dispatch = useDispatch();
  const instances = useSelector((state) => state.general.instances);
  const [filter, setFilter] = React.useState('');
  const onNodeSelect = (nodeId) => {
    dispatch(selectInstances(instances, [nodeId]));
  };
  const instancesMap = new Map();

  const onVisibilityClick = (event, nodeId) => {
    console.log(`Visibility of node with id of ${nodeId} clicked.`);
  };

  const traverseInstances = (instance) => {
    if (instance.getPath().includes(filter)) {
      instancesMap.set(
        instance.getPath(),
        (
          <ControlPanelTreeItem
            key={instance.id}
            nodeId={instance.getPath()}
            label={instance.id}
            type={instance.getType().getId()}
            onNodeSelect={onNodeSelect}
            onVisibilityClick={onVisibilityClick}
          />
        ),
      );
    }

    if (instance.getChildren() && instance.getChildren().length > 0) {
      const children = instance.getChildren();
      for (let i = 0; i < children.length; i += 1) {
        traverseInstances(children[i]);
      }
    }
  };

  const getFlatFilteredList = (instances) => {
    instancesMap.clear();
    instances.forEach((instance) => traverseInstances(instance));

    const flatList = [];
    instancesMap.forEach((value, key) => {
      flatList.push(value);
    });
    return flatList;
  };

  const getTreeItemsFromData = (treeItems) => treeItems.map((treeItemData) => {
    let children = [];
    if (treeItemData.getChildren() && treeItemData.getChildren().length > 0) {
      children = getTreeItemsFromData(treeItemData.getChildren());
    }

    return (
      <ControlPanelTreeItem
        key={treeItemData.id}
        nodeId={treeItemData.getPath()}
        label={treeItemData.id}
        type={treeItemData.getType().getId()}
        onNodeSelect={onNodeSelect}
        onVisibilityClick={onVisibilityClick}
        disableRandom={children.length === 0}
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
                    defaultExpanded={['network']}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                  >
                    {filter === ''
                      ? getTreeItemsFromData([window.Instances.getInstance('network')])
                      : getFlatFilteredList([window.Instances.getInstance('network')])}
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
