import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import {
  GridLayout,
  
} from 'netpyne/components';
import { withStyles } from '@material-ui/core/styles';

import Utils from 'root/Utils';
import {
  EXPERIMENT_STATE, EXPERIMENT_TEXTS, EXPERIMENT_VIEWS,
} from '../../constants';
import DialogBox from '../general/DialogBox';
import { experimentGrey, experimentInputColor } from '../../theme';

const useStyles = (theme) => ({
  root: {
    '& .scrollDiv': {
      overflow: 'auto',
    },
    '& .MuiTableContainer-root': {
      maxHeight: 'calc(100% -60vh)',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        height: theme.spacing(1),
      },
      '& .MuiTable-root': {
        '& .experimentHead': {
          fontSize: '1rem',
        },
        '& .experimentHeadIcon': {
          fontSize: '1rem',
        },
        '& .experimentDate': {
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '1rem',
          color: experimentGrey,
        },
        '& .experimentIcon': {
          color: experimentGrey,
          minWidth: 'auto',
          '& .MuiSvgIcon-root': {
            fontSize: '1.2rem',
          },
        },
        '& .MuiChip-label': {
          color: experimentGrey,
          fontSize: ' 0.77rem',
          fontWeight: 600,
        },
        '& .MuiChip-root': {
          background: experimentInputColor,
          height: theme.spacing(3.2),
        },
        '& .MuiChip-deleteIcon': {
          marginRight: theme.spacing(0.4),
        },
        '& .MuiTableCell-root': {
          padding: theme.spacing(1, 2),
          '&:nth-child(1)': {
            width: '18.75rem',
            '& button': {
              maxWidth: '50vw',
              justifyContent: 'inherit',
            },
            '& h6': {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            },
          },
          '&:nth-child(2)': {
            width: '9.375rem',
          },
        },
        '& .MuiChip-icon': {
          color: experimentGrey,
        },
        '& .MuiDivider-vertical': {
          height: theme.spacing(4),
          background: 'rgba(255, 255, 255, 0.3)',
        },
        '& .MuiTableCell-alignRight': {
          width: theme.spacing(6),
          paddingLeft: 0,
        },
        '& .MuiTableCell-alignCenter': {
          width: theme.spacing(6),
        },
      },
      '& .MuiChipLoader': {
        border: '3px solid rgba(196, 196, 196, 0.3)',
        borderRadius: '50%',
        borderTop: `3px solid ${experimentGrey}`,
        width: theme.spacing(2.4),
        height: theme.spacing(2.4),
        animation: 'spin 2s linear infinite',
      },
    },
  },
});

const Experiments = (props) => {
  const {
    experiments,
    classes,
    setEditState,
    setExperimentName,
    cloneExperiment,
    removeExperiment,
    setView,
  } = props;



  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [actionExperimentName, setActionExperimentName] = useState(null);

  const deleteExperiment = (actionConfirmed) => {
    if (actionConfirmed) {
      removeExperiment(actionExperimentName);
        
      setDeleteDialogOpen(false);
        
       
    } else {
      setDeleteDialogOpen(false);
    }
    setActionExperimentName(null);
  };

  const viewExperiment = (name) => {
    setEditState(false);
    setExperimentName(name);
    setView(EXPERIMENT_VIEWS.viewExperiment);
  };

  const createExperimentScreen = (actionConfirmed) => {
    setDialogOpen(false);
    setEditState(false);
    setExperimentName(null);
    setView(!actionConfirmed ? EXPERIMENT_VIEWS.list : EXPERIMENT_VIEWS.edit);
  };

  const openEditExperiment = (name) => {
    setExperimentName(name);
    setView(EXPERIMENT_VIEWS.edit);
    setEditState(true);
  };

  const openCloneDialog = (name) => {
    setActionExperimentName(name);
    setCloneDialogOpen(true);
  };

  const openDeleteDialog = (name) => {
    setActionExperimentName(name);
    setDeleteDialogOpen(true);
  };

  const onCloneExperimentAction = (actionConfirmed) => {
    if (actionConfirmed) {
      cloneExperiment(actionExperimentName);
    }
    setCloneDialogOpen(false);
    setActionExperimentName(null);
  };

  return (
    <>
      <GridLayout className={classes.root}>
        <div className="scrollDiv">
          <Box>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  {experiments.sort(experiment => experiment.timestamp).map((experiment) => (
                    <TableRow key={experiment?.name}>
                      <TableCell component="th" scope="row">
                        <Button onClick={() => viewExperiment(experiment?.name)}>
                          <Typography variant="h6" className="experimentHead">
                            {experiment?.name}
                          </Typography>
                          <ChevronRightIcon
                            className="experimentHeadIcon"
                          />
                        </Button>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6" className="experimentDate">
                          {Utils.formatDate(experiment?.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell align="left" className="experimentTableCell">
                        {(
                          [
                            EXPERIMENT_STATE.PENDING,
                            EXPERIMENT_STATE.SIMULATING,
                            EXPERIMENT_STATE.INSTANTIATING,
                          ].includes(experiment?.state))
                          ? (
                            <Chip
                              icon={<Box className="MuiChipLoader" />}
                              label={experiment?.state}
                              // deleteIcon={<CancelRoundedIcon />}
                              // onDelete={() => {
                              // }}
                            />
                          )
                          : (
                            <Chip
                              label={experiment?.state}
                            />
                          )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          className="experimentIcon"
                          onClick={
                            experiment?.state === EXPERIMENT_STATE.DESIGN
                              ? () => openEditExperiment(experiment?.name)
                              : () => openCloneDialog(experiment?.name)
                          }
                        >
                          {experiment?.state === EXPERIMENT_STATE.DESIGN
                            ? <EditIcon />
                            : <FileCopyOutlinedIcon />}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Divider orientation="vertical" />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          className="experimentIcon"
                          onClick={() => openDeleteDialog(experiment?.name)}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
        <Box
          className="scrollbar scrollchild"
          mt={1}
          display="flex"
          flexWrap="wrap"
          flex="none"
        >
          <Box>
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              CREATE NEW EXPERIMENT
            </Button>
          </Box>
        </Box>
      </GridLayout>
      <DialogBox
        open={dialogOpen}
        onDialogResponse={createExperimentScreen}
        textForDialog={{
          heading: EXPERIMENT_TEXTS.CREATE_EXPERIMENT,
          content: EXPERIMENT_TEXTS.DIALOG_MESSAGE,
        }}
      />
      <DialogBox
        open={deleteDialogOpen}
        onDialogResponse={deleteExperiment}
        textForDialog={{
          heading: EXPERIMENT_TEXTS.DELETE_EXPERIMENT,
          content: EXPERIMENT_TEXTS.DELETE_DIALOG_MESSAGE,
        }}
      />
      <DialogBox
        open={cloneDialogOpen}
        onDialogResponse={onCloneExperimentAction}
        textForDialog={{
          heading: EXPERIMENT_TEXTS.CLONE_EXPERIMENT,
          content: EXPERIMENT_TEXTS.CLONE_EXPERIMENT_MESSAGE,
        }}
      />
    </>
  );
};

export default withStyles(useStyles)(Experiments);
