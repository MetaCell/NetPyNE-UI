FROM node:14.21.3-bullseye as jsbuild

WORKDIR /app

COPY --chown=1000:1000 webapp/package.json .
COPY --chown=1000:1000 webapp/yarn.lock .


RUN yarn install  --network-timeout 1000000000

COPY webapp/ .
RUN yarn build-dev


RUN rm -Rf node_modules/*

###
FROM jupyter/base-notebook:hub-1.5.0
ENV NB_UID=jovyan
ENV FOLDER=netpyne
ARG BUILD_ARGS=""
ARG WORKSPACE_VERSION=master
# ARG GEPPETTO_VERSION=development
# ARG NETPYNE_VERSION=master

ENV FOLDER=/home/jovyan/work/NetPyNE-UI

USER root

RUN rm -rf /var/lib/apt/lists
RUN apt-get update -qq &&\
    apt-get install python3-tk vim nano unzip git make libtool g++ -qq pkg-config libfreetype6-dev libpng-dev libopenmpi-dev  openjdk-11-jre-headless -y -y
RUN conda install python=3.7 -y

WORKDIR $FOLDER
COPY --chown=1000:1000 requirements.txt requirements.txt
RUN --mount=type=cache,target=/root/.cache python -m pip install --upgrade pip && pip install -r requirements.txt --prefer-binary

COPY --chown=$NB_UID:1000 . .
COPY --from=jsbuild --chown=$NB_UID:1000 /app webapp


RUN jupyter nbextension install --py --symlink --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix jupyter_geppetto
RUN jupyter nbextension enable --py --sys-prefix widgetsnbextension
RUN jupyter serverextension enable --py --sys-prefix jupyter_geppetto

RUN python utilities/install.py ${BUILD_ARGS} --workspace $WORKSPACE_VERSION

RUN jupyter labextension disable @jupyterlab/hub-extension

RUN chown  $NB_UID .
RUN chown -R $NB_UID workspace

# Temp fixes for eeg plots
ENV NEURON_HOME=/opt/conda
# For lfpykit 0.4
# RUN wget -P $(pip show LFPykit | grep "Location:" | awk '{print $2"/lfpykit"}') https://www.parralab.org/nyhead/sa_nyhead.mat
# For lpfykit 0.5

RUN wget --no-check-certificate -P ${FOLDER}/workspace https://www.parralab.org/nyhead/sa_nyhead.mat

USER $NB_UID

EXPOSE 8888


