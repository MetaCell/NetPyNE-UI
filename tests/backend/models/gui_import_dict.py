from netpyne import specs

# Network parameters
netParams = {} # object of class NetParams to store the network parameters

netParams['cellParams'] = {}
netParams['popParams'] = {}
netParams['stimSourceParams'] = {}
netParams['stimTargetParams'] = {}
netParams['synMechParams'] = {}
netParams['connParams'] = {}

## Cell parameters
secs = {}	# dict with section info
secs['soma'] = {'geom': {}, 'mechs': {}}
secs['soma']['geom'] = {'diam': 12, 'L': 12, 'Ra': 100.0, 'cm': 1}  	 						# soma geometry
secs['soma']['mechs']['hh'] = {'gnabar': 0.12, 'gkbar': 0.036, 'gl': 0.0003, 'el': -54.3} 		# soma hh mechanism

secs['dend'] = {'geom': {}, 'mechs': {}}
secs['dend']['geom'] = {'diam': 1.0, 'L': 200.0, 'Ra': 100.0, 'cm': 1}
secs['dend']['topol'] = {'parentSec': 'soma', 'parentX': 1.0, 'childX': 0}						# dend geometry
secs['dend']['mechs']['pas'] = {'g': 0.001, 'e': -70} 		 		                            # dend pas mechanism

netParams['cellParams']['pyr'] = {'secs': secs}  												    # add dict to list of cell parameters
	
## Population parameters
netParams['popParams']['E'] = {'cellType': 'pyr', 'numCells': 40}

 # Stimulation parameters
netParams['stimSourceParams']['IClamp1'] = {'type': 'IClamp', 'dur': 5, 'del': 20, 'amp': 0.1}
netParams['stimTargetParams']['IClamp1->cell0'] = {'source': 'IClamp1', 'conds': {'cellList':[0]}, 'sec':'dend', 'loc':1.0}


# Synaptic mechanism parameters
netParams['synMechParams']['exc'] = {'mod': 'Exp2Syn', 'tau1': 0.1, 'tau2': 1.0, 'e': 0}


# Connectivity parameters
netParams['connParams']['E->E'] = {
    'preConds': {'pop': 'E'},
    'postConds': {'pop': 'E'},
    'weight': 0.005,                    # weight of each connection
    'probability': 0.1,
    'delay': 5,     # delay min=0.2, mean=13.0, var = 1.4
    'synMech': 'exc',
    'sec': 'dend'}

# Simulation options
simConfig = specs.SimConfig()		# object of class SimConfig to store simulation configuration

simConfig.duration = 0.2*1e3 			# Duration of the simulation, in ms
simConfig.dt = 0.1 				# Internal integration timestep to use
simConfig.verbose = False  			# Show detailed messages 
simConfig.recordTraces = {'V_soma':{'sec':'soma','loc':0.5,'var':'v'},
						 'V_dend': {'sec': 'dend', 'loc': 1.0, 'var':'v'}}  # Dict with traces to record
simConfig.recordCells = [0]
simConfig.recordStep = 0.1 			# Step size in ms to save data (eg. V traces, LFP, etc)
simConfig.filename = 'gui_tut1'  # Set file output name
simConfig.saveJson = False		# Save params, network and sim output to pickle file
simConfig.analysis['iplotTraces'] = {'include': [0], 'overlay': True}
simConfig.analysis['iplotRaster'] = {'markerSize': 5, 'showFig': True}
 

if __name__ == '__main__':
    netpyne_geppetto.netParams=netParams
    netpyne_geppetto.simConfig=simConfig

#from netpyne import sim
#sim.createSimulateAnalyze(netParams, simConfig)
