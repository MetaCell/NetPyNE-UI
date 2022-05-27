import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  NetPyNEField,
  NetPyNETextField,
} from 'netpyne/components';
import RxdNoData from './RxdNoData';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
}));

const RxdExtracellular = (props) => {
  const classes = useStyles();
  const baseTag = `netParams.rxdParams['extracellular']['${props.id}']`;

  return (
    <>
      { !props.id && (
        <>
          <RxdNoData
            message="There is no ExtraCellular section yet."
            callbackText="Add new extracellular"
            callback={props.addSingleExtra}
          />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.extracellular.xlo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['xlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.extracellular.ylo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['ylo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.extracellular.zlo">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['zlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.extracellular.xhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['xhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.extracellular.yhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['yhi']`}
              />
            </NetPyNEField>
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.extracellular.zhi">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['zhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.extracellular.dx">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['dx']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.extracellular.volume_fraction">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['volume_fraction']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.extracellular.tortuosity">
              <NetPyNETextField
                fullWidth
                variant="filled"
                model={`${baseTag}['tortuosity']`}
              />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdExtracellular;
