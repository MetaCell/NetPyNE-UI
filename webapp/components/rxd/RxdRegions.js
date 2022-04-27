import React from 'react';
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
  const [regionNames, setRegionNames] = React.useState([]);
  const regions = props.regions ; 
  const [activeRegion , setActiveRegion] = React.useState(null);

  const addRegionName = (name) => {
    setRegionNames([...regionNames, name]);
  }

  const addRegion = () => {
    const newRegion = <RxdRegion onAddRegionName={addRegionName} key={Math.random()} ></RxdRegion> ;
    props.setRegions([...regions, newRegion]);
    setActiveRegion(newRegion);
  }

  const deleteRegion = (index) => {
    regionNames.splice(index);
    regions.splice(index);
    props.setRegions(regions);
    setRegionNames(regionNames);
  }

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
                      key={regionNames[index]}
                      label={(
                        <Chip
                          label={regionNames[index]}
                          deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                          onClick={() => { setActiveRegion(regions[index])} }
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
          <>{activeRegion}</>
        </>
      )
        : <RxdNoData message="There are no Regions yet." callbackText="Add new region" callback={ ()=> { addRegion(); }} />
      }
      </>
    );
};
export default RxdRegions;
