import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { bgDark } from '../../theme'

const useStyles = makeStyles(({ spacing, palette }) => ({ 
  container:{ height: 'calc(100% - 8px)', alignItems: 'stretch' },
  grid: {
    flex: '1 0 0',
    minWidth: 400,
    minHeight: 350,
    maxHeight: '100%',
    marginRight: spacing(1),
    marginBottom: spacing(1)
  },
  paper: { height: '100%', backgroundColor: bgDark },
  root: { height: '100%', overflowY: 'visible', overflowX: 'hidden', marginRight: -spacing(1) }
}))

export default function GridLayout ({ children }) {
  const classes = useStyles()
  // left-hand-side-top   -   left-hand-side-bottom   -   right-hand-side   -   others
  const [lhst, lhsb, rhs, ...others] = children
  return (
    <div className={classes.root}>
      <Grid container className={classes.container} alignItems="flex-start">

        <Grid item className={classes.grid}>
          <Paper className={classes.paper} >
            <SingleComponent>
              {lhst}
              {lhsb}
            </SingleComponent>
          </Paper>
  
        </Grid>

        <Grid item className={classes.grid}>
          <Paper className={classes.paper}>
            <SingleComponent>
              {[rhs]}
            </SingleComponent>
          </Paper>
        </Grid>

      </Grid>
      {others}
    </div>
    
  )
}

const useComponentStyles = makeStyles(({ spacing }) => ({ 
  container: { 
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: `0px ${spacing(1)}px`,
    paddingTop: spacing(1)
  },
  element: {
    overflowY:'auto', 
    overflowX:'hidden', 
    maxHeight: '100%',
    // height: '100%'
  }
}))

function SingleComponent ({ children = [] }) {
  const classes = useComponentStyles()
  const [topChild, ...otherChildren] = children

  return (
    <div className={classes.container}>
      <div >
        {otherChildren.length > 0 ? topChild : null}
      </div>

      <div className={classes.element}>
        {otherChildren.length > 0 ? otherChildren : topChild}
      </div>
    </div>
  )
  
}