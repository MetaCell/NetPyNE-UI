from setuptools import setup, find_packages

setup(
    name="neuron_ui",
    version="0.0.0.1",
    url="https://github.com/MetaCell/NEURON-UI",
    author="MetaCell",
    author_email="info@metacell.us",
    description="User interface for NEURON based on web technologies and Jupyter",
    license="MIT",
    long_description=open('README.rst').read(),
    packages=find_packages(),
    package_data={
        '': ['*.hoc']
    },
    scripts=['NEURON-UI'],
    install_requires=[
        'jupyter_geppetto>=0.3.5'
    ],
)
