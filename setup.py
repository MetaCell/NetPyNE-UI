import setuptools
from setuptools.command.install import install


class CustomInstallCommand(install):

    def run(self):
        print("Installing NEURON_UI")
        raise AttributeError("POBA")
        install.run(self)
        import post_setup
        post_setup.run()

        print("NEURON_UI installed successfully")


setuptools.setup(
    name="neuron-ui",
    version="0.0.1",
    cmdclass={
        'install': CustomInstallCommand,
    },
    url="https://github.com/MetaCell/NEURON-UI",
    author="MetaCell",
    description="Experimental UI for NEURON",
    long_description=open('README.md').read(),
    include_package_data=True,
    install_requires = [
        'ipywidgets>=5.1.5',
        'jupyter>=1.0.0'
    ],
)