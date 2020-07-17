from netpyne import specs

# Network parameters
netParams = specs.NetParams()  # object of class NetParams to store the network parameters

## Population parameters
netParams.popParams['E'] = {'cellType': 'pyr', 'numCells': 20, 'cellModel':'hh'}

## Cell property rules
cellRule = {'conds': {'cellType': 'pyr'},  'secs': {}} 	# cell rule dict
cellRule['secs']['soma'] = {'geom': {}, 'mechs': {}}  											# soma params dict
cellRule['secs']['soma']['geom'] = {'diam': 20, 'L': 20, 'Ra': 100.0, 'cm':1}  									# soma geometry
cellRule['secs']['soma']['mechs']['hh'] = {'gnabar': 0.12, 'gkbar': 0.036, 'gl': 0.003, 'el': -70}  		# soma hh mechanisms
cellRule['secs']['dend'] = {'geom': {}, 'topol': {}, 'mechs': {}}  								# dend params dict
cellRule['secs']['dend']['geom'] = {'diam': 5.0, 'L': 150.0, 'Ra': 100.0, 'cm': 1}							# dend geometry
cellRule['secs']['dend']['topol'] = {'parentSec': 'soma', 'parentX': 1.0, 'childX': 0}						# dend topology 
cellRule['secs']['dend']['mechs']['pas'] = {'g': 0.0004, 'e': -70} 										# dend mechanisms
netParams.cellParams['pyr_rule'] = cellRule  												# add dict to list of cell parameters


 # Stimulation parameters
netParams.stimSourceParams['Source'] = {'type': 'IClamp', 'dur': 10, 'del': 20, 'amp':0.1}
netParams.stimTargetParams['IClamp->0'] = {'source': 'Source', 'conds': {'pop': 'E', 'cellList':[0]}, 'sec':'dend', 'loc':1.0}


# Synaptic mechanism parameters
netParams.synMechParams['exc'] = {'mod': 'Exp2Syn', 'tau1': 0.1, 'tau2': 1.0, 'e': 0}


# Connectivity parameters
netParams.connParams['E->E'] = {
    'preConds': {'pop': 'E'}, 'postConds': {'pop': 'E'},
    'weight': 0.002,                    # weight of each connection
    'delay': 5,     # delay min=0.2, mean=13.0, var = 1.4
    'synMech': 'exc',
    'probability': 0.3}    # convergence (num presyn targeting postsyn) is uniformly distributed between 1 and 15


# Simulation options
simConfig = specs.SimConfig()		# object of class SimConfig to store simulation configuration

simConfig.duration = 0.2*1e3 			# Duration of the simulation, in ms
simConfig.dt = 0.025 				# Internal integration timestep to use
simConfig.verbose = False  			# Show detailed messages 
simConfig.recordTraces = {'V_soma':{'sec':'soma','loc':0.5,'var':'v'}}  # Dict with traces to record
simConfig.recordStep = 1 			# Step size in ms to save data (eg. V traces, LFP, etc)
simConfig.filename = 'model_output'  # Set file output name
simConfig.savePickle = False 		# Save params, network and sim output to pickle file

simConfig.analysis['plotTraces'] = {'include': [0]}
