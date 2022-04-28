import React, { useEffect } from 'react';
import FontIcon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { NoData, RxdBlurOn, RxdBlur } from '../icons';
import RxdRegions from './RxdRegions';
import RxdSpecies from './RxdSpecies';
import RxdStates from './RxdStates';
import RxdParameters from './RxdParameters';
import RxdReactions from './RxdReactions';
import RxdMulticompartmentReactions from './RxdMulticompartmentReactions';
import RxdRates from './RxdRates';
import RxdExtracellular from './RxdExtracellular';
import { primaryColor, navShadow, tabsTextColor } from '../../theme';
import Utils from '../../Utils' 

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

  tabPanel: {
    '& .gridLayout': {
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
    '& .subHeader': {
      borderBottom: `0.0625rem solid ${navShadow}`,
      color: primaryColor,
      display: 'flex',
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
    '& .button': {
      textTransform: 'uppercase',
      padding: '.5rem 1rem',
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(0.5),
      },
    },
    '& .MuiTab-wrapper': {
      height: '100%',
    },
  },
}));

const CONFIG_SECTIONS = ['Regions', 'Species', 'States', 'Parameters', 'Reactions', 'Multicompartment reactions', 'Rates', 'Extracellular'];

const Rxd = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [regions, setRegions] = React.useState([]);
  const [species, setSpecies] = React.useState([]);
  const [useEffectSentinel, setUseEffectSentinel] = React.useState('initial');

  useEffect(()=>{
    refreshState();
  }, [useEffectSentinel])

  const refreshState = () => {
    Utils.evalPythonMessage(
      `netpyne_geppetto.netParams.rxdParams.regions`,
    ).then((response) => { 
      setRegions(Object.keys(response));
    });
    Utils.evalPythonMessage(
      `netpyne_geppetto.netParams.rxdParams.species`,
    ).then((response) => { 
      setSpecies(Object.keys(response));
    });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onAddRegion = (regionId) => {
    refreshState();
  }

  const onAddSpecie = (regionId) => {
    refreshState();
  }

  let tabPanelContent = <div className="layoutVerticalFitInner" />;
  // let subHeader = <div className="layoutVerticalFitInner" />;
  const disableAdd = regions.length === 0 || species.length === 0;
  
  if (value === 0) {
    tabPanelContent = (<RxdRegions regions={regions} activeRegionIndex={0} onAddRegion={onAddRegion} />);
  } else if (value === 1) {
    tabPanelContent = (<RxdSpecies species={species} activeSpecieIndex={0} onAddSpecie={onAddSpecie} />);
  } else if (value === 2) {
    tabPanelContent = (<RxdStates disableAdd={disableAdd} regions={regions} />);
  } else if (value === 3) {
    tabPanelContent = (<RxdParameters disableAdd={disableAdd} />);
  } else if (value === 4) {
    tabPanelContent = (<RxdReactions disableAdd={disableAdd} />);
  } else if (value === 5) {
    tabPanelContent = (<RxdMulticompartmentReactions disableAdd={disableAdd} />);
  } else if (value === 6) {
    tabPanelContent = (<RxdRates disableAdd={disableAdd} species={species} regions={regions}/>);
  } else if (value === 7) {
    tabPanelContent = (<RxdExtracellular disableAdd={disableAdd} />);
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

      { CONFIG_SECTIONS.map((section, index) => (
        <TabPanel value={value} index={index} key={`section${index}`} className={classes.tabPanel}>
          {tabPanelContent}
        </TabPanel>
      ))}
    </Box>
  );
};

export default Rxd;
