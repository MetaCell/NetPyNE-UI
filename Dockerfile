FROM frodriguez4600/jupyter-neuron:v7.8.0
USER $NB_USER

ARG branch=gui_cns
RUN echo "$branch";

ENV INSTALLATION_FOLDER=/home/jovyan/work/NetPyNE-UI
WORKDIR /home/jovyan/work
COPY --chown=1000:1000 requirements.txt ${INSTALLATION_FOLDER}/requirements.txt

WORKDIR ${INSTALLATION_FOLDER}
RUN pip install -r requirements.txt

COPY --chown=1000:1000 . .
WORKDIR ${INSTALLATION_FOLDER}/utilities

RUN python install.py branch $branch

WORKDIR ${INSTALLATION_FOLDER}

CMD /bin/bash -c "jupyter notebook --NotebookApp.default_url=/geppetto --NotebookApp.token='' --library=netpyne_ui --NotebookApp.disable_check_xsrf=True"