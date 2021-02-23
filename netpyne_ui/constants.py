import os

UPLOAD_FOLDER_NAME = 'uploads'
NETPYNE_WORKDIR = 'netpyne_workspace'

ALLOWED_EXTENSIONS = ["py", "zip", "gz", ".tar.gz", "pdf", "txt", "xls", "png", "jpeg", "hoc"]

UPLOAD_FOLDER_PATH = os.path.join(os.getcwd(), NETPYNE_WORKDIR, UPLOAD_FOLDER_NAME)
NETPYNE_WORKDIR_PATH = os.path.join(os.getcwd(), NETPYNE_WORKDIR)

if not os.path.exists(UPLOAD_FOLDER_PATH):
    os.makedirs(UPLOAD_FOLDER_PATH)

if not os.path.exists(NETPYNE_WORKDIR_PATH):
    os.makedirs(NETPYNE_WORKDIR_PATH)

# Number of connections above this limit are considered too many to be shown.
NUM_CONN_LIMIT = 1000
