import React from 'react';
import Checkbox from '../../general/Checkbox';
import TextField from '@material-ui/core/TextField';
import ActionDialog from './ActionDialog';
import ListComponent from '../../general/List';
import FileBrowser from '../../general/FileBrowser';
import NetPyNEField from '../../general/NetPyNEField';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

const styles = {
  card: {
    main: { padding: 10, float: 'left', width: '100%' },
    title: { paddingBottom: 0 },
    cancel: { marginRight: 16 }
  },
  mods: {
    container: { width: '100%', float: 'left', marginTop: '15px' },
    leftSubContainer: { float: 'left', width: '50%' },
    rightSubContainer: { float: 'right', width: '50%' },
    checkbox: { width: '90%' }
  }
}

export default class ImportCellParams extends React.Component {

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
        <TextField
          value={label}
          id="importCellTemplateName"
          label="Cell rule label"
          onChange={event => this.setState({ label: event.target.value })}
        />

        <NetPyNEField id="netParams.importCellParams.cellName" className="netpyneFieldNoWidth">
          <TextField
            value={cellName}
            id="importCellTemplateCellName"
            onChange={event => this.setState({ cellName: event.target.value })}
          />
        </NetPyNEField>

        <div className="flex-row">
          <IconButton
            id="importCellTemplateFile"
            className='flex-row-icon b-4'
            onClick={() => this.showExplorerDialog('fileName', false)} 
            tooltip-data='File explorer'
          >
            <Icon className='fa fa-folder-o listIcon' />
          </IconButton>

          <NetPyNEField id="netParams.importCellParams.fileName" className="netpyneFieldNoWidth">
            <TextField 
              className="netpyneFieldNoWidth fx-11 no-z-index"
              value={fileName}
              onChange={event => this.setState({ fileName: event.target.value })}
            />
          </NetPyNEField>
          
        </div>


        <div className="flex-row">
          <IconButton
            id="importCellTemplateModFile"
            className='flex-row-icon b-4'
            onClick={() => this.showExplorerDialog('modFolder', true)} 
            tooltip-data='File explorer'
          >
            <Icon className="fa fa-folder-o listIcon" />
          </IconButton>

          <NetPyNEField id="netParams.importCellParams.modFolder" className="netpyneRightField" >
            <TextField 
              value={modFolder}
              className="netpyneFieldNoWidth fx-11 no-z-index"
              onChange={event => this.setState({ modFolder: event.target.value })} 
            />
          </NetPyNEField>
        </div>

        <div className="listStyle netpyneField">
          <ListComponent id="cellArgs" realType="dict" floatingLabelText="Cell Template Parameters (key:value pair)" ref="cellArgs" />
        </div>

        <div style={styles.mods.container}>
          <div style={styles.mods.leftSubContainer}>
            <NetPyNEField id="netParams.importCellParams.importSynMechs" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
              <Checkbox
                checked={importSynMechs}
                style={styles.mods.checkbox}
                onChange={() => this.updateCheck('importSynMechs')}
              />
            </NetPyNEField>
          </div>

          <div style={styles.mods.rightSubContainer}>
            <NetPyNEField id="netParams.importCellParams.compileMod" className="netpyneCheckbox netpyneFieldNoWidth" noStyle>
              <Checkbox
                checked={compileMod}
                style={styles.mods.checkbox}
                id="importCellTemplateCompileMods"
                onChange={() => this.updateCheck('compileMod')}
              />
            </NetPyNEField>
          </div>
        </div>

        <FileBrowser 
          open={explorerDialogOpen} 
          exploreOnlyDirs={exploreOnlyDirs} 
          onRequestClose={selection => this.closeExplorerDialog(selection)}
        />

      </ActionDialog>
    )
  }
}
