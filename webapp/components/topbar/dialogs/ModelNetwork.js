import React, { useState } from 'react';
import { ActionDialog } from 'netpyne/components';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem, withStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import currentModal from '../../../static/icons/modelSelected.png';
import currentModalUnselected from '../../../static/icons/modelUnselected.png';
import experimentSelected from '../../../static/icons/experimentSelected.png';
import experimentUnselected from '../../../static/icons/experimentUnselected.png';

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

const useStyles = (theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '100%',
      '& + .MuiFormControl-root': {
        marginTop: theme.spacing(1),
      },
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
        '& input': {
          display: 'none',
          '&:checked': {
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

const ModelNetworkDialog = (props) => {
  const [value, setValue] = useState('modal');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <ActionDialog
      buttonLabel="Instantiate"
      title="Instantiate"
      classes={props.classes}
    >
      <DialogContentText>
        What do you want to instantiate ?
      </DialogContentText>

      <Box className="custom-radio">
        <Typography component="label">
          <input
            type="radio"
            checked={value === 'modal'}
            onChange={handleChange}
            value="modal"
            name="radio-button-demo"
          />
          <Box className="wrap">
            <img src={value === 'modal' ? currentModal : currentModalUnselected} alt="currentModal" />
            <Typography>Current Model</Typography>
          </Box>
        </Typography>
        <Typography component="label">
          <input
            type="radio"
            checked={value === 'experiment'}
            onChange={handleChange}
            value="experiment"
            name="radio-button-demo"
          />
          <Box className="wrap">
            <img src={value === 'experiment' ? experimentSelected : experimentUnselected} alt="completeExperiment" />
            <Typography>Complete Experiment</Typography>
          </Box>
        </Typography>
      </Box>

      <Box className="configuration">
        <Box className="configuration--head">
          <Typography>
            <InfoIcon />
            Run Configuration : Local Machine
          </Typography>
          <Typography component="span">
            Edit
          </Typography>
        </Box>
        <Box className="configuration--body">
          <FormControl variant="filled">
            <InputLabel id="select-filled-label">Type</InputLabel>
            <Select
              labelId="select-filled-label"
              id="select-filled-filled"
              value="machine"
              // onChange={(e) => handleChange(e, parameter, index)}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value="machine">Local Machine</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="filled"
            label="Field X"
            fullWidth
          />
          <TextField
            variant="filled"
            label="Field Y"
            fullWidth
          />
        </Box>
      </Box>
    </ActionDialog>
  );
};

export default withStyles(useStyles)(ModelNetworkDialog);
