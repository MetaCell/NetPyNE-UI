import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import TimeRange from "../TimeRange";
import {
  NetPyNEInclude,
  NetPyNEField,
  SelectField,
  ListComponent,
} from "netpyne/components";

export default class PlotSpikeStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var tag = "simConfig.analysis['iplotSpikeStats']";
    return (
      <Box className={`scrollbar scroll-instances`} mt={1}>
        <NetPyNEInclude
          id={"simConfig.analysis.plotSpikeStats.include"}
          model={tag + "['include']"}
          defaultOptions={["all", "allCells", "allNetStims"]}
          initialValue={"all"}
        />

        <NetPyNEField id="simConfig.analysis.plotSpikeStats.timeRange">
          <TimeRange model={tag + "['timeRange']"} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotSpikeStats.popColors"
          className="listStyle"
        >
          <ListComponent model={tag + "['popColors']"} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotSpikeStats.graphType"
          className="listStyle"
        >
          <SelectField model={tag + "['graphType']"} />
        </NetPyNEField>

        <NetPyNEField
          id="simConfig.analysis.plotSpikeStats.stats"
          className="listStyle"
        >
          <SelectField model={tag + "['stats']"} />
        </NetPyNEField>
      </Box>
    );
  }
}
