import React from 'react';
import Checkbox from '../../general/Checkbox';
import TextField from '@material-ui/core/TextField';
import ActionDialog from './ActionDialog';
import ListComponent from '../../general/List';
import FileBrowser from '../../general/FileBrowser';
import NetPyNEField from '../../general/NetPyNEField';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

const styles = ({ spacing, typography, zIndex }) => ({ 
  container: { 
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '103%'
  },
  icon: { 
    '&:hover': { backgroundColor: 'inherit' },
    flex: '0 0 4%',
    marginRight: spacing(2),
    width: typography.h3.fontSize,
    height: typography.h3.fontSize,
    padding: '0px!important',
    zIndex: zIndex.modal
  },
  textField: { alignItems: 'center' },
  root:{ overflow: 'hidden' },
})

class ImportCellParams extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      label: 'NewCellRule',
      fileName: '',
      cellName: '',
      modFolder: '',
      compileMod: false,
      importSynMechs: false,
      explorerDialogOpen: false,
      exploreOnlyDirs: false,
    };
  }

  updateCheck (name) {
    this.setState(({ [name]: pv }) => ({ [name]: !pv }));
  }

  showExplorerDialog (explorerParameter, exploreOnlyDirs) {
    this.setState({ explorerDialogOpen: true, explorerParameter: explorerParameter, exploreOnlyDirs: exploreOnlyDirs });
  }

  closeExplorerDialog (fieldValue) {
    var newState = { explorerDialogOpen: false };
    if (fieldValue) {
      switch (this.state.explorerParameter) {
      case "fileName":
        newState["fileName"] = fieldValue.path;
        break;
      case "modFolder":
        newState["modFolder"] = fieldValue.path;
        break;
      default:
        throw ("Not a valid parameter!");
      }
    }
    this.setState(newState);
  }

  render () {
    const { classes } = this.props
    const cellArgs = this.refs.cellArgs ? this.refs.cellArgs.state.children : {}
    const { label, fileName, cellName, modFolder, importSynMechs, compileMod, explorerDialogOpen, exploreOnlyDirs } = this.state;
    
    return (
      <ActionDialog
        buttonLabel={'Import'}
        message = {'LOADING TEMPLATE'}
        title={'Import cell template (.py or .hoc)'}
        command={'netpyne_geppetto.importCellTemplate'}
        args={{ cellArgs, fileName, cellName, label, modFolder, importSynMechs, compileMod }}
        {...this.props}
      >
        <div className={classes.root}>
          <TextField
            value={label}
            className="netpyneField" 
            id="importCellTemplateName"
            label="Cell rule label"
            onChange={event => this.setState({ label: event.target.value })}
          />

          <NetPyNEField id="netParams.importCellParams.cellName" className={classes.textField}>
            <TextField
              value={cellName}
              id="importCellTemplateCellName"
              onChange={event => this.setState({ cellName: event.target.value })}
            />
          </NetPyNEField>

          <div className={classes.container}>
            <IconButton
              id="importCellTemplateFile"
              className={classes.icon}
              onClick={() => this.showExplorerDialog('fileName', false)} 
              tooltip-data='File explorer'
            >
              <Icon className='fa fa-folder-o listIcon' />
            </IconButton>

            <NetPyNEField id="netParams.importCellParams.fileName">
              <TextField 
                value={fileName}
                onChange={event => this.setState({ fileName: event.target.value })}
              />
            </NetPyNEField>
          
          </div>


          <div className={classes.container}>
            <IconButton
              id="importCellTemplateModFile"
              className={classes.icon}
              onClick={() => this.showExplorerDialog('modFolder', true)} 
              tooltip-data='File explorer'
            >
              <Icon className="fa fa-folder-o listIcon" />
            </IconButton>

            <NetPyNEField id="netParams.importCellParams.modFolder">
              <TextField 
                value={modFolder}
                onChange={event => this.setState({ modFolder: event.target.value })} 
              />
            </NetPyNEField>
          </div>

          <div className="listStyle netpyneField">
            <ListComponent id="cellArgs" realType="dict" floatingLabelText="Cell Template Parameters (key:value pair)" ref="cellArgs" />
          </div>

          <NetPyNEField id="netParams.importCellParams.importSynMechs" >
            <Checkbox
              checked={importSynMechs}
              onChange={() => this.updateCheck('importSynMechs')}
            />
          </NetPyNEField>
            
          <NetPyNEField id="netParams.importCellParams.compileMod" >
            <Checkbox
              checked={compileMod}
              id="importCellTemplateCompileMods"
              onChange={() => this.updateCheck('compileMod')}
            />
          </NetPyNEField>
            

          <FileBrowser 
            open={explorerDialogOpen} 
            exploreOnlyDirs={exploreOnlyDirs} 
            onRequestClose={selection => this.closeExplorerDialog(selection)}
          />
        </div>
      </ActionDialog>
    )
  }
}

export default withStyles(styles)(ImportCellParams)