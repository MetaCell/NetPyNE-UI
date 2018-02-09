FROM jupyter/base-notebook:latest
USER root
RUN apt-get -qq update
RUN apt-get -y install unzip
RUN apt-get -y install git-core
RUN apt-get -y install g++
RUN apt-get -y install libncurses5-dev libncursesw5-dev
RUN apt-get -y install make
USER jovyan
RUN wget http://www.neuron.yale.edu/ftp/neuron/versions/v7.4/nrn-7.4.tar.gz
RUN tar xzvf nrn-7.4.tar.gz
WORKDIR nrn-7.4
RUN ./configure --prefix `pwd` --without-iv --with-nrnpython
RUN make
RUN make install
WORKDIR src/nrnpython
RUN python setup.py install
RUN pip install neuron_ui
CMD exec jupyter nbextension enable --py jupyter_geppetto
CMD exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''
