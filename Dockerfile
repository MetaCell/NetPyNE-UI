FROM node:13.14 as jsbuild

WORKDIR /app

COPY --chown=1000:1000 webapp/package.json .
COPY --chown=1000:1000 webapp/yarn.lock .


RUN yarn install  --network-timeout 1000000000

COPY webapp/ .
RUN yarn build-dev


RUN mv node_modules/@metacell .
RUN rm -Rf node_modules/*
RUN mv @metacell node_modules

###
FROM jupyter/base-notebook:hub-1.5.0
ENV NB_UID=jovyan
ENV FOLDER=netpyne
ARG GEPPETTO_VERSION=development
ARG BUILD_ARGS=""
ARG NETPYNE_VERSION=master
ARG WORKSPACE_VERSION=master

ENV FOLDER=/home/jovyan/work/NetPyNE-UI

USER root

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git make libtool g++ -qq pkg-config libfreetype6-dev libpng-dev libopenmpi-dev -y
RUN conda install python=3.7 -y


WORKDIR $FOLDER
COPY --chown=1000:1000 requirements.txt requirements.txt
RUN pip install -r requirements.txt --no-cache-dir --prefer-binary

COPY --chown=$NB_UID:1000 . .
COPY --from=jsbuild --chown=$NB_UID:1000 /app webapp


RUN jupyter nbextension install --py --symlink --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix widgetsnbextension
RUN jupyter serverextension enable --py --sys-prefix jupyter_geppetto

RUN python utilities/install.py ${BUILD_ARGS} --geppetto ${GEPPETTO_VERSION} --netpyne $NETPYNE_VERSION --workspace WORKSPACE_VERSION --npm-skip

RUN jupyter labextension disable @jupyterlab/hub-extension

RUN chown  $NB_UID .
RUN chown -R $NB_UID workspace

# Temp fixes for eeg plots
RUN wget -P `pip show LFPykit | grep "Location:" | awk '{print $2"/lfpykit"}'` https://www.parralab.org/nyhead/sa_nyhead.mat
ENV NEURON_HOME=/opt/conda
USER $NB_UID

EXPOSE 8888


