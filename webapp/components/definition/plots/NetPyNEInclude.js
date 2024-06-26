import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import { NetPyNEField } from 'netpyne/components';
import Utils from '../../../Utils';

export default class NetPyNEInclude extends Component {
  constructor (props) {
    super(props);
    this.state = {
      include: this.getDataTemplate(),
      mainPopoverOpen: false,
      label: '',
    };
  }

  componentDidMount () {
    this.collectInfo();
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.updates !== prevProps.updates) {
      this.collectInfo();
    }
  }

  getDataTemplate = () => ({
    gids: [],
    groups: [],
    popids: {},
    exclusive: false,
  });

  checkEqual = (a, b) => {
    // compare if 2 shallow dicts are equal (no DOM, no 2nd lvl, no functions)
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  };

  whoIsIncluded = (include, data) => {
    /*
     * display some information in the selectfield
     * about how many pops and cells have been selected
     */
    let pops = 0;
    let cells = 0;
    let answer = '';
    if (include.exclusive) {
      return `${include.exclusive} -- ${data.gids} cells -- all NetStims`;
    }
    if (include.groups.indexOf('allCells') > -1) {
      if (include.groups.indexOf('allNetStims') == -1) {
        return `allCells -- ${data.gids} cells`;
      }
      return `all -- ${data.gids} cells -- all NetStims`;
    }
    include.groups.forEach((group) => {
      if (group != 'allNetStims') {
        pops += 1;
        cells += data[group];
      }
    });
    cells += include.gids.length;
    Object.keys(include.popids)
      .forEach((key) => {
        if (include.popids[key].length > 0) {
          cells += include.popids[key].length;
          pops += 1;
        }
      });

    if (pops > 0) {
      answer += `${pops} pops -- `;
    }
    answer += `${cells} cells `;
    if (include.groups.indexOf('allNetStims') > -1) {
      answer += ' -- all netStims';
    }
    return answer;
  };

  sendToPython = () => {
    const data = [];
    if (this.state.include.exclusive) {
      data.push(this.state.include.exclusive);
    } else {
      this.state.include.groups.forEach((group) => data.push(group));
      this.state.include.gids.forEach((gid) => data.push(gid));
      Object.keys(this.state.include.popids)
        .forEach((key) => data.push([key, this.state.include.popids[key]]));
    }
    Utils
      .execPythonMessage(`netpyne_geppetto.${this.props.model} = ${JSON.stringify(data)}`);
  };

  convertFromPython (data) {
    const out = this.getDataTemplate();
    data.forEach((element) => {
      switch (element.constructor.name) {
        case 'Number':
          out.gids.push(element);
          break;
        case 'String':
          element != 'all' ? out.groups.push(element) : out.exclusive = 'all';
          break;
        case 'Array':
          if (element[1].constructor.name == 'Number') {
            out.popids[element[0]] = [element[1]];
          } else {
            out.popids[element[0]] = element[1];
          }
          break;
        default:
          break;
      }
    });
    return out;
  }

  collectInfo = async () => {
    const numberOfCellsByPopulation = await Utils.evalPythonMessage('netpyne_geppetto.getGIDs', []);
    if (numberOfCellsByPopulation) {
      const dataInPythonFormat = await Utils.evalPythonMessage('netpyne_geppetto.getInclude', [this.props.model.split('\'')[1]]);
      let included;
      if (dataInPythonFormat) {
        included = this.convertFromPython(dataInPythonFormat);
      } else {
        included = this.convertFromPython([this.props.initialValue]);
      }
      const clone = { ...numberOfCellsByPopulation };
      Object.keys(clone)
        .forEach((key) => clone[key] = false);
      this.setState({
        include: included,
        secondPopoverOpen: clone,
        data: numberOfCellsByPopulation,
        label: this.whoIsIncluded(included, numberOfCellsByPopulation),
      });
    }
  };

  handleMainPopoverOpen = (open, preventDefault = false, target = false) => {
    // This prevents ghost click ->
    if (preventDefault) {
      preventDefault;
    }
    // close all secondary popovers
    const clone = { ...this.state.secondPopoverOpen };
    Object.keys(clone)
      .forEach((key) => {
        clone[key] = false;
      });

    if ((open || this.state.mainPopoverOpen) && !(open && this.state.mainPopoverOpen)) {
      this.setState((prevState) => ({
        mainPopoverOpen: open,
        secondPopoverOpen: clone,
        anchorEl: target || prevState.anchorEl,
      }));
    }
    if (!open) {
      this.sendToPython();
      this.setState((prevState) => ({ label: this.whoIsIncluded(prevState.include, prevState.data) }));
    }
  };

  handleSecondPopoverOpen = (name, open, preventDefault = false, target = false) => {
    // This prevents ghost click ->
    if (preventDefault) {
      preventDefault;
    }
    const clone = { ...this.state.secondPopoverOpen };
    Object.keys(clone)
      .forEach((key) => {
        clone[key] = (key == name) ? open : false;
      });

    if (!this.checkEqual(clone, this.state.secondPopoverOpen)) {
      this.setState((prevState) => ({
        secondPopoverOpen: clone,
        anchorEl2: target || prevState.anchorEl,
      }));
    }
  };

  closeSecondPopover = () => {
    const clone = { ...this.state.secondPopoverOpen };
    Object.keys(clone)
      .forEach((key) => {
        clone[key] = false;
      });
    if (!this.checkEqual(clone, this.state.secondPopoverOpen)) {
      this.setState({ secondPopoverOpen: clone });
    }
  };

  defaultMenus = () => {
    // [all, allCells,  allNetStims]
    const mainMenus = this.props.defaultOptions.map((name) => (
      <MenuItem
        key={name}
        value={name}
        onClick={(e) => this.handleMainMenusClick(name, name == 'all' ? 'exclusive' : 'groups')}
        checked={!!(this.state.include.exclusive == name || this.state.include.groups.indexOf(name) > -1)}
        onMouseEnter={(e) => this.closeSecondPopover()}
      >
        {name}
      </MenuItem>
    ));
    return mainMenus;
  };

  variableMenus = (name, size) => {
    // size: how many sub-menuItems does the menuItem has
    const menuItems = Array.from(Array(size)
      .keys())
      .map((index) => (
        <ListItem
          key={name + index}
          value={index}
          button
          onClick={(e) => this.handleSecondaryMenusClick(name == 'gids' ? 'gids' : 'popids', name, index)}
          checked={this.IsSecondaryMenuChecked(name == 'gids' ? 'gids' : 'popids', name, index)}
        >
          {this.IsSecondaryMenuChecked(name == 'gids' ? 'gids' : 'popids', name, index)
            ? (
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
            )
            : <ListItemIcon><span /></ListItemIcon>}
          <ListItemText>{`cell ${index}`}</ListItemText>

        </ListItem>
      ));
    return (
      <div key={`${name}div`}>
        <MenuItem
          key={name}
          value={name}
          checked={name != 'gids' ? this.state.include.groups.indexOf(name) > -1 : false}
          onClick={name != 'gids' ? (e) => this.handleMainMenusClick(name, 'groups') : (e) => {
          }}
          onMouseEnter={(e) => this.handleSecondPopoverOpen(name, true, e.preventDefault(), e.currentTarget)}
        >
          {name}
        </MenuItem>
        <Popover
          style={{
            height: size < 6 ? 48 * size : 240,
            width: 200,
          }}
          key={`${name}Popover`}
          elevarion={1}
          hideBackdrop
          open={this.state.secondPopoverOpen ? this.state.secondPopoverOpen[name] : false}
          anchorEl={this.state.anchorEl2}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
          transformOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
          onClose={() => this.closeSecondPopover()}
          onMouseLeave={() => this.closeSecondPopover()}
        >
          <List style={{ width: 200 }} dense>
            {menuItems}
          </List>
        </Popover>
      </div>
    );
  };

  handleMainMenusClick = (name, group) => {
    var clone = this.getDataTemplate();
    if (name == 'all') { // remove everything else, when 'all' is selected
      clone.exclusive = 'all';
    } else if (name == 'allCells') {
      clone.groups = ['allCells'];
      if (this.state.include.groups.indexOf('allNetStims') > -1) {
        clone.groups.push('allNetStims');
      }
    } else {
      var clone = { ...this.state.include };
      clone[group].indexOf(name) == -1 ? clone[group].push(name) : clone[group].splice(clone[group].indexOf(name), 1);
      clone.exclusive = false;
      if (name in clone.popids) { // when selecting a whole pop, remove individual selections
        delete clone.popids[name];
      }
      if (this.state.include.groups.indexOf('allCells') > -1 && name != 'allNetStims') { // remove 'allCells' if selecting pops or individuals
        clone.groups.splice(clone.groups.indexOf('allCells'), 1);
      }
    }
    this.setState({ include: clone });
  };

  handleSecondaryMenusClick = (group, name, item) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const clone = { ...this.state.include };
    if (group == 'gids') {
      clone[group].indexOf(item) == -1 ? clone[group].push(item) : clone[group].splice(clone[group].indexOf(item), 1);
    } else if (group == 'popids') {
      if (name in clone[group]) {
        clone[group][name].indexOf(item) == -1 ? clone[group][name].push(item) : clone[group][name].splice(clone[group][name].indexOf(item), 1);
      } else {
        clone[group][name] = [item];
      }
      if (clone.groups.indexOf(name) > -1) { // when selecting individuals, remove population selection
        clone.groups.splice(clone.groups.indexOf(name), 1);
      }
    }
    clone.exclusive = false;
    if (clone.groups.indexOf('allCells') > -1 && name != 'allNetStims') {
      clone.groups.splice(clone.groups.indexOf('allCells'), 1);
    }
    this.setState({ include: clone });
  };

  IsSecondaryMenuChecked = (group, name, index) => {
    if (group == 'gids') {
      return this.state.include[group].indexOf(index) > -1;
    }
    if (group == 'popids') {
      if (name in this.state.include[group]) {
        return this.state.include[group][name].indexOf(index) > -1;
      }
      return false;
    }
  };

  otherMenus = () => {
    const menuItems = [];
    for (const key in this.state.data) {
      if (key != 'gids') {
        menuItems.push(this.variableMenus(key, this.state.data[key]));
      }
    }
    return menuItems;
  };

  render () {
    return (
      <div>
        <NetPyNEField id={this.props.id}>
          <TextField
            fullWidth
            variant="filled"
            label="Include in the plot"
            value={this.state.label}
            onClick={(e) => this.handleMainPopoverOpen(true, e.preventDefault(), e.currentTarget)}
          />
        </NetPyNEField>
        <Popover
          open={this.state.mainPopoverOpen}
          anchorEl={this.state.anchorEl}
          onClose={(e) => this.handleMainPopoverOpen(false)}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom',
          }}
          transformOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
        >
          {this.defaultMenus()}
          <Divider />
          {this.variableMenus('gids', this.state.data ? this.state.data.gids : 0, true)}
          <Divider />
          {this.otherMenus()}
        </Popover>
      </div>
    );
  }
}
