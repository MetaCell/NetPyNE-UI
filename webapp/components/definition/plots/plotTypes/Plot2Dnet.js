import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import {
  NetPyNEInclude,
  NetPyNEField,
  SelectField,
  NetPyNECheckbox,
} from "netpyne/components";

export default class Plot2Dnet extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const tag = "simConfig.analysis['iplot2Dnet']";
    return (
      <Box className={`scrollbar scrollchild`} mt={1}>
        <NetPyNEInclude
          id={"simConfig.analysis.plot2Dnet.include"}
          model={tag + "['include']"}
          defaultOptions={["all", "allCells", "allNetStims"]}
          initialValue={"all"}
        />

        <NetPyNEField
          id="simConfig.analysis.plot2Dnet.view"
          className="listStyle"
        >
          <SelectField model={tag + "['view']"} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plot2Dnet.showConns"
          className={"netpyneCheckbox"}
        >
          <NetPyNECheckbox model={tag + "['showConns']"} />
        </NetPyNEField>
      </Box>
    );
  }
}
