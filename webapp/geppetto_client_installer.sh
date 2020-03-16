#!/bin/bash

DIRECTORY=./geppetto-client
BRANCH="development"

if [ -d "$DIRECTORY" ]; then
  pushd geppetto-client;
  git pull;
  git checkout $BRANCH
  npm install;
  npm link;
  popd;
  npm link @geppettoengine/geppetto-client;
else
  git clone https://github.com/openworm/geppetto-client
  pushd geppetto-client;
  git pull;
  git checkout $BRANCH
  npm install;
  npm link;
  popd;
  npm link @geppettoengine/geppetto-client;
fi
