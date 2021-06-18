import os
import logging
import uuid
import gzip
import tarfile
import shutil
from zipfile import ZipFile
from tempfile import TemporaryDirectory
from jupyter_geppetto.webapi import get, post
from notebook.base.handlers import IPythonHandler
from netpyne_ui.constants import ALLOWED_EXTENSIONS, UPLOAD_FOLDER_PATH


def allowed_file(filename, allowed_extensions=ALLOWED_EXTENSIONS):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions


def send_files(handler, file_path, filename):
    with open(file_path, "rb") as f:
        handler.set_header('Content-Type', 'application/force-download')
        handler.set_header('Content-Disposition',
                           f"attachment; filename={filename}")

        try:
            while True:
                _buffer = f.read(4096)
                if _buffer:
                    handler.write(_buffer)
                else:
                    return
        except:
            handler.set_status(500, f"Error sending files")


def get_file_paths(handler):
    file_paths = False
    if 'uri' in handler.request.arguments:
        file_paths = []
        tmp_file_paths = [path.decode('utf-8')
                          for path in handler.request.arguments['uri']]
        for path in tmp_file_paths:
            if os.path.exists(path):
                file_paths.append(path)

    return file_paths


class NetPyNEController:  # pytest: no cover

    @post('/uploads')
    def uploads(handler: IPythonHandler):
        files = handler.request.files
        files_saved = 0

        if len(files) == 0 or 'file' not in files:
            handler.set_status(
                400, f"Can't find 'file' or filename is empty. Files received {len(files)}")
        else:

            for f in files['file']:
                if not allowed_file(f.filename):
                    logging.warn(
                        f"Can't store file {f.filename}. Extension not allowed")
                    continue

                # Save to file
                filename = f.filename
                file_path = os.path.join(UPLOAD_FOLDER_PATH, filename)

                with open(file_path, 'wb') as zf:
                    zf.write(f['body'])

                files_saved += 1

                if filename.endswith('.zip'):
                    with ZipFile(file_path) as zipObj:
                        zipObj.extractall(UPLOAD_FOLDER_PATH)

                elif filename.endswith('.tar.gz'):
                    with tarfile.open(file_path, mode='r:gz') as tar:
                        tar.extractall(UPLOAD_FOLDER_PATH)

                elif filename.endswith('.gz'):
                    with gzip.open(file_path, "rb") as gz, open(file_path.replace('.gz', ''), 'wb') as ff:
                        shutil.copyfileobj(gz, ff)

            handler.set_status(
                200, f"Number of files saved: {files_saved}. Number of files sent: {len(files['file'])}")

        handler.finish()

    @get('/downloads')
    def downloads(handler: IPythonHandler):

        file_paths = get_file_paths(handler)

        if file_paths:

            if len(file_paths) == 0:
                handler.set_status(400, f"Files not found.")
                handler.finish()
                return

            if len(file_paths) == 1:
                send_files(handler, file_paths[0],
                           file_paths[0].split('/')[-1])

            else:
                with TemporaryDirectory() as dir_path:
                    tar_gz_file_name = f'{str(uuid.uuid4())}.tar.gz'
                    tar_gz_file_path = os.path.join(dir_path, tar_gz_file_name)
                    with tarfile.open(tar_gz_file_path, mode='w:gz') as tar:
                        for file_path in file_paths:
                            tar.add(file_path, os.path.join(
                                'download', file_path.split('/')[-1]))

                    send_files(handler, tar_gz_file_path, tar_gz_file_name)

        handler.finish()


def create_notebook(filename):
    import nbformat as nbf
    from nbformat.v4.nbbase import new_notebook
    from nbformat import sign
    import codecs

    directory = os.path.dirname(filename)
    if not os.path.exists(directory):
        os.makedirs(directory)
    nb0 = new_notebook(cells=[nbf.v4.new_markdown_cell("""# Welcome to the NetPyNE-ui!
    
    """),
                              nbf.v4.new_code_cell(
                                  'netpyne_geppetto.netParams'),
                              nbf.v4.new_code_cell(
                                  'netpyne_geppetto.simConfig')
                              ], metadata={"kernelspec": {
                                  "display_name": "Python 3",
                                  "language": "python",
                                  "name": "python3"
                              }})

    f = codecs.open(filename, encoding='utf-8', mode='w')

    nbf.write(nb0, filename)
    f.close()


# TODO move to jupyter geppetto, using notebook dir path
if os.path.exists('workspace') and not os.path.exists('workspace/notebook.ipynb'):
    create_notebook('workspace/notebook.ipynb')
