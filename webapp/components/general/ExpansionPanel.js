import React, { Component } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from './Tooltip';

const styles = ({ spacing }) => ({ button: { marginRight: 0 } });

class NetPyNEAccordion extends Component {
  constructor (props) {
    super(props);
    this.state = { expanded: false };
  }

  render () {
    const {
      children,
      classes,
      ...others
    } = this.props;
    const [summary, ...details] = children;

    return (
      <Accordion expanded={this.state.expanded} {...others}>
        <AccordionSummary
          IconButtonProps={{
            onClick: () => this.setState((prevState) => ({ expanded: !prevState.expanded })),
            className: classes.button,
          }}
          expandIcon={(
            <Tooltip
              title={this.state.expanded ? 'Collapse' : 'Expand'}
              placement="top"
            >
              {this.state.expanded ? <ExpandLessIcon color="inherit" />
                : <ExpandMoreIcon color="inherit" />}
            </Tooltip>
          )}
        >
          {summary}
        </AccordionSummary>
        <AccordionDetails>
          {details}
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default withStyles(styles)(NetPyNEAccordion);
