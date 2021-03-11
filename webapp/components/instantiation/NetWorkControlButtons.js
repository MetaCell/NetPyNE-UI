import React from "react";
import IconButton from "@geppettoengine/geppetto-client/js/components/controls/iconButton/IconButton";
import { Tooltip } from "netpyne/components";

import { MODEL_STATE } from "../../constants";
import { withStyles } from "@material-ui/core/styles";

const styles = ({ spacing }) => ({
  container: {
    position: "absolute",
    top: spacing(35.5),
    left: '45px',
  },
  innerContainer: { position: "relative" },
  buttons: {
    width: "24px !important",
    height: "24px !important",
    position: "absolute",
    minWidth: "24px !important",
    padding: "3px 8px"
  },
});

class NetWorkControlButtons extends React.Component {
  render () {
    const { classes, modelState, canvasBtnCls, controlPanelShow } = this.props

    return (
      <div className={classes.container}>
        <div style={{ position: 'relative' }}>

          <Tooltip
            title={"Control panel"}
            placement="left"
            className={canvasBtnCls}
          >
            <div>
              <IconButton
                className={classes.buttons}
                onClick={controlPanelShow}
                icon={"fa-list"}
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
