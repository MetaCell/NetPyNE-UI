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
      {
    regions.length !== 0 ? (
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
                        onClick={() => { setActiveRegion(region)} }
                        onDelete={() => { deleteRegion(index) }}
                      />
                    )}
                    {...a11yProps(index)}
                  />
                ))
              }
          </Tabs>
          <Button className="button">
            <AddIcon onClick={ () => { addRegion() } }>Add a region</AddIcon>
            
          </Button>
        </Box>
        <><RxdRegion id={props.regions[props.activeRegionIndex]}></RxdRegion></>
      </>
    )
      : <RxdNoData message="There are no Regions yet." callbackText="Add new region" callback={ ()=> { addRegion(); }} />
    }
    </>
  );
};
export default RxdRegions;
