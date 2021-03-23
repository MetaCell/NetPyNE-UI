import React, { useEffect } from 'react';
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
    editExperiment,
  } = props;

  useEffect(() => {
    getExperiments();
  }, []);

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

  return (
    <GridLayout>
      <div>
        <Box>
          <TableContainer component={Paper} className="experimentTableContainer">
            <Table aria-label="simple table" className="experimentTable">
              <TableBody>
                { experiments.map((experiment) => (
                  <TableRow key={experiment?.name}>
                    <TableCell component="th" scope="row">
                      <Button>
                        <Typography variant="h6" className="experimentHead">
                          {experiment?.name}
                        </Typography>
                        <ChevronRightIcon className="experimentHeadIcon" />
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="h6" className="experimentDate">
                        28.03.2021
                      </Typography>
                    </TableCell>
                    <TableCell align="left" className="experimentTableCell">
                      {experiment?.state !== 'SIMULATING' ? 
                        <Chip
                          label={experiment?.state}
                        /> :
                        <Chip
                          icon={<Box className="MuiChipLoader"></Box>}
                          label="SIMULATING"
                          onDelete={handleDelete}
                          deleteIcon={<CancelRoundedIcon />}
                        />
                      }
                    </TableCell>
                    <TableCell align="right">
                      <Button className="experimentIcon" onClick={viewExperiment}>{experiment?.state === 'DESIGN' ? <EditIcon/> :  <FileCopyOutlinedIcon/>}</Button>
                    </TableCell>
                    <TableCell align="center">
                      <Divider orientation="vertical" />
                    </TableCell>
                    <TableCell align="right">
                      <Button className="experimentIcon" onClick={cleanExperiment}><ReplayIcon/></Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button className="experimentIcon" onClick={deleteExperiment}><DeleteIcon/></Button>
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
        <Box className="experimentFooter">
          <Button
            color="primary"
            startIcon={<AddIcon />}
          >
            CREATE NEW EXPERIMENT
          </Button>
        </Box>
      </Box>
    </GridLayout>
  );
};

export default Experiments;
