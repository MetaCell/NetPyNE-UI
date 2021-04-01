import React, { useEffect } from 'react';
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
      paddingLeft: theme.spacing(1),
      '& .MuiTypography-root': {
        marginLeft: theme.spacing(1),
      },
    },
    '& .editExperimentBreadcrumb': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& .MuiTypography-colorPrimary': {
        borderBottom: '#EB517A 1px solid',
        display: 'inline-flex',
        color: '#EB517A',
        '& .MuiSvgIcon-root': {
          fontSize: '1rem',
          marginTop: theme.spacing(0.4),
        },
      },
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
    },
    '& .MuiTypography-body2': {
      fontSize: '1rem',
    },
    '& .editExperimentDefault': {
      paddingLeft: theme.spacing(1),
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
      bottom: theme.spacing(4),
      right: theme.spacing(4),
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
  },
});

const EditExperiment = (props) => {
  const { classes, setList } = props;
  const experimentDetail = useSelector((state) => state.experiments.experimentDetail);
  console.log(experimentDetail);

  // Example payload for new experiment
  const newExperiment = {
    name: 'New Experiment',
    params: [{
      mapsTo: 'netParams.connParams.weight',
      type: 'list',
      values: [1, 2, 3, 4, 5],
      inGroup: true,
    }, {
      mapsTo: 'netParams.connParams.probability',
      type: 'range',
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

  const viewParameters = () => {
    getParameters.then((parameters) => {
      // netParams JSON dict
      console.log(parameters);
    });
  };

  useEffect(() => {
    // viewParameters();
  }, []);

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
              <Link to="true" color="primary">
                <AddIcon />
                Add parameter
              </Link>
            </Box>
            <Box mb={2} className="editExperimentGroup">
              <Box mb={2} className="editExperimentBreadcrumb">
                <Typography variant="body2">Groupped Parameters</Typography>
              </Box>
              <Box className="editExperimentRow">
                <Grid className="editExperimentList" container spacing={1}>
                  <Grid item xs className="editExperimentAutocomplete">
                    <Autocomplete
                      popupIcon={<ExpandMoreIcon />}
                      id="combo-box-demo"
                      options={top100Films}
                      getOptionLabel={(option) => option.title}
                      style={{ width: 300 }}
                      renderOption={(option) => (
                        <>
                          <ArrowRightIcon />
                          {option.title}
                        </>
                      )}
                      renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                    />
                  </Grid>
                  <Grid item xs={3} className="editExperimentSelect">
                    <FormControl variant="filled">
                      <InputLabel id="demo-simple-select-filled-label">Type</InputLabel>
                      <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={age}
                        onChange={handleChange}
                        IconComponent={ExpandMoreIcon}
                      >

                        <MenuItem value={20}>Range</MenuItem>
                        <MenuItem value={30}>List</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid container item xs={4} spacing={1} className="editExperimentField">
                    <Grid item xs={4}>
                      <TextField id="filled-basic" label="From" variant="filled" />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField id="filled-basic" label="To" variant="filled" />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField id="filled-basic" label="Range" variant="filled" />
                    </Grid>
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
                      <MenuItem onClick={handleClose}>Range</MenuItem>
                      <MenuItem onClick={handleClose}>List</MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
                <Grid className="editExperimentList" container spacing={1}>
                  <Grid item xs className="editExperimentAutocomplete">
                    <Autocomplete
                      popupIcon={<ExpandMoreIcon />}
                      id="combo-box-demo"
                      options={top100Films}
                      getOptionLabel={(option) => option.title}
                      style={{ width: 300 }}
                      renderOption={(option) => (
                        <>
                          <ArrowRightIcon />
                          {option.title}
                        </>
                      )}
                      renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                    />
                  </Grid>
                  <Grid item xs={3} className="editExperimentSelect">
                    <FormControl variant="filled">
                      <InputLabel id="demo-simple-select-filled-label">Type</InputLabel>
                      <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={age}
                        onChange={handleChange}
                        IconComponent={ExpandMoreIcon}
                      >

                        <MenuItem value={20}>Range</MenuItem>
                        <MenuItem value={30}>List</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid container item xs={4} spacing={1} className="editExperimentField">
                    <Grid item xs={12}>
                      <TextField id="filled-basic" label="Values (separated with comas)" variant="filled" />
                    </Grid>
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
                      <MenuItem onClick={handleClose}>Range</MenuItem>
                      <MenuItem onClick={handleClose}>List</MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box className="editExperimentRow">
              <Grid className="editExperimentList" container spacing={1}>
                <Grid item xs className="editExperimentAutocomplete">
                  <Autocomplete
                    popupIcon={<ExpandMoreIcon />}
                    id="combo-box-demo"
                    options={top100Films}
                    getOptionLabel={(option) => option.title}
                    style={{ width: 300 }}
                    renderOption={(option) => (
                      <>
                        <ArrowRightIcon />
                        {option.title}
                      </>
                    )}
                    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                  />
                </Grid>
                <Grid item xs={3} className="editExperimentSelect">
                  <FormControl variant="filled">
                    <InputLabel id="demo-simple-select-filled-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={age}
                      classes={{
                        root: classes.root,
                      }}
                      onChange={handleChange}
                      IconComponent={ExpandMoreIcon}
                    >
                      <MenuItem value={20}>Range</MenuItem>
                      <MenuItem value={30}>List</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} className="editExperimentField">
                  <TextField id="filled-basic" label="Values (separated with comas)" variant="filled" />
                </Grid>
                <Grid item xs="auto" className="editExperimentMenu">
                  <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    classes={{ paper: 'MuiPopover-experiment' }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleClose}>Range</MenuItem>
                    <MenuItem onClick={handleClose}>List</MenuItem>
                  </Menu>
                </Grid>
              </Grid>
              <Grid className="editExperimentList" container spacing={1}>
                <Grid item xs className="editExperimentAutocomplete">
                  <Autocomplete
                    id="combo-box-demo"
                    popupIcon={<ExpandMoreIcon />}
                    options={top100Films}
                    getOptionLabel={(option) => option.title}
                    style={{ width: 300 }}
                    renderOption={(option) => (
                      <>
                        <ArrowRightIcon />
                        {option.title}
                      </>
                    )}
                    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                  />
                </Grid>
                <Grid item xs={3} className="editExperimentSelect">
                  <FormControl variant="filled">
                    <InputLabel id="demo-simple-select-filled-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={age}
                      onChange={handleChange}
                      IconComponent={ExpandMoreIcon}
                    >

                      <MenuItem value={20}>Range</MenuItem>
                      <MenuItem value={30}>List</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} className="editExperimentField">
                  <TextField id="filled-basic" label="Values (separated with comas)" variant="filled" />
                </Grid>
                <Grid item xs="auto" className="editExperimentMenu">
                  <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    classes={{ paper: 'MuiPopover-experiment' }}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleClose}>Range</MenuItem>
                    <MenuItem onClick={handleClose}>List</MenuItem>
                  </Menu>
                </Grid>
              </Grid>
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
        <Box className="editExperimentFooter" display="flex">
          <Button color="secondary" onClick={() => setList(true)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={create}>
            Create
          </Button>
        </Box>
      </Box>
    </GridLayout>
  );
};

export default withStyles(useStyles)(EditExperiment);
