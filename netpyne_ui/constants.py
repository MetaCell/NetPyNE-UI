import os

UPLOAD_FOLDER_NAME = 'uploads'
NETPYNE_WORKDIR = 'workspace'
EXPERIMENTS_FOLDER = "./experiments"
MODEL_OUTPUT_FILENAME = 'model_output'

SIMULATION_SCRIPT_NAME = "init.py"

ALLOWED_EXTENSIONS = ["py", "zip", "gz", ".tar.gz", "pdf", "txt", "xls", "png", "jpeg", "hoc"]
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
UPLOAD_FOLDER_PATH = os.path.join(ROOT, NETPYNE_WORKDIR, UPLOAD_FOLDER_NAME)
NETPYNE_WORKDIR_PATH = os.path.join(ROOT, NETPYNE_WORKDIR)

if not os.path.exists(NETPYNE_WORKDIR_PATH):
    NETPYNE_WORKDIR_PATH = os.path.join(os.getcwd(), NETPYNE_WORKDIR)

if not os.path.exists(NETPYNE_WORKDIR_PATH):
    raise Exception(f"Workdir path {NETPYNE_WORKDIR_PATH} does not exist")

if not os.path.exists(UPLOAD_FOLDER_PATH):
    os.makedirs(UPLOAD_FOLDER_PATH)

if not os.path.exists(NETPYNE_WORKDIR_PATH):
    os.makedirs(NETPYNE_WORKDIR_PATH)

# Number of connections above this limit are considered too many to be shown.
NUM_CONN_LIMIT = 1000
