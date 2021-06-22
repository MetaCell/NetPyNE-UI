import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  Button,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableContainer,
  Divider,
  Typography,
  TablePagination,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CodeIcon from '@material-ui/icons/Code';
import ReplayIcon from '@material-ui/icons/Replay';
import AssessmentIcon from '@material-ui/icons/Assessment';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import FilterListIcon from '@material-ui/icons/FilterList';
import { EXPERIMENT_TEXTS, EXPERIMENT_VIEWS } from 'root/constants';
import DialogBox from 'root/components/general/DialogBox';
import { useDispatch } from 'react-redux';
import { viewExperimentResults, loadTrialModelSpec } from 'root/redux/actions/experiments';
import * as ExperimentsApi from 'root/api/experiments';
import {
  bgRegular,
  bgDarker,
  bgLight,
  canvasBgLight,
  bgInputs,
  primaryColor,
  experimentGrey,
  secondaryColor,
} from '../../theme';

import ExperimentRowFilter from './ExperimentRowFilter';
import { stableSort, getComparator } from './utils';

const useStyles = (theme) => ({
  table: {
    minWidth: 650,
  },
  sticky: {
    position: 'sticky',
    left: 0,
    zIndex: 50,
  },
  stickyRight: {
    position: 'sticky',
    right: 0,
  },
  root: {
    width: 'auto !important',
    flexDirection: 'column',
    marginLeft: -theme.spacing(1),
    marginRight: -theme.spacing(1),
    '& .MuiTablePagination-root': {
      overflow: 'initial',

      '& .MuiTypography-body2': {
        fontSize: '0.875rem',
      },
    },
    '& .MuiTablePagination-select': {
      fontSize: '0.875rem',
      color: experimentGrey,
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0),
    },
    '& .MuiTablePagination-selectRoot': {
      '& .MuiSelect-icon': {
        color: experimentGrey,
      },
    },
    '& .MuiTablePagination-actions': {
      paddingRight: theme.spacing(3),
      '& .MuiIconButton-root': {
        padding: '0.25rem',
        marginLeft: theme.spacing(2.6),
        color: experimentGrey,
        '&.Mui-disabled': {
          opacity: 0.3,
        },
        '&:hover': {
          borderRadius: theme.spacing(0.4),
        },
      },
    },
    '& .ViewExperimentHead': {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    '& .editExperiment-trials': {
      display: 'flex',
      alignItems: 'center',
      background: bgDarker,
      padding: theme.spacing(2, 4),
      '& .MuiTypography-h5': {
        fontSize: '1rem',
        color: experimentGrey,
        marginLeft: theme.spacing(1),
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
        color: experimentGrey,
      },
    },
    '& .editExperimentBack': {
      display: 'flex',
      cursor: 'pointer',
      '& .MuiTypography-root': {
        marginLeft: theme.spacing(1),
      },
    },
    '& .editExperiment-filter': {
      display: 'flex',
      alignItems: 'center',
      '& .MuiButton-root': {
        minWidth: 'inherit',
        marginLeft: theme.spacing(1.2),
      },
    },
    '& .MuiTypography-body2': {
      fontSize: '1rem',
    },
    '& .MuiDivider-vertical': {
      height: theme.spacing(4),
      background: 'rgba(255, 255, 255, 0.3)',
    },
    '& .MuiTableContainer-root': {
      '&::-webkit-scrollbar-thumb': {
        background: secondaryColor,
        height: theme.spacing(0.8),
      },
      '&::-webkit-scrollbar': {
        width: theme.spacing(0.8),
        height: theme.spacing(0.8),
      },
      '& .MuiTableCell-root': {
        padding: theme.spacing(1.4, 4),
        '&:last-child': {
          textAlign: 'right',
          '& .MuiSortIcon': {
            display: 'none',
          },
        },
        '&:first-child': {
          '& .MuiSortIcon': {
            display: 'none',
          },
        },
      },
      '& .MuiTableRow-colspan': {
        '& .MuiTableCell-root': {
          background: bgDarker,
          padding: theme.spacing(1),
        },
        '& .MuiBox-root': {
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: experimentGrey,
          '& .MuiSvgIcon-root': {
            fontSize: '0.813rem',
            marginRight: theme.spacing(1),
          },
        },
      },
      '& .MuiTableCell-actions': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& .MuiIconButton-root': {
          padding: '0.25rem',
          marginLeft: theme.spacing(2.6),
          color: experimentGrey,
          '&:hover': {
            borderRadius: theme.spacing(0.4),
          },
        },
        '& .MuiDivider-root': {
          marginLeft: theme.spacing(2.6),
        },
        '& .MuiSvgIcon-assessment': {
          color: primaryColor,
        },
        '& .MuiSvgIcon-replay': {
          fontSize: '1.2rem',
          transform: 'rotate(-65deg)',
        },
      },
      '& .MuiTableRow-head': {
        textTransform: 'uppercase',
        '& .MuiTableSortLabel-icon': {
          display: 'none',
        },
        '& .MuiSortIcon': {
          '&[direction="desc"]': {
            transform: 'rotate(180deg)',
          },
        },
        '& .MuiTableCell-root': {
          background: bgLight,
          color: experimentGrey,
          fontWeight: '700',
          whiteSpace: 'nowrap',
          borderBottom: `1px solid ${bgInputs}`,
        },
      },
      '& .MuiTableRow-root': {
        '& .MuiTableCell-root': {
          color: experimentGrey,
          fontWeight: '700',
          background: bgRegular,
          fontSize: '0.875rem',
        },
      },
      '& .MuiTableBody-root': {
        '& .MuiTableCell-root': {
          '&.MuiTableCell-paddingNone': {
            color: canvasBgLight,
            fontSize: '1rem',
            fontWeight: '500',
          },
        },
      },
    },
  },
});

function EnhancedTableHead (props) {
  const {
    order,
    orderBy,
    onRequestSort,
    classes,
    paramHeaders,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'TRIAL NAME',
    },
    ...paramHeaders,
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: 'Actions',
    },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={
              // eslint-disable-next-line no-nested-ternary
              index === 0 ? classes.sticky : index === headCells.length - 1 ? classes.stickyRight : ''
            }
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              <ArrowDropDownIcon
                className="MuiSortIcon"
                direction={orderBy === headCell.id ? order : 'asc'}
              />
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const ExperimentView = (props) => {
  const {
    classes,
    name,
    setTrial,
    setTrialJSON,
    setView,
  } = props;
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [tableRows, setTableRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState(tableRows);
  const [experiment, setExperiment] = useState(null);
  const [paramHeaders, setParamHeaders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loadResultsDialogOpen, setLoadResultsDialogOpen] = React.useState(false);
  const [loadModelSpecDialogOpen, setLoadModelSpecDialogOpen] = React.useState(false);
  const [selectedTrial, setSelectedTrial] = React.useState({
    experiment: null,
    trial: null,
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const [anchorEl, setAnchorEl] = React.useState('');
  const popoverhandleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const filterObj = {
    param: '',
    value: '',
  };
  const [filter, setFilter] = useState([filterObj]);

  const addFilterRow = () => {
    setFilter([...filter, filterObj]);
  };

  const filterRows = (arr, criteria) => {
    let count;
    const filterWithoutEmpties = criteria.filter((f) => f.param && f.value);
    if (filterWithoutEmpties.length > 0) {
      // Helper function to loop through the filter criteria to find matching values
      // Each filter criteria is treated as "AND"
      const matchesFilter = (item) => {
        count = 0;
        // for filtering consider only those filter criterias where both parameter
        // and value has been provided
        filterWithoutEmpties.forEach((f) => {
          if (Number(f.value) === item[f.param]) {
            count += 1;
          }
        });
        // If TRUE, then the current item in the array meets all the filter criteria
        return count === filterWithoutEmpties.length;
      };
      return arr.filter((item) => matchesFilter(item));
    }
    return arr;
  };

  const setParameterValue = (val, index) => {
    const newFilter = [...filter];
    newFilter[index] = {
      ...filter[index],
      value: val,
    };
    setPage(0);
    setFilter(newFilter);
    setFilteredRows(filterRows(tableRows, newFilter));
  };

  const filterParameterChange = (val, index) => {
    const newFilter = [...filter];
    newFilter[index] = {
      param: val,
      value: '',
    };
    setFilter(newFilter);
  };

  useEffect(() => {
    if (name) {
      ExperimentsApi.getExperiment(name)
        .then((exp) => {
          setExperiment(exp);
          if (exp?.trials.length > 0) {
            if (exp?.trials[0].params.length > 0) {
              setParamHeaders(
                Object.keys(exp?.trials[0]?.params[0])
                  .map((header) => ({
                    id: header,
                    numeric: true,
                    disablePadding: false,
                    label: header,
                  })),
              );
            }

            const rows = exp?.trials.map((trial, _) => ({
              id: trial.id,
              name: trial.name,
              ...trial.params.length > 0 ? trial.params[0] : [],
            }));

            setTableRows(rows);
            setFilteredRows(rows);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [name]);

  const openJsonViewer = (experiment, trial) => {
    ExperimentsApi.getModelSpecification(experiment, trial.id)
      .then((modelSpecification) => {
        setTrialJSON(modelSpecification);
        setTrial(trial.name);
        setView(EXPERIMENT_VIEWS.jsonViewer);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const removeFilter = (filterIndex) => {
    const newFilter = [...filter];
    newFilter.splice(filterIndex, 1);
    setPage(0);
    setFilter(newFilter);
    setFilteredRows(filterRows(tableRows, newFilter));
  };

  const openLoadResultsDialog = (experimentName, trial) => {
    setSelectedTrial({
      experiment: experimentName,
      trial,
    });
    setLoadResultsDialogOpen(true);
  };

  const openLoadModelSpecificationDialog = (experimentName, trial) => {
    setSelectedTrial({
      experiment: experimentName,
      trial,
    });
    setLoadModelSpecDialogOpen(true);
  };

  const onLoadResultsAction = (actionConfirmed) => {
    if (actionConfirmed) {
      dispatch(viewExperimentResults({
        name: selectedTrial.experiment,
        trial: selectedTrial.trial,
      }));
    }
    setSelectedTrial(null);
    setLoadResultsDialogOpen(false);
  };

  const onLoadModelSpecificationAction = (actionConfirmed) => {
    if (actionConfirmed) {
      dispatch(loadTrialModelSpec({
        name: selectedTrial.experiment,
        trial: selectedTrial.trial,
        onlyModelSpecification: true,
      }));
    }
    setSelectedTrial(null);
    setLoadModelSpecDialogOpen(false);
  };

  return (
    <div className={classes.root}>
      <Box className="ViewExperimentHead">
        <Box mt={2} mb={3} className="editExperimentBack">
          <ArrowBackIcon onClick={() => setView(EXPERIMENT_VIEWS.list)} />
          <Typography variant="body2">{experiment?.name}</Typography>
        </Box>
        <div className="editExperiment-filter">
          <Button onClick={popoverhandleClick}>
            <FilterListIcon />
          </Button>
          <ExperimentRowFilter
            filter={filter}
            paramHeaders={paramHeaders}
            setParameterValue={setParameterValue}
            filterParameterChange={filterParameterChange}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            addFilterRow={addFilterRow}
            removeFilter={removeFilter}
          />
        </div>
      </Box>
      {experiment?.trials && (
        <>
          <Box className="editExperiment-trials">
            <BlurOnIcon />
            <Typography variant="h5">Experiment Trials</Typography>
          </Box>
          <TableContainer>
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                classes={classes}
                style={{ tableLayout: 'fixed' }}
                paramHeaders={paramHeaders}
                rowCount={filteredRows.length}
              />
              <TableBody>
                {stableSort(filteredRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow tabIndex={-1} key={row.name}>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        className={classes.sticky}
                      >
                        {row.name}
                      </TableCell>
                      {paramHeaders.map((header, index) => (
                        <TableCell key={`${header.label}_${index}`}>
                          {row[header.label]}
                        </TableCell>
                      ))}
                      <TableCell align="right" className={classes.stickyRight}>
                        <Box className="MuiTableCell-actions">
                          <IconButton
                            onClick={() => openLoadResultsDialog(experiment?.name, row)}
                          >
                            <AssessmentIcon className="MuiSvgIcon-assessment" />
                          </IconButton>
                          <Divider orientation="vertical" />
                          <IconButton onClick={() => openJsonViewer(experiment?.name, row)}>
                            <CodeIcon />
                          </IconButton>
                          <IconButton onClick={() => openLoadModelSpecificationDialog(experiment?.name, row)}>
                            <ReplayIcon className="MuiSvgIcon-replay" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredRows.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )}
          <DialogBox
            open={loadResultsDialogOpen}
            onDialogResponse={onLoadResultsAction}
            textForDialog={{
              heading: EXPERIMENT_TEXTS.VIEW_EXPERIMENTS_RESULTS,
              content: EXPERIMENT_TEXTS.VIEW_EXPERIMENTS_RESULTS_MESSAGE,
            }}
          />
          <DialogBox
            open={loadModelSpecDialogOpen}
            onDialogResponse={onLoadModelSpecificationAction}
            textForDialog={{
              heading: EXPERIMENT_TEXTS.LOAD_TRIAL_MODEL_SPEC,
              content: EXPERIMENT_TEXTS.LOAD_TRIAL_MODEL_SPEC_MESSAGE,
            }}
          />
        </>
      )}
    </div>
  );
};

ExperimentView.propTypes = {
  name: PropTypes.string.isRequired,
  setTrial: PropTypes.func.isRequired,
  setTrialJSON: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
};

export default withStyles(useStyles)(ExperimentView);
