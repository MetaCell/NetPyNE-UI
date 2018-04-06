FROM jupyter/base-notebook:eb70bcf1a292
USER root

ARG netpyneuiBranch=development
ENV netpyneuiBranch=${netpyneuiBranch}
RUN echo "$netpyneuiBranch";
RUN python --version

RUN apt-get -qq update

ARG NRN_VERSION="7.4"
ARG NRN_ARCH="x86_64"

RUN apt-get install -y \
        locales \
        wget \
        gcc \
        g++ \
        build-essential \
        libncurses-dev \
        python2.7 \
        libpython-dev \
        cython \
        git-core \
        unzip \
        libpng-dev \
        mlocate
USER $NB_USER
RUN conda install -c conda-forge jupyter
RUN conda install -c conda-forge widgetsnbextension=1.2.6
RUN conda list
RUN conda install -c conda-forge nbformat=4.4.0
RUN conda install -c conda-forge nbconvert=4.2.0
RUN conda install notebook
RUN pip uninstall -y  nbconvert
RUN git clone -b 4.x https://github.com/jupyter/nbconvert.git
RUN cd nbconvert && pip install -e . && pip list
RUN conda create --name snakes python=2
RUN python --version && conda info
RUN conda info --envs
RUN pip list && conda list
RUN /bin/bash -c "source activate snakes && python --version"
RUN wget http://www.neuron.yale.edu/ftp/neuron/versions/v7.4/nrn-7.4.tar.gz
RUN tar xzf nrn-7.4.tar.gz
WORKDIR nrn-7.4
RUN /bin/bash -c "source activate snakes && ./configure --prefix `pwd` --without-iv --with-nrnpython"
RUN /bin/bash -c "source activate snakes && make --silent"
RUN /bin/bash -c "source activate snakes && make --silent install"
WORKDIR src/nrnpython
ENV PATH="/home/jovyan/work/nrn-7.4/x86_64/bin:${PATH}"
RUN /bin/bash -c "source activate snakes && python setup.py install"
RUN wget https://github.com/MetaCell/NetPyNE-UI/archive/$netpyneuiBranch.zip
RUN unzip $netpyneuiBranch.zip
WORKDIR NetPyNE-UI-$netpyneuiBranch/utilities
RUN /bin/bash -c "source activate snakes && python --version"
RUN /bin/bash -c "source activate snakes && exec python install.py"
RUN cd ../netpyne_ui/tests && /bin/bash -c "source activate snakes && python -m unittest netpyne_model_interpreter_test"
RUN mkdir /home/jovyan/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace
RUN python --version
RUN conda list
RUN pip list
RUN tail -n 100 /home/jovyan/.jupyter/jupyter_notebook_config.json
RUN  /bin/bash -c "source activate snakes && exec jupyter kernelspec list "
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --port=8888 --ip 0.0.0.0 --no-browser  --debug --NotebookApp.default_url=/geppetto --NotebookApp.token='' && exec jupyter trust notebook.ipynb && exec jupyter kernelspec list "
