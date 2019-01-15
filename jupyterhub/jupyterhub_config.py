## Class for authenticating users.
#  
#  This should be a class with the following form:
#  
#  - constructor takes one kwarg: `config`, the IPython config object.
#  
#  with an authenticate method that:
#  _class
#  - is a coroutine (asyncio or tornado)
#  - returns username on success, None on failure
#  - takes two arguments: (handler, data),
#    where `handler` is the calling web.RequestHandler,
#    and `data` is the POST form data from the login page.
#c.JupyterHub.authenticator_class = 'jupyterhub.auth.PAMAuthenticator'
# c.JupyterHub.authenticator_class = 'dummyauthenticator.DummyAuthenticator'
# c.DummyAuthenticator.password = "dummypassword"
c.JupyterHub.authenticator_class = 'tmpauthenticator.TmpAuthenticator'

## The class to use for spawning single-user servers.
#  
#  Should be a subclass of Spawner.
#c.JupyterHub.spawner_class = 'jupyterhub.spawner.LocalProcessSpawner'
c.JupyterHub.spawner_class = 'dockerspawner.DockerSpawner'
from jupyter_client.localinterfaces import public_ips
ip = public_ips()[0]
c.JupyterHub.hub_ip = ip
c.DockerSpawner.image = 'netpyne_ui_jupyterspawner'
c.DockerSpawner.remove_containers = True
c.DockerSpawner.remove = True
c.DockerSpawner.debug = True
c.DockerSpawner.network_name='jupyterhub_network'

## Extra arguments to be passed to the single-user server. Only works for the LocalProcessSpawner
#  
#  Some spawners allow shell-style expansion here, allowing you to use
#  environment variables here. Most, including the default, do not. Consult the
#  documentation for your spawner to verify!
# c.Spawner.args = ['--library=netpyne_ui', '--NotebookApp.default_url=/geppetto', '--NotebookApp.token=''']