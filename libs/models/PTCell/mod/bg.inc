: $Id: bg.inc,v 1.3 1996/04/05 23:20:18 billl Exp $
TITLE Borg-Graham Channel Model

COMMENT

Modeling the somatic electrical response of hippocampal pyramidal neurons, 
MS thesis, MIT, May 1987.

Each channel has activation and inactivation particles as in the original
Hodgkin Huxley formulation.  The activation particle mm and inactivation
particle hh go from on to off states according to kinetic variables alpha
and beta which are voltage dependent.  The form of the alpha and beta
functions were dissimilar in the HH study.  The BG formulae are:
	alpha = base_rate * Exp[(v - v_half)*valence*gamma*F/RT]
	beta = base_rate * Exp[(-v + v_half)*valence*(1-gamma)*F/RT]
where,
	baserate : no affect on Inf.  Lowering this increases the maximum
		    value of Tau
	basetau : (in msec) minimum Tau value.
	chanexp : number for exponentiating the state variable; e.g.
		  original HH Na channel use m^3, note that chanexp = 0
		  will turn off this state variable
	erev : reversal potential for the channel
	gamma : (between 0 and 1) does not affect the Inf but makes the
		Tau more asymetric with increasing deviation from 0.5
	celsius : temperature at which experiment was done (Tau will
		      will be adjusted using a q10 of 3.0)
	valence : determines the steepness of the Inf sigmoid.  Higher
		  valence gives steeper sigmoid.
	vhalf : (a voltage) determines the voltage at which the value
		 of the sigmoid function for Inf is 1/2
	vmin, vmax : limits for construction of the table.  Generally,
		     these should be set to the limits over which either
		     of the 2 state variables are varying.
        vrest : (a voltage) voltage shift for vhalf

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
        vrest           = 0    (mV)

	mvalence 	= 0
	mgamma 		= 0
	mbaserate 	= 0
	mvhalf 		= 0
	mbasetau 	= 0
	mtemp 		= 0
	mq10		= 3
	mexp 		= 0

	hvalence 	= 0
	hgamma		= 0
	hbaserate 	= 0
	hvhalf 		= 0
	hbasetau 	= 0
	htemp 		= 0
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
: Must be overwritten by user routines in parameters.multi
: PROCEDURE iassign () { i = g*(v-erev) ina=i }
: PROCEDURE iassign () { i = g*ghkca(v) ica=i }

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
	LOCAL a, b, j, mqq10, hqq10
	TABLE Add, Mult DEPEND dt, hbaserate, hbasetau, hexp, hgamma, htemp, hvalence, hvhalf, mbaserate, mbasetau, mexp, mgamma, mtemp, mvalence, mvhalf, celsius, mq10, hq10, vrest, vmin, vmax  FROM vmin TO vmax WITH 200

	mqq10 = mq10^((celsius-mtemp)/10.)	
	hqq10 = hq10^((celsius-htemp)/10.)	

	: Calculater Inf and Tau values for h and m
	FROM j = 0 TO 1 {
		a = alpha (v, j)
		b = beta (v, j)

		Inf[j] = a / (a + b)

		VERBATIM
		switch (_lj) {
			case 0:
		/* Make sure Tau is not less than the base Tau */
				if ((Tau[_lj] = 1 / (_la + _lb)) < mbasetau) {
					Tau[_lj] = mbasetau;
				}
				Tau[_lj] = Tau[_lj] / _lmqq10;
				break;
			case 1:
				if ((Tau[_lj] = 1 / (_la + _lb)) < hbasetau) {
					Tau[_lj] = hbasetau;
				}
				Tau[_lj] = Tau[_lj] / _lhqq10;
				if (hexp==0) {
					Tau[_lj] = 1.; }
				break;
		}

		ENDVERBATIM
		Mult[j] = exp(-dt/Tau[j])
		Add[j]  = Inf[j]*(1. - exp(-dt/Tau[j]))
	}
} : end PROCEDURE mh (v)

:-------------------------------------------------------------------
FUNCTION alpha(v,j) {
	if (j == 1) {
	   if (hexp==0) {
	     alpha = 1
	   } else {
             alpha = hbaserate * exp((v - (hvhalf+vrest)) * hvalence * hgamma * FRT(htemp)) }
	} else {
          alpha = mbaserate * exp((v - (mvhalf+vrest)) * mvalence * mgamma * FRT(mtemp))
	}
} : end FUNCTION alpha (v,j)

:-------------------------------------------------------------------
FUNCTION beta (v,j) {
	if (j == 1) {
	   if (hexp==0) {
                beta = 1
	   } else {
		beta = hbaserate * exp((-v + (hvhalf+vrest)) * hvalence * (1 - hgamma) * FRT(htemp)) }
	} else {
		beta = mbaserate * exp((-v + (mvhalf+vrest)) * mvalence * (1 - mgamma) * FRT(mtemp))
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
