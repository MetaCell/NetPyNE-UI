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
import RxdParameter from './RxdParameter';
import Utils from '../../Utils';

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RxdParameters = (props) => {
  const [tab, setTab] = React.useState(0);
  const [parameterCounter, setParameterCounter] = useState(0);

  const addSingleParameter = () => {
    const newCounter = parameterCounter + 1;
    const newRegion = `parameter${parameterCounter}`;
    if (!props.parameters) {
      Utils.execPythonMessage(
        "netpyne_geppetto.netParams.rxdParams['parameters'] = {}",
      );
    }
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['parameters']['${newRegion}'] = {}`,
    );
    setParameterCounter(newCounter);
    props.onAddParameter(newRegion);
  };

  let parameters = [];
  if (props.parameters) {
    parameters = Object.keys(props.parameters);
  }
  return (
    <>
      { parameters.length > 0
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
            parameters.map((region, index) => (
              <Tab
                key={region}
                label={(
                  <Chip
                    id={region}
                    label={region}
                    deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                    onClick={(event) => {
                      const clickedRegion = event.currentTarget.parentElement.id;
                      const regionIndex = parameters.indexOf(clickedRegion);
                      if (tab !== regionIndex) {
                        setTab(regionIndex);
                      }
                    }}
                    onDelete={(event) => {
                      Utils.execPythonMessage(
                        `del netpyne_geppetto.netParams.rxdParams['parameters']['${event.currentTarget.parentElement.id}']`,
                      );
                      const newParameters = Object.keys(props.parameters).filter((item) => item !== event.currentTarget.parentElement.id);
                      if (newParameters.length > 0) {
                        setTab(newParameters.length - 1);
                      } else {
                        props.onAddParameter(event.currentTarget.parentElement.id);
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
              <AddIcon onClick={addSingleParameter}>Add a new region</AddIcon>
            </Button>
          </Box>
        )
        : <> </>}

      <>
        <RxdParameter
          addSingleParameter={addSingleParameter}
          id={props?.parameters ? parameters[tab] : undefined}
          onAddParameter={props.onAddParameter}
          controlledRegion={props?.parameters ? props.parameters[parameters[tab]] : undefined}
        />
      </>
    </>
  );
};
export default RxdParameters;
