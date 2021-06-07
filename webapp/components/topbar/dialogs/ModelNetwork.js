import React from 'react';
import { List, ListItem, withStyles } from '@material-ui/core';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { ActionDialog } from 'netpyne/components';
import Utils from '../../../Utils';
import Checkbox from '../../general/Checkbox';

import { NETPYNE_COMMANDS } from '../../../constants';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import AdjustIcon from '@material-ui/icons/Adjust';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { bgLight } from '../../../theme';

const saveOptions = [
  {
    label: 'High-level Network Parameters (netParams)',
    label2: 'Cell rules, connectivity rules, etc',
    state: 'loadNetParams',
  },
  {
    label: 'Simulation Configuration (simConfig)',
    label2: 'duration, recorded variables, etc',
    state: 'loadSimCfg',
  },
  {
    label: 'Instantiated Network',
    label2: 'All cells, connections, etc',
    state: 'loadNet',
  },
  {
    label: 'Simulation Data',
    label2: 'Spikes, traces, etc',
    state: 'loadSimData',
  },
];

const useStyles = (theme) => ({
  root: {
    '& .configuration': {
      background: '#4A4A4A',
      borderRadius: '4px',
      padding: '20px',
      margin: '20px 0',
      '& .configuration--head': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& p': {
          fontSize: '0.9523809523809523rem',
          lineHeight: 'normal',
          display: 'flex',
          alignItems: 'center',
          margin: '0',
          color: '#989898',
          '& svg': {
            marginRight: '8px',
          },
        },
        '& span': {
          fontSize: '0.9523809523809523rem',
          lineHeight: 'normal',
          color: '#EB517A',
          cursor: 'pointer',
        },
      },
      '& .configuration--body': {
        paddingTop: '20px',
      },
    },
    '& .MuiButton-containedPrimary': {
      '&:hover': {
        background: '#d54067',
      },
    },
    '& .MuiButton-root': {
      padding: '6px 16px',
    },
    '& .MuiDialogActions-root': {
      padding: '16px 24px',
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
        cursor: 'pointer',
        '& input': {
          display: 'none',
          '&:checked': {
            '&+ .wrap': {
              borderColor: '#EB517A',
              background: 'rgba(235, 81, 122, 0.05);',
              '& p': {
                color: '#EB517A',
              },
              '& svg': {
                color: '#EB517A',
              },
            },
          },
        },
        '&:not(:last-child)': {
          marginRight: '18px',
        },
      },
      '& .wrap': {
        width: '250px',
        height: '140px',
        borderRadius: '0.25rem',
        border: '2px solid transparent',
        background: bgLight,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        '& svg': {
          color: '#989898',
          marginBottom: theme.spacing(1),
        },
        '& p': {
          fontWeight: '500',
          fontSize: '0.9523809523809523rem',
          lineHeight: 'normal',
          letterSpacing: ' 0.16px',
          margin: '0',
          color: '#989898',
        },
      },
    },
  },
});

const ModelNetworkDialog = (props) => (
  <ActionDialog
    // command={NETPYNE_COMMANDS.exportModel}
    // message={GEPPETTO.Resources.EXPORTING_MODEL}
    buttonLabel="Instantiate"
    title="Instantiate"
    classes={props.classes}
    // args={this.state}
    // {...props}
  >
    <DialogContentText>
      What do you want to instantiate ?
    </DialogContentText>

    <Box className="custom-radio">
      <Typography component="label">
        <input type="radio" name="radio-input" />
        <Box className="wrap">
          <AdjustIcon />
          <Typography>Current Model</Typography>
        </Box>
      </Typography>
      <Typography component="label">
        <input type="radio" name="radio-input" />
        <Box className="wrap">
          <AdjustIcon />
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
          <InputLabel id={`select-filled-label`}>Type</InputLabel>
          <Select
            labelId={`select-filled-label`}
            id={`select-filled-filled`}
            value={'machine'}
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

export default withStyles(useStyles)(ModelNetworkDialog);
