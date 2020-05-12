import React, { Component } from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Tooltip from './Tooltip'

import { withStyles } from '@material-ui/core/styles'

const styles = ({ spacing }) => ({ button: { marginRight: `${spacing(1)}px!important` } })

class NetPyNEExpansionPanel extends Component {
  state = { expanded: false }
  render () {

    const { children, classes } = this.props
    const [summary, ...details] = children

    return (
      <ExpansionPanel expanded={this.state.expanded}>
        <ExpansionPanelSummary
          IconButtonProps={{ 
            onClick: () => this.setState({ expanded: !this.state.expanded }),
            className: classes.button,
            size: 'small'
          }}
          expandIcon={
            <Tooltip
              title={this.state.expanded ? "Collapse" : "Expand"} placement="top"
            >
              {this.state.expanded ? <ExpandLessIcon fontSize="inherit"/> : <ExpandMoreIcon fontSize="inherit"/>}
            </Tooltip>
            
          }
        >
          {summary}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {details}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(NetPyNEExpansionPanel)