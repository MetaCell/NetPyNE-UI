import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  NetPyNEField,
  NetPyNETextField,
  SelectField,
  NetPyNECheckbox,
  NetPyNESelectField,
} from 'netpyne/components';
import {
  Chip,
  Button,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FontIcon from '@material-ui/core/Icon';
import Utils from '../../Utils';
import {
  bgDarkest,
  bgLight,
  bgRegular,
  secondaryColor,
  fontColor,
  radius,
  primaryColor,
  experimentInputColor,
  experimentFieldColor,
  experimentSvgColor,
  experimentLabelColor,
  experimentAutocompleteBorder,
  errorFieldBorder,
  tabsTextColor,
} from '../../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
  },
  headerConstant: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
    marginTop: '25px',
    marginBottom: '10px',
  },
}));

const RxdConstants = (props) => {
  const classes = useStyles();
  const baseTag = "netParams.rxdParams['constants']";
  const [parameter, setParameter] = useState('');
  const [value, setValue] = useState('');

  const addSingleConstant = () => {
    Utils.execPythonMessage(
      `netpyne_geppetto.netParams.rxdParams['constants']['${parameter}'] = '${value}'`,
    );
    setValue('');
    setParameter('');
    props.onAddConstants('test');
  };

  return (
    <>
      <div className={classes.headerConstant}>
        <div className="scrollbar scrollchild spacechild">
          <TextField
            fullWidth
            label="Constant key"
            variant="filled"
            onChange={(e) => setParameter(e.target.value)}
            value={parameter}
          />
        </div>
        <div className="scrollbar scrollchild spacechild">
          <TextField
            fullWidth
            label="Constant value"
            variant="filled"
            onChange={(e) => setValue(e.target.value)}
            value={value}
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
              onClick={addSingleConstant}
              style={{
                color: tabsTextColor,
              }}
            >
              Add a new constant
            </AddIcon>
          </Button>
        </div>
      </div>

      { Object.keys(props.constants).map((constant) => (
        <div className={classes.root}>
          <div className="scrollbar scrollchild spacechild">
            <TextField
              fullWidth
              disabled={1}
              label="parameter"
              variant="filled"
              defaultValue={`${baseTag}['${constant}']`}
            />
          </div>
          <div className="scrollbar scrollchild spacechild">
            <NetPyNETextField
              fullWidth
              label="value"
              variant="filled"
              model={`${baseTag}['${constant}']`}
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
              id={constant}
              deleteIcon={<FontIcon style={{ color: tabsTextColor }} className="fa fa-minus-circle" />}
              onClick={(event) => {
                Utils.execPythonMessage(
                  `del netpyne_geppetto.netParams.rxdParams['constants']['${event.currentTarget.parentElement.id}']`,
                );
                props.onAddConstants(event.currentTarget.parentElement.id);
              }}
              onDelete={(event) => {
                Utils.execPythonMessage(
                  `del netpyne_geppetto.netParams.rxdParams['constants']['${event.currentTarget.parentElement.id}']`,
                );
                props.onAddConstants(event.currentTarget.parentElement.id);
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default RxdConstants;
