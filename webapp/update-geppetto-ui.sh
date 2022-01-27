#!/bin/sh

set -e

app=$(pwd)

cd ../src/geppetto-meta/geppetto.js/geppetto-core
yarn && yarn build:dev && yarn publish:yalc

cd $app
cd ../src/geppetto-meta/geppetto.js/geppetto-ui
yarn && yarn build:dev && yarn publish:yalc

cd $app
cd ../src/geppetto-meta/geppetto.js/geppetto-client
yarn && yarn build:dev && yarn publish:yalc

cd $app/

yarn
yarn run start
