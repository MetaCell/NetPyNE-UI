import React from 'react';
import FontIcon from '@material-ui/core/Icon';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Typography,
  Chip,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  ListComponent,
  GridLayout,
} from 'netpyne/components';
import AddIcon from '@material-ui/icons/Add';
import { NoData, RxdBlurOn, RxdBlur } from '../icons';
import { primaryColor, navShadow } from '../../theme';

const CONFIG_SECTIONS = {
  Regions: 'Regions',
  Species: 'Species',
  States: 'States',
  Parameters: 'Parameters',
  Reactions: 'Reactions',
  Multicompartment: 'Multicompartment reactions',
  Rates: 'Rates',
  Extracellular: 'Extracellular',
};

class Rxd extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      sectionId: CONFIG_SECTIONS.Regions,
    };
  }

  select = (index, sectionId) => this.setState({
    selectedIndex: index,
    sectionId,
  });

  render () {
    let contentLeft = <div className="layoutVerticalFitInner" />;
    let contentRight = <div className="layoutVerticalFitInner" />;
    const { classes } = this.props;
    if (this.state.sectionId === CONFIG_SECTIONS.Regions) {
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
    } else if (this.state.sectionId === CONFIG_SECTIONS.Species) {
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
    } else if (this.state.sectionId === CONFIG_SECTIONS.States) {
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
    } else if (this.state.sectionId === CONFIG_SECTIONS.Parameters) {
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
    } else if (this.state.sectionId === CONFIG_SECTIONS.Reactions) {
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
    } else if (this.state.sectionId === CONFIG_SECTIONS.Multicompartment) {
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
    } else if (this.state.sectionId === CONFIG_SECTIONS.Rates) {
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
    } else if (this.state.sectionId === CONFIG_SECTIONS.Extracellular) {
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
      <div className={classes.root}>
        <BottomNavigation
          showLabels
          className={`${classes.bottomNav} scrollbar`}
          value={this.state.selectedIndex}
        >
          <BottomNavigationAction
            id="configGeneral"
            key={CONFIG_SECTIONS.Regions}
            label={CONFIG_SECTIONS.Regions}
            icon={this.state.sectionId === CONFIG_SECTIONS.Regions ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(0, 'Regions')}
          />
          <BottomNavigationAction
            id="configRecord"
            key={CONFIG_SECTIONS.Species}
            label={CONFIG_SECTIONS.Species}
            icon={this.state.sectionId === CONFIG_SECTIONS.Species ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(1, 'Species')}
          />
          <BottomNavigationAction
            id="configRecord"
            key={CONFIG_SECTIONS.States}
            label={CONFIG_SECTIONS.States}
            icon={this.state.sectionId === CONFIG_SECTIONS.States ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(2, 'States')}
          />
          <BottomNavigationAction
            id="configSaveConfiguration"
            key={CONFIG_SECTIONS.Parameters}
            label={CONFIG_SECTIONS.Parameters}
            icon={this.state.sectionId === CONFIG_SECTIONS.Parameters ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(3, 'Parameters')}
          />
          <BottomNavigationAction
            id="confignetParams"
            key={CONFIG_SECTIONS.Reactions}
            label={CONFIG_SECTIONS.Reactions}
            icon={this.state.sectionId === CONFIG_SECTIONS.Reactions ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(4, 'Reactions')}
          />
          <BottomNavigationAction
            id="confignetParams"
            key={CONFIG_SECTIONS.Multicompartment}
            label={CONFIG_SECTIONS.Multicompartment}
            icon={this.state.sectionId === CONFIG_SECTIONS.Multicompartment ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(5, 'Multicompartment reactions')}
          />
          <BottomNavigationAction
            id="confignetParams"
            key={CONFIG_SECTIONS.Rates}
            label={CONFIG_SECTIONS.Rates}
            icon={this.state.sectionId === CONFIG_SECTIONS.Rates ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(6, 'Rates')}
          />
          <BottomNavigationAction
            id="confignetParams"
            key={CONFIG_SECTIONS.Extracellular}
            label={CONFIG_SECTIONS.Extracellular}
            icon={this.state.sectionId === CONFIG_SECTIONS.Extracellular ? <RxdBlurOn /> :  <RxdBlur />}
            onClick={() => this.select(7, 'Extracellular')}
          />
        </BottomNavigation>

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

        <GridLayout className={classes.layout}>
          <div />
          {contentLeft}
          {contentRight}
        </GridLayout>

        {/* NO DATA */}
        {/* <Box className={classes.noData}>
          <NoData
          <Typography>There are no Region yet.</Typography>
          <Button className={classes.button} variant="outlined">
            <AddIcon />
            Add new region
          </Button>
        </Box> */}
      </div>
    );
  }
}

const styles = ({
  spacing,
}) => ({
  root: {
    height: `calc(100% - 3.5rem - ${spacing(1)}px)`,
    flexDirection: 'column',
  },
  bottomNav: {
    margin: 0,
    justifyContent: 'flex-start',
    overflow: 'auto',
    height: '5.3125rem',
    flexShrink: 0,
    position: 'relative',
    '&:before': {
      content: '""',
      width: '100%',
      height: '0.0625rem',
      background: navShadow,
      position: 'absolute',
      bottom: '0',
      zIndex: '8',
    },

    '& .MuiBottomNavigationAction-root': {
      position: 'relative',
      '&:before': {
        content: '""',
        width: '100%',
        height: '0.0625rem',
        background: primaryColor,
        position: 'absolute',
        bottom: '0',
        zIndex: '9',
      },

      '&:not(.Mui-selected)': {
        '&:before': {
          opacity: 0,
        },
      },
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
  scrollContainer: {
    maxHeight: `calc(100vh - ${spacing(27)}px)`,
    overflowY: 'auto',
  },
  option: { color: 'white' },
  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',

    '& img': {
      marginBottom: spacing(2),
    },

    '& p': {
      marginBottom: spacing(2),
      fontSize: '1.2rem',
    },
  },
  button: {
    textTransform: 'uppercase',
    padding: '.5rem 1rem',
    '& .MuiSvgIcon-root': {
      marginRight: spacing(0.5),
    },
  },
  subHeader: {
    borderBottom: `0.0625rem solid ${navShadow}`,
    color: primaryColor,
    '& .MuiChip-root': {
      height: '100%',
      padding: '0 1rem',
      fontSize: '1rem',
      textTransform: 'uppercase',
      position: 'relative',
      '&:before': {
        content: '""',
        height: '0.0625rem',
        width: '100%',
        background: primaryColor,
        position: 'absolute',
        bottom: '-0.0625rem',
      },
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
});

export default withStyles(styles)(Rxd);
