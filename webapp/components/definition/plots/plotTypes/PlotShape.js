import React, { Component } from 'react';

import {
  NetPyNEField,
  NetPyNECheckbox,
  NetPyNETextField,
  NetPyNESelectField,
  ListComponent
} from 'netpyne/components';

export default class PlotShape extends React.Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    var tag = "simConfig.analysis['plotShape']"
    return <div>
      <NetPyNEField id="simConfig.analysis.plotShape.includePre" className="listStyle" >
        <ListComponent model={tag + "['includePre']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.includePost" className="listStyle" >
        <ListComponent model={tag + "['includePost']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.synStyle" >
        <NetPyNETextField model={tag + "['synStyle']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.dist" >
        <NetPyNETextField model={tag + "['dist']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.synSize" >
        <NetPyNETextField model={tag + "['synSize']"} />
      </NetPyNEField>

      <NetPyNEField id={"simConfig.analysis.plotShape.cvar"} >
        <NetPyNESelectField model={tag + "['cvar']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.cvals" className="listStyle" >
        <ListComponent model={tag + "['cvals']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.bkgColor" className="listStyle" >
        <ListComponent model={tag + "['bkgColor']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.ivprops" >
        <NetPyNETextField model={tag + "['ivprops']"} />
      </NetPyNEField>

      <NetPyNEField id="simConfig.analysis.plotShape.iv" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['iv']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.includeAxon" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['includeAxon']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.showSyns" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['showSyncs']"} />
      </NetPyNEField>
      
      <NetPyNEField id="simConfig.analysis.plotShape.showElectrodes" className={"netpyneCheckbox"} >
        <NetPyNECheckbox model={tag + "['showElectrodes']"} />
      </NetPyNEField>
    </div>
  }
}
