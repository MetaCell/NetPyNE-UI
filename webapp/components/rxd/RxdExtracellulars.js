import React, { useState } from 'react';
import {
  NetPyNEField,
  ListComponent,
  NetPyNECheckbox,
  NetPyNETextField,
} from 'netpyne/components';
import { makeStyles } from '@material-ui/core/styles';
import RxdNoData from './RxdNoData';
import Utils from '../../Utils';

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
}));

const RxdExtracellulars = (props) => {
  const classes = useStyles();
  const baseTag = "netParams.rxdParams['extracellular']";

  let regions = [];
  if (props.regions) {
    regions = Object.keys(props.regions);
  }
  return (
    <>
      { regions.length > 0
        ? (
          <div className={classes.root}>
            <div className="scrollbar scrollchild spacechild">
              <NetPyNEField id="netParams.rxdParams.regions.extracellular" className="netpyneCheckbox">
                <NetPyNECheckbox
                  model={`${baseTag}['extracellular']`}
                  onChange={() => { console.log('test'); }}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.volume_fraction">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['volume_fraction']`}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.tortuosity">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['tortuosity']`}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.dx">
                <ListComponent
                  disabled={!props?.extracellular?.extracellular}
                  model={`${baseTag}['dx']`}
                />
              </NetPyNEField>
            </div>
            <div className="scrollbar scrollchild spacechild">
              <NetPyNEField id="netParams.rxdParams.extracellular.xlo">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['xlo']`}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.ylo">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['ylo']`}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.zlo">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['zlo']`}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.xhi">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['xhi']`}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.yhi">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['yhi']`}
                />
              </NetPyNEField>
              <NetPyNEField id="netParams.rxdParams.extracellular.zhi">
                <NetPyNETextField
                  fullWidth
                  disabled={!props?.extracellular?.extracellular}
                  variant="filled"
                  model={`${baseTag}['zhi']`}
                />
              </NetPyNEField>
            </div>
          </div>
        )
        : (
          <>
            <RxdNoData
              message="Extracellular is disabled if regions are missing."
            />
          </>
        )}
    </>
  );
};

export default RxdExtracellulars;
