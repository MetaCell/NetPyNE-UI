import React from 'react';
import Button from '@material-ui/core/Button';
import { changeNodeAtPath, walk } from 'react-sortable-tree';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Tooltip } from 'netpyne/components';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tree from './tree/Tree';

import Utils from '../../Utils';
import { bgLight, fontColor } from '../../theme';

export default class FileBrowser extends React.Component {
  constructor (props) {
    super(props);
    this.handleClickVisualize = this.handleClickVisualize.bind(this);

    this.state = {};
  }

  getDirList (treeData, rowInfo) {
    if (rowInfo != undefined) {
      var { path } = rowInfo.node;
    } else {
      var path = '';
    }

    Utils
      .evalPythonMessage('netpyne_geppetto.getDirList', [path, this.props.exploreOnlyDirs, this.props.filterFiles])
      .then((dirList) => {
        if (treeData != [] && treeData.length > 0) {
          rowInfo.node.children = dirList;
          rowInfo.node.expanded = true;
          rowInfo.node.load = true;
          var newTreeData = changeNodeAtPath({
            treeData,
            path: rowInfo.path,
            newNode: rowInfo.node,
            getNodeKey: ({ treeIndex }) => treeIndex,
          });
        } else {
          var newTreeData = dirList;
        }
        if (!this.props.exploreOnlyDirs || rowInfo == undefined) {
          this.setState({ selection: undefined });
        } else {
          this.setState({ selection: rowInfo.node });
        }
        this.refs.tree.updateTreeData(newTreeData);
      });
  }

  handleClickVisualize (event, rowInfo) {
    if (rowInfo.node.load == false) {
      this.getDirList(this.refs.tree.state.treeData, rowInfo);
    } else if (this.props.exploreOnlyDirs || (rowInfo.node.children == undefined && rowInfo.node.load == undefined)) {
      this.setState({ selection: rowInfo.node });
    }
  }

  getSelectedFiles () {
    const nodes = {};
    if (!this.refs.tree) {
      return nodes;
    }
    walk({
      treeData: this.refs.tree.state.treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: true,
      callback: (rowInfoIter) => {
        if (rowInfoIter.node.active) {
          nodes[rowInfoIter.treeIndex] = rowInfoIter.node;
        }
      },
    });

    return nodes;
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open == false && this.props.open) {
      this.getDirList([]);
    }
  }

  handleMoveUp (reset = false) {
    let path = this.refs.tree.state.treeData[0].path.split('/').slice(0, -2).join('/') || '/';

    if (reset) {
      path = window.currentFolder;
    }

    this.currentFolder = path;
    this.getDirList([], { node: { path } });
  }

  disableSelectButton () {
    if (this.props.toggleMode) {
      if (Object.keys(this.getSelectedFiles()).length > 0) {
        return false;
      }
    }
    if (this.state.selection) {
      return !this.state.selection.active;
    }
    return true;
  }

  onCancelFileBrowser () {
    this.currentFolder = window.currentFolder;
    this.props.onRequestClose();
  }

  render () {
    const actions = [
      <Button
        key="cancel"
        onClick={(event) => this.onCancelFileBrowser()}
      >
        CANCEL
      </Button>,
      <Button
        id="browserAccept"
        key="select"
        variant="contained"
        color="primary"
        onClick={(event) => {
          this.props.onRequestClose(this.props.toggleMode ? this.getSelectedFiles() : this.state.selection);
        }}
        disabled={this.disableSelectButton()}
      >
        SELECT
      </Button>,
    ];

    const selectMessage = this.props.exploreOnlyDirs ? 'Select a folder. ' : 'Select a file. ';
    return (
      <Dialog
        open={this.props.open}
        fullWidth
        maxWidth="sm"
        onClose={() => this.props.onRequestClose()}
        style={{ zIndex: 1350 }}
      >
        <DialogContent>
          <Box color={fontColor}>{`${selectMessage}Paths are relative to:`}</Box>

          <Grid container alignItems="center">
            <Grid item>
              <Box m={1} p={1} color="lightgrey" bgcolor={bgLight}>{this.currentFolder || window.currentFolder}</Box>
            </Grid>

            <Tooltip title="Enclosing Folder" placement="top">
              <IconButton
                disableTouchRipple
                onClick={() => this.handleMoveUp()}
              >
                <Icon className="fa fa-level-up" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Home folder" placement="top">
              <IconButton
                disableTouchRipple
                onClick={() => this.handleMoveUp(true)}
              >
                <Icon className="fa fa-home" />
              </IconButton>
            </Tooltip>
          </Grid>

          <Tree
            id="TreeContainerCutting"
            style={{ width: '100%', height: 400 }}
            treeData={[]}
            handleClick={this.handleClickVisualize}
            rowHeight={30}
            toggleMode={!!this.props.toggleMode}
            activateParentsNodeOnClick={this.props.exploreOnlyDirs}
            ref="tree"
          />
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    );
  }
}

FileBrowser.defaultProps = {
  exploreOnlyDirs: false,
  filterFiles: false,
};
