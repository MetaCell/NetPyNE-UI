FROM frodriguez4600/jupyterneurontest

# Switch to non sudo, create a Python 3 virtual environment 
USER $NB_USER

ARG INCUBATOR_VER=unknown
RUN /bin/bash -c "INCUBATOR_VER=${INCUBATOR_VER} source activate snakes && pip install netpyne_ui"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes &&  jupyter serverextension enable --py jupyter_geppetto"
RUN /bin/bash -c "source activate snakes && jupyter nbextension enable --py widgetsnbextension"

WORKDIR /home/jovyan
RUN git clone --branch CNS18 https://github.com/Neurosim-lab/netpyne_workspace
WORKDIR /home/jovyan/netpyne_workspace
CMD /bin/bash -c "source activate snakes && exec jupyter notebook --debug --NotebookApp.default_url=/geppetto --NotebookApp.token=''"
