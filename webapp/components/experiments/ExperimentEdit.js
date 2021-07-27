import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import * as ExperimentsApi from 'root/api/experiments';
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
import { useSelector } from 'react-redux';
import { EXPERIMENT_TEXTS, EXPERIMENT_VIEWS } from '../../constants';
import Utils from '../../Utils';
import ParameterMenu from './ParameterMenu';
import useStyles from './ExperimentEditStyle';

const RANGE_VALUE = 0;

const {
  RANGE,
  LIST,
} = EXPERIMENT_TEXTS;

const ParameterRow = (parameter, index, handleParamSelection, handleChange, handleInputText,
  handleInputValues, addToGroup, removeFromGroup, removeParameter, selectionParams, classes) => (
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
            <MenuItem value="list">List</MenuItem>
            {
            (parameter.field === undefined || (parameter?.field && ['float', 'int'].includes(parameter.field.type)))
              && <MenuItem value="range">Range</MenuItem>
            }
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
                value={parameter?.val || parameter?.values.join()}
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

const ExperimentEdit = (props) => {
  const {
    classes,
    name,
    editState,
    setView,
  } = props;

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

  const [groupParameters, setGroupParameters] = useState([]);
  const [experimentName, setExperimentName] = useState('');
  const [experimentNameError, setExperimentNameError] = useState('');
  const [selectionParams, setSelectionParams] = useState([]);

  // Existing Experiment.
  const [experiment, setExperiment] = useState(null);
  const experiments = useSelector((state) => state.experiments.experiments);

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
      ExperimentsApi.getExperiment(name)
        .then((exp) => {
          setExperimentDetail(exp);
        })
        .catch((error) => console.error(error));
    }
  }, [name]);

  const getParameters = () => {
    ExperimentsApi.getParameters()
      .then((params) => {
        setSelectionParams(Object.keys(Utils.flatten(params)));
      });
  };

  useEffect(() => {
    getParameters();
  }, []);

  const validateExperimentName = (name) => {
    const isEmpty = (val) => val == null || val.trim() === '';

    if (isEmpty(name)) {
      setExperimentNameError(EXPERIMENT_TEXTS.ERROR_EXPERIMENT_EMPTY);
      return false;
    }

    if (experiment?.name === name) {
      // name of the existing experiment didn't change
      return true;
    }

    if (experiments.map((exp) => exp.name).includes(name)) {
      setExperimentNameError(EXPERIMENT_TEXTS.ERROR_EXPERIMENT_WITH_NAME_EXISTS);
      return false;
    }

    setExperimentNameError('');
    return true;
  };

  const submit = () => {
    const valid = validateExperimentName(experimentName);
    if (!valid) {
      return;
    }

    const newExperimentDetails = {
      name: experimentName,
      params: [...parameters, ...groupParameters],
    };

    if (editState) {
      ExperimentsApi.editExperiment(experiment?.name, newExperimentDetails)
        .then(() => {
          setView(EXPERIMENT_VIEWS.list);
        });
    } else {
      ExperimentsApi.addExperiment(newExperimentDetails)
        .then(() => {
          setView(EXPERIMENT_VIEWS.list);
        });
    }
  };

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
    let field = null;
    if (val !== null) {
      // parameters are a subset of `netParams`
      field = Utils.getMetadataField(`netParams.${val}`);
    }

    const newParam = parameter.inGroup ? [...groupParameters] : [...parameters];
    newParam[index] = {
      ...parameter,
      mapsTo: val,
      field,
    };

    // don't allow range type if field type isn't int or float
    if (parameter.type === RANGE) {
      if (field && !['int', 'float'].includes(field.type)) {
        newParam[index] = {
          ...newParam[index],
          type: LIST,
          values: [],
          val: '',
        };
      }
    }

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
    const invalidValue = val === '' ? true : isNaN(val); // isNaN("") for empty string returns false so testing it separately
    newParameters[index] = {
      ...parameter,
      [`${key}Val`]: val,
      [key]: !invalidValue ? parseFloat(val) : val,
      [`${key}error`]: invalidValue,
      [`${key}helperText`]: !invalidValue ? '' : EXPERIMENT_TEXTS.INPUT_ERR_MESSAGE,
    };
    setParamChange(parameter.inGroup, newParameters);
  };

  const handleInputValues = (val, index, parameter) => {
    const newParameters = parameter.inGroup ? [...groupParameters] : [...parameters];

    let validator = () => true;
    let errorText = EXPERIMENT_TEXTS.INPUT_ERR_MESSAGE;

    // use parameter type to test with different validators
    if (parameter.field) {
      switch (parameter.field.type) {
        case 'int':
          validator = (el) => Number(el) && Number.isInteger(Number(el));
          errorText = 'Only integer values are allowed';
          break;

        case 'float':
          validator = (el) => Number(el);
          errorText = 'Only float values are allowed';
          break;

        case 'str':
          validator = (el) => String(el);
          errorText = 'Only string values are allowed';
          break;

        case 'bool':
          validator = (el) => Boolean(el);
          errorText = 'Only bool values (true|false) are allowed';
          break;

        default:
          // .. handling of more types
          // list(float), dict, list(list(float)), func
          break;
      }
    }

    let values = val.split(',');
    const validValue = values.every((element) => validator(element));
    if (validValue) {
      values = values.map((el) => Utils.convertFieldValue(parameter.field, el));
    }

    newParameters[index] = {
      ...parameter,
      val,
      values,
      error: !validValue,
      helperText: validValue ? '' : errorText,
    };
    setParamChange(parameter.inGroup, newParameters);
  };

  const setExperimentNameInfo = (val) => {
    validateExperimentName(val);
    setExperimentName(val);
  };

  return (
    <GridLayout className={classes.root}>
      <Box className="editExperimentContainer">
        <Box my={3} className="editExperimentBack">
          <ArrowBackIcon onClick={() => setView(EXPERIMENT_VIEWS.list)} />
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
              error={experimentNameError !== ''}
              helperText={experimentNameError}
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
            <Button color="secondary" onClick={() => setView(EXPERIMENT_VIEWS.list)}>
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
