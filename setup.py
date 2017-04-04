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
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Science/Research',
        'Topic :: Scientific/Engineering :: Visualization',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4'
    ],
    install_requires=[
        'jupyter_geppetto>=0.0.1'
    ],
)
