import React from "react";
import Button from "@material-ui/core/Button";
import ContentAdd from "@material-ui/icons/Add";
import NavigationMoreHoriz from "@material-ui/icons/MoreHoriz";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

import {
  NetPyNECellRule,
  NetPyNEThumbnail,
  GridLayout,
  Filter,
  NetPyNESection,
  SelectCellTemplate,
} from "netpyne/components";

import NetPyNEMechanism from "./sections/mechanisms/NetPyNEMechanism";
import NetPyNENewMechanism from "./sections/mechanisms/NetPyNENewMechanism";

import Dialog from "@material-ui/core/Dialog/Dialog";

import Utils from "../../../Utils";
import NetPyNEHome from "../../general/NetPyNEHome";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import RulePath from "../../general/RulePath";
import Accordion from "../../general/ExpansionPanel";
import Tooltip from "../../general/Tooltip";

import { ArrowRightIcon } from "../../general/NetPyNEIcons";

const styles = ({ spacing }) => ({
  arrowRight: { marginLeft: spacing(1) },
  addCellRule: { marginLeft: spacing(1) },
  sections: { marginLeft: spacing(1) },
});

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
      page: "main",
      filterValue: null,
      anchorEl: null,
    };

    this.selectPage = this.selectPage.bind(this);

    this.selectCellRule = this.selectCellRule.bind(this);
    this.handleNewCellRule = this.handleNewCellRule.bind(this);

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
    this.setState({
      selectedCellRule: cellRule,
      selectedSection: undefined,
      selectedMechanism: undefined,
    });
  }

  handleNewCellRule (defaultCellRules) {
    var key = Object.keys(defaultCellRules)[0];
    var value = defaultCellRules[key];
    var model = { ...this.state.value };

    // Get New Available ID
    var cellRuleId = Utils.getAvailableKey(model, key);
    var newCellRule = Object.assign({ name: cellRuleId }, value);
    // Create Cell Rule Client side
    Utils.execPythonMessage(
      'netpyne_geppetto.netParams.cellParams["'
      + cellRuleId
      + '"] = '
      + JSON.stringify(value)
    );
    model[cellRuleId] = newCellRule;
    // Update state
    this.setState(
      {
        value: model,
        selectedCellRule: cellRuleId,
        selectedSection: undefined,
        selectedMechanism: undefined,
      },
      this.props.updateCards()
    );
  }

  selectSection (section) {
    this.setState({ selectedSection: section, selectedMechanism: undefined });
  }

  handleNewSection (defaultSectionValues) {
    let key = Object.keys(defaultSectionValues)[0];
    let value = defaultSectionValues[key];
    const { selectedCellRule } = this.state;
    const model = {};
    Object.keys(this.state.value).forEach(cellRuleName => {
      const { secs, ...others } = this.state.value[cellRuleName];
      model[cellRuleName] = { ...others, secs: { ...secs } };
    });
    // Get New Available ID
    var sectionId = Utils.getAvailableKey(model[selectedCellRule]["secs"], key);
    var newSection = Object.assign({ name: sectionId }, value);
    if (model[selectedCellRule]["secs"] == undefined) {
      model[selectedCellRule]["secs"] = {};
      Utils.execPythonMessage(
        'netpyne_geppetto.netParams.cellParams["'
        + selectedCellRule
        + '"]["secs"] = {}'
      );
    }
    Utils.execPythonMessage(
      'netpyne_geppetto.netParams.cellParams["'
      + selectedCellRule
      + '"]["secs"]["'
      + sectionId
      + '"] = '
      + JSON.stringify(value)
    );
    model[selectedCellRule]["secs"][sectionId] = newSection;
    // Update state
    this.setState({
      value: model,
      selectedSection: sectionId,
      selectedMechanism: undefined,
    });

    // Move to section page if not already there
    if (this.state.page !== "sections") {
      this.setState({ page: "sections" });
    }
  }

  selectMechanism (mechanism) {
    this.setState({ selectedMechanism: mechanism });
  }

  handleNewMechanism (mechanism) {
    const { selectedCellRule, selectedSection } = this.state;
    const model = {};
    Object.keys(this.state.value).forEach(cellRuleName => {
      const { secs, ...cellOthers } = this.state.value[cellRuleName];
      const sections = {};
      Object.keys(secs).forEach(sectionName => {
        const { mechs, ...secOthers } = this.state.value[cellRuleName].secs[
          sectionName
          ];
        sections[sectionName] = { ...secOthers, mechs: { ...mechs } };
      });
      model[cellRuleName] = { ...cellOthers, secs: { ...sections } };
    });

    // Create Mechanism Client side
    if (model[selectedCellRule].secs[selectedSection]["mechs"] == undefined) {
      model[selectedCellRule].secs[selectedSection]["mechs"] = {};
      Utils.execPythonMessage(
        'netpyne_geppetto.netParams.cellParams["'
        + selectedCellRule
        + '"]["secs"]["'
        + selectedSection
        + '"]["mechs"] = {}'
      );
    }
    Utils.evalPythonMessage("netpyne_geppetto.getMechParams", [mechanism]).then(
      response => {
        const params = {};
        response.forEach(param => (params[param] = 0));
        Utils.execPythonMessage(
          'netpyne_geppetto.netParams.cellParams["'
          + selectedCellRule
          + '"]["secs"]["'
          + selectedSection
          + '"]["mechs"]["'
          + mechanism
          + '"] = '
          + JSON.stringify(params)
        );
      }
    );
    this.setState({
      value: model,
      selectedMechanism: mechanism,
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

    if (
      currentModel != undefined
      && model != undefined
      && prevState.selectedCellRule != undefined
      && currentCellRule != undefined
      && newCellRule != undefined
    ) {
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
    if (
      currentModel != undefined
      && model != undefined
      && prevState.selectedSection != undefined
      && currentSection != undefined
      && newSection != undefined
    ) {
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
    var newCellRuleName = this.hasSelectedCellRuleBeenRenamed(
      prevState,
      this.state
    );
    if (newCellRuleName !== undefined) {
      this.setState({
        selectedCellRule: newCellRuleName,
        deletedCellRule: undefined,
      });
    } else if (
      prevState.value !== undefined
      && Object.keys(prevState.value).length
      !== Object.keys(this.state.value).length
    ) {
      /*
       * logic into this if to check if the user added a new object from the python backend and
       * if the name convention pass the checks, differently rename this and open dialog to inform.
       */
      var model = this.state.value;
      for (var m in model) {
        if (prevState.value !== "" && !(m in prevState.value)) {
          var newValue = Utils.nameValidation(m);
          if (newValue != m) {
            newValue = Utils.getAvailableKey(model, newValue);
            model[newValue] = model[m];
            delete model[m];
            this.setState(
              {
                value: model,
                errorMessage: "Error",
                errorDetails:
                  "Leading digits or whitespaces are not allowed in CellRule names.\n"
                  + m
                  + " has been renamed "
                  + newValue,
              },
              function () {
                Utils.renameKey(
                  "netParams.cellParams",
                  m,
                  newValue,
                  (response, newValue) => {
                  }
                );
              }.bind(this)
            );
          }
        }
      }
    }
    var newSectionName = this.hasSelectedSectionBeenRenamed(
      prevState,
      this.state
    );
    if (newSectionName !== undefined) {
      this.setState({
        selectedSection: newSectionName,
        deletedSection: undefined,
      });
    } else if (prevState.value !== undefined) {
      /*
       * logic into this if to check if the user added a new object from the python backend and
       * if the name convention pass the checks, differently rename this and open dialog to inform.
       */
      var model2 = this.state.value;
      var prevModel = prevState.value;
      for (var n in model2) {
        if (
          prevModel[n] !== undefined
          && Object.keys(model2[n]["secs"]).length
          !== Object.keys(prevModel[n]["secs"]).length
        ) {
          var cellRule = model2[n]["secs"];
          for (var s in cellRule) {
            if (!(s in prevState.value[n]["secs"])) {
              var newValue2 = Utils.nameValidation(s);
              if (newValue2 != s) {
                newValue2 = Utils.getAvailableKey(model2[n]["secs"], newValue2);
                model2[n]["secs"][newValue2] = model2[n]["secs"][s];
                delete model2[n]["secs"][s];
                this.setState(
                  {
                    value: model2,
                    errorMessage: "Error",
                    errorDetails:
                      "Leading digits or whitespaces are not allowed in Population names.\n"
                      + s
                      + " has been renamed "
                      + newValue2,
                  },
                  () =>
                    Utils.renameKey(
                      'netParams.cellParams["' + n + '"]["secs"]',
                      s,
                      newValue2,
                      (response, newValue) => {
                      }
                    )
                );
              }
            }
          }
        }
      }
    }
    var newMechanismName = this.hasSelectedMechanismBeenRenamed(
      prevState,
      this.state
    );
    if (newMechanismName !== undefined) {
      this.setState({ selectedMechanism: newMechanismName });
    }

    if (
      this.state.value
      && Object.keys(this.state.value).length === 0
      && prevState.value
      && Object.keys(prevState.value).length !== 0
    ) {
      this.setState({
        selectedCellRule: undefined,
        selectedSection: undefined,
        selectedMechanism: undefined,
        page: "main",
      });
    }
  }

  handleHierarchyClick = (nextPage, event) => {
    const {
      value: model,
      page,
      selectedCellRule,
      selectedSection,
      selectedMechanism,
    } = this.state;
    /*
     * with this herarchy navigation, the tree buttons in the breadclumb can behave  in 2 different ways
     * they can move the view to a different level (cellRule -> section) (seccions --> mechanisms)
     * or they can add a new cellRule ( or section or mechanims)
     * here we chech if we want to jump to a different level or if we want to create a new rule in the current level
     */
    if (nextPage === page) {
      if (page === "main") {
        event.preventDefault();
        this.setState({ anchorEl: event.currentTarget });
        // this.handleNewCellRule({ 'CellType': { 'conds':{}, 'secs':{} } });
      } else if (page === "sections") {
        this.handleNewSection({ Section: { geom: {}, topol: {}, mechs: {} } });
      }
    } else {
      const selection = {};
      if (nextPage === "sections" && !selectedSection) {
        if (Object.keys(model[selectedCellRule]["secs"]).length > 0) {
          selection.selectedSection = Object.keys(
            model[selectedCellRule]["secs"]
          )[0];
        }
      }
      if (nextPage === "mechanisms" && !selectedMechanism) {
        if (
          Object.keys(model[selectedCellRule]["secs"][selectedSection]["mechs"])
            .length > 0
        ) {
          selection.selectedMechanism = Object.keys(
            model[selectedCellRule]["secs"][selectedSection]["mechs"]
          )[0];
        }
      }
      this.setState({ page: nextPage, filterValue: null, ...selection });
      if (nextPage == "sections") {
        // saves one click if there are no sections
        if (Object.keys(model[selectedCellRule]["secs"]).length == 0) {
          this.handleNewSection({ Section: { geom: {}, topol: {}, mechs: {} }, });
        }
      }
    }
  };

  shouldComponentUpdate (nextProps, nextState) {
    var itemRenamed
      = this.hasSelectedCellRuleBeenRenamed(this.state, nextState)
      !== undefined
      || this.hasSelectedSectionBeenRenamed(this.state, nextState) !== undefined
      || this.hasSelectedMechanismBeenRenamed(this.state, nextState) !== undefined;
    var newItemCreated = false;
    var selectionChanged
      = this.state.selectedCellRule != nextState.selectedCellRule
      || this.state.selectedSection != nextState.selectedSection
      || this.state.selectedMechanism != nextState.selectedMechanism;
    var pageChanged = this.state.page != nextState.page;
    var newModel = this.state.value == undefined;
    if (!newModel) {
      newItemCreated
        = Object.keys(this.state.value).length
        != Object.keys(nextState.value).length;
      if (
        this.state.selectedCellRule != undefined
        && nextState.value[this.state.selectedCellRule] != undefined
      ) {
        var oldLength
          = this.state.value[this.state.selectedCellRule] == undefined
          ? 0
          : Object.keys(this.state.value[this.state.selectedCellRule].secs)
            .length;
        newItemCreated
          = newItemCreated
          || oldLength
          != Object.keys(nextState.value[this.state.selectedCellRule].secs)
            .length;
      }
      if (
        this.state.selectedSection != undefined
        && this.state.value[this.state.selectedCellRule]
        && nextState.value[this.state.selectedCellRule] != undefined
        && nextState.value[this.state.selectedCellRule].secs[
          this.state.selectedSection
          ] != undefined
      ) {
        var oldLength
          = this.state.value[this.state.selectedCellRule].secs[
          this.state.selectedSection
          ] == undefined
          ? 0
          : Object.keys(
            this.state.value[this.state.selectedCellRule].secs[
              this.state.selectedSection
              ].mechs
          ).length;
        newItemCreated
          = newItemCreated
          || oldLength
          != Object.keys(
            nextState.value[this.state.selectedCellRule].secs[
              this.state.selectedSection
              ].mechs
          ).length;
      }
    }
    var errorDialogOpen = this.state.errorDetails !== nextState.errorDetails;
    var filterChanged = nextState.filterPopValue !== this.state.filterValue;
    return (
      filterChanged
      || newModel
      || newItemCreated
      || itemRenamed
      || selectionChanged
      || pageChanged
      || errorDialogOpen
    );
  }

  deleteMechanism (name) {
    if (
      this.state.selectedCellRule != undefined
      && this.state.selectedSection != undefined
    ) {
      Utils.evalPythonMessage("netpyne_geppetto.deleteParam", [
        [this.state.selectedCellRule, this.state.selectedSection],
        name,
      ]).then(response => {
        var model = this.state.value;
        delete model[this.state.selectedCellRule].secs[
          this.state.selectedSection
          ]["mechs"][name];
        this.setState({ value: model, selectedMechanism: undefined });
      });
    }
  }

  deleteSection (name) {
    if (this.state.selectedCellRule != undefined) {
      Utils.evalPythonMessage("netpyne_geppetto.deleteParam", [
        [this.state.selectedCellRule],
        name,
      ]).then(response => {
        var model = this.state.value;
        delete model[this.state.selectedCellRule]["secs"][name];
        this.setState({
          value: model,
          selectedSection: undefined,
          deletedSection: name,
        });
      });
    }
  }

  handleRenameChildren (childName) {
    childName = childName.replace(/\s*$/, "");
    var childrenList = Object.keys(this.state.value);
    for (var i = 0; childrenList.length > i; i++) {
      if (childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  }

  handleRenameSections (childName, leaf) {
    childName = childName.replace(/\s*$/, "");
    var childrenList = Object.keys(this.state.value[leaf]["secs"]);
    for (var i = 0; childrenList.length > i; i++) {
      if (childName === childrenList[i]) {
        return false;
      }
    }
    return true;
  }

  createTooltip (rule) {
    const {
      value: model,
      page,
      selectedCellRule,
      selectedSection,
    } = this.state;

    switch (rule) {
      case "cellRule":
        if (page !== "main") {
          if (selectedCellRule && selectedCellRule.length > 8) {
            return selectedCellRule;
          } else {
            return "Go back to cell type";
          }
        } else {
          return "Create new cell type";
        }

      case "section":
        if (page === "mechanisms") {
          if (!!selectedSection && selectedSection.length > 9) {
            return selectedSection;
          } else {
            return "Go back to section";
          }
        } else {
          if (page == "sections") {
            return "Create new section";
          } else {
            if (selectedCellRule) {
              if (
                !!model
                && !!model[selectedCellRule]
                && Object.keys(model[selectedCellRule]["secs"]).length > 0
              ) {
                return "Explore sections";
              } else {
                return "Create first section";
              }
            } else {
              return "No cell type selected";
            }
          }
        }
    }
  }

  createLabel (rule) {
    const {
      value: model,
      page,
      selectedCellRule,
      selectedSection,
    } = this.state;
    switch (rule) {
      case "cellRule":
        if (page !== "main") {
          return "CT";
        } else {
          return <ContentAdd style={{ color: "white" }}/>;
        }

      case "sections":
        if (page === "mechanisms") {
          return "S";
        } else {
          if (page == "sections") {
            return <ContentAdd style={{ height: "100%", color: "white" }}/>;
          } else {
            if (selectedCellRule) {
              if (
                !!model
                && !!model[selectedCellRule]
                && Object.keys(model[selectedCellRule]["secs"]).length > 0
              ) {
                return <NavigationMoreHoriz style={{ height: "100%" }}/>;
              } else {
                return <ContentAdd style={{ height: "100%" }}/>;
              }
            } else {
              return "";
            }
          }
        }
    }
  }

  getFilterOptions () {
    const {
      value: model,
      page,
      selectedCellRule,
      selectedSection,
    } = this.state;
    if (model === undefined) {
      return [];
    }
    if (page === "main") {
      return Object.keys(model);
    }
    if (model[selectedCellRule] === undefined) {
      return [];
    }
    if (page === "sections") {
      return Object.keys(model[selectedCellRule].secs);
    }
    if (model[selectedCellRule].secs[selectedSection] === undefined) {
      return [];
    }
    if (page === "mechanisms") {
      return Object.keys(model[selectedCellRule].secs[selectedSection].mechs);
    }
    return [];
  }

  getCopyPath () {
    const basePath = "netParams.cellParams";
    const { value: model } = this.state;
    const { selectedCellRule, selectedSection, selectedMechanism } = this.state;
    if (!model) {
      return "undefined";
    }
    switch (this.state.page) {
      case "main": {
        if (model[selectedCellRule]) {
          return `${basePath}["${selectedCellRule}"]`;
        }
        break;
      }
      case "sections": {
        if (model[selectedCellRule].secs[selectedSection]) {
          return `${basePath}["${selectedCellRule}"].secs["${selectedSection}"]`;
        }
        break;
      }
      case "mechanisms": {
        if (
          model[selectedCellRule].secs[selectedSection].mechs[selectedMechanism]
        ) {
          return `${basePath}["${selectedCellRule}"].secs["${selectedSection}"].mechs["${selectedMechanism}"]`;
        }
        break;
      }
      default: {
      }
    }
    return "undefined";
  }

  callbackForNewCellTypeCreated (newCellTypeName) {
    this.props.updateCards();
    this.setState({ anchorEl: null });
  }

  render () {
    const {
      value: model,
      page,
      selectedCellRule,
      selectedSection,
      selectedMechanism,
      errorMessage,
      errorDetails,
    } = this.state;
    let selection = null;
    let container = null;

    const dialogPop
      = errorMessage != undefined ? (
      <Dialog
        title={errorMessage}
        open={true}
        style={{ whiteSpace: "pre-wrap" }}
      >
        <DialogTitle id="alert-dialog-title">{errorMessage}</DialogTitle>
        <DialogContent style={{ overflow: "auto" }}>
          <DialogContentText id="alert-dialog-description">
            {errorDetails}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              this.setState({
                errorMessage: undefined,
                errorDetails: undefined,
              })
            }
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    ) : (
      undefined
    );

    if (page == "main") {
      if (
        selectedCellRule !== undefined
        && model
        && Object.keys(model).indexOf(selectedCellRule) > -1
      ) {
        selection = (
          <NetPyNECellRule
            name={selectedCellRule}
            selectPage={this.selectPage}
            model={model[selectedCellRule]}
            renameHandler={this.handleRenameChildren}
            HandleAddNewSection={() =>
              this.handleNewSection({ Section: { geom: {}, topol: {}, mechs: {} }, })
            }
          />
        );
      }
      if (model != undefined) {
        const filterName
          = this.state.filterValue === null ? "" : this.state.filterValue;
        container = Object.keys(model)
          .filter(cellRuleName =>
            cellRuleName.toLowerCase().includes(filterName.toLowerCase())
          )
          .map(cellRuleName => (
            <NetPyNEThumbnail
              name={cellRuleName}
              key={cellRuleName}
              selected={cellRuleName == selectedCellRule}
              paramPath="cellParams"
              handleClick={this.selectCellRule}
            />
          ));
      }
    } else if (
      page == "sections"
      && Object.keys(model).length > 0
      && model[selectedCellRule]
    ) {
      const sectionsModel = model[selectedCellRule].secs;

      if (
        selectedSection !== undefined
        && Object.keys(sectionsModel).indexOf(selectedSection) > -1
      ) {
        selection = (
          <NetPyNESection
            name={selectedSection}
            cellRule={selectedCellRule}
            selectPage={this.selectPage}
            model={sectionsModel[selectedSection]}
            renameHandler={this.handleRenameSections}
          />
        );
      }

      const filterName
        = this.state.filterValue === null ? "" : this.state.filterValue;
      container = Object.keys(sectionsModel)
        .filter(sectionName =>
          sectionName.toLowerCase().includes(filterName.toLowerCase())
        )
        .map(sectionName => (
          <NetPyNEThumbnail
            isButton
            key={sectionName}
            name={sectionName}
            selected={sectionName == selectedSection}
            paramPath={[selectedCellRule]}
            handleClick={this.selectSection}
            onDelete={() => this.setState({ selectedSection: undefined })}
          />
        ));
    } else if (
      page == "mechanisms"
      && Object.keys(model).length > 0
      && model[selectedCellRule]
      && model[selectedCellRule].secs[selectedSection]
    ) {
      const mechanismsModel
        = model[selectedCellRule].secs[selectedSection].mechs;
      if (
        selectedMechanism !== undefined
        && Object.keys(mechanismsModel).indexOf(selectedMechanism) > -1
      ) {
        selection = (
          <NetPyNEMechanism
            cellRule={selectedCellRule}
            section={selectedSection}
            name={selectedMechanism}
            paramPath={[selectedCellRule, selectedSection]}
            model={mechanismsModel[selectedMechanism]}
          />
        );
      }

      const filterName
        = this.state.filterValue === null ? "" : this.state.filterValue;
      container = Object.keys(mechanismsModel)
        .filter(mechName =>
          mechName.toLowerCase().includes(filterName.toLowerCase())
        )
        .map(mechName => (
          <NetPyNEThumbnail
            isCog
            name={mechName}
            key={mechName}
            selected={mechName == selectedMechanism}
            model={mechanismsModel[mechName]}
            paramPath={[selectedCellRule, selectedSection]}
            handleClick={this.selectMechanism}
          />
        ));
    }

    return (
      <GridLayout>
        <div>
          <Accordion>
            <div className="breadcrumb">
              <div>
                <NetPyNEHome
                  selection={selectedCellRule}
                  handleClick={() =>
                    this.setState({
                      page: "main",
                      selectedCellRule: undefined,
                      selectedSection: undefined,
                      selectedMechanism: undefined,
                    })
                  }
                />
                <div style={{ opacity: 0 }}>H</div>
              </div>

              <SelectCellTemplate
                page={this.state.page}
                label={this.createLabel("cellRule")}
                tooltip={this.createTooltip("cellRule")}
                anchorEl={this.state.anchorEl}
                model={this.state.value}
                clearAnchorEl={() => this.setState({ anchorEl: null })}
                handleButtonClick={event =>
                  this.handleHierarchyClick("main", event)
                }
                callback={cellTypeName =>
                  this.callbackForNewCellTypeCreated(cellTypeName)
                }
              />

              <div>
                <ArrowRightIcon
                  fontSize="inherit"
                  className="breadcrumb-spacer"
                  color="inherit"
                />
                <div style={{ opacity: 0 }}>S</div>
              </div>

              <Tooltip title={this.createTooltip("section")} placement="top">
                <div>
                  <Fab
                    id="newSectionButton"
                    variant="extended"
                    size="small"
                    style={{
                      minWidth: 60,
                      height: 25,
                      marginTop: 6,
                      marginBottom: 7,
                    }}
                    color={page === "mechanisms" ? "secondary" : "primary"}
                    disabled={selectedCellRule == undefined}
                    onClick={() => this.handleHierarchyClick("sections")}
                  >
                    {this.createLabel("sections")}
                  </Fab>
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "Source Sans Pro",
                    }}
                  >
                    Section
                  </div>
                </div>
              </Tooltip>

              <div>
                <ArrowRightIcon
                  fontSize="inherit"
                  className="breadcrumb-spacer"
                  color="inherit"
                />
                <div style={{ opacity: 0 }}>S</div>
              </div>

              <div>
                <NetPyNENewMechanism
                  id="mechanismButton"
                  handleClick={this.handleNewMechanism}
                  disabled={selectedSection == undefined || page == "main"}
                  handleHierarchyClick={() =>
                    this.handleHierarchyClick("mechanisms")
                  }
                  blockButton={
                    page != "mechanisms"
                    && !!model
                    && !!model[selectedCellRule]
                    && !!model[selectedCellRule]["secs"][selectedSection]
                    && Object.keys(
                      model[selectedCellRule]["secs"][selectedSection]["mechs"]
                    ).length > 0
                  }
                />
                <div
                  style={{ textAlign: "center", fontFamily: "Source Sans Pro" }}
                >
                  Mech
                </div>
              </div>
            </div>

            <Box p={1}>
              <RulePath text={this.getCopyPath()}/>
              <Box mb={1}/>
              <Filter
                value={this.state.filterValue}
                label={`Filter ${
                  page === "main"
                    ? "cell rule"
                    : page === "sections"
                    ? "section"
                    : "mechanism"
                } by name...`}
                handleFilterChange={newValue =>
                  this.setState({ filterValue: newValue })
                }
                options={this.getFilterOptions()}
              />
            </Box>
          </Accordion>
        </div>
        <Box
          className={`scrollbar scrollchild`}
          mt={1}
          display="flex"
          flexWrap="wrap"
        >
          {container}
        </Box>
        {selection}

        {dialogPop}
      </GridLayout>
    );
  }
}
