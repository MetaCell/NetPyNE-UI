FROM metacell/jupyter-neuron:v7.8.0
USER $NB_USER

ARG branch=development 
RUN echo "$branch";

ENV INSTALATION_FOLDER=/home/jovyan/work/NetPyNE-UI
WORKDIR /home/jovyan/work

COPY --chown=1000:1000 . NetPyNE-UI
WORKDIR ${INSTALATION_FOLDER}/utilities

RUN python install.py branch $branch

WORKDIR ${INSTALATION_FOLDER}

CMD /bin/bash -c "jupyter notebook --NotebookApp.default_url=/geppetto --NotebookApp.token='' --library=netpyne_ui --NotebookApp.disable_check_xsrf=True"