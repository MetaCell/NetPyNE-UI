# k8s deployment

- Deploy on minikube runnig

```bash
kubectl create -ns netpyne
helm upgrade netpyne jupyterhub --install --reset-values --repo https://jupyterhub.github.io/helm-chart/ --version 0.9.0 --namespace netpyne --values minikube_values.yaml --force --debug
```

- Access the hub by running

```bash
minikube service list
```

and use the url corresponding to nepyne proxy-public on port 80