def remove(dictionary):
    # remove reserved keys such as __dict__, __Method__, etc
    # they appear when we do sim.loadAll(json_file)
    if isinstance(dictionary, dict):
        for key, value in list(dictionary.items()):
            if key.startswith('__'):
                dictionary.pop(key)
            else:
                remove(value)
