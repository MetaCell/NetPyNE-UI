TITLE Bare bones INCLUDE file lets user set own alpha and beta function

COMMENT
** Parameter values should come from files specific to particular channels
PARAMETER {
	erev 		= 0    (mV)
	gmax 		= 0    (mho/cm^2)
        vrest           = 0    (mV)

	mq10		= 3
	mexp 		= 0
	hq10		= 3
	hexp 		= 0
	celsius			   (degC)
	dt 				   (ms)
	v 			       (mV)

	vmin 		= -100 (mV)
	vmax 		= 100  (mV)
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
	TABLE Add, Mult DEPEND dt, celsius, vrest, vmin, vmax  FROM vmin TO vmax WITH 200

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
