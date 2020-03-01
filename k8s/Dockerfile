FROM jupyterhub/k8s-hub:0.9.0-beta.4
    
COPY --chown=1000:1000 templates/page.html /usr/local/share/jupyterhub/templates/page.html
COPY --chown=1000:1000 templates/404.html /usr/local/share/jupyterhub/templates/404.html
COPY --chown=1000:1000 templates/spawn_pending.html /usr/local/share/jupyterhub/templates/spawn_pending.html
COPY --chown=1000:1000 static/jupyter.png /usr/local/share/jupyterhub/static/images/jupyter.png
COPY --chown=1000:1000 static/jupyter.png /usr/local/share/jupyterhub/static/images/jupyterhub-80.png
COPY --chown=1000:1000 static/favicon.ico /usr/local/share/jupyterhub/static/favicon.ico
COPY --chown=1000:1000 static/favicon.ico /usr/local/share/jupyterhub/static/images/favicon.ico
COPY --chown=1000:1000 auth.py /usr/local/lib/python3.6/dist-packages/tmpauthenticator/__init__.py
COPY --chown=1000:1000 js/EventSource.js /usr/local/share/jupyterhub/static/js/EventSource.js


CMD ["jupyterhub", "--config", "/srv/jupyterhub_config.py"]