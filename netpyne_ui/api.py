import os
import logging
import uuid
import tarfile
from tempfile import TemporaryDirectory
from zipfile import ZipFile
from jupyter_geppetto.webapi import get, post
from notebook.base.handlers import IPythonHandler

ALLOWED_EXTENSIONS = ["py", "zip", "pdf", "txt", "xls", "png", "jpeg"]

UPLOAD_FOLDER_NAME = "uploads"
UPLOAD_FOLDER_PATH = os.path.join(os.getcwd(), UPLOAD_FOLDER_NAME)

if not os.path.exists(UPLOAD_FOLDER_PATH):
    os.makedirs(UPLOAD_FOLDER_PATH)

def allowed_file(filename, allowed_extensions=ALLOWED_EXTENSIONS):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions



class NetPyNEController:  # pytest: no cover

    @post('/uploads')
    def uploads(handler: IPythonHandler):
        files = handler.request.files
        files_saved = 0
        
        if len(files) == 0 or 'file' not in files:
            handler.set_status(400, f"Can't find 'file' or filename is empty. Files received {len(files)}")
        else:

            for f in files['file']:
                if not allowed_file(f.filename):
                    logging.warn(f"Can't store file {f.filename}. Extension not allowed")
                    continue

                ## Save to file
                filename = f.filename
                file_path = os.path.join(UPLOAD_FOLDER_PATH, filename)
                
                with open(file_path, 'wb') as zf:
                    zf.write(f['body'])
                
                files_saved += 1

                if filename.endswith('.zip'):
                    with ZipFile(file_path) as zipObj:
                        zipObj.extractall(UPLOAD_FOLDER_PATH)
            
            handler.set_status(200, f"Number of files saved: {files_saved}. Number of files sent: {len(files['file'])}")

        handler.finish()
    
    @get('/downloads')
    def downloads(handler: IPythonHandler):

        if 'uri' in handler.request.arguments:
            file_paths = []
            tmp_file_paths = [path.decode('utf-8') for path in handler.request.arguments['uri']]
            for path in tmp_file_paths:
                if os.path.exists(path):
                    file_paths.append(path)
            
            if len(file_paths) == 0:
                handler.set_status(400, f"Files not found.")
                handler.finish()
                return

            with TemporaryDirectory() as dir_path:
                tar_gz_file_name = f'{str(uuid.uuid4())}.tar.gz'
                tar_gz_file_path = os.path.join(dir_path, tar_gz_file_name)
                with tarfile.open(tar_gz_file_path, mode='w:gz') as tar:
                    for file_path in file_paths:
                        tar.add(file_path, os.path.join('download',file_path.split('/')[-1]))

                handler.set_header('Content-Type', 'application/force-download')
                handler.set_header('Content-Disposition', f'attachment; filename={tar_gz_file_name}')

                with open(tar_gz_file_path, "rb") as f:
                    try:
                        while True:
                            _buffer = f.read(4096)
                            if _buffer:
                                handler.write(_buffer)
                            else:
                                f.close()
                                handler.finish()
                                return
                    except:
                        handler.set_status(500, f"Error sending files")
        
        handler.finish()