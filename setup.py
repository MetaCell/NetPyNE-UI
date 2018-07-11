from setuptools import setup, find_packages

setup(
    name="netpyne_ui",
    version="0.4",
    url="https://github.com/MetaCell/NetPyNE-UI",
    author="MetaCell",
    author_email="info@metacell.us",
    description="NetPyNE User interface",
    license="MIT",
    long_description=open('README.rst').read(),
    packages=find_packages(),
    package_data={
        '': ['*.hoc']
    },
    scripts=['NetPyNE-UI'],
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
        'jupyter_geppetto==0.4.1.2',
        'netpyne==0.7.9'
    ],
)
