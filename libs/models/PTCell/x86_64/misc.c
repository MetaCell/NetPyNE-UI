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
 static void _hoc_dassign(void);
 static void _hoc_file_exist(void);
 static void _hoc_hocgetc(void);
 static void _hoc_istmpobj(void);
 static void _hoc_mymalloc(void);
 static void _hoc_now(void);
 static void _hoc_nokill(void);
 static void _hoc_pwd(void);
 static void _hoc_prtime(void);
 static void _hoc_spitchar(void);
 static void _hoc_sleepfor(void);
 static void _hoc_sassign(void);
 static void _hoc_unmalloc(void);
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
 "setdata_misc", _hoc_setdata,
 "dassign", _hoc_dassign,
 "file_exist", _hoc_file_exist,
 "hocgetc", _hoc_hocgetc,
 "istmpobj", _hoc_istmpobj,
 "mymalloc", _hoc_mymalloc,
 "now", _hoc_now,
 "nokill", _hoc_nokill,
 "pwd", _hoc_pwd,
 "prtime", _hoc_prtime,
 "spitchar", _hoc_spitchar,
 "sleepfor", _hoc_sleepfor,
 "sassign", _hoc_sassign,
 "unmalloc", _hoc_unmalloc,
 0, 0
};
 extern double dassign( );
 extern double file_exist( );
 extern double hocgetc( );
 extern double istmpobj( );
 extern double now( );
 extern double prtime( );
 extern double sleepfor( double );
 extern double sassign( );
 /* declare global and static user variables */
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
"misc",
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

 void _misc_reg() {
	int _vectorized = 0;
  _initlists();
 	hoc_register_var(hoc_scdoub, hoc_vdoub, hoc_intfunc);
 	ivoc_help("help ?1 misc /home/adrian/code/geppetto-luna-code/M1NetworkModel/sim/mod/x86_64/misc.mod\n");
 }
static int _reset;
static char *modelname = "";

static int error;
static int _ninits = 0;
static int _match_recurse=1;
static void _modl_cleanup(){ _match_recurse=1;}
static int mymalloc(double);
static int nokill();
static int pwd();
static int spitchar(double);
static int unmalloc();
 
/*VERBATIM*/
#include <unistd.h>     /* F_OK     */
#include <errno.h>      /* errno    */
#include <signal.h>
#include <sys/types.h>         /* MUST REMEMBER THIS */
#include <time.h>
#include <stdio.h>
#include <limits.h>
extern int hoc_is_tempobj(int narg);
 
double file_exist (  ) {
   double _lfile_exist;
 
/*VERBATIM*/
    /* Returns TRUE if file exists, if file not exist the need to reset
       errno else will get a nrnoc error.  Seems to be a problem even
       if I don't include <errno.h> */

    char *gargstr(), *filename;

    filename = gargstr(1);

    if (*filename && !access(filename, F_OK)) {
        _lfile_exist = 1;

    } else {
        /* Errno set to 2 when file not found */
        errno = 0;

        _lfile_exist = 0;
    }
 
return _lfile_exist;
 }
 
static void _hoc_file_exist(void) {
  double _r;
   _r =  file_exist (  );
 hoc_retpushx(_r);
}
 
double istmpobj (  ) {
   double _listmpobj;
 
/*VERBATIM*/
  _listmpobj=hoc_is_tempobj_arg(1);
 
return _listmpobj;
 }
 
static void _hoc_istmpobj(void) {
  double _r;
   _r =  istmpobj (  );
 hoc_retpushx(_r);
}
 
double sassign (  ) {
   double _lsassign;
 
/*VERBATIM*/
    FILE *pipein;
    char string[BUFSIZ], **strname, *syscall;
    char** hoc_pgargstr();

    strname = hoc_pgargstr(1);
    syscall = gargstr(2);

    if( !(pipein = popen(syscall, "r"))) {
        fprintf(stderr,"System call failed\n");
        return 0; 
    }
    
    if (fgets(string,BUFSIZ,pipein) == NULL) {
        fprintf(stderr,"System call did not return a string\n");
        pclose(pipein); return 0;
    }

    /*  assign_hoc_str(strname, string, 0); */
    hoc_assign_str(strname, string);

    pclose(pipein);
    errno = 0;
    return 0;
 
return _lsassign;
 }
 
static void _hoc_sassign(void) {
  double _r;
   _r =  sassign (  );
 hoc_retpushx(_r);
}
 
double dassign (  ) {
   double _ldassign;
 
/*VERBATIM*/
    FILE *pipein, *outfile;
    char *strname, *syscall;
    double num;

    strname = gargstr(1);
    syscall = gargstr(2);

    if ( !(outfile = fopen("dassign","w"))) {
        fprintf(stderr,"Can't open output file dassign\n");
        return 0; 
    }

    if( !(pipein = popen(syscall, "r"))) {
        fprintf(stderr,"System call failed\n");
        fclose(outfile); return 0; 
    }
    
    if (fscanf(pipein,"%lf",&num) != 1) {
        fprintf(stderr,"System call did not return a number\n");
        fclose(outfile); pclose(pipein); return 0; 
    }

    fprintf(outfile,"%s=%g\n",strname,num);
    fprintf(outfile,"system(\"rm dassign\")\n");

    fclose(outfile); pclose(pipein);
    errno = 0;
    return 0;
 
return _ldassign;
 }
 
static void _hoc_dassign(void) {
  double _r;
   _r =  dassign (  );
 hoc_retpushx(_r);
}
 
static int  nokill (  ) {
   
/*VERBATIM*/
  signal(SIGHUP, SIG_IGN);
  return 0; }
 
static void _hoc_nokill(void) {
  double _r;
   _r = 1.;
 nokill (  );
 hoc_retpushx(_r);
}
 
double prtime (  ) {
   double _lprtime;
 
/*VERBATIM*/
_lprtime = clock();
 
return _lprtime;
 }
 
static void _hoc_prtime(void) {
  double _r;
   _r =  prtime (  );
 hoc_retpushx(_r);
}
 
double now (  ) {
   double _lnow;
 
/*VERBATIM*/
  _lnow = time((time_t*)0);
  _lnow -= (12784) * 24*60*60; // time from the Epoch to 01/01/05
 
return _lnow;
 }
 
static void _hoc_now(void) {
  double _r;
   _r =  now (  );
 hoc_retpushx(_r);
}
 
double sleepfor (  double _lsec ) {
   double _lsleepfor;
 
/*VERBATIM*/
  struct timespec ts;
  ts.tv_sec = (time_t)_lsec;
  ts.tv_nsec = ifarg(2)?(long)*getarg(2):(long)0;
  return (double) nanosleep(&ts,(struct timespec*)0);
 
return _lsleepfor;
 }
 
static void _hoc_sleepfor(void) {
  double _r;
   _r =  sleepfor (  *getarg(1) );
 hoc_retpushx(_r);
}
 
static int  spitchar (  double _lc ) {
   
/*VERBATIM*/
{	
  printf("%c", (int)_lc);
}
  return 0; }
 
static void _hoc_spitchar(void) {
  double _r;
   _r = 1.;
 spitchar (  *getarg(1) );
 hoc_retpushx(_r);
}
 
/*VERBATIM*/
static char *pmlc;
 
static int  mymalloc (  double _lsz ) {
   
/*VERBATIM*/
{ 
  size_t x,y;
  x=(size_t)_lsz;
  pmlc=(char *)malloc(x);
  printf("Did %ld: %x\n",x,pmlc);
  y=(unsigned int)_lsz-1;
  pmlc[y]=(char)97;
  printf("WRITE/READ 'a': "); 
  printf("%c\n",pmlc[y]);
  if (ifarg(2)) free(pmlc); else printf("Use unmalloc() to free memory\n");
}
  return 0; }
 
static void _hoc_mymalloc(void) {
  double _r;
   _r = 1.;
 mymalloc (  *getarg(1) );
 hoc_retpushx(_r);
}
 
static int  unmalloc (  ) {
   
/*VERBATIM*/
  free(pmlc);
  return 0; }
 
static void _hoc_unmalloc(void) {
  double _r;
   _r = 1.;
 unmalloc (  );
 hoc_retpushx(_r);
}
 
double hocgetc (  ) {
   double _lhocgetc;
 
/*VERBATIM*/
{	
  FILE* f, *hoc_obj_file_arg();
  f = hoc_obj_file_arg(1);
  _lhocgetc = (double)getc(f);
}
 
return _lhocgetc;
 }
 
static void _hoc_hocgetc(void) {
  double _r;
   _r =  hocgetc (  );
 hoc_retpushx(_r);
}
 
static int  pwd (  ) {
   
/*VERBATIM*/
  {char cwd[1000],cmd[1200];
  getcwd(cwd, 1000);
  sprintf(cmd, "execute1(\"strdef cwd\")\n");         hoc_oc(cmd);
  sprintf(cmd, "execute1(\"cwd=\\\"%s\\\"\")\n",cwd); hoc_oc(cmd);
  }
  return 0; }
 
static void _hoc_pwd(void) {
  double _r;
   _r = 1.;
 pwd (  );
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
