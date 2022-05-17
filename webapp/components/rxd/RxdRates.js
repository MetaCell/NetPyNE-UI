import React, { useState } from 'react';
import FontIcon from '@material-ui/core/Icon';
import {
  Box,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Utils from '../../Utils';
import RxdRate from './RxdRate';

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RxdRates = (props) => {
  const [tab, setTab] = React.useState(0);
  const [rateCounter, setRateCounter] = useState(0);

  const addSingleRate = () => {
    const newCounter = rateCounter + 1;
    const newRate = `rate${rateCounter}`;
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['rates']['${newRate}'] = {}`,
    );
    setRateCounter(newCounter);
    props.onAddRate(newRate);
  };

  let rates = [];
  if (props.rates) {
    rates = Object.keys(props.rates);
  }
  return (
    <>
      { rates.length > 0
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
            rates.map((region, index) => (
              <Tab
                key={region}
                label={(
                  <Chip
                    id={region}
                    label={region}
                    deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                    onClick={(event) => {
                      const clickedRegion = event.currentTarget.parentElement.id;
                      const regionIndex = rates.indexOf(clickedRegion);
                      if (tab !== regionIndex) {
                        setTab(regionIndex);
                      }
                    }}
                    onDelete={(event) => {
                      Utils.execPythonMessage(
                        `del netpyne_geppetto.netParams.rxdParams['rates']['${event.currentTarget.parentElement.id}']`,
                      );
                      const newRegions = Object.keys(props.rates).filter((item) => item !== event.currentTarget.parentElement.id);
                      if (newRegions.length > 0) {
                        setTab(newRegions.length - 1);
                      } else {
                        props.onAddRate(event.currentTarget.parentElement.id);
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
              <AddIcon onClick={addSingleRate}>Add a new reaction</AddIcon>
            </Button>
          </Box>
        )
        : <> </>}

      <>
        <RxdRate
          addSingleRate={addSingleRate}
          id={props?.rates ? rates[tab] : undefined}
          onAddReaction={props.onAddRate}
          controlledReaction={props?.rates ? props.rates[rates[tab]] : undefined}
        />
      </>
    </>
  );
};
export default RxdRates;
