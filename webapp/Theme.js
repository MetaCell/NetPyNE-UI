
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import purple from '@material-ui/core/colors/purple';
import orange from '@material-ui/core/colors/orange';

// orange
const primaryColor = '#f67700'
const secondaryColor = '#f67700'

const bgLight = '#616161';
const bgRegular = '#424242';
const bgDark = '#212121';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
    htmlFontSize: 12,
    fontSize: 10,
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    button: {
      textTransform: "none",
      fontSize: "1.0rem"
    }
  },
  palette: {
    type: 'dark',
    primary: { main: primaryColor, },
    secondary: { main: bgLight, }
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
    MuiDialogTitle: { root: { color: 'white' } }
    
  }
});