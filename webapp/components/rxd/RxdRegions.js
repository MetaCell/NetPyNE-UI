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
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  ListComponent,
  GridLayout,
} from 'netpyne/components';
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

const RxdRegions = (props) => {
  const [tab, setTab] = React.useState(0);
  const { regions, setRegions } = props;

  const addRegion = () => {
    console.log('Add region clicked');
  };

  return (
    <>
      {
    regions.length !== 0 ? (
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
                regions.map((region, index) => (
                  <Tab
                    key={region.id}
                    label={(
                      <Chip
                        label={region.label}
                        deleteIcon={<FontIcon className="fa fa-minus-circle" />}
                        onClick={() => setTab(region.id)}
                        onDelete={() => setRegions(regions.filter((regionItem) => regionItem.id !== region.id))}
                      />
                    )}
                    {...a11yProps(index)}
                  />
                ))
              }
          </Tabs>
          <Button className="button">
            <AddIcon onClick={addRegion} />
            Add a region
          </Button>
        </Box>
        {
          regions.map((region, index) => (
            <TabPanel value={tab} index={index} key={region.id}>
              <GridLayout className="gridLayout">
                <div />
                <div className="scrollbar scrollchild">
                  <NetPyNEField id="simConfig.duration">
                    <NetPyNETextField
                      fullWidth
                      variant="filled"
                      model="simConfig.duration"
                    />
                  </NetPyNEField>

                  <NetPyNEField id="simConfig.hParams" className="listStyle">
                    <ListComponent model="simConfig.hParams" />
                  </NetPyNEField>
                </div>

                <div className="scrollbar scrollchild">
                  <NetPyNEField id="netParams.shape">
                    <SelectField variant="filled" model="netParams.shape" />
                  </NetPyNEField>

                  <NetPyNEField id="netParams.shape">
                    <SelectField variant="filled" model="netParams.shape" />
                  </NetPyNEField>

                  <NetPyNEField id="netParams.shape">
                    <SelectField variant="filled" model="netParams.shape" />
                  </NetPyNEField>

                  <NetPyNEField id="netParams.shape">
                    <SelectField variant="filled" model="netParams.shape" />
                  </NetPyNEField>
                </div>
              </GridLayout>
            </TabPanel>
          ))
        }
      </>
    )
      : <RxdNoData message="There are no Regions yet." callbackText="Add new region" callback={addRegion} />
    }
    </>
  );
};
export default RxdRegions;
