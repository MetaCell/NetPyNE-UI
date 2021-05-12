FROM frodriguez4600/jupyter-neuron:v7.8.0
ARG INSTALLATION_FOLDER=/home/jovyan/work/NetPyNE-UI
ARG NETPYNE_VERSION=development
ARG WORKSPACE_VERSION=nov2020
ARG JUPYTER_GEPPETTO_VERSION=development
ARG PYGEPPETTO_VERSION=development
ARG BUILD_ARGS=""

USER $NB_USER

ENV INSTALLATION_FOLDER=$INSTALLATION_FOLDER
ENV NETPYNE_VERSION=$NETPYNE_VERSION
ENV WORKSPACE_VERSION=$WORKSPACE_VERSION
ENV JUPYTER_GEPPETTO_VERSION=$JUPYTER_GEPPETTO_VERSION
ENV PYGEPPETTO_VERSION=$PYGEPPETTO_VERSION
ENV BUILD_ARGS=$BUILD_ARGS

WORKDIR /home/jovyan/work
COPY --chown=1000:1000 requirements.txt ${INSTALLATION_FOLDER}/requirements.txt

WORKDIR ${INSTALLATION_FOLDER}
RUN pip install -r requirements.txt

COPY --chown=1000:1000 . .
WORKDIR ${INSTALLATION_FOLDER}/utilities

RUN python install.py ${BUILD_ARGS}

WORKDIR ${INSTALLATION_FOLDER}

RUN pip install -r requirements-test.txt
RUN pytest tests/backend
CMD /bin/bash -c "jupyter notebook --NotebookApp.default_url=/geppetto --NotebookApp.token='' --library=netpyne_ui --NotebookApp.disable_check_xsrf=True"