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
import RxdReaction from './RxdReaction';

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
    const newReaction = `reaction${reactionCounter}`;
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['reactions']['${newReaction}'] = {}`,
    );
    setReactionCounter(newCounter);
    props.onAddReaction(newReaction);
  };

  let reactions = [];
  if (props.reactions) {
    reactions = Object.keys(props.reactions);
  }
  return (
    <>
      { reactions.length > 0
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
            reactions.map((region, index) => (
              <Tab
                key={region}
                label={(
                  <Chip
                    id={region}
                    label={region}
                    deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                    onClick={(event) => {
                      const clickedRegion = event.currentTarget.parentElement.id;
                      const regionIndex = reactions.indexOf(clickedRegion);
                      if (tab !== regionIndex) {
                        setTab(regionIndex);
                      }
                    }}
                    onDelete={(event) => {
                      Utils.execPythonMessage(
                        `del netpyne_geppetto.netParams.rxdParams['reactions']['${event.currentTarget.parentElement.id}']`,
                      );
                      const newRegions = Object.keys(props.reactions).filter((item) => item !== event.currentTarget.parentElement.id);
                      if (newRegions.length > 0) {
                        setTab(newRegions.length - 1);
                      } else {
                        props.onAddReaction(event.currentTarget.parentElement.id);
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
        <RxdReaction
          addSingleReaction={addSingleReaction}
          id={props?.reactions ? reactions[tab] : undefined}
          onAddReaction={props.onAddReaction}
          controlledReaction={props?.reactions ? props.reactions[reactions[tab]] : undefined}
        />
      </>
    </>
  );
};
export default RxdReactions;
