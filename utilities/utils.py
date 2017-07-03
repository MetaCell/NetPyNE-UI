import json

# Enable the Geppetto Neuron extension
def enable_geppetto_neuron_extension():
    print("Enabling Geppetto Neuron Configuration ...")
    jsonFile = open(
        '../org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp/extensions/extensionsConfiguration.json',
        "w+")
    jsonFile.write(json.dumps({"geppetto-neuron/ComponentsInitialization": True}))
    jsonFile.close()