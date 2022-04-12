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
import { MODEL_STATE } from '../../constants';
import { selectInstances } from '../../redux/actions/general';

const useStyles = makeStyles(() => ({
  root: {
    '& ul': {
      position: 'relative',
      '&::before': {
        content: '""',
        height: 'calc(100% - 1.1rem)',
        width: '0.0625rem',
        position: 'absolute',
        left: '-0.65rem',
        borderRadius: '3.125rem',
        top: '0rem',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'1\' height=\'8\' viewBox=\'0 0 1 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0H1V8H0V0Z\' fill=\'%23ffffff\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
      },
      '& .MuiTreeItem-root': {
        position: 'relative',
        '&::before': {
          content: '""',
          height: '0.875rem',
          width: '1.4375rem',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'6\' viewBox=\'0 0 12 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 6C2.68629 6 0 3.31371 0 0H1C1 2.80391 3.19609 5 6 5V6Z\' fill=\'%23ffffff\'/%3E%3Cpath d=\'M6 5H11.5C11.7761 5 12 5.22386 12 5.5C12 5.77614 11.7761 6 11.5 6H6V5Z\' fill=\'%23ffffff\'/%3E%3C/svg%3E")',
          position: 'absolute',
          top: '0.5rem',
          backgroundRepeat: 'no-repeat',
          left: '-0.65rem',
        },
        '&::after': {
          content: '""',
          height: '0.0625rem',
          borderRadius: '3.125rem',
          width: '0.5rem',
          backgroundColor: '#ffffff',
          position: 'absolute',
          left: '0',
          top: '1.0625rem',
          display: 'none',
        },
        '&:hover': {
          background: 'transparent',
        },
        '&:focus > .MuiTreeItem-content': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
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
        props.modelState === MODEL_STATE.INSTANTIATED || props.modelState === MODEL_STATE.SIMULATED
          ? (
            window.Instances
              ? (
                <Box display="flex" flexDirection="column" p={1}>
                  <TextField label="Filter results" variant="outlined" fullWidth onChange={(e) => setFilter(e.target.value)} />
                  <Box className={classes.header} display="flex" justifyContent="space-between" mt={1}>
                    <Typography>Name</Typography>
                    <Typography style={{ marginLeft: '3rem' }}>Type(s)</Typography>
                    <Typography>Controls</Typography>
                  </Box>
                  <TreeView
                    className={classes.root}
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
