import React, { useState } from 'react';
import 'react-sortable-tree/style.css';
import Tree from '@geppettoengine/geppetto-client/js/components/interface/tree/Tree';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const useStyles = (theme) => ({
  root: {
    '& .treeViewerSearch': {
      marginTop: theme.spacing(1),
    },
  },
});

const ParameterTreeSelection = (props) => {
  const [treeData, setTreeData] = useState(props.data);
  const { classes } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [treeStyle, setTreeStyle] = useState({ width: '100%' });
  const setQuery = (value) => {
    setTreeStyle({ ...treeStyle, height: value === '' ? '0px' : '250px' });
    setSearchQuery(value);
  };

  const treeOptionSelection = (event, rowInfo) => {
    // alert('tree selection')
    setSearchQuery(rowInfo.node.data || rowInfo.node.title);
    setTreeStyle({ ...treeStyle, height: '0px' });
  };
  const [expand, setExpand] = useState(false);
  const toggleExpand = () => {
    setExpand(!expand);
    setTreeStyle({ ...treeStyle, height: expand ? '0px' : '250px' });
  };

  return (
    <Tree
      style={treeStyle}
      treeData={treeData}
      // handleClick={treeOptionSelection}
      rowHeight={35}
      toggleMode={false}
      searchQuery={searchQuery}
      controls={(
        <TextField
          label="Type or select parameter"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <ExpandMoreIcon onClick={toggleExpand} />
            ),
          }}
          className={classes.treeViewerSearch}
        />
      )}
      onlyExpandSearchedNodes={true}
      classes={classes.treeViewer}
    />
  );
};

export default withStyles(useStyles)(ParameterTreeSelection);
