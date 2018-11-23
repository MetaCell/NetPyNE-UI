FROM metacell/jupyter-neuron:latest
USER $NB_USER

ARG netpyneuiBranch=development 
ENV netpyneuiBranch=${netpyneuiBranch}  
RUN echo "$netpyneuiBranch";

ARG INCUBATOR_VER=unknown
RUN /bin/bash -c "INCUBATOR_VER=${INCUBATOR_VER} source activate snakes && pip install netpyne_ui"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes &&  jupyter serverextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py widgetsnbextension"

WORKDIR /home/jovyan
RUN git clone --branch CNS18 https://github.com/Neurosim-lab/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace

# Uncomment to run travis using this Dockerfile
# Clone the source code and creates a symlink to the test folder
WORKDIR /home/jovyan/work
RUN wget https://github.com/MetaCell/NetPyNE-UI/archive/$netpyneuiBranch.zip -q
RUN unzip $netpyneuiBranch.zip 
WORKDIR /home/jovyan/netpyne_workspace
RUN ln -sfn /home/jovyan/work/NetPyNE-UI-$netpyneuiBranch/netpyne_ui/tests tests

CMD /bin/bash -c "source activate snakes && exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token='' --library=netpyne_ui"
