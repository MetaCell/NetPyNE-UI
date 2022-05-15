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
import RxdState from './RxdState';
import Utils from '../../Utils';

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RxdStates = (props) => {
  const [tab, setTab] = React.useState(0);
  const [statesCounter, setStatesCounter] = useState(0);

  const addSingleState = () => {
    const newCounter = statesCounter + 1;
    const newState = `state${statesCounter}`;
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['states']['${newState}'] = {}`,
    );
    setStatesCounter(newCounter);
    props.onAddState(newState);
  };

  let states = [];
  if (props.states) {
    states = Object.keys(props.states);
  }
  return (
    <>
      { states.length > 0
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
            states.map((region, index) => (
              <Tab
                key={region}
                label={(
                  <Chip
                    id={region}
                    label={region}
                    deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                    onClick={(event) => {
                      const clickedRegion = event.currentTarget.parentElement.id;
                      const regionIndex = states.indexOf(clickedRegion);
                      if (tab !== regionIndex) {
                        setTab(regionIndex);
                      }
                    }}
                    onDelete={(event) => {
                      Utils.execPythonMessage(
                        `del netpyne_geppetto.netParams.rxdParams['states']['${event.currentTarget.parentElement.id}']`,
                      );
                      const newRegions = Object.keys(props.states).filter((item) => item !== event.currentTarget.parentElement.id);
                      if (newRegions.length > 0) {
                        setTab(newRegions.length - 1);
                      } else {
                        props.onAddState(event.currentTarget.parentElement.id);
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
              <AddIcon onClick={addSingleState}>Add a new region</AddIcon>
            </Button>
          </Box>
        )
        : <> </>}

      <>
        <RxdState
          addSingleState={addSingleState}
          id={props?.states ? states[tab] : undefined}
          onAddRegion={props.onAddStates}
          controlledRegion={props?.states ? props.states[states[tab]] : undefined}
        />
      </>
    </>
  );
};
export default RxdStates;
