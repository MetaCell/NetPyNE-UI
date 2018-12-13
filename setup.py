import setuptools
import fnmatch
import os
from glob import glob

#This block copies resources to the server so we avoid jupyter nbextension install --py --sys-prefix jupyter_geppetto
data_files = []
data_files.append(('geppetto/src/main/webapp/build/', glob('src/jupyter_geppetto/geppetto/src/main/webapp/build/*.js')))
data_files.append(('geppetto/src/main/webapp/build/', glob('src/jupyter_geppetto/geppetto/src/main/webapp/build/*.vm')))
data_files.append(('geppetto/geppetto/src/main/webapp/build/', glob('src/jupyter_geppetto/geppetto/src/main/webapp/build/fonts/*')))
for root, dirnames, filenames in os.walk('src/jupyter_geppetto/geppetto/src/main/webapp/js/'):
    for filename in fnmatch.filter(filenames, '*'):
        data_files.append((root[3:], [os.path.join(root, filename)]))


setuptools.setup(
    name="netpyne_ui",
    version="0.5.2",
    url="https://github.com/MetaCell/NetPyNE-UI",
    author="MetaCell",
    author_email="info@metacell.us",
    description="NetPyNE User interface",
    license="MIT",
    long_description=open('README.rst').read(),
    data_files=data_files,
    packages=setuptools.find_packages(),
    include_package_data=True,
    scripts=['NetPyNE-UI'],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Science/Research',
        'Topic :: Scientific/Engineering :: Visualization',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.7'
    ],
    install_requires=[
        'jupyter_geppetto==0.4.2',
        'netpyne==0.9.1.1'
    ],
)
