import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Box,
  Tabs,
  Tab,
} from '@material-ui/core';
import { RxdBlurOn, RxdBlur } from '../icons';
import RxdRegions from './RxdRegions';
import RxdSpecies from './RxdSpecies';
import RxdStates from './RxdStates';
import RxdParameters from './RxdParameters';
import RxdReactions from './RxdReactions';
import RxdMulticompartmentReactions from './RxdMulticompartmentReactions';
import RxdRates from './RxdRates';
import RxdExtracellular from './RxdExtracellular';
import { primaryColor, navShadow, tabsTextColor } from '../../theme';
import Utils from '../../Utils';

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

const styles = ((theme) => ({
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
        width: '11rem',
        minWidth: '11rem',
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
      alignItems: 'stretch',
      padding: '0.375rem 0.375rem 0',
      width: '100%',
      margin: '1px',

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

class Rxd extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 0,
      regions: [],
      species: [],
      states: [],
      parameters: [],
    };

    this.onAddState = this.onAddState.bind(this);
    this.onAddRegion = this.onAddRegion.bind(this);
    this.onAddSpecie = this.onAddSpecie.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event, newValue) {
    this.setState({ value: newValue });
  }

  onAddRegion (regionId) {
    Utils.evalPythonMessage(
      'netpyne_geppetto.netParams.rxdParams.regions',
    ).then((response) => {
      this.setState({ regions: Object.keys(response) });
    });
  }

  onAddSpecie (speciesId) {
    Utils.evalPythonMessage(
      'netpyne_geppetto.netParams.rxdParams.species',
    ).then((response) => {
      this.setState({ species: Object.keys(response) });
    });
  }

  onAddState (stateId) {
    Utils.evalPythonMessage(
      'netpyne_geppetto.netParams.rxdParams.states',
    ).then((response) => {
      this.setState({ states: Object.keys(response) });
    });
  }

  onAddParameter (parameterId) {
    Utils.evalPythonMessage(
      'netpyne_geppetto.netParams.rxdParams.parameters',
    ).then((response) => {
      this.setState({ parameters: Object.keys(response) });
    });
  }

  render () {
    const { classes, controlledState } = this.props;
    const { value } = this.state;
    let tabPanelContent = <div className="layoutVerticalFitInner" />;
    const disableAdd = this.state.regions.length === 0 || this.state.species.length === 0;

    if (value === 0) {
      tabPanelContent = (
        <RxdRegions
          onAddRegion={this.onAddRegion}
          regions={controlledState?.checked?.regions}
        />
      );
    } else if (value === 1) {
      tabPanelContent = (
        <RxdSpecies
          onAddSpecie={this.onAddSpecie}
          species={controlledState?.checked?.species}
        />
      );
    } else if (value === 2) {
      tabPanelContent = (
        <RxdStates
          onAddState={this.onAddState}
          states={controlledState?.checked?.states}
        />
      );
    } else if (value === 3) {
      tabPanelContent = (
        <RxdParameters
          onAddParameter={this.onAddParameter}
          parameters={controlledState?.checked?.parameters}
        />
      );
    } else if (value === 4) {
      tabPanelContent = (
        <RxdReactions
          disableAdd={disableAdd}
          reactions={controlledState?.checked?.reactions}
        />
      );
    } else if (value === 5) {
      tabPanelContent = (
        <RxdMulticompartmentReactions
          disableAdd={disableAdd}
          multicompartmentReactions={controlledState?.checked?.multicompartmentReactions}
        />
      );
    } else if (value === 6) {
      tabPanelContent = (
        <RxdRates
          disableAdd={disableAdd}
          rates={controlledState?.checked?.rates}
          species={this.state.species}
          regions={controlledState?.checked?.regions}
        />
      );
    } else if (value === 7) {
      tabPanelContent = (
        <RxdExtracellular
          disableAdd={disableAdd}
          extracellular={controlledState?.checked?.extracellular}
        />
      );
    }

    return (
      <Box className={classes.root}>
        <Tabs
          value={value}
          variant="scrollable"
          scrollButtons="auto"
          onChange={this.handleChange}
          className={classes.tabs}
          aria-label="simple tabs example"
        >
          { CONFIG_SECTIONS.map((section, index) => (
            <Tab key={section} icon={value === index ? <RxdBlurOn /> : <RxdBlur />} label={section} {...a11yProps(index)} />
          ))}
        </Tabs>

        { CONFIG_SECTIONS.map((section, index) => (
          <TabPanel value={value} index={index} key={`section${index}`} className={classes.tabPanel}>
            {tabPanelContent}
          </TabPanel>
        ))}
      </Box>
    );
  }
}

export default withStyles(styles)(Rxd);
