import React from 'react';
import Button from '@material-ui/core/Button';
import ContentAdd from '@material-ui/icons/Add';
import NavigationMoreHoriz from '@material-ui/icons/MoreHoriz';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import NetPyNECellRule from './NetPyNECellRule';
import NetPyNEThumbnail from '../../general/NetPyNEThumbnail';
import NetPyNESection from './sections/NetPyNESection';
import NetPyNESectionThumbnail from './sections/NetPyNESectionThumbnail';
import NetPyNEMechanism from './sections/mechanisms/NetPyNEMechanism';
import NetPyNENewMechanism from './sections/mechanisms/NetPyNENewMechanism';
import NetPyNEMechanismThumbnail from './sections/mechanisms/NetPyNEMechanismThumbnail';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import Dialog from '@material-ui/core/Dialog/Dialog';

import Utils from '../../../Utils';
import NetPyNEHome from '../../general/NetPyNEHome';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { withStyles } from '@material-ui/core/styles'

const styles = ({ spacing }) => ({
  arrowRight : { marginLeft: spacing(1) },
  addCellRule: { marginLeft: spacing(1) },
  sections: { marginLeft: spacing(1) }
})

export default class NetPyNECellRules extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      drawerOpen: false,
      selectedCellRule: undefined,
      selectedSection: undefined,
      selectedMechanism: undefined,
      deletedCellRule: undefined,
      deletedSection: undefined,
      errorMessage: undefined,
      errorDetails: undefined,
      page: "main"
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectCellRule = this.selectCellRule.bind(this);
    this.handleNewCellRule = this.handleNewCellRule.bind(this);
    this.deleteCellRule = this.deleteCellRule.bind(this);

    this.selectSection = this.selectSection.bind(this);
    this.handleNewSection = this.handleNewSection.bind(this);
    this.deleteSection = this.deleteSection.bind(this);

    this.selectMechanism = this.selectMechanism.bind(this);
    this.handleNewMechanism = this.handleNewMechanism.bind(this);
    this.deleteMechanism = this.deleteMechanism.bind(this);

    this.handleRenameChildren = this.handleRenameChildren.bind(this);
    this.handleRenameSections = this.handleRenameSections.bind(this);
  }

  selectPage (page, state) {
    this.setState({ page: page, ...state });
  }

  selectCellRule (cellRule) {
    this.setState({ selectedCellRule: cellRule, selectedSection: undefined, selectedMechanism: undefined });
  }

  handleNewCellRule (defaultCellRules) {
    var key = Object.keys(defaultCellRules)[0];
    var value = defaultCellRules[key];
    var { value: model } = this.state;

    // Get New Available ID
    var cellRuleId = Utils.getAvailableKey(model, key);
    var newCellRule = Object.assign({ name: cellRuleId }, value);
    // Create Cell Rule Client side
    Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + cellRuleId + '"] = ' + JSON.stringify(value));
    model[cellRuleId] = newCellRule;
    // Update state
    this.setState({
      value: model,
      selectedCellRule: cellRuleId,
      selectedSection: undefined,
      selectedMechanism: undefined
    });
  }

  selectSection (section) {
    this.setState({ selectedSection: section, selectedMechanism: undefined });
  }

  handleNewSection (defaultSectionValues) {
    let key = Object.keys(defaultSectionValues)[0];
    let value = defaultSectionValues[key];
    const { value: model, selectedCellRule } = this.state;
    
    // Get New Available ID
    var sectionId = Utils.getAvailableKey(model[selectedCellRule]['secs'], key);
    var newSection = Object.assign({ name: sectionId }, value);
    if (model[selectedCellRule]['secs'] == undefined) {
      model[selectedCellRule]['secs'] = {};
      Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"] = {}');
    }
    Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + sectionId + '"] = ' + JSON.stringify(value));
    model[selectedCellRule]["secs"][sectionId] = newSection;
    // Update state
    this.setState({
      value: model,
      selectedSection: sectionId,
      selectedMechanism: undefined
    });
  }

  selectMechanism (mechanism) {
    this.setState({ selectedMechanism: mechanism });
  }

  handleNewMechanism (mechanism) {
    const { value: model, selectedCellRule, selectedSection } = this.state;
    
    // Create Mechanism Client side
    if (model[selectedCellRule].secs[selectedSection]['mechs'] == undefined) {
      model[selectedCellRule].secs[selectedSection]['mechs'] = {};
      Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + selectedSection + '"]["mechs"] = {}');
    }
    var params = {};
    Utils
      .evalPythonMessage("netpyne_geppetto.getMechParams", [mechanism])
      .then(response => {
        response.forEach(param => params[param] = 0);
        Utils.execPythonMessage('netpyne_geppetto.netParams.cellParams["' + selectedCellRule + '"]["secs"]["' + selectedSection + '"]["mechs"]["' + mechanism + '"] = ' + JSON.stringify(params));
      })
    this.setState({
      value: model,
      selectedMechanism: mechanism
    });
  }

  hasSelectedCellRuleBeenRenamed (prevState, currentState) {
    var currentModel = prevState.value;
    var model = currentState.value;
    // deal with rename
    if (currentModel != undefined && model != undefined) {
      var oldP = Object.keys(currentModel);
      var newP = Object.keys(model);
      if (oldP.length == newP.length) {
        // if it's the same lenght there could be a rename
        for (var i = 0; i < oldP.length; i++) {
          if (oldP[i] != newP[i]) {
            if (prevState.selectedCellRule != undefined) {
              if (oldP[i] == prevState.selectedCellRule) {
                return newP[i];
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  hasSelectedSectionBeenRenamed (prevState, currentState) {
    var currentModel = prevState.value;
    var model = this.state.value;
    var currentCellRule = undefined;
    var newCellRule = undefined;

    if (prevState.value != undefined && prevState.value != undefined) {
      currentCellRule = prevState.value[currentState.selectedCellRule];
      newCellRule = currentState.value[currentState.selectedCellRule];
    }

    if (currentModel != undefined && model != undefined && prevState.selectedCellRule != undefined && currentCellRule != undefined && newCellRule != undefined) {
      // loop sections
      var oldS = Object.keys(currentCellRule.secs);
      var newS = Object.keys(newCellRule.secs);
      if (oldS.length == newS.length) {
        for (var i = 0; i < oldS.length; i++) {
          if (oldS[i] != newS[i]) {
            if (prevState.selectedSection != undefined) {
              if (oldS[i] == prevState.selectedSection) {
                return newS[i];
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  hasSelectedMechanismBeenRenamed (prevState, currentState) {
    var currentModel = prevState.value;
    var model = this.state.value;
    var currentCellRule = undefined;
    var newCellRule = undefined;
    if (prevState.value != undefined && prevState.value != undefined) {
      currentCellRule = prevState.value[currentState.selectedCellRule];
      newCellRule = currentState.value[currentState.selectedCellRule];
    }
    var currentSection = undefined;
    var newSection = undefined;
    if (currentCellRule != undefined && newCellRule != undefined) {
      currentSection = currentCellRule.secs[currentState.selectedSection];
      newSection = newCellRule.secs[currentState.selectedSection];
    }
    if (currentModel != undefined && model != undefined && prevState.selectedSection != undefined && currentSection != undefined && newSection != undefined) {
      // loop mechanisms
      var oldM = Object.keys(currentSection.mechs);
      var newM = Object.keys(newSection.mechs);
      if (oldM.length == newM.length) {
        for (var i = 0; i < oldM.length; i++) {
          if (oldM[i] != newM[i]) {
            if (prevState.selectedMechanism != undefined) {
              if (oldM[i] == prevState.selectedMechanism) {
                return newM[i];
              }
            }
          }
        }
      }
    }
    return undefined;
  }

  componentDidUpdate (prevProps, prevState) {
    // we need to check if any of the three entities have been renamed and if that's the case change the state for the selection variable
    var newCellRuleName = this.hasSelectedCellRuleBeenRenamed(prevState, this.state);
    if (newCellRuleName !== undefined) {
      this.setState({ selectedCellRule: newCellRuleName, deletedCellRule: undefined });
    } else if ((prevState.value !== undefined) && (Object.keys(prevState.value).length !== Object.keys(this.state.value).length)) {
      /*
       * logic into this if to check if the user added a new object from the python backend and
       * if the name convention pass the checks, differently rename this and open dialog to inform.
       */
      var model = this.state.value;
      for (var m in model) {
        if ((prevState.value !== "") && (!(m in prevState.value))) {
          var newValue = Utils.nameValidation(m);
          if (newValue != m) {
            newValue = Utils.getAvailableKey(model, newValue);
            model[newValue] = model[m];
            delete model[m];
            this.setState({
              value: model,
              errorMessage: "Error",
              errorDetails: "Leading digits or whitespaces are not allowed in CellRule names.\n"
                                          + m + " has been renamed " + newValue
            },
            function () {
              Utils.renameKey('netParams.cellParams', m, newValue, (response, newValue) => {});
            }.bind(this));
          }
        }
      }
    }
    var newSectionName = this.hasSelectedSectionBeenRenamed(prevState, this.state);
    if (newSectionName !== undefined) {
      this.setState({ selectedSection: newSectionName, deletedSection: undefined });
    } else if ((prevState.value !== undefined)) {
      /*
       * logic into this if to check if the user added a new object from the python backend and
       * if the name convention pass the checks, differently rename this and open dialog to inform.
       */
      var model2 = this.state.value;
      var prevModel = prevState.value;
      for (var n in model2) {
        if ((prevModel[n] !== undefined) && (Object.keys(model2[n]['secs']).length !== Object.keys(prevModel[n]['secs']).length)) {
          var cellRule = model2[n]['secs'];
          for (var s in cellRule) {
            if (!(s in prevState.value[n]['secs'])) {
              var newValue2 = Utils.nameValidation(s);
              if (newValue2 != s) {
                newValue2 = Utils.getAvailableKey(model2[n]['secs'], newValue2);
                model2[n]['secs'][newValue2] = model2[n]['secs'][s];
                delete model2[n]['secs'][s];
                this.setState({
                  value: model2,
                  errorMessage: "Error",
                  errorDetails: "Leading digits or whitespaces are not allowed in Population names.\n"
                  + s + " has been renamed " + newValue2
                },
                () => Utils.renameKey('netParams.cellParams["' + n + '"]["secs"]', s, newValue2, (response, newValue) => {}));
              }
            }
          }
        }
      }
    }
    var newMechanismName = this.hasSelectedMechanismBeenRenamed(prevState, this.state);
    if (newMechanismName !== undefined) {
      this.setState({ selectedMechanism: newMechanismName });
    }
  }

  handleHierarchyClick = nextPage => {
    const { page, selectedCellRule, value } = this.state;
    /*
     * with this herarchy navigation, the tree buttons in the breadclumb can behave  in 2 different ways
     * they can move the view to a different level (cellRule -> section) (seccions --> mechanisms) 
     * or they can add a new cellRule ( or section or mechanims) 
     * here we chech if we want to jump to a different level or if we want to create a new rule in the current level
     */
    if (nextPage === page) { 
      if (page === "main") {
        this.handleNewCellRule({ 'CellRule': { 'conds':{}, 'secs':{} } });
      } else if (page === "sections") {
        this.handleNewSection({ 'Section': { 'geom': {}, 'topol': {}, 'mechs': {} } });
      }
    } else {
      this.setState({ page: nextPage });
      if (nextPage == 'sections') { // saves one click if there are no sections
        if (Object.keys(value[selectedCellRule]['secs']).length == 0) {
          this.handleNewSection({ 'Section': { 'geom': {}, 'topol': {}, 'mechs': {} } });
        }
      }
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    var itemRenamed = this.hasSelectedCellRuleBeenRenamed(this.state, nextState) !== undefined || this.hasSelectedSectionBeenRenamed(this.state, nextState) !== undefined || this.hasSelectedMechanismBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged = this.state.selectedCellRule != nextState.selectedCellRule || this.state.selectedSection != nextState.selectedSection || this.state.selectedMechanism != nextState.selectedMechanism;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated = ((Object.keys(this.state.value).length != Object.keys(nextState.value).length));
      if (this.state.selectedCellRule != undefined && nextState.value[this.state.selectedCellRule] != undefined) {
        var oldLength = this.state.value[this.state.selectedCellRule] == undefined ? 0 : Object.keys(this.state.value[this.state.selectedCellRule].secs).length;
        newItemCreated = ((newItemCreated || oldLength != Object.keys(nextState.value[this.state.selectedCellRule].secs).length));
      }
      if (this.state.selectedSection != undefined && nextState.value[this.state.selectedCellRule] != undefined && nextState.value[this.state.selectedCellRule].secs[this.state.selectedSection] != undefined) {
        var oldLength = this.state.value[this.state.selectedCellRule].secs[this.state.selectedSection] == undefined ? 0 : Object.keys(this.state.value[this.state.selectedCellRule].secs[this.state.selectedSection].mechs).length;
        newItemCreated = (newItemCreated || oldLength != Object.keys(nextState.value[this.state.selectedCellRule].secs[this.state.selectedSection].mechs).length);
      }
    }
    var errorDialogOpen = (this.state.errorDetails !== nextState.errorDetails);
    return newModel || newItemCreated || itemRenamed || selectionChanged || pageChanged || errorDialogOpen;
  }

  deleteCellRule (name) {
    Utils.evalPythonMessage('netpyne_geppetto.deleteParam', ['cellParams', name]).then(response => {
      var model = this.state.value;
      delete model[name];
      this.setState({ value: model, selectedCellRule: undefined, deletedCellRule: name });
    });
  }

  deleteMechanism (name) {
    if (this.state.selectedCellRule != undefined && this.state.selectedSection != undefined) {
      Utils.evalPythonMessage('netpyne_geppetto.deleteParam', [[this.state.selectedCellRule, this.state.selectedSection], name]).then(response => {
        var model = this.state.value;
        delete model[this.state.selectedCellRule].secs[this.state.selectedSection]['mechs'][name];
        this.setState({ value: model, selectedMechanism: undefined });
      });
    }
  }

  deleteSection (name) {
    if (this.state.selectedCellRule != undefined) {
      Utils.evalPythonMessage('netpyne_geppetto.deleteParam', [[this.state.selectedCellRule], name]).then(response => {
        var model = this.state.value;
        delete model[this.state.selectedCellRule]['secs'][name];
        this.setState({ value: model, selectedSection: undefined, deletedSection: name });
      });
    }
  }

  handleRenameChildren (childName) {
    childName = childName.replace(/\s*$/,"");
    var childrenList = Object.keys(this.state.value);
    for (var i = 0 ; childrenList.length > i ; i++) {
      if (childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  }

  handleRenameSections (childName, leaf) {
    childName = childName.replace(/\s*$/,"");
    var childrenList = Object.keys(this.state.value[leaf]['secs']);
    for (var i = 0 ; childrenList.length > i ; i++) {
      if (childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  }

  createTooltip (rule) {
    const { value: model, page, selectedCellRule, selectedSection } = this.state;

    switch (rule) {
    case 'cellRule':
      if (page !== 'main') {
        if (selectedCellRule && selectedCellRule.length > 8 ) {
          return selectedCellRule
        } else {
          return 'Go back to rule'
        }
      } else {
        return 'Create rule'
      }

    case 'section':
      if (page === 'mechanisms') {
        if (!!selectedSection && selectedSection.length > 9 ) {
          return selectedSection
        } else {
          return 'Go back to section'
        }
      } else {
        if (page == "sections") {
          return 'Create a section'
        } else {
          if (selectedCellRule){
            if (!!model && !!model[selectedCellRule] && Object.keys(model[selectedCellRule]['secs']).length > 0) {
              return "Explore sections"
            } else {
              return "Create first section"
            }
          } else {
            return "No rule selected" 
          }
        }
      }
    }
  }

  createLabel (rule){
    const { value: model, page, selectedCellRule, selectedSection } = this.state;
    switch (rule) {
    case 'cellRule':
      if (page !== 'main'){
        if (selectedCellRule.length > 6 ){
          return selectedCellRule.slice(0,5) + '...'
        } else {
          return selectedCellRule
        }
      } else {
        return <ContentAdd/>
      }

    case 'sections':
      if ( page === 'mechanisms' ) {
        if (selectedSection != undefined) {
          if (selectedSection.length > 9 ) {
            return selectedSection.slice(0,7) + "..."
          } else {
            return selectedSection
          }
        } else {
          return ''
        }
      } else {
        if (page == "sections" ) {
          return <ContentAdd style={{ height: '100%' }}/>
        } else {
          if (selectedCellRule) {
            if (!!model && !!model[selectedCellRule] && Object.keys(model[selectedCellRule]['secs']).length > 0){
              return <NavigationMoreHoriz style={{ height: '100%' }}/>
            } else {
              return <ContentAdd style={{ height: '100%' }} />
            }
          } else {
            return ''
          }
        }
      }
    }
  }

  render () {

    const { value: model, page, selectedCellRule, selectedSection, selectedMechanism, errorMessage, errorDetails } = this.state;
    let selection = null;
    let container = null;

    const dialogPop = (errorMessage != undefined 
      ? <Dialog
        title={errorMessage}
        open={true}
        style={{ whiteSpace: "pre-wrap" }}
      >
        <DialogTitle id="alert-dialog-title">{errorMessage}</DialogTitle>
        <DialogContent style={{ overflow: 'auto' }}>
          <DialogContentText id="alert-dialog-description">
            {errorDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            color="primary"
            onClick={() => this.setState({ errorMessage: undefined, errorDetails: undefined })}
          >
              Back
          </Button>
        </DialogActions>
      </Dialog> 
      : undefined
    );

    if (page == 'main') {
      if ( selectedCellRule !== undefined && model && Object.keys(model).indexOf(selectedCellRule) > -1) {
        selection = (
          <NetPyNECellRule
            name={selectedCellRule}
            selectPage={this.selectPage}
            model={model[selectedCellRule]}
            renameHandler={this.handleRenameChildren} 
          />
        )
      }
      if (model != undefined) {
        container = Object.keys(model).map( cellRuleName => 
          <NetPyNEThumbnail
            id={cellRuleName}
            name={cellRuleName}
            key={cellRuleName} 
            selected={cellRuleName == selectedCellRule}
            deleteMethod={this.deleteCellRule}
            handleClick={this.selectCellRule} 
          />
        )
      }
    } else if (page == "sections") {
      const sectionsModel = model[selectedCellRule].secs;
      if ( selectedSection !== undefined && Object.keys(sectionsModel).indexOf(selectedSection) > -1 ) {
        selection = (
          <NetPyNESection
            name={selectedSection}
            cellRule={selectedCellRule}
            selectPage={this.selectPage}
            model={sectionsModel[selectedSection]}
            renameHandler={this.handleRenameSections}
          />
        )
      }
      container = Object.keys(sectionsModel).map( sectionName => 
        <NetPyNESectionThumbnail 
          key={sectionName} 
          name={sectionName}
          selected={sectionName == selectedSection}
          deleteMethod={this.deleteSection}
          handleClick={this.selectSection} 
        />
      )
    } else if (page == "mechanisms") {
      const mechanismsModel = model[selectedCellRule].secs[selectedSection].mechs;
      if ((selectedMechanism !== undefined) && Object.keys(mechanismsModel).indexOf(selectedMechanism) > -1) {
        selection = (
          <NetPyNEMechanism 
            cellRule={selectedCellRule}
            section={selectedSection} 
            name={selectedMechanism} 
            model={mechanismsModel[selectedMechanism]}
          />
        )
      }
      container = Object.keys(mechanismsModel).map( mechName => 
        <NetPyNEMechanismThumbnail 
          name={mechName} 
          key={mechName} 
          selected={mechName == selectedMechanism} 
          model={mechanismsModel[mechName]} 
          deleteMethod={this.deleteMechanism}
          handleClick={this.selectMechanism} 
        />
      )
    }
    
    const content = (
      <CardContent className={"tabContainer"}>
        <div className={"thumbnails"}>
          <div className="breadcrumb">
            <NetPyNEHome
              selection={selectedCellRule}
              handleClick={() => this.setState({ page: 'main', selectedCellRule: undefined, selectedSection: undefined, selectedMechanism: undefined })}
            />

            <div className='ml-2'>
              <Fab
                id="newCellRuleButton"
                style={{ minWidth: 56 }}
                color={ page == 'main' ? 'primary' : 'secondary'}
                data-tooltip={ this.createTooltip('cellRule')}
                onClick={() => this.handleHierarchyClick('main')}
              >
                {this.createLabel('cellRule')}
              </Fab>
            </div>

            <NavigationChevronRight
              className='ml-2'
              color='disabled'
            />

            <div className='ml-2'>
              <Fab
                id="newSectionButton"
                variant="extended"
                style={{ minWidth: '100px' }}
                color={ page === 'mechanisms' ? 'secondary' : 'primary'}
                disabled={ selectedCellRule == undefined }
                onClick={ () => this.handleHierarchyClick('sections') }
                data-tooltip={ this.createTooltip('section')}
              >
                {this.createLabel('sections')}
              </Fab>
            </div>
            

            <NavigationChevronRight 
              className='ml-2'
              color='disabled'
            />

            <NetPyNENewMechanism
              handleClick={this.handleNewMechanism}
              disabled={selectedSection == undefined || page == 'main'}
              handleHierarchyClick={ () => this.handleHierarchyClick('mechanisms')}
              blockButton={page != 'mechanisms' && !!model && !!model[selectedCellRule] && !!model[selectedCellRule]['secs'][selectedSection] && Object.keys(model[selectedCellRule]['secs'][selectedSection]['mechs']).length > 0}
            /> 
          </div>
          <div style={{ clear: "both" }}/>
          { container }
        </div>
        <div className="details">
          { selection }
        </div>
      </CardContent>
    );

    return (
      <Card style={{ clear: 'both' }}>
        <CardHeader
          id="CellRules"
          title="Cell rules"
          subheader="Define here the rules to set the biophysics and morphology of the cells in your network"
        />
        {content}
        {dialogPop}
      </Card>
    );
  }
}