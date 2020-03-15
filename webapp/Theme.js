
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import purple from '@material-ui/core/colors/purple';
import pink from '@material-ui/core/colors/pink';

// pink
const secondaryColor = pink['A200']
// purple
const primaryColor = 'rgb(84, 58, 115)'


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
    primary: { main: primaryColor, },
    secondary: { main: secondaryColor, }
  },
  overrides: {
    MuiInputLabel: { formControl: { top: '-6px' } },
    MuiInput: {
      input: {
        outline: 'none !important', 
        border: 'none !important', 
        boxShadow: 'none !important' 
      },
    },
    MuiSelect: {
      root: {
        outline: 'none !important', 
        border: 'none !important', 
        boxShadow: 'none !important'
      },
      select: { "&:focus" :{ background: "none" } },
    }
  }
});