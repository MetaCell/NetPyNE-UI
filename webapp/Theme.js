
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// orange
export const primaryColor = '#37ABC8'

export const bgLight = '#4A4A4A';
export const bgRegular = '#434343';
export const bgDark = '#353535';

export const font = 'Roboto, Helvetica, Arial, sans-serif'

export default createMuiTheme({
  typography: {
    useNextVariants: true,
    htmlFontSize: 12,
    fontSize: 10,
    fontFamily: font,
    button: {
      textTransform: "none",
      fontSize: "1.0rem"
    }
  },
  palette: {
    type: 'dark',
    primary: { main: primaryColor, },
    secondary: { main: bgLight, },
  },
  overrides: {
    MuiInputLabel: { formControl: { top: '-6px' } },
    MuiInput: {
      input: {
        outline: 'none !important', 
        border: 'none !important', 
        boxShadow: 'none !important',
      },
      root:{ color: 'white' }

    },
    MuiSelect: {
      root: {
        outline: 'none !important', 
        border: 'none !important', 
        boxShadow: 'none !important'
      },
      select: { "&:focus" :{ background: "none" }, paddingLeft: '4px' },
    },
    MuiCard: { root: { height: '100%', backgroundColor: bgRegular, overflowY: 'auto' } },
    MuiBottomNavigation: { root: { backgroundColor: bgRegular } },
    MuiPaper: { root: { color: 'inherit' } },
    MuiBottomNavigationAction: { root: { color: 'white' } },
    MuiFab:{ 
      secondary: { color: 'white' },
      primary: { color: 'white' } 
    },
    MuiButton: { 
      containedSecondary: { color: 'white' },
      containedPrimary: { color: 'white' },
    },
    MuiMenuItem: { root: { color: 'white' } },

    MuiListItemText: { root: { color: 'white' } },
    MuiDialogTitle: { root: { color: 'white' } },
    MuiTypography: { root: { color: 'white' } }
    
  }
});