import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Popover,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Link,
  Box,
  Grid,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  fontColor,
  primaryColor,
  radius,
  experimentInputColor,
  experimentLabelColor,
  errorFieldBorder,
} from '../../theme';

const useStyles = () => ({
  root: {
    '&.MuiPopover-filter': {
      '& .popoverFormControl': {
        width: '26.25rem',
        padding: '1rem',
        '& .MuiLink-root': {
          color: primaryColor,
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '1rem',
          cursor: 'pointer',
          borderBottom: `1px solid ${primaryColor}`,
          '&:hover': {
            textDecoration: 'none',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.1rem',
            marginRight: '0.15rem',
            marginLeft: '-0.15rem',
          },
        },
        '& .MuiOutlinedInput-root': {
          background: experimentInputColor,
        },
        '& .MuiFormControl-fullWidth': {
          marginBottom: '0.5rem',
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
      },
    },
  },
});

const ExperimentRowFilter = (props) => {
  const {
    filter,
    paramHeaders,
    setParameterValue,
    filterParameterChange,
    anchorEl,
    setAnchorEl,
    classes,
    addFilterRow
  } = props;

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const popoverhandleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Popover
      id={id}
      open={open}
      className={`${classes.root} MuiPopover-filter`}
      anchorEl={anchorEl}
      onClose={popoverhandleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box className="popoverFormControl">
        {filter.map((paramFilter, index) => (
          <Grid container spacing={2} key={`filter${index}`}>
            <Grid item xs={6}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="demo-simple-select-label">Parameter</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={paramFilter.param}
                  onChange={(e) => filterParameterChange(e.target.value, index)}
                >
                  {
                    paramHeaders.map((header, menuIndex) => (
                      <MenuItem key={`paramfilter${menuIndex}`} value={header.label}>{header.label}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="filled" fullWidth>
                <TextField
                  label="Parameter Value"
                  variant="filled"
                  value={paramFilter?.value}
                  onChange={(e) => setParameterValue(e.target.value, index)}
                />
              </FormControl>
            </Grid>
          </Grid>
        ))}
        <Box my={0.6}>
          <Link to="true" color="primary" onClick={addFilterRow}>
            <AddIcon />
            Add Filter
          </Link>
        </Box>
      </Box>
    </Popover>
  );
};

export default withStyles(useStyles)(ExperimentRowFilter);
