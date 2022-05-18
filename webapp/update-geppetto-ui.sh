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

yalc add @metacell/geppetto-meta-client
yalc add @metacell/geppetto-meta-core
yalc add @metacell/geppetto-meta-ui

yarn
