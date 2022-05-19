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
import RxdMultiReaction from './RxdMulticompartmentReaction';

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RxdReactions = (props) => {
  const [tab, setTab] = React.useState(0);
  const [reactionCounter, setReactionCounter] = useState(0);

  const addSingleReaction = () => {
    const newCounter = reactionCounter + 1;
    const newReaction = `multiReaction${reactionCounter}`;
    if (!props.multicompartmentReactions) {
      Utils.execPythonMessage(
        "netpyne_geppetto.netParams.rxdParams['multicompartmentReactions'] = {}",
      );
    }
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['multicompartmentReactions']['${newReaction}'] = {}`,
    );
    setReactionCounter(newCounter);
    props.onAddMultiReaction(newReaction);
  };

  let multicompartmentReactions = [];
  if (props.multicompartmentReactions) {
    multicompartmentReactions = Object.keys(props.multicompartmentReactions);
  }
  return (
    <>
      { multicompartmentReactions.length > 0
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
            multicompartmentReactions.map((region, index) => (
              <Tab
                key={region}
                label={(
                  <Chip
                    id={region}
                    label={region}
                    deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                    onClick={(event) => {
                      const clickedRegion = event.currentTarget.parentElement.id;
                      const regionIndex = multicompartmentReactions.indexOf(clickedRegion);
                      if (tab !== regionIndex) {
                        setTab(regionIndex);
                      }
                    }}
                    onDelete={(event) => {
                      Utils.execPythonMessage(
                        `del netpyne_geppetto.netParams.rxdParams['multicompartmentReactions']['${event.currentTarget.parentElement.id}']`,
                      );
                      const newRegions = Object.keys(props.multicompartmentReactions).filter((item) => item !== event.currentTarget.parentElement.id);
                      if (newRegions.length > 0) {
                        setTab(newRegions.length - 1);
                      } else {
                        props.onAddMultiReaction(event.currentTarget.parentElement.id);
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
              <AddIcon onClick={addSingleReaction}>Add a new reaction</AddIcon>
            </Button>
          </Box>
        )
        : <> </>}

      <>
        <RxdMultiReaction
          addSingleReaction={addSingleReaction}
          id={props?.multicompartmentReactions ? multicompartmentReactions[tab] : undefined}
          onAddMultiReaction={props.onAddMultiReaction}
          controlledReaction={props?.multicompartmentReactions ? props.multicompartmentReactions[multicompartmentReactions[tab]] : undefined}
        />
      </>
    </>
  );
};
export default RxdReactions;
