import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles'
import { bgLight } from 'root/theme'
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from './Tooltip'

const styles = ({ spacing, shape }) => ({
  root: { display: 'flex', },
  adornment: { display: 'flex', alignItems: 'center' },
  filter: { flex: 1, backgroundColor: bgLight },
  underline: {
    "&&&:before": {},
    "&&:after": {}
  },
  listbox: { color: 'white', maxHeight: '20vh' }
})

class Filter extends Component {
  state = { open: false }

  render () {
    const { value, handleFilterChange, options, label, classes, ...others } = this.props

    return (
      <Autocomplete
        open={this.state.open}
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        className={classes.filter}

        clearOnEscape
        autoComplete
        openOnFocus
        autoHighlight
        value={value === '' ? null : value}
        options={options}
        openText={''}
        closeText={''}
        clearText={''}
        closeIcon={
          <Tooltip title="Clear" placement="top">
            <CloseIcon fontSize="small"/>
          </Tooltip>
        }
        popupIcon={
          <Tooltip title={this.state.open ? "Close" : "Open"} placement="top">
            <ExpandMoreIcon/>
          </Tooltip>
        }
        classes={{ inputRoot: classes.underline, listbox: classes.listbox }}
        onChange={(event, newValue) => handleFilterChange(newValue)}
        renderInput={props =>
          <TextField {...props} variant="filled" label={label}/>}
        {...others}
      />

    )
  }
}

export default withStyles(styles)(Filter)