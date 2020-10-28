import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function GridLayout ({ children, className = '' }) {
  // left-hand-side-top   -   left-hand-side-bottom   -   right-hand-side   -   others
  const [lhst, lhsb, rhs, ...others] = children
  return (
    <div className={`layoutVerticalFit ${className}` }>
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
