import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import { bgRegular } from '../../theme'
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from './Tooltip'

const styles = ({ spacing, shape }) => ({
  root: {
    marginTop: spacing(1),
    marginBottom: spacing(1),
    display: 'flex',
    backgroundColor: bgRegular,
    borderRadius: shape.borderRadius
  },
  adornment: { display: 'flex', alignItems: 'center', paddingLeft: spacing(1) },
  filter: { flex: 1, paddingRight: spacing(1), paddingTop: spacing(1), paddingBottom: spacing(1) },
  underline: {
    "&&&:before": { borderBottom: "none" },
    "&&:after": { borderBottom: "none" }
  },
  listbox: { color: 'white', maxHeight: '20vh' }
})
class Filter extends Component {
  state = { open: false }
  render () {
    const { value, handleFilterChange, options, label, classes, ...others } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.adornment}>
          <Icon className="fa fa-filter"/>
        </div>
        
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
              <CloseIcon fontSize="small" />
            </Tooltip>
          }
          popupIcon={
            <Tooltip title={this.state.open ? "Close" : "Open"} placement="top">
              <ExpandMoreIcon />
            </Tooltip>
          }
          classes={{ inputRoot: classes.underline, listbox: classes.listbox }}
          onChange={(event, newValue) => handleFilterChange(newValue)}
          renderInput={props => <TextField {...props} label={label}/>}
          {...others}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Filter)