FROM frodriguez4600/jupyter-neuron:v7.8.0

ENV INSTALLATION_FOLDER=/home/jovyan/work/NetPyNE-UI
ENV NETPYNE_VERSION=development
ENV WORKSPACE_VERSION=nov2020
ENV JUPYTER_GEPPETTO_VERSION=development
ENV PYGEPPETTO_VERSION=development
ENV BUILD_ARGS=""

# Install openmpi for parallel simulations
# Important: Have to switch to root to install a package and ensure to switch back to NB user afterwards
USER root
RUN apt-get update && apt-get install -y libopenmpi-dev
USER $NB_USER

WORKDIR /home/jovyan/work
COPY --chown=1000:1000 requirements.txt ${INSTALLATION_FOLDER}/requirements.txt

WORKDIR ${INSTALLATION_FOLDER}
RUN pip install -r requirements.txt

COPY --chown=1000:1000 . .
WORKDIR ${INSTALLATION_FOLDER}/utilities

RUN python install.py ${BUILD_ARGS}

WORKDIR ${INSTALLATION_FOLDER}

CMD /bin/bash -c "jupyter notebook --NotebookApp.default_url=/geppetto --NotebookApp.token='' --library=netpyne_ui --NotebookApp.disable_check_xsrf=True"