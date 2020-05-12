import React from 'react';
import Tree from '@geppettoengine/geppetto-client/js/components/interface/tree/Tree'
import Utils from '../../Utils';
import Button from '@material-ui/core/Button';
import { changeNodeAtPath } from 'react-sortable-tree';
import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { walk } from 'react-sortable-tree';

export default class FileBrowser extends React.Component {

  constructor (props) {
    super(props);
    this.handleClickVisualize = this.handleClickVisualize.bind(this);

    this.state = {};
  }

  getDirList (treeData, rowInfo) {
    if (rowInfo != undefined) {
      var path = rowInfo.node.path;
    } else {
      var path = ""
    }

    Utils
      .evalPythonMessage('netpyne_geppetto.getDirList', [path, this.props.exploreOnlyDirs, this.props.filterFiles])
      .then(dirList => {
        if (treeData != [] && treeData.length > 0) {
          rowInfo.node.children = dirList;
          rowInfo.node.expanded = true;
          rowInfo.node.load = true;
          var newTreeData = changeNodeAtPath({ 
            treeData: treeData, 
            path: rowInfo.path, 
            newNode: rowInfo.node, 
            getNodeKey: ({ treeIndex }) => treeIndex 
          });
        } else {
          var newTreeData = dirList;
        }
        if (!this.props.exploreOnlyDirs || rowInfo == undefined){
          this.setState({ selection: undefined })
        } else {
          this.setState({ selection: rowInfo.node })
        }
        this.refs.tree.updateTreeData(newTreeData);
      });
  }


  handleClickVisualize (event, rowInfo) {
    if (rowInfo.node.load == false) {
      this.getDirList(this.refs.tree.state.treeData, rowInfo);
    } else if (this.props.exploreOnlyDirs || (rowInfo.node.children == undefined && rowInfo.node.load == undefined)) {
      this.setState({ selection: rowInfo.node })
    }
  }

  getSelectedFiles () {
    const nodes = {}
    if (!this.refs.tree) {
      return nodes
    }
    walk({
      treeData: this.refs.tree.state.treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: true,
      callback: rowInfoIter => {
        if (rowInfoIter.node.active) {
          nodes[rowInfoIter.treeIndex] = rowInfoIter.node
        }
      }
    });

    return nodes
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open == false && this.props.open) {
      this.getDirList([]);
    }
  }

  handleMoveUp (reset = false) {
    var path = this.refs.tree.state.treeData[0].path.split("/").slice(0, -2).join('/') || '/'
    
    if (reset) {
      path = window.currentFolder
    }

    this.currentFolder = path
    this.getDirList([], { node: { path } });
  }

  disableSelectButton () {
    if (this.props.toggleMode) {
      if (Object.keys(this.getSelectedFiles()).length > 0) {
        return false
      }
    }
    if (this.state.selection) {
      return !this.state.selection.active
    }
    return true
  }

  onCancelFileBrowser () {
    this.currentFolder = window.currentFolder
    this.props.onRequestClose()
  }


  render () {
    const actions = [
      <Button
        key='cancel'
        onClick={event => this.onCancelFileBrowser()}
        style={{ marginRight: 16 }}
      >cancel</Button>,
      <Button
        id="browserAccept"
        key="select"
        variant="contained"
        color="primary"
        onClick={event => {
          this.props.onRequestClose(this.props.toggleMode ? this.getSelectedFiles() : this.state.selection )
        }}
        disabled={this.disableSelectButton()}
      >select</Button>
    ];
        
    var selectMessage = this.props.exploreOnlyDirs ? "Select a folder. " : "Select a file. ";
    return (
      <Dialog
        open={this.props.open}
        fullWidth
        maxWidth="sm"
        onClose={() => this.props.onRequestClose()}
        style={{ zIndex: 5000 }}
      >
        <DialogContent>
          <div style={{ marginBottom: '15px', color: 'white' }}>
            <b>{selectMessage}</b>
            These paths are relative to:<br/>
            <div className="flex-row fx-center ">
              <span className="code-p w-80">{this.currentFolder || window.currentFolder}</span>
              <IconButton
                id="file-browser-level-up"
                disableTouchRipple
                className='simple-icon mrg-2'
                onClick={() => this.handleMoveUp()} 
                tooltip-data='Enclosing Folder'
              >
                <Icon className={'fa fa-level-up listIcon'} />
              </IconButton>
              <IconButton
                disableTouchRipple
                className='simple-icon mrg-2'
                onClick={() => this.handleMoveUp(true)} 
                tooltip-data='Home folder'
              >
                <Icon className={'fa fa-home listIcon'} />
              </IconButton>
            </div>
            
          </div>
          < Tree
            id="TreeContainerCutting"
            style={{ width: "100%", height: "400px", float: 'left' }}
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
    )
  }
}

FileBrowser.defaultProps = {
  exploreOnlyDirs: false,
  filterFiles: false
};


