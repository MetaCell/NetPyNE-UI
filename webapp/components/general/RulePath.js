import React, { Component, createRef } from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from './Tooltip';
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = ({ spacing, palette }) => ({ 
  root: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: `0px ${spacing(1)}px 0px ${spacing(1)}px` },
  text: { color: palette.text.secondary },
  icon: { marginRight: 2 }
})

class RulePath extends Component {
  state = { open: false }
  textAreaRef = createRef()

  copyCodeToClipboard = () => {
    const el = this.textAreaRef.current

    if (document.selection) {
      const range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select().createTextRange();
    } else if (window.getSelection) {
      const range = document.createRange();
      range.selectNode(el);

      const selection = window.getSelection()
      selection.removeAllRanges(); 
      selection.addRange(range);
    }
    document.execCommand("copy");
    this.clearSelection()
    this.setState({ open: true })
  }

  clearSelection () {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  }

  render () {
    const { text, style, classes, ...others } = this.props
    if (!text || text.includes("undefined")) {
      return null;
    }
    return (
      <div className={classes.root} style={style} {...others}>
        <Typography variant="caption" className={classes.text} ref={this.textAreaRef}>{text}</Typography>
        
        <div className={classes.icon}>
          <Tooltip title="Copy" placement="top">
            <div>
              <IconButton aria-label="delete" size="small" onClick={() => this.copyCodeToClipboard()}>
                <FileCopyIcon fontSize="inherit"/>
              </IconButton>
            </div>
            
          </Tooltip>
          
        </div>
        
        <Snackbar open={this.state.open} autoHideDuration={3000} onClose={() => this.setState({ open: false })}>
          <MuiAlert elevation={6} variant="filled" severity="success">Copied to clipboard</MuiAlert>
        </Snackbar>
      </div>
    )
  }
}

export default withStyles(styles)(RulePath)