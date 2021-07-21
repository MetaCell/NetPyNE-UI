import React, { useEffect, useState } from 'react';
import { ActionDialog } from 'netpyne/components';
import * as ExperimentsApi from 'root/api/experiments';
import {
  DialogContentText,
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  withStyles,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useDispatch } from 'react-redux';
import { simulateNetwork } from 'root/redux/actions/general';
import currentModal from '../../../static/icons/modelSelected.png';
import currentModalUnselected from '../../../static/icons/modelUnselected.png';
import experimentSelected from '../../../static/icons/experimentSelected.png';
import experimentUnselected from '../../../static/icons/experimentUnselected.png';
import Checkbox from '../../general/Checkbox';
import { LAUNCH_MODAL } from '../../../constants';
import {
  bgLight,
  errorFieldBorder,
  experimentInputColor,
  radius,
  fontColor,
  experimentLabelColor,
  primaryColor,
  primaryColorHover,
} from '../../../theme';
import CircularLoader from '../../general/Loader';

const useStyles = (theme) => ({
  root: {
    '& .primary-loader': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontWeight: '500',
      color: fontColor,
      fontSize: '1rem',
      height: '10rem',
    },
    '& .MuiFormControl-root': {
      width: '100%',
      marginBottom: theme.spacing(1),
    },
    '& .MuiOutlinedInput-root': {
      background: experimentInputColor,
    },
    '& .MuiFilledInput-root': {
      borderRadius: radius,
      background: experimentInputColor,
      border: '0.075rem solid transparent',
      '&.Mui-error': {
        borderColor: errorFieldBorder,
        boxShadow: '0 0 0 .15rem rgba(242, 69, 61, 0.2)',
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
    '& .MuiFormHelperText-contained': {
      marginLeft: 0,
    },
    '& .MuiFormHelperText-root': {
      color: errorFieldBorder,
      fontSize: '0.875rem',
      lineHeight: '100%',
    },
    '& .MuiAccordion-root': {
      background: bgLight,
      borderRadius: radius,
      padding: '1rem 1.25rem',
      margin: '1.25rem 0 !important',
      boxShadow: 'none',
      '&:before': {
        display: 'none',
      },
      '& .MuiAccordionSummary-content': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& p': {
          fontSize: '0.95rem',
          lineHeight: 'normal',
          display: 'flex',
          alignItems: 'center',
          margin: '0',
          color: experimentLabelColor,
          '& svg': {
            marginRight: theme.spacing(1),
          },
        },
        '& span': {
          fontSize: '0.95rem',
          lineHeight: 'normal',
          color: primaryColor,
          cursor: 'pointer',
        },
      },
      '& .MuiCollapse-container:not(.MuiCollapse-hidden) .MuiCollapse-wrapper': {
        paddingTop: '1.25rem !important',
      },
    },
    '& .configuration': {
      background: bgLight,
      borderRadius: radius,
      padding: '1.25rem',
      margin: '1.25rem 0',
      '& .configuration--head': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& p': {
          fontSize: '0.95rem',
          lineHeight: 'normal',
          display: 'flex',
          alignItems: 'center',
          margin: '0',
          color: experimentLabelColor,
          '& svg': {
            marginRight: theme.spacing(1),
          },
        },
        '& span': {
          fontSize: '0.95rem',
          lineHeight: 'normal',
          color: primaryColor,
          cursor: 'pointer',
        },
      },
      '& .configuration--body': {
        paddingTop: '1.25rem',
      },
    },
    '& .MuiButton-containedPrimary': {
      '&:hover': {
        background: primaryColorHover,
      },
    },
    '& .MuiButton-root': {
      padding: '0.375rem 1rem',
    },
    '& .MuiDialogActions-root': {
      padding: '1rem 1.5rem',
    },
    '& .MuiDialogTitle-root': {
      '& h2': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& svg': {
          cursor: 'pointer',
        },
      },
    },
    '& .custom-radio': {
      display: 'flex',
      '& label': {
        width: 'calc((100% - 1.125rem) / 2)',
        cursor: 'pointer',
        '& .MuiRadio-root': {
          display: 'none',
          '&.Mui-checked': {
            '&+ .wrap': {
              borderColor: primaryColor,
              background: 'rgba(235, 81, 122, 0.05);',
              '& p': {
                color: primaryColor,
              },
            },
          },
        },
        '&:not(:last-child)': {
          marginRight: '1.125rem',
        },
      },
      '& .wrap': {
        width: '100%',
        height: '8.75rem',
        borderRadius: '0.25rem',
        border: '.15rem solid transparent',
        background: bgLight,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        '& img': {
          marginBottom: theme.spacing(1.5),
        },
        '& p': {
          fontWeight: '500',
          fontSize: '0.95rem',
          lineHeight: 'normal',
          letterSpacing: '0.01rem',
          margin: '0',
          color: experimentLabelColor,
        },
      },
    },
  },
});

const LaunchDialog = (props) => {
  const [value, setValue] = useState(LAUNCH_MODAL.modelState);

  // TODO: @Muhaddatha retrieve runConfig from backend when component is mounted.
  const [runConfig, setRunConfig] = useState({
    asynchronous: true,
    cores: 1,
  });

  const [expandConfiguration, setExpandConfiguration] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { classes } = props;
  const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  const handleConfigurationUpdate = (e) => {
    e.stopPropagation();
    setLoading(true);
    ExperimentsApi.sendExperimentConfiguration(runConfig).then(() => {
      setLoading(false);
      setExpandConfiguration(false);
    }).catch((error) => {
      // handle error
    });
  };

  useEffect(() => {
    ExperimentsApi.getExperimentConfiguration().then((experimentConfiguration) => {
      setRunConfig(experimentConfiguration);
    }).catch(() => {
      // handle error
    });
  }, []);

  return (
    <ActionDialog
      buttonLabel={LAUNCH_MODAL.actionSimulate}
      title={LAUNCH_MODAL.actionSimulate}
      classes={classes}
      onAction={() => dispatch(simulateNetwork(value === LAUNCH_MODAL.experimentState))}
    >
      <DialogContentText>
        {LAUNCH_MODAL.title}
      </DialogContentText>

      <Box className="custom-radio">
        <Typography component="label">
          <Radio
            checked={value === LAUNCH_MODAL.modelState}
            onChange={(event) => setValue(event.target.value)}
            value={LAUNCH_MODAL.modelState}
            name="radio-button"
          />
          <Box className="wrap">
            <img src={value === LAUNCH_MODAL.modelState ? currentModal : currentModalUnselected} alt="currentModal" />
            <Typography>Current Model</Typography>
          </Box>
        </Typography>
        <Typography component="label">
          <Radio
            checked={value === LAUNCH_MODAL.experimentState}
            onChange={(event) => setValue(event.target.value)}
            value={LAUNCH_MODAL.experimentState}
            name="radio-button"
          />
          <Box className="wrap">
            <img src={value === LAUNCH_MODAL.experimentState ? experimentSelected : experimentUnselected} alt="completeExperiment" />
            <Typography>Complete Experiment</Typography>
          </Box>
        </Typography>
      </Box>

      <Accordion expanded={expandConfiguration}>
        <AccordionSummary
          aria-label="Expand"
          aria-controls="additional-actions-content"
          id="additional-actions-header"
        >
          <Typography>
            <InfoIcon />
            {`Run Configuration : ${LAUNCH_MODAL.defaultResource}`}
          </Typography>
          <Button onClick={expandConfiguration ? (e) => handleConfigurationUpdate(e) : () => setExpandConfiguration(true)}>
            {expandConfiguration ? 'Save' : 'Edit'}
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? (
            <Box className="primary-loader">
              <CircularLoader />
              Loading ...
            </Box>
          ) : (
            <>
              <FormControl variant="filled">
                <InputLabel id="select-filled-label">Resources</InputLabel>
                <Select
                  labelId="select-filled-label"
                  id="select-filled-filled"
                  value="machine"
                  IconComponent={ExpandMoreIcon}
                  onChange={(e) => setRunConfig({...runConfig, remote: e.target.value})}
                >
                  <MenuItem value="machine">{LAUNCH_MODAL.defaultResource}</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="filled">
                <InputLabel id="method">Method</InputLabel>
                <Select
                  labelId="method"
                  id="method"
                  value="method"
                  IconComponent={ExpandMoreIcon}
                  onChange={(e) => setRunConfig(({...runConfig, type: e.target.value}))}
                >
                  <MenuItem value="method">Bulletin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="filled"
                label="CPU Cores"
                type="number"
                inputProps={{ min: 1, max: 80, step: 1 }}
                value={runConfig.cores}
                onChange={(e) => setRunConfig({ ...runConfig, cores: parseInt(e.target.value) })}
                fullWidth
              />
              <Checkbox
                fullWidth
                checked={runConfig.asynchronous}
                onChange={() => setRunConfig({ ...runConfig, asynchronous: !runConfig.asynchronous })}
                noBackground
                label="In Background"
              />
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </ActionDialog>
  );
};

export default withStyles(useStyles)(LaunchDialog);