import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { addExperiment, editExperiment, getParameters } from 'root/api/experiments';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Link from '@material-ui/core/Link';
import {
  GridLayout,
} from 'netpyne/components';
import { withStyles } from '@material-ui/core/styles';
const RANGE = 'range';
const LIST = 'list';
/**
 * Edit/Add view of a single Experiment.
 *
 * @return {JSX.Element}
 * @constructor
 */
const useStyles = (theme) => ({
  root: {
    '& .editExperimentBack': {
      display: 'flex',
      cursor: 'pointer',
      paddingLeft: theme.spacing(1),
      '& .MuiTypography-root': {
        marginLeft: theme.spacing(1),
      },
    },
    '& .editExperimentBreadcrumb': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.4),
      },
    },
    '& .editExperimentAutocomplete': {
      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, 9px) scale(0.75)',
      },
      '& .MuiAutocomplete-input': {
        padding: '1rem 0.25rem 0.188rem',
      },
    },
    '& .editExperimentList': {
      display: 'flex',
      marginBottom: theme.spacing(1),
      width: '100%'
    },
    '& .MuiTypography-body2': {
      fontSize: '1rem',
    },
    '& .editExperimentDefault': {
      paddingLeft: theme.spacing(1),
      overflow: 'auto',
      maxHeight: '60vh'
    },
    '& .editExperimentHead': {
      paddingLeft: theme.spacing(1),
    },
    '& .editExperimentGroup': {
      borderRadius: theme.spacing(0.4),
      padding: theme.spacing(2, 0),
      '& .editExperimentBreadcrumb': {
        paddingLeft: '0.625rem',
      },
      '& .editExperimentRow': {
        paddingLeft: theme.spacing(4),
        position: 'relative',
        overflow: 'auto',
        maxHeight: '25vh',
        '&:before': {
          background: '#4A4A4A',
          content: '""',
          height: '100%',
          width: '0.125rem',
          margin: 0,
          display: 'block',
          position: 'absolute',
          left: '0.875rem',
        },
      },
    },
    '& .MuiAutocomplete-root': {
      width: '100% !important',
      '& .MuiAutocomplete-popper': {
        marginTop: -theme.spacing(1),
        '& .MuiAutocomplete-option': {
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
        }
      },
      '& .MuiPopover-root': {
        '& .MuiPaper-root': {
          '& .MuiList-root': {
            '& .MuiMenuItem-gutters': {
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
            }
          }
        }
      },

      '& .MuiPopover-experiment': {
        width: theme.spacing(14),
      },
    },
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0 !important',
    },
    '& .MuiFilledInput-underline': {
      '&:after, &:before': {
        display: 'none',
      },
    },
    '& .MuiFormLabel-root': {
      fontWeight: 'normal',
    },
    '& .editExperimentFooter': {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#434343',
      boxShadow: '0 -7px 13px -4px rgb(0, 0, 0, 0.6)',
      padding: theme.spacing(2.5),
      zIndex: 100,
      '& .MuiTypography-colorPrimary': {
        borderBottom: '#EB517A 1px solid',
        display: 'inline-flex',
        color: '#EB517A',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'none',
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1rem',
          marginTop: theme.spacing(0.4),
        },
      },
      '& .MuiButton-root': {
        minWidth: theme.spacing(11),
        padding: theme.spacing(0.4),
        marginLeft: theme.spacing(1),
        borderRadius: '2px',
        cursor: 'pointer',
        textTransform: 'uppercase',
      },
      '& .MuiButton-textSecondary': {
        color: '#fff',
      },
    },
    '& .editExpermentWarning': {
      paddingLeft: '0.625rem',
      '& .MuiTypography-caption': {
        fontSize: '0.875rem',
      }
    },
    '& .editExperimentField': {
      '& .MuiFormControl-root': {
        overflow: 'hidden',
        '& .MuiFormLabel-root': {
          whiteSpace: 'noWrap',
        }
      }
    }
  },
});

const EditExperiment = (props) => {
  const { classes, setList } = props;
  const experimentDetail = useSelector((state) => state.experiments.experimentDetail);

  const [parameters, setParameters] = useState([{
    mapsTo: '', type: RANGE, min: 0, max: 0, step: 0, inGroup: false,
  }, {
    mapsTo: '', type: LIST, values: [], inGroup: false,
  }]);

  const [groupParameters, setGroupParameters] = useState([{
    mapsTo: '', type: RANGE, min: 0, max: 0, step: 0, inGroup: true,
  }, {
    mapsTo: '', type: LIST, values: [1, 33, 3, 3, 3], inGroup: true,
  }]);

  // Example payload for new experiment
  const newExperiment = {
    name: 'New Experiment',
    params: [{
      mapsTo: 'netParams.connParams.weight',
      type: LIST,
      values: [1, 2, 3, 4, 5],
      inGroup: true,
    }, {
      mapsTo: 'netParams.connParams.probability',
      type: RANGE,
      min: 0.0,
      max: 1.0,
      step: 0.3,
      inGroup: false,
    },
    ],
  };

  const create = () => {
    // When user creates a new Experiment
    addExperiment(newExperiment)
      .then((result) => {
        console.log(result);
      });
  };

  const update = () => {
    // When user edits existing Experiment
    // TODO: use name of current Experiment
    editExperiment('EI Populations', { name: 'New Experiment' })
      .then((result) => {
        console.log(result);
      });
  };

  const [selectionParams, setSelectionParams] = useState([])
  const viewParameters = () => {
    getParameters().then((parameters) => {
      // netParams JSON dict
      const keys = [];
      Object.keys((parameters)).map((key) => keys.push({title: key}) );
      setSelectionParams(keys);
    });
  };

  useEffect(() => {
    viewParameters();
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, parameter, index, type) => {
    const newParam = type === parameter.inGroup ?  [...groupParameters] : [...parameters];
    newParam[index] = { ...parameter, type: event.target.value };
    type === parameter.inGroup ? setGroupParameters(newParam) : setParameters(newParam);
  };

  const handleParamSelection = (event, parameter, index, type) => {
    const newParam = type === parameter.inGroup ?  [...groupParameters] : [...parameters];
    newParam[index] = { ...parameter, mapsTo: event.target.value };
    type === parameter.inGroup ? setGroupParameters(newParam) : setParameters(newParam);
  }

  const parameterRow = (parameter, index) => (
    <Grid className="editExperimentList" container spacing={1} key={parameter.name}>
      <Grid item xs className="editExperimentAutocomplete">
        <Autocomplete
          popupIcon={<ExpandMoreIcon />}
          id="combo-box-demo"
          options={selectionParams}
          getOptionLabel={(option) => option.title}
          style={{ width: 300 }}
          renderOption={(option) => (
            <>
              <ArrowRightIcon />
              {option.title}
            </>
          )}
          renderInput={(params) => <TextField {...params} label="Type or select parameter" variant="outlined" />}
          onChange={(e) => handleParamSelection(e, parameter, index, type)}
        />
      </Grid>
      <Grid item xs={3} className="editExperimentSelect">
        <FormControl variant="filled">
          <InputLabel id="demo-simple-select-filled-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={parameter.type}
            onChange={(e) => handleChange(e, parameter, index, type)}
            IconComponent={ExpandMoreIcon}
          >

            <MenuItem value="range">Range</MenuItem>
            <MenuItem value="list">List</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid container item xs={4} spacing={1} className="editExperimentField">
        { parameter.type === RANGE ? (
          <>
            <Grid item xs={4}>
              <TextField id="filled-basic" label="From" variant="filled" value={parameter?.min || 0} />
            </Grid>
            <Grid item xs={4}>
              <TextField id="filled-basic" label="To" variant="filled" value={parameter?.max || 0} />
            </Grid>
            <Grid item xs={4}>
              <TextField id="filled-basic" label="Step" variant="filled" value={parameter?.step || 0} />
            </Grid>
          </>
        )
          : (
            <Grid item xs={12}>
              <TextField id="filled-basic" label="Values (separated with comas)" variant="filled" value={parameter?.values ? [...parameter?.values] : []}/>
            </Grid>
          )}
      </Grid>
      <Grid item xs="auto" className="editExperimentMenu">
        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          classes={{ paper: 'MuiPopover-experiment' }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          { parameter.inGroup ?
            <MenuItem onClick={() => removeFromGroup(index, parameter)}>Remove from group</MenuItem> : <MenuItem onClick={() => addToGroup(index, parameter)}>{`Add to Group${!parameter.inGroup}`}</MenuItem>
          }
          <MenuItem onClick={() => removeParamter(index, parameter)}>Delete</MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );

  const addParameter = () => {
    setParameters([...parameters, {
      mapsTo: '', type: RANGE, min: 0, max: 0, step: 0, inGroup: false,
    }]);
  };

  const addToGroup = (index, parameter) => {
    console.log(index, parameter)
    const newParams = [...parameters]
    newParams.splice(index, 1);
    setGroupParameters([...groupParameters, {...parameters[index], inGroup: true}])
    setParameters(newParams)
    handleClose()
  }

  const removeParamter = (index, parameter) => {
    console.log(index)
    const selectedParameters = parameter.inGroup ? [...groupParameters] : [...parameters];
    selectedParameters.splice(index, 1);
    parameter.inGroup ? setGroupParameters(selectedParameters) : setParameters(selectedParameters)
    handleClose()
  }

  const removeFromGroup = (index, parameter) => {
    setParameters([...parameters, {...groupParameters[index], inGroup: false}])
    const newParams = [...groupParameters]
    newParams.splice(index, 1);
    setGroupParameters(newParams)
    handleClose()
  }

  return (
    <GridLayout className={classes.root}>
      <Box className="editExperimentContainer">
        <Box my={3} className="editExperimentBack">
          <ArrowBackIcon onClick={() => setList(true)} />
          <Typography variant="body2">New Experiment</Typography>
        </Box>
        <Box mb={2} className="editExperimentHead">
          <form noValidate autoComplete="off">
            <TextField id="filled-basic" label="Experiment Name" variant="filled" />
          </form>
          <Box mt={3}>
            <Divider />
          </Box>
        </Box>
        <Box className="editExperimentContent">
          <Box mb={2} className="editExperimentDefault">
            <Box mb={2} className="editExperimentBreadcrumb">
              <Typography variant="body2">Parameters</Typography>
            </Box>
            <Box mb={2} className="editExperimentGroup">
              <Box mb={2} className="editExperimentBreadcrumb">
                <Typography variant="body2">Groupped Parameters</Typography>
              </Box>
              <Box className="editExperimentRow scrollbar scrollchild">
                {groupParameters.map((parameter, index) => (
                  parameterRow(parameter, index)
                ))}
              </Box>
              { groupParameters.length === 1 && <Box className="editExpermentWarning">
                <Typography variant="caption">Warning: You need at least two parameters for the grouping to work.</Typography>
              </Box> }
            </Box>
            <Box className="editExperimentRow">
              {parameters.map((parameter, index) => (
                parameterRow(parameter, index)
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className="scrollbar scrollchild"
        mt={1}
        display="flex"
        flexWrap="wrap"
      >
        <Box className="editExperimentFooter">
          <Box>
            <Link to="true" color="primary" onClick={addParameter}>
              <AddIcon />
              Add parameter
            </Link>
          </Box>
          <Box display="flex">
            <Button color="secondary" onClick={() => setList(true)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={create}>
            Create
          </Button>
          </Box>
        </Box>
      </Box>
    </GridLayout>
  );
};

export default withStyles(useStyles)(EditExperiment);
