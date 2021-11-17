import React, { Component, createRef } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from './Tooltip';

const styles = ({
  spacing,
  palette,
}) => ({
  root: {},
  text: {
    color: palette.text.secondary,
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  icon: {
    padding: 0,
    opacity: 0.7,
    fontSize: '1.2em',
    marginLeft: '0.3em',
  },
});

class RulePath extends Component {
  state = { open: false };

  textAreaRef = createRef();

  copyCodeToClipboard = () => {
    const el = this.textAreaRef.current;

    if (document.selection) {
      const range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select()
        .createTextRange();
    } else if (window.getSelection) {
      const range = document.createRange();
      range.selectNode(el);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    document.execCommand('copy');
    this.clearSelection();
    this.setState({ open: true });
  };

  clearSelection () {
    if (window.getSelection) {
      window.getSelection()
        .removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  }

  render () {
    const {
      text,
      style,
      classes,
      ...others
    } = this.props;
    if (!text || text.includes('undefined')) {
      return null;
    }
    return (
      <div className={classes.root} style={style} {...others}>
        <Typography variant="caption" className={classes.text} ref={this.textAreaRef}>
          {text}
          <span>
            <Tooltip title="Copy" placement="top">
              <IconButton
                aria-label="delete"
                padding=""
                size="small"
                className={classes.icon}
                onClick={() => this.copyCodeToClipboard()}
              >
                <FileCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>

          </span>
        </Typography>

        <Snackbar
          open={this.state.open}
          autoHideDuration={3000}
          onClose={() => this.setState({ open: false })}
        >
          <MuiAlert elevation={6} variant="filled" severity="success">Copied to clipboard</MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles)(RulePath);
