import React from 'react';
import ReactJson from 'react-json-view';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  fontColor,
  experimentLabelColor,
  bgDarker,
  bgDarkest,
  primaryColor,
} from '../../theme';

const useStyles = (theme) => ({
  root: {
    width: 'auto !important',
    flexDirection: 'column',
    backgroundColor: bgDarker,
    padding: theme.spacing(2),
    borderRadius: '0.25rem',
    '& .MuiBreadcrumbs-separator': {
      marginLeft: theme.spacing(0),
    },
    '& .react-json-view': {
      padding: theme.spacing(2),
      overflow: 'auto',
      borderRadius: '0.25rem',
      '& span': {
        opacity: 1,
      },
    },
    '& .MuiBreadcrumbs-ol': {
      paddingBottom: theme.spacing(2),
      '& .MuiBreadcrumbs-li': {
        '& a': {
          color: experimentLabelColor,
          fontSize: '1rem',
        },
        '& p': {
          color: fontColor,
          fontSize: '1rem',
        },
      },
    },
    '& .pageHeading': {
      paddingBottom: theme.spacing(2),
      color: fontColor,
      fontSize: '1rem',
    },
  },
});

const JsonViewer = (props) => {
  const {
    baseTitle, setViewExperiment, classes, setJsonViewer, title, json,
  } = props;

  const theme = {
    scheme: 'netPyneJsonViewer',
    base00: bgDarkest,
    base01: bgDarkest,
    base02: '#4D4D4D',
    base03: fontColor,
    base04: fontColor,
    base05: fontColor,
    base06: fontColor,
    base07: fontColor,
    base08: fontColor,
    base09: primaryColor,
    base0A: fontColor,
    base0B: primaryColor,
    base0C: fontColor,
    base0D: fontColor,
    base0E: fontColor,
    base0F: primaryColor,
  };

  const goBackToExperiment = () => {
    setJsonViewer(false);
    setViewExperiment(true);
  };

  return (
    <div className={classes.root}>
      { baseTitle ? (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Button color="inherit" onClick={goBackToExperiment}>
            {baseTitle}
          </Button>
          <Typography color="textPrimary">{title}</Typography>
        </Breadcrumbs>
      ) : (
        <Box className="pageHeading">
          <Typography color="textPrimary">{title}</Typography>
        </Box>
      )}
      <ReactJson
        name={null}
        theme={theme}
        style={{
          fontFamily: 'Source Sans Pro, sans-serif',
          fontStyle: 'normal',
          fontWeight: 'normal',
        }}
        src={json}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        indentWidth={4}
        enableDelete={false}
        enableEdit={false}
        enableAdd={false}
      />
    </div>
  );
};

export default withStyles(useStyles)(JsonViewer);
