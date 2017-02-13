/* Created by Language version: 6.2.0 */
/* NOT VECTORIZED */
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "scoplib_ansi.h"
#undef PI
#define nil 0
#include "md1redef.h"
#include "section.h"
#include "nrniv_mf.h"
#include "md2redef.h"
 
#if METHOD3
extern int _method3;
#endif

#if !NRNGPU
#undef exp
#define exp hoc_Exp
extern double hoc_Exp(double);
#endif
 
#define _threadargscomma_ /**/
#define _threadargs_ /**/
 
#define _threadargsprotocomma_ /**/
#define _threadargsproto_ /**/
 	/*SUPPRESS 761*/
	/*SUPPRESS 762*/
	/*SUPPRESS 763*/
	/*SUPPRESS 765*/
	 extern double *getarg();
 static double *_p; static Datum *_ppvar;
 
#define t nrn_threads->_t
#define dt nrn_threads->_dt
 
#if MAC
#if !defined(v)
#define v _mlhv
#endif
#if !defined(h)
#define h _mlhh
#endif
#endif
 
#if defined(__cplusplus)
extern "C" {
#endif
 static int hoc_nrnpointerindex =  -1;
 /* external NEURON variables */
 /* declaration of user functions */
 static void _hoc_LDist(void);
 static void _hoc_MeanCutDist(void);
 static void _hoc_SpikeTrainEditDist(void);
 static void _hoc_StupidCopy(void);
 static void _hoc_SpikeTrainCoinc(void);
 static void _hoc_install(void);
 static int _mechtype;
extern void _nrn_cacheloop_reg(int, int);
extern void hoc_register_prop_size(int, int, int);
extern void hoc_register_limits(int, HocParmLimits*);
extern void hoc_register_units(int, HocParmUnits*);
extern void nrn_promote(Prop*, int, int);
extern Memb_func* memb_func;
 extern void _nrn_setdata_reg(int, void(*)(Prop*));
 static void _setdata(Prop* _prop) {
 _p = _prop->param; _ppvar = _prop->dparam;
 }
 static void _hoc_setdata() {
 Prop *_prop, *hoc_getdata_range(int);
 _prop = hoc_getdata_range(_mechtype);
   _setdata(_prop);
 hoc_retpushx(1.);
}
 /* connect user functions to hoc names */
 static VoidFunc hoc_intfunc[] = {
 "setdata_sn", _hoc_setdata,
 "LDist_sn", _hoc_LDist,
 "MeanCutDist_sn", _hoc_MeanCutDist,
 "SpikeTrainEditDist_sn", _hoc_SpikeTrainEditDist,
 "StupidCopy_sn", _hoc_StupidCopy,
 "SpikeTrainCoinc_sn", _hoc_SpikeTrainCoinc,
 "install_sn", _hoc_install,
 0, 0
};
#define LDist LDist_sn
#define MeanCutDist MeanCutDist_sn
#define SpikeTrainEditDist SpikeTrainEditDist_sn
#define StupidCopy StupidCopy_sn
#define SpikeTrainCoinc SpikeTrainCoinc_sn
 extern double LDist( );
 extern double MeanCutDist( );
 extern double SpikeTrainEditDist( );
 extern double StupidCopy( );
 extern double SpikeTrainCoinc( );
 /* declare global and static user variables */
#define CITYBLOCK CITYBLOCK_sn
 double CITYBLOCK = 2;
#define EUCLIDEAN EUCLIDEAN_sn
 double EUCLIDEAN = 0;
#define INSTALLED INSTALLED_sn
 double INSTALLED = 0;
#define SQDIFF SQDIFF_sn
 double SQDIFF = 1;
 /* some parameters have upper and lower limits */
 static HocParmLimits _hoc_parm_limits[] = {
 0,0,0
};
 static HocParmUnits _hoc_parm_units[] = {
 0,0
};
 static double v = 0;
 /* connect global user variables to hoc */
 static DoubScal hoc_scdoub[] = {
 "INSTALLED_sn", &INSTALLED_sn,
 "EUCLIDEAN_sn", &EUCLIDEAN_sn,
 "SQDIFF_sn", &SQDIFF_sn,
 "CITYBLOCK_sn", &CITYBLOCK_sn,
 0,0
};
 static DoubVec hoc_vdoub[] = {
 0,0,0
};
 static double _sav_indep;
 static void nrn_alloc(Prop*);
static void  nrn_init(_NrnThread*, _Memb_list*, int);
static void nrn_state(_NrnThread*, _Memb_list*, int);
 /* connect range variables in _p that hoc is supposed to know about */
 static const char *_mechanism[] = {
 "6.2.0",
"sn",
 0,
 0,
 0,
 0};
 
extern Prop* need_memb(Symbol*);

static void nrn_alloc(Prop* _prop) {
	Prop *prop_ion;
	double *_p; Datum *_ppvar;
 	_p = nrn_prop_data_alloc(_mechtype, 0, _prop);
 	/*initialize range parameters*/
 	_prop->param = _p;
 	_prop->param_size = 0;
 
}
 static void _initlists();
 extern Symbol* hoc_lookup(const char*);
extern void _nrn_thread_reg(int, int, void(*f)(Datum*));
extern void _nrn_thread_table_reg(int, void(*)(double*, Datum*, Datum*, _NrnThread*, int));
extern void hoc_register_tolerance(int, HocStateTolerance*, Symbol***);
extern void _cvode_abstol( Symbol**, double*, int);

 void _samnutils_reg() {
	int _vectorized = 0;
  _initlists();
 	register_mech(_mechanism, nrn_alloc,(void*)0, (void*)0, (void*)0, nrn_init, hoc_nrnpointerindex, 0);
 _mechtype = nrn_get_mechtype(_mechanism[1]);
     _nrn_setdata_reg(_mechtype, _setdata);
  hoc_register_prop_size(_mechtype, 0, 0);
 	hoc_register_var(hoc_scdoub, hoc_vdoub, hoc_intfunc);
 	ivoc_help("help ?1 sn /home/adrian/code/geppetto-luna-code/M1NetworkModel/sim/mod/x86_64/samnutils.mod\n");
 hoc_register_limits(_mechtype, _hoc_parm_limits);
 hoc_register_units(_mechtype, _hoc_parm_units);
 }
static int _reset;
static char *modelname = "";

static int error;
static int _ninits = 0;
static int _match_recurse=1;
static void _modl_cleanup(){ _match_recurse=1;}
static int install();
 
/*VERBATIM*/
#include "misc.h"
double DMIN(double d1,double d2){
  return d1 < d2 ? d1 : d2;
}

int IMIN(int i1,int i2){
  return i1 < i2 ? i1 : i2;
}

static double multall(void* vv){
  double* pv, dval=0.0;
  int n = vector_instance_px(vv,&pv) , idx = 0;
  if(n<1){
    printf("multall ERRA: vector size < 1!\n");
    return 0.0;
  }
  dval=pv[0];
  for(idx=1;idx<n;idx++) dval*=pv[idx]; 
  return dval;
}


//this = output of 1.0s and 0.0s by OR'ing input
//arg1 = vec1 of 1.0s and 0.0s
//arg2 = vec2 of 1.0s and 0.0s
static double V_OR(void* vv){
  double* pV1,*pV2,*pV3;
  int n = vector_instance_px(vv,&pV1);

  if(vector_arg_px(1,&pV2)!=n || vector_arg_px(2,&pV3)!=n){
    printf("V_OR ERRA: vecs must have same size %d!",n);
    return 0.0;
  }

  int i;
  for(i=0;i<n;i++){
    pV1[i] = (pV2[i] || pV3[i]) ? 1.0 : 0.0;
  }

  return 1.0;
}

// moving average smoothing
//  vec.smooth(vecout, smooth size)
static double smooth (void* vv) {
  int i, j, k, winsz, sz;
  double s, cnt;
  double* pV1,*pV2;
  if(!ifarg(1)) { printf("vec.smooth(vecout, smooth size)\n"); return 0.0; }
  sz = vector_instance_px(vv,&pV1);
  if(vector_arg_px(1,&pV2)!=sz) {
    printf("smooth ERRA: vecs must have same size %d!",sz);
    return 0.0;
  }
  if( (winsz = (int) *getarg(2)) < 1) {
    printf("smooth ERRB: winsz must be >= 1: %d\n",winsz);
    return 0.0;
  }
  for(i=0;i<winsz;i++) pV2[i]=pV1[i];
  cnt = winsz;
  i = 0;
  j = winsz - 1;
  s = 0.0;
  for(k=i;k<=j;k++) s += pV1[k];
  while(j < sz) {
    pV2[j] = s / cnt;
    s -= pV1[i];
    i++;
    j++;
    s += pV1[j];
  }
  return 1.0;
}

static double poscount(void* vv){
  double* pV;
  int iSz = vector_instance_px(vv,&pV) , i = 0, iCount = 0;
  for(i=0;i<iSz;i++) if(pV[i]>0.0) iCount++;
  return (double)iCount;
}

//this = output spike times
//arg1 = input voltage
//arg2 = voltage threshold for spike
//arg3 = min interspike time - uses dt for calculating time
//arg4 = dt - optional
static double GetSpikeTimes(void* vv) {
  double* pVolt , *pSpikeTimes;
  int n = vector_instance_px(vv, &pSpikeTimes);

  int tmp = vector_arg_px(1,&pVolt);

  if(tmp!=n){
    printf("GetSpikeTimes ERRA: output times vec has diff size %d %d\n",n,tmp);
    return 0.0;
  }  

  double dThresh = *getarg(2);
  double dMinTime = *getarg(3);
  double dDipThresh = 1.5 * dThresh;
  double loc_dt = ifarg(4)?*getarg(4):dt;

  if(0) printf("dt = %f\n",dt);

  int i , iSpikes = 0;

  for( i = 0; i < n; i++){
    double dVal = pVolt[i];

    if(dVal >= dThresh) { //is v > threshold?
      if(iSpikes > 0) { //make sure at least $4 time has passed
        if(loc_dt*i - pSpikeTimes[iSpikes-1] < dMinTime) {
          continue;
        }
      }

      while( i + 1 < n ) { //get peak of spike
        if( pVolt[i] > pVolt[i+1] ) {
          break;
        }
        i++;
      }
      pSpikeTimes[iSpikes++] = loc_dt * i;//store spike location

      while( i < n ) { //must dip down sufficiently
        if(pVolt[i] <= dDipThresh) {
          break;
        }
        i++;
      }
    }
  }

  vector_resize(vv, iSpikes); // set to # of spikes

  return (double) iSpikes;
}

static double countdbl(double* p,int iStartIDX,int iEndIDX,double dval) {
  int idx = iStartIDX, iCount = 0;
  for(;idx<=iEndIDX;idx++) if(p[idx]==dval) iCount++;
  return iCount;
}
 
double MeanCutDist (  ) {
   double _lMeanCutDist;
 
/*VERBATIM*/
  double* p1, *p2, *p3;

  int n = vector_arg_px(1,&p1);
  if(n != vector_arg_px(2,&p2) || n != vector_arg_px(3,&p3)){
    printf("MeanCutDist ERRA: vecs must be same size!\n");
    return -1.0;
  }

  int i , iCount = 0;

  double dSum = 0.0 , dVal = 0.0;

  for(i=0;i<n;i++){
    if(p3[i]) continue;
    dVal = p1[i] - p2[i];
    dVal *= dVal;
    dSum += dVal;
    iCount++;
  }

  if(iCount > 0){
    dSum /= (double) iCount;
    return dSum;
  }

  printf("MeanCutDist WARNINGA: no sums taken\n ");

  return -1.0;

 
return _lMeanCutDist;
 }
 
static void _hoc_MeanCutDist(void) {
  double _r;
   _r =  MeanCutDist (  );
 hoc_retpushx(_r);
}
 
double LDist (  ) {
   double _lLDist;
 
/*VERBATIM*/

  Object* pList1 = *hoc_objgetarg(1);
  Object* pList2 = *hoc_objgetarg(2);

  if(!IsList(pList1) || !IsList(pList2)){
    printf("LDist ERRA: Arg 1 & 2 must be Lists!\n");
    return -1.0;
  }

  int iListSz1 = ivoc_list_count(pList1),
      iListSz2 = ivoc_list_count(pList2);

  if(iListSz1 != iListSz2 || iListSz1 < 1){
    printf("LDist ERRB: Lists must have same > 0 size %d %d\n",iListSz1,iListSz2);
    return -1.0;
  }

  double** ppVecs1, **ppVecs2;

  ppVecs1 = (double**) malloc(sizeof(double*)*iListSz1);
  ppVecs2 = (double**) malloc(sizeof(double*)*iListSz2); 

  if(!ppVecs1 || !ppVecs2){
    printf("LDist ERRRC: out of memory!\n");
    if(ppVecs1) free(ppVecs1);
    if(ppVecs2) free(ppVecs2);
    return -1.0;
  }

  int iVecSz1 = list_vector_px(pList1,0,&ppVecs1[0]);
  int iVecSz2 = list_vector_px(pList2,0,&ppVecs2[0]);

  if(iVecSz1 != iVecSz2){
    free(ppVecs1); free(ppVecs2);
    printf("LDist ERRD: vectors must have same size %d %d!\n",iVecSz1,iVecSz2);
    return -1.0;
  }

  int i;

  for(i=1;i<iListSz1;i++){
    int iTmp1 = list_vector_px(pList1,i,&ppVecs1[i]);
    int iTmp2 = list_vector_px(pList2,i,&ppVecs2[i]);
    if(iTmp1 != iVecSz1 || iTmp2 != iVecSz1){
      free(ppVecs1); free(ppVecs2);
      printf("LDist ERRD: vectors must have same size %d %d %d \n",iVecSz1,iTmp1,iTmp2);
      return -1.0;
    }
  }

  int j; double dDist = 0.0; double dVal = 0.0; double dSum = 0.0;
  int iType = 0;

  if(ifarg(3)) iType = *getarg(3);
  
  if(iType == EUCLIDEAN){ //euclidean
    for(i=0;i<iVecSz1;i++){ 
      dSum = 0.0;
      for(j=0;j<iListSz1;j++){
        dVal = ppVecs1[j][i]-ppVecs2[j][i];
        dVal *= dVal;
        dSum += dVal;
      }
      dDist += sqrt(dSum);
    }
  } else if(iType == SQDIFF){ //squared diff
    for(i=0;i<iVecSz1;i++){
      dSum = 0.0;
      for(j=0;j<iListSz1;j++){
        dVal = ppVecs1[j][i]-ppVecs2[j][i];
        dVal *= dVal;
        dSum += dVal;
      }
      dDist += dSum;
    }   
  } else if(iType == CITYBLOCK){ //city block (abs diff)
    for(i=0;i<iVecSz1;i++){
      dSum = 0.0;
      for(j=0;j<iListSz1;j++){
        dVal = ppVecs1[j][i]-ppVecs2[j][i];
        dSum += dVal >= 0.0 ? dVal : -dVal;
      }
      dDist += dSum;
    }
  } else {
    printf("LDist ERRE: invalid distance type %d!\n",iType);
    return -1.0;
  }

  free(ppVecs1);
  free(ppVecs2);

  return dDist;

 
return _lLDist;
 }
 
static void _hoc_LDist(void) {
  double _r;
   _r =  LDist (  );
 hoc_retpushx(_r);
}
 
double SpikeTrainCoinc (  ) {
   double _lSpikeTrainCoinc;
 
/*VERBATIM*/

  double* pVec1, *pVec2;
  int iSz1 = vector_arg_px(1,&pVec1);
  int iSz2 = vector_arg_px(2,&pVec2);

  double dErr = -666.0;

  if(!pVec1 || !pVec2){
    printf("SpikeTrainCoinc ERRA: Can't get vec args 1 & 2!\n");
    return dErr;
  }

  if(iSz1 == 0 && iSz2 == 0){
    printf("SpikeTrainCoinc WARNA: both spike trains size of 0\n");
    return 0.0;
  }

  double dBinSize = *getarg(3);
  if(dBinSize <= 0.0){
    printf("SpikeTrainCoinc ERRB: bin size must be > 0.0!\n");
    return dErr;
  }

  double dStimDur = *getarg(4);
  if(dStimDur <= 0.0){
    printf("SpikeTrainCoinc ERRC: stim dur must be > 0.0!\n");
    return dErr;
  }

  double dNumBins = dStimDur / dBinSize; //K

  int i = 0 , j = 0;

  int iCoinc = 0; //

  double dThresh = 2.0;

  for(i=0;i<iSz1;i++){
    for(j=0;j<iSz2;j++){
      if( fabs(pVec1[i]-pVec2[i]) <= dThresh){
        iCoinc++;
        break;
      }
    }
  }

  double dN = 1.0 - ( (double) iSz1) / dNumBins;
         dN = 1.0 / dN;

  double dRandCoinc = (iSz1 * iSz2) / dNumBins; // avg coinc from poisson spike train <Ncoinc> 

  return dN * ((((double)iCoinc) - dRandCoinc) / ((iSz1+iSz2)/2.0));

 
return _lSpikeTrainCoinc;
 }
 
static void _hoc_SpikeTrainCoinc(void) {
  double _r;
   _r =  SpikeTrainCoinc (  );
 hoc_retpushx(_r);
}
 
double StupidCopy (  ) {
   double _lStupidCopy;
 
/*VERBATIM*/
  double* pDest,*pSrc;
  int iSz1 = vector_arg_px(1,&pDest);
  int iSz2 = vector_arg_px(2,&pSrc);
  int iSrcStart = *getarg(3);
  int iSrcEnd = *getarg(4);
  int i,j = 0;
  for(i=iSrcStart;i<iSrcEnd;i++,j++){
    pDest[j] = pSrc[i];
  }
  return 1.0;
 
return _lStupidCopy;
 }
 
static void _hoc_StupidCopy(void) {
  double _r;
   _r =  StupidCopy (  );
 hoc_retpushx(_r);
}
 
double SpikeTrainEditDist (  ) {
   double _lSpikeTrainEditDist;
 
/*VERBATIM*/
  double* pVec1=0x0, *pVec2=0x0;
  int iSz1 = vector_arg_px(1,&pVec1);
  int iSz2 = vector_arg_px(2,&pVec2);
  if(!pVec1 || !pVec2){
    printf("SpikeTrainEditDist ERRA: Can't get vec args 1 & 2!\n");
    return -1.0;
  }
  double dMoveCost = ifarg(3) ? *getarg(3) : 0.1;
  if(dMoveCost < 0.0){
    printf("SpikeTrainEditDist ERRB: move cost must be >= 0!\n");
    return -1.0;
  }
  double dDelCost = ifarg(4) ? *getarg(4) : 1.0;
  if(dDelCost < 0.0){
    printf("SpikeTrainEditDist ERRC: delete cost must be >= 0!\n");
    return -1.0;
  }  

  if(dMoveCost == 0.0) return fabs(iSz1-iSz2) * dDelCost;
  else if(dMoveCost >= 9e24) return (double)(iSz1 + iSz2) * dDelCost;

  if(iSz1 < 1) return (double)(iSz2 * dDelCost);
  else if(iSz2 < 1) return (double)(iSz1 * dDelCost);

  double** dtab = (double**) malloc(sizeof(double*) * (iSz1+1));
  if(!dtab){
    printf("SpikeTrainEditDist ERRD: out of memory!\n");
    return -1.0;
  }
  int row,col;
  for(row = 0; row < iSz1 + 1; row += 1){
    dtab[row] = (double*) malloc(sizeof(double)*(iSz2+1));
    if(!dtab[row]){
      printf("SpikeTrainEditDist ERRE: out of memory!\n");
      int trow;
      for(trow=0;trow<row;trow++) free(dtab[trow]);
      free(dtab);
      return -1.0;
    }
    memset(dtab[row],0,sizeof(double)*(iSz2+1));
  }
  for(row = 0; row < iSz1 + 1; row += 1) dtab[row][0] = (double)(row * dDelCost);

  for(col = 0; col < iSz2 + 1; col += 1)  dtab[0][col] = (double)(col * dDelCost);

  for( row = 1; row < iSz1 + 1; row += 1){
    for(col = 1; col < iSz2 + 1; col += 1){
      dtab[row][col]= DMIN(  DMIN(dtab[row-1][col]+dDelCost,dtab[row][col-1]+dDelCost),     /* deletion/insertion cost */
                                              dtab[row-1][col-1]+dMoveCost*fabs(pVec1[row-1]-pVec2[col-1])); /* move cost */
    }
  }
  double dTotalCost = dtab[iSz1][iSz2];
  for(row=0;row<iSz1+1;row++) free(dtab[row]);
  free(dtab);
  return dTotalCost;
 
return _lSpikeTrainEditDist;
 }
 
static void _hoc_SpikeTrainEditDist(void) {
  double _r;
   _r =  SpikeTrainEditDist (  );
 hoc_retpushx(_r);
}
 
static int  install (  ) {
   if ( INSTALLED  == 1.0 ) {
     }
   else {
     INSTALLED = 1.0 ;
     
/*VERBATIM*/
 install_vector_method("GetSpikeTimes" ,GetSpikeTimes);
 install_vector_method("V_OR",V_OR);
 install_vector_method("poscount" ,poscount);
 install_vector_method("multall" ,multall);
 install_vector_method("smooth",smooth);
 }
    return 0; }
 
static void _hoc_install(void) {
  double _r;
   _r = 1.;
 install (  );
 hoc_retpushx(_r);
}

static void initmodel() {
  int _i; double _save;_ninits++;
{

}
}

static void nrn_init(_NrnThread* _nt, _Memb_list* _ml, int _type){
Node *_nd; double _v; int* _ni; int _iml, _cntml;
#if CACHEVEC
    _ni = _ml->_nodeindices;
#endif
_cntml = _ml->_nodecount;
for (_iml = 0; _iml < _cntml; ++_iml) {
 _p = _ml->_data[_iml]; _ppvar = _ml->_pdata[_iml];
#if CACHEVEC
  if (use_cachevec) {
    _v = VEC_V(_ni[_iml]);
  }else
#endif
  {
    _nd = _ml->_nodelist[_iml];
    _v = NODEV(_nd);
  }
 v = _v;
 initmodel();
}}

static double _nrn_current(double _v){double _current=0.;v=_v;{
} return _current;
}

static void nrn_state(_NrnThread* _nt, _Memb_list* _ml, int _type){
 double _break, _save;
Node *_nd; double _v; int* _ni; int _iml, _cntml;
#if CACHEVEC
    _ni = _ml->_nodeindices;
#endif
_cntml = _ml->_nodecount;
for (_iml = 0; _iml < _cntml; ++_iml) {
 _p = _ml->_data[_iml]; _ppvar = _ml->_pdata[_iml];
 _nd = _ml->_nodelist[_iml];
#if CACHEVEC
  if (use_cachevec) {
    _v = VEC_V(_ni[_iml]);
  }else
#endif
  {
    _nd = _ml->_nodelist[_iml];
    _v = NODEV(_nd);
  }
 _break = t + .5*dt; _save = t;
 v=_v;
{
}}

}

static void terminal(){}

static void _initlists() {
 int _i; static int _first = 1;
  if (!_first) return;
_first = 0;
}
