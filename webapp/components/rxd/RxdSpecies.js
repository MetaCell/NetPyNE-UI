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
import RxdSpecie from './RxdSpecie'
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

const RxdSpecies = (props) => {
  const [tab, setTab] = React.useState(0);
  const [speciesNames, setSpeciesNames] = React.useState([]);
  const species = props.species ; 
  const [activeSpecie , setActiveSpecie] = React.useState(null);

  const addSpecieName = (name) => {
    setSpeciesNames([...speciesNames, name]);
  }

  const addSpecie = () => {
    if (props.species.length == 1)
    {
      alert('only 1 specie is allowed');
      return ;
    }
    const newSpecie = <RxdSpecie onAddSpecieName={addSpecieName} key={Math.random()} ></RxdSpecie> ;
    props.setSpecies([...species, newSpecie]);
    setActiveSpecie(newSpecie);
  }

  const deleteSpecie = (index) => {
    speciesNames.splice(index);
    species.splice(index);
    props.setSpecies(species);
    setSpeciesNames(speciesNames);
  }

    return (
      <>
        {
      species.length !== 0 ? (
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
                  species.map((specie, index) => (
                    <Tab
                      key={speciesNames[index]}
                      label={(
                        <Chip
                          label={speciesNames[index]}
                          deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                          onClick={() => { setActiveSpecie(species[index])} }
                          onDelete={() => { deleteSpecie(index) }}
                        />
                      )}
                      {...a11yProps(index)}
                    />
                  ))
                }
            </Tabs>
            <Button className="button">
              <AddIcon onClick={ () => { addSpecie() } }>Add a specie</AddIcon>
              
            </Button>
          </Box>
          <>{activeSpecie}</>
        </>
      )
        : <RxdNoData message="There are no Species yet." callbackText="Add new specie" callback={ ()=> { addSpecie(); }} />
      }
      </>
    );
};
export default RxdSpecies;
