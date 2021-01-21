def register(metadata, net_params):
    # TODO: this needs to be moved into the metadata.py of netpyne repository.
    metadata['netParams']['children']['cellsVisualizationSpacingMultiplierX'] = {
        "label": "Cells visualization spacing multiplier X",
        "help": "Multiplier for spacing in X axis in 3d visualization of cells (default: 1)",
        "suggestions": "",
        "hintText": "",
        "type": "float"
    }
    metadata['netParams']['children']['cellsVisualizationSpacingMultiplierY'] = {
        "label": "Cells visualization spacing multiplier Y",
        "help": "Multiplier for spacing in Y axis in 3d visualization of cells (default: 1)",
        "suggestions": "",
        "hintText": "",
        "type": "float"
    }
    metadata['netParams']['children']['cellsVisualizationSpacingMultiplierZ'] = {
        "label": "Cells visualization spacing multiplier Z",
        "help": "Multiplier for spacing in Z axis in 3d visualization of cells (default: 1)",
        "suggestions": "",
        "hintText": "",
        "type": "float"
    }

    metadata['batch_config'] = {
        "label": "Batch configuration",
        "help": "",
        "suggestions": "",
        "hintText": "",
        'children': {
            'enabled': {
                "label": "Run as batch",
                "help": "Activates batch",
                "suggestions": "",
                "hintText": "",
                "type": "bool"
            },
            'name': {
                "label": "Name of the batch",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            },
            'saveFolder': {
                "label": "Save folder",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            },
            'seed': {
                "label": "Seed",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "int"
            },
            'method': {
                "label": "Method",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            }
        }
    }

    metadata["run_config"] = {
        "label": "Run configuration",
        "help": "",
        "suggestions": "",
        "hintText": "",
        'children': {
            'parallel': {
                "label": "Parallel",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "bool"
            },
            'asynchronous': {
                "label": "Run in background",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "bool"
            },
            'type': {
                "label": "Execution type",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "str"
            },
            'cores': {
                "label": "Number of cores",
                "help": "",
                "suggestions": "",
                "hintText": "",
                "type": "int"
            }
        }
    }

    net_params.cellsVisualizationSpacingMultiplierX = 1
    net_params.cellsVisualizationSpacingMultiplierY = 1
    net_params.cellsVisualizationSpacingMultiplierZ = 1
