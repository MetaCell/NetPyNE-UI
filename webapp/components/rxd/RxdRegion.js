import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Chip,
  Button,
  MenuItem,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FontIcon from '@material-ui/core/Icon';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  ListComponent,
  NetPyNECheckbox,
  NetPyNESelectField,
} from 'netpyne/components';
import Select from 'netpyne/components/general/Select';
import RxdNoData from './RxdNoData';
import Utils from '../../Utils';
import { geometryClasses, geometryStrings } from '../../constants';
import {
  tabsTextColor,
} from '../../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
}));

const RxdRegion = (props) => {
  const classes = useStyles();
  const [variable, setVariable] = useState('');
  const [parameter, setParameter] = useState('');
  const baseTag = `netParams.rxdParams['regions']['${props.id}']`;
  const extracellularTag = "netParams.rxdParams['extracellular']";
  let updateDone = true;
  let dxField = (
    <NetPyNETextField
      fullWidth
      variant="filled"
      model={`${baseTag}['dx']`}
    />
  );
  let geometryExtras = (<></>);

  const postProcessPops = (pythonData) => {
    let results = [];
    if (pythonData !== undefined) {
      results = pythonData.map((name) => (
        <MenuItem id={`${name}MenuItem`} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
    return results;
  };

  const postProcessSecs = (pythonData) => {
    let results = [];
    if (pythonData !== undefined) {
      results = pythonData.map((name) => (
        <MenuItem id={`${name}MenuItem`} key={name} value={name}>
          {name}
        </MenuItem>
      ));
    }
    return results;
  };

  const postProcessDimensions = () => {
    const dimensions = [1, 3];
    const results = dimensions.map((name) => (
      <MenuItem id={`${name}MenuItem`} key={name} value={name}>
        {`${name}D`}
      </MenuItem>
    ));
    return results;
  };

  const activateExtracellular = () => {
    if (!props?.extracellular?.extracellular) {
      Utils.execPythonMessage(
        `netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['dx'] = ''`,
      );
    } else {
      Utils.execPythonMessage(
        `netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['dx'] = list()`,
      );
    }
  };

  if (props?.extracellular?.extracellular === true) {
    dxField = (
      <ListComponent
        model={`${baseTag}['dx']`}
      />
    );
  }

  const addGeometryArgs = (item) => {
    if (!props?.controlledRegion?.geometry?.args) {
      Utils.execPythonMessage(
        `netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['geometry']['args'] = {}`,
      );
    }
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['geometry']['args']['${parameter}'] = '${variable}'`,
    );
    setVariable('');
    setParameter('');
  };

  const handleGeometry = (value) => {
    if (geometryClasses.includes(value.target.value)) {
      if (props?.controlledRegion?.geometry?.class === undefined) {
        Utils.execPythonMessage(
          `netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['geometry'] = { 'class': '${value.target.value}'}`,
        );
      } else if (value.target.value !== props.controlledRegion.geometry.class) {
        Utils.execPythonMessage(
          `netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['geometry']['class'] = '${value.target.value}'`,
        );
      }
    } else if (geometryStrings.includes(value.target.value)) {
      if (value.target.value !== props.controlledRegion.geometry) {
        Utils.execPythonMessage(
          `netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['geometry'] = '${value.target.value}'`,
        );
      }
      geometryExtras = (<></>);
    }
  };

  if (typeof props.controlledRegion?.geometry === 'string' || props.controlledRegion?.geometry instanceof String) {
    handleGeometry({ target: { value: props.controlledRegion?.geometry } });
  } else if (typeof props.controlledRegion?.geometry?.class === 'string' || props.controlledRegion?.geometry?.class instanceof String) {
    handleGeometry({ target: { value: props.controlledRegion?.geometry.class } });
    geometryExtras = (
      <>
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <TextField
              fullWidth
              label="Args key"
              variant="filled"
              onChange={(e) => setParameter(e.target.value)}
              value={parameter}
            />
          </div>
          <div className="scrollbar scrollchild spacechild">
            <TextField
              fullWidth
              label="Args value"
              variant="filled"
              onChange={(e) => setVariable(e.target.value)}
              value={variable}
            />
          </div>
          <div
            className="scrollbar scrollchild spacechild"
            style={{
              flex: '0 0 5em',
              paddingTop: '15px',
            }}
          >
            <Button className="button">
              <AddIcon
                onClick={addGeometryArgs}
                style={{
                  color: tabsTextColor,
                }}
              >
                Add a new constant
              </AddIcon>
            </Button>
          </div>
        </div>
        {Object?.keys(props?.controlledRegion?.geometry?.args || {}).map((item) => (
          <div className={classes.root}>
            <div className="scrollbar scrollchild spacechild">
              <TextField
                fullWidth
                disabled={1}
                label="parameter"
                variant="filled"
                defaultValue={`${baseTag}['geometry']['${item}']`}
              />
            </div>
            <div className="scrollbar scrollchild spacechild" style={{ flex: '0 0 7em' }}>
              <NetPyNETextField
                fullWidth
                label="value"
                variant="filled"
                model={`${baseTag}['geometry']['args']['${item}']`}
              />
            </div>
            <div
              className="scrollbar scrollchild spacechild"
              style={{
                flex: '0 0 5em',
                paddingTop: '15px',
              }}
            >
              <Chip
                id={item}
                deleteIcon={<FontIcon style={{ color: tabsTextColor }} className="fa fa-minus-circle" />}
                onClick={(event) => {
                  Utils.execPythonMessage(
                    `del netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['geometry']['args']['${event.currentTarget.parentElement.id}']`,
                  );
                }}
                onDelete={(event) => {
                  Utils.execPythonMessage(
                    `del netpyne_geppetto.netParams.rxdParams['regions']['${props.id}']['geometry']['args']['${event.currentTarget.parentElement.id}']`,
                  );
                }}
              />
            </div>
          </div>
        ))}
      </>);
  }


  return (
    <>
      { !props.id && (
        <>
          <RxdNoData message="There are no Regions yet." callbackText="Add new region" callback={props.addSingleRegion} />
        </>
      )}
      { props.id && (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.regions.cells">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['cells']`}
                method="netpyne_geppetto.getAvailableCellTypes"
                postProcessItems={postProcessPops}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.secs">
              <NetPyNESelectField
                multiple={1}
                model={`${baseTag}['secs']`}
                method="netpyne_geppetto.getAvailableRxDSections"
                pythonParams={[props.id]}
                postProcessItems={postProcessSecs}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.nrn_region">
              <SelectField variant="filled" model={`${baseTag}['nrn_region']`} />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.dimension">
              <NetPyNESelectField
                model={`${baseTag}['dimension']`}
                postProcessItems={postProcessDimensions}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.dx">
              {dxField}
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.geometry">
              <Select variant="filled" value={props?.controlledRegion?.geometry?.class || props?.controlledRegion?.geometry || ""} onChange={handleGeometry}>
                <MenuItem id="EmptyMenuItem" key="Empty" value=" ">
                  {' '}
                </MenuItem>
                {geometryStrings.concat(geometryClasses).map((item) => (
                  <MenuItem id={`${item}MenuItem`} key={item} value={item}>
                    {`${item}`}
                  </MenuItem>
                ))}
              </Select>
            </NetPyNEField>
            {geometryExtras}
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNEField id="netParams.rxdParams.regions.extracellular" className="netpyneCheckbox">
              <NetPyNECheckbox
                model={`${extracellularTag}['extracellular']`}
                onChange={activateExtracellular}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.xlo">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['xlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.ylo">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['ylo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.zlo">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['zlo']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.xhi">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['xhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.yhi">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['yhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.zhi">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['zhi']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.volume_fraction">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['volume_fraction']`}
              />
            </NetPyNEField>
            <NetPyNEField id="netParams.rxdParams.regions.tortuosity">
              <NetPyNETextField
                fullWidth
                disabled={!props?.extracellular?.extracellular}
                variant="filled"
                model={`${extracellularTag}['tortuosity']`}
              />
            </NetPyNEField>
          </div>
        </div>
      )}
    </>
  );
};

export default RxdRegion;
