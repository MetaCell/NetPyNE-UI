import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import SvgIcon from '@material-ui/core/SvgIcon';
import Checkbox from '../general/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Utils from '../../Utils';
import FontIcon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { pink } from '@material-ui/core/colors';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const pink400 = pink[400];
const RocketIcon = props => (<SvgIcon {...props}><svg viewBox="0 0 512 512"><path d="M505.1 19.1C503.8 13 499 8.2 492.9 6.9 460.7 0 435.5 0 410.4 0 307.2 0 245.3 55.2 199.1 128H94.9c-18.2 0-34.8 10.3-42.9 26.5L2.6 253.3c-8 16 3.6 34.7 21.5 34.7h95.1c-5.9 12.8-11.9 25.5-18 37.7-3.1 6.2-1.9 13.6 3 18.5l63.6 63.6c4.9 4.9 12.3 6.1 18.5 3 12.2-6.1 24.9-12 37.7-17.9V488c0 17.8 18.8 29.4 34.7 21.5l98.7-49.4c16.3-8.1 26.5-24.8 26.5-42.9V312.8c72.6-46.3 128-108.4 128-211.1.1-25.2.1-50.4-6.8-82.6zM400 160c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z"></path></svg></SvgIcon>);

export default class Transition extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      openDialog: false,
      haveInstData: false,
      parallelSimulation: false,
      instantiateButtonHovered: false,
      simulateButtonHovered: false
    };
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.clickOnTab != prevProps.clickOnTab) {
      if (this.props.tab != prevProps.tab && this.props.tab == 'simulate') {
        if (this.props.fastForwardSimulation) { // re instantiate and re simulate network
          this.setState({ openDialog: true })
        } else if (this.props.fastForwardInstantiation) { // re instantiate network but do not simulate
          this.instantiate({ usePrevInst: false })    
        } else {
          if (!this.state.haveInstData) { // if there is no previous instance data
            Utils.evalPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
              .then(response => {
                // FIXME: Checking if the contructor name is an array is clearly the wrong approach
                if (response.constructor.name == 'Array'){
                  this.instantiate({ usePrevInst: this.props.fastForwardInstantiation ? false : response[0] })
                } else if (response.haveInstance){
                  this.instantiate({ usePrevInst: true, haveInstData: true })
                }
              }) 
          } else { // if has prev instance data
            this.instantiate({ usePrevInst: true })
          }
        }
      }
    }
  }

    instantiate = args => {
      GEPPETTO.CommandController.log("The NetPyNE model is getting instantiated...");
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.INSTANTIATING_MODEL);
      this.closeTransition();
      Utils.evalPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [args])
        .then(response => {
          if (!this.processError(response)) {
            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
            if (!args.usePrevInst) {
              this.props.handleDeactivateInstanceUpdate(true)
            }
            GEPPETTO.Manager.loadModel(response);
            GEPPETTO.CommandController.log("The NetPyNE model instantiation was completed");
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.setState({ haveInstData: true })
          }
        });
    }

    simulate = () => {
      this.setState({ openDialog: false })
      GEPPETTO.CommandController.log("The NetPyNE model is getting simulated...");
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.RUNNING_SIMULATION);
      this.closeTransition();
      Utils.evalPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [{ usePrevInst: this.props.freezeInstance, parallelSimulation: this.state.parallelSimulation, cores:this.state.cores }])
        .then(response => {
          if (!this.processError(response)) {
            GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, GEPPETTO.Resources.PARSING_MODEL);
            this.props.handleDeactivateSimulationUpdate(true)
            if (!this.props.freezeInstance) {
              this.props.handleDeactivateInstanceUpdate(true)
            }
            GEPPETTO.Manager.loadModel(response);
            GEPPETTO.CommandController.log("The NetPyNE model simulation was completed");
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
            this.setState({ haveInstData: true })
          }
        });    
    }

    processError (response) {
      var parsedResponse = Utils.getErrorResponse(response);
      if (parsedResponse) {
        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
        this.setState({ openDialog: true, errorMessage: parsedResponse['message'], errorDetails: parsedResponse['details'] })
        return true;
      }
      return false;
    }
    
    closeTransition = () => {
      this.setState({ openDialog: false });
    }
    
    render () {
      var children = this.state.errorDetails ? Utils.parsePythonException(this.state.errorDetails) : <div/>
      var title = this.state.errorMessage ? this.state.errorMessage : "NetPyNE";
        
      if (this.state.openDialog) {
        if (this.state.errorMessage == undefined) {
          children = (
            <div>
              <div>We are about to instantiate and simulate your network, this could take some time.</div>
              <Checkbox label="Run parallel simulation" checked={this.state.parallelSimulation} onChange={() => this.setState(oldState => ({ parallelSimulation: !oldState.parallelSimulation }))} style={{ marginTop: '35px' }} id="runParallelSimulation" />
              <TextField label="Number of cores" onChange={event => this.setState({ cores: event.target.value })} className="netpyneRightField" type="number"/>
            </div>
          )
          var actions = [
            <Button 
              label="CANCEL"
              onClick={() => this.closeTransition()} 
              key={"cancelActionBtn"} 
            >CANCEL</Button>, 
            <Button 
              onClick={() => this.simulate()} id={"okRunSimulation"}
              color="primary"
              key={"runSimulationButton"} 
            >Simulation</Button>
          ];
        } else {
          var actions = (
            <Button
              onClick={() => this.closeTransition() }
              key={"cancelActionBtn"}
              color="primary"
            >CANCEL</Button>
          )
        }
      }

      if (this.props.tab == 'simulate' ) {
        var refreshInstanceButton = (
          <IconButton 
            color='secondary' 
            id={"refreshInstanciatedNetworkButton"} 
            key={"refreshInstanceButton"}
            className="fa fa-refresh"
            onClick={() => this.instantiate({ usePrevInst: false })} 
            style={{ position: 'absolute', right: 30, top: 80, zIndex: 1 }} 
            tooltip-data={this.props.freezeInstance ? "Your network is in sync" : "Synchronise network"} 
            disabled={this.props.freezeInstance} 
          />
        )
        var refreshSimulationButton = (
          <IconButton 
            color='secondary' 
            id={"launchSimulationButton"} 
            key={"refreshSimulationButton"} 
            className="fa fa-rocket"
            onClick={() => this.setState({ openDialog: true })} 
            style={{ position: 'absolute', right: 30, top: 120, zIndex: 1 }} 
            tooltip-data={this.props.freezeSimulation ? "You have already simulated your network" : "Simulate your network"} 
            disabled={this.props.freezeSimulation} 
          />
        )
      }
        
      return (
        <div>
          {refreshInstanceButton}
          {refreshSimulationButton}

          <Dialog
            open={this.state.openDialog}
            onClose={this.closeTransition}
            style={{ whiteSpace: "pre-wrap" }}
          >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              {children}
            </DialogContent>
            <DialogActions>
              {actions}
            </DialogActions>
          </Dialog>
        </div>
      )
    }
}
