FROM node:18 as jsbuild

ENV FOLDER=netpyne

WORKDIR $FOLDER/webapp
COPY webapp/package.json .
COPY webapp/yarn.lock .

RUN yarn install  --network-timeout 1000000000

COPY webapp .
RUN yarn build-dev

### Download on a separate stage to run in parallel with buildkit
FROM jupyter/base-notebook:hub-1.5.0 as downloads
USER root
RUN wget --no-check-certificate -O /nyhead.mat https://www.parralab.org/nyhead/sa_nyhead.mat

###
FROM jupyter/base-notebook:hub-1.5.0
ENV NB_UID=jovyan
ENV FOLDER=netpyne
ENV NP_LFPYKIT_HEAD_FILE=/home/jovyan/nyhead.mat

USER root

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git make libtool g++ -qq pkg-config libfreetype6-dev libpng-dev libopenmpi-dev -y
RUN apt-get install openjdk-11-jre-headless -y
RUN conda install python=3.7 -y


WORKDIR $FOLDER
COPY  --chown=1000:1000 requirements.txt requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\
    pip install -r requirements.txt --prefer-binary


# ToDo: fixme, for now remove the jupyter hub config json file because it overrides the default
# and thus removes the frame ancestor cors settings
RUN rm -f ~/.jupyter/*.json
RUN chown $NB_UID .
RUN chown $NB_UID /opt
RUN rm -Rf workspace
# sym link workspace pvc to $FOLDER
RUN mkdir -p /opt/workspace
RUN mkdir -p /opt/user

COPY netpyne_ui netpyne_ui
COPY utilities utilities
COPY setup.py .
COPY tests tests
COPY NetPyNE-UI .
COPY README.rst .
COPY requirements-test.txt .


USER $NB_UID




ENV NEURON_HOME=/opt/conda


USER root

RUN jupyter nbextension install --py --symlink --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix widgetsnbextension
RUN jupyter serverextension enable --py --sys-prefix jupyter_geppetto

ARG BUILD_ARGS=""
ARG WORKSPACE_VERSION=master

RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip &&\
  python utilities/install.py ${BUILD_ARGS} --workspace $WORKSPACE_VERSION --npm-skip


RUN mv workspace /opt/workspace/tutorials
RUN chown -R $NB_UID /opt/workspace
RUN ln -s /opt/workspace workspace

RUN jupyter labextension disable @jupyterlab/hub-extension

COPY --from=downloads --chown=1000:1000 /nyhead.mat $NP_LFPYKIT_HEAD_FILE
COPY --from=jsbuild --chown=1000:1000 $FOLDER/webapp/build webapp/build

RUN chown -R $NB_UID /home/jovyan/.jupyter
RUN touch app.log && chown $NB_UID app.log
USER $NB_UID


EXPOSE 8888

ENTRYPOINT ["tini", "-g", "--"]



CMD ./NetPyNE-UI
