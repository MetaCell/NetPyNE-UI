import React from 'react';
import TextField from '@material-ui/core/TextField';
import { List, ListItem,Accordion, AccordionDetails, AccordionSummary, Typography} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

import FileBrowser from '../../general/FileBrowser';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

import { ActionDialog, Tooltip } from 'netpyne/components';
import Checkbox from '../../general/Checkbox';

import { NETPYNE_COMMANDS } from '../../../constants';
import { useSelector, useDispatch } from 'react-redux';
import { ExpandMore } from '@material-ui/icons';

import Utils from 'root/Utils';
import { registerModelPath } from '../../../redux/actions/general';


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

const OverwriteModel = (props) => {
  const srcPath = useSelector((state) => state.general.modelPath);
  const [explorerDialogOpen, setExplorerDialogOpen] = React.useState(false);
  const [openOverwriteDialog, setOpenOverwriteDialog] = React.useState(false);
  const [explorerParameter, setExplorerParameter] = React.useState('srcPath');
  const [dstPath, setDstPath] = React.useState(srcPath);
  const [options, setOptions] = React.useState({
    exportNetParamsAsPython: false,
    exportSimConfigAsPython: false
  });
  const dispatch = useDispatch();

  const getDirAndModuleFromPath = (fullpath) => {
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

  const registerSavedModelPath = (path) => {
    dispatch(registerModelPath(path));
  }

  const showExplorerDialog = (explorerParameter) => {
    setExplorerDialogOpen(true);
    setExplorerParameter(explorerParameter)
  }

  const closeExplorerDialog = (fieldValue) => {
    setExplorerDialogOpen(false);
    if (fieldValue) {
      const {
        dirPath,
        moduleName,
      } = getDirAndModuleFromPath(fieldValue.path);

      switch (explorerParameter) {
        // case 'srcPath': {
        //   newState.srcPath = `${srcPath}/${moduleName}`;
        //   break;
        // }
        case 'dstPath': {
          setDstPath(`${dirPath}${moduleName}`);
          break;
        }
      }
    }
  }

  const switchCheckBox = (state) => {
    setOptions(options => {
      const opts = {...options};
      opts[state] = !options[state];
      return opts
    });
  }

  const saveModel = () => {
    const args = [srcPath, dstPath, options.exportNetParamsAsPython, options.exportSimConfigAsPython]
    Utils.evalPythonMessage(NETPYNE_COMMANDS.saveModel, args).then(() => registerSavedModelPath(dstPath))
  }

  const checkDirExistence = async (command, path) => {
    const exists = await Utils.evalPythonMessage(command, [path])
    if (exists) {
      setOpenOverwriteDialog(true)
      return
    }
    saveModel()
  }

    return (
      <>
      <ActionDialog
        command={'netpyne_geppetto.checkFileExists'}
        callback={checkDirExistence}
        message={GEPPETTO.Resources.EXPORTING_MODEL}
        buttonLabel="Save"
        title="Save as JSON file"
        args={dstPath}
        {...props}
      >
      {/* <TextField
            variant="filled"
            fullWidth
            value={this.state.srcPath}
            onChange={(event) => setSrcPath(event.target.value)}
            label="Model source path"
            // helperText="Only "
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="File explorer" placement="top">
                    <Icon
                      className="fa fa-folder hovered"
                      style={{ cursor: 'pointer' }}
                      onClick={() => showExplorerDialog('srcPath')}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          /> */}
        <TextField
            variant="filled"
            fullWidth
            value={dstPath}
            onChange={(event) => setDstPath(event.target.value)}
            label="Model destination path"
            // helperText="Only "
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="File explorer" placement="top">
                    <Icon
                      className="fa fa-folder hovered"
                      style={{ cursor: 'pointer' }}
                      onClick={() => showExplorerDialog('dstPath')}
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
                          onChange={() =>
                            switchCheckBox(saveOption.state)
                          }
                          checked={options[saveOption.state]}
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
              open={explorerDialogOpen}
              exploreOnlyDirs={true}
              // filterFiles={''}
              onRequestClose={(selection) => closeExplorerDialog(selection)}
              startDir={explorerParameter === 'srcPath'? srcPath: dstPath}
            />

      {openOverwriteDialog ?
         <ActionDialog
            onRequestClose={() => setOpenOverwriteDialog(false)}
            onAction={saveModel}
            buttonLabel="Overwrite"
            title="Destination Path Already Exists"
          >
            <Typography>{`Path "${dstPath}" already exists, do you want to overwrite it?`}</Typography>
          </ActionDialog>
         : <></>
      }
      </>
    );
}

export default OverwriteModel;