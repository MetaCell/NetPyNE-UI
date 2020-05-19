import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(({ spacing, palette }) => ({}))

export default function GridLayout ({ children }) {
  const classes = useStyles()
  // left-hand-side-top   -   left-hand-side-bottom   -   right-hand-side   -   others
  const [lhst, lhsb, rhs, ...others] = children
  return (
    <div className={classes.root}>
      <Grid container elevation={0} spacing={1} alignItems="stretch">

        <Grid item>
          <Card elevation={0}>
            <CardContent > 
              {lhst}
              {lhsb}
            </CardContent>
          </Card>
  
        </Grid>

        { rhs 
          ? <Grid item >
            <Card elevation={0}>
              <CardContent> 
                {[rhs]}
              </CardContent>
            </Card>
          </Grid> : ''
        }
      </Grid>
      {others}
    </div>
    
  )
}
