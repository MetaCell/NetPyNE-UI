import React, { Component } from 'react';
import FontIcon from '@material-ui/core/Icon';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { bgDark } from '../../../theme'
import {
  NetPyNEField,
  NetPyNECheckbox,
  NetPyNETextField,
  SelectField,
  ListComponent,
  GridLayout
} from 'netpyne/components';

class NetPyNESimConfig extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      model: props.model,
      selectedIndex: 0,
      sectionId: "General"
    };
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({ model: nextProps.model });
  }

  select = (index, sectionId) => this.setState({ selectedIndex: index, sectionId: sectionId });

  render () {
    var contentLeft = <div/>;
    var contentRight = <div/>;
    if (this.state.sectionId == 'General') {
      contentLeft = (
        <div>
          <NetPyNEField id="simConfig.duration" >
            <NetPyNETextField fullWidth variant="filled" model={"simConfig.duration"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.dt" >
            <NetPyNETextField fullWidth variant="filled" model={"simConfig.dt"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.printRunTime" >
            <NetPyNETextField fullWidth variant="filled" model={"simConfig.printRunTime"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.hParams" className="listStyle">
            <ListComponent model={"simConfig.hParams"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.seeds" className="listStyle">
            <ListComponent model={"simConfig.seeds"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.checkErrors" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.checkErrors"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.checkErrorsVerbose" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.checkErrorsVerbose"} />
          </NetPyNEField>
        </div>
      )
      contentRight = (
        <div >
          <NetPyNEField id="simConfig.createNEURONObj" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.createNEURONObj"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.createPyStruct" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.createPyStruct"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.addSynMechs" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.addSynMechs"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.includeParamsLabel" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.includeParamsLabel"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.timing" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.timing"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.verbose" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.verbose"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.compactConnFormat" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.compactConnFormat"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.connRandomSecFromList" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.connRandomSecFromList"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.printPopAvgRates" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.printPopAvgRates"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.printSynsAfterRule" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.printSynsAfterRule"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.gatherOnlySimData" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.gatherOnlySimData"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.cache_efficient" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.cache_efficient"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.cvode_active" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.cvode_active"} />
          </NetPyNEField>
        </div>
      )
        
    } else if (this.state.sectionId == 'SaveConfiguration') {
      contentLeft = (
        <div>
          <NetPyNEField id="simConfig.simLabel" >
            <NetPyNETextField fullWidth variant="filled" model={"simConfig.simLabel"} />
          </NetPyNEField>

          {
            !window.isDocker
              && <NetPyNEField id="simConfig.saveFolder" >
                <NetPyNETextField fullWidth variant="filled" model={"simConfig.saveFolder"} />
              </NetPyNEField>
          }

          <NetPyNEField id="simConfig.filename" >
            <NetPyNETextField fullWidth variant="filled" model={"simConfig.filename"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.saveDataInclude" className="listStyle">
            <ListComponent model={"simConfig.saveDataInclude"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.backupCfgFile" >
            <NetPyNETextField fullWidth variant="filled" model={"simConfig.backupCfgFile"} />
          </NetPyNEField>

        </div>
      )
      contentRight = (
        <div >
          <NetPyNEField id="simConfig.saveJson" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.saveJson"} />
          </NetPyNEField>
            
          <NetPyNEField id="simConfig.savePickle" className={"netpyneCheckbox"}>
            <NetPyNECheckbox model={"simConfig.savePickle"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.saveMat" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.saveMat"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.saveCellSecs" className={"netpyneCheckbox "}>
            <NetPyNECheckbox model={"simConfig.saveCellSecs"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.saveCellConns" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.saveCellConns"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.timestampFilename" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.timestampFilename"} />
          </NetPyNEField>

          {/* <NetPyNEField id="simConfig.saveHDF5" className={"netpyneCheckbox"} >
              <NetPyNECheckbox model={"simConfig.saveHDF5"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveDpk" className={"netpyneCheckbox"} >
              <NetPyNECheckbox model={"simConfig.saveDpk"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveDat" className={"netpyneCheckbox"} >
              <NetPyNECheckbox model={"simConfig.saveDat"} />
            </NetPyNEField>

            <NetPyNEField id="simConfig.saveCSV" className={"netpyneCheckbox"} >
              <NetPyNECheckbox model={"simConfig.saveCSV"} />
            </NetPyNEField> */}

          <NetPyNEField id="simConfig.saveTiming" className={"netpyneCheckbox"} >
            <NetPyNECheckbox model={"simConfig.saveTiming"} />
          </NetPyNEField>
        </div>
      )
    } else if (this.state.sectionId == 'Record') {
      contentLeft = (
        <div>
          <NetPyNEField id="simConfig.recordCells" className={"listStyle"} >
            <ListComponent model={"simConfig.recordCells"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.recordTraces" className={"listStyle"} >
            <ListComponent model={"simConfig.recordTraces"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.recordLFP" className={"listStyle"}>
            <ListComponent model={"simConfig.recordLFP"} />
          </NetPyNEField>

          <NetPyNEField id="simConfig.recordStep" >
            <NetPyNETextField fullWidth variant="filled" model={"simConfig.recordStep"} />
          </NetPyNEField>
            
        </div>
      )
      contentRight = (
        <div >
          <NetPyNEField id="simConfig.saveLFPCells" className={"netpyneCheckbox"} style={{ marginTop: 25 }}>
            <NetPyNECheckbox model={"simConfig.saveLFPCells"} />
          </NetPyNEField>
            
          <NetPyNEField id="simConfig.recordStim" className={"netpyneCheckbox"} style={{ marginTop: 25 }}>
            <NetPyNECheckbox model={"simConfig.recordStim"} />
          </NetPyNEField>
        </div>
      )
    } else if (this.state.sectionId == 'netParams') {
      var contentLeft = (
        <div >
          <NetPyNEField id="netParams.scale" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.scale"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.defaultWeight" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.defaultWeight"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.defaultDelay" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.defaultDelay"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.scaleConnWeight" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.scaleConnWeight"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.scaleConnWeightNetStims" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.scaleConnWeightNetStims"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.scaleConnWeightModels" className={"listStyle"}>
            <ListComponent model={"netParams.scaleConnWeightModels"} />
          </NetPyNEField>

        </div>
      )
      contentRight = (
        <div >
          <NetPyNEField id="netParams.sizeX" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.sizeX"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.sizeY" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.sizeY"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.sizeZ" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.sizeZ"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.propVelocity" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.propVelocity"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.shape">
            <SelectField variant="filled" model={"netParams.shape"} />
          </NetPyNEField>

          <NetPyNEField id="netParams.rotateCellsRandomly" >
            <NetPyNETextField fullWidth variant="filled" model={"netParams.rotateCellsRandomly"} />
          </NetPyNEField>

        </div>
      )
    }
    const { classes } = this.props
    return (
      <div className={ classes.root }>
        <BottomNavigation component={Paper} showLabels className={classes.bottomNav} value={this.state.selectedIndex}>
          <BottomNavigationAction id={"configGeneral"} key={'General'} label={'General'} icon={<FontIcon className={"fa fa-bars"} />} onClick={() => this.select(0, 'General')} />
          <BottomNavigationAction id={"configRecord"} key={'Record'} label={'Record'} icon={<FontIcon className={"fa fa-circle"} />} onClick={() => this.select(1, 'Record')} />
          <BottomNavigationAction id={"configSaveConfiguration"} key={'SaveConfiguration'} label={'Save Configuration'} icon={<FontIcon className={"fa fa-floppy-o"} />} onClick={() => this.select(2, 'SaveConfiguration')} />
          <BottomNavigationAction id={"confignetParams"} key={'netParams'} label={'Network Attributes'} icon={<FontIcon className={"fa fa-cog"} />} onClick={() => this.select(3, 'netParams')} />
        </BottomNavigation>
        <GridLayout className={classes.layout}>
          <div/>
          {contentLeft}
          {contentRight}
        </GridLayout>
      </div>
      
    );
  }
}

const styles = ({ shape, spacing }) => ({ 
  root: { height: `calc(100% - 56px - ${spacing(1)}px)`, flexDirection: 'column' },
  bottomNav: {
    borderRadius: shape.borderRadius, 
    backgroundColor: bgDark,
    overflow: 'hidden'
  },
  layout: { height: "100%", display: 'flex' }
  
})

export default withStyles(styles)(NetPyNESimConfig)