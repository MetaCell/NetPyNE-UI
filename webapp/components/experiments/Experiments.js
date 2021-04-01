import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplayIcon from '@material-ui/icons/Replay';
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
import {
  EXPERIMENT_STATE
} from '../../constants';
import { withStyles } from '@material-ui/core/styles';
import useInterval from 'root/api/hooks';
import { openDialog } from '../../redux/actions/general';
import EditExperiment from './EditExperiment';

const useStyles = theme => ({
  root: {
    '& .MuiTableContainer-root': {
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
        },
        '& .experimentIcon': {
          minWidth: 'auto',
          '& .MuiSvgIcon-root': {
            fontSize: '1.2rem',
          }
        },
        '& .MuiChip-label': {
          fontSize: ' 0.77rem',
          fontWeight: 600,
        },
        '& .MuiChip-root': {
          background: 'rgba(255, 255, 255, 0.1)',
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
            }
          },
          '&:nth-child(2)': {
            width: '9.375rem',
          },
          '&:nth-child(6)': {
            '& .MuiButton-label': {
              transform: 'rotate(-65deg)',
            }
          }
        },
        '& .MuiChip-icon': {
          color: '#A8A5A5',
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
        }
      },
      '& .MuiChipLoader': {
        border: '3px solid rgba(196, 196, 196, 0.3)',
        borderRadius: '50%',
        borderTop: '3px solid #A8A5A5',
        width: theme.spacing(2.4),
        height: theme.spacing(2.4),
        animation: 'spin 2s linear infinite',
      }
    },
  },
});

/**
 * Lists all Experiments.
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Experiments = (props) => {
  const {
    experiments,
    getExperiments,
    classes,
  } = props;

  const POLL_INTERVAL = 1000;

  useEffect(getExperiments, []);
  useInterval(getExperiments, POLL_INTERVAL);

  const cleanExperiment = (payload) => {
    props.cleanExperiment(payload);
  };

  const deleteExperiment = (name) => {
    props.deleteExperiment(name);
  };

  const viewExperiment = (payload) => {
    props.viewExperiment(payload);
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleDateString();
  };

  const openCreateDialog = (fields) => {
    openDialog(fields);
    setList(false)
  };

  const [list, setList] = useState(true);

  return (
    <>
    { list ?
      <GridLayout className={classes.root}>
        <div>
          <Box>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  {experiments.map((experiment) => (
                    <TableRow key={experiment?.name}>
                      <TableCell component="th" scope="row">
                        <Button>
                          <Typography variant="h6" className="experimentHead">
                            {experiment?.name}
                          </Typography>
                          <ChevronRightIcon className="experimentHeadIcon"/>
                        </Button>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6" className="experimentDate">
                          {formatDate(experiment?.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell align="left" className="experimentTableCell">
                        {(experiment?.state === EXPERIMENT_STATE.SIMULATING || experiment?.state === EXPERIMENT_STATE.INSTANTIATING) ?
                          <Chip
                            icon={<Box className="MuiChipLoader"></Box>}
                            label={experiment?.state}
                            onDelete={handleDelete}
                            deleteIcon={<CancelRoundedIcon/>}
                          /> :
                          <Chip
                            label={experiment?.state}
                          />
                        }
                      </TableCell>
                      <TableCell align="right">
                        <Button className="experimentIcon"
                                onClick={viewExperiment}>{experiment?.state === EXPERIMENT_STATE.DESIGN ?
                          <EditIcon/> : <FileCopyOutlinedIcon/>}</Button>
                      </TableCell>
                      <TableCell align="center">
                        <Divider orientation="vertical"/>
                      </TableCell>
                      <TableCell align="right">
                        <Button className="experimentIcon"
                                onClick={cleanExperiment}><ReplayIcon/></Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button className="experimentIcon"
                                onClick={deleteExperiment}><DeleteIcon/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
        <Box
          className={`scrollbar scrollchild`}
          mt={1}
          display="flex"
          flexWrap="wrap"
        >
          <Box>
            <Button
              color="primary"
              startIcon={<AddIcon/>}
              onClick={() => openCreateDialog({title: 'Create new experiment', message:'xyz'})}
            >
              CREATE NEW EXPERIMENT
            </Button>
          </Box>
        </Box>
      </GridLayout> :
      <EditExperiment setList={setList} />
    }
    </>
  );
};

export default withStyles(useStyles)(Experiments);
