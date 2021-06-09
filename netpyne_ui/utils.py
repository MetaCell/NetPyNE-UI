import os


def remove(dictionary):
    # remove reserved keys such as __dict__, __Method__, etc
    # they appear when we do sim.loadAll(json_file)
    if isinstance(dictionary, dict):
        for key, value in list(dictionary.items()):
            if key.startswith('__'):
                dictionary.pop(key)
            else:
                remove(value)


def get_next_file_name(directory: str, filename: str) -> str:
    if not os.path.exists(os.path.join(directory, filename)):
        return filename

    i = 1
    while os.path.exists(os.path.join(directory, f"{filename}-{i}")):
        i += 1

    return f"{filename}-{i}"
