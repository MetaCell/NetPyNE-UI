import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import * as ExperimentsApi from '../../api/experiments';
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
import { EXPERIMENT_TEXTS, EXPERIMENT_VIEWS, REAL_TYPE } from '../../constants';
import Utils from '../../Utils';
import ParameterMenu from './ParameterMenu';
import useStyles from './ExperimentEditStyle';
import * as ExperimentHelper from './ExperimentHelper';
import DialogBox from '../general/DialogBox';
import {getFlattenedParams} from './processExperimentData';
import Tooltip from '@material-ui/core/Tooltip';

const RANGE_VALUE = 0;

const MAX_TRIALS = 100;

const {
  RANGE,
  LIST,
} = EXPERIMENT_TEXTS;


const ParameterRow = (parameter, index, handleParamSelection, handleChange, handleRangeInput,
  handleInputValues, addToGroup, removeFromGroup, removeParameter, selectionParams, classes) => (
    <Grid
      className="editExperimentList"
      container
      spacing={1}
      key={`${parameter.name}-${index}`}
    >
      <Grid item xs className="editExperimentAutocomplete">
      
        <Autocomplete
          popupIcon={<ExpandMoreIcon />}
          id={`${parameter.name}-combo-box-demo`}
          options={selectionParams ? Object.keys(selectionParams): []}
          style={{ width: 300 }}
          classes={{
            popper: classes.popper,
          }}
          renderOption={(option) => (
            <>{option}</>
              
            
          )}
          renderInput={(params) => (
            <Tooltip placement="top" title={selectionParams && parameter.mapsTo && (Utils.getMetadataField(parameter.mapsTo, 'help') || `This field is of type ${selectionParams[parameter.mapsTo]?.type}`) }>
            <TextField
              {...params}
              disabled={Boolean(parameter.mapsTo)}
              label={parameter.mapsTo && selectionParams ? selectionParams[parameter.mapsTo]?.label: "Type or select parameter"}
              variant="outlined"
            /></Tooltip>
          )}
         
          value={parameter.mapsTo || null}
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
            (parameter.field === undefined || (parameter?.field && [REAL_TYPE.FLOAT, REAL_TYPE.INT, REAL_TYPE.FUNC].includes(parameter.field.type)))
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
                type="number"
                value={parameter?.minVal || parameter?.min}
                onChange={(e) => handleRangeInput(e.target.value, index, parameter, 'min')}
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
                type="number"
                value={parameter?.maxVal || parameter?.max}
                onChange={(e) => handleRangeInput(e.target.value, index, parameter, 'max')}
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
                type="number"
                value={parameter?.stepVal || parameter?.step}
                onChange={(e) => handleRangeInput(e.target.value, index, parameter, 'step')}
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
                label="Values (separated with commas)"
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
    editExperiment,
    addExperiment,
    visible, updates, widgets
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
    mapsTo: null,
    ...rangeParam,
    inGroup: false,
    error: false,
  }, {
    mapsTo: null,
    type: LIST,
    values: [],
    inGroup: false,
    val: '',
    error: false,
  }]);

  const [groupParameters, setGroupParameters] = useState([]);
  const [experimentName, setExperimentName] = useState('');
  const [experimentNameError, setExperimentNameError] = useState('');
  const [selectionParams, setSelectionParams] = useState(null);
  const [trialNumberErrorDialogOpen, setTrialNumberErrorDialogOpen] = useState({ condition: false, number: 1 });


  // Existing Experiment.
  const [experiment, setExperiment] = useState(null);
  const experiments = useSelector((state) => state.experiments.experiments);

  let numberOfTrials = 1;
  const validateParameter = (param) => {
    let updatedParam = param;
    if (param.type === LIST) {
      updatedParam = ExperimentHelper.validateListParameter(updatedParam);
    } else if (param.type === RANGE) {
      if (param.mapsTo != null && param.mapsTo.length > 0) {
        updatedParam = ExperimentHelper.validateRangeParameter(updatedParam, param.min, 'min');
        updatedParam = ExperimentHelper.validateRangeParameter(updatedParam, param.max, 'max');
        updatedParam = ExperimentHelper.validateRangeParameter(updatedParam, param.step, 'step');
      }
    }
    return updatedParam;
  };

  const setExperimentDetail = (exp) => {
    setExperiment(exp);
    setExperimentName(exp?.name);
    if (exp?.params.length > 0) {
      const params = [];
      const groupParams = [];
      exp.params.forEach((param) => {
        let updatedParam = param;
        if (param.mapsTo != null) {
          const field = Utils.getMetadataField(param.mapsTo);
          if (field) {
            updatedParam = { ...param, field };
            updatedParam = validateParameter(updatedParam);
          }
        }

        if (param.inGroup) {
          groupParams.push(updatedParam);
        } else {
          params.push(updatedParam);
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
        // eslint-disable-next-line prefer-template
        // eslint-disable-next-line no-undef
        setSelectionParams(getFlattenedParams(params));
        
      });
  };

  useEffect(() => {
    if(visible) {
      getParameters();
    }
    
  }, [visible, updates, widgets]);

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
    setParameters(parameters.map((p) => validateParameter(p)));
    setGroupParameters(groupParameters.map((p) => validateParameter(p)));

    const valid = validateExperimentName(experimentName);

    let params = [...parameters, ...groupParameters];
    const validParams = !params.some((p) => p.error);

    if (!valid || !validParams) {
      return;
    }

    params = params
      .filter((p) => p.mapsTo != null && p.mapsTo.length > 0)
      .map((p) => {
        if (p.type === LIST) {
          return {
            mapsTo: p.mapsTo,
            type: p.type,
            values: p.values,
            inGroup: p.inGroup,
            label: p.label,
          };
        }

        if (p.type === RANGE) {
          return {
            mapsTo: p.mapsTo,
            type: p.type,
            min: p.min,
            max: p.max,
            step: p.step,
            inGroup: p.inGroup,
            label: p.label,
          };
        }

        return null;
      })
      .filter((p) => p != null);

    const newExperimentDetails = {
      name: experimentName,
      params,
    };

    numberOfTrials = 1;

    params.forEach((param) => {
      if (param.type === LIST) {
        numberOfTrials *= param.values.length;
      } else if (param.type === RANGE) {
        numberOfTrials *= Math.ceil((param.max - param.min) / param.step);
      }
    });

    if (numberOfTrials > MAX_TRIALS) {
      setTrialNumberErrorDialogOpen({ condition: true, number: numberOfTrials });
    } else if (editState) {
      editExperiment(experiment?.name, newExperimentDetails)  
      setView(EXPERIMENT_VIEWS.list);
    } else {
      addExperiment(newExperimentDetails);
      setView(EXPERIMENT_VIEWS.list);
    }
  };

  const setParamChange = (inGroup, parameters) => {
    if (inGroup) {
      setGroupParameters(parameters);
    } else {
      setParameters(parameters);
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
      field = selectionParams[val];
    }

    const newParam = parameter.inGroup ? [...groupParameters] : [...parameters];

    // TODO: remove range fields here, best create new param from scratch!
    newParam[index] = {
      ...parameter,
      mapsTo: val,
      field,
      helperText: '',
      error: false,
      val: '',
      values: [],
    };

    if (parameter.type === RANGE) {
      if (field && ![REAL_TYPE.INT, REAL_TYPE.FLOAT, REAL_TYPE.FUNC].includes(field.type)) {
        newParam[index] = {
          ...newParam[index],
          type: LIST,
          values: [],
          val: '',
          helperText: '',
          error: false,
        };
      }
    }

    // TODO: validate here as well! And reset type!

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

  const handleRangeInput = (val, index, parameter, key) => {
    const newParameters = parameter.inGroup ? [...groupParameters] : [...parameters];
    newParameters[index] = ExperimentHelper.validateRangeParameter(parameter, val, key);
    setParamChange(parameter.inGroup, newParameters);
  };

  const handleInputValues = (val, index, parameter) => {
    const newParameters = parameter.inGroup ? [...groupParameters] : [...parameters];
    const newParameter = ExperimentHelper.validateListParameter({
      ...parameter,
      val,
      values: val.split(','),
    });

    newParameters[index] = { ...newParameter };
    setParamChange(parameter.inGroup, newParameters);
  };

  const setExperimentNameInfo = (val) => {
    validateExperimentName(val);
    setExperimentName(val);
  };

  return (
    <>
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
                      handleRangeInput, handleInputValues, addToGroup, removeFromGroup,
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
              {selectionParams && (
              <Box className="editExperimentRow">
                {parameters.map((parameter, index) => (
                  ParameterRow(parameter, index, handleParamSelection, handleChange,
                    handleRangeInput, handleInputValues, addToGroup, removeFromGroup,
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
                {editState ? 'Save' : 'Create'}
              </Button>
            </Box>
          </Box>
        </Box>
      </GridLayout>
      <DialogBox
        open={trialNumberErrorDialogOpen.condition}
        onDialogResponse={() => setTrialNumberErrorDialogOpen({ condition: false, number: 1 })}
        textForDialog={{
          heading: 'Error - Number of conditions is too large',
          content: `Please change your exploration parameters to
          reduce the number of experimental conditions to less than 100. Last number of conditions: ${trialNumberErrorDialogOpen.number}`,
        }}
      />
    </>
  );
};

export default withStyles(useStyles)(ExperimentEdit);
