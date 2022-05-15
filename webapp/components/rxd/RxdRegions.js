import React, { useState, useEffect } from 'react';
import FontIcon from '@material-ui/core/Icon';
import {
  Box,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RxdRegion from './RxdRegion';
import Utils from '../../Utils';

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RxdRegions = (props) => {
  const [tab, setTab] = React.useState(0);
  const [regionCounter, setRegionCounter] = useState(0);

  const addSingleRegion = () => {
    const newCounter = regionCounter + 1;
    const newRegion = `region${regionCounter}`;
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['regions']['${newRegion}'] = {}`,
    );
    setRegionCounter(newCounter);
    props.onAddRegion(newRegion);
  };

  let regions = [];
  if (props.regions) {
    regions = Object.keys(props.regions);
  }
  return (
    <>
      { regions.length > 0
        ? (
          <Box className="subHeader">
            <Tabs
              value={tab}
              variant="scrollable"
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
                    id={region}
                    label={region}
                    deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                    onClick={(event) => {
                      const clickedRegion = event.currentTarget.parentElement.id;
                      const regionIndex = regions.indexOf(clickedRegion);
                      if (tab !== regionIndex) {
                        setTab(regionIndex);
                      }
                    }}
                    onDelete={(event) => {
                      Utils.execPythonMessage(
                        `del netpyne_geppetto.netParams.rxdParams['regions']['${event.currentTarget.parentElement.id}']`,
                      );
                      const newRegions = Object.keys(props.regions).filter((item) => item !== event.currentTarget.parentElement.id);
                      if (newRegions.length > 0) {
                        setTab(newRegions.length - 1);
                      } else {
                        props.onAddRegion(event.currentTarget.parentElement.id);
                      }
                    }}
                  />
                )}
                {...a11yProps(index)}
              />
            ))
          }
            </Tabs>
            <Button className="button">
              <AddIcon onClick={addSingleRegion}>Add a new region</AddIcon>
            </Button>
          </Box>
        )
        : <> </>}

      <>
        <RxdRegion
          addSingleRegion={addSingleRegion}
          id={props?.regions ? regions[tab] : undefined}
          onAddRegion={props.onAddRegion}
          controlledRegion={props?.regions ? props.regions[regions[tab]] : undefined}
        />
      </>
    </>
  );
};
export default RxdRegions;
