TITLE Generalized Hodgkin-Huxley eqn Channel Model (from GENESIS)

COMMENT

Each channel has activation and inactivation particles as in the original
Hodgkin Huxley formulation.  The activation particle mm and inactivation
particle hh go from on to off states according to kinetic variables alpha
and beta which are voltage dependent.
Allows exponential, sigmoid and linoid forms (flags 0,1,2)
See functions alpha() and beta() for details of parameterization

ENDCOMMENT

INDEPENDENT {t FROM 0 TO 1 WITH 1 (ms)}

NEURON {
	RANGE gmax, g, i
	GLOBAL erev, Inf, Tau, Mult, Add, vmin, vmax, vrest
} : end NEURON

CONSTANT {
	  FARADAY = 96489.0	: Faraday's constant
	  R= 8.31441		: Gas constant

} : end CONSTANT

UNITS {
	(mA) = (milliamp)
	(mV) = (millivolt)
	(umho) = (micromho)
} : end UNITS

COMMENT
** Parameter values should come from files specific to particular channels

PARAMETER {
	erev 		= 0    (mV)
	gmax 		= 0    (mho/cm^2)

	maflag 		= 0
	malphaA 	= 0
	malphaB		= 0
	malphaV0	= 0
	mbflag 		= 0
	mbetaA 		= 0
	mbetaB		= 0
	mbetaV0		= 0
	exptemp		= 0
	mq10		= 3
	mexp 		= 0

	haflag 		= 0
	halphaA 	= 0
	halphaB		= 0
	halphaV0	= 0
	hbflag 		= 0
	hbetaA 		= 0
	hbetaB		= 0
	hbetaV0		= 0
	hq10		= 3
	hexp 		= 0

	cao                (mM)
	cai                (mM)

	celsius			   (degC)
	dt 				   (ms)
	v 			       (mV)

	vmax 		= 100  (mV)
	vmin 		= -100 (mV)
} : end PARAMETER
ENDCOMMENT

ASSIGNED {
	i (mA/cm^2)		
	g (mho/cm^2)
	Inf[2]		: 0 = m and 1 = h
	Tau[2]		: 0 = m and 1 = h
	Mult[2]		: 0 = m and 1 = h
	Add[2]		: 0 = m and 1 = h
} : end ASSIGNED 

STATE { m h }

INITIAL { 
 	mh(v)
	if (usetable==0) {
 	  m = Inf[0] h = Inf[1]
	} else {
 	  m = Add[0]/(1-Mult[0]) h = Add[1]/(1-Mult[1]) 
	}
}

BREAKPOINT {

	LOCAL hexp_val, index, mexp_val

	SOLVE states

	hexp_val = 1
	mexp_val = 1

	: Determining h's exponent value
	if (hexp > 0) {
		FROM index=1 TO hexp {
			hexp_val = h * hexp_val
		}
	}

	: Determining m's exponent value
	if (mexp > 0) {
		FROM index = 1 TO mexp {
			mexp_val = m * mexp_val
		}
	}

	:			       mexp			    hexp
	: Note that mexp_val is now = m      and hexp_val is now = h 
	g = gmax * mexp_val * hexp_val

	iassign()
} : end BREAKPOINT

: ASSIGNMENT PROCEDURES
: Must be given by a user routines in parameters.multi
: E.G.:
:   PROCEDURE iassign () { i = g*(v-erev) ina=i }
:   PROCEDURE iassign () { i = g*ghkca(v) ica=i }

:-------------------------------------------------------------------
: I suppose we have 2 choices, to use the DERIVATIVE function or
: to explicitly state m+ and h+.  If you were to use the DERIVATIVE
: function, then you will do as follows:
: DERIVATIVE deriv {
:	m' = (-m + minf) / mtau
:	h' = (-h + hinf) / htau
: }
: Else, since m' = (m+ - m) / dt, setting the 2 equations together,
: we can solve for m+ and eventually get :
: 	m+ = (m * mtau + dt * minf) / (mtau + dt)
: and same for h+:
: 	h+ = (h * htau + dt * hinf) / (htau + dt)
: This is the one we will use, so ...
PROCEDURE states() {

	: Setup the mh table values

	mh (v*1(/mV))
	m = m * Mult[0] + Add[0]
	h = h * Mult[1] + Add[1]

	VERBATIM
	return 0;
	ENDVERBATIM	
}

:-------------------------------------------------------------------
: NOTE : 0 = m and 1 = h
PROCEDURE mh (v) {
	LOCAL a, b, j, qq10[2]
	TABLE Add, Mult DEPEND dt, maflag, malphaA, malphaB, malphaV0, mbflag, mbetaA, mbetaB, mbetaV0, exptemp, haflag, halphaA, halphaB, halphaV0, hbflag, hbetaA, hbetaB, hbetaV0, celsius, mq10, hq10, vrest, vmin, vmax  FROM vmin TO vmax WITH 200

	qq10[0] = mq10^((celsius-exptemp)/10.)	
	qq10[1] = hq10^((celsius-exptemp)/10.)	

	: Calculater Inf and Tau values for h and m
	FROM j = 0 TO 1 {
		a = alpha (v, j)
		b = beta (v, j)

		Inf[j] = a / (a + b)
		Tau[j] = 1. / (a + b) / qq10[j]
		if (hexp==0) { Tau[1] = 1. Inf[1] = 1.}
		Mult[j] = exp(-dt/Tau[j])
		Add[j]  = Inf[j]*(1. - exp(-dt/Tau[j]))
	}
} : end PROCEDURE mh (v)

:-------------------------------------------------------------------
FUNCTION alpha(v,j) {
  LOCAL flag, A, B, V0
  if (j==1 && hexp==0) {
	  alpha = 0
  } else {

     if (j == 1) {
	  A = halphaA B = halphaB V0 = halphaV0+vrest flag = haflag
     } else {
	  A = malphaA B = malphaB V0 = malphaV0+vrest flag = maflag
     }

     if (flag == 1) { :  EXPONENTIAL
	 alpha = A*exp((v-V0)/B)	
     } else if (flag == 2) { :  SIGMOID
	 alpha = A/(exp((v-V0)/B)+1)
     } else if (flag == 3) { :  LINOID
	 if(v == V0) {
           alpha = A*B
         } else {
           alpha = A*(v-V0)/(exp((v-V0)/B)-1) }
     }
}
} : end FUNCTION alpha (v,j)

:-------------------------------------------------------------------
FUNCTION beta (v,j) {
  LOCAL flag, A, B, V0
  if (j==1 && hexp==0) {
	  beta = 1
  } else {

     if (j == 1) {
	  A = hbetaA B = hbetaB V0 = hbetaV0+vrest flag = hbflag
     } else {
	  A = mbetaA B = mbetaB V0 = mbetaV0+vrest flag = mbflag
     }

    if (flag == 1) { :  EXPONENTIAL
	 beta = A*exp((v-V0)/B)
     } else if (flag == 2) { :  SIGMOID
	 beta = A/(exp((v-V0)/B)+1)
     } else if (flag == 3) { :  LINOID
	 if(v == V0) {
            beta = A*B 
         } else {
            beta = A*(v-V0)/(exp((v-V0)/B)-1) }
     }
}
} : end FUNCTION beta (v,j)

:-------------------------------------------------------------------
FUNCTION FRT(temperature) {
	FRT = FARADAY * 0.001 / R / (temperature + 273.15)
} : end FUNCTION FRT (temperature)

:-------------------------------------------------------------------
 FUNCTION ghkca (v) { : Goldman-Hodgkin-Katz eqn
       LOCAL nu, efun

       nu = v*2*FRT(celsius)
       if(fabs(nu) < 1.e-6) {
               efun = 1.- nu/2.
       } else {
               efun = nu/(exp(nu)-1.) }

       ghkca = -FARADAY*2.e-3*efun*(cao - cai*exp(nu))
 } : end FUNCTION ghkca()
