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
} from '../../theme';

/**
 * Edit/Add view of a single Experiment.
 *
 * @return {JSX.Element}
 * @constructor
 */
const useStyles = (theme) => ({
  root: {
    '& .editExperimentContainer': {
      '& .editExperimentContent': {
        overflow: 'auto',
        maxHeight: 'calc(100vh - 400px)',
        '& .MuiTypography-body2': {
          opacity: '0.54',
        },
      },
    },
    '& .editExperimentBack': {
      display: 'flex',
      cursor: 'pointer',
      paddingLeft: theme.spacing(1),
      '& .MuiTypography-root': {
        marginLeft: theme.spacing(1),
      },
    },
    '& .editExperimentBreadcrumb': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.4),
      },
    },
    '& .editExperimentAutocomplete': {
      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, 9px) scale(0.75)',
      },
      '& .MuiAutocomplete-input': {
        padding: '1rem 0.25rem 0.188rem',
      },
    },
    '& .editExperimentList': {
      display: 'flex',
      marginBottom: theme.spacing(1),
      width: '100%',
    },
    '& .MuiTypography-body2': {
      fontSize: '1rem',
    },
    '& .editExperimentDefault': {
      paddingLeft: theme.spacing(1),
      overflow: 'auto',
    },
    '& .editExperimentHead': {
      paddingLeft: theme.spacing(1),
    },
    '& .editExperimentGroup': {
      background: bgDarkest,
      borderRadius: theme.spacing(0.4),
      padding: theme.spacing(2, 0),
      '& .scrollbar': {
        '&::-webkit-scrollbar-thumb': {
          background: secondaryColor,
          borderLeft: `${radius} solid ${bgDarkest}`,
          borderRight: `${radius} solid ${bgDarkest}`,
        },
        '&::-webkit-scrollbar': {
          width: theme.spacing(2),
        },
      },
      '& .editExperimentBreadcrumb': {
        paddingLeft: '0.625rem',
      },
      '& .editExperimentRow': {
        paddingLeft: theme.spacing(4),
        position: 'relative',
        overflow: 'auto',
        maxHeight: '25vh',
        '&:before': {
          background: bgLight,
          content: '""',
          height: '100%',
          width: '0.125rem',
          margin: 0,
          display: 'block',
          position: 'absolute',
          left: '0.875rem',
        },
      },
      '& .MuiFilledInput-root': {
        background: experimentFieldColor,
      },
      '& .MuiOutlinedInput-root': {
        background: experimentFieldColor,
      },
    },
    '& .MuiAutocomplete-root': {
      width: '100% !important',
    },
    '& .MuiPopover-root': {
      '& .MuiPaper-root': {
        '& .MuiList-root': {
          '& .MuiMenuItem-gutters': {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
        },
      },
    },
    '& .MuiPopover-experiment': {
      width: theme.spacing(14),
    },
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiOutlinedInput-root': {
      background: experimentInputColor,
    },
    '& .MuiFilledInput-root': {
      borderRadius: radius,
      background: experimentInputColor,
      border: '1px solid transparent',
      '&.Mui-error': {
        borderColor: errorFieldBorder,
        boxShadow: '0 0 0 2px rgba(242, 69, 61, 0.2)',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0 !important',
    },
    '& .MuiFilledInput-underline': {
      '&:after, &:before': {
        display: 'none',
      },
    },
    '& .MuiFormLabel-root': {
      fontWeight: 'normal',
      color: fontColor,
      opacity: '0.54',
      '&.MuiInputLabel-shrink': {
        color: experimentLabelColor,
        opacity: '0.87',
      },
    },
    '& .MuiTypography-colorPrimary': {
      borderBottom: `${primaryColor} 1px solid`,
      display: 'inline-flex',
      color: primaryColor,
      cursor: 'pointer',
      marginLeft: theme.spacing(1),
      '&:hover': {
        textDecoration: 'none',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
        marginTop: theme.spacing(0.4),
      },
    },
    '& .editExperimentFooter': {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      background: bgRegular,
      boxShadow: '0 -7px 13px -4px rgb(0, 0, 0, 0.6)',
      padding: theme.spacing(2.5),
      zIndex: 100,
      '& .MuiButton-root': {
        minWidth: theme.spacing(11),
        padding: theme.spacing(0.4),
        marginLeft: theme.spacing(1),
        borderRadius: '2px',
        cursor: 'pointer',
        textTransform: 'uppercase',
      },
      '& .MuiButton-textSecondary': {
        color: fontColor,
      },
    },
    '& .editExperimentWarning': {
      paddingLeft: '0.625rem',
      '& .MuiTypography-root': {
        color: experimentLabelColor,
      },
      '& .MuiTypography-caption': {
        fontSize: '0.875rem',
      },
    },
    '& .editExperimentField': {
      '& .MuiFormControl-root': {
        overflow: 'hidden',
        '& .MuiFormLabel-root': {
          whiteSpace: 'noWrap',
        },
      },
    },
    '& .MuiFormHelperText-contained': {
      marginLeft: 0,
    },
    '& .MuiFormHelperText-root': {
      fontSize: '0.875rem',
      lineHeight: '100%',
    },
  },
  popper: {
    marginTop: -theme.spacing(1),
    '& .MuiPaper-root': {
      boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
      borderRadius: `0 0 ${radius} ${radius}`,
      borderTop: `1px solid ${experimentAutocompleteBorder}`,
    },
    '& .MuiSvgIcon-root': {
      color: experimentSvgColor,
    },
    '& .MuiAutocomplete-option': {
      paddingLeft: theme.spacing(2),
      color: fontColor,
      paddingRight: theme.spacing(1),
    },
  },
});

export default useStyles;
