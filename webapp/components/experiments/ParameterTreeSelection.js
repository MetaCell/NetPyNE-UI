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

  // play with tree height to give a dropdown view instead of always open
  const hideTreeStructure = (hide) => {
    setTreeStyle({ ...treeStyle, height: hide ? '0px' : '250px' });
  };

  const setQuery = (value) => {
    hideTreeStructure(value === '');
    setSearchQuery(value);
  };

  const [tempSelection, setTempSelection] = useState('');
  const treeOptionSelection = (event, rowInfo) => {
    const { title, children } = rowInfo.node;
    if (title && (children && children.length > 0)) {
      setTempSelection(`${tempSelection + title}.`);
    }
    if (!children || children.length === 0) {
      setSearchQuery(tempSelection + title);
      setTempSelection('');
      hideTreeStructure(true);
    }
  };

  // make tree appear like a autocomplete dropdown, toggle visibility on textfield click
  const [expand, setExpand] = useState(false);
  const toggleExpand = () => {
    setExpand(!expand);
    hideTreeStructure(expand);
  };

  return (
    <Tree
      style={treeStyle}
      treeData={treeData}
      handleClick={treeOptionSelection}
      rowHeight={35}
      toggleMode={false}
      searchQuery={searchQuery}
      controls={(
        <TextField
          label="Type or select parameter"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setQuery(e.target.value)}
          onClick={toggleExpand}
          InputProps={{
            endAdornment: (
              <ExpandMoreIcon />
            ),
          }}
          className={classes.treeViewerSearch}
        />
      )}
      onlyExpandSearchedNodes
    />
  );
};

export default withStyles(useStyles)(ParameterTreeSelection);
