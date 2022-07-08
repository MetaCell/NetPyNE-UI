import os
import sys
import logging
from netpyne.specs import simConfig

from pyneuroml import pynml
from pyneuroml.lems import generate_lems_file_for_neuroml
from pyneuroml.pynml import read_neuroml2_file

from netpyne_ui.mod_utils import loadModMechFiles


def convertAndImportLEMSSimulation(lemsFileName, compileMod=True):
    """Converts a LEMS Simulation file

    Converts a LEMS Simulation file (https://docs.neuroml.org/Userdocs/LEMSSimulation.html)
    pointing to a NeuroML 2 file into the equivalent in NetPyNE
    Returns:
        simConfig, netParams for the model in NetPyNE
    """
    fullLemsFileName = os.path.abspath(lemsFileName)

    logging.info(
        "Importing LEMSSimulation with NeuroML 2 network from: %s"
        % fullLemsFileName
    )

    result = pynml.run_lems_with_jneuroml_netpyne(
        lemsFileName, only_generate_json=True, exit_on_fail=False)
    
    if result == False:
        raise Exception("Error loading lems file")
    lems = pynml.read_lems_file(lemsFileName)

    np_json_fname = os.path.basename(lemsFileName.replace('.xml','_netpyne_data.json'))
   
    from netpyne import sim
    loadModMechFiles(False, os.path.dirname(np_json_fname)) 
    sim.initialize()
    sim.loadAll(np_json_fname, instantiate=False)
    netParams = sim.net.params
    simConfig = sim.cfg

    return simConfig, netParams




def convertAndImportNeuroML2(nml2FileName,  compileMod=True):
    """Loads a NeuroML 2 file into NetPyNE
    Loads a NeuroML 2 file into NetPyNE by creating a new LEMS Simulation
    file (https://docs.neuroml.org/Userdocs/LEMSSimulation.html) and using jNeuroML
    to convert it.

    Returns:
        simConfig, netParams for the model in NetPyNE
    """
    current_path = os.getcwd()
    try:
        tmp_path = os.path.join(nml2FileName + "_files") 
        if not os.path.exists(tmp_path):
            os.makedirs(tmp_path)
        os.chdir(tmp_path)
        sys.path.append(tmp_path)
        fullNmlFileName = os.path.abspath(nml2FileName)

        logging.info(
                "Importing NeuroML 2 network from: %s"
                % fullNmlFileName
            )
        nml_model = read_neuroml2_file(fullNmlFileName)

        target = nml_model.networks[0].id
        sim_id = "Sim_%s" % target
        duration = 1000
        dt = 0.025
        lems_file_name = os.path.join(os.path.dirname(fullNmlFileName), "LEMS_%s.xml" % sim_id)
        lems_file_name = "LEMS_%s.xml" % sim_id
        target_dir = os.path.dirname(fullNmlFileName)
        target_dir = "."

        generate_lems_file_for_neuroml(
            sim_id,
            fullNmlFileName,
            target,
            duration,
            dt,
            lems_file_name,
            target_dir,
            include_extra_files=["PyNN.xml"],
            gen_plots_for_all_v=True,
            plot_all_segments=False,
            gen_plots_for_quantities={},  # Dict with displays vs lists of quantity paths
            gen_plots_for_only_populations=[],  # List of populations, all pops if = []
            gen_saves_for_all_v=True,
            save_all_segments=False,
            gen_saves_for_only_populations=[],  # List of populations, all pops if = []
            gen_saves_for_quantities={},  # Dict with file names vs lists of quantity paths
            gen_spike_saves_for_all_somas=True,
            report_file_name="report.txt",
            copy_neuroml=True,
            verbose=True,
        )
        os.chdir(tmp_path)
        res = convertAndImportLEMSSimulation(lems_file_name, compileMod=compileMod)
    finally:
        os.chdir(current_path)
    return res


if __name__ == "__main__":

    if '-nml' in sys.argv:
        convertAndImportNeuroML2("../../NeuroML2/Spikers.net.nml")
    else:
        convertAndImportLEMSSimulation("LEMS_HHSimple.xml")
