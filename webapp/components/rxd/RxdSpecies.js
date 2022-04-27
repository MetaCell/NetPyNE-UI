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
  const species = props.species ;

  return (
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
                  key={species}
                  label={(
                    <Chip
                      label={species}
                      deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                      onClick={() => { 

                      }}
                      onDelete={() => { 
                        
                      }}
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
      <><RxdSpecie id={props.species[props.activeSpecieIndex]} onAddRegion={props.onAddSpecie}></RxdSpecie></>
    </>
  );
};
export default RxdSpecies;
