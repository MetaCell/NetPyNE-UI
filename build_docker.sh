#!/bin/bash
set -e

time DOCKER_BUILDKIT=1 docker build -t mynetpyneui -f Dockerfile .
