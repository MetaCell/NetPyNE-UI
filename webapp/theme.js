import { createTheme } from '@material-ui/core/styles';
import lessToJs from 'less-vars-to-js';

// Read the less file in as string: using the raw-loader to override the default loader
export const vars = lessToJs(require('!!raw-loader!./css/variables.less'), {
  resolveVariables: true,
  stripPrefix: true,
});

require('./css/netpyne.less');
require('./css/material.less');
require('./css/traceback.less');
require('./css/flexlayout.less');
require('./css/tree.less');

export const {
  primaryColor,
  secondaryColor,
  font,
  fontColor,
  bgLight,
  bgRegular,
  bgDark,
  bgDarker,
  bgDarkest,
  bgInputs,
  gutter,
  radius,
  canvasBgDark,
  canvasBgLight,
  experimentAutocompleteBorder,
  experimentInputColor,
  experimentGrey,
  experimentFieldColor,
  experimentSvgColor,
  experimentLabelColor,
  errorFieldBorder,
  primaryColorHover,
  fabDisableColor,
  fabDisableBg,
} = vars;

const rawTheme = {
  darkMode: true,
  typography: {
    useNextVariants: true,
    htmlFontSize: 12,
    fontSize: 10,
    fontFamily: font,
    button: {
      textTransform: 'none',
      fontSize: '1.0rem',
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: primaryColor,
      dark: secondaryColor,
    },
    secondary: {
      main: secondaryColor,
      dark: primaryColor,
    },
    button: { main: primaryColor },
  },
  overrides: {
    MuiInput: {
      input: {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
      root: { color: fontColor },
    },
    MuiSelect: {
      root: {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
      select: { '&:focus': { background: 'none' } },
    },
    MuiGrid: {
      root: {
        display: 'flex',
        alignItems: 'stretch',
        flex: 1,
      },
    },
    MuiCard: {
      root: {
        backgroundColor: `${bgDarker}!important`,
        overflowY: 'auto',
        flex: 1,
      },
    },
    MuiBottomNavigation: {
      root: {
        margin: gutter,
        backgroundColor: 'transparent',
      },
    },
    MuiPaper: {
      root: {
        color: 'inherit',
        backgroundColor: bgRegular,
      },
    },
    MuiBottomNavigationAction: {
      root: {
        color: fontColor,
        textTransform: 'uppercase',
        padding: '0.375rem 0.75rem 0.5rem !important',
        maxWidth: '10.5rem',
        minWidth: '5rem',

        '& .MuiBottomNavigationAction-wrapper': {
          lineHeight: '1.428125rem',
        },
      },
      label: {
        fontSize: '1rem',
        '&.Mui-selected': { fontSize: '1rem' },
      },
    },
    MuiFormControl: { root: { overflow: 'visible' } },
    MuiFab: {
      secondary: { color: fontColor },
      primary: { color: fontColor },
      root: {
        '&:not(.Mui-disabled).MuiFab-primary': {
          backgroundColor: primaryColor,
          '&:hover': {
            backgroundColor: secondaryColor,
          },
        },

        '&:not(.Mui-disabled).MuiFab-secondary': {
          backgroundColor: secondaryColor,
          '&:hover': {
            backgroundColor: primaryColor,
          },
        },

        '&.Mui-disabled': {
          color: fabDisableColor,
          boxShadow: 'none',
          backgroundColor: fabDisableBg,
        },
      },
    },
    MuiButton: {
      root: {
        '&.MuiButtonGroup-grouped': {
          minWidth: '2.5rem',
        },
      },
      contained: {
        color: fontColor,
        backgroundColor: bgInputs,
      },
      containedSecondary: { color: fontColor },
      containedPrimary: { color: fontColor },
    },
    MuiMenuItem: {
      root: {
        color: fontColor,
        paddingTop: `calc(${gutter} / 2)`,
        fontSize: '0.9rem',
      },
      gutters: {
        paddingLeft: `calc(${gutter} * 2)`,
        paddingRight: `calc(${gutter} * 2)`,
      },
    },
    MuiDialogTitle: { root: { color: fontColor } },
    MuiDialogActions: { root: { '& .$MuiButton-root': { textTransform: 'uppercase' } } },
    MuiTypography: { root: { color: fontColor } },
    MuiCollapse: {
      container: { padding: 0 },
      wrapper: { padding: '0 !important' },
    },
    MuiIcon: { fontSizeLarge: { fontSize: '1.75rem' } },
    MuiAccordionSummary: {
      root: {
        padding: '0!important',
        margin: 0,
        minHeight: 'unset!important',
      },
      content: {
        margin: '0!important',
        cursor: 'auto',
      },
      expandIcon: { marginRight: 0 },
    },
    MuiAccordionDetails: {
      root: {
        padding: 0,
        margin: 0,
        minHeight: 'unset!important',
        flexDirection: 'column',
      },
    },
    MuiAccordion: {
      root: {
        padding: 0,
        margin: '0 !important',
        minHeight: 'unset',
      },
    },
    MuiAutocomplete: {
      root: {
        '& .MuiIconButton-root': {
          padding: '0.125rem !important',
        },
      },
      popupIndicator: { marginRight: 0 },
    },
    MuiCardContent: { root: { padding: 8 } },

    MuiListItem: {
      root: {
        '&.MuiButtonBase-root': {
          color: 'white',
          paddingTop: '.5rem',
          whiteSpace: 'nowrap',
          paddingBottom: '0.375rem',
          display: 'flex',
          justifyContent: 'flex-start',
          textDecoration: 'none',
          textAlign: 'left',
          alignItems: 'center',
        },

        '&.MuiListItem-dense': {
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          justifyContent: 'flex-start',
        },

        '&.MuiMenuItem-gutters': {
          paddingLeft: '2rem',
          paddingRight: '2rem',
        },
      },
    },

    MuiIconButton: {
      root: {
        color: fontColor,
        padding: '0.75rem !important',
      },
    },
  },
};

export default createTheme(rawTheme);
