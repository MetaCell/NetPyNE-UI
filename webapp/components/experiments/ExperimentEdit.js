import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import {
  addExperiment, editExperiment, getExperiment, getParameters,
} from 'root/api/experiments';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from '@material-ui/core/Link';
import {
  GridLayout,
} from 'netpyne/components';
import { withStyles } from '@material-ui/core/styles';
import { EXPERIMENT_TEXTS } from '../../constants';
import ParameterMenu from './ParameterMenu';
import {
  bgDarkest,
  bgLight,
  bgRegular,
  secondaryColor,
  fontColor,
  radius,
  primaryColor,
  experimentInputColor,
  experimentFieldColor,
  experimentSvgColor,
  experimentLabelColor,
  experimentAutocompleteBorder,
  errorFieldBorder,
} from '../../theme';

const RANGE_VALUE = 0;
const regex = new RegExp(/^(\s*-?\d+(\.\d+)?)(\s*,\s*-?\d+(\.\d+)?)*$/);

/**
 * Edit/Add view of a single Experiment.
 *
 * @return {JSX.Element}
 * @constructor
 */
const useStyles = (theme) => ({
  root: {
    '& .editExperimentContainer': {
      '& .editExperimentContent': {
        overflow: 'auto',
        maxHeight: 'calc(100vh - 400px)',
        '& .MuiTypography-body2': {
          opacity: '0.54',
        },
      },
    },
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
      width: '100%',
    },
    '& .MuiTypography-body2': {
      fontSize: '1rem',
    },
    '& .editExperimentDefault': {
      paddingLeft: theme.spacing(1),
      overflow: 'auto',
    },
    '& .editExperimentHead': {
      paddingLeft: theme.spacing(1),
    },
    '& .editExperimentGroup': {
      background: bgDarkest,
      borderRadius: theme.spacing(0.4),
      padding: theme.spacing(2, 0),
      '& .scrollbar': {
        '&::-webkit-scrollbar-thumb': {
          background: secondaryColor,
          borderLeft: `${radius} solid ${bgDarkest}`,
          borderRight: `${radius} solid ${bgDarkest}`,
        },
        '&::-webkit-scrollbar': {
          width: theme.spacing(2),
        },
      },
      '& .editExperimentBreadcrumb': {
        paddingLeft: '0.625rem',
      },
      '& .editExperimentRow': {
        paddingLeft: theme.spacing(4),
        position: 'relative',
        overflow: 'auto',
        maxHeight: '25vh',
        '&:before': {
          background: bgLight,
          content: '""',
          height: '100%',
          width: '0.125rem',
          margin: 0,
          display: 'block',
          position: 'absolute',
          left: '0.875rem',
        },
      },
      '& .MuiFilledInput-root': {
        background: experimentFieldColor,
      },
      '& .MuiOutlinedInput-root': {
        background: experimentFieldColor,
      },
    },
    '& .MuiAutocomplete-root': {
      width: '100% !important',
    },
    '& .MuiPopover-root': {
      '& .MuiPaper-root': {
        '& .MuiList-root': {
          '& .MuiMenuItem-gutters': {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
        },
      },
    },
    '& .MuiPopover-experiment': {
      width: theme.spacing(14),
    },
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiOutlinedInput-root': {
      background: experimentInputColor,
    },
    '& .MuiFilledInput-root': {
      borderRadius: radius,
      background: experimentInputColor,
      border: '1px solid transparent',
      '&.Mui-error': {
        borderColor: errorFieldBorder,
        boxShadow: '0 0 0 2px rgba(242, 69, 61, 0.2)',
      },
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
      color: fontColor,
      opacity: '0.54',
      '&.MuiInputLabel-shrink': {
        color: experimentLabelColor,
        opacity: '0.87',
      },
    },
    '& .MuiTypography-colorPrimary': {
      borderBottom: `${primaryColor} 1px solid`,
      display: 'inline-flex',
      color: primaryColor,
      cursor: 'pointer',
      marginLeft: theme.spacing(1),
      '&:hover': {
        textDecoration: 'none',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
        marginTop: theme.spacing(0.4),
      },
    },
    '& .editExperimentFooter': {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      background: bgRegular,
      boxShadow: '0 -7px 13px -4px rgb(0, 0, 0, 0.6)',
      padding: theme.spacing(2.5),
      zIndex: 100,
      '& .MuiButton-root': {
        minWidth: theme.spacing(11),
        padding: theme.spacing(0.4),
        marginLeft: theme.spacing(1),
        borderRadius: '2px',
        cursor: 'pointer',
        textTransform: 'uppercase',
      },
      '& .MuiButton-textSecondary': {
        color: fontColor,
      },
    },
    '& .editExperimentWarning': {
      paddingLeft: '0.625rem',
      '& .MuiTypography-root': {
        color: experimentLabelColor,
      },
      '& .MuiTypography-caption': {
        fontSize: '0.875rem',
      },
    },
    '& .editExperimentField': {
      '& .MuiFormControl-root': {
        overflow: 'hidden',
        '& .MuiFormLabel-root': {
          whiteSpace: 'noWrap',
        },
      },
    },
    '& .MuiFormHelperText-contained': {
      marginLeft: 0,
    },
    '& .MuiFormHelperText-root': {
      color: errorFieldBorder,
      fontSize: '0.875rem',
      lineHeight: '100%',
    },
  },
  popper: {
    marginTop: -theme.spacing(1),
    '& .MuiPaper-root': {
      boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
      borderRadius: `0 0 ${radius} ${radius}`,
      borderTop: `1px solid ${experimentAutocompleteBorder}`,
    },
    '& .MuiSvgIcon-root': {
      color: experimentSvgColor,
    },
    '& .MuiAutocomplete-option': {
      paddingLeft: theme.spacing(2),
      color: fontColor,
      paddingRight: theme.spacing(1),
    },
  },
});

const ParameterRow = (parameter, index, handleParamSelection, handleChange, handleInputText,
  handleInputValues, addToGroup, removeFromGroup, removeParameter, selectionParams, classes) => {
  const { RANGE } = EXPERIMENT_TEXTS;
  return (
    <Grid className="editExperimentList" container spacing={1} key={`${parameter.name}-${index}`}>
      <Grid item xs className="editExperimentAutocomplete">
        <Autocomplete
          popupIcon={<ExpandMoreIcon />}
          id={`${parameter.name}-combo-box-demo`}
          options={selectionParams}
          style={{ width: 300 }}
          classes={{
            popper: classes.popper,
          }}
          renderOption={(option) => (
            <>
              {option}
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type or select parameter"
              variant="outlined"
            />
          )}
          value={parameter.mapsTo || ''}
          onChange={(e, val) => handleParamSelection(val, parameter, index)}
        />
      </Grid>
      <Grid item xs={3} className="editExperimentSelect">
        <FormControl variant="filled">
          <InputLabel id={`${parameter.name}-select-filled-label`}>Type</InputLabel>
          <Select
            labelId={`${parameter.name}-select-filled-label`}
            id={`${parameter.name}-select-filled-filled`}
            value={parameter.type}
            onChange={(e) => handleChange(e, parameter, index)}
            IconComponent={ExpandMoreIcon}
          >

            <MenuItem value="range">Range</MenuItem>
            <MenuItem value="list">List</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid container item xs={4} spacing={1} className="editExperimentField">
        {parameter.type === RANGE ? (
          <>
            <Grid item xs={4}>
              <TextField
                id={`${parameter.name}-from`}
                label="From"
                variant="filled"
                value={parameter?.minVal || parameter?.min}
                onChange={(e) => handleInputText(e.target.value, index, parameter, 'min')}
                error={parameter?.minerror}
                helperText={parameter?.minhelperText}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id={`${parameter.name}-to`}
                label="To"
                variant="filled"
                value={parameter?.maxVal || parameter?.max}
                onChange={(e) => handleInputText(e.target.value, index, parameter, 'max')}
                error={parameter?.maxerror}
                helperText={parameter?.maxhelperText}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id={`${parameter.name}-step`}
                label="Step"
                variant="filled"
                value={parameter?.stepVal || parameter?.step}
                onChange={(e) => handleInputText(e.target.value, index, parameter, 'step')}
                error={parameter?.steperror}
                helperText={parameter?.stephelperText}
                autoComplete="off"
              />
            </Grid>
          </>
        )
          : (
            <Grid item xs={12}>
              <TextField
                id={`${parameter.name}-values`}
                label="Values (separated with comas)"
                variant="filled"
                value={parameter?.val || parameter?.values.join('')}
                onChange={(e) => handleInputValues(e.target.value, index, parameter, 'val')}
                error={parameter.error}
                helperText={parameter.helperText}
                autoComplete="off"
              />
            </Grid>
          )}
      </Grid>
      <Grid item xs="auto" className="editExperimentMenu">
        <ParameterMenu
          parameter={parameter}
          index={index}
          addToGroup={addToGroup}
          removeParameter={removeParameter}
          removeFromGroup={removeFromGroup}
        />
      </Grid>
    </Grid>

  );
};

const ExperimentEdit = (props) => {
  const {
    classes,
    setList,
    name,
    editState
  } = props;

  const {
    RANGE,
    LIST,
  } = EXPERIMENT_TEXTS;
  const rangeParam = {
    type: RANGE,
    min: RANGE_VALUE,
    minVal: RANGE_VALUE,
    max: RANGE_VALUE,
    maxVal: RANGE_VALUE,
    step: RANGE_VALUE,
    stepVal: RANGE_VALUE,
  };
  const [parameters, setParameters] = useState([{
    mapsTo: '',
    ...rangeParam,
    inGroup: false,
  }, {
    mapsTo: '',
    type: LIST,
    values: [],
    inGroup: false,
    val: '',
  }]);

  // TODO: combine into one experiment state?
  const [groupParameters, setGroupParameters] = useState([]);
  const [experimentName, setExperimentName] = useState('');
  const [experimentError, setExperimentError] = useState(false);
  const [selectionParams, setSelectionParams] = useState([]);
  // Existing Experiment.
  const [experiment, setExperiment] = useState(null);

  const setExperimentDetail = (exp) => {
    setExperiment(exp);
    setExperimentName(exp?.name);
    if (exp?.params.length > 0) {
      const params = [];
      const groupParams = [];
      exp.params.forEach((param) => {
        if (param.inGroup) {
          groupParams.push(param);
        } else {
          params.push(param);
        }
      });
      setParameters(params);
      setGroupParameters(groupParams);
    }
  };

  useEffect(() => {
    if (name) {
      getExperiment(name)
        .then((exp) => {
          setExperimentDetail(exp);
        })
        .catch((error) => console.error(error));
    }
  }, [name]);

  const submit = () => {
    if (experimentName === '') {
      setExperimentError(true);
    } else {
      setExperimentError(false);
      const newExperimentDetails = {
        name: experimentName,
        params: [...parameters, ...groupParameters],
      };
      if (editState) {
        // When user updates an existing Experiment
        editExperiment(experiment?.name, newExperimentDetails)
          .then(() => {
            setList(true);
          });
      } else {
        // When user creates a new Experiment
        addExperiment(newExperimentDetails).then(() => {
          setList(true);
        });
      }
    }
  };

  const flatten = (obj, path = '') => {
    if (!(obj instanceof Object)) return { [path.replace(/\.$/g, '')]: obj };

    return Object.keys(obj)
      .reduce((output, key) => (obj instanceof Array
        ? { ...output, ...flatten(obj[key], `${path}[${key}].`) }
        : { ...output, ...flatten(obj[key], `${path + key}.`) }), {});
  };

  const viewParameters = () => {
    getParameters()
      .then((params) => {
        // netParams JSON dict
        setSelectionParams(Object.keys(flatten(params)));
      });
  };

  useEffect(() => {
    viewParameters();
  }, []);

  const setParamChange = (inGroup, param) => {
    if (inGroup) {
      setGroupParameters(param);
    } else {
      setParameters(param);
    }
  };

  const handleChange = (event, parameter, index) => {
    const newParam = parameter.inGroup ? [...groupParameters] : [...parameters];
    const newValues = event.target.value === RANGE ? { ...rangeParam } : {
      values: [],
      type: LIST,
      val: '',
    };
    newParam[index] = { ...parameter, ...newValues };
    setParamChange(parameter.inGroup, newParam);
  };

  const handleParamSelection = (val, parameter, index) => {
    const newParam = parameter.inGroup ? [...groupParameters] : [...parameters];
    newParam[index] = {
      ...parameter,
      mapsTo: val,
    };
    setParamChange(parameter.inGroup, newParam);
  };

  const addParameter = () => {
    setParameters([...parameters, {
      mapsTo: '',
      ...rangeParam,
      inGroup: false,
    }]);
  };

  const addToGroup = (index) => {
    const newParams = [...parameters];
    newParams.splice(index, 1);
    setGroupParameters([...groupParameters, {
      ...parameters[index],
      inGroup: true,
    }]);
    setParameters(newParams);
  };

  const removeParameter = (index, parameter) => {
    const selectedParameters = parameter.inGroup ? [...groupParameters] : [...parameters];
    selectedParameters.splice(index, 1);
    setParamChange(parameter.inGroup, selectedParameters);
  };

  const removeFromGroup = (index) => {
    setParameters([...parameters, {
      ...groupParameters[index],
      inGroup: false,
    }]);
    const newGroupParams = [...groupParameters];
    newGroupParams.splice(index, 1);
    setGroupParameters(newGroupParams);
  };

  const handleInputText = (val, index, parameter, key) => {
    const newParameters = parameter.inGroup ? [...groupParameters] : [...parameters];
    const invalidValue = isNaN(val);
    newParameters[index] = {
      ...parameter,
      [`${key}Val`]: val,
      [key]: parseFloat(val),
      [`${key}error`]: invalidValue,
      [`${key}helperText`]: !invalidValue ? '' : EXPERIMENT_TEXTS.INPUT_ERR_MESSAGE,
    };
    setParamChange(parameter.inGroup, newParameters);
  };

  const handleInputValues = (val, index, parameter) => {
    const newParameters = parameter.inGroup ? [...groupParameters] : [...parameters];
    const validValue = regex.test(val);
    newParameters[index] = {
      ...parameter,
      val,
      values: [...val],
      error: !validValue,
      helperText: validValue ? '' : EXPERIMENT_TEXTS.INPUT_ERR_MESSAGE,
    };
    setParamChange(parameter.inGroup, newParameters);
  };

  const setExperimentNameInfo = (val) => {
    setExperimentError(val === '');
    setExperimentName(val);
  };

  return (
    <GridLayout className={classes.root}>
      <Box className="editExperimentContainer">
        <Box my={3} className="editExperimentBack">
          <ArrowBackIcon onClick={() => setList(true)} />
          <Typography variant="body2">{!editState ? 'New Experiment' : 'Edit Experiment'}</Typography>
        </Box>
        <Box mb={2} className="editExperimentHead">
          <form noValidate autoComplete="off">
            <TextField
              id="experiment-name"
              label="Experiment Name"
              variant="filled"
              value={experimentName}
              onChange={(e) => setExperimentNameInfo(e.target.value)}
              error={experimentError}
              helperText={experimentError ? 'Please enter experiment name' : ''}
            />
          </form>
          <Box mt={3}>
            <Divider />
          </Box>
        </Box>
        <Box className="editExperimentContent">
          <Box mb={1} className="editExperimentDefault">
            <Box mb={2} className="editExperimentBreadcrumb">
              <Typography variant="body2">Parameters</Typography>
            </Box>
            {groupParameters.length > 0 && (
              <Box mb={2} className="editExperimentGroup">
                <Box mb={2} className="editExperimentBreadcrumb">
                  <Typography variant="body2">Grouped Parameters</Typography>
                </Box>
                <Box className="editExperimentRow scrollbar scrollchild">
                  {groupParameters.map((parameter, index) => (
                    ParameterRow(parameter, index, handleParamSelection, handleChange,
                      handleInputText, handleInputValues, addToGroup, removeFromGroup,
                      removeParameter, selectionParams, classes)
                  ))}
                </Box>
                {groupParameters.length === 1 && (
                  <Box className="editExperimentWarning">
                    <Typography variant="caption">{EXPERIMENT_TEXTS.WARNING}</Typography>
                  </Box>
                )}
              </Box>
            )}
            {selectionParams.length > 0 && (
              <Box className="editExperimentRow">
                {parameters.map((parameter, index) => (
                  ParameterRow(parameter, index, handleParamSelection, handleChange,
                    handleInputText, handleInputValues, addToGroup, removeFromGroup,
                    removeParameter, selectionParams, classes)
                ))}
              </Box>
            )}
          </Box>
        </Box>
        <Box>
          <Link to="true" color="primary" onClick={addParameter}>
            <AddIcon />
            Add parameter
          </Link>
        </Box>
      </Box>
      <Box
        className="scrollbar scrollchild"
        mt={1}
        display="flex"
        flexWrap="wrap"
      >
        <Box className="editExperimentFooter">
          <Box display="flex">
            <Button color="secondary" onClick={() => setList(true)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={submit}>
              { editState ? 'Save' : 'Create' }
            </Button>
          </Box>
        </Box>
      </Box>
    </GridLayout>
  );
};

export default withStyles(useStyles)(ExperimentEdit);
