cd ../../
docker build -t netpyne-ui .
cd tests/frontend/e2e
docker build -t netpyne-ui-e2e .
