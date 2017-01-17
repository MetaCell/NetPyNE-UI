"""
GeppettoNeuronController.py
Controller for Geppetto Neuron
"""
#import logging
#from IPython.core.debugger import Tracer

def show_sample_models():
    from sample_models import SampleModels
    return SampleModels()

def show_analysis():
    from analysis import Analysis
    return Analysis()

def show_cell_builder():
    from cell_builder import CellBuilder
    return CellBuilder()

def show_point_process():
    from point_process import PointProcess
    return PointProcess()

def show_run_control():
    from run_control import RunControl
    return RunControl()

def show_neuron_menu():
    from neuron_menu import NeuronMenu
    return NeuronMenu()
