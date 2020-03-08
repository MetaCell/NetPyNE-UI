import React from 'react';
import Tree from 'geppetto-client/js/components/interface/tree/Tree'
import Utils from '../../Utils';
import Button from '@material-ui/core/Button';
import { changeNodeAtPath } from 'react-sortable-tree';
import Dialog from '@material-ui/core/Dialog';

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
          var newTreeData = changeNodeAtPath({ treeData: treeData, path: rowInfo.path, newNode: rowInfo.node, getNodeKey: ({ treeIndex }) => treeIndex });
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

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.open == false && this.props.open) {
      this.getDirList([]);
    }
  }

  render () {
    const actions = [
      <Button
        label={'CANCEL'}
        onClick={event => this.props.onRequestClose()}
        style={{ marginRight: 16 }}
      />,
      <Button
        id="browserAccept"
        variant="contained"
        color="primary"
        label={'SELECT'}
        onClick={event => this.props.onRequestClose(this.state.selection)}
        disabled={!this.state.selection}
      />
    ];
        
    var selectMessage = this.props.exploreOnlyDirs ? "Select a folder. " : "Select a file. ";
    return (
            
      <Dialog
        open={this.props.open}
        onClose={this.props.onRequestClose}
        bodyStyle={{ overflow: 'auto' }}
        actions={actions}
      >
        <div style={{ marginBottom: '15px' }}>
          <b>{selectMessage}</b>
                    These paths are relative to:<br/>
          {window.isDocker ? " the folder you shared with docker (your mounted volume)"
            : <span style={{ border: "1px solid rgba(0, 0, 0, 0.1)", borderRadius: "3px", backgroundColor: "rgba(0, 0, 0, 0.05)", padding: "2px", margin: "4px" }}>{window.currentFolder}</span>}
        </div>
        < Tree
          id="TreeContainerCutting"
          style={{ width: "100%", height: "400px", float: 'left' }}
          treeData={[]}
          handleClick={this.handleClickVisualize}
          rowHeight={30}
          activateParentsNodeOnClick={this.props.exploreOnlyDirs}
          ref="tree"
        />
      </Dialog>
    )
  }
}

FileBrowser.defaultProps = {
  exploreOnlyDirs: false,
  filterFiles: false
};


