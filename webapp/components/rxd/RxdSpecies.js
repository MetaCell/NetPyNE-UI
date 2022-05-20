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
import RxdSpecie from './RxdSpecie';
import Utils from '../../Utils';

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

const RxdSpecies = (props) => {
  const [tab, setTab] = React.useState(0);
  const [speciesCounter, setSpeciesCounter] = useState(0);

  const addSingleSpecie = () => {
    const newCounter = speciesCounter + 1;
    const newSpecies = `species${speciesCounter}`;
    if (!props.species) {
      Utils.execPythonMessage(
        "netpyne_geppetto.netParams.rxdParams['species'] = {}",
      );
    }
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['species']['${newSpecies}'] = {}`,
    );
    setSpeciesCounter(newCounter);
    props.onAddRegion(newSpecies);
  };

  let species = [];
  if (props.species) {
    species = Object.keys(props.species);
  }

  return (
    <>
      { species.length > 0
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
              species.map((specie, index) => (
                <Tab
                  key={specie}
                  label={(
                    <Chip
                      id={specie}
                      label={specie}
                      deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                      onClick={(event) => {
                        const clickedSpecie = event.currentTarget.parentElement.id;
                        const specieIndex = species.indexOf(clickedSpecie);
                        if (tab !== specieIndex) {
                          setTab(specieIndex);
                        }
                      }}
                      onDelete={(event) => {
                        Utils.execPythonMessage(
                          `del netpyne_geppetto.netParams.rxdParams['species']['${event.currentTarget.parentElement.id}']`,
                        );
                        const newSpecies = Object.keys(props.species).filter((item) => item !== event.currentTarget.parentElement.id);
                        if (newSpecies.length > 0) {
                          setTab(newSpecies.length - 1);
                        } else {
                          props.onAddSpecie(event.currentTarget.parentElement.id);
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
              <AddIcon onClick={addSingleSpecie}>Add a specie</AddIcon>
            </Button>
          </Box>
        )
        : <> </>}
      <>
        <RxdSpecie
          id={props?.species ? species[tab] : undefined}
          addSingleSpecie={addSingleSpecie}
          onAddSpecie={props.onAddSpecie}
          controlledSpecie={props?.species ? props.species[species[tab]] : undefined}
        />
      </>
    </>
  );
};

export default RxdSpecies;
