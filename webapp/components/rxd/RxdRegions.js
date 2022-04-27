import React, { useEffect } from 'react';
import FontIcon from '@material-ui/core/Icon';
import {
  Box,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RxdRegion from './RxdRegion'
import RxdNoData from './RxdNoData';

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

const RxdRegions = (props) => {
  const [tab, setTab] = React.useState(0);
  const regions = props.regions ;
  return (
    <>
      <Box className="subHeader">
        <Tabs
          value={tab}
          vairant="scrollable"
          onChange={(event, newTabValue) => setTab(newTabValue)}
          scrollButtons="auto"
          indicatorColor="primary"
        >
          {
              regions.map((region, index) => (
                <Tab
                  key={region}
                  label={(
                    <Chip
                      label={region}
                      deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                      onClick={() => { 
                        //no point as there's only 1 
                      }}
                      onDelete={() => { 
                        //no point as there's only 1
                      }}
                    />
                  )}
                  {...a11yProps(index)}
                />
              ))
            }
        </Tabs>
      </Box>
      <>
        <RxdRegion id={props.regions[props.activeRegionIndex]} onAddRegion={props.onAddRegion}></RxdRegion>
      </>
    </>
  );
};
export default RxdRegions;
