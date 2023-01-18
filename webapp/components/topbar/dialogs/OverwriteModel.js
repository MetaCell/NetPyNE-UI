import React from 'react';
import TextField from '@material-ui/core/TextField';
import { List, ListItem,Accordion, AccordionDetails, AccordionSummary, Typography} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

import FileBrowser from '../../general/FileBrowser';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

import { ActionDialog, Tooltip } from 'netpyne/components';
import Utils from '../../../Utils';
import Checkbox from '../../general/Checkbox';

import { NETPYNE_COMMANDS } from '../../../constants';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ExpandMore } from '@material-ui/icons';

const saveOptions = [
  {
    label: 'Export Network Parameters as Python',
    label2: '',
    state: 'exportNetParamsAsPython',
  },
  {
    label: 'Export Simulation Configuration as Python',
    label2: '',
    state: 'exportSimConfigAsPython',
  },
];

// const getTimeStamp = () => new Date().toGMTString().replace(',', '').replace(/[ ,:]/g, '_');


export default class OverwriteModel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      // fileName: 'output_' + getTimeStamp(),
      explorerDialogOpen: false,
      explorerParameter: 'srcPath',
      srcPath: "examples",
      dstPath: "examples",
      exportNetParamsAsPython: false,
      exportSimConfigAsPython: false,
    };
  }

  componentDidMount () {
    Utils.evalPythonMessage('netpyne_geppetto.doIhaveInstOrSimData', [])
      .then((response) => { });
  }

  getDirAndModuleFromPath (fullpath) {
    const fileName = fullpath.replace(/^.*[\\/]/, '');
    const moduleName = fileName.replace(/\.[^/.]+$/, '');
    const dirPath = fullpath.split(fileName)
      .slice(0, -1)
      .join('');

    return {
      dirPath,
      moduleName,
    };
  }

  showExplorerDialog (explorerParameter) {
    this.setState({
      explorerDialogOpen: true,
      explorerParameter: explorerParameter,
    });
  }

  closeExplorerDialog (fieldValue) {
    const newState = { explorerDialogOpen: false };
    if (fieldValue) {
      const {
        dirPath,
        moduleName,
      } = this.getDirAndModuleFromPath(fieldValue.path);
      newState[this.state.explorerParameter] = `${dirPath}${moduleName}`;
      // switch (this.state.explorerParameter) {
      //   case 'srcPath': {
      //     newState.srcPath = `${srcPath}/${moduleName}`;
      //     break;
      //   }
      //   case 'dstPath': {
      //     newState.dstPath = `${dirPath}/${moduleName}`;
      //     break;
      //   }
      // }
    }
    this.setState({ ...newState });
  }

  render () {
    return (
      <>
      <ActionDialog
        command={NETPYNE_COMMANDS.saveModel}
        message={GEPPETTO.Resources.EXPORTING_MODEL}
        buttonLabel="Save"
        title="Save as JSON file"
        args={this.state}
        {...this.props}
      >
      {/* <TextField
            variant="filled"
            fullWidth
            value={this.state.srcPath}
            onChange={(event) => this.setState({ srcPath: event.target.value })}
            // onChange={(event) => this.onNetParamsPathChange(event.target.value)}
            label="Model source path"
            // helperText="Only "
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="File explorer" placement="top">
                    <Icon
                      className="fa fa-folder hovered"
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.showExplorerDialog('srcPath')}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          /> */}
        <TextField
            variant="filled"
            fullWidth
            value={this.state.dstPath}
            onChange={(event) => this.setState({ dstPath: event.target.value })}
            // onChange={(event) => this.onNetParamsPathChange(event.target.value)}
            label="Model destination path"
            // helperText="Only "
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="File explorer" placement="top">
                    <Icon
                      className="fa fa-folder hovered"
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.showExplorerDialog('dstPath')}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        <div>
          <Accordion>
            <AccordionSummary expandIcon={<Typography><ExpandMore /></Typography>}>
                <Typography>Advanced Options</Typography>
              </AccordionSummary>
            <AccordionDetails
              id="panel1a-header">
             <List style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
                >
                  {saveOptions.map((saveOption, index) => (
                    <ListItem
                      key={index}
                      style={{ width: '50%' }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          onChange={() => this.setState(({
                            [saveOption.state]: oldState,
                            ...others
                          }) => ({ [saveOption.state]: !oldState }))}
                          checked={this.state[saveOption.state]}
                          noBackground
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={saveOption.label}
                        secondary={saveOption.label2}
                      />
                    </ListItem>
                  ))}
                </List>
            </AccordionDetails>
          </Accordion>
        </div>

      </ActionDialog>

      <FileBrowser
              open={this.state.explorerDialogOpen}
              exploreOnlyDirs={true}
              // filterFiles={''}
              onRequestClose={(selection) => this.closeExplorerDialog(selection)}
              startDir={this.state[this.state.explorerParameter]}
            />
      </>
    );
  }
}
