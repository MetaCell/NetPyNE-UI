import os
import sys
import logging

from pyneuroml import pynml
from pyneuroml.lems import generate_lems_file_for_neuroml
from pyneuroml.pynml import read_neuroml2_file

from netpyne_ui.mod_utils import compileModMechFiles


def convertAndImportLEMSSimulation(lemsFileName):
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

    pynml.run_lems_with_jneuroml_netpyne(
        lemsFileName, only_generate_scripts=True)

    compileModMechFiles(True, ".")

    netpyne_file = os.path.basename(lemsFileName.replace(".xml", "_netpyne"))
    # sys.path.append(os.path.abspath("workspace"))
    NetPyNESimulation = __import__(netpyne_file,globals=globals()).NetPyNESimulation


    ns = NetPyNESimulation(tstop=1000, dt=0.025)

    simConfig = ns.simConfig
    fileName = ns.nml2_file_name

    from netpyne.conversion.neuromlFormat import importNeuroML2

    gids = importNeuroML2(
        fileName,
        simConfig,
        simulate=False,
        analyze=False,
    )
    from netpyne import sim
    netParams = sim.net.params

    logging.info("Finished NeuroML/LEMS import!...")

    logging.debug(
        " - simConfig (%s) with keys: \n      %s",
        type(simConfig), simConfig.todict().keys()
    )
    logging.debug(
        " - netParams (%s) with keys: \n      %s",
        type(netParams), netParams.todict().keys()
    )

    from netpyne.sim.save import saveData

    simConfig.saveJson = True

    saveData(filename="test.json", include=["simConfig", "netParams", "net"])

    return simConfig, netParams




def convertAndImportNeuroML2(nml2FileName, verbose=True):
    """Loads a NeuroML 2 file into NetPyNE
    Loads a NeuroML 2 file into NetPyNE by creating a new LEMS Simulation
    file (https://docs.neuroml.org/Userdocs/LEMSSimulation.html) and using jNeuroML
    to convert it.

    Returns:
        simConfig, netParams for the model in NetPyNE
    """
    current_path = os.getcwd()
    tmp_path = os.path.join(nml2FileName + "_files") 
    if not os.path.exists(tmp_path):
        os.makedirs(tmp_path)
    os.chdir(tmp_path)
    sys.path.append(tmp_path)
    fullNmlFileName = os.path.abspath(nml2FileName)
    if verbose:
        print(
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
        verbose=verbose,
    )
    os.chdir(tmp_path)
    res = convertAndImportLEMSSimulation(lems_file_name)
    os.chdir(current_path)
    return res


if __name__ == "__main__":

    if '-nml' in sys.argv:
        convertAndImportNeuroML2("../../NeuroML2/Spikers.net.nml")
    else:
        convertAndImportLEMSSimulation("LEMS_HHSimple.xml")
