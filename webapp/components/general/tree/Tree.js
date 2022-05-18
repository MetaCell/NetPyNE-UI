import React from 'react';

var SortableTree = require('react-sortable-tree').default;
var toggleExpandedForAll = require('react-sortable-tree').toggleExpandedForAll;
var changeNodeAtPath = require('react-sortable-tree').changeNodeAtPath;
var walk = require('react-sortable-tree').walk;
require('./Tree.less');

export default class Tree extends React.Component {
  constructor (props) {
    super(props);

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.state = { treeData: this.props.treeData };
  }

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  handleClick(event, rowInfo) {
    var toggleMode = this.props.toggleMode;
    var currentTreeData = this.state.treeData;
    // If node has children, we expand/collapse the node
    if (
      rowInfo.node.children != undefined &&
      rowInfo.node.children.length > 0
    ) {
      // If parents can be activate, iterate over the whole tree
      if (this.props.activateParentsNodeOnClick) {
        walk({
          treeData: currentTreeData,
          getNodeKey: ({ treeIndex }) => treeIndex,
          ignoreCollapsed: true,
          callback: (rowInfoIter) => {
            var isActive = rowInfoIter.treeIndex == rowInfo.treeIndex;
            /*
             * If toggleMode just toggle to activate/inactivate selected node and expand/collapse
             * If non toggle mode inactive all nodes but selected and expand/collapse
             */
            if (isActive && toggleMode) {
              rowInfoIter.node.active = !rowInfoIter.node.active;
              rowInfoIter.node.expanded = !rowInfoIter.node.expanded;
              currentTreeData = changeNodeAtPath({
                treeData: currentTreeData,
                path: rowInfoIter.path,
                newNode: rowInfoIter.node,
                getNodeKey: ({ treeIndex }) => treeIndex,
                ignoreCollapsed: true,
              });
            } else if (isActive && !toggleMode) {
              rowInfoIter.node.active = isActive;
              rowInfoIter.node.expanded = !rowInfoIter.node.expanded;
              currentTreeData = changeNodeAtPath({
                treeData: currentTreeData,
                path: rowInfoIter.path,
                newNode: rowInfoIter.node,
                getNodeKey: ({ treeIndex }) => treeIndex,
                ignoreCollapsed: true,
              });
            } else if (isActive != rowInfoIter.node.active && !toggleMode) {
              rowInfoIter.node.active = isActive;
              currentTreeData = changeNodeAtPath({
                treeData: currentTreeData,
                path: rowInfoIter.path,
                newNode: rowInfoIter.node,
                getNodeKey: ({ treeIndex }) => treeIndex,
                ignoreCollapsed: true,
              });
            }
          },
        });
      } else {
        rowInfo.node.expanded = !rowInfo.node.expanded;
        currentTreeData = changeNodeAtPath({
          treeData: currentTreeData,
          path: rowInfo.path,
          newNode: rowInfo.node,
          getNodeKey: ({ treeIndex }) => treeIndex,
          ignoreCollapsed: true,
        });
      }
    } else if (rowInfo.node.children == undefined) {
      // If node has no children, we select the node
      walk({
        treeData: currentTreeData,
        getNodeKey: ({ treeIndex }) => treeIndex,
        ignoreCollapsed: true,
        callback: (rowInfoIter) => {
          var isActive = rowInfoIter.treeIndex == rowInfo.treeIndex;
          /*
           * If toggleMode just toggle to activate/inactivate selected node
           * If non toggle mode inactive all nodes but selected
           */
          if (isActive && toggleMode) {
            rowInfoIter.node.active = !rowInfoIter.node.active;
            currentTreeData = changeNodeAtPath({
              treeData: currentTreeData,
              path: rowInfoIter.path,
              newNode: rowInfoIter.node,
              getNodeKey: ({ treeIndex }) => treeIndex,
              ignoreCollapsed: true,
            });
          } else if (isActive != rowInfoIter.node.active && !toggleMode) {
            rowInfoIter.node.active = isActive;
            currentTreeData = changeNodeAtPath({
              treeData: currentTreeData,
              path: rowInfoIter.path,
              newNode: rowInfoIter.node,
              getNodeKey: ({ treeIndex }) => treeIndex,
              ignoreCollapsed: true,
            });
          }
        },
      });
    }

    // Update tree with latest changes
    this.updateTreeData(currentTreeData);

    // If there is a callback, we use it
    if (this.props.handleClick != undefined) {
      this.props.handleClick(event, rowInfo);
    }
  }

  getNodeProps(rowInfo) {
    var nodeProps = {};
    nodeProps['onClick'] = (event) => this.handleClick(event, rowInfo);

    if (this.props.getButtons !== undefined) {
      nodeProps['buttons'] = this.props.getButtons(rowInfo);
    }
    if (rowInfo.node.instance !== undefined) {
      nodeProps['style'] = { cursor: 'pointer' };
    }
    if (rowInfo.node.active) {
      nodeProps['className'] = 'activeNode';
    }
    if (this.props.getNodesProps !== undefined) {
      nodeProps['title'] = this.props.getNodesProps(rowInfo);
    }
    return nodeProps;
  }

  render() {
    var onlyExpandSearchedNodes =
      this.props.searchQuery !== undefined && this.props.searchQuery !== null;
    return (
      <div
        key={this.props.id + '_component'}
        id={this.props.id + '_component'}
        className="treeViewer"
        style={this.props.style}
      >
        {this.props.controls ? this.props.controls : null}
        <SortableTree
          style={this.props.style}
          treeData={this.state.treeData}
          canDrag={false}
          rowHeight={this.props.rowHeight}
          scaffoldBlockPxWidth={22}
          generateNodeProps={(rowInfo) => this.getNodeProps(rowInfo)}
          onChange={(treeData) => this.updateTreeData(treeData)}
          searchQuery={
            this.props.searchQuery !== undefined ? this.props.searchQuery : null
          }
          onlyExpandSearchedNodes={
            this.props.onlyExpandSearchedNodes !== undefined
              ? this.props.onlyExpandSearchedNodes
              : false
          }
        />
      </div>
    );
  }
};
