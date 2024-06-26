import React from 'react';
import TextField from '@material-ui/core/TextField';

import Icon from '@material-ui/core/Icon';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';

import { Tooltip } from 'netpyne/components';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FileBrowser from '../../general/FileBrowser';

const ACCEPTED_EXTENSIONS = '.py .zip .gz .tar.gz .pdf .txt .xls .png .jpeg .json';

const styles = ({
  spacing,
  typography,
  zIndex,
  palette,
}) => ({
  root: { color: palette.common.white },
  container: {
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  icon: {
    '&:hover': { backgroundColor: 'inherit' },
    flex: '0 0 4%',
    marginRight: spacing(2),
    width: typography.h3.fontSize,
    height: typography.h3.fontSize,
    padding: '0px!important',
    zIndex: zIndex.modal,
  },
  input: {
    outline: 'none',
    border: 'none',
    boxShadow: 'none',
    '&:focus': {
      outline: 'none',
      border: 'none',
      boxShadow: 'none',
    },
  },
});

class UploadDownloadFile extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.initialState();
    this.message = '';
  }

  onUploadFileArrayChange = (event) => {
    const { files } = event.target;
    if (this.maxSelectFile(files) && this.checkMimeType(files) && this.checkFileSize(files)) {
      this.setState({ uploadFiles: files });
    }
  };

  initialState () {
    return {
      open: true,
      openSnackBar: false,
      downloadPaths: [],
      downloadPathsDisplayText: '',
      explorerDialogOpen: false,
      uploadFiles: '',
    };
  }

  async uploadFiles () {
    const { uploadFiles } = this.state;
    const formData = new FormData();

    this.setState({ open: false });
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'UPLOADING FILES');

    if (uploadFiles.length > 0) {
      for (let i = 0; i < uploadFiles.length; i++) {
        formData.append('file', uploadFiles.item(i));
      }

      try {
        const response = await fetch('uploads', {
          method: 'POST',
          body: formData,
        });
        if (response.status === 200) {
          this.message = response.statusText;
        } else {
          this.message = 'No file uploaded.';
          console.warn(`Response error uploading files. Status code ${response.status}. Message ${response.statusText}`);
        }
      } catch (error) {
        this.message = 'Server error. Please try again.';
        console.warn(error);
      } finally {
        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
        this.props.openSnackBar(this.message);
        this.props.onRequestClose();
      }
    }
  }

  generateUrl () {
    const {
      downloadPaths,
      downloadPathsDisplayText,
    } = this.state;

    let url = 'downloads';
    let downloadFileName = 'download.tar.gz';

    if (downloadPaths.length > 0) {
      downloadPaths.forEach((path, index) => url += `${index === 0 ? '?' : '&'}uri=${path}`);
      if (downloadPaths.length === 1) {
        downloadFileName = downloadPaths[0].split('/')
          .pop();
      }
    } else if (downloadPathsDisplayText) {
      url += `?uri=${downloadPathsDisplayText}`;
    } else {
      url = '';
      downloadFileName = '';
    }
    return {
      url,
      downloadFileName,
    };
  }

  downloadBlob (blob, fileName) {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  async downloadFiles () {
    const {
      url,
      downloadFileName,
    } = this.generateUrl();

    if (!url) {
      this.props.onRequestClose();
      return;
    }

    try {
      const response = await fetch(url);

      if (response.status === 200) {
        const blob = await response.blob();
        this.downloadBlob(blob, downloadFileName);
        this.message = 'Files downloaded.';
      } else if (response.status === 400) {
        this.message = response.statusText;
      } else {
        this.message = 'Error downloading files.';
        console.log('Error code');
      }
    } catch (error) {
      this.message = 'Error downloading files.';
      console.error(error);
    } finally {
      this.props.openSnackBar(this.message);
      this.props.onRequestClose();
    }
  }

  maxSelectFile (files) {
    return true;
  }

  checkMimeType (files) {
    return true;
  }

  checkFileSize (files) {
    return true;
  }

  closeExplorerDialog (selectedNodes) {
    const state = { explorerDialogOpen: false };
    if (selectedNodes) {
      state.downloadPaths = Object.values(selectedNodes)
        .map((s) => s.path);
      state.downloadPathsDisplayText = Object.values(selectedNodes)
        .map((s) => s.path.split('/')
          .pop())
        .join(' - ');
    }
    this.setState({ ...state });
  }

  showExplorerDialog (filterFiles = '') {
    this.setState({
      explorerDialogOpen: true,
      filterFiles,
    });
  }

  changeDownloadFilePathsDisplayText (text) {
    this.setState({
      downloadPaths: [text],
      downloadPathsDisplayText: text,
    });
  }

  render () {
    let buttonLabel;
    let title;
    let content;
    const { classes } = this.props;
    const { mode } = this.props;

    const {
      open,
      explorerDialogOpen,
      uploadFiles: uploadFiles1,
      downloadPathsDisplayText,
      downloadPaths,
      filterFiles,
    } = this.state;

    switch (mode) {
      case 'UPLOAD':
        content = (
          <div className={classes.root}>
            <div className={classes.container}>
              <div>
                <input
                  multiple
                  type="file"
                  className={classes.input}
                  onChange={this.onUploadFileArrayChange}
                />

              </div>
            </div>
            <p className="mt-2">{`Accept: ${ACCEPTED_EXTENSIONS}`}</p>
          </div>
        );

        buttonLabel = 'Upload';
        title = 'Upload files';
        break;
      case 'DOWNLOAD':
        content = (
          <TextField
            fullWidth
            variant="filled"
            value={downloadPathsDisplayText}
            onChange={(event) => this.changeDownloadFilePathsDisplayText(event.target.value)}
            label="Files:"
            helperText="Select files to download"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="File explorer" placement="top">
                    <Icon
                      className="fa fa-folder hovered"
                      onClick={() => this.showExplorerDialog()}
                      style={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        );

        buttonLabel = 'DOWNLOAD';
        title = 'Download files';
        break;

      default:
        break;
    }

    return (
      <div>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={open}
          onClose={() => this.closeDialog()}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {content}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.onRequestClose()}>CANCEL</Button>
            <Button
              color="primary"
              id="appBarPerformActionButton"
              disabled={mode === 'UPLOAD'
                ? !uploadFiles1
                : downloadPaths.lenght === 0 || !downloadPathsDisplayText}
              onClick={() => (mode === 'UPLOAD' ? this.uploadFiles() : this.downloadFiles())}
            >
              {buttonLabel}
            </Button>
          </DialogActions>
        </Dialog>

        <FileBrowser
          open={explorerDialogOpen}
          exploreOnlyDirs={false}
          filterFiles={filterFiles}
          toggleMode
          onRequestClose={(multiSelection) => this.closeExplorerDialog(multiSelection)}
        />
      </div>

    );
  }
}

export default withStyles(styles)(UploadDownloadFile);
