import { makeStyles } from '@material-ui/core/styles';

const drawerCss = (entering, transitions, palette, spacing) => ({
  overflow: 'hidden',
  width: (props) => props.width,
  flexShrink: 0,
  borderRight: 'none',
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'stretch',
  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: entering ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
  }),
});

export default makeStyles(({
  transitions,
  palette,
  spacing,
}) => ({
  openDrawer: drawerCss(true, transitions, palette, spacing),

  closeDrawer: drawerCss(false, transitions, palette, spacing),

  buttonContainerOpen: { textAlign: 'end', padding: '0' },
  buttonContainerClosed: { textAlign: 'center', padding: '0' },
  button: {
    color: 'white',
    fontSize: '1em',
  },
  text: { marginLeft: spacing(1) },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
    width: '100%',

    '& > .MuiBox-root': {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 96px)',
    },
  },

  selected: { color: palette.primary.main },
  unselected: { color: palette.common.white },
  disabled: { color: palette.common.black },
  icon: {
    color: 'inherit',
    minWidth: 'unset',
  },
}));
