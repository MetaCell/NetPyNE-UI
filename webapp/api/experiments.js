import Utils from 'root/Utils';

export const getParameters = () => Utils.evalPythonMessage('netpyne_geppetto.getModelAsJson', []);
export const getJsonModel = () => Utils.evalPythonMessage('netpyne_geppetto.getModelAsJson', []);
export const getExperiments = () => Utils.evalPythonMessage('netpyne_geppetto.experiments.get_experiments', []);
export const getExperiment = (name) => Utils.evalPythonMessage('netpyne_geppetto.experiments.get_experiment', [name]);
export const removeExperiment = (name) => Utils.evalPythonMessage('netpyne_geppetto.experiments.remove_experiment', [name]);
export const addExperiment = (name) => Utils.evalPythonMessage('netpyne_geppetto.experiments.add_experiment', [name]);
