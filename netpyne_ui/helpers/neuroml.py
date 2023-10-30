import os
import sys
import logging
from netpyne.specs import simConfig

from pyneuroml import pynml
from pyneuroml.lems import generate_lems_file_for_neuroml
from pyneuroml.pynml import read_neuroml2_file

from netpyne_ui.mod_utils import loadModMechFiles


def convertLEMSSimulation(lemsFileName, compileMod=True):
    """Converts a LEMS Simulation file

    Converts a LEMS Simulation file (https://docs.neuroml.org/Userdocs/LEMSSimulation.html)
    pointing to a NeuroML 2 file into the equivalent in NetPyNE
    Returns:
        simConfig, netParams for the model in NetPyNE
    """
    current_path = os.getcwd()
    try:
        
        fullLemsFileName = os.path.abspath(lemsFileName)
        tmp_path = os.path.dirname(fullLemsFileName) 
        if tmp_path:
            os.chdir(tmp_path)
        logging.info(
            "Importing LEMSSimulation with NeuroML 2 network from: %s"
            % fullLemsFileName
        )

        result = pynml.run_lems_with_jneuroml_netpyne(
            lemsFileName, only_generate_json=True, exit_on_fail=False)
        
        if result == False:
            raise Exception("Error loading lems file")
        lems = pynml.read_lems_file(lemsFileName)

        np_json_fname = fullLemsFileName.replace('.xml','_netpyne_data.json')
    
        return np_json_fname
    finally:
        os.chdir(current_path)




def convertNeuroML2(nml2FileName,  compileMod=True):
    """Loads a NeuroML 2 file into NetPyNE
    Loads a NeuroML 2 file into NetPyNE by creating a new LEMS Simulation
    file (https://docs.neuroml.org/Userdocs/LEMSSimulation.html) and using jNeuroML
    to convert it.

    Returns:
        simConfig, netParams for the model in NetPyNE
    """
    current_path = os.getcwd()
    try:
        fullNmlFileName = os.path.abspath(nml2FileName)
        work_path = os.path.dirname(fullNmlFileName) 
        if not os.path.exists(work_path):
            os.makedirs(work_path)
        os.chdir(work_path)
        sys.path.append(work_path)
        

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
        os.chdir(work_path)
        res = convertLEMSSimulation(lems_file_name, compileMod=compileMod)
    finally:
        os.chdir(current_path)
    return res


if __name__ == "__main__":

    if '-nml' in sys.argv:
        convertNeuroML2("../../NeuroML2/Spikers.net.nml")
    else:
        convertLEMSSimulation("LEMS_HHSimple.xml")
