import { makeStyles } from '@material-ui/core/styles';

const drawerCss = (entering, transitions, palette, spacing) => ({ 
  overflow: 'hidden',
  width: props => props.width,
  flexShrink: 0,
  borderRight: 'none',
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'stretch',
  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: entering ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
  })
})

export default makeStyles(({ transitions, palette, spacing }) => ({
  openDrawer: drawerCss(true, transitions, palette, spacing),

  closeDrawer: drawerCss(false, transitions, palette, spacing),

  buttonContainer: { textAlign: 'end' },
  button: {
    color: 'white',
    marginBottom: spacing(1),
    marginRight: spacing(1),
  },
  text: { paddingLeft: spacing(1) },
  container: { 
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
    width: '100%'
  },
  
  selected: { color: palette.primary.main, paddingLeft: spacing(1) },
  unselected: { color: palette.common.white, paddingLeft: spacing(1) },
  disabled: { color: palette.common.black, paddingLeft: spacing(1) },
  icon: { color: 'inherit', minWidth: 'unset' }
}))