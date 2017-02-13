: $Id: H.mod,v 1.21 2010/02/19 17:15:36 billl Exp $ 

COMMENT
based on Otto Friesen Neurodynamix model
ENDCOMMENT

TITLE H channel 

UNITS {
    (mV) = (millivolt)
    (mA) = (milliamp)
}

NEURON {
    SUFFIX H
    GLOBAL minf
    USEION other WRITE iother VALENCE 1.0
    RANGE i,g,gmax,slopem,taum, eh, VhlfMaxm
    THREADSAFE
}

ASSIGNED { 
  i (mA/cm2)
  v (mV)
  g (mho/cm2)
  minf
  iother (mA/cm2)
}

STATE {
  m
}

PARAMETER {
  eh = -20 (mV)
  gmax  = 5e-07 (mho/cm2)
  VhlfMaxm = -74
  slopem = -10
  taum = 50 (ms)
}

PROCEDURE iassign () {
  i = g*(v-eh)
  iother = i
}

BREAKPOINT {
    SOLVE states METHOD cnexp
    g = m * gmax
    iassign()
}

INITIAL {
    settables(v)
    m = minf
    g = m * gmax
    iassign()
}

DERIVATIVE states {  
    settables(v)      
    m' = ( minf - m ) / taum 
}

UNITSOFF

PROCEDURE settables(v (mV)) {
    TABLE minf
          FROM -200 TO 200 WITH 401
    minf = 1 / (1 + exp((VhlfMaxm - v)/ slopem ) )
}

UNITSON

