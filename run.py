'''
Run this to debug
'''
import sys
import os
from notebook.notebookapp import main, NotebookApp
import netpyne_ui
from jupyter_geppetto import settings

settings.debug = True

if __name__ == '__main__':
    sys.argv.append('--NotebookApp.default_url=/geppetto')
    sys.argv.append("--NotebookApp.token=''")
    sys.argv.append('--library=netpyne_ui')

    app = NotebookApp.instance()
    app.initialize(sys.argv)
    app.file_to_run = ''
    sys.exit(app.start())

