import React from 'react';
import FontIcon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@material-ui/core';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  ListComponent,
  GridLayout,
} from 'netpyne/components';
import AddIcon from '@material-ui/icons/Add';
import { NoData, RxdBlurOn, RxdBlur } from '../Icons';
import { primaryColor, navShadow, tabsTextColor } from '../../theme';

function TabPanel (props) {
  const {
    children,
    value,
    index,
    ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>{children}</>
      )}
    </div>
  );
}

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: `calc(100% - 3.5rem - ${theme.spacing(1)}px)`,
    margin: `-${theme.spacing(1)}px`,
    flexDirection: 'column',
    width: 'calc(100% + 1rem) !important',
  },

  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: primaryColor,
      height: '0.0625rem',
    },
    '& .MuiTabs-flexContainer': {
      borderBottom: `0.0625rem solid ${navShadow}`,
      '& .MuiButtonBase-root': {
        width: '10rem',
        height: '5.3125rem',
        color: tabsTextColor,
        textTransform: 'uppercase',
        lineHeight: '1.428125rem',
        '&.Mui-selected': {
          color: primaryColor,
        },
      },
    },
  },

  button: {
    textTransform: 'uppercase',
    padding: '.5rem 1rem',
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.5),
    },
  },

  subHeader: {
    borderBottom: `0.0625rem solid ${navShadow}`,
    color: primaryColor,
    '& .MuiChip-root': {
      height: '100%',
      padding: '0 1rem',
      marginBottom: '-0.125rem',
      fontSize: '1rem',
      textTransform: 'uppercase',
      position: 'relative',
      borderBottom: `0.0625rem solid ${primaryColor}`,
      '&:hover': {
        background: 'transparent',
      },
      '&:focus': {
        background: 'transparent',
      },
    },
    '& .MuiChip-deleteIcon': {
      margin: 0,
      width: '1rem',
      height: '1rem',
      fontSize: '1rem',
      color: primaryColor,
    },
  },

  layout: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '0.375rem 0.375rem 0',

    '& .MuiCard-root': {
      backgroundColor: 'transparent !important',

      '& .MuiCardContent-root': {
        paddingLeft: '0.375rem',
        paddingRight: '0.375rem',
        paddingTop: '0.375rem',
      },
    },
  },

  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 'calc(100% - 5.3125rem)',

    '& > svg': {
      marginBottom: theme.spacing(2),
      width: '8rem',
      height: '8rem',
    },

    '& p': {
      marginBottom: theme.spacing(2),
      fontSize: '1.2rem',
    },
  },
}));

const CONFIG_SECTIONS = ['Regions', 'Species', 'States', 'Parameters', 'Reactions', 'Multicompartment reactions', 'Rates', 'Extracellular'];

const Rxd = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let contentLeft = <div className="layoutVerticalFitInner" />;
  let contentRight = <div className="layoutVerticalFitInner" />;

  if (value === 0) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.duration">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.duration"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.hParams" className="listStyle">
          <ListComponent model="simConfig.hParams" />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
  } else if (value === 1) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>
      </div>
    );
  } else if (value === 2) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>
      </div>
    );
  } else if (value === 3) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>
      </div>
    );
  } else if (value === 4) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
  } else if (value === 5) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>

        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
  } else if (value === 6) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="simConfig.simLabel">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="simConfig.simLabel"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>
      </div>
    );
  } else if (value === 7) {
    contentLeft = (
      <div className="scrollbar scrollchild">
        <NetPyNEField id="netParams.shape">
          <SelectField variant="filled" model="netParams.shape" />
        </NetPyNEField>

        <NetPyNEField id="netParams.scale">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.scale"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.defaultWeight">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.defaultWeight"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.defaultDelay">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.defaultDelay"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.scaleConnWeight">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.scaleConnWeight"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.scaleConnWeightNetStims">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.scaleConnWeightNetStims"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.scaleConnWeightNetStims">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.scaleConnWeightNetStims"
          />
        </NetPyNEField>
      </div>
    );
    contentRight = (
      <div className="scrollbar scrollchild">
        <NetPyNEField
          id="netParams.scaleConnWeightModels"
          className="listStyle"
        >
          <ListComponent model="netParams.scaleConnWeightModels" />
        </NetPyNEField>

        <NetPyNEField id="netParams.sizeX">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.sizeX"
          />
        </NetPyNEField>

        <NetPyNEField id="netParams.sizeY">
          <NetPyNETextField
            fullWidth
            variant="filled"
            model="netParams.sizeY"
          />
        </NetPyNEField>
      </div>
    );
  }

  return (
    <Box className={classes.root}>
      <Tabs
        value={value}
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        className={classes.tabs}
        aria-label="simple tabs example"
      >
        { CONFIG_SECTIONS.map((section, index) => <Tab key={section} icon={value === index ? <RxdBlurOn /> : <RxdBlur />} label={section} {...a11yProps(index)} />)}
      </Tabs>

      <Box className={classes.subHeader}>
        <Chip
          label="Region 0"
          deleteIcon={<FontIcon className="fa fa-minus-circle" />}
          onClick={() => null}
          onDelete={() => null}
        />
        <Button className={classes.button}>
          <AddIcon />
          Add a region
        </Button>
      </Box>

      { CONFIG_SECTIONS.map((section, index) => {
        return (
          <TabPanel value={value} index={index} key={`section${index}`}>
            <GridLayout className={classes.layout}>
              <div />
              {contentLeft}
              {contentRight}
            </GridLayout>
          </TabPanel>
        )
      })}
      {/* NO DATA */}
      {/* <Box className={classes.noData}>
        <NoData />
        <Typography>There are no Region yet.</Typography>
        <Button className={classes.button} variant="outlined">
          <AddIcon />
          Add new region
        </Button>
      </Box> */}
    </Box>
  );
};

export default Rxd;
