import React, { useState } from 'react';
import FontIcon from '@material-ui/core/Icon';
import {
  Box,
  Tabs,
  Tab,
  Chip,
} from '@material-ui/core';
import Utils from '../../Utils';
import RxdExtracellular from './RxdExtracellular';

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RxdExtracellulars = (props) => {
  const [tab, setTab] = React.useState(0);
  const [extraCounter, setExtraCounter] = useState(0);

  const addSingleExtra = () => {
    const newCounter = extraCounter + 1;
    const newExtra = `extracellular${extraCounter}`;
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['extracellular']['${newExtra}'] = {}`,
    );
    setExtraCounter(newCounter);
    props.onAddExtracellular(newExtra);
  };

  let extras = [];
  if (props.extracellular) {
    extras = Object.keys(props.extracellular);
  }
  return (
    <>
      { extras.length > 0
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
            extras.map((region, index) => (
              <Tab
                key={region}
                label={(
                  <Chip
                    id={region}
                    label={region}
                    deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                    onClick={(event) => {
                      const clickedRegion = event.currentTarget.parentElement.id;
                      const regionIndex = extras.indexOf(clickedRegion);
                      if (tab !== regionIndex) {
                        setTab(regionIndex);
                      }
                    }}
                    onDelete={(event) => {
                      Utils.execPythonMessage(
                        `del netpyne_geppetto.netParams.rxdParams['extracellular']['${event.currentTarget.parentElement.id}']`,
                      );
                      const newRegions = Object.keys(props.extracellular).filter((item) => item !== event.currentTarget.parentElement.id);
                      if (newRegions.length > 0) {
                        setTab(newRegions.length - 1);
                      } else {
                        props.onAddExtracellular(event.currentTarget.parentElement.id);
                      }
                    }}
                  />
                )}
                {...a11yProps(index)}
              />
            ))
          }
            </Tabs>
          </Box>
        )
        : <> </>}

      <>
        <RxdExtracellular
          addSingleExtra={addSingleExtra}
          id={props?.extracellular ? extras[tab] : undefined}
          onAddExtracellular={props.onAddExtracellular}
          controlledRegion={props?.extracellular ? props.extracellular[extras[tab]] : undefined}
        />
      </>
    </>
  );
};
export default RxdExtracellulars;
