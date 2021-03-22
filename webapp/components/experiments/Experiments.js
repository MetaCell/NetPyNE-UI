import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
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
import FaceIcon from '@material-ui/icons/Face';
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
    // <div>
    //   <TextField />
    //   <Button onClick={editExperiment} />
    //   <Button onClick={cleanExperiment} />
    //   <Button onClick={deleteExperiment} />
    //   <Button onClick={viewExperiment} />
    //   {
    //     experiments.map((experiment) => <div>{experiment.name}</div>)
    //   }
    // </div>
    <GridLayout>
      <div>
        <Box>
          <TableContainer component={Paper} className="experimentTableContainer">
            <Table aria-label="simple table" className="experimentTable">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Button>
                      <Typography variant="h6" className="experimentHead">
                        Experiment W
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
                    <Chip
                      label="DESIGN"
                      onClick={handleClick}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><EditIcon/></Button>
                  </TableCell>
                  <TableCell align="center">
                    <Divider orientation="vertical" />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><ReplayIcon/></Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><DeleteIcon/></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Button>
                      <Typography variant="h6" className="experimentHead">
                        Experiment W
                      </Typography>
                      <ChevronRightIcon className="experimentHeadIcon"/>
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="h6" className="experimentDate">
                      28.03.2021
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="experimentTableCell">
                    <Chip
                      icon={<FaceIcon />}
                      label="SIMULATING"
                      onClick={handleClick}
                      onDelete={handleDelete}
                      deleteIcon={<CancelRoundedIcon />}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><FileCopyOutlinedIcon/></Button>
                  </TableCell>
                  <TableCell align="center">
                    <Divider orientation="vertical" />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><ReplayIcon/></Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><DeleteIcon/></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Button>
                      <Typography variant="h6" className="experimentHead">
                        Experiment W
                      </Typography>
                      <ChevronRightIcon className="experimentHeadIcon"/>
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="h6" className="experimentDate">
                      28.03.2021
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="experimentTableCell">
                    <Chip
                      label="DESIGN"
                      onClick={handleClick}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><EditIcon/></Button>
                  </TableCell>
                  <TableCell align="center">
                    <Divider orientation="vertical" />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><ReplayIcon/></Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><DeleteIcon/></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Button>
                      <Typography variant="h6" className="experimentHead">
                        Experiment W
                      </Typography>
                      <ChevronRightIcon className="experimentHeadIcon"/>
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="h6" className="experimentDate">
                      28.03.2021
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="experimentTableCell">
                    <Chip
                      label="DESIGN"
                      onClick={handleClick}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><EditIcon/></Button>
                  </TableCell>
                  <TableCell align="center">
                    <Divider orientation="vertical" />
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><ReplayIcon/></Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button className="experimentIcon"><DeleteIcon/></Button>
                  </TableCell>
                </TableRow>
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
