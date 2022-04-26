import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { NoData } from '../icons';

const useStyles = makeStyles((theme) => ({
  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '70vh',

    '& > svg': {
      marginBottom: theme.spacing(2),
      width: '8rem',
      height: '8rem',
    },

    '& p': {
      marginBottom: theme.spacing(2),
      fontSize: '1.2rem',
    },
  },
}));

const RxdNoData = (props) => {
  const classes = useStyles();
  const { message, callback, callbackText } = props;

  return (
    <Box className={`${classes.noData} layoutVerticalFitInner`}>
      <NoData />
      <Typography>{message}</Typography>
      <Button className={classes.button} variant="outlined">
        <AddIcon onClick={ ()=> { props.callback() } }>{ callbackText }</AddIcon>        
      </Button>
    </Box>
  );
};
export default RxdNoData;
