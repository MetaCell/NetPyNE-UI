# Installation

##  .-'-.  From Scratch

### LINUX

We are asuming you started a newly installed linux distribution, so make sure your system is up to date by opening terminal and typing:

 - `sudo apt upgrade`

You will also need git, so `sudo apt install git` (checking: `git --version`).

Then, download [Conda](https://conda.io/miniconda.html) and follow the installation [guide.](https://conda.io/docs/user-guide/install/linux.html)

 (NOTE: conda is a virtual environment manager. It will handle the installation of Python dependencies and will avoid conflicts with user permissions and missing packages)

After installing `conda`, re-open terminal and login into your virtual environment by typing:

 - `conda create --name snowFlake python=2`
 - `source activate snowFlake`

Now, `NetPyNe_ui` requiers you to be able to import `neuron`, from within `Python`, so download [Neuron](https://www.neuron.yale.edu/neuron/download/getstd).

(NOTE: you will have to build `neuron`, so don't use the `.deb` version that is available there).

(NOTE: we will install a vanilla `neuron` distribution, so you won't have  the `neuron` visual interface or multiprocessing capability. If you need them, click [here](https://www.neuron.yale.edu/neuron/download/compile_linux) to find out what to do).

Next, extract the files from the `tar` downloaded and go inside the extracted folder. Build `neuron` with `Python` interpreter by typing:

- `./configure --prefix=$HOME/miniconda2/ --without-iv --without-paranrn --with-nrnpython`
- `make`
- `make install`

(NOTE: `--prefix=` is defining where we want to install `neuron`. In principle, you can install it wherever you want, but for the sake of simplicity, lets gather everything in one place).

So far, we have installed `neuron` with `python` interpreter, but what we really need it to be able to import `neuron`into `python`, so type:

- `cd src/nrnpython`
- `python setup.py install`

Now, if everything went right, you should be able to import `neuron` in a `python` script. Try runing this script from python `import neuron`. You should get a message like this one:

> NEURON -- VERSION 7.5 master (6b4c19f) 2017-09-25
Duke, Yale, and the BlueBrain Project -- Copyright 1984-2016
See http://neuron.yale.edu/neuron/credits

(NOTE: if it fails      <<it won't, but let say it does>>,      try this:
- `sudo apt install libopenmpi-dev ncurses-term libncursesw5-dev`)

Now, before starting with `NetPyNe_ui` installation, we need to install `nodejs`and `npm`. These are the framework and package manager for `javascript`, so we will need them. Download it from [here](https://nodejs.org/en/) (they come together). The files are binary, so you just have to paste them into your miniconda2 folder.

Finally, we are able to install `NetPyNe_ui`. Choose a folder, and type:

- `git clone -b development https://github.com/MetaCell/NetPyNe-UI.git`
- `cd utilities`
- `python install.py`

Take a look at the screen log, and if you don't get any issue, you are now ready to try NetPyNe_ui. (You may get some `deprecated` warnings, ignore them)

There is one last step before launching `NetPyNe`. You have to change the `geppettoConfiguration.json` file from `/webapp` folder, and set `NetPyNe_ui` as `true`, leaving everything else as `false`.

(NOTE: the path to `/webapp` is `/org.geppetto.frontend.jupyter/src/jupyter_geppetto/geppetto/src/main/webapp`)


Now, from that same folder, type:

- `npm run build-dev-noTest:watch`

And leave it open. (That will allow you to make changes to `.js` files and don't worry about re-build the files).

Finally, you can access `NetPyNe-ui`  by goint to the main folder and typing:

- `./NEURON-UI`


(NOTE: disable web-browser cache to see the changes that you make to the `.js` files. Otherwise, the web-browser will show an old copy of NetPyNe-ui)
