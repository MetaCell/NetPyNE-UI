import setuptools

setuptools.setup(
    name="neuron_ui",
    version="0.0.1",
    url="https://github.com/MetaCell/NEURON-UI",
    author="The Geppetto Development Team",
    author_email="info@geppetto.org",
    description="User interface for NEURON based on web technologies and Jupyter",
    license="MIT",
    long_description=open('README.rst').read(),
    packages=['neuron_ui'],
    install_requires=[
        'jupyter_geppetto>=0.3.5'
    ],
)