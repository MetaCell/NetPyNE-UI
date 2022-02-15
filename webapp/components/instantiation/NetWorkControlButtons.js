import React from 'react';
import { Tooltip } from 'netpyne/components';
import { withStyles } from '@material-ui/core/styles';
// TODO: this button replaced the old iconbutton from the geppetto-client, probably to fix
import Button from '@material-ui/core/Button';

const styles = ({ spacing }) => ({
  container: {
    position: 'absolute',
    top: spacing(35.5),
    left: '45px',
  },
  innerContainer: { position: 'relative' },
  buttons: {
    width: '24px !important',
    height: '24px !important',
    position: 'absolute',
    minWidth: '24px !important',
    padding: '3px 8px',
  },
});

class NetWorkControlButtons extends React.Component {
  render () {
    const {
      classes,
      canvasBtnCls,
      controlPanelShow,
    } = this.props;

    return (
      <div className={classes.container}>
        <div style={{ position: 'relative' }}>

          <Tooltip
            title="Control panel"
            placement="left"
            className={canvasBtnCls}
          >
            <div>
              <Button
                className={classes.buttons}
                onClick={controlPanelShow}
                icon="fa-list"
                id="ControlPanelButton"
              />
            </div>
          </Tooltip>

        </div>
      </div>
    );
  }
}

export default withStyles(styles)(NetWorkControlButtons);
